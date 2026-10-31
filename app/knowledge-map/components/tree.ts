import { KM_LEVELS, KmLevel, KmNode } from '../types';

/* ===== Geometry ===== */
export const NODE_W = 220;
export const NODE_H = 44;
export const ROOT_W = 240;
export const ROOT_H = 56;
const COL = NODE_W + 64;
const ROW = NODE_H + 12;

/** Branch hues — every top-level branch and its descendants share one color. */
const BRANCH_HUES = [212, 160, 28, 275, 350, 190, 320, 45, 130, 245, 10, 95];

export const ROOT_KEY = 'r';

export interface FlatNode {
  /** Path key: 'r', 'r.0', 'r.0.3' … */
  key: string;
  /** Stable id built from titles, used to persist "learned" marks. */
  id: string;
  node: KmNode;
  depth: number;
  parentKey: string | null;
  childKeys: string[];
  /** Hue of the top-level branch (root uses the accent color instead). */
  hue: number;
  /** 1 = right of root, -1 = left of root, 0 = root. */
  side: 1 | -1 | 0;
  /** Lower-cased text of every field, for search. */
  searchText: string;
}

export interface FlatTree {
  map: Map<string, FlatNode>;
  /** Depth-first order = the learning path. */
  order: string[];
}

const stripTags = (html: string) => html.replace(/<[^>]*>/g, ' ');

export const levelIndex = (level: KmLevel) => KM_LEVELS.indexOf(level);

export function flattenTree(root: KmNode): FlatTree {
  const map = new Map<string, FlatNode>();
  const order: string[] = [];
  const branchCount = root.children?.length ?? 0;
  const rightCount = Math.ceil(branchCount / 2);

  const visit = (
    node: KmNode,
    key: string,
    id: string,
    depth: number,
    parentKey: string | null,
    hue: number,
    side: 1 | -1 | 0,
  ) => {
    const childKeys = (node.children ?? []).map((_, i) => `${key}.${i}`);
    map.set(key, {
      key,
      id,
      node,
      depth,
      parentKey,
      childKeys,
      hue,
      side,
      searchText: [
        node.title,
        node.summary,
        node.simple,
        ...(node.points ?? []),
        node.detail,
        node.tip,
      ]
        .filter(Boolean)
        .map((t) => stripTags(t as string).toLowerCase())
        .join('\n'),
    });
    order.push(key);
    node.children?.forEach((child, i) => {
      const childHue = depth === 0 ? BRANCH_HUES[i % BRANCH_HUES.length] : hue;
      const childSide = depth === 0 ? (i < rightCount ? 1 : -1) : side;
      visit(child, childKeys[i], `${id}/${child.title}`, depth + 1, key, childHue, childSide);
    });
  };

  visit(root, ROOT_KEY, root.title, 0, null, 0, 0);
  return { map, order };
}

export function ancestorsOf(tree: FlatTree, key: string): string[] {
  const result: string[] = [];
  let cur = tree.map.get(key)?.parentKey ?? null;
  while (cur) {
    result.unshift(cur);
    cur = tree.map.get(cur)?.parentKey ?? null;
  }
  return result;
}

/* ===== Layout ===== */
export interface PlacedNode {
  key: string;
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Layout {
  nodes: PlacedNode[];
  byKey: Map<string, PlacedNode>;
  bounds: { minX: number; maxX: number; minY: number; maxY: number };
}

/**
 * Two-sided horizontal mind-map layout centred on the root at (0, 0).
 * Right-side branches read top → bottom, left-side branches bottom → top,
 * so following the branches clockwise follows the learning path.
 */
export function computeLayout(tree: FlatTree, expanded: Set<string>): Layout {
  const heights = new Map<string, number>();
  const measure = (key: string): number => {
    const cached = heights.get(key);
    if (cached !== undefined) return cached;
    const fn = tree.map.get(key)!;
    let h = ROW;
    if (expanded.has(key) && fn.childKeys.length) {
      h = fn.childKeys.reduce((sum, c) => sum + measure(c), 0);
    }
    heights.set(key, h);
    return h;
  };

  const nodes: PlacedNode[] = [];
  const place = (key: string, top: number, depth: number, side: 1 | -1) => {
    const fn = tree.map.get(key)!;
    const h = measure(key);
    nodes.push({ key, x: side * depth * COL, y: top + h / 2, w: NODE_W, h: NODE_H });
    if (expanded.has(key)) {
      let childTop = top;
      for (const c of fn.childKeys) {
        place(c, childTop, depth + 1, side);
        childTop += measure(c);
      }
    }
  };

  nodes.push({ key: ROOT_KEY, x: 0, y: 0, w: ROOT_W, h: ROOT_H });
  if (expanded.has(ROOT_KEY)) {
    const branches = tree.map.get(ROOT_KEY)!.childKeys;
    const right = branches.filter((k) => tree.map.get(k)!.side === 1);
    const left = branches.filter((k) => tree.map.get(k)!.side === -1).reverse();
    for (const [list, side] of [
      [right, 1],
      [left, -1],
    ] as const) {
      const total = list.reduce((sum, k) => sum + measure(k), 0);
      let top = -total / 2;
      for (const k of list) {
        place(k, top, 1, side);
        top += measure(k);
      }
    }
  }

  const byKey = new Map(nodes.map((n) => [n.key, n]));
  const bounds = nodes.reduce(
    (b, n) => ({
      minX: Math.min(b.minX, n.x - n.w / 2),
      maxX: Math.max(b.maxX, n.x + n.w / 2),
      minY: Math.min(b.minY, n.y - n.h / 2),
      maxY: Math.max(b.maxY, n.y + n.h / 2),
    }),
    { minX: Infinity, maxX: -Infinity, minY: Infinity, maxY: -Infinity },
  );
  return { nodes, byKey, bounds };
}

/** Cubic connector from the parent's outer edge to the child's inner edge. */
export function edgePath(parent: PlacedNode, child: PlacedNode, side: 1 | -1): string {
  const x1 = parent.x + (side * parent.w) / 2;
  const x2 = child.x - (side * child.w) / 2;
  const mx = (x1 + x2) / 2;
  return `M ${x1} ${parent.y} C ${mx} ${parent.y}, ${mx} ${child.y}, ${x2} ${child.y}`;
}
