import type { KmNode } from '../../types';

export const tooling: KmNode = {
  title: 'Config & Tooling',
  level: 'intermediate',
  summary: 'Compiler flags that matter, how to run TS code, and the tools around it.',
  simple:
    'TypeScript is the engine; tooling is the rest of the car. Strict flags are the seat belts, bundlers and runners are the wheels.',
  points: [
    'Strict settings decide how much the compiler protects you.',
    'Many tools strip types without checking them; tsc is still the type checker.',
    'Know your target runtime (browser, Node, bundler) and configure for it.',
  ],
  children: [
    {
      title: 'strict Mode',
      level: 'beginner',
      summary: 'One switch that turns on the whole family of important safety checks.',
      simple:
        'strict is the "safe mode" button. Without it, TypeScript lets many mistakes slide.',
      points: [
        'Includes <code>strictNullChecks</code>: null and undefined must be handled.',
        'Includes <code>noImplicitAny</code>: no silent <code>any</code> on untyped parameters.',
        'Also <code>strictFunctionTypes</code>, <code>strictPropertyInitialization</code>, <code>useUnknownInCatchVariables</code> and more.',
        'New TS versions may add flags to <code>strict</code>, so upgrades can show new errors.',
      ],
      tip: 'Start every new project with strict: true. Turning it on later in a big codebase is painful.',
    },
    {
      title: 'Running TypeScript',
      level: 'beginner',
      summary: 'Ways to run .ts files: compile with tsc, use a runner like tsx, or let Node strip types.',
      simple:
        'You can translate the whole book first (tsc), or use a live interpreter who translates as you read (tsx, Node).',
      points: [
        'Classic: <code>tsc</code> to <code>dist/</code>, then <code>node dist/index.js</code>.',
        'Dev runners: <code>tsx</code> or <code>ts-node</code> run .ts files directly.',
        'Node 22.6+ can strip types itself; on by default since Node 23.6 and 22.18.',
        'Node only erases types: no enums, parameter properties or value namespaces, and no type checking.',
        'Deno and Bun run TypeScript out of the box.',
      ],
      tip: 'Runners do not type-check. Still run "tsc --noEmit" in CI.',
    },
    {
      title: 'Extra Safety Flags',
      level: 'intermediate',
      summary: 'Useful checks that are not part of strict, so you must turn them on yourself.',
      simple:
        'These are the extra locks on top of the seat belt: optional, but they catch sneaky bugs.',
      points: [
        '<code>noUncheckedIndexedAccess</code> (4.1): <code>arr[i]</code> becomes <code>T | undefined</code>.',
        '<code>exactOptionalPropertyTypes</code> (4.4): <code>x?: string</code> no longer accepts explicit <code>undefined</code>.',
        '<code>noImplicitOverride</code>, <code>noFallthroughCasesInSwitch</code>, <code>noImplicitReturns</code>.',
        '<code>noUnusedLocals</code> / <code>noUnusedParameters</code> (often left to the linter).',
      ],
    },
    {
      title: 'target, lib & module',
      level: 'intermediate',
      summary: 'target sets the output JS version, lib sets which built-in APIs exist, module sets the import style.',
      simple:
        'target is which language your audience speaks. lib is which tools you say are in their kitchen.',
      points: [
        '<code>target: "ES2022"</code> keeps modern syntax; older targets rewrite it.',
        'TS only rewrites syntax; it does not add polyfills for missing APIs.',
        '<code>lib: ["ES2023", "DOM"]</code> decides which globals TS knows about.',
        '<code>module</code>: <code>"NodeNext"</code> for Node, <code>"ESNext"</code> or <code>"Preserve"</code> (5.4) for bundlers.',
      ],
    },
    {
      title: 'Linting with typescript-eslint',
      level: 'intermediate',
      summary: 'ESLint plus typescript-eslint catches bad patterns that the compiler allows.',
      simple:
        'The compiler checks that the grammar is right. The linter checks that your sentence is not a bad idea.',
      points: [
        'Flags things like unused vars, <code>any</code>, and floating (un-awaited) promises.',
        'Type-aware rules (e.g. <code>no-floating-promises</code>) need your tsconfig and are slower.',
        'Use <code>strictTypeChecked</code> configs for strong defaults.',
        'Let Prettier or a formatter handle style, not the linter.',
      ],
    },
    {
      title: 'JSX & TSX',
      level: 'intermediate',
      summary: 'Write JSX in .tsx files and TypeScript checks your component props.',
      simple:
        'Props types are the instruction label on a toy: which batteries go in. Put in the wrong ones and TS tells you.',
      points: [
        'JSX only works in <code>.tsx</code> files.',
        '<code>jsx: "react-jsx"</code> uses the modern automatic runtime (no React import needed).',
        'Type props with an interface or type: <code>function Button(props: ButtonProps)</code>.',
        'In .tsx, write generics as <code>&lt;T,&gt;</code> in arrow functions to avoid JSX confusion.',
      ],
      detail: `<pre><code>type ButtonProps = {
  label: string;
  onClick: () =&gt; void;
  variant?: 'primary' | 'ghost';
};

export function Button({ label, onClick, variant = 'primary' }: ButtonProps) {
  return &lt;button className={variant} onClick={onClick}&gt;{label}&lt;/button&gt;;
}</code></pre>`,
    },
    {
      title: 'Bundlers & isolatedModules',
      level: 'advanced',
      summary: 'Fast tools like esbuild, SWC and Vite compile each file alone and skip type checking.',
      points: [
        'They are 10–100x faster than tsc because they only remove types.',
        '<code>isolatedModules: true</code> warns about code that one-file-at-a-time tools cannot handle.',
        'Problem cases: re-exporting types without <code>export type</code>, <code>const enum</code> across files.',
        '<code>erasableSyntaxOnly</code> (TS 5.8) bans syntax that is not just erasable types.',
        'Typical setup: bundler builds, <code>tsc --noEmit</code> checks.',
      ],
    },
    {
      title: 'Project References',
      level: 'expert',
      summary: 'Split a big codebase into smaller TS projects that build separately and incrementally.',
      points: [
        'Each sub-project needs <code>composite: true</code>; the root lists them in <code>references</code>.',
        '<code>tsc --build</code> (<code>tsc -b</code>) builds only what changed, in dependency order.',
        '<code>incremental: true</code> caches results in a <code>.tsbuildinfo</code> file.',
        'Common in monorepos; enforces clean boundaries between packages.',
      ],
    },
  ],
};
