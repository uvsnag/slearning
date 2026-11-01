import type { KmNode } from '../../types';

export const internals: KmNode = {
  title: 'Type System Internals',
  level: 'advanced',
  summary: 'How the checker really decides what is assignable, where the type system is unsound, and how tsc works.',
  simple:
    'Now you open the hood: how the engine compares types, where it takes shortcuts, and how to keep it fast.',
  points: [
    'Assignability rules explain almost every confusing error message.',
    'TypeScript is deliberately unsound in a few places, for convenience.',
    'Big projects need attention to compiler performance.',
  ],
  children: [
    {
      title: 'Assignability',
      level: 'advanced',
      summary: 'The rule for "can a value of type A go where B is expected": A must have everything B needs.',
      points: [
        'Think in sets: <code>\'a\'</code> is a subset of <code>string</code>, which is a subset of <code>unknown</code>.',
        '<code>never</code> is the empty set (fits everywhere); <code>unknown</code> is the full set (accepts everything).',
        '<code>any</code> breaks the rules: assignable to and from almost everything.',
        'Object A fits B if A has all of B’s required properties with compatible types.',
      ],
    },
    {
      title: 'Widening & Literal Types',
      level: 'advanced',
      summary: 'When TS keeps an exact literal type and when it widens it to the general type.',
      points: [
        '<code>const x = \'a\'</code> stays <code>\'a\'</code>; <code>let x = \'a\'</code> widens to <code>string</code>.',
        'Object fields widen: <code>{ kind: \'circle\' }</code> becomes <code>{ kind: string }</code>.',
        'That is why discriminated objects sometimes fail to match; fix with <code>as const</code> or an annotation.',
        'Contextual types (an expected type) prevent widening.',
      ],
    },
    {
      title: 'Variance',
      level: 'expert',
      summary: 'How assignability of a generic type follows its type parameter: same direction, opposite, or both.',
      points: [
        'Covariant (outputs): <code>Box&lt;Cat&gt;</code> fits <code>Box&lt;Animal&gt;</code>.',
        'Contravariant (inputs): a handler of <code>Animal</code> fits where a <code>Cat</code> handler is needed.',
        'Arrays are treated covariantly, which is unsound for writes.',
        'TS 4.7 added optional <code>in</code> / <code>out</code> annotations on type parameters.',
        'Method syntax params are checked bivariantly even with <code>strictFunctionTypes</code>.',
      ],
      detail: `<pre><code>interface Producer&lt;out T&gt; { get(): T }
interface Consumer&lt;in T&gt; { accept(v: T): void }</code></pre>`,
    },
    {
      title: 'Soundness Holes',
      level: 'expert',
      summary: 'Places where the type system knowingly allows code that can fail at runtime.',
      points: [
        '<code>any</code>, <code>as</code> casts and <code>!</code> skip checks.',
        'Array index reads assume the element exists (unless <code>noUncheckedIndexedAccess</code>).',
        'Covariant arrays: a <code>Cat[]</code> passed as <code>Animal[]</code> can receive a Dog.',
        'Method parameter bivariance and narrowing lost in callbacks.',
        'Trade-off chosen on purpose: practical JS patterns over perfect safety.',
      ],
      tip: 'Interview answer: "TypeScript is intentionally unsound; it aims to catch most bugs without blocking common JS patterns."',
    },
    {
      title: 'How tsc Works',
      level: 'expert',
      summary: 'The compiler pipeline: scanner, parser, binder, checker and emitter.',
      points: [
        'Scanner splits text into tokens; parser builds the syntax tree (AST).',
        'Binder connects names to declarations (symbols) and builds the control flow graph.',
        'Checker computes and compares types; it is by far the largest and slowest part.',
        'Emitter writes .js, .d.ts and source maps.',
        'Editors talk to <code>tsserver</code>, which reuses the same checker for autocomplete.',
      ],
    },
    {
      title: 'Compiler Performance',
      level: 'expert',
      summary: 'Find and fix slow type checking in large codebases.',
      points: [
        '<code>tsc --extendedDiagnostics</code> shows time spent in each phase and type counts.',
        '<code>tsc --generateTrace out</code> creates a trace you can inspect for slow types.',
        'Prefer interfaces with <code>extends</code> over big intersections; they are cached better.',
        'Add return type annotations on exported functions to avoid huge inferred types.',
        'Use <code>skipLibCheck</code>, <code>incremental</code> and project references.',
      ],
    },
    {
      title: 'TypeScript 7 (Native)',
      level: 'expert',
      summary: 'Microsoft is porting the compiler to Go for roughly 10x faster builds and editor responses.',
      points: [
        'Announced in March 2025 (project "Corsa"); try it with <code>tsgo</code> from <code>@typescript/native-preview</code>.',
        'Same type-checking rules; the goal is the same errors, just much faster.',
        'TS 6.0 (2026) is the last JavaScript-based version: a bridge that deprecates old options ahead of 7.0.',
        'Plugins and tools using the old JS compiler API will need new integrations.',
      ],
      tip: 'Clean up deprecated tsconfig options (like old moduleResolution "node") early to make the upgrade easy.',
    },
  ],
};
