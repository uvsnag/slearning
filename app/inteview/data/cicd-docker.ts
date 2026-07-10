// Interview data: cicd, docker
// Auto-generated from pv.html
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
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
<pre>git push → CI: build + unit tests + integration tests → artifact ✔
  Continuous Delivery:   → deploy staging → [MANUAL approval] → production
  Continuous Deployment: → deploy staging → automated checks  → production (no human gate)</pre>
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
</ol>
<pre># The same stages as a GitHub Actions workflow:
name: pipeline
on: [push]
jobs:
  build-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: mvn -B verify                    # build + unit + integration tests
      - uses: actions/upload-artifact@v4
        with: { name: app-jar, path: target/*.jar }
  security-scan:
    needs: build-test                          # runs after build-test
    steps: [ ... Snyk / Trivy / SonarQube ... ]
  deploy-staging:
    needs: security-scan
    environment: staging                       # env-scoped secrets
    steps: [ ... deploy + smoke tests ... ]
  deploy-production:
    needs: deploy-staging
    environment: production                    # requires manual approval
    steps: [ ... canary rollout + health checks ... ]</pre>`,
      },
      {
        q: 'What are Blue-Green, Canary, and Rolling deployment strategies?',
        difficulty: 'hard',
        a: `<ul>
<li><strong>Blue-Green</strong>: two identical environments. Switch traffic from blue (old) to green (new). Instant rollback by switching back.</li>
<li><strong>Canary</strong>: route a small % of traffic to new version. Gradually increase if healthy. Best for large-scale services.</li>
<li><strong>Rolling</strong>: update instances one by one. No extra infrastructure needed. Risk: mixed versions during deploy.</li>
</ul>
<pre># Blue-Green: flip the load balancer between two identical environments
LB → blue  (v1.4) 100%          LB → green (v1.5) 100%
     green (v1.5)   0%    ⇒          blue  (v1.4)   0%   (kept warm for instant rollback)

# Canary: shift traffic gradually while watching error rate / latency
v1.5 gets 5% → metrics healthy → 25% → 50% → 100%

# Rolling update in Kubernetes (default strategy):
spec:
  strategy:
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }   # zero downtime
kubectl set image deploy/api api=myapi:v1.5
kubectl rollout status deploy/api
kubectl rollout undo deploy/api                          # rollback</pre>
<div class="key-point">Blue-green doubles infrastructure cost. Canary needs good observability (metrics, logs, alerts) to detect issues.</div>`,
      },
      {
        q: 'Explain GitFlow vs Trunk-Based Development.',
        difficulty: 'medium',
        a: `<ul>
<li><strong>GitFlow</strong>: long-lived branches (develop, feature, release, hotfix). Good for scheduled releases. Complex.</li>
<li><strong>Trunk-Based</strong>: everyone commits to main/trunk. Short-lived feature branches (&lt;1 day). Feature flags for incomplete code.</li>
</ul>
<pre># GitFlow — many long-lived branches
main     ──●─────────────●────   (production releases only)
release        ╲        ╱
develop  ──●──●──●──●──●─────
feature      ╲────●────╱         (lives for days/weeks → big merges)

# Trunk-Based — one branch that is always releasable
main     ──●──●──●──●──●──●──    (every commit builds + deploys)
feature     ╲●╱  ╲●╱             (&lt; 1 day, tiny PRs)
# unfinished work ships dark, hidden behind feature flags</pre>
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
<pre># GitHub Actions — secrets are masked in logs
jobs:
  deploy:
    environment: production        # env-scoped secrets + approval rule
    steps:
      - run: ./deploy.sh
        env:
          API_KEY: \${{ secrets.API_KEY }}

# Better for cloud deploys: OIDC — short-lived token, nothing stored at all
      - uses: aws-actions/configure-aws-credentials@v4
        with:
          role-to-assume: arn:aws:iam::123456789:role/deploy-role
          aws-region: ap-southeast-1</pre>
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
<pre># main.tf — declarative: you describe WHAT, Terraform figures out HOW
resource "aws_instance" "api" {
  ami           = "ami-0abc1234"
  instance_type = "t3.small"
  tags = { Name = "api-server" }
}

# In the pipeline:
terraform init
terraform plan    # on PR: reviewers see the exact infra diff
terraform apply   # on merge to main: change is applied
# State file records what exists → same config always converges to same infra</pre>
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
<pre># Kubernetes — back to the previous ReplicaSet in seconds
kubectl rollout undo deployment/api
kubectl rollout undo deployment/api --to-revision=3

# GitOps — rollback is just a revert
git revert HEAD && git push        # ArgoCD reconciles the cluster back

# Artifact-based — redeploy the last known-good immutable tag
docker service update --image registry/myapi:1.4.2 api</pre>
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
<pre># Jenkins — Jenkinsfile (Groovy DSL, self-hosted, plugins)
pipeline {
  agent any
  stages {
    stage('Test') { steps { sh 'npm test' } }
  }
}

# GitLab CI — .gitlab-ci.yml
test:
  stage: test
  script: [npm test]

# GitHub Actions — .github/workflows/ci.yml
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm test</pre>
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
</ul>
<pre># GitHub Actions: cache Maven dependencies between runs
- uses: actions/cache@v4
  with:
    path: ~/.m2/repository
    key: maven-\${{ hashFiles('**/pom.xml') }}   # new cache only when deps change

# Pass the build output to later jobs as an artifact
- uses: actions/upload-artifact@v4
  with: { name: app-jar, path: target/app.jar }
# ...in the deploy job:
- uses: actions/download-artifact@v4
  with: { name: app-jar }</pre>`,
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
<pre># ArgoCD Application: "keep the cluster in sync with this repo path"
apiVersion: argoproj.io/v1alpha1
kind: Application
spec:
  source:
    repoURL: https://github.com/company/k8s-config
    path: apps/api/production
    targetRevision: main
  destination: { server: https://kubernetes.default.svc }
  syncPolicy:
    automated: { prune: true, selfHeal: true }   # drift is auto-corrected

# Deploy flow:
# 1. CI builds image myapi:1.5.0, pushes to registry
# 2. PR bumps the image tag in the k8s-config repo
# 3. Merge → ArgoCD sees the diff → applies it to the cluster
# 4. Rollback = git revert</pre>
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
</ul>
<pre>        ▲▲      E2E (few, slow, fragile)      Cypress / Playwright
      ▲▲▲▲▲     Integration (some)            Testcontainers, real DB/API
   ▲▲▲▲▲▲▲▲▲    Unit (many, run in ms)        JUnit / Jest, mocked deps

# Rule of thumb: ~70% unit / 20% integration / 10% E2E
# Anti-pattern: "ice cream cone" — mostly manual + E2E tests, few unit tests</pre>`,
      },
      {
        q: 'What are feature flags and how do they relate to CI/CD?',
        difficulty: 'medium',
        a: `<p><strong>Feature flags</strong> (feature toggles) let you deploy code to production with new features <strong>turned off</strong>, then enable them without redeploying.</p>
<pre>// Simple feature flag:
if (featureFlags.isEnabled("new-checkout")) {
    return newCheckoutFlow(cart);
} else {
    return oldCheckoutFlow(cart);
}

// Types of flags:
// Release flag: toggle incomplete features (remove after launch)
// Experiment flag: A/B testing (10% see new UI)
// Ops flag: kill switch (disable features under load)
// Permission flag: premium features for paid users</pre>
<p><strong>Benefits for CI/CD:</strong></p>
<ul>
<li>Deploy incomplete features safely (trunk-based development)</li>
<li>Gradual rollout: enable for 5% → 25% → 100% of users</li>
<li>Instant rollback: just flip the flag off (no redeploy)</li>
<li>A/B testing: measure impact before full rollout</li>
</ul>
<div class="key-point">Feature flags enable trunk-based development + continuous deployment. But don't accumulate stale flags — they become technical debt. Set expiry dates and clean up after launch. Tools: LaunchDarkly, Unleash, Flagsmith.</div>`,
      },
      {
        q: 'What is a monorepo vs polyrepo? How does it affect CI/CD?',
        difficulty: 'tricky',
        a: `<table><tr><th>Aspect</th><th>Monorepo</th><th>Polyrepo</th></tr>
<tr><td>Structure</td><td>All projects in one repository</td><td>Each project has its own repo</td></tr>
<tr><td>CI/CD</td><td>Must detect which projects changed → build only those</td><td>Each repo has simple, independent pipeline</td></tr>
<tr><td>Code sharing</td><td>Easy (same repo)</td><td>Need package manager or Git submodules</td></tr>
<tr><td>Atomic changes</td><td>Cross-project changes in one PR</td><td>Must coordinate PRs across repos</td></tr>
<tr><td>Scale challenge</td><td>Slow clones, complex CI triggers</td><td>Dependency version management</td></tr></table>
<pre># Monorepo CI: only build what changed (GitHub Actions example)
on:
  push:
    paths:
      - 'services/user-service/**'  # Only trigger when this path changes

# Tools for monorepo CI:
# - Nx (JS/TS): affected:build → builds only changed + dependents
# - Bazel (multi-language): incremental builds with caching
# - Turborepo: task-based build system with caching</pre>
<div class="key-point">Google, Meta, Microsoft use monorepos. Most startups use polyrepos. Choose based on team size and coupling between projects. Monorepo works well when projects share code heavily.</div>`,
      },
      {
        q: 'What does "build once, deploy many" mean? How do you version and promote artifacts across environments?',
        difficulty: 'hard',
        a: `<p><strong>Build once, deploy many</strong>: build ONE immutable artifact per commit and promote that exact artifact through environments (dev → staging → prod). Never rebuild per environment — a rebuild can differ (newer dependencies, different flags) from what you actually tested.</p>
<ul>
<li><strong>Immutable artifact</strong>: JAR / Docker image built once in CI, stored in a registry.</li>
<li><strong>Version tags</strong>: semantic version + git SHA, e.g. <code>myapi:1.5.0-a1b2c3d</code>. Never deploy a movable tag like <code>latest</code>.</li>
<li><strong>Config stays OUT of the artifact</strong>: injected at deploy time (env vars, ConfigMaps, Spring profiles).</li>
<li><strong>Promotion</strong> = re-tagging / re-referencing the same image, not rebuilding.</li>
</ul>
<pre># CI builds exactly once:
docker build -t registry/myapi:1.5.0-a1b2c3d .
docker push registry/myapi:1.5.0-a1b2c3d

# Promote the SAME bits through environments:
deploy staging   → image: registry/myapi:1.5.0-a1b2c3d
smoke tests pass ✔
deploy prod      → image: registry/myapi:1.5.0-a1b2c3d   # identical digest

# Only configuration differs per environment:
SPRING_PROFILES_ACTIVE=staging | prod</pre>
<div class="key-point">If staging and production run different builds, staging tested nothing. The artifact is the contract — configuration is the only variable.</div>`,
      },
      {
        q: 'How do you deploy database schema changes with zero downtime?',
        difficulty: 'hard',
        a: `<p>Use the <strong>expand–contract</strong> (parallel change) pattern: every migration must stay compatible with the version currently running, because old and new code run side by side during a rolling deploy.</p>
<ol>
<li><strong>Expand</strong>: add the new column/table (nullable or with a default). Old code simply ignores it.</li>
<li><strong>Migrate</strong>: new code writes to both old + new; backfill existing rows in small batches.</li>
<li><strong>Switch reads</strong> to the new column; verify with metrics.</li>
<li><strong>Contract</strong>: only after the old version is fully gone, drop the old column in a LATER release.</li>
</ol>
<pre>-- Goal: rename users.name → full_name with zero downtime
-- Release 1 (expand):
ALTER TABLE users ADD COLUMN full_name VARCHAR(255) NULL;
UPDATE users SET full_name = name WHERE full_name IS NULL;   -- batched backfill
-- app v2 writes BOTH columns, reads full_name with fallback to name

-- Release 2 (contract — days later, after v1 is retired):
ALTER TABLE users DROP COLUMN name;</pre>
<ul>
<li>Version migrations with <strong>Flyway/Liquibase</strong>; run them as a pipeline step before the app deploy.</li>
<li>Never in one release: rename/drop a column in use, add NOT NULL without a default, long table-locking ALTERs during peak traffic.</li>
</ul>
<div class="key-point">Rule: versions N and N+1 of the app must both work against the same schema. That is exactly what makes rolling deploys AND rollbacks safe.</div>`,
      },
      {
        q: 'How do you secure a CI/CD pipeline? (supply-chain security)',
        difficulty: 'hard',
        a: `<ul>
<li><strong>Least privilege</strong>: pipeline tokens scoped per job; short-lived <strong>OIDC</strong> tokens to cloud providers instead of stored keys.</li>
<li><strong>Protected branches</strong>: required reviews + green checks before merge; nobody pushes to main directly.</li>
<li><strong>Pin dependencies</strong>: lockfiles committed; pin third-party CI actions to a commit SHA, not a tag.</li>
<li><strong>Scan everything</strong>: dependencies (Dependabot/Snyk), images (Trivy), source (SAST/SonarQube).</li>
<li><strong>Sign and verify artifacts</strong>: cosign for images, SBOM + provenance (SLSA) so prod only runs what CI actually built.</li>
<li><strong>Isolate runners</strong>: ephemeral runners; never expose secrets to untrusted PR code (the <code>pull_request_target</code> pitfall).</li>
</ul>
<pre># Pin actions to a SHA — a tag like @v4 can be re-pointed by an attacker:
- uses: actions/checkout@11bd71901bbe5b1630ceea73d27597364c9af683  # v4.2.2

# Verify the image signature before deploying:
cosign verify registry/myapi:1.5.0 \\
  --certificate-identity "https://github.com/company/repo/.github/workflows/ci.yml@refs/heads/main"</pre>
<div class="key-point">Real supply-chain attacks (SolarWinds, Codecov, xz-utils) targeted the pipeline, not the app. The pipeline IS production infrastructure — secure it like production.</div>`,
      },
      {
        q: 'What are DORA metrics? How do you measure whether your CI/CD is good?',
        difficulty: 'medium',
        a: `<p>Four industry-standard metrics (Google's DevOps Research & Assessment) that measure software delivery performance:</p>
<table><tr><th>Metric</th><th>Meaning</th><th>Elite performers</th></tr>
<tr><td>Deployment frequency</td><td>How often you ship to production</td><td>On demand (multiple per day)</td></tr>
<tr><td>Lead time for changes</td><td>Commit → running in production</td><td>&lt; 1 hour</td></tr>
<tr><td>Change failure rate</td><td>% of deploys causing incidents/rollback</td><td>&lt; 5%</td></tr>
<tr><td>Time to restore (MTTR)</td><td>Incident → service recovered</td><td>&lt; 1 hour</td></tr></table>
<ul>
<li>Two are <strong>speed</strong> metrics, two are <strong>stability</strong> metrics — good CI/CD improves both together; trading one for the other is a smell.</li>
<li>How to improve: smaller PRs, trunk-based development, strong automated tests, feature flags, canary deploys, fast rollback.</li>
</ul>
<div class="key-point">A senior answer sounds like: "we deploy small batches on demand behind flags, and if something breaks we roll back in minutes" — that is what elite DORA numbers mean in practice.</div>`,
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
</ul>
<pre>docker run nginx
   CLI ──REST API──▶ dockerd ──▶ containerd ──▶ runc ──▶ container process

# runc creates a normal Linux process wrapped in:
#   namespaces  → isolation (own pid, network, filesystem view)
#   cgroups     → resource limits (CPU, memory)
# containerd manages the container lifecycle; dockerd adds images,
# networks, volumes and the API on top.</pre>`,
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
      {
        q: 'What are multi-stage Docker builds and why are they important?',
        difficulty: 'hard',
        a: `<p><strong>Multi-stage builds</strong> let you use multiple FROM instructions in one Dockerfile. Each stage can use a different base image. Only the final stage becomes the output image.</p>
<pre># Stage 1: Build (has all build tools — large image)
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app
COPY pom.xml .
RUN mvn dependency:resolve          # cache dependencies layer
COPY src ./src
RUN mvn package -DskipTests

# Stage 2: Run (minimal image — NO build tools)
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/app.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

# Result:
# Builder stage: ~800MB (Maven, JDK, source code)
# Final image:   ~200MB (JRE + JAR only)

# Node.js example:
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
# Final: ~25MB instead of ~1GB</pre>
<div class="key-point">Multi-stage builds are essential for production images: smaller size (faster pulls), smaller attack surface (no build tools), better layer caching (dependencies cached separately from source code).</div>`,
      },
      {
        q: 'What are Docker security best practices?',
        difficulty: 'hard',
        a: `<ol>
<li><strong>Don't run as root</strong>: Use <code>USER</code> instruction to run as non-root user</li>
<li><strong>Use minimal base images</strong>: Alpine, distroless, or scratch</li>
<li><strong>Scan images</strong>: Trivy, Snyk, or Docker Scout for vulnerabilities</li>
<li><strong>Pin image versions</strong>: <code>node:20.11.0-alpine</code> not <code>node:latest</code></li>
<li><strong>Don't store secrets in images</strong>: Use env vars, Docker secrets, or vault</li>
<li><strong>Use .dockerignore</strong>: Exclude .git, node_modules, .env files</li>
<li><strong>Read-only filesystem</strong>: <code>--read-only</code> flag prevents writes</li>
<li><strong>Limit resources</strong>: <code>--memory=512m --cpus=1.0</code></li>
</ol>
<pre># Secure Dockerfile example:
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
RUN npm run build

FROM node:20-alpine
RUN addgroup -S appgroup && adduser -S appuser -G appgroup  # non-root user
WORKDIR /app
COPY --from=builder --chown=appuser:appgroup /app .
USER appuser                  # run as non-root
EXPOSE 3000
CMD ["node", "server.js"]

# .dockerignore:
.git
node_modules
.env
Dockerfile
*.md</pre>
<div class="key-point">Never embed secrets (API keys, passwords) in Docker images — they persist in image layers even if you delete them later. Use Docker BuildKit <code>--mount=type=secret</code> for build-time secrets.</div>`,
      },
      {
        q: 'What happens step by step when you run `docker run -d -p 8080:80 nginx`?',
        difficulty: 'medium',
        a: `<ol>
<li>CLI sends the request to the Docker daemon over the REST API.</li>
<li>Daemon looks for <code>nginx:latest</code> locally; if missing, <strong>pulls the layers</strong> from the registry (each layer cached for future use).</li>
<li>Creates the container: image layers stay <strong>read-only</strong>, a fresh <strong>writable layer</strong> goes on top.</li>
<li>Creates a network namespace, attaches it to the default <strong>bridge</strong> network, allocates a container IP.</li>
<li><code>-p 8080:80</code>: adds a NAT rule (iptables) so host port 8080 forwards to container port 80.</li>
<li>containerd/runc start the process as <strong>PID 1</strong> inside its namespaces (pid, net, mnt, uts) with cgroup limits applied.</li>
<li><code>-d</code>: detached — prints the container ID and returns immediately.</li>
</ol>
<pre>docker ps                    # STATUS: Up — running
docker logs -f &lt;id&gt;          # stdout/stderr of PID 1
curl localhost:8080          # host → NAT → container:80

# The container lives exactly as long as PID 1 lives:
# process exits → container stops. No init system, no daemon inside.</pre>
<div class="key-point">A container is just a normal Linux process wrapped in namespaces (what it can see) + cgroups (what it can use). That's why it starts in milliseconds while a VM boots an OS.</div>`,
      },
      {
        q: 'How do you debug a container that keeps crashing or misbehaving?',
        difficulty: 'hard',
        a: `<pre># 1. Why did it die? Exit code + OOM flag
docker ps -a                                   # STATUS: Exited (137) 2 min ago
docker inspect &lt;id&gt; \\
  --format '{{.State.ExitCode}} OOM={{.State.OOMKilled}}'

# Common exit codes:
#   1     application error → read the logs
#   137   SIGKILL — almost always OOM-killed (memory limit hit)
#   139   segmentation fault
#   143   SIGTERM — graceful stop

# 2. Logs survive the crash — read the dead container's output
docker logs --tail 100 &lt;id&gt;

# 3. Shell into a RUNNING container
docker exec -it &lt;id&gt; sh

# 4. Container won't even start? Override the entrypoint and look around
docker run -it --entrypoint sh myimage

# 5. Live resource usage and daemon events
docker stats
docker events --since 30m

# 6. Copy evidence out
docker cp &lt;id&gt;:/app/logs ./logs</pre>
<ul>
<li><strong>Exit 137 + OOMKilled=true</strong>: raise <code>--memory</code> or fix the leak. For Java, set <code>-XX:MaxRAMPercentage</code> so the heap respects the container limit.</li>
<li><strong>Crash loop</strong>: PID 1 keeps exiting — a container only lives as long as its main process; check why the process terminates (config, missing dependency, port already bound).</li>
</ul>
<div class="key-point">Debug order: exit code → logs → exec / entrypoint override. Knowing that 137 = OOM kill is a classic senior-level signal in interviews.</div>`,
      },
      {
        q: 'How do you properly dockerize a Java / Spring Boot application?',
        difficulty: 'hard',
        a: `<ul>
<li><strong>JRE, not JDK</strong>, in the final image — multi-stage build.</li>
<li><strong>Layered JAR</strong>: Spring Boot's layertools separates dependencies from your classes, so the big dependency layers stay cached and only the small app layer rebuilds on each commit.</li>
<li><strong>Container-aware JVM</strong>: size the heap with <code>-XX:MaxRAMPercentage</code> (reads the cgroup limit) instead of a hardcoded <code>-Xmx</code>.</li>
<li><strong>Non-root user</strong>, health check via Actuator, graceful shutdown on SIGTERM.</li>
</ul>
<pre>FROM maven:3.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY pom.xml .
RUN mvn -B dependency:go-offline           # layer cached until pom.xml changes
COPY src ./src
RUN mvn -B package -DskipTests

# Extract Spring Boot layers (dependencies / loader / snapshots / application)
FROM eclipse-temurin:21-jre-alpine AS layers
WORKDIR /app
COPY --from=build /app/target/*.jar app.jar
RUN java -Djarmode=layertools -jar app.jar extract

FROM eclipse-temurin:21-jre-alpine
RUN addgroup -S app && adduser -S app -G app
USER app
WORKDIR /app
COPY --from=layers /app/dependencies/ ./
COPY --from=layers /app/spring-boot-loader/ ./
COPY --from=layers /app/snapshot-dependencies/ ./
COPY --from=layers /app/application/ ./
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0"
HEALTHCHECK CMD wget -qO- http://localhost:8080/actuator/health | grep -q UP
ENTRYPOINT ["java", "org.springframework.boot.loader.launch.JarLauncher"]</pre>
<div class="key-point">Without <code>MaxRAMPercentage</code> (or with <code>-Xmx</code> above the container limit) the JVM allocates past the cgroup limit and the container dies with exit 137 — the single most common "Java in Docker" production incident.</div>`,
      },
    ],
  },

  // ───────────────────────── 6. SQL ─────────────────────────
];
