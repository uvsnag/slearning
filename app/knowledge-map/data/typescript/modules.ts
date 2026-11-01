import type { KmNode } from '../../types';

export const modules: KmNode = {
  title: 'Modules & Declarations',
  level: 'intermediate',
  summary: 'How files import each other, how TS finds them, and how .d.ts files type plain JavaScript.',
  simple:
    'Modules are rooms in a house with doors between them. Declaration files are the floor plans for rooms built by someone else.',
  points: [
    'Every file with import/export is its own module with its own scope.',
    'Module resolution decides which file an import path points to.',
    'Declaration files (.d.ts) give types to JavaScript libraries.',
  ],
  children: [
    {
      title: 'ES Modules',
      level: 'beginner',
      summary: 'Share code between files with export and import, the standard JavaScript way.',
      simple:
        'Export is putting something on the shared shelf. Import is taking it from the shelf in another room.',
      points: [
        'Named: <code>export function add() {}</code> and <code>import { add } from \'./math\'</code>.',
        'Default: <code>export default App</code>, imported with any name.',
        'You can export types and interfaces just like values.',
        'A file with no import/export is a global script; its names leak everywhere.',
      ],
      tip: 'Prefer named exports: renames are safer and autocomplete works better.',
    },
    {
      title: 'DefinitelyTyped (@types)',
      level: 'beginner',
      summary: 'A community repository of types for JavaScript libraries that do not ship their own.',
      simple:
        'Like fan-made subtitles for a movie: the movie did not come with them, so the community wrote them.',
      points: [
        'Install with <code>npm i -D @types/lodash</code>; TS picks them up automatically.',
        'Node types: <code>@types/node</code>.',
        'Many modern libraries bundle their own types; no @types needed.',
        'Versions should roughly match the library version.',
      ],
    },
    {
      title: 'Type-Only Imports',
      level: 'intermediate',
      summary: 'import type brings in only types, so the import is fully removed from the output JS.',
      simple:
        'Like borrowing only the blueprint of a chair, not the chair itself. Nothing needs to be carried at runtime.',
      points: [
        '<code>import type { User } from \'./user\'</code> is always erased.',
        'Inline form: <code>import { type User, save } from \'./user\'</code>.',
        'Avoids loading modules just for types and some circular-import bugs.',
        '<code>verbatimModuleSyntax</code> (TS 5.0) makes you mark type imports explicitly.',
        'Required by single-file tools like esbuild, SWC and Node type stripping.',
      ],
    },
    {
      title: 'Declaration Files (.d.ts)',
      level: 'intermediate',
      summary: 'Files that contain only types, describing JavaScript code that lives elsewhere.',
      simple:
        'A .d.ts file is a menu without a kitchen. It tells you what dishes exist and what is in them, but cooks nothing.',
      points: [
        'No runtime code, only type declarations.',
        'Libraries ship them next to their JS; <code>"types"</code> in package.json points to them.',
        '<code>declaration: true</code> makes tsc generate .d.ts for your own library.',
        '<code>skipLibCheck: true</code> skips checking them to speed up builds.',
      ],
    },
    {
      title: 'Module Resolution',
      level: 'advanced',
      summary: 'The rules TS uses to turn an import path into a real file on disk.',
      points: [
        '<code>moduleResolution: "bundler"</code> (TS 5.0) for Vite, webpack, Next.js apps.',
        '<code>"node16"</code> / <code>"nodenext"</code> follow real Node ESM and CommonJS rules.',
        'In Node ESM you must write the extension: <code>import \'./util.js\'</code>, even for a .ts file.',
        'Respects <code>package.json</code> <code>"exports"</code> and <code>"type": "module"</code>.',
        '<code>paths</code> creates aliases like <code>@/lib</code>; your bundler must know them too.',
      ],
      tip: 'Mismatched module/moduleResolution settings cause most "cannot find module" errors. Match them to your runtime.',
    },
    {
      title: 'Ambient Declarations',
      level: 'advanced',
      summary: 'declare tells TS that something exists at runtime without providing it.',
      points: [
        '<code>declare const API_URL: string;</code> for globals injected by a build tool.',
        '<code>declare module \'*.svg\'</code> types non-JS imports like images or CSS.',
        '<code>declare global { interface Window { ... } }</code> adds to global types.',
        'A wrong declaration lies to the compiler; nothing checks it at runtime.',
      ],
      detail: `<pre><code>// globals.d.ts
declare module '*.png' {
  const src: string;
  export default src;
}

declare global {
  interface Window { analytics: { track(e: string): void } }
}
export {};</code></pre>`,
    },
    {
      title: 'Declaration Merging',
      level: 'advanced',
      summary: 'Same-named interfaces, namespaces and modules combine into one declaration.',
      points: [
        'Two <code>interface User</code> declarations merge their fields.',
        'Module augmentation: <code>declare module \'express\'</code> adds fields to a library type.',
        'Common use: adding <code>user</code> to Express <code>Request</code>.',
        'Type aliases never merge; a duplicate is an error.',
      ],
    },
    {
      title: 'Namespaces',
      level: 'advanced',
      summary: 'An older TS-only way to group code under a name, from before ES modules.',
      points: [
        '<code>namespace Utils { export function x() {} }</code> creates a runtime object.',
        'Prefer ES modules for new code.',
        'Still seen in old code and in some .d.ts files for global libraries.',
        'Value namespaces are not erasable, so Node type stripping rejects them.',
      ],
    },
  ],
};
