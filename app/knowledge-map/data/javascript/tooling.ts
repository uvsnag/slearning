import type { KmNode } from '../../types';

export const modulesTooling: KmNode = {
  title: 'Modules & Tooling',
  level: 'intermediate',
  summary:
    'Splitting code into modules, and the tools around real projects: npm, bundlers, linters, TypeScript, tests.',
  simple:
    'Modules are the rooms of your house; tooling is the builders, inspectors and delivery trucks that turn your plans into a real building.',
  points: [
    'ES modules (import/export) are the standard today, in browsers and Node.',
    'You rarely ship your source as-is: tools check, transform and bundle it.',
    'A good setup: npm + Vite (or a framework CLI) + ESLint + Prettier + TypeScript + Vitest.',
  ],
  children: [
    {
      title: 'ES Modules',
      level: 'beginner',
      summary:
        'The standard module system (ES2015): each file has its own scope and shares code with export/import.',
      simple:
        'Each file is a shop with a shop window. Only what you put in the window (export) can be bought (import) by other files.',
      points: [
        'Named exports: <code>export const sum = ...</code> → <code>import { sum } from "./math.js"</code>.',
        'Default export: <code>export default App</code> → <code>import App from "./App.js"</code>.',
        'Imports are live, read-only bindings, resolved before the code runs (static).',
        'Modules run once, in strict mode, even if imported many times.',
        'Browser: <code>&lt;script type="module"&gt;</code>; Node: <code>.mjs</code> or <code>"type": "module"</code>.',
      ],
      tip: 'Prefer named exports: renames are safer and editors auto-import them better.',
    },
    {
      title: 'CommonJS vs ESM',
      level: 'intermediate',
      summary:
        'CommonJS (require) is Node’s older system; ESM (import) is the standard. They differ in timing and syntax.',
      points: [
        'CJS: <code>const fs = require("fs")</code>, <code>module.exports = ...</code>; loads synchronously at run time.',
        'ESM: static <code>import</code>, async loading, top-level await, tree-shakable.',
        'ESM can import CJS; recent Node (22.12+, 20.19+) can also <code>require()</code> ESM without await.',
        'ESM has no <code>__dirname</code>; use <code>import.meta.dirname</code> (Node 20.11+) or <code>import.meta.url</code>.',
        'New packages should ship ESM; many still publish both.',
      ],
    },
    {
      title: 'Dynamic import',
      level: 'intermediate',
      summary: 'import() loads a module at run time and returns a promise (ES2020).',
      points: [
        'Load heavy code only when needed: charts, editors, admin pages.',
        'Bundlers split it into a separate file (code splitting).',
        'Works in CommonJS too, as a way to load ESM.',
      ],
      detail: `<pre><code>button.addEventListener("click", async () =&gt; {
  const { openEditor } = await import("./editor.js");
  openEditor();
});</code></pre>`,
    },
    {
      title: 'npm & package.json',
      level: 'beginner',
      summary:
        'npm installs libraries and runs scripts; package.json lists them and the project settings.',
      simple:
        'package.json is your shopping list; npm is the delivery service; the lock file is the receipt with exact versions.',
      points: [
        '<code>dependencies</code> for runtime, <code>devDependencies</code> for tools.',
        'Version ranges: <code>^1.2.3</code> allows 1.x updates; the lock file pins exact versions.',
        'Commit the lock file; use <code>npm ci</code> in CI for clean, exact installs.',
        '<code>"scripts"</code>: <code>npm run build</code>, <code>npm test</code>.',
        'Alternatives: pnpm (fast, saves disk), Yarn, Bun.',
      ],
      tip: 'Every dependency is code you trust. Check popularity, maintenance and size before adding one.',
    },
    {
      title: 'Bundlers & Build',
      level: 'intermediate',
      summary:
        'Tools that combine and optimize your modules for the browser: Vite, webpack, esbuild, Rollup.',
      points: [
        'Bundling: many files → a few optimized files.',
        'Tree shaking: drops exports that are never imported (needs ESM).',
        'Minify, code split, add hashes to file names for caching.',
        'Vite: very fast dev server using native ESM; the common default today.',
        'Transpiling (Babel, SWC, esbuild) turns new syntax into older JS when needed.',
      ],
    },
    {
      title: 'Linters & Formatters',
      level: 'beginner',
      summary:
        'ESLint finds bugs and bad patterns; Prettier formats the code the same way for everyone.',
      points: [
        'ESLint catches unused variables, missing awaits, == instead of ===…',
        'Prettier ends style debates: it reformats on save.',
        'Run both in the editor and in CI so problems never reach the main branch.',
        'ESLint 9 uses the "flat" config file <code>eslint.config.js</code>.',
      ],
    },
    {
      title: 'TypeScript in Brief',
      level: 'intermediate',
      summary: 'A superset of JavaScript that adds static types, checked before your code runs.',
      simple:
        'TypeScript is a spell checker for your code: it underlines mistakes while you type, then disappears when the code runs.',
      points: [
        'Types are removed at build time; at run time it is plain JavaScript.',
        'Catches typos, wrong arguments and null mistakes early; great editor autocomplete.',
        'Types do not check data from outside (APIs, forms); validate it with a library like Zod.',
        'Recent Node versions (22.18+, 23.6+) can run .ts files directly by stripping the types.',
        'You can start slowly: JSDoc comments plus <code>// @ts-check</code> in .js files.',
      ],
    },
    {
      title: 'Testing Basics',
      level: 'intermediate',
      summary:
        'Automated tests that check your code still works: unit, integration and end-to-end.',
      simple:
        'Tests are a checklist a robot runs every time you change something, so you do not have to click through everything by hand.',
      points: [
        'Unit tests: one function or component; fast. Tools: Vitest, Jest, <code>node:test</code>.',
        'Integration tests: several parts together (API + DB).',
        'End-to-end: a real browser clicks through the app (Playwright, Cypress).',
        'Pattern: Arrange → Act → Assert. Test behavior, not internals.',
        'Mock only the edges (network, time), not your own logic.',
      ],
      detail: `<pre><code>import { describe, it, expect } from "vitest";
import { sum } from "./math.js";

describe("sum", () =&gt; {
  it("adds numbers", () =&gt; {
    expect(sum(2, 3)).toBe(5);
  });
});</code></pre>`,
    },
  ],
};
