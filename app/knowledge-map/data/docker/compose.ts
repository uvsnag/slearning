import type { KmNode } from '../../types';

export const compose: KmNode = {
  title: 'Docker Compose',
  level: 'intermediate',
  summary: 'Describe a multi-container app in one file and start it all with one command.',
  simple:
    'Instead of typing a long docker run line for the API, the database and the cache, you write one shopping list and say "get everything".',
  points: [
    'File: <code>compose.yaml</code> (older name <code>docker-compose.yml</code> still works).',
    'Command: <code>docker compose up</code> (v2, a Docker CLI plugin).',
    'Perfect for local dev and small single-host deployments.',
  ],
  children: [
    {
      title: 'Compose v2',
      level: 'beginner',
      summary:
        'The current Compose is built into the docker CLI as "docker compose" (with a space).',
      simple: 'The old standalone tool retired; its replacement lives inside the docker command.',
      points: [
        'Old v1 <code>docker-compose</code> (Python) reached end of life in 2023.',
        'The top-level <code>version:</code> key is obsolete and ignored; just remove it.',
        'The format is the open Compose Specification.',
      ],
    },
    {
      title: 'Services',
      level: 'beginner',
      summary: 'Each service is one container definition: image or build, ports, env, volumes.',
      simple:
        'Each service is one line on the shopping list: "API from my Dockerfile, Postgres 17, Redis".',
      points: [
        '<code>image:</code> to use an existing image, <code>build:</code> to build from a Dockerfile.',
        '<code>ports</code>, <code>environment</code>, <code>env_file</code>, <code>volumes</code> mirror the run flags.',
        'Services reach each other by service name on the project network.',
        'Named volumes are declared under the top-level <code>volumes:</code> key.',
      ],
    },
    {
      title: 'Everyday Commands',
      level: 'beginner',
      summary: 'Start, stop, watch and rebuild the whole stack.',
      simple: 'Your remote control for the whole app.',
      points: [
        '<code>docker compose up -d</code> / <code>down</code>.',
        '<code>docker compose logs -f api</code>, <code>ps</code>, <code>exec api sh</code>.',
        '<code>up --build</code> rebuilds images; <code>down -v</code> also deletes volumes (careful).',
        '<code>docker compose config</code> prints the final merged config.',
      ],
    },
    {
      title: 'depends_on & Healthchecks',
      level: 'intermediate',
      summary:
        'Control start order, and wait until a dependency is actually ready, not just started.',
      simple:
        'Started is not ready. The kitchen door being open doesn’t mean the chef has arrived.',
      points: [
        'Plain <code>depends_on</code> only orders start-up.',
        'Use <code>condition: service_healthy</code> with a healthcheck on the database.',
        'Your app should still retry connections; dependencies can restart anytime.',
      ],
    },
    {
      title: 'Env & Overrides',
      level: 'intermediate',
      summary: 'Change config per environment with .env files, override files and profiles.',
      simple: 'One base recipe, with small tweaks for home and for the restaurant.',
      points: [
        'A <code>.env</code> file next to <code>compose.yaml</code> fills <code>${VAR}</code> placeholders.',
        '<code>compose.override.yaml</code> is merged automatically (great for dev settings).',
        'Combine files: <code>-f compose.yaml -f compose.prod.yaml</code>.',
        '<code>profiles</code> let optional services (like an admin UI) start only on request.',
      ],
    },
    {
      title: 'Compose Watch',
      level: 'intermediate',
      summary: 'Auto-sync or rebuild containers when you edit files, for a fast dev loop.',
      simple: 'Save a file and the running app updates, without you restarting anything.',
      points: [
        '<code>docker compose watch</code> or <code>up --watch</code>.',
        'Actions: <code>sync</code> (copy files), <code>rebuild</code> (new image), <code>sync+restart</code>.',
        'Avoids slow bind mounts of big folders on Mac/Windows.',
      ],
    },
    {
      title: 'Testcontainers',
      level: 'intermediate',
      summary: 'A library that starts real databases or brokers in Docker from your test code.',
      simple:
        'Instead of a cardboard cutout of a database, each test run borrows a real one and throws it away afterwards.',
      points: [
        'Libraries for Java, Node.js and more; needs a Docker daemon on the machine.',
        'Each test gets a fresh container on a random host port, so tests don’t collide.',
        'Containers are removed automatically when tests end (by the Ryuk helper).',
        'Spring Boot 3.1+: <code>@ServiceConnection</code> wires the container URL in for you.',
      ],
      detail: `<pre><code>import { GenericContainer } from 'testcontainers';

const redis = await new GenericContainer('redis:7')
  .withExposedPorts(6379)
  .start();

const url = 'redis://' + redis.getHost() + ':' + redis.getMappedPort(6379);
// ... run your tests against url ...
await redis.stop();</code></pre>`,
      tip: 'Use Compose for your day-to-day dev stack and Testcontainers for automated tests. They solve different problems.',
    },
    {
      title: 'Dev Containers',
      level: 'intermediate',
      summary: 'Your whole development setup (tools, SDKs, extensions) defined as a container.',
      simple:
        'A fully packed backpack for coding. Any new teammate grabs it and has the same tools in minutes.',
      points: [
        'Defined in <code>.devcontainer/devcontainer.json</code>, often pointing at a Dockerfile or compose file.',
        'Supported by VS Code, IntelliJ, GitHub Codespaces and the <code>devcontainer</code> CLI.',
        'Same JDK, Node and CLI versions for everyone; no "install these 12 things" wiki.',
        'Ready-made "features" add tools like the Java SDK or Docker-in-Docker.',
      ],
    },
    {
      title: 'Compose in Production',
      level: 'advanced',
      summary: 'Fine for one server; for many servers and self-healing, move to an orchestrator.',
      points: [
        'Works well for small apps on one VM with restart policies.',
        'No built-in multi-host scheduling, rolling updates across nodes or autoscaling.',
        'Next step is usually Kubernetes or a managed container service (ECS, Cloud Run).',
      ],
    },
  ],
};
