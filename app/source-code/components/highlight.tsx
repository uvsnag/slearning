import React from 'react';
import { LanguageId } from '../types';

/**
 * Small regex-based syntax highlighter for the Code Studio viewer.
 * It favours "looks like VS Code Dark+" over grammar perfection: each line is
 * scanned with a per-language master regex and emitted as classed <span>s.
 * Block comments spanning lines are carried via a per-file scan state.
 */

type TokenClass =
  | 'kw' // keyword
  | 'ctrl' // control-flow keyword
  | 'type' // type / class name
  | 'str' // string literal
  | 'num' // number
  | 'com' // comment
  | 'ann' // annotation / decorator
  | 'fn' // function call
  | 'prop' // property / yaml key / json key
  | 'tag' // xml tag
  | 'attr' // xml attribute
  | 'head' // markdown heading
  | 'plain';

const JAVA_CTRL = new Set([
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'default',
  'break',
  'continue',
  'return',
  'throw',
  'throws',
  'try',
  'catch',
  'finally',
  'yield',
  'assert',
]);
const JAVA_KW = new Set([
  'abstract',
  'boolean',
  'byte',
  'char',
  'class',
  'const',
  'double',
  'enum',
  'extends',
  'final',
  'float',
  'implements',
  'import',
  'instanceof',
  'int',
  'interface',
  'long',
  'native',
  'new',
  'package',
  'private',
  'protected',
  'public',
  'record',
  'sealed',
  'short',
  'static',
  'strictfp',
  'super',
  'synchronized',
  'this',
  'transient',
  'var',
  'void',
  'volatile',
  'true',
  'false',
  'null',
  'permits',
  'non-sealed',
]);
const SQL_KW = new Set([
  'select',
  'from',
  'where',
  'insert',
  'into',
  'values',
  'update',
  'set',
  'delete',
  'create',
  'table',
  'index',
  'unique',
  'primary',
  'key',
  'foreign',
  'references',
  'not',
  'null',
  'default',
  'constraint',
  'alter',
  'drop',
  'and',
  'or',
  'in',
  'is',
  'like',
  'order',
  'by',
  'group',
  'having',
  'limit',
  'offset',
  'join',
  'left',
  'right',
  'inner',
  'outer',
  'on',
  'as',
  'distinct',
  'union',
  'all',
  'exists',
  'between',
  'if',
  'comment',
  'grant',
  'check',
  'cascade',
  'begin',
  'commit',
  'rollback',
  'transaction',
  'for',
  'skip',
  'locked',
  'returning',
  'now',
  'current_timestamp',
]);
const SHELL_KW = new Set([
  'if',
  'then',
  'else',
  'elif',
  'fi',
  'for',
  'in',
  'do',
  'done',
  'while',
  'case',
  'esac',
  'function',
  'return',
  'exit',
  'export',
  'local',
  'echo',
  'set',
]);
const JS_CTRL = new Set([
  'if',
  'else',
  'for',
  'while',
  'do',
  'switch',
  'case',
  'default',
  'break',
  'continue',
  'return',
  'throw',
  'try',
  'catch',
  'finally',
  'yield',
  'await',
]);
const JS_KW = new Set([
  'const',
  'let',
  'var',
  'function',
  'class',
  'extends',
  'new',
  'delete',
  'typeof',
  'instanceof',
  'in',
  'of',
  'this',
  'super',
  'import',
  'export',
  'from',
  'as',
  'async',
  'static',
  'get',
  'set',
  'true',
  'false',
  'null',
  'undefined',
  'void',
]);

interface ScanState {
  inBlockComment: boolean;
}

interface Segment {
  cls: TokenClass;
  text: string;
}

function pushSeg(out: Segment[], cls: TokenClass, text: string) {
  if (!text) return;
  const last = out[out.length - 1];
  if (last && last.cls === cls) last.text += text;
  else out.push({ cls, text });
}

/** Generic scanner: applies a master regex; unmatched text falls through as plain. */
function scanWithRegex(
  line: string,
  re: RegExp,
  classify: (m: RegExpExecArray) => { cls: TokenClass; text: string } | null,
): Segment[] {
  const out: Segment[] = [];
  let idx = 0;
  re.lastIndex = 0;
  let m: RegExpExecArray | null;
  while ((m = re.exec(line)) !== null) {
    if (m.index > idx) pushSeg(out, 'plain', line.slice(idx, m.index));
    const seg = classify(m);
    pushSeg(out, seg ? seg.cls : 'plain', seg ? seg.text : m[0]);
    idx = m.index + m[0].length;
    if (m[0].length === 0) re.lastIndex++;
  }
  if (idx < line.length) pushSeg(out, 'plain', line.slice(idx));
  return out;
}

/* ---------------------------- Java ---------------------------- */

const JAVA_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"?)|('(?:[^'\\]|\\.)*'?)|(@[A-Za-z_]\w*)|(\b\d[\w_.]*\b)|([A-Za-z_$][\w$]*)(\s*\()?/g;

function scanJava(line: string, state: ScanState): Segment[] {
  return scanBlockCommentAware(line, state, '/*', '*/', (code) =>
    scanWithRegex(code, JAVA_RE, (m) => {
      if (m[1]) return { cls: 'com', text: m[1] };
      if (m[2]) return { cls: 'str', text: m[2] };
      if (m[3]) return { cls: 'str', text: m[3] };
      if (m[4]) return { cls: 'ann', text: m[4] };
      if (m[5]) return { cls: 'num', text: m[5] };
      if (m[6]) {
        const word = m[6];
        const call = m[7];
        let cls: TokenClass = 'plain';
        if (JAVA_CTRL.has(word)) cls = 'ctrl';
        else if (JAVA_KW.has(word)) cls = 'kw';
        else if (/^[A-Z]/.test(word)) cls = 'type';
        else if (call) cls = 'fn';
        return { cls, text: word + (call ?? '') };
      }
      return null;
    }),
  );
}

/* ------------------------- JavaScript -------------------------- */

const JS_RE =
  /(\/\/.*$)|("(?:[^"\\]|\\.)*"?)|('(?:[^'\\]|\\.)*'?)|(`(?:[^`\\]|\\.)*`?)|(\b\d[\w.]*\b)|([A-Za-z_$][\w$]*)(\s*\()?/g;

function scanJs(line: string, state: ScanState): Segment[] {
  return scanBlockCommentAware(line, state, '/*', '*/', (code) =>
    scanWithRegex(code, JS_RE, (m) => {
      if (m[1]) return { cls: 'com', text: m[1] };
      if (m[2] || m[3] || m[4]) return { cls: 'str', text: m[2] ?? m[3] ?? m[4] };
      if (m[5]) return { cls: 'num', text: m[5] };
      if (m[6]) {
        const word = m[6];
        const call = m[7];
        let cls: TokenClass = 'plain';
        if (JS_CTRL.has(word)) cls = 'ctrl';
        else if (JS_KW.has(word)) cls = 'kw';
        else if (/^[A-Z]/.test(word)) cls = 'type';
        else if (call) cls = 'fn';
        return { cls, text: word + (call ?? '') };
      }
      return null;
    }),
  );
}

/* ----------------------------- CSS ------------------------------ */

const CSS_RE =
  /(@[\w-]+)|("[^"]*"?|'[^']*'?)|(#[0-9a-fA-F]{3,8}\b)|([.#][\w-]+)|(\b\d[\d.]*(?:px|rem|em|%|vh|vw|vmin|vmax|s|ms|fr|deg|ch)?)|([\w-]+)(\s*:)/g;

function scanCss(line: string, state: ScanState): Segment[] {
  return scanBlockCommentAware(line, state, '/*', '*/', (code) =>
    scanWithRegex(code, CSS_RE, (m) => {
      if (m[1]) return { cls: 'ann', text: m[1] };
      if (m[2]) return { cls: 'str', text: m[2] };
      if (m[3]) return { cls: 'num', text: m[3] };
      if (m[4]) return { cls: 'type', text: m[4] };
      if (m[5]) return { cls: 'num', text: m[5] };
      if (m[6]) return { cls: 'prop', text: m[6] + (m[7] ?? '') };
      return null;
    }),
  );
}

/* ------------------- block comment handling ------------------- */

function scanBlockCommentAware(
  line: string,
  state: ScanState,
  open: string,
  close: string,
  scanCode: (code: string) => Segment[],
): Segment[] {
  const out: Segment[] = [];
  let rest = line;
  while (rest.length > 0) {
    if (state.inBlockComment) {
      const end = rest.indexOf(close);
      if (end === -1) {
        pushSeg(out, 'com', rest);
        return out;
      }
      pushSeg(out, 'com', rest.slice(0, end + close.length));
      state.inBlockComment = false;
      rest = rest.slice(end + close.length);
    } else {
      const start = rest.indexOf(open);
      // Ignore an `open` that sits inside a line comment or string: cheap
      // heuristic — only treat it as a block comment when it appears before
      // any line-comment marker.
      const lineComment = rest.indexOf('//');
      if (start === -1 || (lineComment !== -1 && lineComment < start)) {
        out.push(...scanCode(rest));
        return out;
      }
      out.push(...scanCode(rest.slice(0, start)));
      state.inBlockComment = true;
      rest = rest.slice(start);
    }
  }
  return out;
}

/* ---------------------------- YAML ----------------------------- */

const YAML_KEY_RE = /^(\s*-?\s*)([\w.\-/[\]${}]+)(\s*:)(\s|$)/;

function scanYaml(line: string): Segment[] {
  const out: Segment[] = [];
  const hash = findYamlCommentStart(line);
  const code = hash === -1 ? line : line.slice(0, hash);
  const keyMatch = YAML_KEY_RE.exec(code);
  let rest = code;
  if (keyMatch) {
    pushSeg(out, 'plain', keyMatch[1]);
    pushSeg(out, 'prop', keyMatch[2]);
    pushSeg(out, 'plain', keyMatch[3] + keyMatch[4]);
    rest = code.slice(keyMatch[0].length);
  }
  out.push(
    ...scanWithRegex(
      rest,
      /("(?:[^"\\]|\\.)*"?|'[^']*'?)|(\b\d[\d_.]*\b)|(\btrue\b|\bfalse\b|\bnull\b)/g,
      (m) => {
        if (m[1]) return { cls: 'str', text: m[1] };
        if (m[2]) return { cls: 'num', text: m[2] };
        if (m[3]) return { cls: 'kw', text: m[3] };
        return null;
      },
    ),
  );
  if (hash !== -1) pushSeg(out, 'com', line.slice(hash));
  return out;
}

function findYamlCommentStart(line: string): number {
  let inSingle = false;
  let inDouble = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === "'" && !inDouble) inSingle = !inSingle;
    else if (ch === '"' && !inSingle) inDouble = !inDouble;
    else if (ch === '#' && !inSingle && !inDouble && (i === 0 || /\s/.test(line[i - 1]))) return i;
  }
  return -1;
}

/* ----------------------------- XML ----------------------------- */

const XML_RE = /(<!--.*?-->)|(<\/?)([\w:.-]+)|((?:[\w:-]+)=)("[^"]*"?)|(>|\/>)|("[^"]*")/g;

function scanXml(line: string, state: ScanState): Segment[] {
  return scanBlockCommentAware(line, state, '<!--', '-->', (code) =>
    scanWithRegex(code, XML_RE, (m) => {
      if (m[1]) return { cls: 'com', text: m[1] };
      if (m[2]) return { cls: 'tag', text: m[2] + (m[3] ?? '') };
      if (m[4]) return { cls: 'attr', text: m[4] };
      if (m[5]) return { cls: 'str', text: m[5] };
      if (m[6]) return { cls: 'tag', text: m[6] };
      if (m[7]) return { cls: 'str', text: m[7] };
      return null;
    }),
  );
}

/* ----------------------------- SQL ----------------------------- */

const SQL_RE = /(--.*$)|('(?:[^']|'')*'?)|(\b\d[\d_.]*\b)|([A-Za-z_][\w$]*)/g;

function scanSql(line: string, state: ScanState): Segment[] {
  return scanBlockCommentAware(line, state, '/*', '*/', (code) =>
    scanWithRegex(code, SQL_RE, (m) => {
      if (m[1]) return { cls: 'com', text: m[1] };
      if (m[2]) return { cls: 'str', text: m[2] };
      if (m[3]) return { cls: 'num', text: m[3] };
      if (m[4]) return { cls: SQL_KW.has(m[4].toLowerCase()) ? 'kw' : 'plain', text: m[4] };
      return null;
    }),
  );
}

/* ---------------------------- JSON ----------------------------- */

const JSON_RE = /("(?:[^"\\]|\\.)*")(\s*:)?|(\b-?\d[\d.eE+-]*\b)|(\btrue\b|\bfalse\b|\bnull\b)/g;

function scanJson(line: string): Segment[] {
  return scanWithRegex(line, JSON_RE, (m) => {
    if (m[1]) return { cls: m[2] ? 'prop' : 'str', text: m[1] + (m[2] ?? '') };
    if (m[3]) return { cls: 'num', text: m[3] };
    if (m[4]) return { cls: 'kw', text: m[4] };
    return null;
  });
}

/* ------------------------- properties -------------------------- */

function scanProperties(line: string): Segment[] {
  if (/^\s*[#!]/.test(line)) return [{ cls: 'com', text: line }];
  const eq = line.indexOf('=');
  if (eq === -1) return [{ cls: 'plain', text: line }];
  return [
    { cls: 'prop', text: line.slice(0, eq) },
    { cls: 'plain', text: '=' },
    { cls: 'str', text: line.slice(eq + 1) },
  ];
}

/* -------------------------- dockerfile ------------------------- */

const DOCKER_RE =
  /^(\s*)(FROM|RUN|CMD|LABEL|EXPOSE|ENV|ADD|COPY|ENTRYPOINT|VOLUME|USER|WORKDIR|ARG|HEALTHCHECK|SHELL|ONBUILD|AS)\b/;

function scanDocker(line: string): Segment[] {
  if (/^\s*#/.test(line)) return [{ cls: 'com', text: line }];
  const m = DOCKER_RE.exec(line);
  if (!m) return scanShell(line);
  return [
    { cls: 'plain', text: m[1] },
    { cls: 'kw', text: m[2] },
    ...scanShell(line.slice(m[0].length)),
  ];
}

/* ---------------------------- shell ---------------------------- */

const SHELL_RE =
  /(#.*$)|("(?:[^"\\]|\\.)*"?|'[^']*'?)|(\$\{?[\w@#?]+\}?)|(\b\d+\b)|([A-Za-z_][\w-]*)/g;

function scanShell(line: string): Segment[] {
  return scanWithRegex(line, SHELL_RE, (m) => {
    if (m[1]) return { cls: 'com', text: m[1] };
    if (m[2]) return { cls: 'str', text: m[2] };
    if (m[3]) return { cls: 'ann', text: m[3] };
    if (m[4]) return { cls: 'num', text: m[4] };
    if (m[5]) return { cls: SHELL_KW.has(m[5]) ? 'kw' : 'plain', text: m[5] };
    return null;
  });
}

/* --------------------------- markdown -------------------------- */

function scanMarkdown(line: string, state: ScanState): Segment[] {
  if (state.inBlockComment) {
    // reuse the flag for fenced code blocks
    if (/^\s*(```|~~~)/.test(line)) {
      state.inBlockComment = false;
      return [{ cls: 'com', text: line }];
    }
    return [{ cls: 'str', text: line }];
  }
  if (/^\s*(```|~~~)/.test(line)) {
    state.inBlockComment = true;
    return [{ cls: 'com', text: line }];
  }
  if (/^#{1,6}\s/.test(line)) return [{ cls: 'head', text: line }];
  if (/^\s*>/.test(line)) return [{ cls: 'com', text: line }];
  return scanWithRegex(
    line,
    /(\*\*[^*]+\*\*|__[^_]+__)|(`[^`]+`)|(\[[^\]]*\]\([^)]*\))|(^\s*[-*+]\s|\d+\.\s)/g,
    (m) => {
      if (m[1]) return { cls: 'kw', text: m[1] };
      if (m[2]) return { cls: 'str', text: m[2] };
      if (m[3]) return { cls: 'fn', text: m[3] };
      if (m[4]) return { cls: 'ctrl', text: m[4] };
      return null;
    },
  );
}

/* ------------------------- entry point -------------------------- */

function scanLine(line: string, lang: LanguageId, state: ScanState): Segment[] {
  switch (lang) {
    case 'java':
      return scanJava(line, state);
    case 'yaml':
      return scanYaml(line);
    case 'xml':
      return scanXml(line, state);
    case 'sql':
      return scanSql(line, state);
    case 'json':
      return scanJson(line);
    case 'properties':
      return scanProperties(line);
    case 'dockerfile':
      return scanDocker(line);
    case 'shell':
      return scanShell(line);
    case 'markdown':
      return scanMarkdown(line, state);
    case 'javascript':
      return scanJs(line, state);
    case 'css':
      return scanCss(line, state);
    case 'html':
      return scanXml(line, state);
    default:
      return [{ cls: 'plain', text: line }];
  }
}

/** Highlight full file content; returns one array of spans per line. */
export function highlightContent(content: string, lang: LanguageId): React.ReactNode[][] {
  const state: ScanState = { inBlockComment: false };
  return content
    .replace(/\n$/, '')
    .split('\n')
    .map((line, lineIdx) =>
      scanLine(line, lang, state).map((seg, i) =>
        seg.cls === 'plain' ? (
          <React.Fragment key={`${lineIdx}-${i}`}>{seg.text}</React.Fragment>
        ) : (
          <span key={`${lineIdx}-${i}`} className={`tok-${seg.cls}`}>
            {seg.text}
          </span>
        ),
      ),
    );
}
