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
        a: `<div class="interview-answer"><p>CI/CD has three levels that build on each other. <strong>Continuous Integration</strong> means developers merge small changes often, and every commit runs an automated build and tests to catch problems early. <strong>Continuous Delivery</strong> keeps the code always ready to ship, but a person still clicks to deploy to production. <strong>Continuous Deployment</strong> removes that click, so every change that passes all tests goes to production automatically.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>CI/CD gồm ba cấp độ xây dựng chồng lên nhau. <strong>Continuous Integration</strong> nghĩa là lập trình viên merge các thay đổi nhỏ thường xuyên, và mỗi commit sẽ chạy build cùng test tự động để phát hiện lỗi sớm. <strong>Continuous Delivery</strong> giữ cho code luôn ở trạng thái sẵn sàng phát hành, nhưng vẫn cần một người bấm nút để deploy lên production. <strong>Continuous Deployment</strong> bỏ luôn thao tác bấm nút đó, nên mọi thay đổi vượt qua hết các bài test đều tự động lên production.</p></details>
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
        a: `<div class="interview-answer"><p>A CI/CD pipeline is a series of stages where cheap, fast checks run first and gate the slower, more expensive ones. The usual order is source, build (one artifact), tests, security scan, deploy to staging, acceptance tests, then production with a safe rollout and health checks. A key idea is <strong>build once, deploy many</strong>: the same artifact that passed staging is the one that ships to production. Each stage should fail fast so a broken build stops early.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một CI/CD pipeline là chuỗi các stage, trong đó những kiểm tra nhanh và rẻ chạy trước và làm cổng chặn cho các bước chậm, tốn kém hơn. Thứ tự thường gặp là source, build (tạo một artifact), test, quét bảo mật, deploy lên staging, chạy acceptance test, rồi mới tới production với cách rollout an toàn và health check. Một ý tưởng cốt lõi là <strong>build once, deploy many</strong>: chính artifact đã vượt qua staging cũng là artifact được đưa lên production. Mỗi stage nên fail fast để một bản build hỏng bị chặn lại từ sớm.</p></details>
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
        a: `<div class="interview-answer"><p>These are three ways to release a new version with different risk and cost. <strong>Blue-green</strong> runs two full environments and switches traffic to the new one, giving instant rollback but doubling infrastructure cost. <strong>Canary</strong> sends a small share of real traffic to the new version and watches metrics before increasing it, which is safe but needs good monitoring. <strong>Rolling</strong> replaces instances a few at a time with no extra infrastructure, but old and new versions run at the same time for a short while.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là ba cách phát hành phiên bản mới với mức độ rủi ro và chi phí khác nhau. <strong>Blue-green</strong> chạy song song hai môi trường đầy đủ rồi chuyển traffic sang môi trường mới, cho phép rollback tức thì nhưng tốn gấp đôi chi phí hạ tầng. <strong>Canary</strong> đẩy một phần nhỏ traffic thật sang phiên bản mới và theo dõi metric trước khi tăng dần, an toàn nhưng cần monitoring tốt. <strong>Rolling</strong> thay thế các instance vài cái một lần mà không cần thêm hạ tầng, nhưng phiên bản cũ và mới sẽ chạy cùng lúc trong một khoảng ngắn.</p></details>
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
        a: `<div class="interview-answer"><p><strong>GitFlow</strong> uses several long-lived branches like develop, release, and feature, which fits scheduled version releases but leads to large, painful merges. <strong>Trunk-based development</strong> has everyone commit to the main branch using very short-lived branches that merge within a day, with unfinished work hidden behind feature flags. Small frequent merges cause fewer conflicts and faster feedback, so trunk-based fits CI/CD better. GitFlow still helps when a product ships many supported versions.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>GitFlow</strong> dùng nhiều nhánh sống lâu như develop, release và feature, phù hợp cho việc phát hành phiên bản theo lịch nhưng dẫn tới những lần merge lớn và đau đầu. <strong>Trunk-based development</strong> thì mọi người commit thẳng vào nhánh chính bằng các nhánh sống rất ngắn, merge trong vòng một ngày, còn phần việc chưa xong thì được giấu sau feature flag. Merge nhỏ và thường xuyên giúp giảm xung đột và phản hồi nhanh hơn, nên trunk-based hợp với CI/CD hơn. GitFlow vẫn hữu ích khi một sản phẩm phải hỗ trợ nhiều phiên bản cùng lúc.</p></details>
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
        a: `<div class="interview-answer"><p>GitHub Actions has a simple hierarchy: a <strong>workflow</strong> contains <strong>jobs</strong>, and each job contains <strong>steps</strong>. A workflow is a YAML file in <code>.github/workflows</code> that runs on events like push or pull request, a job runs on its own fresh machine, and a step is one action or shell command. Jobs run in parallel by default and share nothing, so use <code>needs</code> for order and artifacts to pass files between them. Pinning third-party actions to a commit SHA is safer than using a moving tag.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>GitHub Actions có một cấu trúc phân cấp đơn giản: một <strong>workflow</strong> chứa nhiều <strong>job</strong>, và mỗi job chứa nhiều <strong>step</strong>. Workflow là một file YAML trong <code>.github/workflows</code> chạy theo các sự kiện như push hay pull request, mỗi job chạy trên một máy mới riêng, còn step là một action hoặc một lệnh shell. Các job mặc định chạy song song và không chia sẻ gì với nhau, nên hãy dùng <code>needs</code> để sắp thứ tự và dùng artifact để truyền file giữa chúng. Ghim các action bên thứ ba theo commit SHA sẽ an toàn hơn dùng một tag di động.</p></details>
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
        a: `<div class="interview-answer"><p>Secrets should never be stored in the repository, not in code and not in committed <code>.env</code> files. Instead they are injected at runtime from the platform's secret store, shown as masked values, and scoped per environment so staging cannot read production credentials. For cloud deploys, <strong>OIDC</strong> lets the pipeline get a short-lived token instead of storing a long-lived key. Secrets should also be rotated regularly with an audit trail.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Secret không bao giờ được lưu trong repository, không nằm trong code và cũng không nằm trong file <code>.env</code> được commit. Thay vào đó chúng được inject lúc runtime từ kho secret của nền tảng, hiển thị dưới dạng giá trị đã che, và phân tách theo từng môi trường để staging không đọc được credential của production. Với deploy lên cloud, <strong>OIDC</strong> cho phép pipeline lấy một token ngắn hạn thay vì lưu một key dài hạn. Secret cũng nên được xoay vòng định kỳ kèm nhật ký kiểm tra.</p></details>
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
        a: `<div class="interview-answer"><p><strong>Infrastructure as Code</strong> means servers, networks, and policies are written in version-controlled files instead of set up by hand in a console. This lets infrastructure changes go through the same pull request review, history, and CI as application code, giving reproducible and auditable environments. A common flow runs <code>terraform plan</code> on the pull request so reviewers see the exact change, then <code>terraform apply</code> on merge. The state file must be stored remotely and locked so two runs do not corrupt each other.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Infrastructure as Code</strong> nghĩa là server, network và policy được viết thành các file quản lý bằng version control thay vì cấu hình thủ công trên console. Nhờ đó thay đổi hạ tầng đi qua đúng quy trình review pull request, có lịch sử và chạy CI như code ứng dụng, cho ra những môi trường tái lập được và kiểm tra được. Một luồng phổ biến là chạy <code>terraform plan</code> trên pull request để reviewer thấy chính xác thay đổi, rồi chạy <code>terraform apply</code> khi merge. State file phải được lưu từ xa và khóa lại để hai lần chạy không làm hỏng nhau.</p></details>
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
        a: `<div class="interview-answer"><p>A good rollback should be fast and simple, often faster than trying to fix the problem live. Common options are redeploying the previous known-good artifact, switching traffic back in a blue-green setup, or reverting the commit in a GitOps repo so the controller restores the old state. Feature flags are the fastest because a feature can be turned off with no deploy. The hardest part is the database, so migrations must be backward-compatible using the expand-contract pattern.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một rollback tốt phải nhanh và đơn giản, thường còn nhanh hơn cả việc cố sửa lỗi trực tiếp. Các lựa chọn phổ biến là deploy lại artifact tốt đã biết trước đó, chuyển traffic ngược lại trong mô hình blue-green, hoặc revert commit trong repo GitOps để controller khôi phục trạng thái cũ. Feature flag là nhanh nhất vì có thể tắt một tính năng mà không cần deploy. Phần khó nhất là database, nên các migration phải tương thích ngược bằng mẫu expand-contract.</p></details>
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
        a: `<div class="interview-answer"><p>All three tools do the same core work, so the main difference is hosting and ecosystem. <strong>Jenkins</strong> is self-hosted and very flexible through plugins, but the team must maintain, upgrade, and secure it. <strong>GitLab CI</strong> and <strong>GitHub Actions</strong> are managed and configured as code in the repo, with almost no infrastructure to run; GitLab works well as an all-in-one platform and GitHub Actions has the largest marketplace. The choice usually depends on where the code already lives.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả ba công cụ đều làm cùng một phần việc cốt lõi, nên khác biệt chính nằm ở cách host và hệ sinh thái. <strong>Jenkins</strong> tự host và rất linh hoạt nhờ plugin, nhưng đội ngũ phải tự bảo trì, nâng cấp và bảo mật nó. <strong>GitLab CI</strong> và <strong>GitHub Actions</strong> được quản lý sẵn và cấu hình như code ngay trong repo, gần như không phải vận hành hạ tầng nào; GitLab hợp làm nền tảng tất-cả-trong-một còn GitHub Actions có marketplace lớn nhất. Lựa chọn thường tùy thuộc vào nơi code đang nằm sẵn.</p></details>
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
        a: `<div class="interview-answer"><p><strong>Artifacts</strong> pass build outputs like a jar between jobs so the work is not repeated, while <strong>caching</strong> keeps dependencies such as <code>node_modules</code> or the Maven repository between runs to avoid re-downloading them. Other speedups include running tests in parallel, splitting test suites, and in a monorepo building only what changed. A cache key should be based on the lockfile hash so the cache refreshes exactly when dependencies change and never serves stale ones.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Artifact</strong> truyền các kết quả build như một file jar giữa các job để khỏi phải làm lại, còn <strong>caching</strong> giữ lại dependency như <code>node_modules</code> hay kho Maven giữa các lần chạy để không phải tải lại. Các cách tăng tốc khác gồm chạy test song song, chia nhỏ bộ test, và trong monorepo thì chỉ build những gì thay đổi. Cache key nên dựa trên hash của lockfile để cache làm mới đúng lúc dependency thay đổi và không bao giờ trả về bản cũ.</p></details>
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
        a: `<div class="interview-answer"><p><strong>GitOps</strong> makes Git the single source of truth for what is running, not just for code. The desired state, such as Kubernetes manifests or Helm charts, is stored in a repo, and a controller like ArgoCD or Flux continuously makes the cluster match it. Changes go through pull requests, giving an audit trail, easy rollback with <code>git revert</code>, and self-healing when someone changes the cluster by hand. It uses a pull model: CI builds the image, a pull request updates the tag, and the cluster pulls itself into line.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>GitOps</strong> biến Git thành nguồn chân lý duy nhất cho những gì đang chạy, chứ không chỉ cho code. Trạng thái mong muốn, chẳng hạn các manifest Kubernetes hay Helm chart, được lưu trong một repo, và một controller như ArgoCD hay Flux liên tục làm cho cluster khớp với nó. Thay đổi đi qua pull request, cho ta nhật ký kiểm tra, rollback dễ dàng bằng <code>git revert</code>, và tự chữa lành khi ai đó sửa cluster bằng tay. Nó dùng mô hình pull: CI build image, một pull request cập nhật tag, và cluster tự kéo mình về đúng trạng thái.</p></details>
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
        a: `<div class="interview-answer"><p>The testing pyramid spends the test budget where it pays off: many fast unit tests at the base, fewer integration tests in the middle, and a small number of slow, fragile end-to-end tests at the top. The bad pattern is the reverse, mostly manual and end-to-end tests, which gives slow and flaky feedback. In the pipeline, unit tests run on every push, integration tests on merge, and end-to-end tests before production. A rough split is 70 percent unit, 20 percent integration, and 10 percent end-to-end.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Testing pyramid dồn ngân sách test vào nơi có hiệu quả nhất: nhiều unit test nhanh ở đáy, ít integration test hơn ở giữa, và một số nhỏ end-to-end test chậm và dễ vỡ ở đỉnh. Mẫu xấu là làm ngược lại, chủ yếu là test thủ công và end-to-end, cho phản hồi chậm và chập chờn. Trong pipeline, unit test chạy ở mỗi lần push, integration test khi merge, còn end-to-end test trước khi lên production. Một tỷ lệ ước chừng là 70 phần trăm unit, 20 phần trăm integration và 10 phần trăm end-to-end.</p></details>
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
        a: `<div class="interview-answer"><p><strong>Feature flags</strong> separate deploying code from releasing a feature, so code can ship to production with the feature turned off and enabled later without another deploy. This makes trunk-based development and continuous deployment safer, and allows gradual rollout, A/B tests, and an instant kill switch. The tradeoff is that flags are technical debt, since each one adds a branch in the code and more tests. Flags should have expiry dates and be removed after launch.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Feature flag</strong> tách việc deploy code khỏi việc phát hành tính năng, nên code có thể lên production với tính năng đang tắt và bật sau mà không cần deploy lại. Điều này giúp trunk-based development và continuous deployment an toàn hơn, đồng thời cho phép rollout dần dần, test A/B, và một công tắc tắt khẩn cấp tức thì. Đánh đổi là flag trở thành nợ kỹ thuật, vì mỗi flag thêm một nhánh rẽ trong code và nhiều test hơn. Flag nên có ngày hết hạn và được gỡ bỏ sau khi ra mắt.</p></details>
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
        a: `<div class="interview-answer"><p>A <strong>monorepo</strong> keeps all projects in one repository, which makes cross-project changes and code sharing easy but requires CI that builds only what changed. A <strong>polyrepo</strong> gives each project its own repo with a simple independent pipeline, but sharing code and coordinating changes across repos is harder. The deciding factor is coupling: tightly linked projects that change together fit a monorepo with affected-only build tools like Nx or Bazel, while truly independent projects fit polyrepos.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Monorepo</strong> giữ mọi project trong một repository duy nhất, giúp thay đổi xuyên project và chia sẻ code dễ dàng nhưng đòi hỏi CI chỉ build những gì thay đổi. <strong>Polyrepo</strong> cho mỗi project một repo riêng với pipeline độc lập đơn giản, nhưng chia sẻ code và phối hợp thay đổi giữa các repo lại khó hơn. Yếu tố quyết định là mức độ ràng buộc: các project gắn chặt và thay đổi cùng nhau hợp với monorepo dùng công cụ build chỉ-phần-ảnh-hưởng như Nx hay Bazel, còn các project thực sự độc lập hợp với polyrepo.</p></details>
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
        a: `<div class="interview-answer"><p><strong>Build once, deploy many</strong> means building exactly one immutable artifact per commit and promoting that same artifact through dev, staging, and production, never rebuilding per environment. Rebuilding risks pulling different dependencies or flags, so staging would validate something different from what ships. Configuration is the only thing that changes per environment and is injected at deploy time, not baked in. Tag artifacts with a version and git SHA instead of a moving tag like <code>latest</code>.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Build once, deploy many</strong> nghĩa là build đúng một artifact bất biến cho mỗi commit và đưa chính artifact đó qua dev, staging và production, không bao giờ build lại theo từng môi trường. Build lại có nguy cơ kéo về dependency hay flag khác nhau, khiến staging kiểm chứng một thứ khác với thứ được phát hành. Cấu hình là thứ duy nhất thay đổi theo môi trường và được inject lúc deploy, chứ không nướng cứng vào trong. Hãy gắn tag cho artifact bằng version và git SHA thay vì một tag di động như <code>latest</code>.</p></details>
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
        a: `<div class="interview-answer"><p>During a rolling deploy, old and new code run against the same database at once, so every migration must stay compatible with the version still running. The <strong>expand-contract</strong> pattern handles this: add the new column as nullable, have new code write to both and backfill in batches, switch reads after checking, and only drop the old column in a much later release. Renaming or dropping a column in use, adding NOT NULL without a default, or long locking changes at peak will break this. The rule is that versions N and N+1 must both work against the same schema.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trong lúc rolling deploy, code cũ và mới chạy trên cùng một database cùng lúc, nên mọi migration phải tương thích với phiên bản vẫn đang chạy. Mẫu <strong>expand-contract</strong> xử lý việc này: thêm cột mới ở dạng nullable, cho code mới ghi vào cả hai và backfill theo từng lô, chuyển đọc sang sau khi kiểm tra, và chỉ xóa cột cũ ở một release muộn hơn nhiều. Đổi tên hay xóa một cột đang dùng, thêm NOT NULL mà không có default, hoặc các thay đổi khóa bảng lâu vào giờ cao điểm sẽ phá vỡ điều này. Quy tắc là phiên bản N và N+1 đều phải chạy được trên cùng một schema.</p></details>
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
        a: `<div class="interview-answer"><p>The pipeline is production infrastructure and deserves the same care, because many real attacks targeted the build rather than the app. Key practices are least privilege with short-lived OIDC tokens instead of stored cloud keys, protected branches that require review and passing checks, and pinning dependencies and third-party actions to a commit SHA. Dependencies, images, and source code should be scanned, and artifacts signed with a tool like cosign plus an SBOM so production only runs what CI built. Runners should be isolated so untrusted pull request code cannot read secrets.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Pipeline là hạ tầng production và xứng đáng được chăm sóc như vậy, bởi nhiều cuộc tấn công thực tế nhắm vào bản build chứ không phải ứng dụng. Các thực hành then chốt là nguyên tắc đặc quyền tối thiểu với token OIDC ngắn hạn thay cho key cloud lưu sẵn, các nhánh được bảo vệ yêu cầu review và pass hết các check, cùng việc ghim dependency và action bên thứ ba theo commit SHA. Dependency, image và source code đều nên được quét, còn artifact thì nên được ký bằng công cụ như cosign kèm SBOM để production chỉ chạy đúng thứ CI đã build. Runner nên được cô lập để code từ pull request không đáng tin không đọc được secret.</p></details>
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
        a: `<div class="interview-answer"><p><strong>DORA metrics</strong> are four measures of software delivery. Deployment frequency and lead time for changes measure speed, while change failure rate and time to restore measure stability. Speed and stability usually improve together, because small frequent changes are easier to understand and roll back, so trading one for the other is a warning sign. All four improve with the same practices: smaller pull requests, trunk-based development, strong automated tests, and fast rollback behind flags.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>DORA metrics</strong> là bốn thước đo về hiệu quả bàn giao phần mềm. Deployment frequency và lead time for changes đo tốc độ, còn change failure rate và time to restore đo độ ổn định. Tốc độ và độ ổn định thường cải thiện cùng nhau, vì các thay đổi nhỏ và thường xuyên dễ hiểu và dễ rollback hơn, nên đánh đổi cái này lấy cái kia là một dấu hiệu cảnh báo. Cả bốn đều tốt lên nhờ cùng những thực hành: pull request nhỏ hơn, trunk-based development, bộ test tự động mạnh, và rollback nhanh sau feature flag.</p></details>
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
        a: `<div class="interview-answer"><p>A good pipeline gives trustworthy feedback in under about ten minutes by running cheap checks like lint, typecheck, and unit tests first, then heavier integration and end-to-end tests later and in parallel. Speed matters because a slow or flaky pipeline makes developers batch changes and ignore failures. Flaky tests should be found by pass-on-retry, then quarantined out of the blocking path with a ticket to fix them, rather than hidden by retrying many times. A red main branch is a stop-the-line event that is reverted or fixed right away.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một pipeline tốt cho phản hồi đáng tin trong khoảng dưới mười phút bằng cách chạy các kiểm tra rẻ như lint, typecheck và unit test trước, rồi mới tới các integration và end-to-end test nặng hơn chạy sau và song song. Tốc độ quan trọng vì một pipeline chậm hoặc chập chờn khiến lập trình viên gom thay đổi lại thành lô và bỏ qua các lần fail. Test chập chờn nên được phát hiện bằng cách pass-khi-retry, rồi cách ly khỏi đường chặn kèm một ticket để sửa, thay vì che giấu bằng cách retry nhiều lần. Nhánh chính bị đỏ là một sự kiện dừng-dây-chuyền, phải revert hoặc sửa ngay.</p></details>
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
        a: `<div class="interview-answer"><p>The main difference is that containers share the host's kernel while each virtual machine runs its own. Docker isolation is at the OS level, using Linux namespaces to control what a process can see and cgroups to control what it can use, so a container is really a confined process with small images and very fast startup. A VM emulates hardware and boots a full guest OS, giving stronger isolation but larger size and slower boot. Because the kernel is shared, a Linux container needs a Linux kernel, so on Windows or Mac Docker quietly runs a small Linux VM.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khác biệt chính là container chia sẻ kernel của host còn mỗi virtual machine chạy kernel riêng của nó. Docker cô lập ở mức OS, dùng Linux namespace để kiểm soát những gì một process nhìn thấy và cgroup để kiểm soát những gì nó dùng, nên một container thực chất là một process bị giới hạn với image nhỏ và khởi động rất nhanh. Một VM mô phỏng phần cứng và boot cả một guest OS đầy đủ, cho cách ly mạnh hơn nhưng kích thước lớn hơn và boot chậm hơn. Vì kernel được chia sẻ, một Linux container cần một Linux kernel, nên trên Windows hay Mac thì Docker âm thầm chạy một Linux VM nhỏ.</p></details>
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
        a: `<div class="interview-answer"><p>Docker is a client-server system. The <strong>CLI</strong> talks over a REST API to the <strong>daemon</strong> (<code>dockerd</code>), which manages images, networks, and volumes and passes the container lifecycle to <strong>containerd</strong>, which uses <strong>runc</strong> to start the process with namespaces and cgroups. An <strong>image</strong> is a read-only stack of layers built from a Dockerfile, a <strong>container</strong> is a running instance with a thin writable layer on top, and a <strong>registry</strong> like Docker Hub or ECR stores and shares images. The daemon runs as root, which is why rootless Docker and daemonless tools like Podman exist.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Docker là một hệ thống client-server. <strong>CLI</strong> nói chuyện qua REST API tới <strong>daemon</strong> (<code>dockerd</code>), thứ quản lý image, network và volume rồi giao vòng đời container cho <strong>containerd</strong>, cái này lại dùng <strong>runc</strong> để khởi động process với namespace và cgroup. Một <strong>image</strong> là một chồng layer chỉ đọc build từ Dockerfile, một <strong>container</strong> là một instance đang chạy có thêm một layer ghi mỏng ở trên, còn một <strong>registry</strong> như Docker Hub hay ECR lưu và chia sẻ image. Daemon chạy dưới quyền root, đó là lý do có rootless Docker và các công cụ không cần daemon như Podman.</p></details>
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
        a: `<div class="interview-answer"><p>A Dockerfile is the recipe for building an image, and it helps to know which instructions create layers and how order affects caching. <code>FROM</code> sets the base, <code>RUN</code> executes build commands and each one adds a layer, <code>COPY</code> brings files in, and <code>CMD</code> or <code>ENTRYPOINT</code> defines what runs. Prefer <code>COPY</code> over <code>ADD</code> unless tar extraction is needed, and copy the dependency file and install before copying source so the install layer stays cached when only code changes. Running as a non-root <code>USER</code> is safer than the default root.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Dockerfile là công thức để build một image, và sẽ hữu ích nếu biết instruction nào tạo layer và thứ tự ảnh hưởng đến caching ra sao. <code>FROM</code> đặt base, <code>RUN</code> chạy lệnh lúc build và mỗi lệnh thêm một layer, <code>COPY</code> đưa file vào, còn <code>CMD</code> hoặc <code>ENTRYPOINT</code> định nghĩa cái sẽ chạy. Hãy ưu tiên <code>COPY</code> hơn <code>ADD</code> trừ khi cần giải nén tar, và copy file dependency rồi cài đặt trước khi copy source để layer cài đặt còn được cache khi chỉ có code thay đổi. Chạy dưới một <code>USER</code> không phải root sẽ an toàn hơn mặc định root.</p></details>
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
        a: `<div class="interview-answer"><p>An image is a stack of cached, shared, read-only layers, and a container adds a writable copy-on-write layer on top. Two rules follow: layers are shared across images so a common base is stored and pulled once, and any change invalidates that layer and everything below it. So the Dockerfile should be ordered from least-changed to most-changed, with dependencies before source, so a code edit only rebuilds cheap final layers. Multi-stage builds give the biggest win by shipping only the artifact, and cleanup must happen in the same <code>RUN</code> or the earlier layer still holds the files.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một image là một chồng layer chỉ đọc được cache và chia sẻ, còn một container thêm một layer ghi copy-on-write ở trên. Từ đó rút ra hai quy tắc: các layer được chia sẻ giữa các image nên một base chung chỉ lưu và pull một lần, và bất kỳ thay đổi nào cũng làm mất hiệu lực layer đó cùng mọi thứ nằm dưới nó. Vì vậy Dockerfile nên được sắp từ ít-thay-đổi-nhất tới hay-thay-đổi-nhất, với dependency trước source, để một lần sửa code chỉ build lại các layer cuối rẻ tiền. Multi-stage build cho lợi ích lớn nhất khi chỉ ship artifact, và việc dọn dẹp phải nằm trong cùng một <code>RUN</code> nếu không layer trước đó vẫn giữ các file.</p></details>
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
        a: `<div class="interview-answer"><p><code>CMD</code> sets a default that arguments to <code>docker run</code> can easily override, while <code>ENTRYPOINT</code> fixes the executable and appends run arguments to it. The common pattern uses <code>ENTRYPOINT</code> for the binary and <code>CMD</code> for its default flags, so users can change flags without replacing the whole command. A subtle trap is shell form versus exec form: without the JSON-array brackets the command runs through <code>/bin/sh</code>, which becomes PID 1 and does not pass on signals. Always use the exec form with bracket syntax.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>CMD</code> đặt một giá trị mặc định mà các tham số truyền cho <code>docker run</code> có thể dễ dàng ghi đè, còn <code>ENTRYPOINT</code> cố định file thực thi và nối các tham số run vào sau nó. Mẫu phổ biến dùng <code>ENTRYPOINT</code> cho binary và <code>CMD</code> cho các cờ mặc định của nó, nên người dùng có thể đổi cờ mà không phải thay cả lệnh. Một cái bẫy tinh tế là dạng shell so với dạng exec: không có dấu ngoặc kiểu mảng JSON thì lệnh chạy qua <code>/bin/sh</code>, biến shell thành PID 1 và không chuyển tiếp tín hiệu. Luôn dùng dạng exec với cú pháp ngoặc.</p></details>
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
        a: `<div class="interview-answer"><p>Each network driver is a different balance of isolation, performance, and reach. <strong>Bridge</strong> is the single-host default, giving each container a private IP and using <code>-p</code> to publish ports through NAT; on the default bridge containers reach each other only by IP, so a user-defined bridge is needed for DNS by name, which is why Compose creates one. <strong>Host</strong> skips the bridge and NAT for speed but loses isolation and can collide with host ports. <strong>None</strong> gives full isolation with only loopback, and <strong>overlay</strong> connects containers across multiple hosts in a cluster.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mỗi network driver là một cân bằng khác nhau giữa cô lập, hiệu năng và tầm với. <strong>Bridge</strong> là mặc định trên một host, cấp cho mỗi container một IP riêng và dùng <code>-p</code> để publish port qua NAT; trên bridge mặc định các container chỉ tới nhau bằng IP, nên cần một user-defined bridge để có DNS theo tên, đó là lý do Compose tạo một cái. <strong>Host</strong> bỏ qua bridge và NAT để nhanh hơn nhưng mất cách ly và có thể đụng port với host. <strong>None</strong> cho cô lập hoàn toàn chỉ với loopback, còn <strong>overlay</strong> nối các container qua nhiều host trong một cluster.</p></details>
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
        a: `<div class="interview-answer"><p>Volumes exist because a container's writable layer is temporary and slow for heavy I/O and is lost when the container is removed. <strong>Named volumes</strong> are Docker-managed storage that outlives containers and is portable, making them the right choice for production data like databases. <strong>Bind mounts</strong> map a specific host directory in, which is ideal for development hot-reload but ties you to the host path and can cause permission problems. <strong>Tmpfs</strong> is in-memory only, good for secrets or scratch data; with <code>-v</code>, a leading slash marks a bind mount while a plain name marks a named volume.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Volume tồn tại vì layer ghi của một container chỉ tạm thời và chậm với I/O nặng, và bị mất khi container bị xóa. <strong>Named volume</strong> là kho lưu trữ do Docker quản lý, sống lâu hơn container và di động được, nên là lựa chọn đúng cho dữ liệu production như database. <strong>Bind mount</strong> gắn một thư mục cụ thể của host vào trong, lý tưởng cho hot-reload lúc phát triển nhưng buộc chặt bạn vào đường dẫn của host và có thể gây lỗi quyền truy cập. <strong>Tmpfs</strong> chỉ nằm trong bộ nhớ, hợp cho secret hay dữ liệu tạm; với <code>-v</code>, dấu gạch chéo ở đầu đánh dấu một bind mount còn một tên trơn đánh dấu một named volume.</p></details>
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
        a: `<div class="interview-answer"><p>Docker Compose defines a multi-container app in one YAML file so the whole stack starts with a single command, mainly for local development and small deployments rather than production orchestration. It declares services with their build or image, ports, environment, volumes, and networks, and puts everything on a user-defined network so services resolve each other by name. A common mistake is startup order: <code>depends_on</code> alone only waits for the container to start, so <code>condition: service_healthy</code> with a real healthcheck is needed to wait until a dependency is actually ready.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Docker Compose định nghĩa một ứng dụng nhiều container trong một file YAML để cả stack khởi động bằng một lệnh duy nhất, chủ yếu cho phát triển cục bộ và triển khai nhỏ chứ không phải điều phối production. Nó khai báo các service kèm build hoặc image, port, environment, volume và network, đồng thời đặt mọi thứ lên một user-defined network để các service tìm nhau bằng tên. Một lỗi phổ biến là thứ tự khởi động: chỉ mình <code>depends_on</code> chỉ chờ container khởi động, nên cần <code>condition: service_healthy</code> kèm một healthcheck thật để chờ tới khi một dependency thực sự sẵn sàng.</p></details>
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
        a: `<div class="interview-answer"><p>Both orchestrate containers across a cluster, so the choice is power versus simplicity. <strong>Docker Swarm</strong> is built into Docker and easy to start, but it has no real autoscaling, a small ecosystem, and declining momentum. <strong>Kubernetes</strong> is the industry standard with declarative reconciliation, autoscaling, self-healing, and a large ecosystem, at the cost of real operational complexity. Swarm suits small, simple setups that need to ship today, but most teams standardize on managed Kubernetes such as EKS, GKE, or AKS as they grow.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả hai đều điều phối container qua một cluster, nên lựa chọn là giữa sức mạnh và sự đơn giản. <strong>Docker Swarm</strong> tích hợp sẵn trong Docker và dễ bắt đầu, nhưng không có autoscaling thực sự, hệ sinh thái nhỏ và đà phát triển đang giảm. <strong>Kubernetes</strong> là chuẩn công nghiệp với reconciliation khai báo, autoscaling, tự chữa lành và một hệ sinh thái lớn, đổi lại là độ phức tạp vận hành thật sự. Swarm hợp với các setup nhỏ, đơn giản cần ship ngay hôm nay, nhưng đa số đội ngũ chuẩn hóa theo Kubernetes được quản lý như EKS, GKE hay AKS khi lớn dần.</p></details>
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
        a: `<div class="interview-answer"><p>Layer caching works well locally, but in CI each run starts on a fresh machine with no cache, so naive builds rebuild everything every time. The fix is external caches: a BuildKit registry cache using <code>cache-from</code> and <code>cache-to</code>, or cache mounts so package downloads persist. Good Dockerfile ordering still matters, with dependencies before source so code changes only rebuild the last layers. A common cause of slow CI is never setting up <code>cache-from</code>, so every build starts cold.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Layer caching hoạt động tốt ở cục bộ, nhưng trong CI mỗi lần chạy bắt đầu trên một máy mới không có cache, nên cách build ngây thơ sẽ build lại mọi thứ mỗi lần. Cách khắc phục là dùng cache bên ngoài: một registry cache của BuildKit qua <code>cache-from</code> và <code>cache-to</code>, hoặc cache mount để các lần tải package được giữ lại. Sắp xếp Dockerfile hợp lý vẫn quan trọng, với dependency trước source để thay đổi code chỉ build lại các layer cuối. Một nguyên nhân phổ biến khiến CI chậm là không bao giờ thiết lập <code>cache-from</code>, nên mọi lần build đều bắt đầu từ đầu.</p></details>
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
        a: `<div class="interview-answer"><p>A health check is a command Docker runs on a schedule to decide whether the container is actually working, not just running. It is defined in the Dockerfile or Compose with interval, timeout, retries, and a <code>start_period</code> grace window, and the container moves through starting, healthy, and unhealthy states. Orchestrators use this: Compose can gate startup order on it and Swarm reschedules unhealthy containers. Kubernetes ignores Docker's HEALTHCHECK and uses its own liveness and readiness probes instead.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Health check là một lệnh Docker chạy theo lịch để quyết định xem container có thực sự hoạt động hay không, chứ không chỉ là đang chạy. Nó được định nghĩa trong Dockerfile hoặc Compose với interval, timeout, retries và một khoảng ân hạn <code>start_period</code>, và container đi qua các trạng thái starting, healthy và unhealthy. Các orchestrator dùng điều này: Compose có thể chặn thứ tự khởi động dựa vào nó còn Swarm sẽ lên lịch lại các container unhealthy. Kubernetes bỏ qua HEALTHCHECK của Docker và dùng liveness cùng readiness probe riêng của nó.</p></details>
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
        a: `<div class="interview-answer"><p>Multi-stage builds use several <code>FROM</code> stages in one Dockerfile and ship only the last one. This separates build time from runtime: the code is compiled in a heavy stage with the full toolchain, then <code>COPY --from</code> takes only the artifact into a slim runtime image. The result is much smaller images with faster pulls, a smaller attack surface since build tools never ship, and better caching because dependencies and source layer separately. They are essential for production, for example dropping a Java image from around 800MB to about 200MB.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Multi-stage build dùng nhiều stage <code>FROM</code> trong một Dockerfile và chỉ ship stage cuối. Cách này tách thời điểm build khỏi runtime: code được biên dịch trong một stage nặng với đầy đủ toolchain, rồi <code>COPY --from</code> chỉ lấy artifact vào một image runtime gọn nhẹ. Kết quả là image nhỏ hơn nhiều với pull nhanh hơn, bề mặt tấn công nhỏ hơn vì build tool không bao giờ được ship, và caching tốt hơn vì dependency và source nằm ở các layer riêng. Chúng thiết yếu cho production, ví dụ giảm một image Java từ khoảng 800MB xuống còn khoảng 200MB.</p></details>
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
        a: `<div class="interview-answer"><p>The two headline rules are do not run as root and do not bake in secrets. Add a non-root <code>USER</code>, because a container escape as root can take over the host, and never embed secrets since they stay in image layers even after deletion. Also pin versions and ideally digests instead of <code>latest</code>, use minimal base images like distroless, scan images with a tool like Trivy, and use a <code>.dockerignore</code> to keep <code>.git</code> and <code>.env</code> out of the build context. At runtime, drop capabilities, use a read-only filesystem where possible, and set memory and CPU limits.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hai quy tắc nổi bật là đừng chạy dưới quyền root và đừng nướng secret vào trong. Thêm một <code>USER</code> không phải root, vì một cú thoát container dưới quyền root có thể chiếm cả host, và không bao giờ nhúng secret vì chúng còn nằm trong các layer của image kể cả sau khi xóa. Ngoài ra hãy ghim version và lý tưởng là ghim cả digest thay vì <code>latest</code>, dùng image base tối giản như distroless, quét image bằng công cụ như Trivy, và dùng một file <code>.dockerignore</code> để giữ <code>.git</code> và <code>.env</code> ra khỏi build context. Lúc runtime, hãy bỏ bớt capability, dùng filesystem chỉ đọc nếu có thể, và đặt giới hạn bộ nhớ cùng CPU.</p></details>
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
        a: `<div class="interview-answer"><p>The CLI sends the request over the REST API to the daemon, which checks for <code>nginx:latest</code> locally and pulls the layers if missing. It creates the container with read-only image layers and a fresh writable layer on top, sets up a network namespace on the default bridge with its own IP, and for <code>-p 8080:80</code> adds an iptables NAT rule forwarding host port 8080 to container port 80. Then containerd and runc start nginx as PID 1 with namespaces and cgroup limits, and <code>-d</code> detaches so only the container ID is returned. The container lives exactly as long as PID 1.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>CLI gửi yêu cầu qua REST API tới daemon, daemon kiểm tra <code>nginx:latest</code> ở cục bộ và pull các layer nếu thiếu. Nó tạo container với các layer image chỉ đọc và một layer ghi mới ở trên, thiết lập một network namespace trên bridge mặc định với IP riêng, và với <code>-p 8080:80</code> thì thêm một quy tắc NAT iptables chuyển port 8080 của host tới port 80 của container. Sau đó containerd và runc khởi động nginx thành PID 1 với namespace và giới hạn cgroup, còn <code>-d</code> tách nền nên chỉ trả về container ID. Container sống đúng bằng thời gian PID 1 sống.</p></details>
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
        a: `<div class="interview-answer"><p>A good debug order is exit code, then logs, then a shell. <code>docker ps -a</code> shows the exit code and <code>docker inspect</code> shows the OOMKilled flag; knowing the codes helps, since 137 is a SIGKILL that is almost always an out-of-memory kill, 143 is SIGTERM, and 139 is a segfault. Logs survive the crash, so read them next, then exec into a running container with a shell, or override the entrypoint with sh if it will not start. Since a container lives only as long as PID 1, the question in a crash loop is always why that process keeps exiting.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một thứ tự debug tốt là exit code, rồi log, rồi một shell. <code>docker ps -a</code> hiển thị exit code còn <code>docker inspect</code> hiển thị cờ OOMKilled; biết các mã sẽ hữu ích, vì 137 là một SIGKILL gần như luôn là một cú giết do hết bộ nhớ, 143 là SIGTERM, và 139 là segfault. Log sống sót qua cú crash nên hãy đọc chúng tiếp theo, rồi exec vào một container đang chạy bằng một shell, hoặc ghi đè entrypoint bằng sh nếu nó không khởi động được. Vì một container chỉ sống bằng thời gian PID 1 sống, câu hỏi trong một crash loop luôn là vì sao process đó cứ thoát ra.</p></details>
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
        a: `<div class="interview-answer"><p>The main steps are a multi-stage build that ships only a JRE not a JDK, Spring Boot's layered jar so large dependency layers stay cached while only the small app layer rebuilds, and a container-aware JVM. The most important part is sizing the heap with <code>-XX:MaxRAMPercentage</code> so it reads the cgroup limit, instead of a hardcoded <code>-Xmx</code> equal to the limit, which eventually causes an exit-137 out-of-memory kill because the kernel counts total memory. Also add a non-root user, an Actuator health check, and graceful shutdown on SIGTERM.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các bước chính là một multi-stage build chỉ ship JRE chứ không phải JDK, layered jar của Spring Boot để các layer dependency lớn còn được cache trong khi chỉ layer app nhỏ build lại, và một JVM nhận biết container. Phần quan trọng nhất là định cỡ heap bằng <code>-XX:MaxRAMPercentage</code> để nó đọc giới hạn cgroup, thay vì gán cứng <code>-Xmx</code> bằng đúng giới hạn, cái mà cuối cùng gây một cú giết do hết bộ nhớ exit-137 vì kernel đếm tổng bộ nhớ. Cũng nên thêm một user không phải root, một health check qua Actuator, và tắt máy êm ái khi nhận SIGTERM.</p></details>
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
        a: `<div class="interview-answer"><p><code>docker stop</code> sends SIGTERM to PID 1, waits ten seconds, then sends SIGKILL, so an app that takes the full ten seconds and drops requests never actually received the SIGTERM. Two common causes are shell-form CMD, which runs the app under <code>/bin/sh</code> so the shell is PID 1 and does not forward signals, and the fact that PID 1 has no default handlers so SIGTERM must be handled explicitly. The fixes are exec-form CMD with JSON-array brackets, a real SIGTERM handler that drains in-flight requests, and tini or <code>--init</code> when spawning children so zombies are reaped. Kubernetes works the same way with a longer grace period.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><code>docker stop</code> gửi SIGTERM tới PID 1, chờ mười giây, rồi gửi SIGKILL, nên một ứng dụng mất trọn mười giây và rớt request thực ra chưa bao giờ nhận được SIGTERM. Hai nguyên nhân phổ biến là CMD dạng shell, khiến ứng dụng chạy dưới <code>/bin/sh</code> nên shell là PID 1 và không chuyển tiếp tín hiệu, và việc PID 1 không có handler mặc định nên SIGTERM phải được xử lý tường minh. Cách sửa là CMD dạng exec với ngoặc kiểu mảng JSON, một handler SIGTERM thật để drain các request đang xử lý, và tini hoặc <code>--init</code> khi sinh ra process con để dọn zombie. Kubernetes hoạt động y hệt với một khoảng ân hạn dài hơn.</p></details>
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
        a: `<div class="interview-answer"><p>Exit 137 is the kernel out-of-memory killer, meaning the container passed its cgroup memory limit, and the trap is that heap is only part of process memory. For the JVM the total includes heap, Metaspace, thread stacks, code cache, and direct buffers, so setting <code>-Xmx</code> equal to the limit guarantees a kill under load. The rule is to size the heap at about 75 percent of the limit with <code>MaxRAMPercentage</code>, leaving headroom. An older JDK on a cgroup v2 host may not see the limit, Node's V8 is not cgroup-aware and needs <code>--max-old-space-size</code>, and in Kubernetes the limit, not the request, sets the ceiling.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Exit 137 là bộ giết vì-hết-bộ-nhớ của kernel, nghĩa là container đã vượt giới hạn bộ nhớ cgroup của nó, và cái bẫy là heap chỉ là một phần của bộ nhớ process. Với JVM, tổng gồm heap, Metaspace, stack của các thread, code cache và direct buffer, nên đặt <code>-Xmx</code> bằng giới hạn đảm bảo một cú giết dưới tải. Quy tắc là định cỡ heap ở khoảng 75 phần trăm giới hạn bằng <code>MaxRAMPercentage</code>, chừa lại khoảng dư. Một JDK cũ trên một host cgroup v2 có thể không thấy giới hạn, V8 của Node không nhận biết cgroup nên cần <code>--max-old-space-size</code>, và trong Kubernetes thì limit chứ không phải request mới đặt trần.</p></details>
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
        a: `<div class="interview-answer"><p>A safe default is slim or distroless, with Alpine chosen only after checking compatibility. The reason is libc: Alpine uses musl instead of glibc, so glibc-compiled native modules can crash or force slow rebuilds, and it has DNS and allocator differences that can hurt the JVM. Slim is the safe glibc default with most extras removed, while distroless goes further with no shell or package manager for a smaller attack surface but harder debugging. Whatever the choice, never ship a floating tag like <code>latest</code>; pin the version and ideally the digest so builds are reproducible and tamper-proof.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một lựa chọn an toàn mặc định là slim hoặc distroless, còn Alpine chỉ nên chọn sau khi kiểm tra tương thích. Lý do là libc: Alpine dùng musl thay vì glibc, nên các native module biên dịch theo glibc có thể crash hoặc buộc phải build lại chậm chạp, và nó có khác biệt về DNS cùng bộ cấp phát có thể làm hại JVM. Slim là mặc định glibc an toàn với hầu hết phần thừa đã bị gỡ, còn distroless đi xa hơn với không có shell hay trình quản lý package cho bề mặt tấn công nhỏ hơn nhưng khó debug hơn. Dù chọn gì, đừng bao giờ ship một tag trôi nổi như <code>latest</code>; hãy ghim version và lý tưởng là ghim digest để build tái lập được và chống giả mạo.</p></details>
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
