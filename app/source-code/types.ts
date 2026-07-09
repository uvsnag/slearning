/**
 * Shared data model for the Code Studio simulation (VS Code + database IDE).
 *
 * A demo project is pure data: a virtual file tree plus optional database
 * connections. To add a new demo project later, create a folder under
 * `app/source-code/projects/<id>/` that exports a `StudioProject`, then
 * register it in `app/source-code/registry.ts`.
 */

export type LanguageId =
  | 'java'
  | 'xml'
  | 'yaml'
  | 'sql'
  | 'json'
  | 'properties'
  | 'markdown'
  | 'dockerfile'
  | 'shell'
  | 'javascript'
  | 'css'
  | 'html'
  | 'plaintext';

export interface CodeFile {
  type: 'file';
  name: string;
  language: LanguageId;
  content: string;
}

export interface CodeFolder {
  type: 'folder';
  name: string;
  children: FsNode[];
}

export type FsNode = CodeFile | CodeFolder;

/* ------------------------------------------------------------------ */
/* Database simulation model                                           */
/* ------------------------------------------------------------------ */

export type DbEngine = 'PostgreSQL' | 'MySQL' | 'Oracle' | 'Redis' | 'MongoDB';

export interface DbColumn {
  name: string;
  type: string;
  pk?: boolean;
  nullable?: boolean;
  comment?: string;
}

export type DbCell = string | number | boolean | null;

export interface DbTable {
  name: string;
  comment?: string;
  columns: DbColumn[];
  rows: DbCell[][];
}

export interface DbSchema {
  name: string;
  tables: DbTable[];
}

export interface DbConnection {
  name: string;
  engine: DbEngine;
  description?: string;
  schemas: DbSchema[];
}

/* ------------------------------------------------------------------ */
/* Project                                                             */
/* ------------------------------------------------------------------ */

export interface StudioProject {
  /** URL segment, e.g. 'java-microservice' */
  id: string;
  name: string;
  description: string;
  /** Concept chips shown on the hub page (Kafka, Saga, Outbox, ...) */
  tags: string[];
  /** Virtual workspace root */
  root: FsNode[];
  /** Simulated database connections shown in the Database view */
  databases: DbConnection[];
  /** Files opened as tabs when the studio loads (first one is active) */
  defaultOpenPaths?: string[];
}

/* ------------------------------------------------------------------ */
/* Authoring helpers — keep project data files terse                   */
/* ------------------------------------------------------------------ */

const EXT_LANGUAGE: Record<string, LanguageId> = {
  java: 'java',
  xml: 'xml',
  pom: 'xml',
  yml: 'yaml',
  yaml: 'yaml',
  sql: 'sql',
  json: 'json',
  properties: 'properties',
  md: 'markdown',
  sh: 'shell',
  bash: 'shell',
  conf: 'shell',
  txt: 'plaintext',
  js: 'javascript',
  jsx: 'javascript',
  mjs: 'javascript',
  cjs: 'javascript',
  ts: 'javascript',
  tsx: 'javascript',
  css: 'css',
  html: 'html',
  htm: 'html',
  env: 'properties',
  gitignore: 'properties',
  dockerignore: 'properties',
  gitattributes: 'properties',
};

export function languageForFile(name: string): LanguageId {
  if (/^dockerfile$/i.test(name)) return 'dockerfile';
  const ext = name.includes('.') ? name.split('.').pop()!.toLowerCase() : '';
  return EXT_LANGUAGE[ext] ?? 'plaintext';
}

/** File node helper: language is inferred from the file extension. */
export function file(name: string, content: string): CodeFile {
  return { type: 'file', name, language: languageForFile(name), content: content.trim() + '\n' };
}

/** Folder node helper. */
export function folder(name: string, children: FsNode[]): CodeFolder {
  return { type: 'folder', name, children };
}

/* ------------------------------------------------------------------ */
/* Tree utilities used by the studio UI                                */
/* ------------------------------------------------------------------ */

export interface FlatFile {
  path: string;
  file: CodeFile;
}

export function flattenFiles(nodes: FsNode[], base = ''): FlatFile[] {
  const out: FlatFile[] = [];
  for (const node of nodes) {
    const path = base ? `${base}/${node.name}` : node.name;
    if (node.type === 'file') out.push({ path, file: node });
    else out.push(...flattenFiles(node.children, path));
  }
  return out;
}

export function findFile(nodes: FsNode[], path: string): CodeFile | undefined {
  const [head, ...rest] = path.split('/');
  for (const node of nodes) {
    if (node.name !== head) continue;
    if (node.type === 'file') return rest.length === 0 ? node : undefined;
    if (rest.length > 0) return findFile(node.children, rest.join('/'));
  }
  return undefined;
}

/** All folder paths in the tree (used for expand/collapse-all). */
export function collectFolderPaths(nodes: FsNode[], base = ''): string[] {
  const out: string[] = [];
  for (const node of nodes) {
    if (node.type !== 'folder') continue;
    const path = base ? `${base}/${node.name}` : node.name;
    out.push(path, ...collectFolderPaths(node.children, path));
  }
  return out;
}
