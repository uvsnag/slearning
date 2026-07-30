// Security & JWT — Secure SDLC, tooling & operations
import type { PvQuestion } from '../../../types';

export const questions: PvQuestion[] = [
  {
    q: 'How do you store and manage application secrets properly?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Secrets should never live in code or in the repository, because they end up in Git history and stay leaked. Environment variables and config files are a little better but still sit in plaintext and can leak through logs or process dumps. The right choice is a secrets manager such as Vault or AWS Secrets Manager, which stores secrets encrypted, controls access by policy, records who reads them, and supports rotation. Rotation, short-lived credentials, and encryption in transit and at rest all matter. In Kubernetes, native Secrets are only base64 by default, so back them with a real KMS and scan commits so leaked keys are caught early.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Secret không được nằm trong code hay trong repository, vì một khi đã vào lịch sử Git thì coi như lộ vĩnh viễn — đổi secret cũng không xóa được commit cũ. Biến môi trường và file <code>.env</code> đỡ hơn một chút nhưng vẫn là plaintext, dễ lọt ra qua log, crash dump hay <code>docker inspect</code>. Cách đúng là dùng secrets manager (Vault, AWS Secrets Manager, Azure Key Vault): secret được lưu ở dạng mã hóa, phân quyền theo policy, ghi log ai đọc lúc nào, và hỗ trợ xoay định kỳ. Nên thiết kế cho việc xoay khóa ngay từ đầu, ưu tiên credential ngắn hạn, và mã hóa cả khi truyền lẫn khi lưu. Trên Kubernetes, Secret mặc định chỉ là base64 chứ không phải mã hóa, nên cần bật encryption-at-rest bằng KMS; ngoài ra hãy quét commit bằng gitleaks, vì kiểu gì rồi cũng có người commit lộ key.</p></details>
<p>Secrets (DB passwords, API keys, signing keys) leak through predictable paths, and each naive storage level fails differently:</p>
<ul>
<li><strong>Hardcoded in source</strong>: lives forever in git history — rotating the secret doesn't scrub old commits; one leaked repo leaks everything.</li>
<li><strong>.env files</strong>: fine locally, but they get committed by accident, copied to laptops, and pasted into Slack. No audit trail, no rotation.</li>
<li><strong>Plain env vars in production</strong>: visible via <code>docker inspect</code>, <code>/proc/&lt;pid&gt;/environ</code>, crash dumps, and often echoed into logs by debug tooling.</li>
</ul>
<pre># The Docker image layer trap — a classic senior gotcha:
FROM node:20
COPY .env .          # layer 3 now contains the secret
RUN rm .env          # layer 4 "deletes" it...
# ...but layers are immutable! Anyone with the image runs:
#   docker save app | tar -x && cat */layer.tar
# and reads the secret from layer 3. Same trap:
ARG DB_PASSWORD      # build args are baked into image history
# → docker history --no-trunc shows it</pre>
<pre>// The right pattern: fetch at runtime from a secret manager
// (Vault, AWS Secrets Manager, GCP Secret Manager, Azure Key Vault)
import { SecretsManagerClient, GetSecretValueCommand }
  from '@aws-sdk/client-secrets-manager';

const client = new SecretsManagerClient({});
// No secret in code, image, or env — the pod's IAM role/service
// account is the identity; the manager checks it and audits access.
const res = await client.send(new GetSecretValueCommand({
  SecretId: 'prod/payment-service/db',
}));
const { password } = JSON.parse(res.SecretString);</pre>
<p><strong>What a real secrets setup gives you:</strong></p>
<ul>
<li><strong>Rotation</strong>: secrets change on a schedule (or on incident) without redeploys; apps re-fetch or receive new leases. Design for rotation from day one — retrofit is painful.</li>
<li><strong>Least privilege</strong>: each service can read only its own secrets; a compromised pod doesn't leak the whole vault.</li>
<li><strong>Audit log</strong>: who read which secret when — essential for incident response.</li>
<li><strong>Dynamic secrets</strong> (Vault): short-lived, per-instance DB credentials that expire on their own — the strongest option.</li>
</ul>
<p><strong>Interviewer follow-ups:</strong> how does the app authenticate to the secret manager without... a secret? (Answer: platform identity — IAM roles, Kubernetes service accounts, instance metadata.) And: add pre-commit scanning (gitleaks, trufflehog) because someone WILL commit a key eventually.</p>
<div class="key-point">Secrets should exist only in a dedicated manager with identity-based access, rotation, and audit — never in code, git history, Docker layers, or long-lived env files; assume anything that touched git or an image layer is already leaked.</div>`,
  },
  {
    q: 'What is the difference between SAST, DAST, SCA and IAST, and what belongs in CI?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>They find different classes of bugs, so mature teams run several. <strong>SAST</strong> reads source code and flags dangerous patterns early — fast feedback, but noisy and blind to configuration and runtime context. <strong>SCA</strong> compares your dependency tree against vulnerability databases and is usually the highest value per minute of effort, because most exploitable issues arrive through libraries. <strong>DAST</strong> attacks a running instance and therefore finds misconfiguration, missing headers, and auth issues that source scanning cannot see, at the cost of slower runs and needing a deployed environment. <strong>IAST</strong> instruments the app during tests to combine both views. In CI I gate on secret scanning and SCA for high-severity CVEs, run SAST on changed files with a curated rule set, and schedule DAST against staging — plus periodic manual testing, because none of these tools understand business logic.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mỗi loại tìm ra một nhóm lỗi khác nhau, nên các đội trưởng thành thường dùng nhiều loại cùng lúc. <strong>SAST</strong> đọc source code và cảnh báo các pattern nguy hiểm ngay từ sớm — phản hồi nhanh, nhưng nhiều báo động sai và không thấy được cấu hình hay ngữ cảnh lúc chạy. <strong>SCA</strong> đối chiếu cây dependency của bạn với các cơ sở dữ liệu lỗ hổng, và thường là thứ đem lại giá trị cao nhất so với công bỏ ra, vì phần lớn lỗ hổng khai thác được đến từ thư viện. <strong>DAST</strong> tấn công vào một instance đang chạy nên tìm ra được lỗi cấu hình, thiếu header, lỗi xác thực — những thứ quét source không thấy — nhưng chạy chậm và cần có môi trường đã deploy. <strong>IAST</strong> gắn thiết bị đo vào ứng dụng khi chạy test để kết hợp cả hai góc nhìn. Trong CI, tôi chặn merge dựa trên quét secret và SCA với CVE mức cao, chạy SAST trên các file thay đổi với bộ rule đã chọn lọc, và hẹn giờ chạy DAST trên staging — kèm test thủ công định kỳ, vì không công cụ nào hiểu được logic nghiệp vụ.</p></details>
<pre>SAST  (static)   Semgrep, SonarQube, CodeQL, SpotBugs+FindSecBugs
  ✅ early, cheap, finds injection sinks, hardcoded secrets, unsafe APIs
  ❌ false positives, cannot see config/deployment/authorization intent
SCA   (deps)     Dependabot, Snyk, OWASP Dependency-Check, Trivy, npm audit
  ✅ finds Log4Shell-class problems in minutes; needs an accurate lockfile
  ❌ reachability unclear (a CVE in an unused code path still alerts)
DAST  (running)  OWASP ZAP, Burp Suite, Nuclei
  ✅ headers, TLS, misconfig, auth flaws, real request/response behaviour
  ❌ needs a deployed target + credentials; slow; poor coverage of deep flows
IAST  (hybrid)   Contrast, Datadog ASM style agents
  ✅ low false positives, ties findings to a request
  ❌ language-limited, needs good test coverage to exercise paths
Secrets          gitleaks, trufflehog (pre-commit AND CI history scan)
IaC/containers   Checkov/tfsec, Trivy image scan, kube-bench</pre>
<pre># A pragmatic pipeline
pre-commit : gitleaks, lint, format
pull request: SCA (fail on new HIGH/CRITICAL with a fix available)
              SAST on the diff (curated rules, fail only on high confidence)
              secret scan of the full history
main       : build + sign image, SBOM (CycloneDX/SPDX), image scan
nightly    : DAST against staging with an authenticated scan profile
quarterly  : manual pentest / threat-model review of new features

# Rules that keep this from being ignored
- fail the build only on high-confidence, actionable findings
- everything else becomes a triaged backlog item with an owner + SLA
- suppress with an expiring, justified annotation — never a blanket ignore
- measure MTTR for vulnerabilities, not the count of findings</pre>
<p><strong>The honest limitation</strong> to state in an interview: scanners find known patterns and known CVEs. They do not find broken access control, tenant leakage, or business-logic abuse — the bugs that actually cost money. Tooling raises the floor; design review, code review, and abuse-case testing raise the ceiling.</p>
<div class="key-point">SCA + secret scanning are the mandatory gates, SAST on the diff for fast feedback, DAST against staging on a schedule. Fail builds only on high-confidence findings, track the rest with owners and SLAs, and never assume green scans mean authorization logic is correct.</div>`,
  },
  {
    q: 'What is a software supply chain attack and how do you defend against it?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>A supply chain attack compromises you through something you trust: a dependency, a build tool, a CI plugin, or a base image. The recurring patterns are <strong>typosquatting</strong> and <strong>dependency confusion</strong> (a public package with your internal name and a higher version wins resolution), <strong>account takeover</strong> of a legitimate maintainer who then publishes a malicious minor version, malicious <strong>postinstall scripts</strong> that run at install time with your developer's credentials, and compromise of the build system itself, as in SolarWinds. The defenses are procedural more than technical: commit lockfiles and install with <code>npm ci</code>/<code>mvn -B</code> against a curated internal registry, scope internal packages, disable install scripts by default, pin and verify base images by digest, generate an SBOM, and treat CI as production — least-privilege tokens, no secrets in PR builds from forks, and signed artifacts.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tấn công chuỗi cung ứng là xâm nhập vào bạn thông qua thứ mà bạn tin: một dependency, một build tool, một plugin CI, hay một base image. Những dạng lặp lại thường xuyên: <strong>typosquatting</strong> và <strong>dependency confusion</strong> (một package công khai trùng tên package nội bộ của bạn nhưng version cao hơn sẽ thắng khi resolve), <strong>chiếm tài khoản</strong> của một maintainer chính danh rồi phát hành một bản minor có mã độc, các script <strong>postinstall</strong> độc hại chạy ngay lúc install với quyền của máy developer, và việc chính hệ thống build bị xâm nhập như vụ SolarWinds. Cách phòng thủ thiên về quy trình hơn là kỹ thuật: commit lockfile và cài bằng <code>npm ci</code>/<code>mvn -B</code> trỏ vào một registry nội bộ đã kiểm duyệt, đặt scope cho package nội bộ, mặc định tắt install script, ghim base image theo digest và verify nó, sinh SBOM, và đối xử với CI như môi trường production — token quyền tối thiểu, không đưa secret vào build của PR từ fork, và ký các artifact.</p></details>
<pre>// Dependency confusion — the attack that hit dozens of large companies
// Your internal package: "acme-utils" (private registry, version 1.4.0)
// Attacker publishes "acme-utils" 99.0.0 to the PUBLIC npm registry
// Your build resolves the highest version → attacker code runs in CI 💀
// ✅ Fixes: use a SCOPE for internal packages (@acme/utils) and reserve
//    the scope publicly; configure the registry per scope; never let a
//    public registry be a fallback for internal names.
// .npmrc
@acme:registry=https://nexus.internal/repository/npm-private/
registry=https://nexus.internal/repository/npm-proxy/   # single curated door

// Install-time code execution
npm install          → runs preinstall/postinstall of EVERY dependency
// ✅ npm config set ignore-scripts true (allowlist the few that need it),
//    and run installs in a container without cloud credentials mounted.</pre>
<pre># Defense checklist that actually gets used
dependencies : lockfile committed + npm ci / mvn dependency-lock;
               renovate/dependabot with review, not blind auto-merge;
               prefer fewer, well-maintained libs; check age + maintainers
               of anything new (a package published 3 days ago is a risk)
containers   : FROM node:20.11.1-alpine@sha256:...   # pin by DIGEST
               distroless/minimal base, rebuild weekly for OS CVEs
build        : hermetic, reproducible builds; no curl | bash steps;
               CI tokens scoped per repo, short-lived, no org-wide PATs;
               do NOT expose secrets to workflows triggered by fork PRs;
               pin GitHub Actions to a commit SHA (tags are mutable)
artifacts    : sign images (cosign/Sigstore) and verify at admission;
               publish an SBOM (CycloneDX/SPDX) per release → instant
               "are we affected?" answers
runtime      : default-deny egress so injected code cannot phone home</pre>
<p><strong>Why this is a senior topic:</strong> the exploited vulnerability is usually trust, not code. Being able to answer "what exactly is in this build, who could change it, and how fast can we replace it?" is what separates a hardened pipeline from a lucky one.</p>
<div class="key-point">Curate one registry door, scope and reserve internal package names, disable install scripts, pin dependencies and base images by digest, keep CI credentials minimal and short-lived, sign artifacts, and ship an SBOM so the next Log4Shell is a query rather than an archaeology project.</div>`,
  },
  {
    q: 'How do you threat model a feature, and what security principles guide the design?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Threat modeling is a 45-minute design conversation, not a document ritual: draw the data flow, mark the trust boundaries, and ask what an attacker could do at each one. <strong>STRIDE</strong> gives the prompts — Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege — and the output is a short list of mitigations that become tickets and tests. The principles I design against are <strong>least privilege</strong>, <strong>defense in depth</strong>, <strong>fail closed</strong>, <strong>secure defaults</strong>, <strong>complete mediation</strong> (every access checked, no cached "already authorized"), and minimizing what you store at all — data you do not keep cannot leak. The highest-value habit is writing <em>abuse cases</em> next to user stories: for "user can request a refund", also specify "user cannot request two refunds for one order".</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Threat modeling là một buổi bàn thiết kế 45 phút, không phải một thủ tục viết tài liệu: vẽ luồng dữ liệu, đánh dấu các ranh giới tin cậy, rồi hỏi ở mỗi ranh giới đó kẻ tấn công làm được gì. <strong>STRIDE</strong> cho bạn bộ câu hỏi gợi ý — Spoofing, Tampering, Repudiation, Information disclosure, Denial of service, Elevation of privilege — và kết quả đầu ra là một danh sách ngắn các biện pháp giảm thiểu, sau đó biến thành ticket và test. Các nguyên tắc tôi dựa vào khi thiết kế: <strong>quyền tối thiểu</strong>, <strong>phòng thủ nhiều lớp</strong>, <strong>lỗi thì đóng</strong> (fail closed), <strong>mặc định an toàn</strong>, <strong>kiểm tra mọi lần truy cập</strong> (không tin vào chuyện "đã cho phép rồi" được cache lại), và giảm tối đa lượng dữ liệu lưu trữ — thứ bạn không giữ thì không thể bị lộ. Thói quen giá trị nhất là viết <em>abuse case</em> ngay bên cạnh user story: với "người dùng có thể yêu cầu hoàn tiền", hãy viết thêm "người dùng không thể yêu cầu hoàn tiền hai lần cho cùng một đơn".</p></details>
<pre>// 1. Draw it (a whiteboard box-and-arrow diagram is enough)
[browser] --https--> [API gateway] --> [orders svc] --> [postgres]
                                   \\--> [payment provider]  (3rd party)
                     ^ trust boundary        ^ trust boundary
// 2. Walk STRIDE at each boundary
S poofing        → how do we know it is this user/service? (tokens, mTLS)
T ampering       → can the amount/price be changed client-side? (server-side
                   pricing, signed payloads, idempotency keys)
R epudiation     → can we prove who approved a refund? (audit log, non-repud.)
I nfo disclosure → what does an error/response leak? (generic errors, field
                   allowlists, encryption at rest)
D oS             → what is the most expensive request? (rate limits, quotas)
E levation       → can a customer act as an admin? (default-deny authz tests)
// 3. Output: 5–10 concrete mitigations, each an issue with an owner.</pre>
<pre>// Principles, and what they mean in code
least privilege     : DB user without DDL; IAM role per service; scopes
                      narrowed per hop; no shared "app admin" account
defense in depth    : parameterized SQL AND least-privilege DB AND WAF
fail closed         : unknown route/role/policy error → deny, not allow
secure by default   : new endpoint is authenticated unless opted out;
                      new bucket is private; TLS on by default
complete mediation  : re-check authorization on every request, including
                      "step 2" of a wizard and every websocket message
minimize data       : do not store card numbers (tokenize), truncate logs,
                      set retention, hash what you only need to compare
assume breach       : short-lived credentials, egress limits, audit trails,
                      blast-radius thinking (what does ONE pod compromise get?)</pre>
<p><strong>When to do it:</strong> at design time for anything touching money, PII, authentication, file handling, or a new external integration — and again when the architecture changes. Keep the artifact small (a diagram plus a table in the PR or the design doc) so it stays current; a 40-page model nobody reads protects nothing.</p>
<div class="key-point">Threat modeling = diagram + trust boundaries + STRIDE questions + a short mitigation list turned into tickets and tests. Design with least privilege, defense in depth, fail-closed defaults, complete mediation, and data minimization — and write abuse cases alongside user stories.</div>`,
  },
  {
    q: 'What should you log for security, and what must never be logged?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Detection is the control most teams skip, and OWASP lists insufficient logging for that reason: the average breach is discovered by someone else, months later. I log security <em>events</em> with enough context to reconstruct a timeline — authentication success and failure, logout, MFA enrollment or removal, password and email changes, privilege and role changes, access-denied decisions, token issuance and revocation, admin actions, and bulk data exports — each with a timestamp, actor, source IP, request id, and outcome. What must never appear in logs: passwords, tokens and cookies, full card numbers, national ids, OTP codes, encryption keys, and complete request bodies containing PII. Then make the logs useful: ship them off-host to a store the application cannot rewrite, keep them long enough to investigate, and alert on patterns rather than reading them by hand.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Phát hiện sớm là biện pháp mà phần lớn đội bỏ qua, và OWASP xếp "logging không đủ" vào danh sách cũng vì thế: phần lớn vụ xâm nhập là do người ngoài phát hiện, sau nhiều tháng. Tôi log các <em>sự kiện</em> bảo mật kèm đủ ngữ cảnh để dựng lại được diễn biến — đăng nhập thành công và thất bại, logout, thêm/xóa yếu tố MFA, đổi mật khẩu và đổi email, thay đổi quyền và role, các quyết định từ chối truy cập, việc phát và thu hồi token, hành động của admin, và những lần export dữ liệu lớn — mỗi bản ghi có timestamp, ai thực hiện, IP nguồn, request id và kết quả. Những thứ không bao giờ được xuất hiện trong log: mật khẩu, token và cookie, số thẻ đầy đủ, số CMND/CCCD, mã OTP, khóa mã hóa, và toàn bộ request body có chứa dữ liệu cá nhân. Sau đó hãy làm cho log thật sự hữu ích: đẩy ra khỏi máy chủ tới nơi mà ứng dụng không thể sửa lại, giữ đủ lâu để còn điều tra được, và cảnh báo theo pattern chứ không ngồi đọc tay.</p></details>
<pre>// A security event, structured so it is queryable
{ "ts":"2026-07-30T10:14:02Z", "event":"auth.login.failed",
  "actor":"user_8123", "actorEmail":"a***@example.com",   // masked
  "ip":"203.0.113.9", "ua":"...", "requestId":"c7f2...",
  "reason":"bad_password", "attemptCount":4, "tenant":"acme" }

// Events worth alerting on
- N failed logins for one account, or 1 failure across N accounts
  (credential stuffing looks flat and wide, not deep)
- login from a new country immediately after a password reset
- privilege escalation: role added, admin created, permission grant
- access denied bursts (someone is enumerating ids)
- refresh-token reuse detected (a stolen token tripwire)
- bulk export / unusually large result sets by one user
- secrets manager reads outside deploy windows
- 5xx spike right after a deploy (could be exploitation, could be a bug)</pre>
<pre>// ❌ Never log
password, newPassword, Authorization header, Cookie header, session id,
refresh/access tokens, OTP codes, private keys, full PAN or CVV,
national id numbers, full request/response bodies of sensitive endpoints
// Practical guards
- a serializer that masks by field name (password, token, secret, card)
- log tokens by a hash prefix if you need correlation: sha256(t)[0..8]
- Spring: never enable DEBUG on org.springframework.web for prod bodies
- scrub before shipping (Logstash/Vector filters) AND at the source
// PII/GDPR angle
- logs are personal data too: define retention (e.g. 90 days hot, 1 year
  cold), restrict access, and be able to delete a user's data on request
- pseudonymize where you can (user id, not email)</pre>
<p><strong>Integrity matters as much as content:</strong> ship logs off the host immediately (an attacker's first move is clearing them), make the store append-only for the app's credentials, include a request id that flows through every service so a timeline can be reconstructed, and keep clocks synchronized. Then rehearse: run a tabletop exercise where you must answer "when did this account get compromised, and what did it touch?" using only your logs.</p>
<div class="key-point">Log authentication, authorization, and privilege events with actor, IP, and request id — never credentials or PII — ship them off-host to an append-only store, and alert on patterns like credential stuffing, denied-access bursts, and refresh-token reuse. If you cannot reconstruct a timeline, you cannot respond.</div>`,
  },
  {
    q: 'How do you secure containers and Kubernetes deployments?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Container security starts with the image: a minimal base pinned by digest, no build tools or shells you do not need, no secrets in layers or build args, a non-root <code>USER</code>, and automated rebuilds so OS CVEs get patched. At runtime the pod should be boring and locked down — read-only root filesystem, <code>allowPrivilegeEscalation: false</code>, dropped capabilities, no host network or hostPath mounts, resource limits so one pod cannot starve the node, and a seccomp profile. Around it, Kubernetes controls do the rest: one service account per workload with narrow RBAC (never <code>cluster-admin</code>), default-deny NetworkPolicies so a compromised pod cannot reach the database of another service, secrets from a KMS-backed store or an external secrets operator rather than plain <code>Secret</code> objects, and admission policies that block images that are unsigned or fail a scan.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Bảo mật container bắt đầu từ image: base tối giản và ghim theo digest, không mang theo build tool hay shell không cần thiết, không có secret nằm trong layer hay build arg, khai báo <code>USER</code> không phải root, và build lại tự động để các CVE của hệ điều hành được vá. Lúc chạy, pod nên "nhạt nhẽo" và bị siết chặt — root filesystem chỉ đọc, <code>allowPrivilegeEscalation: false</code>, drop hết capability không cần, không dùng host network hay hostPath, có resource limit để một pod không làm cạn tài nguyên của node, và có seccomp profile. Xung quanh đó là các cơ chế của Kubernetes: mỗi workload một service account với RBAC hẹp (đừng bao giờ dùng <code>cluster-admin</code>), NetworkPolicy mặc định chặn hết để một pod bị chiếm không với tới database của service khác, secret lấy từ nơi lưu có KMS hoặc qua external secrets operator thay vì dùng <code>Secret</code> thuần, và admission policy chặn những image chưa được ký hoặc không đạt kết quả quét.</p></details>
<pre># Image
FROM gcr.io/distroless/java21@sha256:...   # pinned, no shell, no package mgr
COPY --chown=nonroot:nonroot app.jar /app.jar
USER nonroot
# ❌ COPY .env / ARG DB_PASSWORD → baked into layers forever
# ✅ multi-stage build so compilers and caches never reach the final image
# ✅ scan on push (Trivy/Grype) and rebuild weekly for base-image CVEs</pre>
<pre># Pod hardening — the fields that actually matter
securityContext:
  runAsNonRoot: true
  runAsUser: 10001
  readOnlyRootFilesystem: true
  allowPrivilegeEscalation: false
  capabilities: { drop: ["ALL"] }
  seccompProfile: { type: RuntimeDefault }
resources:
  requests: { cpu: 100m, memory: 256Mi }
  limits:   { cpu: "1",  memory: 512Mi }      # DoS containment
automountServiceAccountToken: false           # unless the pod calls the API
# forbid: hostNetwork, hostPID, hostPath volumes, privileged: true
# enforce with Pod Security Admission (restricted) or Kyverno/Gatekeeper</pre>
<pre># Cluster controls
RBAC        : one ServiceAccount per workload, verbs/resources narrowed;
              no wildcard roles; audit who can create pods (= node takeover)
Network     : default-deny NetworkPolicy per namespace, then allow the
              specific flows; egress rules too (stops SSRF/exfiltration)
Secrets     : etcd encryption at rest + KMS; External Secrets/CSI driver so
              secrets come from Vault/ASM and are not stored as base64 blobs
Admission   : signature verification (cosign policy), block :latest,
              require limits/securityContext, reject known-vulnerable images
Runtime     : Falco/eBPF detection for shells in containers, unexpected
              egress, or writes to /etc — plus audit logs shipped off-cluster
Isolation   : separate namespaces AND separate node pools/clusters for
              different trust levels; do not run untrusted workloads next
              to production data planes</pre>
<p><strong>The two questions interviewers use to check depth:</strong> "what does a compromised pod get?" — the answer should be nothing beyond its own scoped secret and its allowed network peers; and "who can escalate to cluster admin?" — anyone who can create privileged pods, mount host paths, or edit RBAC effectively owns the cluster, so those permissions belong to CI/CD and platform owners only.</p>
<div class="key-point">Minimal signed image + non-root, read-only, capability-dropped pod + narrow RBAC + default-deny network + KMS-backed secrets + admission policy. Design for "one pod is compromised" and make sure that outcome is boring.</div>`,
  },
  {
    q: 'A token or credential just leaked in production — what do you do?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>Work in a fixed order: <strong>contain, assess, eradicate, recover, learn</strong> — and start the clock on a written timeline. Containment first: revoke or rotate the credential immediately (do not wait to understand the full picture), invalidate affected sessions and refresh-token families, and block the abusive source if there is one. Then assess with logs: when was it created, what could it access, and was it actually used — the audit trail decides whether this is a near miss or a breach. Eradicate the root cause (the secret in the repo, the vulnerable endpoint), then recover with clean credentials and verify no persistence was left behind, such as a new API key, an added OAuth client, or a modified admin account. Finally the part that matters most: a blameless postmortem with concrete prevention work, and notification decisions taken with legal/compliance if personal data was exposed — GDPR gives 72 hours.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Làm theo đúng thứ tự: <strong>khoanh vùng, đánh giá, dọn gốc, phục hồi, rút bài học</strong> — và bắt đầu ghi lại timeline bằng văn bản ngay từ đầu. Khoanh vùng trước: thu hồi hoặc xoay credential ngay lập tức (đừng chờ hiểu hết bức tranh mới làm), hủy các session liên quan cùng các họ refresh token, và chặn nguồn đang lạm dụng nếu xác định được. Sau đó dựa vào log để đánh giá: credential đó được tạo khi nào, chạm được tới những gì, và có thật sự bị dùng hay không — chính audit trail quyết định đây là "thoát trong gang tấc" hay là một vụ rò rỉ dữ liệu. Tiếp đến là dọn nguyên nhân gốc (cái secret nằm trong repo, cái endpoint có lỗ hổng), rồi phục hồi với credential mới và kiểm tra xem kẻ tấn công có để lại đường lui nào không: một API key mới, một OAuth client vừa được thêm, hay một tài khoản admin bị sửa. Cuối cùng là phần quan trọng nhất: một buổi postmortem không quy trách nhiệm cá nhân, kèm những việc phòng ngừa cụ thể, và quyết định về thông báo cho người dùng cùng bộ phận pháp lý/compliance nếu dữ liệu cá nhân bị ảnh hưởng — GDPR cho 72 giờ.</p></details>
<pre>// Hour 0 — CONTAIN (in parallel, do not serialize behind analysis)
1. Revoke/rotate the credential at the source (KMS, IdP, provider console)
2. Invalidate sessions + refresh-token families for affected users
3. If it is a signing key: rotate kid, drop the old key from JWKS →
   every token signed with it dies
4. Block the abusing IP/ASN or disable the affected integration
5. Open an incident channel; assign a single incident commander;
   start a timestamped log of every action taken

// Hours 1-4 — ASSESS with evidence, not vibes
- where did it leak? (git history, CI log, screenshot, third party, S3)
- what did it grant? (IAM policy, scopes, tenant reach) — assume the
  maximum the credential allowed, not the minimum you intended
- was it used? cloud audit logs, DB access logs, egress volume,
  new resources created, unusual query patterns
- classify: near miss (no use observed) vs incident vs data breach</pre>
<pre>// ERADICATE + RECOVER
- fix the root cause: remove the secret AND rewrite history if needed
  (assume it is public forever — rotation is the real fix, not deletion)
- hunt for persistence: new users/roles, added SSH keys, new API keys,
  OAuth apps granted, modified webhooks, scheduled jobs, IAM policy edits
- rebuild rather than clean if a host or image may have been altered
- verify: monitoring in place, alerts firing on the pattern you missed

// LEARN — the deliverable is prevention, not blame
- timeline with detection latency (how long between leak and discovery?)
- 3-5 action items with owners: secret scanning in pre-commit + CI,
  short-lived credentials instead of static keys, least-privilege scoping,
  alerting on the specific signal that was missing
- compliance: GDPR breach notification (72h) if personal data was
  affected; contractual notification for customers; involve legal early</pre>
<p><strong>What interviewers listen for:</strong> that you rotate first and investigate second; that you assume the credential's full blast radius rather than its intended use; that you look for persistence instead of declaring victory after rotation; and that the postmortem is blameless and produces engineering work. Saying "we deleted the commit" as the fix is the classic wrong answer — anything that reached git or an image layer must be considered compromised.</p>
<div class="key-point">Rotate immediately, then assess from audit logs, hunt for persistence, rebuild what you cannot trust, and close with a blameless postmortem plus concrete prevention. Detection latency is the metric that matters, and a leaked secret is compromised even if you deleted the commit.</div>`,
  },
  {
    q: 'How do you review a pull request for security?',
    difficulty: 'tricky',
    a: `<div class="interview-answer"><p>I read the diff for the security-relevant <em>shapes</em> rather than trying to imagine every attack. First: does this change touch authentication, authorization, or data access? Every new endpoint gets three questions — who can call it, which rows may they touch, and what happens on failure. Then I follow untrusted input from entry to sink, checking for concatenation into SQL, shells, paths, HTML, or templates, and confirming validation happens server-side with an allowlist. Then the crosscutting checks: secrets and keys, error messages and logs, new dependencies, changes to CORS/CSRF/session/cookie settings, anything that spends money or mutates state twice, and whether the tests encode the authorization rules. If the change alters a trust boundary or handles money or PII, the review escalates to a short threat-model conversation instead of inline comments.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi đọc diff để tìm những <em>dạng</em> có liên quan tới bảo mật, chứ không cố tưởng tượng ra mọi cuộc tấn công. Trước tiên: thay đổi này có chạm tới xác thực, phân quyền hay truy cập dữ liệu không? Mỗi endpoint mới đều phải trả lời ba câu — ai được gọi nó, họ được tác động lên những dòng dữ liệu nào, và khi thất bại thì hành vi là gì. Sau đó tôi lần theo đường đi của input không tin cậy từ chỗ vào tới chỗ dùng, xem có bị nối chuỗi vào SQL, shell, đường dẫn file, HTML hay template không, và kiểm tra việc validate có làm ở server theo danh sách cho phép không. Rồi tới các mục xuyên suốt: secret và key, thông báo lỗi và log, dependency mới, các thay đổi về CORS/CSRF/session/cookie, những chỗ tiêu tiền hoặc có thể thực thi hai lần, và liệu test có thể hiện đúng các quy tắc phân quyền hay không. Nếu thay đổi làm dịch chuyển một ranh giới tin cậy, hoặc liên quan tới tiền và dữ liệu cá nhân, thì việc review sẽ nâng lên thành một buổi threat modeling ngắn thay vì bình luận từng dòng.</p></details>
<pre>// The checklist I actually run through
AUTHZ   □ new endpoint/handler/server action → is it authenticated?
        □ is the object scoped to the caller (WHERE user_id = ?) or is it
          "find by id" with an ownership check missing? (IDOR)
        □ role check present on the server, not only in the UI?
        □ tenant id taken from the token, never from the request?
INPUT   □ any string concatenated into SQL / shell / path / HTML / regex?
        □ request body bound to an entity? (mass assignment)
        □ file upload: name generated, type sniffed, stored off web root?
        □ URL from user input that the server fetches? (SSRF)
OUTPUT  □ error messages generic; no stack traces; no enumeration
        □ response DTO explicit — no entity leaking passwordHash/flags
        □ nothing sensitive added to logs
CRYPTO  □ tokens/salts from a CSPRNG; secrets compared in constant time
        □ no new hardcoded key/secret; no disabled TLS verification
STATE   □ money/quota/one-time actions atomic? idempotency key present?
        □ session regenerated on privilege change?
DEPS    □ new dependency: maintained? popular? does it need install scripts?
CONFIG  □ CORS origins explicit; CSRF still enabled where cookies are used;
          cookie flags intact; new actuator/debug route not exposed
TESTS   □ is there a test asserting "other user → 404" and "no role → 403"?</pre>
<pre>// How I comment, so reviews stay productive
- Blocking, with a concrete exploit: "GET /api/orders/:id has no ownership
  check — user A can read user B's order by changing the id. Add
  findByIdAndCustomer(...) and return 404."
- Non-blocking suggestion: "consider moving this check into the repository
  so future endpoints inherit it."
- Ask instead of assume: "is this endpoint reachable without a session?"
- Escalate off the diff when the design is the problem: a 15-minute
  threat-model call beats twelve inline comments.</pre>
<p><strong>What makes reviews reliably catch things:</strong> a shared checklist in the PR template for security-relevant changes, an authorization test matrix that must be updated when endpoints are added, automated gates (secret scan, SCA, SAST on the diff) so humans spend attention on logic instead of patterns, and a habit of reviewing the <em>absence</em> of code — the missing check is the vulnerability far more often than the wrong one.</p>
<div class="key-point">Review for shapes: new endpoints (authn/authz/ownership), untrusted input reaching a sink, request bodies bound to entities, secrets and crypto, atomicity of value-changing operations, and config changes to CORS/CSRF/cookies. Demand a test for every authorization rule — the vulnerability is usually a check that was never written.</div>`,
  },
];
