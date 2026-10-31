import type { KmNode } from '../../types';

export const images: KmNode = {
  title: 'Images & Registries',
  level: 'beginner',
  summary:
    'How images are made of layers, how they are named, and where they are stored and shared.',
  simple:
    'An image is a stack of transparent sheets. Each sheet adds or changes some files, and together they form the final picture.',
  points: [
    'Images are built from read-only layers that are shared and cached.',
    'A name like <code>nginx:1.27</code> is repository + tag.',
    'Registries store images so others (and servers) can pull them.',
  ],
  children: [
    {
      title: 'Layers',
      level: 'beginner',
      summary:
        'Each build step that changes files adds a read-only layer; images are stacks of layers.',
      simple:
        'Like a lasagne. Every step adds a sheet. If two images start with the same bottom sheets, Docker stores those only once.',
      points: [
        '<code>RUN</code>, <code>COPY</code> and <code>ADD</code> create layers; most other instructions only add metadata.',
        'Layers are shared between images, saving disk and download time.',
        'Deleting a file in a later layer hides it but doesn’t shrink the image.',
        '<code>docker history &lt;image&gt;</code> shows each layer and its size.',
      ],
      tip: 'Install and clean up in the same RUN step, or the junk stays in an earlier layer forever.',
    },
    {
      title: 'Tags & Digests',
      level: 'beginner',
      summary:
        'A tag is a movable label like 1.27 or latest; a digest is a fixed fingerprint of the exact image.',
      simple:
        'A tag is a nickname that can move to a new person. A digest is a fingerprint that always means the same one.',
      points: [
        'Full name: <code>registry/namespace/repo:tag</code>, e.g. <code>ghcr.io/acme/api:2.1.0</code>.',
        'No tag means <code>:latest</code>, which is just a default name, not "newest".',
        'Digest form: <code>nginx@sha256:…</code> never changes.',
        'Tag your own images with versions or git commit SHAs.',
      ],
      tip: 'Never deploy :latest to production. You can’t tell what version is running or roll back reliably.',
    },
    {
      title: 'Registries',
      level: 'beginner',
      summary:
        'Servers that store and serve images: Docker Hub, GitHub, cloud registries or your own.',
      simple: 'A registry is an app store for images. You push to upload and pull to download.',
      points: [
        'Docker Hub is the default; official images have no namespace (<code>postgres</code>).',
        'Others: GitHub Container Registry, AWS ECR, Google Artifact Registry, Azure ACR, Harbor.',
        '<code>docker login</code>, <code>docker push</code>, <code>docker pull</code>.',
        'Docker Hub limits anonymous pulls; log in or use a mirror in CI.',
      ],
    },
    {
      title: 'Choosing a Base Image',
      level: 'intermediate',
      summary: 'The FROM image decides size, security patches and what tools exist inside.',
      simple:
        'The base image is the foundation of your house. A small, solid foundation means fewer cracks (vulnerabilities) to fix later.',
      points: [
        'Prefer official or verified images, pinned to a version: <code>node:22-slim</code>.',
        '<code>-slim</code> (Debian) is a safe default; <code>alpine</code> is tiny but uses musl libc.',
        'Distroless and Docker Hardened Images have no shell or package manager.',
        'Update the base image regularly to pick up security fixes.',
      ],
      tip: 'Alpine’s musl libc can break native modules or change DNS behavior. If something acts weird on Alpine, try -slim.',
    },
    {
      title: 'Inspecting Images',
      level: 'intermediate',
      summary: 'Commands and tools to see what an image contains and how big each part is.',
      simple: 'Before you eat it, read the label: what’s inside, how big, and who made it.',
      points: [
        '<code>docker images</code> lists local images; <code>docker image inspect</code> shows config.',
        '<code>docker history</code> shows layer sizes and the commands that made them.',
        'The <code>dive</code> tool lets you browse each layer’s files.',
        '<code>docker image prune</code> removes dangling (untagged) images.',
      ],
    },
    {
      title: 'Save, Load & Export',
      level: 'intermediate',
      summary: 'Move images without a registry, e.g. into an offline network.',
      simple: 'Like copying a game to a USB stick instead of downloading it from the store.',
      points: [
        '<code>docker save</code> writes an image (with layers and tags) to a tar file.',
        '<code>docker load</code> imports it on another machine.',
        '<code>docker export</code> dumps a container’s filesystem only, losing layers and metadata.',
      ],
    },
  ],
};

export const containers: KmNode = {
  title: 'Running Containers',
  level: 'beginner',
  summary: 'Start, stop, connect to and clean up containers, and pass them ports and settings.',
  simple:
    'Once you have an image, docker run turns it into a living app. This branch is about driving that app day to day.',
  points: [
    '<code>docker run</code> = create + start a container from an image.',
    'Ports and environment variables connect the container to the outside.',
    'Containers are disposable: stop, delete, start a fresh one.',
  ],
  children: [
    {
      title: 'docker run',
      level: 'beginner',
      summary: 'The main command: create a container from an image and start it, with options.',
      simple:
        'Like ordering a meal with notes: "to go, extra sauce, no onions". The flags are your notes.',
      points: [
        '<code>-d</code> runs in the background; <code>-it</code> gives you an interactive terminal.',
        '<code>--name api</code> gives a friendly name instead of a random one.',
        '<code>--rm</code> deletes the container when it stops.',
        'Anything after the image name replaces the default command: <code>docker run -it node:22 bash</code>.',
      ],
    },
    {
      title: 'Container Lifecycle',
      level: 'beginner',
      summary: 'Containers move through created, running, paused, stopped (exited) and removed.',
      simple:
        'Like a phone app: installed, open, in the background, closed, uninstalled. Closing it doesn’t delete it.',
      points: [
        '<code>docker create</code> / <code>start</code> / <code>stop</code> / <code>restart</code> / <code>rm</code>.',
        '<code>docker stop</code> sends SIGTERM, waits 10 seconds, then SIGKILL.',
        'A stopped container keeps its writable layer until you remove it.',
        'The container lives as long as its main process (PID 1) runs.',
      ],
      tip: 'A container that exits right away usually has no long-running main process. Check docker logs.',
    },
    {
      title: 'Publishing Ports',
      level: 'beginner',
      summary: 'Map a host port to a container port so you can reach the app from outside.',
      simple:
        'The container has its own private phone line. -p forwards calls from your public number to that private line.',
      points: [
        'Syntax: <code>-p HOST:CONTAINER</code>, e.g. <code>-p 8080:3000</code>.',
        'Bind to localhost only: <code>-p 127.0.0.1:8080:3000</code>.',
        'Your app must listen on <code>0.0.0.0</code> inside the container, not <code>127.0.0.1</code>.',
        'Published ports on Linux can bypass ufw firewall rules; bind to localhost when unsure.',
      ],
      tip: '"Connection refused" from outside but works inside? The app is probably listening on 127.0.0.1 in the container.',
    },
    {
      title: 'Environment Variables',
      level: 'beginner',
      summary: 'Pass config into a container at run time instead of baking it into the image.',
      simple: 'One image, many settings: same coffee machine, different cup size per order.',
      points: [
        '<code>-e DB_HOST=db</code> sets one variable; <code>--env-file .env</code> loads a file.',
        'Same image for dev, test and prod; only config changes (12-factor style).',
        'Env vars are visible in <code>docker inspect</code>, so they are not great for secrets.',
      ],
      detail: `<pre><code>// Node: read config with safe defaults
const port = Number(process.env.PORT ?? 3000);
const dbUrl = process.env.DATABASE_URL;
if (!dbUrl) throw new Error('DATABASE_URL is required');</code></pre>`,
    },
    {
      title: 'exec, logs & attach',
      level: 'beginner',
      summary: 'Look inside a running container: open a shell, read its output, follow its logs.',
      simple: 'exec is walking into the room; logs is reading the diary the app keeps.',
      points: [
        '<code>docker exec -it api sh</code> opens a shell in a running container.',
        '<code>docker logs -f api</code> follows stdout/stderr output.',
        '<code>docker cp</code> copies files in or out.',
        'Apps should log to stdout/stderr, not to files inside the container.',
      ],
    },
    {
      title: 'Containers are Ephemeral',
      level: 'beginner',
      summary:
        'Treat containers as throwaway: anything not in a volume is lost when the container is removed.',
      simple:
        'A container is a hotel room. Leave your stuff there and it’s gone at checkout. Valuables go in the safe (a volume).',
      points: [
        'Never fix things by hand inside a running container; rebuild the image.',
        'Store data in volumes or external services (database, object storage).',
        'This makes scaling and replacing containers safe and boring.',
      ],
    },
    {
      title: 'Cleaning Up',
      level: 'beginner',
      summary: 'Remove old containers, images, volumes and build cache to free disk space.',
      simple: 'Docker collects clutter like a garage. Every now and then, take out the trash.',
      points: [
        '<code>docker system df</code> shows what uses space.',
        '<code>docker container prune</code>, <code>image prune</code>, <code>builder prune</code>.',
        '<code>docker system prune -a</code> removes everything unused (careful).',
        'Add <code>--volumes</code> only if you really want to delete unused data volumes.',
      ],
    },
    {
      title: 'Container Inspect & Stats',
      level: 'intermediate',
      summary: 'See a container’s full config and live CPU and memory use.',
      simple: 'inspect is the container’s ID card; stats is its heart-rate monitor.',
      points: [
        '<code>docker inspect api</code> returns JSON: IP, mounts, env, restart policy, health.',
        'Filter with Go templates: <code>--format "{{.State.Status}}"</code>.',
        '<code>docker stats</code> shows live CPU, memory, network and disk I/O.',
        '<code>docker top api</code> lists the processes inside.',
      ],
    },
  ],
};
