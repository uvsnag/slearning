/**
 * "Format code" backends for the Code Studio playground.
 *
 * - JavaScript is formatted with Prettier's standalone browser build,
 *   dynamically imported so it never weighs down the initial bundle.
 * - Java has no browser-ready formatter at a reasonable bundle cost, so a
 *   small built-in re-indenter normalizes leading whitespace from the
 *   brace/bracket/paren nesting (4-space indent, switch-case aware). It only
 *   re-indents lines — it never re-wraps or rewrites the code itself.
 */

/** Format `code`. Throws an Error with a readable message on syntax errors. */
export async function formatCode(
  language: 'java' | 'javascript',
  code: string,
): Promise<string> {
  return language === 'javascript' ? formatJavaScript(code) : formatJava(code);
}

async function formatJavaScript(code: string): Promise<string> {
  const [prettier, babelPlugin, estreePlugin] = await Promise.all([
    import('prettier/standalone'),
    import('prettier/plugins/babel'),
    import('prettier/plugins/estree'),
  ]);
  return prettier.format(code, {
    parser: 'babel',
    // The estree plugin ships without Plugin-shaped typings (upstream quirk) — cast it.
    plugins: [babelPlugin, estreePlugin as unknown as import('prettier').Plugin],
    // Match the playground editor's Tab key (2 spaces) and the samples' style.
    tabWidth: 2,
    printWidth: 100,
    singleQuote: true,
  });
}

/* ------------------------------------------------------------------ */
/* Java re-indenter                                                    */
/* ------------------------------------------------------------------ */

const JAVA_INDENT = '    ';

/** Carries lexer state across lines (only these two constructs span lines). */
interface ScanState {
  inBlockComment: boolean;
  inTextBlock: boolean;
}

/**
 * Walk one line, skipping comments and string/char/text-block literals, and
 * return the net change in `{[(`-nesting depth. Mutates `state` for
 * constructs that continue onto the next line.
 */
function scanNesting(line: string, state: ScanState): number {
  let net = 0;
  let i = 0;
  while (i < line.length) {
    if (state.inBlockComment) {
      const end = line.indexOf('*/', i);
      if (end === -1) return net;
      state.inBlockComment = false;
      i = end + 2;
      continue;
    }
    if (state.inTextBlock) {
      const end = line.indexOf('"""', i);
      if (end === -1) return net;
      state.inTextBlock = false;
      i = end + 3;
      continue;
    }
    const ch = line[i];
    const next = line[i + 1];
    if (ch === '/' && next === '/') return net; // line comment
    if (ch === '/' && next === '*') {
      state.inBlockComment = true;
      i += 2;
      continue;
    }
    if (ch === '"' && next === '"' && line[i + 2] === '"') {
      state.inTextBlock = true;
      i += 3;
      continue;
    }
    if (ch === '"' || ch === "'") {
      i++;
      while (i < line.length && line[i] !== ch) i += line[i] === '\\' ? 2 : 1;
      i++;
      continue;
    }
    if (ch === '{' || ch === '(' || ch === '[') net++;
    else if (ch === '}' || ch === ')' || ch === ']') net--;
    i++;
  }
  return net;
}

/** Closing delimiters at the start of the line dedent the line itself. */
function leadingCloses(trimmed: string): number {
  let count = 0;
  for (const ch of trimmed) {
    if (ch === '}' || ch === ')' || ch === ']') count++;
    else if (!/\s/.test(ch)) break;
  }
  return count;
}

/** Old-style `case X:` / `default:` labels (arrow cases indent like code). */
function isCaseLabel(trimmed: string): boolean {
  return /^(case\s|default\s*:)/.test(trimmed) && !trimmed.includes('->');
}

export function formatJava(code: string): string {
  const state: ScanState = { inBlockComment: false, inTextBlock: false };
  const out: string[] = [];
  let depth = 0;
  /** Nesting depths that carry an active `case:` label (one extra indent). */
  const caseDepths: number[] = [];
  let pendingBlank = false;

  for (const raw of code.split('\n')) {
    if (state.inTextBlock) {
      // Text-block content is significant — leave the line untouched.
      out.push(raw.replace(/\s+$/, ''));
      depth = Math.max(0, depth + scanNesting(raw, state));
      continue;
    }

    const trimmed = raw.trim();
    if (trimmed === '') {
      pendingBlank = out.length > 0; // collapse runs, drop leading blanks
      continue;
    }
    if (pendingBlank) {
      out.push('');
      pendingBlank = false;
    }

    if (state.inBlockComment) {
      const extra = caseDepths.filter((d) => depth >= d).length;
      const body = trimmed.startsWith('*') ? ' ' + trimmed : trimmed;
      out.push(JAVA_INDENT.repeat(depth + extra) + body);
      depth = Math.max(0, depth + scanNesting(trimmed, state));
      continue;
    }

    const lineDepth = Math.max(0, depth - leadingCloses(trimmed));
    while (caseDepths.length > 0 && caseDepths[caseDepths.length - 1] > lineDepth) {
      caseDepths.pop();
    }

    let indent: number;
    if (isCaseLabel(trimmed)) {
      if (caseDepths[caseDepths.length - 1] !== lineDepth) caseDepths.push(lineDepth);
      indent = lineDepth + caseDepths.filter((d) => d < lineDepth).length;
    } else {
      indent = lineDepth + caseDepths.filter((d) => d <= lineDepth).length;
    }

    out.push(JAVA_INDENT.repeat(indent) + trimmed);
    depth = Math.max(0, depth + scanNesting(trimmed, state));
  }

  return out.join('\n') + '\n';
}
