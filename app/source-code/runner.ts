/**
 * Code execution backends for the Code Studio playground.
 *
 * - JavaScript runs locally in a sandboxed Web Worker: console output is
 *   captured and streamed back, and a hard timeout guards against infinite
 *   loops (the worker is simply terminated).
 * - Java is compiled and executed remotely by the free Wandbox API
 *   (https://wandbox.org, CORS-enabled) — the app deploys as a static site,
 *   so there is no own server to run a JVM on. (The public Piston API would
 *   have been the first choice but went whitelist-only in Feb 2026.)
 */

export type RunLogLevel = 'out' | 'err' | 'system';

export interface RunLog {
  level: RunLogLevel;
  text: string;
}

export interface RunOutcome {
  ok: boolean;
  seconds: number;
}

/** Dispatch to the right backend for the file's language and time the run. */
export async function runCode(
  language: 'java' | 'javascript',
  fileName: string,
  code: string,
  onLog: (log: RunLog) => void,
): Promise<RunOutcome> {
  const started = Date.now();
  const ok =
    language === 'javascript'
      ? await runJavaScript(code, onLog)
      : await runJava(fileName, code, onLog);
  return { ok, seconds: (Date.now() - started) / 1000 };
}

const JS_TIMEOUT_MS = 10_000;

/**
 * Worker body: hijacks console.*, evaluates the user code inside an async
 * wrapper (so top-level await works) and streams each log line back
 * immediately — partial output survives a timeout termination.
 */
const WORKER_SOURCE = `
  const fmt = (v) => {
    if (typeof v === 'string') return v;
    if (v instanceof Error) return v.stack || String(v);
    if (typeof v === 'function') return String(v);
    try {
      const json = JSON.stringify(v);
      return json === undefined ? String(v) : json;
    } catch {
      return String(v);
    }
  };
  const send = (level) => (...args) => postMessage({ kind: 'log', level, text: args.map(fmt).join(' ') });
  console.log = send('out');
  console.info = send('out');
  console.debug = send('out');
  console.warn = send('err');
  console.error = send('err');
  onmessage = (e) => {
    Promise.resolve()
      .then(() => new Function('"use strict";return (async () => {\\n' + e.data + '\\n})();')())
      .then((value) => {
        if (value !== undefined) postMessage({ kind: 'log', level: 'out', text: '→ ' + fmt(value) });
        postMessage({ kind: 'done', ok: true });
      })
      .catch((err) => {
        postMessage({ kind: 'log', level: 'err', text: fmt(err) });
        postMessage({ kind: 'done', ok: false });
      });
  };
`;

/** Run JavaScript in a sandboxed worker. Resolves true when it finished cleanly. */
export function runJavaScript(code: string, onLog: (log: RunLog) => void): Promise<boolean> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(new Blob([WORKER_SOURCE], { type: 'text/javascript' }));
    const worker = new Worker(url);
    let settled = false;

    const finish = (ok: boolean) => {
      if (settled) return;
      settled = true;
      clearTimeout(timer);
      worker.terminate();
      URL.revokeObjectURL(url);
      resolve(ok);
    };

    const timer = setTimeout(() => {
      onLog({
        level: 'err',
        text: `Execution timed out after ${JS_TIMEOUT_MS / 1000}s (infinite loop?) — worker terminated.`,
      });
      finish(false);
    }, JS_TIMEOUT_MS);

    worker.onmessage = (e) => {
      const msg = e.data as { kind: string; ok?: boolean; level?: RunLogLevel; text?: string };
      if (msg.kind === 'log') onLog({ level: msg.level ?? 'out', text: msg.text ?? '' });
      else if (msg.kind === 'done') finish(msg.ok === true);
    };
    worker.onerror = (e) => {
      onLog({ level: 'err', text: e.message || 'Worker error' });
      finish(false);
    };

    worker.postMessage(code);
  });
}

/* ------------------------------------------------------------------ */
/* Java via the Wandbox compile API                                    */
/* ------------------------------------------------------------------ */

const WANDBOX_URL = 'https://wandbox.org/api/compile.json';
const WANDBOX_JAVA_COMPILER = 'openjdk-jdk-22+36';

interface WandboxResult {
  status?: string;
  compiler_error?: string;
  compiler_output?: string;
  program_output?: string;
  program_error?: string;
}

function emitLines(text: string, level: RunLogLevel, onLog: (log: RunLog) => void) {
  const lines = text.replace(/\n$/, '').split('\n');
  for (const line of lines) onLog({ level, text: line });
}

/**
 * Wandbox compiles the source as `prog.java`, so a `public` top-level class
 * would fail with "class X is public, should be declared in a file named
 * X.java". Dropping the modifier is harmless for a single-file snippet, and
 * Wandbox then finds and runs whichever class has the main method.
 */
function stripPublicTypeModifier(code: string): string {
  return code.replace(
    /\bpublic\s+(?=(?:final\s+|abstract\s+|sealed\s+|non-sealed\s+|static\s+|strictfp\s+)*(?:class|interface|enum|record)\b)/g,
    '',
  );
}

/** Compile + run a Java file on Wandbox. Resolves true when it exited with 0. */
export async function runJava(
  fileName: string,
  code: string,
  onLog: (log: RunLog) => void,
): Promise<boolean> {
  onLog({ level: 'system', text: 'Compiling and running on the Wandbox sandbox (wandbox.org)…' });

  let res: Response;
  try {
    res = await fetch(WANDBOX_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        compiler: WANDBOX_JAVA_COMPILER,
        code: stripPublicTypeModifier(code),
      }),
    });
  } catch {
    onLog({
      level: 'err',
      text: 'Could not reach the Wandbox API — running Java needs internet access.',
    });
    return false;
  }

  if (!res.ok) {
    const hint = res.status === 429 ? ' (rate limited — wait a moment and try again)' : '';
    onLog({ level: 'err', text: `Wandbox API error: HTTP ${res.status}${hint}` });
    return false;
  }

  const data = (await res.json()) as WandboxResult;

  if (data.compiler_error) {
    // Wandbox compiles the snippet as prog.java — undo that in messages.
    emitLines(data.compiler_error.replaceAll('prog.java', fileName), 'err', onLog);
    return false;
  }
  if (data.compiler_output) emitLines(data.compiler_output, 'out', onLog);
  if (data.program_output) emitLines(data.program_output, 'out', onLog);
  if (data.program_error) emitLines(data.program_error, 'err', onLog);

  const exitCode = data.status ?? '0';
  if (exitCode !== '0') onLog({ level: 'system', text: `Process exited with code ${exitCode}` });
  return exitCode === '0';
}
