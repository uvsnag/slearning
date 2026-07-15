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
        a: `<div class="interview-answer"><p>The three are a progression, and the line people miss is between the last two. CI is about integrating small changes constantly so every commit triggers an automated build and test — the point is catching integration bugs in minutes, not at a big-bang merge. Continuous Delivery means the artifact is always production-ready and shipping is a one-click business decision. Continuous Deployment removes even that click — every green commit goes to prod automatically. Most teams should nail CI first; jumping straight to full Continuous Deployment without strong tests, feature flags, and fast rollback is how you page yourself at 2am.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>I describe it as a funnel that gets more expensive and more production-like as you move down, so cheap checks gate the costly ones. Source triggers a build that produces one immutable artifact, then unit and integration tests, then security scanning, then a staging deploy for acceptance tests, then production via a safe rollout like canary or blue-green, with health checks and a rollback plan on standby. The principle underneath is build once, deploy many — the exact artifact that passed staging is what ships to prod. And every stage should fail fast: there's no point running E2E if lint or unit tests are already red.</p></div>
<ol>
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
        a: `<div class="interview-answer"><p>These are three points on a spectrum of how much risk and infrastructure you trade. Blue-green runs two full environments and flips the load balancer — instant rollback, but you're paying for double capacity. Canary shifts a small slice of real traffic to the new version and watches metrics before ramping up, the safest option for large-scale services but it demands good observability. Rolling is the Kubernetes default — replace instances a few at a time with no extra infra, at the cost of running mixed versions briefly, which is exactly why your schema changes have to stay backward-compatible. My default is rolling for stateless services and canary once traffic justifies the observability investment.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>For CI/CD I strongly favor trunk-based development. GitFlow's long-lived develop, release, and feature branches were designed for scheduled, versioned releases, but those branches drift and turn into painful big-bang merges — the opposite of continuous integration. Trunk-based means everyone commits to main behind short-lived branches that merge within a day, with unfinished work hidden behind feature flags. Small frequent merges mean fewer conflicts and faster feedback. GitFlow still earns its place for shipped software with multiple supported versions, but for a web service delivered continuously it fights you.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>The hierarchy is workflow contains jobs contains steps. A workflow is a YAML file in <code>.github/workflows</code> triggered by events like push or pull_request; a job runs on its own fresh runner VM; a step is a single action or shell command. The gotcha people hit is that jobs run in parallel on separate machines by default — so they share nothing unless you wire up <code>needs</code> for ordering and artifacts to pass files between them. I'd also mention pinning third-party actions to a commit SHA rather than a moving tag, for supply-chain safety.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Rule one: secrets never live in the repo — not in code, not in committed .env files. I inject them at runtime from the platform's secret store, referenced as masked variables, and scope them per environment so a staging job can't read prod credentials. For cloud deploys the real upgrade is OIDC: the pipeline exchanges a short-lived token for cloud access, so there's no long-lived key stored anywhere to leak or rotate. And whatever you use, rotate regularly and keep an audit trail — a leaked static token is one of the most common breach vectors.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Infrastructure as Code means your servers, networks, and policies are declared in version-controlled files instead of clicked into a console. The payoff is that infra changes go through the same PR review, history, and CI as application code — reproducible, auditable, and no snowflake environments. The standard flow is <code>terraform plan</code> on the PR so reviewers see the exact diff, then <code>terraform apply</code> on merge. The thing juniors underestimate is state — Terraform's state file is the source of truth for what exists, so it must be remote and locked, or two concurrent applies corrupt each other.</p></div>
<p><strong>IaC</strong>: manage infrastructure through code/config files, versioned in Git.</p>
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
        a: `<div class="interview-answer"><p>My philosophy is that rollback should be boring and fast — ideally faster than debugging forward under pressure. The cleanest options are redeploying the previous immutable artifact, flipping traffic back in a blue-green setup, or in GitOps just reverting the commit and letting the controller reconcile. Feature flags are the fastest of all because you disable a feature without any deploy. The hard part is always the database: migrations must be backward-compatible using the expand-contract pattern, because you usually can't un-run a migration safely, and a rollback that breaks the schema is worse than the original bug.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>All three do the same core job; the real differentiator is hosting and ecosystem fit. Jenkins is self-hosted and infinitely flexible via plugins, but you own the maintenance, upgrades, and security patching — a lot of operational weight. GitLab CI and GitHub Actions are managed and config-as-code in your repo, so there's near-zero infra to run; GitLab shines as an all-in-one SCM-plus-CI-plus-registry, and Actions has the biggest marketplace and is the natural choice if you're already on GitHub. I'd pick based on where your code already lives and whether you have a platform team willing to babysit Jenkins.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>These solve two different problems. Artifacts pass build outputs forward between jobs — you build the jar once and hand it downstream rather than rebuilding it. Caching persists things like <code>node_modules</code> or the Maven repo between runs so you don't re-download the internet every time. Beyond that, the biggest CI speedups are parallelizing and sharding test suites, and in a monorepo only building what actually changed. The subtle bug is a bad cache key — key it on your lockfile hash so the cache invalidates exactly when dependencies change, not on a stale key that quietly serves you wrong deps.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>GitOps makes Git the single source of truth for what's running, not just for code. You declare desired state — Kubernetes manifests, Helm charts — in a repo, and a controller like ArgoCD or Flux continuously reconciles the cluster to match it. Nobody runs <code>kubectl apply</code> by hand; changes go through PRs, so you get a full audit trail, trivial rollback via <code>git revert</code>, and self-healing when someone drifts the cluster manually. The mental shift is from push to pull: CI builds the image, a PR bumps the tag in the config repo, and the cluster pulls itself into line.</p></div>
<p><strong>GitOps</strong>: Git is the single source of truth for infrastructure AND application deployment.</p>
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
        a: `<div class="interview-answer"><p>The pyramid is about spending your test budget where it pays off: lots of fast, isolated unit tests at the base, fewer integration tests in the middle, and a thin layer of slow, fragile E2E tests at the top. The anti-pattern is the inverted "ice cream cone" — mostly manual and E2E tests — which gives slow, flaky feedback that people learn to ignore. In the pipeline I run unit tests on every push for fast feedback, integration tests on merge, and reserve E2E for pre-prod so they don't block every commit. Roughly 70/20/10 is the rule of thumb, but the real goal is fast, trustworthy signal.</p></div>
<p><strong>Testing pyramid</strong> (bottom to top):</p>
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
        a: `<div class="interview-answer"><p>Feature flags decouple deploy from release — you ship code to prod with the feature off, then turn it on independently, without another deploy. That's what makes trunk-based development and continuous deployment actually safe: incomplete work ships dark, and you can ramp a feature from 5% to 100%, run A/B tests, or hit a kill switch instantly under load. The tradeoff is that flags are technical debt — every flag is a branch in your code and a combinatorial test burden. So set expiry dates and delete them after launch, otherwise you end up with a codebase nobody can reason about.</p></div>
<p><strong>Feature flags</strong> (feature toggles) let you deploy code to production with new features <strong>turned off</strong>, then enable them without redeploying.</p>
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
        a: `<div class="interview-answer"><p>The core tension is coordination versus isolation. A monorepo gives you atomic cross-project changes and trivial code sharing in one PR, but your CI has to be smart about building only what changed or every commit rebuilds the world. Polyrepos give each service a dead-simple independent pipeline, at the cost of dependency-version hell and multi-repo PR choreography for anything spanning services. The deciding factor is coupling: if projects share a lot of code and change together, a monorepo with affected-only build tooling like Nx or Bazel wins; if they're truly independent, polyrepos keep things simple.</p></div>
<table><tr><th>Aspect</th><th>Monorepo</th><th>Polyrepo</th></tr>
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
        a: `<div class="interview-answer"><p>This is one of the most important CI/CD principles: you build exactly one immutable artifact per commit and promote that same artifact through dev, staging, and prod — never rebuild per environment. The moment you rebuild for prod, you might pull a newer dependency or flip a different flag, and now staging validated something that isn't what shipped. Config is the only thing that varies, injected at deploy time via env vars or ConfigMaps, never baked in. And tag with a version plus git SHA, never a moving tag like <code>latest</code>, so the digest you tested is provably the digest you ran.</p></div>
<p><strong>Build once, deploy many</strong>: build ONE immutable artifact per commit and promote that exact artifact through environments (dev → staging → prod). Never rebuild per environment — a rebuild can differ (newer dependencies, different flags) from what you actually tested.</p>
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
        a: `<div class="interview-answer"><p>The key insight is that during a rolling deploy, old and new code run against the same database simultaneously — so every migration must be backward-compatible with the version still running. That's the expand-contract pattern: first expand by adding the new column as nullable, then have the new code dual-write and backfill in batches, switch reads over once verified, and only contract by dropping the old column in a much later release after the old code is gone. What breaks this is renaming or dropping a column in use, adding NOT NULL without a default, or a long table-locking ALTER at peak. The rule I state is: version N and N+1 must both work against the same schema — that's what makes both rolling deploys and rollbacks safe.</p></div>
<p>Use the <strong>expand–contract</strong> (parallel change) pattern: every migration must stay compatible with the version currently running, because old and new code run side by side during a rolling deploy.</p>
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
        a: `<div class="interview-answer"><p>The framing I lead with is that the pipeline IS production infrastructure — SolarWinds, Codecov, and xz all attacked the build, not the app — so it deserves the same rigor. Concretely: least privilege with short-lived OIDC tokens instead of stored cloud keys, protected branches so nothing reaches main without review and green checks, and pinning everything — lockfiles committed and third-party actions pinned to a commit SHA, because a tag can be silently re-pointed by an attacker. Then scan dependencies, images, and source, and sign artifacts with something like cosign plus an SBOM so prod only runs what CI actually built. And isolate runners — the classic <code>pull_request_target</code> foot-gun leaks secrets to untrusted PR code.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>DORA is four metrics that correlate with elite software delivery: deployment frequency and lead time for changes measure speed, while change failure rate and time to restore measure stability. The insight that makes it a good answer is that speed and stability move together — teams that deploy small batches frequently also recover faster, because a small change is easy to reason about and roll back. So trading one for the other is a smell; when someone says "we slowed down to be safer," the DORA data says that usually backfires. In practice you improve all four the same way: smaller PRs, trunk-based development, strong automated tests, and fast rollback behind flags.</p></div>
<p>Four industry-standard metrics (Google's DevOps Research & Assessment) that measure software delivery performance:</p>
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
      {
        q: 'What makes a good CI pipeline? How do you order stages and deal with flaky tests?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>A good pipeline optimizes for trustworthy feedback under about ten minutes: cheap, likely-to-fail checks first — lint, typecheck, unit — then expensive integration and E2E later and in parallel. The reason time matters is behavioral: a slow or flaky pipeline trains developers to batch changes and ignore red builds, which quietly destroys the point of CI. Flaky tests are the silent killer — I detect them by pass-on-retry, then quarantine them out of the blocking path with a fix-by ticket, rather than a blanket retry-three-times that just hides real race conditions. And red main is a stop-the-line event: revert or fix forward immediately, nobody merges onto a broken trunk.</p></div>
<p>A good pipeline optimizes for <strong>trustworthy feedback time</strong>: the cheapest, most-likely-to-fail checks run first (fail fast), expensive checks run later and in parallel. A slow or flaky pipeline is worse than none — developers start batching changes and ignoring red builds, which quietly kills the whole point of CI.</p>
<ul>
<li><strong>Fail-fast ordering</strong>: lint/format → compile/typecheck → unit tests → build artifact → integration tests → E2E. Never make someone wait 20 minutes to learn about a lint error.</li>
<li><strong>Parallelize</strong>: shard test suites across runners; run independent jobs concurrently.</li>
<li><strong>Cache aggressively</strong>: dependencies and Docker layers between runs.</li>
<li><strong>Flaky tests</strong>: detect them (pass-on-retry = flaky), <strong>quarantine</strong> them out of the blocking path, and fix or delete them under an SLA. A blanket "retry 3 times" policy hides real race conditions that will resurface in production.</li>
<li><strong>Pipeline-as-code</strong>: the pipeline definition lives in the repo and is reviewed like any other change — no hand-edited server jobs that drift.</li>
<li><strong>Time budget</strong>: keep the blocking path under ~10 minutes; push slower suites to a merge queue or nightly run.</li>
</ul>
<pre># Fail-fast: cheap checks gate the expensive ones
jobs:
  quick-checks:                        # ~1 min — catches most failures
    steps:
      - run: npm run lint
      - run: npm run typecheck
  unit:
    needs: quick-checks
    strategy:
      fail-fast: true
      matrix: { shard: [1, 2, 3, 4] }  # parallel test shards
    steps:
      - run: npm test -- --shard=\${{ matrix.shard }}/4
  e2e:
    needs: unit                        # slowest suite last, only if all else passed
    steps:
      - run: npx playwright test

# Flaky-test policy:
#   passes only on retry → tag @quarantine → excluded from the blocking run
#   quarantined tests still run (non-blocking) + ticket with a fix-by date</pre>
<p>Interviewer follow-up: "what do you do when the pipeline is red?" Senior answer: red main is a stop-the-line event — revert or fix forward immediately; nobody merges onto a broken trunk.</p>
<div class="key-point">A pipeline's job is trustworthy feedback in under ~10 minutes: fail fast, parallelize the rest, and quarantine flaky tests instead of retrying them into green.</div>`,
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
        a: `<div class="interview-answer"><p>The one-liner is that containers share the host kernel while VMs each run their own. Docker isolation is OS-level — Linux namespaces control what a process can see and cgroups control what it can use — so a container is really just a confined process, which is why images are MBs and startup is milliseconds. A VM virtualizes hardware and boots a full guest OS per instance: stronger isolation but GBs and seconds to boot. The gotcha I always flag: because the kernel is shared, a Linux container needs a Linux kernel, so on Windows or Mac "Docker" quietly runs a Linux VM underneath — and that shared-kernel model is why untrusted multi-tenant workloads still lean on real VMs or micro-VMs like Firecracker.</p></div>
<p><strong>Docker</strong> packages an app with its dependencies into a container that runs as an isolated process on the host. The key idea is <strong>where the isolation happens</strong>:</p>
<ul>
<li><strong>Docker (OS-level virtualization)</strong>: containers <strong>share the host's kernel</strong>; isolation comes from Linux <strong>namespaces</strong> (what a process can see — its own PIDs, network, filesystem) and <strong>cgroups</strong> (what it can use — CPU, memory). There is no guest OS to boot, so a container is really just a confined process — hence MB-sized images and millisecond startup.</li>
<li><strong>VM (hardware-level virtualization)</strong>: a hypervisor emulates hardware and each VM runs a <strong>full guest OS with its own kernel</strong>. That gives stronger isolation but costs GBs of disk and RAM and takes seconds-to-minutes to boot.</li>
</ul>
<p>Analogy: VMs are separate houses (each with its own foundation and utilities); containers are apartments in one building (shared foundation/kernel, private locked doors).</p>
<table style="width:100%;border-collapse:collapse;margin:10px 0;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;"></th><th style="padding:6px;border-bottom:1px solid #ccc;">Docker</th><th style="padding:6px;border-bottom:1px solid #ccc;">VM</th></tr>
<tr><td style="padding:6px;">Startup</td><td style="padding:6px;">Seconds</td><td style="padding:6px;">Minutes</td></tr>
<tr><td style="padding:6px;">Size</td><td style="padding:6px;">MBs</td><td style="padding:6px;">GBs</td></tr>
<tr><td style="padding:6px;">Isolation</td><td style="padding:6px;">Process-level</td><td style="padding:6px;">Full OS</td></tr>
<tr><td style="padding:6px;">Performance</td><td style="padding:6px;">Near native</td><td style="padding:6px;">Overhead</td></tr>
</table>
<div class="key-point">The one-liner: containers share the host kernel (namespaces + cgroups), VMs each run their own kernel on a hypervisor. Gotcha — because the kernel is shared, a Linux container needs a Linux kernel: on Windows/macOS "Docker" actually runs a lightweight Linux VM under the hood, and the isolation is weaker than a VM's, which is why untrusted multi-tenant workloads still lean on VMs (or micro-VMs like Firecracker).</div>`,
      },
      {
        q: 'Explain Docker architecture: Engine, Daemon, CLI, Images, Containers, Registry.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Docker is a client-server system, and it's worth knowing the layers because they explain a lot of behavior. The CLI talks over a REST API to the daemon, dockerd, which manages images, networks, and volumes and delegates the actual container lifecycle to containerd, which in turn uses runc to spawn the process with namespaces and cgroups. An image is a read-only stack of layers built from a Dockerfile; a container is a running instance with a thin writable layer on top; a registry like Docker Hub or ECR stores and distributes images. The key takeaway is that dockerd is a privileged daemon running as root — which is exactly why rootless Docker and daemonless tools like Podman exist.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>A Dockerfile is the declarative recipe for building an image, and the instructions matter less than understanding which ones create layers and how ordering affects caching. FROM sets the base, RUN executes build commands and each creates a layer, COPY brings files in, and CMD or ENTRYPOINT defines what runs. Two things I always call out: prefer COPY over ADD unless you specifically need tar extraction, because ADD's magic is a footgun; and copy your dependency manifest and install before copying source, so the expensive install layer stays cached when only code changes. And run as a non-root USER — the default is root, which you don't want in production.</p></div>
<pre>FROM node:20-alpine          # base image
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
        a: `<div class="interview-answer"><p>The mental model is that an image is a stack of cached, shared, read-only layers and a container adds a copy-on-write writable layer on top. Two consequences drive all optimization: layers are shared across images so a common base is stored and pulled once, and any change busts the cache for that layer and everything below it. So order your Dockerfile least-changed to most-changed — base, OS packages, dependency manifests, install, then source — so a code edit only rebuilds the cheap final layers. The biggest single win is multi-stage builds: compile with a full toolchain, then COPY --from only the artifact into a slim runtime so build tools never ship. And clean up within the same RUN — deleting files in a later layer doesn't shrink the image, the earlier layer still holds them.</p></div>
<p>An image is a <strong>stack of read-only layers</strong>. Each instruction that changes the filesystem (<code>FROM</code>, <code>RUN</code>, <code>COPY</code>, <code>ADD</code>) adds one layer on top; a union filesystem (overlayfs) merges them into what looks like a single filesystem. When you run a container, Docker adds a thin <strong>writable layer</strong> on top using <strong>copy-on-write</strong>: reads come from the shared read-only layers, and the first write to a file copies it up into the container's own layer.</p>
<p>Two consequences that drive everything:</p>
<ul>
<li><strong>Layers are shared and cached</strong>. If ten images share the same <code>node:20-alpine</code> base, that base is stored once on disk and pulled once. During a build, a layer is reused from cache only if its instruction <em>and</em> its inputs are unchanged.</li>
<li><strong>A change busts the cache for that layer and every layer after it.</strong> This is why instruction order matters: if you <code>COPY . .</code> before installing dependencies, editing one source file invalidates the (expensive) dependency-install layer and forces a full reinstall.</li>
</ul>
<p><strong>Optimization strategies</strong> — and why each works:</p>
<ul>
<li><strong>Multi-stage builds</strong>: build with a full toolchain in one stage, then <code>COPY --from</code> only the final artifact into a slim runtime image. Build tools never ship, so the image is smaller and the attack surface shrinks.</li>
<li><strong>Order least- to most-frequently-changed</strong>: base → OS packages → dependency manifests → <code>npm ci</code> → source. Code changes (the frequent case) then only rebuild the cheap final layers.</li>
<li><strong>Combine related <code>RUN</code> commands</strong> with <code>&amp;&amp;</code> and clean up in the same layer — deleting a cache in a <em>later</em> layer doesn't shrink the image, because the earlier layer still holds the files.</li>
<li><strong>Use <code>.dockerignore</code></strong> to keep <code>.git</code>, <code>node_modules</code>, and secrets out of the build context (smaller context, better caching, no accidental leaks).</li>
<li><strong>Use slim/alpine/distroless base images</strong> to cut the baseline size.</li>
</ul>
<pre># Dependencies copied and installed BEFORE source → the install layer
# stays cached until package*.json actually changes.
FROM node:20 AS builder
WORKDIR /app
COPY package*.json ./          # changes rarely
RUN npm ci                     # expensive layer — cached across code edits
COPY . .                       # changes often → only this + below rebuild
RUN npm run build

FROM node:20-alpine            # slim runtime, no build tools
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
CMD ["node", "dist/server.js"]</pre>
<div class="key-point">The mental model: an image is cached, shared, read-only layers; a container is a copy-on-write layer on top. Put what changes least at the top of the Dockerfile — a cache miss invalidates that layer <em>and everything below it</em>.</div>`,
      },
      {
        q: 'What is the difference between CMD and ENTRYPOINT?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>CMD sets a default that's easily overridden by arguments to <code>docker run</code>, while ENTRYPOINT fixes the executable and appends any run arguments to it. The idiomatic pattern is ENTRYPOINT for the actual binary and CMD for its default flags, so users can override the flags without accidentally replacing the whole command. The subtle trap is shell form versus exec form: writing them without the JSON-array brackets runs through <code>/bin/sh</code>, which becomes PID 1 and swallows signals — so your container ignores SIGTERM and gets hard-killed on stop. Always use the exec form with the bracket syntax.</p></div>
<ul>
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
        a: `<div class="interview-answer"><p>Each driver is a different trade-off between isolation, performance, and reach. Bridge is the single-host default: each container gets a private IP on a virtual bridge and you publish ports with <code>-p</code>, which adds a NAT rule. The interview gotcha is that on the default bridge containers can only reach each other by IP — you need a user-defined bridge to get automatic DNS by container name, which is exactly why Compose creates one for you. Host skips the bridge and NAT entirely for raw performance but gives up isolation and can collide with host ports; none is total isolation with just loopback; and overlay is the multi-host answer for Swarm or clustered setups where containers span machines.</p></div>
<p>Docker networking is built on Linux network namespaces — each driver is a different trade-off between <strong>isolation</strong>, <strong>performance</strong>, and <strong>reach</strong> (single host vs cluster).</p>
<ul>
<li><strong>bridge</strong> (default on a single host): each container gets its own network namespace and a private IP on a virtual bridge (<code>docker0</code>). Containers are isolated from the host; to expose one you publish a port (<code>-p 8080:80</code>), which adds a NAT rule. <em>Key nuance</em>: on the <strong>default</strong> bridge, containers can only reach each other by IP; on a <strong>user-defined</strong> bridge (<code>docker network create</code>) Docker runs an embedded DNS server so they resolve each other by <strong>container name</strong>. That is why Compose puts every service on a user-defined network.</li>
<li><strong>host</strong>: the container shares the host's network namespace directly — no virtual bridge, no NAT, no port mapping (the container binds host ports as-is). Fastest (no NAT overhead) but there is <strong>no network isolation</strong> and ports can collide with the host's. Use only for latency-sensitive or high-throughput workloads. (Linux only; behaves differently on Docker Desktop.)</li>
<li><strong>none</strong>: the container gets its own namespace with only a loopback interface — <strong>no external connectivity at all</strong>. Use for maximum isolation: untrusted batch jobs or a workload you'll attach a custom interface to.</li>
<li><strong>overlay</strong>: a software-defined network that spans <strong>multiple Docker hosts</strong> (Swarm / Kubernetes-style clusters) so containers on different machines talk as if on one LAN, with optional encryption. This is the multi-host answer; bridge is single-host only.</li>
</ul>
<pre># User-defined bridge → DNS by container name (the common case)
docker network create mynet
docker run --network mynet --name api myapi
docker run --network mynet --name db  postgres
# api reaches the database at hostname "db" — no IPs, no links needed

docker run --network host   nginx      # binds host :80 directly, no -p
docker run --network none   batch-job  # fully offline</pre>
<div class="key-point">Interview gotcha: containers on the <em>default</em> bridge cannot resolve each other by name — only a user-defined bridge (or Compose, which creates one for you) gives automatic DNS. Reach for <code>host</code> only when you truly need to skip NAT, and <code>overlay</code> only when the network must cross hosts.</div>`,
      },
      {
        q: 'What are Docker volumes? Named volume vs bind mount vs tmpfs.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Volumes exist because a container's writable layer is ephemeral and slow for heavy I/O — it dies with the container. Named volumes are Docker-managed storage that outlives containers and is portable, so that's my choice for production data like databases. Bind mounts map a specific host directory in, which is perfect for development hot-reload but couples you to the host path and leaks UID/GID permission issues — a classic "permission denied" source. Tmpfs is in-memory only, great for secrets or scratch you never want on disk. The syntax gotcha: with <code>-v</code> the leading slash decides — <code>name:/path</code> is a named volume, <code>/host:/path</code> is a bind mount.</p></div>
<p><strong>Why volumes exist</strong>: a container's writable layer is <strong>ephemeral</strong> — it's discarded when the container is removed, and copy-on-write to it is slow for heavy I/O like a database. Volumes bypass the writable layer to give you <strong>persistent, fast storage that outlives the container</strong>. Docker offers three mount types:</p>
<ul>
<li><strong>Named volume</strong>: storage fully managed by Docker (under <code>/var/lib/docker/volumes/</code>). The container doesn't care where it physically lives. This is the right choice for <strong>production data</strong> (databases, uploads): it's portable, backable-up (<code>docker volume</code> commands), and decoupled from the host's directory layout.</li>
<li><strong>Bind mount</strong>: maps a <strong>specific host directory</strong> into the container. Great for <strong>development</strong> — mount your source so code changes hot-reload without rebuilding. Trade-offs: it couples the container to the host's exact path, and file ownership/permissions (UID/GID) leak between host and container, which is a common source of "permission denied" bugs.</li>
<li><strong>tmpfs</strong>: an <strong>in-memory</strong> mount (Linux only), never written to disk and gone when the container stops. Use for <strong>secrets and scratch data</strong> you don't want persisted, or hot temp files where you want to avoid disk I/O.</li>
</ul>
<pre># Named volume — Docker manages it; survives container removal
docker run -v mydata:/var/lib/mysql mysql

# Bind mount — live host path; ideal for dev hot-reload
docker run -v $(pwd)/src:/app/src node

# tmpfs — in RAM, nothing touches disk
docker run --tmpfs /tmp myapp</pre>
<div class="key-point">Rule of thumb: <strong>named volumes for persistent app/database data</strong> (portable, Docker-managed), <strong>bind mounts for local development</strong> (live source), <strong>tmpfs for secrets/temp</strong>. A classic gotcha: with <code>-v name:/path</code> the first token has no slash (named volume) but <code>-v /host/path:/path</code> has one (bind mount) — the leading slash is what decides which you get.</div>`,
      },
      {
        q: 'What is Docker Compose? Explain key sections.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Compose defines a multi-container app in one YAML file so a whole stack comes up with a single command — it's mainly a local-dev and small-deployment tool, not a production orchestrator. You declare services, their build or image, ports, environment, volumes, and networks; Compose puts everything on a user-defined network so services resolve each other by name. The thing people get wrong is startup ordering: <code>depends_on</code> alone only waits for the container to start, not to be ready, so you need <code>condition: service_healthy</code> tied to a real healthcheck, otherwise your app races the database and crashes on boot.</p></div>
<p>Docker Compose defines and runs <strong>multi-container</strong> applications in a single YAML file.</p>
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
        a: `<div class="interview-answer"><p>Both orchestrate containers across a cluster — scheduling, keeping desired replicas running, networking, rollouts — so it's a power-versus-simplicity call. Swarm is built into Docker, so a cluster is two commands away and you already know the tooling, but it's capped: no real autoscaling, a thin ecosystem, and the community has clearly moved on. Kubernetes is the industry standard with declarative reconciliation, autoscaling, self-healing, and a massive ecosystem, at the cost of genuine operational complexity. My honest answer to "which?" is Swarm if you're tiny and want to ship today, but expect to standardize on managed Kubernetes — EKS, GKE, AKS — as you grow, because that's where the market and tooling are.</p></div>
<p>Both are <strong>container orchestrators</strong> — they schedule containers across a cluster of machines, keep the desired number running, handle networking between them, and roll out updates. The difference is one of <strong>power vs simplicity</strong>.</p>
<ul>
<li><strong>Docker Swarm</strong>: orchestration built straight into the Docker engine. You already know the tooling (<code>docker service</code>, Compose-style files) and a cluster is two commands away. The cost is a ceiling: no built-in autoscaling, a thinner ecosystem, and momentum that has clearly moved elsewhere.</li>
<li><strong>Kubernetes (K8s)</strong>: the industry-standard control plane. Declarative desired-state reconciliation, horizontal autoscaling (HPA), self-healing, rich rollout strategies, a huge ecosystem (Helm, operators, service mesh, every cloud offers a managed version). The cost is real operational complexity — more moving parts (API server, etcd, scheduler, controllers) and a steep learning curve.</li>
</ul>
<table style="width:100%;border-collapse:collapse;margin:10px 0;">
<tr><th style="text-align:left;padding:6px;border-bottom:1px solid #ccc;"></th><th style="padding:6px;border-bottom:1px solid #ccc;">Swarm</th><th style="padding:6px;border-bottom:1px solid #ccc;">K8s</th></tr>
<tr><td style="padding:6px;">Setup</td><td style="padding:6px;">Simple</td><td style="padding:6px;">Complex</td></tr>
<tr><td style="padding:6px;">Scaling</td><td style="padding:6px;">Manual</td><td style="padding:6px;">Auto (HPA)</td></tr>
<tr><td style="padding:6px;">Self-healing</td><td style="padding:6px;">Restart on failure</td><td style="padding:6px;">Reconciliation loop</td></tr>
<tr><td style="padding:6px;">Networking</td><td style="padding:6px;">Overlay</td><td style="padding:6px;">CNI plugins</td></tr>
<tr><td style="padding:6px;">Ecosystem</td><td style="padding:6px;">Small</td><td style="padding:6px;">Massive (Helm, operators, mesh)</td></tr>
<tr><td style="padding:6px;">Community</td><td style="padding:6px;">Declining</td><td style="padding:6px;">Dominant</td></tr>
</table>
<div class="key-point">How to answer "which should we use?": <strong>Swarm</strong> if the team is small, the app is simple, and you want to be running today — it's genuinely fine at small scale. <strong>Kubernetes</strong> if you need autoscaling, a rich ecosystem, multi-cloud portability, or you're hiring for skills the market already has. In practice K8s (usually managed — EKS/GKE/AKS) has won for anything non-trivial, so the honest senior answer is "Swarm to start simple, but expect to standardize on managed Kubernetes as you grow."</div>`,
      },
      {
        q: 'How does Docker image caching work in CI/CD?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Layer caching is easy locally but the trap in CI is that each run starts on a fresh runner with no cache, so naive builds rebuild everything every time. The fixes are external caches: a BuildKit registry cache with <code>cache-from</code> and <code>cache-to</code> to pull previous layers, or cache mounts for package directories so downloads persist. Then the ordering discipline still applies — dependencies before source so code changes only rebuild the tail. The mistake I see most is teams wondering why CI is slow when they never wired up <code>cache-from</code> at all, so every build is stone cold.</p></div>
<p>Docker caches each layer. If a layer's instruction + context haven't changed, the cache is used.</p>
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
        a: `<div class="interview-answer"><p>A health check is a command Docker runs periodically to decide if the container is actually functional, not just running — the process being up doesn't mean it's serving. You define it in the Dockerfile or Compose with an interval, timeout, retries, and a <code>start_period</code> grace window for slow boots, and the container moves through starting, healthy, and unhealthy. Orchestrators consume this: Compose can gate startup order on it and Swarm reschedules unhealthy containers. The nuance for Kubernetes is that it ignores Docker's HEALTHCHECK and uses its own liveness and readiness probes instead — and conflating those two probes is a common mistake.</p></div>
<p>Health checks let Docker know if a container is functioning properly.</p>
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
        a: `<div class="interview-answer"><p>Multi-stage builds let you use several FROM stages in one Dockerfile and ship only the last one. The point is separating build-time from runtime: you compile in a heavy stage with the full toolchain, then COPY --from just the artifact into a slim runtime image. That does three things at once — dramatically smaller images so pulls are faster, a smaller attack surface because compilers and build tools never ship to prod, and better caching since dependencies layer separately from source. It's essentially non-negotiable for production images; a Java build drops from an 800MB builder to a ~200MB JRE image, and a Node SPA can land at 25MB on nginx.</p></div>
<p><strong>Multi-stage builds</strong> let you use multiple FROM instructions in one Dockerfile. Each stage can use a different base image. Only the final stage becomes the output image.</p>
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
        a: `<div class="interview-answer"><p>My headline is don't run as root and don't bake in secrets. Add a non-root USER, because the default is root and a container escape then owns the host. Never embed secrets — they persist in image layers even after you delete them, so use build secrets or runtime injection. Then pin versions and ideally digests rather than <code>latest</code> for reproducibility, use minimal bases like distroless to shrink the attack surface, scan images with something like Trivy, and use a <code>.dockerignore</code> so you don't leak <code>.git</code> or <code>.env</code> into the build context. At runtime, drop capabilities, go read-only where you can, and set memory and CPU limits.</p></div>
<ol>
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
        a: `<div class="interview-answer"><p>Walking it through shows you understand the plumbing. The CLI sends the request over the REST API to the daemon, which checks for <code>nginx:latest</code> locally and pulls the layers if missing. It creates the container with the image layers read-only and a fresh writable layer on top, sets up a network namespace on the default bridge with its own IP, and for <code>-p 8080:80</code> adds an iptables NAT rule forwarding host 8080 to container 80. Then containerd and runc start nginx as PID 1 inside its namespaces with cgroup limits, and <code>-d</code> detaches so you just get the container ID back. The thing to land: the container lives exactly as long as PID 1 — that process exits and the container stops, there's no init inside by default.</p></div>
<ol>
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
        a: `<div class="interview-answer"><p>My debug order is exit code, then logs, then get a shell. <code>docker ps -a</code> shows the exit code and <code>docker inspect</code> shows the OOMKilled flag — and knowing the codes is the senior signal: 137 is SIGKILL, almost always an OOM kill against the memory limit; 143 is SIGTERM; 139 is a segfault. Logs survive the crash, so read them next. If it's running I exec in with a shell; if it won't even start I override the entrypoint with sh to look around, or on distroless attach an ephemeral debug container. The crash-loop mindset is that a container only lives as long as PID 1, so the question is always why that process keeps exiting.</p></div>
<pre># 1. Why did it die? Exit code + OOM flag
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
        a: `<div class="interview-answer"><p>The key moves are a multi-stage build shipping only a JRE not a JDK, Spring Boot's layered jar so the big dependency layers stay cached and only your thin application layer rebuilds per commit, and a container-aware JVM. That last one is the big one: size the heap with <code>-XX:MaxRAMPercentage</code> so it reads the cgroup limit, never a hardcoded <code>-Xmx</code> equal to the container limit — that guarantees an eventual exit-137 OOM kill because the kernel counts total RSS, not just heap. Then the usual hygiene: a non-root user, an Actuator health check, and handling SIGTERM for graceful shutdown. The MaxRAMPercentage miss is the single most common Java-in-Docker production incident.</p></div>
<ul>
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
      {
        q: "Why does my app ignore SIGTERM and take 10 seconds to stop? Explain the PID 1 problem.",
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p><code>docker stop</code> sends SIGTERM to PID 1, waits ten seconds, then SIGKILLs — so if your app takes the full ten seconds and drops requests, it never actually received the SIGTERM. Two usual causes: shell-form CMD runs your app under <code>/bin/sh</code>, so the shell is PID 1 and doesn't forward signals; and even as PID 1 the kernel installs no default handlers, so you must explicitly handle SIGTERM. The fixes are exec-form CMD with the JSON-array brackets so your process is PID 1, an actual SIGTERM handler that drains in-flight requests, and tini or <code>--init</code> if you spawn children, because PID 1 also has to reap zombies. The same mechanics carry to Kubernetes, just with a longer default grace period and a preStop hook to dodge the endpoint-removal race.</p></div>
<p><code>docker stop</code> sends <strong>SIGTERM to PID 1</strong>, waits (default 10s), then SIGKILLs. Two classic reasons your app never sees the SIGTERM:</p>
<ol>
<li><strong>Shell form vs exec form</strong>: <code>CMD npm start</code> actually runs <code>/bin/sh -c "npm start"</code> — the <strong>shell</strong> is PID 1, and it does NOT forward signals to its child. Your app is killed cold after the timeout, dropping in-flight requests. The exec form <code>CMD ["node", "server.js"]</code> makes your process PID 1 so it receives signals directly. (Same trap applies to ENTRYPOINT — and <code>npm start</code> itself also swallows signals.)</li>
<li><strong>PID 1 is special</strong>: the kernel installs no default signal handlers for PID 1. If your process doesn't explicitly handle SIGTERM, the signal is simply ignored.</li>
</ol>
<p>Bonus failure mode: PID 1 must <strong>reap orphaned children</strong>. App runtimes don't do this, so if your process spawns subprocesses you accumulate <strong>zombie processes</strong>. Fix with a minimal init: <code>docker run --init</code> or tini.</p>
<pre># BAD — shell form: sh is PID 1, node never gets SIGTERM
CMD npm start                      # → /bin/sh -c "npm start"

# GOOD — exec form (JSON array): node is PID 1, receives signals
CMD ["node", "server.js"]

# Belt and braces — tini forwards signals AND reaps zombies:
ENTRYPOINT ["tini", "--"]
CMD ["node", "server.js"]          # or: docker run --init myapp

// In the app — actually handle the signal (PID 1 ignores it by default):
process.on('SIGTERM', async () => {
  await server.close();            // stop accepting, drain in-flight requests
  await db.disconnect();
  process.exit(0);
});</pre>
<p><strong>Kubernetes angle</strong>: same mechanics — SIGTERM, then SIGKILL after <code>terminationGracePeriodSeconds</code> (default 30s). Because endpoint removal races with the SIGTERM, a <code>preStop</code> hook with a short sleep avoids serving errors during rolling updates.</p>
<div class="key-point">Always use exec-form CMD/ENTRYPOINT, handle SIGTERM in the app, and add tini/--init if you spawn children — otherwise every deploy is a hard kill of in-flight requests.</div>`,
      },
      {
        q: 'Why does my JVM or Node app get OOMKilled (exit 137) even though I set memory flags?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Exit 137 is the kernel OOM killer — the container blew past its cgroup memory limit — and the trap is that heap is only part of process memory. For the JVM the total is heap plus Metaspace plus thread stacks plus code cache plus direct buffers, so setting <code>-Xmx</code> equal to the limit guarantees a kill under load as threads and buffers grow. The rule is heap at about 75% of the limit via <code>MaxRAMPercentage</code>, leaving headroom. Two gotchas: an older JDK on a cgroup v2 host doesn't see the container limit and sizes a giant heap off the host's memory; and Node's V8 isn't cgroup-aware at all, so you must cap it with <code>--max-old-space-size</code>. And in Kubernetes it's the limit, not the request, that sets the ceiling that triggers the kill.</p></div>
<p>Exit 137 = SIGKILL from the kernel OOM killer: the container exceeded its <strong>cgroup memory limit</strong>. The trap is that <strong>the heap is only part of process memory</strong>:</p>
<ul>
<li><strong>JVM total ≈</strong> heap (<code>-Xmx</code>) + Metaspace + thread stacks (~1MB × thread count) + code cache + direct/NIO buffers + native libs. Setting <code>-Xmx</code> equal to the container limit therefore <em>guarantees</em> an eventual OOM kill — the kernel counts total RSS, not heap.</li>
<li><strong>Rule of thumb</strong>: heap ≤ ~75% of the limit. Use <code>-XX:MaxRAMPercentage=75.0</code> — it reads the cgroup limit at startup, so resizing the pod's memory needs no image change.</li>
<li><strong>cgroup awareness</strong>: JVM container support is on by default since JDK 8u191/10 — but <strong>cgroup v2</strong> (the default on modern distros and Kubernetes nodes) is only detected by JDK 8u372/11.0.16/15+. An older JDK on a cgroup v2 host sees the HOST's memory and happily sizes a giant heap.</li>
<li><strong>Node</strong>: V8 does not read cgroup limits at all — its default old-space size can exceed a small container limit. Cap it yourself with <code>--max-old-space-size</code> and leave headroom for buffers and native memory.</li>
<li><strong>Kubernetes</strong>: <code>requests</code> only affect scheduling; <code>limits</code> set the cgroup ceiling that triggers the kill.</li>
</ul>
<pre># Kubernetes:
resources:
  requests: { memory: "512Mi" }    # scheduler placement only
  limits:   { memory: "512Mi" }    # cgroup limit — exceed it → SIGKILL (137)

# JVM — heap sized FROM the container limit, with headroom:
ENV JAVA_TOOL_OPTIONS="-XX:MaxRAMPercentage=75.0 -XX:MaxMetaspaceSize=128m"

# Node — V8 is NOT cgroup-aware; cap the heap yourself (~75% of limit):
CMD ["node", "--max-old-space-size=384", "server.js"]

# Diagnose:
kubectl describe pod api-xyz       # Last State: Terminated, Reason: OOMKilled
docker inspect &lt;id&gt; --format '{{.State.OOMKilled}}'   # true</pre>
<p>Interviewer follow-up: "why did it only die under load?" — because thread count, direct buffers, and Metaspace all grow with traffic; the heap flag never covered them.</p>
<div class="key-point">Exit 137 is the cgroup limit being hit, not a JVM error: size the heap as a percentage of the container limit and keep 25%+ headroom for non-heap memory.</div>`,
      },
      {
        q: 'Alpine vs distroless vs slim — how do you choose a production base image?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>My default is slim or distroless, and I only reach for Alpine after verifying compatibility. The reason is libc: Alpine uses musl, not glibc, so glibc-compiled native modules can crash or force slow source rebuilds, plus it has subtle DNS-resolver differences and a slower allocator that hurts the JVM. Slim is the safe glibc default with most cruft removed; distroless goes further with no shell or package manager for a minimal attack surface, at the cost of being harder to debug — you use ephemeral debug containers instead of exec. And whatever you pick, never ship a floating tag like <code>latest</code> — pin the version and ideally the digest, because a tag can be re-pushed but a digest can't, so that's what makes builds reproducible and tamper-proof.</p></div>
<p>The choice is a trade-off between size, attack surface, <strong>libc compatibility</strong>, and debuggability:</p>
<table><tr><th>Base</th><th>Size</th><th>libc</th><th>Trade-off</th></tr>
<tr><td>node:20 / debian</td><td>~1GB</td><td>glibc</td><td>Everything works; huge attack surface, slow pulls</td></tr>
<tr><td>*-slim</td><td>~200MB</td><td>glibc</td><td>Good default: full compatibility, most packages removed</td></tr>
<tr><td>*-alpine</td><td>~50MB</td><td><strong>musl</strong></td><td>Tiny, but musl breaks glibc-compiled native modules, has subtle DNS-resolver differences, and a slower allocator (hurts JVM/multithreaded apps)</td></tr>
<tr><td>distroless</td><td>~20–130MB</td><td>glibc</td><td>No shell, no package manager — minimal attack surface, harder to poke around in</td></tr>
<tr><td>scratch</td><td>~0</td><td>—</td><td>Static binaries only (Go, Rust)</td></tr></table>
<ul>
<li><strong>The musl trap</strong>: Alpine is not "small Debian" — it's a different libc. Prebuilt native npm wheels/binaries targeting glibc can crash at runtime or force slow source rebuilds. Verify before adopting.</li>
<li><strong>Distroless debugging</strong>: no shell means <code>docker exec ... sh</code> fails by design; use ephemeral debug containers instead.</li>
<li><strong>Why FROM node:latest is a bug</strong>: the tag moves — tomorrow's build silently gets a new major version, so builds are not reproducible and prod runs something you never tested. Pin the version, and pin the <strong>digest</strong> for immutability (a tag can be re-pushed; a digest cannot).</li>
</ul>
<pre># Build with a full image, ship without a shell:
FROM node:20-slim AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci --omit=dev
COPY . .

FROM gcr.io/distroless/nodejs20-debian12
WORKDIR /app
COPY --from=build /app /app
CMD ["server.js"]                  # distroless entrypoint already runs node

# Pin by digest — reproducible and tamper-proof:
FROM node:20.11.1-slim@sha256:4b632f...

# No shell in distroless? Attach an ephemeral debug container:
kubectl debug -it api-xyz --image=busybox --target=api</pre>
<div class="key-point">Default to slim or distroless (glibc); choose Alpine only after verifying musl compatibility — and never ship a floating tag like latest to production.</div>`,
      },
    ],
  },

  // ───────────────────────── 6. SQL ─────────────────────────
];
