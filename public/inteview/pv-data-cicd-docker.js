// Interview data: cicd, docker
// Auto-generated from pv.html
(function () {
  (window.__pvTopics = window.__pvTopics || []).push(
  {
          id: 'cicd',
          name: 'CI/CD',
          icon: '🔄',
          questions: [
            {
              q: 'What is CI/CD? Explain the difference between Continuous Integration, Delivery, and Deployment.',
              difficulty: 'easy',
              a: `<ul>
<li><strong>Continuous Integration (CI)</strong>: developers merge code frequently → automated build + test on every commit. Catch issues early.</li>
<li><strong>Continuous Delivery</strong>: code is always in a deployable state. Deployment to production is <strong>manual</strong> (one-click).</li>
<li><strong>Continuous Deployment</strong>: every change that passes all stages is <strong>automatically</strong> deployed to production. No manual gate.</li>
</ul>
<div class="key-point">Delivery = can deploy anytime. Deployment = auto-deploy always.</div>`,
            },
            {
              q: 'Describe a typical CI/CD pipeline with stages.',
              difficulty: 'medium',
              a: `<ol>
<li><strong>Source</strong>: code push / PR triggers pipeline.</li>
<li><strong>Build</strong>: compile, resolve dependencies, create artifact.</li>
<li><strong>Test</strong>: unit tests → integration tests → E2E tests.</li>
<li><strong>Security Scan</strong>: SAST, dependency vulnerability check (Snyk, SonarQube).</li>
<li><strong>Staging Deploy</strong>: deploy to staging environment.</li>
<li><strong>Acceptance Tests</strong>: smoke tests, UAT.</li>
<li><strong>Production Deploy</strong>: blue-green, canary, or rolling deployment.</li>
<li><strong>Post-deploy</strong>: health checks, monitoring, rollback plan.</li>
</ol>`,
            },
            {
              q: 'What are Blue-Green, Canary, and Rolling deployment strategies?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Blue-Green</strong>: two identical environments. Switch traffic from blue (old) to green (new). Instant rollback by switching back.</li>
<li><strong>Canary</strong>: route a small % of traffic to new version. Gradually increase if healthy. Best for large-scale services.</li>
<li><strong>Rolling</strong>: update instances one by one. No extra infrastructure needed. Risk: mixed versions during deploy.</li>
</ul>
<div class="key-point">Blue-green doubles infrastructure cost. Canary needs good observability (metrics, logs, alerts) to detect issues.</div>`,
            },
            {
              q: 'Explain GitFlow vs Trunk-Based Development.',
              difficulty: 'medium',
              a: `<ul>
<li><strong>GitFlow</strong>: long-lived branches (develop, feature, release, hotfix). Good for scheduled releases. Complex.</li>
<li><strong>Trunk-Based</strong>: everyone commits to main/trunk. Short-lived feature branches (&lt;1 day). Feature flags for incomplete code.</li>
</ul>
<div class="key-point">Trunk-based development is preferred for CI/CD. Frequent small merges → fewer conflicts → faster feedback.</div>`,
            },
            {
              q: 'What are GitHub Actions? Explain workflow, job, step.',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Workflow</strong>: YAML file in <code>.github/workflows/</code>. Triggered by events (push, PR, schedule).</li>
<li><strong>Job</strong>: runs on a runner (VM). Jobs run in parallel by default; use <code>needs</code> for dependencies.</li>
<li><strong>Step</strong>: individual task within a job. Can be an action or a shell command.</li>
</ul>
<pre>name: CI
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
      - run: npm ci
      - run: npm test</pre>`,
            },
            {
              q: 'How do you handle secrets and environment variables in CI/CD?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Never</strong> commit secrets to code. Use pipeline secret management.</li>
<li><strong>GitHub</strong>: Settings → Secrets → accessed via <code>\${{ secrets.API_KEY }}</code>.</li>
<li><strong>Jenkins</strong>: Credentials plugin + <code>withCredentials</code> block.</li>
<li><strong>Vault/AWS Secrets Manager</strong>: centralized secret storage, rotation, audit.</li>
<li>Environment-specific configs via <code>.env</code> files (not committed) or pipeline environment variables.</li>
</ul>
<div class="key-point">Rotate secrets regularly. Use OIDC for cloud deployments instead of long-lived tokens.</div>`,
            },
            {
              q: 'What is Infrastructure as Code (IaC)? How does it relate to CI/CD?',
              difficulty: 'medium',
              a: `<p><strong>IaC</strong>: manage infrastructure through code/config files, versioned in Git.</p>
<ul>
<li><strong>Terraform</strong>: cloud-agnostic, declarative (HCL). Plan → Apply.</li>
<li><strong>AWS CloudFormation</strong>: AWS-specific, YAML/JSON templates.</li>
<li><strong>Ansible</strong>: configuration management, procedural.</li>
<li><strong>Pulumi</strong>: IaC using real programming languages.</li>
</ul>
<div class="key-point">CI/CD pipeline: run <code>terraform plan</code> on PR (review changes), <code>terraform apply</code> on merge to main.</div>`,
            },
            {
              q: 'How do you implement rollback strategies in CI/CD?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Artifact-based rollback</strong>: redeploy previous known-good artifact. Fast.</li>
<li><strong>Blue-green switch</strong>: route traffic back to old environment.</li>
<li><strong>Feature flags</strong>: disable the feature without deploying.</li>
<li><strong>Database rollback</strong>: versioned migrations (Flyway/Liquibase) with rollback scripts.</li>
<li><strong>GitOps</strong>: revert the commit in the config repo → ArgoCD/Flux auto-applies.</li>
</ul>
<div class="key-point">Always make database migrations backward-compatible (expand-contract pattern) so rollback is safe.</div>`,
            },
            {
              q: 'What is the difference between Jenkins, GitLab CI, and GitHub Actions?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Jenkins</strong>: self-hosted, plugin-based, Jenkinsfile (Groovy). Maximum flexibility, high maintenance.</li>
<li><strong>GitLab CI</strong>: built into GitLab. <code>.gitlab-ci.yml</code>. Great for all-in-one (SCM + CI + registry + deploy).</li>
<li><strong>GitHub Actions</strong>: built into GitHub. YAML workflows. Huge marketplace. Best for open-source.</li>
</ul>
<div class="key-point">All three can do the same things. Choice depends on: existing SCM, team expertise, hosting requirements.</div>`,
            },
            {
              q: 'What are pipeline artifacts and caching? How to speed up CI?',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Artifacts</strong>: build outputs passed between jobs/stages (JARs, binaries, reports).</li>
<li><strong>Caching</strong>: persist dependencies between runs (<code>node_modules</code>, <code>.m2</code>, <code>.gradle</code>).</li>
</ul>
<p><strong>Speed up strategies</strong>:</p>
<ul>
<li>Cache dependencies aggressively.</li>
<li>Parallelize test suites.</li>
<li>Use incremental builds.</li>
<li>Run only affected tests on PRs (monorepo tools: Nx, Turborepo).</li>
<li>Use smaller/focused Docker images for CI runners.</li>
</ul>`,
            },
            {
              q: 'What is GitOps? How does it work?',
              difficulty: 'hard',
              a: `<p><strong>GitOps</strong>: Git is the single source of truth for infrastructure AND application deployment.</p>
<ul>
<li>Desired state is declared in Git (Kubernetes manifests, Helm charts).</li>
<li>A controller (ArgoCD, Flux) watches the repo and reconciles cluster state.</li>
<li>Changes go through PRs → automated deployment. No direct <code>kubectl apply</code>.</li>
</ul>
<div class="key-point">Benefits: audit trail (Git history), easy rollback (revert commit), consistent environments, self-healing.</div>`,
            },
            {
              q: 'How do you test in a CI/CD pipeline? Explain the testing pyramid.',
              difficulty: 'medium',
              a: `<p><strong>Testing pyramid</strong> (bottom to top):</p>
<ol>
<li><strong>Unit tests</strong> (most): fast, isolated, mock dependencies. Run on every commit.</li>
<li><strong>Integration tests</strong>: test interactions between components, real DB/API calls.</li>
<li><strong>E2E tests</strong> (fewest): simulate real user. Cypress, Playwright. Slow, fragile.</li>
</ol>
<p><strong>In CI pipeline</strong>:</p>
<ul>
<li>Unit tests: every push.</li>
<li>Integration tests: PR merge or staging deploy.</li>
<li>E2E tests: pre-production only (avoid blocking fast feedback).</li>
</ul>`,
            },
          ],
        },

        // ───────────────────────── 5. DOCKER ─────────────────────────,
  {
          id: 'docker',
          name: 'Docker',
          icon: '🐳',
          questions: [
            {
              q: 'What is Docker? How is it different from a Virtual Machine?',
              difficulty: 'easy',
              a: `<ul>
<li><strong>Docker</strong>: OS-level virtualization. Containers share the host kernel. Lightweight, fast startup.</li>
<li><strong>VM</strong>: hardware-level virtualization. Each VM has its own OS. Heavy, slow startup.</li>
</ul>
<table style="width:100%;border-collapse:collapse;margin:10px 0;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;"></th><th style="padding:6px;border-bottom:1px solid #ccc;">Docker</th><th style="padding:6px;border-bottom:1px solid #ccc;">VM</th></tr>
<tr><td style="padding:6px;">Startup</td><td style="padding:6px;">Seconds</td><td style="padding:6px;">Minutes</td></tr>
<tr><td style="padding:6px;">Size</td><td style="padding:6px;">MBs</td><td style="padding:6px;">GBs</td></tr>
<tr><td style="padding:6px;">Isolation</td><td style="padding:6px;">Process-level</td><td style="padding:6px;">Full OS</td></tr>
<tr><td style="padding:6px;">Performance</td><td style="padding:6px;">Near native</td><td style="padding:6px;">Overhead</td></tr>
</table>`,
            },
            {
              q: 'Explain Docker architecture: Engine, Daemon, CLI, Images, Containers, Registry.',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Docker Engine</strong>: client-server app (CLI + daemon + containerd).</li>
<li><strong>Docker Daemon</strong> (<code>dockerd</code>): background process managing containers, images, networks, volumes.</li>
<li><strong>Docker CLI</strong>: command-line client talks to daemon via REST API.</li>
<li><strong>Image</strong>: read-only template with layers. Built from Dockerfile.</li>
<li><strong>Container</strong>: running instance of an image. Writable layer on top.</li>
<li><strong>Registry</strong>: stores images (Docker Hub, ECR, GCR).</li>
</ul>`,
            },
            {
              q: 'What is a Dockerfile? Explain key instructions.',
              difficulty: 'medium',
              a: `<pre>FROM node:20-alpine          # base image
WORKDIR /app                  # set working directory
COPY package*.json ./         # copy dependency files
RUN npm ci --production       # install dependencies
COPY . .                      # copy source code
EXPOSE 3000                   # document port (doesn't publish)
USER node                     # run as non-root
CMD ["node", "server.js"]     # default command</pre>
<ul>
<li><code>FROM</code>: base image (every Dockerfile starts with this).</li>
<li><code>RUN</code>: execute command during build (creates new layer).</li>
<li><code>COPY</code> vs <code>ADD</code>: COPY is simpler; ADD can extract tars and fetch URLs.</li>
<li><code>CMD</code> vs <code>ENTRYPOINT</code>: CMD is overridable; ENTRYPOINT is fixed (use both for default args pattern).</li>
</ul>`,
            },
            {
              q: 'How do Docker layers work? How to optimize image size?',
              difficulty: 'hard',
              a: `<p>Each instruction creates a <strong>read-only layer</strong>. Layers are cached and shared between images.</p>
<p><strong>Optimization strategies</strong>:</p>
<ul>
<li>Use <strong>multi-stage builds</strong>: build in one stage, copy only artifacts to final slim image.</li>
<li>Order instructions from least to most frequently changed (dependencies before source code).</li>
<li>Combine RUN commands to reduce layers.</li>
<li>Use <code>.dockerignore</code> to exclude unnecessary files.</li>
<li>Use slim/alpine base images.</li>
</ul>
<pre># Multi-stage build
FROM node:20 AS builder
WORKDIR /app
COPY . .
RUN npm ci && npm run build

FROM node:20-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]</pre>`,
            },
            {
              q: 'What is the difference between CMD and ENTRYPOINT?',
              difficulty: 'tricky',
              a: `<ul>
<li><strong>CMD</strong>: default command. Can be <strong>overridden</strong> by <code>docker run &lt;image&gt; &lt;command&gt;</code>.</li>
<li><strong>ENTRYPOINT</strong>: fixed executable. Args from <code>docker run</code> are appended.</li>
</ul>
<pre>ENTRYPOINT ["python", "app.py"]
CMD ["--port", "8080"]

docker run myapp                  # python app.py --port 8080
docker run myapp --port 9090      # python app.py --port 9090
docker run myapp bash             # python app.py bash (!) </pre>
<div class="key-point">Best practice: use ENTRYPOINT for the main executable, CMD for default arguments.</div>`,
            },
            {
              q: 'Explain Docker networking: bridge, host, none, overlay.',
              difficulty: 'hard',
              a: `<ul>
<li><strong>bridge</strong> (default): isolated network. Containers communicate via container name/IP. Port mapping needed for host access.</li>
<li><strong>host</strong>: container shares host's network stack. No isolation. Best performance.</li>
<li><strong>none</strong>: no networking. Complete isolation.</li>
<li><strong>overlay</strong>: spans multiple Docker hosts (Swarm/Kubernetes). Encrypted communication.</li>
</ul>
<pre>docker network create mynet
docker run --network mynet --name api myapi
docker run --network mynet --name db postgres
# api can reach db via hostname "db"</pre>`,
            },
            {
              q: 'What are Docker volumes? Named volume vs bind mount vs tmpfs.',
              difficulty: 'medium',
              a: `<ul>
<li><strong>Named volume</strong>: managed by Docker. Stored in <code>/var/lib/docker/volumes/</code>. Best for data persistence.</li>
<li><strong>Bind mount</strong>: maps host directory to container. Best for development (code syncing).</li>
<li><strong>tmpfs</strong>: in-memory, non-persistent. Best for sensitive data (secrets, temp files).</li>
</ul>
<pre># Named volume
docker run -v mydata:/var/lib/mysql mysql

# Bind mount
docker run -v $(pwd)/src:/app/src node

# tmpfs
docker run --tmpfs /tmp myapp</pre>`,
            },
            {
              q: 'What is Docker Compose? Explain key sections.',
              difficulty: 'medium',
              a: `<p>Docker Compose defines and runs <strong>multi-container</strong> applications in a single YAML file.</p>
<pre>version: '3.8'
services:
  api:
    build: ./api
    ports: ["3000:3000"]
    environment:
      DB_HOST: db
    depends_on:
      db:
        condition: service_healthy
  db:
    image: postgres:15
    volumes: [pgdata:/var/lib/postgresql/data]
    healthcheck:
      test: pg_isready -U postgres
      interval: 5s
volumes:
  pgdata:</pre>
<div class="key-point"><code>depends_on</code> with <code>condition: service_healthy</code> ensures DB is ready before API starts.</div>`,
            },
            {
              q: 'What are Docker security best practices?',
              difficulty: 'hard',
              a: `<ul>
<li>Run as <strong>non-root</strong> user (<code>USER node</code>).</li>
<li>Use <strong>minimal base images</strong> (Alpine, distroless).</li>
<li>Scan images for vulnerabilities (<code>docker scout</code>, Trivy, Snyk).</li>
<li>Don't store secrets in images. Use build-time secrets (<code>--mount=type=secret</code>) or runtime env.</li>
<li>Use <strong>read-only filesystem</strong>: <code>docker run --read-only</code>.</li>
<li>Set resource limits: <code>--memory</code>, <code>--cpus</code>.</li>
<li>Pin image versions (avoid <code>:latest</code>).</li>
<li>Use <code>.dockerignore</code> to exclude <code>.env</code>, <code>.git</code>, <code>node_modules</code>.</li>
</ul>`,
            },
            {
              q: 'What is the difference between Docker Swarm and Kubernetes?',
              difficulty: 'hard',
              a: `<ul>
<li><strong>Docker Swarm</strong>: simple orchestration built into Docker. Easy setup. Limited features.</li>
<li><strong>Kubernetes (K8s)</strong>: industry standard. Rich ecosystem, auto-scaling, self-healing, rolling updates, service mesh. Steeper learning curve.</li>
</ul>
<table style="width:100%;border-collapse:collapse;margin:10px 0;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;"></th><th style="padding:6px;border-bottom:1px solid #ccc;">Swarm</th><th style="padding:6px;border-bottom:1px solid #ccc;">K8s</th></tr>
<tr><td style="padding:6px;">Setup</td><td style="padding:6px;">Simple</td><td style="padding:6px;">Complex</td></tr>
<tr><td style="padding:6px;">Scaling</td><td style="padding:6px;">Manual</td><td style="padding:6px;">Auto (HPA)</td></tr>
<tr><td style="padding:6px;">Networking</td><td style="padding:6px;">Overlay</td><td style="padding:6px;">CNI plugins</td></tr>
<tr><td style="padding:6px;">Community</td><td style="padding:6px;">Declining</td><td style="padding:6px;">Massive</td></tr>
</table>`,
            },
            {
              q: 'How does Docker image caching work in CI/CD?',
              difficulty: 'hard',
              a: `<p>Docker caches each layer. If a layer's instruction + context haven't changed, the cache is used.</p>
<p><strong>In CI (no local cache)</strong>:</p>
<ul>
<li><strong>BuildKit cache mount</strong>: <code>--mount=type=cache,target=/root/.npm</code></li>
<li><strong>Registry cache</strong>: <code>docker buildx build --cache-from=type=registry,ref=myrepo:cache --cache-to=type=registry,ref=myrepo:cache</code></li>
<li><strong>GitHub Actions cache</strong>: <code>actions/cache</code> with Docker layer cache.</li>
</ul>
<div class="key-point">Order Dockerfile: OS packages → language runtime → dependencies → source code. Only last layers rebuild on code change.</div>`,
            },
            {
              q: 'What is a Docker health check and how to implement it?',
              difficulty: 'medium',
              a: `<p>Health checks let Docker know if a container is functioning properly.</p>
<pre># In Dockerfile
HEALTHCHECK --interval=30s --timeout=3s --retries=3 \\
  CMD curl -f http://localhost:3000/health || exit 1

# In docker-compose.yml
healthcheck:
  test: ["CMD", "curl", "-f", "http://localhost:3000/health"]
  interval: 30s
  timeout: 3s
  retries: 3
  start_period: 10s</pre>
<p>States: <code>starting</code> → <code>healthy</code> / <code>unhealthy</code>. Orchestrators use this for restart policies and load balancing.</p>`,
            },
          ],
        },

        // ───────────────────────── 6. SQL ─────────────────────────
  );
})();
