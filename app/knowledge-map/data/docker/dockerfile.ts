import type { KmNode } from '../../types';

export const dockerfile: KmNode = {
  title: 'Dockerfile',
  level: 'beginner',
  summary: 'The text file of instructions Docker follows to build your image, step by step.',
  simple:
    'A Dockerfile is a recipe: start from this base, copy these ingredients, run these steps, and here is how to serve it.',
  points: [
    'Each line is an instruction, like <code>FROM</code>, <code>COPY</code> or <code>RUN</code>.',
    'Build with <code>docker build -t myapp:1.0 .</code> (the dot is the build context).',
    'Order matters for caching: put things that rarely change first.',
  ],
  children: [
    {
      title: 'FROM',
      level: 'beginner',
      summary: 'Picks the base image your image starts from. Every Dockerfile begins with it.',
      simple: 'Choosing the cake base before you add the frosting.',
      points: [
        'Pin a version: <code>FROM node:22-slim</code>, not just <code>FROM node</code>.',
        '<code>FROM scratch</code> starts from an empty image (for static binaries).',
        'A Dockerfile can have several FROM lines: that’s a multi-stage build.',
      ],
    },
    {
      title: 'WORKDIR',
      level: 'beginner',
      summary:
        'Sets the working folder for the following instructions and for the running container.',
      simple: 'Like typing cd once instead of before every command.',
      points: [
        '<code>WORKDIR /app</code> creates the folder if missing.',
        'Use it instead of <code>RUN cd /app &amp;&amp; …</code>, which only lasts for one line.',
      ],
    },
    {
      title: 'COPY vs ADD',
      level: 'beginner',
      summary:
        'Both put files into the image; COPY just copies, ADD also unpacks tar files and downloads URLs.',
      simple:
        'COPY is a plain moving box. ADD is a box with surprise features. Usually you want the plain box.',
      points: [
        '<code>COPY package*.json ./</code> copies from the build context.',
        '<code>COPY --chown=node:node . .</code> sets the file owner.',
        '<code>COPY --from=build /app/dist ./dist</code> copies from another stage.',
        'Use <code>ADD</code> only when you want its auto-extract or remote-fetch behavior.',
      ],
    },
    {
      title: 'RUN',
      level: 'beginner',
      summary: 'Runs a command at build time and saves the result as a new layer.',
      simple: 'RUN is a cooking step done in the kitchen before serving, like installing tools.',
      points: [
        'Example: <code>RUN npm ci --omit=dev</code>.',
        'Chain related commands with <code>&amp;&amp;</code> and clean up in the same step.',
        'Runs only during build; it doesn’t run when the container starts.',
      ],
      tip: 'apt-get update and apt-get install must be in the same RUN, or a cached update layer gives you stale package lists.',
    },
    {
      title: 'ENV vs ARG',
      level: 'intermediate',
      summary:
        'ARG is a build-time variable; ENV is set in the image and seen by the running container.',
      simple:
        'ARG is a note for the kitchen only. ENV is a label stuck on the dish that the customer can read too.',
      points: [
        '<code>ARG NODE_VERSION=22</code> can be set with <code>--build-arg</code>.',
        '<code>ENV NODE_ENV=production</code> stays in the image and every container.',
        'An ARG before <code>FROM</code> is only usable in the FROM line unless re-declared.',
        'Neither is safe for secrets: both can be seen in the image history.',
      ],
    },
    {
      title: 'CMD vs ENTRYPOINT',
      level: 'intermediate',
      summary:
        'ENTRYPOINT is the fixed program to run; CMD gives default arguments (or the default command).',
      simple:
        'ENTRYPOINT is the coffee machine; CMD is the default button ("medium latte"). Users can press a different button but keep the machine.',
      points: [
        'Only CMD: <code>CMD ["node", "server.js"]</code>; <code>docker run img other</code> replaces it.',
        'Both: <code>ENTRYPOINT ["java", "-jar", "app.jar"]</code> + <code>CMD ["--port=8080"]</code>.',
        'Override the entrypoint with <code>docker run --entrypoint</code>.',
        'Only the last CMD and the last ENTRYPOINT count.',
      ],
      children: [
        {
          title: 'Exec vs Shell Form',
          level: 'intermediate',
          summary:
            'Exec form (JSON array) runs your program directly; shell form wraps it in /bin/sh -c.',
          simple:
            'Shell form puts a middleman (the shell) between Docker and your app. The middleman often doesn’t pass on "please stop" messages.',
          points: [
            'Exec: <code>CMD ["node", "server.js"]</code>, so your app is PID 1 and gets SIGTERM.',
            'Shell: <code>CMD node server.js</code>, so <code>sh</code> is PID 1 and may not forward signals.',
            'Shell form gives you variable expansion and pipes; exec form doesn’t.',
          ],
          tip: 'If docker stop always takes 10 seconds, you are probably using shell form and the app never sees SIGTERM.',
        },
      ],
    },
    {
      title: 'EXPOSE',
      level: 'beginner',
      summary: 'Documents which port the app listens on. It doesn’t publish anything by itself.',
      simple: 'A sign on the door saying "we’re on port 3000". You still need -p to open the door.',
      points: [
        '<code>EXPOSE 3000</code> is metadata for humans and tools.',
        '<code>docker run -P</code> publishes all exposed ports to random host ports.',
      ],
    },
    {
      title: 'USER',
      level: 'intermediate',
      summary: 'Sets which user runs the following instructions and the container process.',
      simple: 'Don’t give the intern the master key. Run the app as a normal user, not root.',
      points: [
        'Containers run as root by default.',
        'Official Node images ship a <code>node</code> user: <code>USER node</code>.',
        'Create one yourself: <code>RUN useradd -r app</code> then <code>USER app</code>.',
        'Make sure the user can read the app files (<code>COPY --chown</code>).',
      ],
    },
    {
      title: '.dockerignore',
      level: 'beginner',
      summary: 'Lists files Docker should not send in the build context.',
      simple: 'Like .gitignore, but for builds. Keep junk and secrets out of the box.',
      points: [
        'Typical entries: <code>node_modules</code>, <code>.git</code>, <code>target</code>, <code>.env</code>, logs.',
        'Smaller context = faster builds and fewer cache misses.',
        'Stops local <code>.env</code> files or keys from ending up in an image.',
      ],
    },
    {
      title: 'Dockerfile Best Practices',
      level: 'intermediate',
      summary: 'Habits that keep images small, fast to build, secure and predictable.',
      simple: 'A good recipe is short, in the right order, and leaves the kitchen clean.',
      points: [
        'Pin base image versions; one app (one main process) per container.',
        'Copy dependency files first, install, then copy the rest of the source.',
        'Use multi-stage builds so build tools don’t ship to production.',
        'Run as a non-root user; use exec form for CMD/ENTRYPOINT.',
        'Add a <code>HEALTHCHECK</code> and <code>LABEL</code>s (version, source repo).',
        'Lint with <code>hadolint</code> or <code>docker build --check</code>.',
      ],
    },
  ],
};
