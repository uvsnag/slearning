import type { KmNode } from '../../types';

export const builds: KmNode = {
  title: 'Builds & Optimization',
  level: 'intermediate',
  summary: 'Use the build cache well, split builds into stages, and ship small images.',
  simple:
    'A smart builder reuses yesterday’s work and only redoes what changed. A smart shipper sends only the finished product, not the tools.',
  points: [
    'Good layer order turns a 5-minute build into a 10-second one.',
    'Multi-stage builds keep compilers and dev dependencies out of production.',
    'Smaller images pull faster, start faster and have fewer vulnerabilities.',
  ],
  children: [
    {
      title: 'Build Cache',
      level: 'intermediate',
      summary:
        'Docker reuses a layer if its instruction and inputs didn’t change, and rebuilds everything after the first change.',
      simple:
        'Like a row of dominoes: once one layer changes, every layer after it has to be rebuilt.',
      points: [
        'For <code>COPY</code>, the cache key includes the copied files’ contents.',
        'Copy <code>package.json</code> or <code>pom.xml</code> first, install deps, then copy source.',
        'Now editing code doesn’t re-download all dependencies.',
        '<code>--no-cache</code> forces a full rebuild.',
      ],
      tip: 'COPY . . near the top of the Dockerfile is the most common reason builds are slow.',
    },
    {
      title: 'Multi-stage Builds',
      level: 'intermediate',
      summary: 'Use one stage to build and a clean, small stage to run, copying only the result.',
      simple:
        'Bake in the full kitchen, then put just the cake in a small box. The oven and mixing bowls stay behind.',
      points: [
        'Each <code>FROM … AS name</code> starts a new stage.',
        'Final stage copies artifacts: <code>COPY --from=build /app/target/app.jar .</code>.',
        'Java: build with a JDK + Maven image, run with a JRE-only image.',
        'Node: build with dev deps, run with <code>npm ci --omit=dev</code> output only.',
        '<code>--target build</code> stops at a named stage (handy for tests).',
      ],
    },
    {
      title: 'BuildKit',
      level: 'intermediate',
      summary:
        'Docker’s modern build engine: parallel stages, better caching and secret/cache mounts.',
      simple: 'The upgraded builder that works on several steps at once and remembers more.',
      points: [
        'Default builder since Docker Engine 23.0; <code>docker buildx</code> is its CLI.',
        'Skips stages the final image doesn’t need and runs independent stages in parallel.',
        'Cache mounts keep package caches between builds: <code>RUN --mount=type=cache,target=/root/.m2 mvn package</code>.',
        'Exports cache to a registry for CI: <code>--cache-to</code> / <code>--cache-from</code>.',
      ],
    },
    {
      title: 'Multi-platform Images',
      level: 'advanced',
      summary:
        'Build one image tag that works on both amd64 (Intel/AMD) and arm64 (Apple Silicon, Graviton).',
      points: [
        '<code>docker buildx build --platform linux/amd64,linux/arm64 --push .</code>',
        'The registry stores a manifest list; each machine pulls its own variant.',
        'Emulation (QEMU) works but is slow; cross-compiling or native builders are faster.',
        'Classic bug: built on an M-series Mac, crashes on an amd64 server with "exec format error".',
      ],
    },
    {
      title: 'Small Images',
      level: 'intermediate',
      summary:
        'Ways to cut image size: smaller bases, fewer files, no build tools in the final stage.',
      simple: 'Pack only what you’ll wear on the trip, not your whole wardrobe.',
      points: [
        'Use <code>-slim</code>, <code>alpine</code> or distroless bases.',
        'Multi-stage: final image has only runtime + app.',
        'Clean package caches in the same <code>RUN</code> (<code>rm -rf /var/lib/apt/lists/*</code>).',
        'Use <code>.dockerignore</code> so tests, docs and <code>.git</code> stay out.',
        'Check results with <code>docker history</code> or <code>dive</code>.',
      ],
    },
    {
      title: 'Distroless & scratch',
      level: 'advanced',
      summary: 'Final images with only your app and its runtime: no shell, no package manager.',
      points: [
        'Google distroless images exist for Java, Node, Python and static binaries.',
        '<code>scratch</code> is completely empty; good for static Go or Rust binaries.',
        'Fewer packages means fewer CVEs and a smaller attack surface.',
        'Downside: no shell to debug with; use debug variants or <code>docker debug</code>.',
      ],
    },
    {
      title: 'Reproducible Builds',
      level: 'advanced',
      summary:
        'Make the same source produce the same image, so builds are predictable and traceable.',
      points: [
        'Pin base images by digest, not only by tag.',
        'Use lock files: <code>npm ci</code> with <code>package-lock.json</code>, Maven with fixed versions.',
        'Add labels with git SHA and build date (OCI annotations).',
        'Generate an SBOM (software bill of materials) and provenance with <code>--sbom</code> / <code>--provenance</code>.',
      ],
    },
  ],
};
