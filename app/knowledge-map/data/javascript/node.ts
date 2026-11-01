import type { KmNode } from '../../types';

export const nodejs: KmNode = {
  title: 'Node.js Essentials',
  level: 'intermediate',
  summary: 'Running JavaScript outside the browser: files, servers, events, streams and its own event loop.',
  simple:
    'Node.js takes the JavaScript engine out of the browser and gives it new tools: a filing cabinet (files), a phone (network) and a control panel (the process).',
  points: [
    'Same language as in the browser, different built-in tools: no DOM, but files and sockets.',
    'Great for APIs, CLIs, build tools and real-time servers.',
    'Its strength is lots of waiting work (I/O) at once, not heavy CPU work.',
  ],
  children: [
    {
      title: 'Node.js Runtime',
      level: 'beginner',
      summary: 'A program that runs JavaScript on servers and laptops, built on V8 and libuv.',
      simple:
        'If the browser is a car with JavaScript as the engine, Node.js puts the same engine in a truck built for heavy server work.',
      points: [
        'V8 runs your code; libuv (a C library) handles files, network and timers in the background.',
        'Run a file with <code>node app.js</code>; try code in the REPL by just typing <code>node</code>.',
        'Even-numbered versions become LTS (long-term support); use an LTS version in production.',
        'Global object is <code>globalThis</code>; useful globals: <code>process</code>, <code>Buffer</code>, <code>fetch</code>.',
        'Import built-ins with the <code>node:</code> prefix: <code>import fs from "node:fs"</code>.',
      ],
    },
    {
      title: 'Core Modules',
      level: 'beginner',
      summary: 'Built-in modules for files, paths, environment variables and simple web servers.',
      simple:
        'Node comes with a starter toolbox: a file opener (fs), a map reader for folders (path), and a control panel for the running program (process).',
      points: [
        '<code>node:fs/promises</code>: read and write files with async/await.',
        '<code>node:path</code>: join folder names safely on every OS: <code>path.join(dir, "a.txt")</code>.',
        '<code>process.env</code> holds settings like <code>PORT</code>; <code>process.argv</code> holds CLI arguments.',
        'Load a <code>.env</code> file with <code>node --env-file=.env app.js</code> (Node 20.6+).',
        '<code>node:http</code> makes a basic server; most apps use a framework like Express or Fastify on top.',
      ],
      detail: `<pre><code>import { readFile } from "node:fs/promises";
import path from "node:path";

const file = path.join(import.meta.dirname, "data.json");
const data = JSON.parse(await readFile(file, "utf8"));
const port = process.env.PORT ?? 3000;</code></pre>`,
      tip: 'Avoid the Sync versions (readFileSync) inside servers: they block every other request while they run.',
    },
    {
      title: 'EventEmitter',
      level: 'intermediate',
      summary: 'Node’s built-in pattern for "when X happens, run these functions" (publish and subscribe).',
      simple:
        'An EventEmitter is a radio station. Listeners tune in to a channel with on(), and emit() broadcasts a message to everyone on that channel.',
      points: [
        '<code>on(name, fn)</code> subscribes, <code>emit(name, data)</code> calls every listener in order.',
        'Listeners run synchronously, right inside <code>emit</code>.',
        '<code>once</code> listens one time; <code>off</code> removes a listener.',
        'An <code>"error"</code> event with no listener crashes the process.',
        'Streams, servers and sockets in Node are all EventEmitters.',
      ],
      detail: `<pre><code>import { EventEmitter } from "node:events";

const orders = new EventEmitter();
orders.on("created", (o) =&gt; sendEmail(o));
orders.on("created", (o) =&gt; updateStats(o));
orders.emit("created", { id: 1 });</code></pre>`,
    },
    {
      title: 'Streams & Backpressure',
      level: 'advanced',
      summary: 'Handle data piece by piece instead of loading it all into memory at once.',
      simple:
        'Instead of filling a whole bathtub and then carrying it, you use a hose. Backpressure is turning the tap down when the bucket at the end fills up too fast.',
      points: [
        'Four kinds: Readable, Writable, Duplex (both) and Transform (changes data on the way).',
        'Use them for big files, uploads, logs and HTTP bodies.',
        'Backpressure: a slow writer tells the reader to pause, so memory does not explode.',
        '<code>pipeline()</code> from <code>node:stream/promises</code> wires streams and handles errors and clean-up.',
        'Readable streams are async iterables: <code>for await (const chunk of stream)</code>.',
      ],
      detail: `<pre><code>import { createReadStream, createWriteStream } from "node:fs";
import { createGzip } from "node:zlib";
import { pipeline } from "node:stream/promises";

await pipeline(
  createReadStream("big.log"),
  createGzip(),
  createWriteStream("big.log.gz"),
);</code></pre>`,
      tip: 'Prefer pipeline() over .pipe(): .pipe() does not forward errors, so a failed stream can leak or hang.',
    },
    {
      title: 'Node Event Loop Phases',
      level: 'advanced',
      summary: 'Node’s event loop runs in fixed phases: timers, I/O callbacks, setImmediate, close handlers.',
      simple:
        'Picture a ferris wheel with stops: the timer stop, the I/O stop, the setImmediate stop, the closing stop. Between every ride, all the urgent notes (microtasks) are handled first.',
      points: [
        'Main phases: timers → pending → poll (wait for I/O) → check (<code>setImmediate</code>) → close.',
        '<code>process.nextTick</code> runs first, then promise microtasks, before the loop moves on.',
        'Inside an I/O callback, <code>setImmediate</code> always runs before <code>setTimeout(fn, 0)</code>.',
        'One slow callback blocks every request: the whole server waits.',
      ],
      detail: `<pre><code>import { readFile } from "node:fs";

readFile("a.txt", () =&gt; {
  setTimeout(() =&gt; console.log("timeout"), 0);
  setImmediate(() =&gt; console.log("immediate"));
});
// immediate, timeout</code></pre>`,
    },
    {
      title: 'Worker Threads & Cluster',
      level: 'advanced',
      summary: 'Ways to use more than one CPU core in Node for heavy work or more traffic.',
      simple:
        'One cook is fast at juggling orders, but slow at chopping a mountain of onions. Worker threads hire extra cooks for the chopping; cluster opens more kitchens.',
      points: [
        '<code>worker_threads</code>: run CPU-heavy JS (images, crypto, parsing) on another thread.',
        'Workers talk with messages; they can share memory with <code>SharedArrayBuffer</code>.',
        '<code>cluster</code> (or PM2, or containers) runs several copies of your server, one per core.',
        'Do not use workers for I/O; Node already handles waiting work without blocking.',
      ],
    },
  ],
};
