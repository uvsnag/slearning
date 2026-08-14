// Interview data: AWS & CLOUD COMPUTING
import type { PvTopic } from '../../types';

export const topics: PvTopic[] = [
  {
    id: 'aws',
    name: 'AWS & Cloud',
    icon: '☁️',
    questions: [
      // ──── 1. CLOUD FUNDAMENTALS ────
      {
        q: 'Explain the AWS Shared Responsibility Model. Where do most real breaches happen?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>AWS is responsible for security <strong>of</strong> the cloud — the physical data centres, the hypervisor, the managed service internals — while you are responsible for security <strong>in</strong> the cloud: your IAM policies, your security groups, your encryption choices, your patching, and your data. The line moves depending on the service model: with EC2 you patch the guest OS yourself, with RDS AWS patches the engine but you still own the users and the network exposure, and with S3 or Lambda you own almost nothing but configuration and data. That last point matters because virtually every publicised "AWS breach" is not an AWS failure at all — it is a public S3 bucket, an over-permissive IAM policy, a leaked long-lived access key, or a security group open to 0.0.0.0/0. The senior takeaway is that moving to the cloud does not reduce your security work, it changes its shape: less rack-and-patch, far more identity and configuration management.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>AWS chịu trách nhiệm bảo mật <strong>cho bản thân hạ tầng đám mây</strong> — trung tâm dữ liệu vật lý, lớp ảo hóa, phần ruột của các dịch vụ managed; còn bạn chịu trách nhiệm bảo mật <strong>những gì bạn đặt lên đó</strong>: chính sách IAM, security group, lựa chọn mã hóa, việc vá lỗi và dữ liệu của bạn. Ranh giới này dịch chuyển tùy theo loại dịch vụ: với EC2 bạn phải tự vá hệ điều hành; với RDS thì AWS lo vá engine nhưng bạn vẫn phải lo user và mức độ phơi ra mạng; còn với S3 hay Lambda thì bạn gần như chỉ còn phải lo cấu hình và dữ liệu. Chi tiết cuối cùng đó rất đáng nhớ, bởi hầu như mọi vụ "lộ dữ liệu trên AWS" từng lên báo đều không phải lỗi của AWS: đó là một bucket S3 để công khai, một policy IAM cấp quyền quá rộng, một access key dài hạn bị lộ, hay một security group mở toang ra 0.0.0.0/0. Điều một senior cần rút ra là: lên cloud không làm giảm khối lượng việc bảo mật, nó chỉ đổi hình dạng — bớt phần cắm dây và vá máy, nhưng tăng gấp bội phần quản lý danh tính và cấu hình.</p></details>
<p><strong>The line moves per service model:</strong></p>
<table>
<tr><th>You run</th><th>AWS handles</th><th>You handle</th></tr>
<tr><td><strong>EC2</strong> (IaaS)</td><td>Hardware, network, hypervisor</td><td>Guest OS patching, runtime, app, firewall rules, data, IAM</td></tr>
<tr><td><strong>RDS / EKS</strong> (managed)</td><td>+ OS &amp; engine patching, backups, HA plumbing</td><td>DB users, schema, network exposure, encryption choice, data</td></tr>
<tr><td><strong>S3 / Lambda / DynamoDB</strong></td><td>+ everything operational</td><td>IAM policies, bucket/resource policies, encryption, data classification</td></tr>
</table>
<p><strong>Where breaches actually come from (in order):</strong></p>
<ol>
<li><strong>Public S3 buckets</strong> — fixed by S3 Block Public Access at the account level, not per bucket.</li>
<li><strong>Over-permissive IAM</strong> — wildcards like Action:* / Resource:* left over from "just make it work".</li>
<li><strong>Leaked long-lived access keys</strong> — committed to git, baked into an AMI, pasted into a CI variable.</li>
<li><strong>Security groups open to the world</strong> — SSH or a database port on 0.0.0.0/0.</li>
<li><strong>Unencrypted data / no key rotation</strong> — usually because encryption was opt-in and nobody opted in.</li>
</ol>
<p><strong>Controls that catch these automatically:</strong> AWS Config rules, Security Hub, GuardDuty, IAM Access Analyzer, and SCPs at the Organization level that make the dangerous configuration impossible rather than merely discouraged.</p>
<div class="key-point">The sentence that separates senior answers: <em>"AWS gives me a secure platform, not a secure system — nearly every incident I have seen was a customer-side configuration or identity mistake, so that is where I put the guardrails."</em></div>`,
      },
      {
        q: 'Regions, Availability Zones, and edge locations — how do they change your architecture?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A <strong>Region</strong> is a geographic area and a hard isolation boundary: services, data and failures generally do not cross it, which is why compliance and data residency are region-level decisions and why cross-region replication is always something you opt into and pay for. An <strong>Availability Zone</strong> is one or more physically separate data centres inside a Region, connected by low-latency private links — single-digit millisecond latency, which is close enough that synchronous replication across AZs is practical. <strong>Edge locations</strong> are a much larger set of small POPs used by CloudFront, Route 53 and Global Accelerator to terminate connections close to users. The architectural rule that falls out of this: spread across AZs by default because it is cheap, nearly free in latency and covers the failure you will actually experience; go multi-region only when you have a real RTO/RPO or data-residency requirement, because it multiplies cost and forces you to solve data conflicts.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Region</strong> là một vùng địa lý và cũng là ranh giới cô lập cứng: dịch vụ, dữ liệu và cả sự cố nói chung không vượt qua ranh giới này — đó là lý do các yêu cầu tuân thủ và lưu trú dữ liệu luôn được quyết ở mức region, và cũng là lý do sao chép dữ liệu giữa các region luôn là thứ bạn phải chủ động bật và trả tiền. <strong>Availability Zone</strong> là một hoặc vài trung tâm dữ liệu tách biệt về mặt vật lý nằm trong cùng một region, nối với nhau bằng đường riêng độ trễ thấp — chỉ vài mili-giây, đủ gần để sao chép đồng bộ giữa các AZ là chuyện khả thi. <strong>Edge location</strong> thì nhiều hơn hẳn: đó là các điểm hiện diện nhỏ mà CloudFront, Route 53 và Global Accelerator dùng để "đón" kết nối ngay gần người dùng. Từ đó rút ra một nguyên tắc kiến trúc: mặc định hãy trải hệ thống ra nhiều AZ, vì nó rẻ, gần như không tốn thêm độ trễ và lại chống đúng loại sự cố bạn sẽ thực sự gặp; còn multi-region thì chỉ làm khi có yêu cầu RTO/RPO hoặc lưu trú dữ liệu thật sự, bởi nó nhân chi phí lên nhiều lần và buộc bạn phải tự giải bài toán xung đột dữ liệu.</p></details>
<pre>Region (e.g. ap-southeast-1, Singapore)
├── AZ-a  [data centre(s)]  ─┐
├── AZ-b  [data centre(s)]  ─┼── private links, ~1-2 ms apart
└── AZ-c  [data centre(s)]  ─┘

Edge locations (400+ worldwide) — CloudFront / Route 53 / Global Accelerator
    → terminate TLS near the user, then ride the AWS backbone to the Region</pre>
<p><strong>What is scoped to what</strong> — a frequent interview trap:</p>
<table>
<tr><th>Scope</th><th>Examples</th></tr>
<tr><td><strong>Global</strong></td><td>IAM, Route 53, CloudFront, WAF (for CloudFront), S3 bucket namespace</td></tr>
<tr><td><strong>Regional</strong></td><td>S3 data, DynamoDB tables, SQS queues, Lambda, VPC, AMIs, KMS keys</td></tr>
<tr><td><strong>Zonal</strong></td><td>EC2 instances, EBS volumes, subnets</td></tr>
</table>
<p><strong>Design consequences:</strong></p>
<ul>
<li><strong>EBS volumes cannot cross an AZ</strong> — this is why a stateful EC2 app is not automatically multi-AZ; you need EFS, S3, or DB-level replication.</li>
<li><strong>Subnets are zonal</strong> — a Multi-AZ deployment literally means "one subnet per AZ, resources in each".</li>
<li><strong>Cross-AZ data transfer costs money</strong> (both directions) — chatty services split across AZs show up on the bill.</li>
<li><strong>Multi-region is a different problem class</strong>: asynchronous replication means potential data loss on failover, and active-active means you must resolve write conflicts.</li>
</ul>
<div class="key-point">Default to Multi-AZ, treat multi-region as a business decision driven by RTO/RPO or regulation — not as "the next level of good architecture". Most outages you will experience are AZ-level or, far more often, your own deployment.</div>`,
      },
      {
        q: 'What is the AWS Well-Architected Framework, and how do you actually use it?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The Well-Architected Framework is a review checklist organised into six pillars — operational excellence, security, reliability, performance efficiency, cost optimisation, and sustainability — each backed by design principles and pointed questions. Its real value is not the acronym but the fact that it forces the trade-offs to be made explicit and written down: pillars genuinely conflict, and a design that maximises reliability will cost more, while one that minimises cost will accept more risk. In practice I use it as a periodic structured review rather than an upfront gate: run it on a workload, produce a list of high-risk items, then decide which ones the business actually wants to fix. The senior framing is that Well-Architected does not tell you the right answer — it tells you which questions you have not answered yet.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Well-Architected Framework là một bộ checklist rà soát kiến trúc, chia thành sáu trụ cột — vận hành xuất sắc, bảo mật, độ tin cậy, hiệu năng, tối ưu chi phí và tính bền vững — mỗi trụ cột đi kèm các nguyên tắc thiết kế và những câu hỏi khá sắc. Giá trị thật của nó không nằm ở việc thuộc tên sáu trụ cột, mà ở chỗ nó ép bạn phải nói thẳng ra các đánh đổi và ghi chúng lại: các trụ cột vốn mâu thuẫn với nhau — thiết kế nào đẩy độ tin cậy lên tối đa thì chắc chắn tốn tiền hơn, còn thiết kế nào ép chi phí xuống thấp nhất thì phải chấp nhận rủi ro cao hơn. Trong thực tế, tôi dùng nó như một đợt rà soát định kỳ có cấu trúc chứ không phải một cửa ải phải qua trước khi làm: chạy review cho một hệ thống, ra được danh sách các rủi ro cao, rồi để phía nghiệp vụ quyết xem thật sự muốn sửa cái nào. Cách nhìn của một senior là: Well-Architected không đưa cho bạn câu trả lời đúng, nó chỉ cho bạn thấy những câu hỏi mà bạn chưa trả lời.</p></details>
<table>
<tr><th>Pillar</th><th>Core question</th><th>Typical concrete finding</th></tr>
<tr><td><strong>Operational excellence</strong></td><td>Can we deploy, observe and recover routinely?</td><td>Manual deploys, no runbooks, alarms nobody owns</td></tr>
<tr><td><strong>Security</strong></td><td>Is least privilege real, is data encrypted, do we detect?</td><td>Wildcard IAM, long-lived keys, no GuardDuty</td></tr>
<tr><td><strong>Reliability</strong></td><td>What fails, and does the system survive it?</td><td>Single AZ, no tested failover, no backoff on retries</td></tr>
<tr><td><strong>Performance efficiency</strong></td><td>Are we using the right resource for the job?</td><td>Oversized EC2, no caching, wrong DB for the access pattern</td></tr>
<tr><td><strong>Cost optimisation</strong></td><td>Are we paying for what we actually use?</td><td>Idle dev environments, no Savings Plans, NAT/data-transfer waste</td></tr>
<tr><td><strong>Sustainability</strong></td><td>Are we minimising the resources consumed?</td><td>Always-on batch fleets, uncompressed data, over-retention</td></tr>
</table>
<p><strong>How the pillars conflict</strong> — this is what interviewers want to hear:</p>
<pre>Multi-region active-active   → reliability ↑↑   cost ↑↑↑   complexity ↑↑↑
Aggressive Spot usage        → cost ↓↓         reliability ↓ (need interruption handling)
Synchronous cross-AZ writes  → durability ↑    latency ↑
Serverless everything        → ops ↓           cost unpredictable at high steady load</pre>
<p><strong>Practical usage:</strong> run the review per workload (AWS provides the Well-Architected Tool free), record each answer as accepted-risk or an action item with an owner, and re-run after major changes. Treat the output as a risk register, not a compliance certificate.</p>
<div class="key-point">Weak answer: naming the six pillars. Strong answer: "the pillars trade against each other, so a Well-Architected review is really a structured way of surfacing which trade-offs we made implicitly — and then deciding whether the business agrees with them."</div>`,
      },
      // ──── 2. IAM & IDENTITY ────
      {
        q: 'IAM users vs roles vs policies — and why should applications never use access keys?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>An IAM <strong>user</strong> is a permanent identity with long-lived credentials, a <strong>role</strong> is a set of permissions with no credentials of its own that any trusted principal can temporarily assume, and a <strong>policy</strong> is the JSON document that grants or denies the actual permissions and can be attached to either. The critical distinction is credential lifetime: a user's access key is valid until someone remembers to rotate it, whereas assuming a role issues short-lived credentials through STS that expire in an hour by default and are rotated automatically. That is why an application should never hold access keys — an EC2 instance gets a role through its instance profile, a pod on EKS gets one through IRSA or Pod Identity, a Lambda gets its execution role, and each of these delivers rotating credentials that never touch your code or your config. Long-lived keys are the single most commonly leaked AWS secret, and unlike a role session, a leaked key stays useful to the attacker indefinitely.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>IAM <strong>user</strong> là một danh tính cố định kèm thông tin đăng nhập dùng lâu dài; <strong>role</strong> là một bộ quyền không có credential riêng, mà bất kỳ principal nào được tin cậy đều có thể tạm thời "mượn"; còn <strong>policy</strong> là file JSON quy định thực sự cho phép hay từ chối hành động gì, và có thể gắn vào cả hai. Điểm khác biệt cốt tử nằm ở tuổi thọ của credential: access key của một user còn hiệu lực cho tới khi có người nhớ ra mà đi xoay vòng nó, trong khi việc assume role sẽ phát ra credential ngắn hạn qua STS, mặc định hết hạn sau một tiếng và tự động được cấp lại. Đó chính là lý do ứng dụng không bao giờ nên giữ access key: một EC2 lấy quyền qua instance profile, một pod trên EKS lấy qua IRSA hoặc Pod Identity, một Lambda thì dùng execution role của nó — cả ba cách đều đưa credential tự xoay vòng mà không cần chạm vào code hay file cấu hình. Access key dài hạn là loại secret AWS bị lộ nhiều nhất, và khác với một phiên role, key bị lộ thì kẻ tấn công dùng được vô thời hạn.</p></details>
<pre>Human developer  → IAM Identity Center (SSO) → assume role → temporary creds
CI/CD (GitHub)   → OIDC federation          → assume role → temporary creds
EC2 instance     → instance profile         → role        → temporary creds (auto-rotated)
EKS pod          → IRSA / Pod Identity      → role        → temporary creds
Lambda           → execution role           → role        → temporary creds

IAM user + access key → ❌ only for the rare legacy case with no alternative</pre>
<p><strong>Anatomy of a policy statement:</strong></p>
<pre>{
  "Effect": "Allow",
  "Action": ["s3:GetObject", "s3:PutObject"],
  "Resource": "arn:aws:s3:::my-bucket/uploads/*",
  "Condition": { "StringEquals": { "aws:PrincipalTag/team": "payments" } }
}</pre>
<p><strong>Policy types you should be able to name:</strong></p>
<ul>
<li><strong>Identity-based</strong> — attached to a user/group/role ("what can this principal do?").</li>
<li><strong>Resource-based</strong> — attached to the resource, e.g. an S3 bucket policy or SQS queue policy; these can grant <em>cross-account</em> access without a role.</li>
<li><strong>Permission boundary</strong> — a ceiling on what an identity policy can grant; used so a team can create roles without escalating privilege.</li>
<li><strong>SCP (Service Control Policy)</strong> — an Organization-level guardrail that can only restrict, never grant.</li>
<li><strong>Session policy</strong> — passed at AssumeTime to further narrow a session.</li>
</ul>
<div class="key-point">If an interviewer asks "how does your app authenticate to AWS?" the correct answer never contains the words "access key in an environment variable". Roles + STS short-lived credentials, always — and for CI, OIDC federation rather than stored keys.</div>`,
      },
      {
        q: 'How does IAM evaluate a request when several policies apply? (deny, SCP, boundaries)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>IAM is <strong>deny by default</strong>, and the evaluation is a fixed pipeline rather than a scoring system: an explicit <code>Deny</code> anywhere wins immediately and unconditionally, otherwise the request must be explicitly allowed and must survive every restricting layer. Concretely, AWS checks organization SCPs, then resource-based policies, then identity-based policies, then permission boundaries, then any session policy — and the effective permission is the <strong>intersection</strong> of all of them, with explicit deny short-circuiting the whole thing. This is why "I attached AdministratorAccess and it still says access denied" is almost always an SCP or a permission boundary, and why debugging IAM means asking which layer is missing an allow rather than adding more allows. The one real exception worth knowing is that a resource-based policy can grant cross-account access on its own, which is how S3 bucket policies and KMS key policies let another account in without a role in yours.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>IAM mặc định <strong>từ chối tất cả</strong>, và quá trình đánh giá là một dây chuyền cố định chứ không phải kiểu chấm điểm: chỉ cần có một <code>Deny</code> tường minh ở bất kỳ đâu là request bị chặn ngay lập tức, không cần xét gì thêm; còn lại thì request phải được cho phép tường minh và phải sống sót qua mọi lớp giới hạn. Cụ thể, AWS xét lần lượt SCP ở cấp Organization, rồi policy gắn trên resource, rồi policy gắn trên identity, rồi permission boundary, rồi session policy nếu có — và quyền cuối cùng chính là <strong>phần giao</strong> của tất cả các lớp đó, với explicit deny có quyền cắt ngang toàn bộ. Đây chính là lý do câu than quen thuộc "tôi gắn AdministratorAccess rồi mà vẫn báo access denied" gần như luôn là do một SCP hoặc một permission boundary chặn lại; và cũng là lý do gỡ lỗi IAM nghĩa là đi tìm xem lớp nào đang thiếu allow, chứ không phải cắm thêm allow cho nhiều vào. Ngoại lệ duy nhất đáng nhớ là policy gắn trên resource có thể tự nó cấp quyền xuyên tài khoản — đó là cách bucket policy của S3 hay key policy của KMS cho một account khác vào mà không cần tạo role bên phía bạn.</p></details>
<pre>Request arrives
   │
   ├─ Any explicit DENY (any policy type)? ──────────► DENY  (short-circuit)
   │
   ├─ Organization SCP allows the action?  ── no ───► DENY
   ├─ Resource-based policy?               ── allow ─► (can suffice cross-account)
   ├─ Identity-based policy allows?        ── no ───► DENY
   ├─ Permission boundary allows?          ── no ───► DENY
   ├─ Session policy allows?               ── no ───► DENY
   │
   └─────────────────────────────────────────────────► ALLOW</pre>
<p><strong>The mental model: effective permission = intersection of every layer.</strong></p>
<table>
<tr><th>Symptom</th><th>Usual cause</th></tr>
<tr><td>Admin policy attached, still denied</td><td>SCP blocks the action or the Region; or a permission boundary caps the role</td></tr>
<tr><td>Works in dev account, denied in prod</td><td>Different SCPs on the two OUs</td></tr>
<tr><td>Role can read the bucket, cannot decrypt objects</td><td>KMS key policy does not include the role (S3 + KMS need <em>both</em>)</td></tr>
<tr><td>Cross-account call fails</td><td>Both sides needed: trust policy on the role <em>and</em> sts:AssumeRole on the caller</td></tr>
</table>
<p><strong>Tools for debugging, in order of usefulness:</strong> IAM Policy Simulator, CloudTrail (the event records the exact denied action and the principal), IAM Access Analyzer for unintended external access, and <code>aws sts get-caller-identity</code> to confirm which principal you actually are — surprisingly often the answer is "not the one you thought".</p>
<div class="key-point">Two sentences that signal seniority: <em>"explicit deny always wins, and effective permissions are the intersection of SCP, identity, boundary and session policy"</em> — plus knowing that a resource-based policy is the one mechanism that can grant access without an identity policy in the caller's account.</div>`,
      },
      {
        q: 'How do you manage secrets and encryption on AWS? (Secrets Manager, Parameter Store, KMS)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Secrets should live in <strong>Secrets Manager</strong> or <strong>SSM Parameter Store</strong> as SecureString, never in environment variables committed to a repo, a container image, or a Terraform state file that half the company can read. The practical difference is that Secrets Manager costs more per secret but gives you built-in rotation with Lambda hooks, native RDS integration and cross-region replication, whereas Parameter Store is effectively free, versioned and perfectly adequate for configuration and for secrets you rotate yourself. Underneath both sits <strong>KMS</strong>, which does envelope encryption: KMS never hands out the master key, it encrypts a per-object data key, so the expensive centralised operation happens once per object while the bulk encryption happens locally. The senior points are that the KMS key policy is an independent authorisation layer — an IAM allow on S3 is useless if the key policy excludes your role — and that rotation only helps if the application re-reads the secret rather than caching it forever at startup.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Secret phải nằm trong <strong>Secrets Manager</strong> hoặc <strong>SSM Parameter Store</strong> kiểu SecureString, tuyệt đối không nằm trong biến môi trường bị commit lên repo, không nướng sẵn vào container image, và cũng không nằm trong file state của Terraform mà nửa công ty đọc được. Khác biệt thực tế giữa hai lựa chọn: Secrets Manager đắt hơn tính theo từng secret nhưng có sẵn cơ chế xoay vòng kèm hook Lambda, tích hợp thẳng với RDS và sao chép được sang region khác; còn Parameter Store thì gần như miễn phí, có đánh version, và hoàn toàn đủ dùng cho cấu hình cũng như cho những secret mà bạn tự xoay vòng lấy. Nằm dưới cả hai là <strong>KMS</strong>, hoạt động theo kiểu mã hóa lồng: KMS không bao giờ đưa khóa gốc ra ngoài, nó chỉ mã hóa một data key riêng cho từng đối tượng — nhờ vậy thao tác tập trung và tốn kém chỉ chạy một lần cho mỗi đối tượng, còn việc mã hóa khối dữ liệu lớn thì làm ngay tại chỗ. Hai điều mà một senior cần nói thêm: key policy của KMS là một lớp phân quyền độc lập — bạn có allow S3 trong IAM mà key policy không có role của bạn thì vẫn vô ích; và việc xoay vòng secret chỉ có tác dụng nếu ứng dụng chịu đọc lại secret, chứ không phải nạp một lần lúc khởi động rồi giữ mãi.</p></details>
<table>
<tr><th></th><th>Secrets Manager</th><th>Parameter Store (SecureString)</th></tr>
<tr><td>Cost</td><td>~$0.40/secret/month + API calls</td><td>Standard tier free (advanced tier paid)</td></tr>
<tr><td>Rotation</td><td>Built-in, Lambda-driven, native for RDS/Redshift/DocumentDB</td><td>Do it yourself</td></tr>
<tr><td>Cross-region replication</td><td>Yes, native</td><td>No</td></tr>
<tr><td>Versioning</td><td>Yes (AWSCURRENT / AWSPREVIOUS)</td><td>Yes</td></tr>
<tr><td>Best for</td><td>DB credentials, third-party API keys, anything needing rotation</td><td>Config, feature flags, low-churn secrets, cost-sensitive bulk</td></tr>
</table>
<p><strong>Envelope encryption — why KMS scales:</strong></p>
<pre>1. App asks KMS: GenerateDataKey(keyId)
2. KMS returns { plaintextKey, encryptedKey }     ← one small KMS call
3. App encrypts the 5 GB object locally with plaintextKey  ← fast, local
4. App stores encryptedKey alongside the ciphertext, discards plaintextKey
5. To read: send encryptedKey to KMS → Decrypt → get plaintextKey back

The master key never leaves KMS. Bulk data never goes to KMS.</pre>
<p><strong>Practical rules:</strong></p>
<ul>
<li><strong>Customer-managed keys (CMK)</strong> when you need your own key policy, rotation control, or an audit trail per key; AWS-managed keys when you just want encryption at rest to be on.</li>
<li><strong>Cache secrets with a short TTL</strong> (minutes), not forever — otherwise rotation breaks you at the worst time. AWS provides caching libraries that do this properly.</li>
<li><strong>Rotation must be dual-secret</strong>: create the new credential, let both work, switch, then retire the old one. A rotation that invalidates the old password instantly causes an outage.</li>
<li><strong>Encrypt in transit too</strong> — TLS everywhere, and enforce it with a bucket policy condition on <code>aws:SecureTransport</code>.</li>
</ul>
<div class="key-point">The detail that catches people out: S3 + SSE-KMS requires the caller to be allowed in <em>both</em> the IAM policy and the KMS key policy. "Access denied on a bucket I can list" is nearly always the KMS key policy.</div>`,
      },
      // ──── 3. NETWORKING ────
      {
        q: 'Design a production VPC. What goes in public vs private subnets, and why is NAT expensive?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>A production VPC is built around one rule: <strong>nothing that holds data or runs your code should be reachable from the internet</strong>. So the public subnets contain only the things that must accept inbound traffic — load balancers, and occasionally a bastion — while application servers, containers and databases live in private subnets with no route to an internet gateway. A subnet is "public" purely because its route table has a route to the IGW; there is no other flag. Outbound internet access from private subnets goes through a NAT gateway, which is where the money quietly goes: you pay an hourly charge per NAT gateway <em>and</em> a per-gigabyte processing fee on everything that passes through, so pulling container images or writing to S3 through NAT is a classic six-figure surprise. The fix is VPC endpoints for AWS services, which keep that traffic on the AWS network and bypass NAT entirely.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một VPC dùng cho production được dựng quanh đúng một nguyên tắc: <strong>bất cứ thứ gì giữ dữ liệu hoặc chạy code của bạn đều không được để internet chạm tới</strong>. Vì vậy subnet công khai chỉ chứa những thành phần buộc phải nhận traffic từ ngoài vào — load balancer, và đôi khi một máy bastion; còn application server, container và database đều nằm trong subnet riêng, không có đường ra internet gateway. Cũng cần nói rõ: một subnet được gọi là "public" chỉ vì route table của nó có đường đi tới IGW, chứ chẳng có cờ đánh dấu nào khác cả. Đường ra internet từ subnet riêng thì đi qua NAT gateway — và đây chính là chỗ tiền lặng lẽ bay đi: bạn vừa trả phí theo giờ cho mỗi NAT gateway, vừa trả phí xử lý theo từng gigabyte đi qua nó. Nên chuyện kéo container image hay ghi dữ liệu lên S3 xuyên qua NAT là một cú sốc hóa đơn kinh điển. Cách chữa là dùng VPC endpoint cho các dịch vụ AWS, để traffic đó đi thẳng trong mạng nội bộ AWS và né hoàn toàn NAT.</p></details>
<pre>VPC 10.0.0.0/16   (spread across 3 AZs)

  Public subnets    10.0.0.0/24, 10.0.1.0/24, 10.0.2.0/24
    → route 0.0.0.0/0 → Internet Gateway
    → contains: ALB/NLB, NAT gateways
                                │
  Private (app)     10.0.10.0/24, 10.0.11.0/24, 10.0.12.0/24
    → route 0.0.0.0/0 → NAT gateway (in the same AZ!)
    → contains: ECS/EKS tasks, EC2 app servers, Lambda-in-VPC
                                │
  Private (data)    10.0.20.0/24, 10.0.21.0/24, 10.0.22.0/24
    → NO route to 0.0.0.0/0
    → contains: RDS, ElastiCache, OpenSearch</pre>
<p><strong>Design decisions worth defending:</strong></p>
<ul>
<li><strong>One NAT gateway per AZ</strong>, not one shared. A single NAT is both a cross-AZ data-transfer bill and an AZ-failure blast radius.</li>
<li><strong>Size the CIDR generously</strong> — you cannot shrink a VPC CIDR, and EKS in particular eats IPs fast (one per pod with the VPC CNI). A /16 with /20 subnets is a safe default.</li>
<li><strong>Do not overlap CIDRs</strong> with other VPCs or on-prem ranges, or you can never peer them.</li>
<li><strong>Three AZs, not two</strong> — with two AZs, losing one removes 50% of capacity; with three it removes 33%.</li>
</ul>
<p><strong>Where NAT costs come from, and how to remove them:</strong></p>
<table>
<tr><th>Traffic</th><th>Through NAT</th><th>Better</th></tr>
<tr><td>S3 / DynamoDB access</td><td>Per-GB NAT processing</td><td><strong>Gateway endpoint</strong> — free, just a route table entry</td></tr>
<tr><td>ECR image pulls, SQS, KMS, Secrets Manager</td><td>Per-GB NAT processing</td><td><strong>Interface endpoint</strong> (PrivateLink) — hourly + per-GB, usually far cheaper</td></tr>
<tr><td>Third-party APIs</td><td>Unavoidable via NAT</td><td>Keep it, but monitor the volume</td></tr>
</table>
<div class="key-point">Two lines that show production experience: <em>"a subnet is public only because of its route table"</em>, and <em>"the first thing I add to any VPC is a gateway endpoint for S3 — it is free and it removes the largest single line of NAT charges."</em></div>`,
      },
      {
        q: 'Security groups vs NACLs — what is the practical difference?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A <strong>security group</strong> is a stateful firewall attached to an ENI (so effectively to an instance, task or database), and a <strong>NACL</strong> is a stateless firewall attached to a subnet. Stateful means that if you allow inbound on port 443, the response traffic is automatically allowed out — you never write return rules. Stateless means the opposite: a NACL evaluates every packet independently, so allowing inbound 443 without also allowing outbound on the ephemeral port range 1024-65535 silently breaks the connection, which is the single most common NACL mistake. Security groups also have no deny rules at all — everything is an allow, and anything not allowed is denied — whereas NACLs have ordered numbered rules with both allow and deny, evaluated first match wins. In practice the security group is the tool you use daily, and NACLs are a coarse subnet-level backstop, most often used to blackhole a specific IP range.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Security group</strong> là tường lửa có trạng thái, gắn vào ENI — tức là gắn vào từng instance, từng task hay từng database; còn <strong>NACL</strong> là tường lửa không trạng thái, gắn vào cả subnet. "Có trạng thái" nghĩa là khi bạn đã cho phép traffic vào cổng 443 thì chiều trả lời tự động được cho đi ra, bạn không phải viết thêm luật nào cho chiều về. "Không trạng thái" thì ngược lại: NACL xét từng gói tin một cách độc lập, nên nếu chỉ cho phép vào cổng 443 mà quên mở chiều ra cho dải cổng tạm 1024-65535 thì kết nối sẽ đứt một cách âm thầm — đây đúng là lỗi phổ biến nhất khi dùng NACL. Ngoài ra security group hoàn toàn không có luật deny: mọi luật đều là allow, và cái gì không được allow thì mặc nhiên bị chặn; trong khi NACL có luật đánh số theo thứ tự, có cả allow lẫn deny, và luật khớp đầu tiên sẽ thắng. Trên thực tế, security group mới là công cụ bạn dùng hằng ngày, còn NACL đóng vai một lớp chặn thô ở mức subnet, hay dùng nhất là để chặn thẳng một dải IP nào đó.</p></details>
<table>
<tr><th></th><th>Security Group</th><th>NACL</th></tr>
<tr><td>Attached to</td><td>ENI (instance / task / RDS)</td><td>Subnet</td></tr>
<tr><td>State</td><td><strong>Stateful</strong> — replies auto-allowed</td><td><strong>Stateless</strong> — must allow both directions</td></tr>
<tr><td>Rules</td><td>Allow only</td><td>Allow <em>and</em> deny</td></tr>
<tr><td>Evaluation</td><td>All rules, any match = allow</td><td>Numbered order, first match wins</td></tr>
<tr><td>Default</td><td>Deny all inbound, allow all outbound</td><td>Default NACL allows everything</td></tr>
<tr><td>Can reference</td><td><strong>Another security group</strong></td><td>CIDR blocks only</td></tr>
</table>
<p><strong>The killer feature — SG-to-SG references:</strong></p>
<pre>sg-alb   : inbound 443 from 0.0.0.0/0
sg-app   : inbound 8080 from sg-alb          ← not a CIDR, a security group
sg-rds   : inbound 5432 from sg-app          ← not a CIDR, a security group

Auto-scaling changes IPs constantly; this keeps working with zero updates,
and it documents the intended traffic flow in the rules themselves.</pre>
<p><strong>The classic NACL bug:</strong></p>
<pre>NACL inbound : ALLOW tcp/443 from 0.0.0.0/0     ✅
NACL outbound: (nothing)                         ❌
→ request arrives, server replies from port 443 to the client's
  ephemeral port... and the reply is dropped. Connection hangs.
Fix: outbound ALLOW tcp 1024-65535 to 0.0.0.0/0</pre>
<div class="key-point">Use security groups for everything, referencing SGs rather than CIDRs. Reach for NACLs only when you need a subnet-wide deny — for example blocking a hostile CIDR — because a security group physically cannot express "deny".</div>`,
      },
      {
        q: 'ALB vs NLB vs API Gateway vs CloudFront — how do you choose?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>They sit at different layers and solve different problems, so the choice follows from what you need to inspect and what you need to do with it. <strong>ALB</strong> is a Layer 7 HTTP load balancer: it can route on path, host and header, terminate TLS, and it is the default in front of ECS, EKS and EC2 web workloads. <strong>NLB</strong> is Layer 4: it forwards TCP/UDP with very low latency and extreme throughput, preserves the client IP, and gives you a static IP per AZ — use it for non-HTTP protocols, for gRPC at scale, or when a client needs a fixed IP to allowlist. <strong>API Gateway</strong> is not really a load balancer at all but a managed API front door: throttling, API keys, request validation, usage plans, and direct integration with Lambda — worth it for public APIs and serverless, but noticeably more expensive per request at high volume. <strong>CloudFront</strong> is the CDN in front of everything, caching at the edge and terminating TLS close to the user; it improves latency even for dynamic, uncacheable traffic because the connection rides the AWS backbone instead of the open internet.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Bốn thứ này nằm ở các tầng khác nhau và giải quyết các bài toán khác nhau, nên cách chọn phụ thuộc vào việc bạn cần nhìn thấy gì trong gói tin và cần làm gì với nó. <strong>ALB</strong> là load balancer tầng 7 cho HTTP: định tuyến được theo path, theo host, theo header, kết thúc TLS được — đây là lựa chọn mặc định đặt trước ECS, EKS và các ứng dụng web chạy EC2. <strong>NLB</strong> làm việc ở tầng 4: nó chuyển tiếp TCP/UDP với độ trễ cực thấp và throughput rất lớn, giữ nguyên IP thật của client, và cho bạn một IP tĩnh ở mỗi AZ — hãy dùng nó cho các giao thức không phải HTTP, cho gRPC ở quy mô lớn, hoặc khi phía đối tác cần một IP cố định để đưa vào danh sách cho phép. <strong>API Gateway</strong> thật ra không phải load balancer, mà là một cửa ngõ API dạng managed: có giới hạn tần suất, API key, kiểm tra dữ liệu đầu vào, gói sử dụng và tích hợp thẳng với Lambda — rất đáng dùng cho API công khai và kiến trúc serverless, nhưng tính theo từng request thì đắt hơn hẳn khi lưu lượng lớn. <strong>CloudFront</strong> là CDN đứng trước tất cả, cache ngay tại biên và kết thúc TLS gần người dùng; nó cải thiện độ trễ ngay cả với nội dung động không cache được, bởi vì kết nối sẽ chạy trên đường trục riêng của AWS thay vì lang thang trên internet công cộng.</p></details>
<table>
<tr><th></th><th>ALB</th><th>NLB</th><th>API Gateway</th><th>CloudFront</th></tr>
<tr><td>Layer</td><td>7 (HTTP)</td><td>4 (TCP/UDP)</td><td>7 (HTTP/WS)</td><td>7, at the edge</td></tr>
<tr><td>Routing on path/header</td><td>✅</td><td>❌</td><td>✅</td><td>✅ (behaviours)</td></tr>
<tr><td>Static IP</td><td>❌ (DNS name)</td><td>✅ per AZ / Elastic IP</td><td>❌</td><td>❌</td></tr>
<tr><td>Preserves client IP</td><td>via X-Forwarded-For</td><td>✅ natively</td><td>via header</td><td>via header</td></tr>
<tr><td>Latency overhead</td><td>Low</td><td>Very low</td><td>Higher</td><td>Reduces latency</td></tr>
<tr><td>Auth / throttling built in</td><td>OIDC/Cognito only</td><td>❌</td><td>✅ rich</td><td>Lambda@Edge / CF Functions</td></tr>
<tr><td>Pricing shape</td><td>Hourly + LCU</td><td>Hourly + NLCU</td><td>Per request (pricey at scale)</td><td>Per GB + requests</td></tr>
</table>
<p><strong>Typical production stacks:</strong></p>
<pre>Public web app     : Route 53 → CloudFront → ALB → ECS/EKS
Public REST API    : Route 53 → CloudFront → API Gateway → Lambda
Internal service   : private ALB (or NLB for gRPC) inside the VPC
Partner integration: NLB with Elastic IPs (they allowlist your IPs)
Very high RPS API  : CloudFront → ALB → containers  (skip API GW on cost)</pre>
<div class="key-point">The cost trap worth naming: API Gateway REST APIs are roughly $3.50 per million requests. At 1 billion requests/month that is ~$3,500 before compute — an ALB in front of containers costs a small fraction of that. Use API Gateway for its features, not as a default.</div>`,
      },
      {
        q: 'What are VPC endpoints / PrivateLink, and when do you need them?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>By default, calling S3 or SQS from a private subnet goes out through the NAT gateway to a public endpoint — the traffic never leaves the AWS network, but you pay NAT charges and you cannot express "this bucket is only reachable from my VPC". <strong>VPC endpoints</strong> fix both. A <strong>gateway endpoint</strong> exists only for S3 and DynamoDB, is free, and works by adding a prefix-list route to your route table. An <strong>interface endpoint</strong> (PrivateLink) puts an actual ENI with a private IP into your subnet and works for almost every other AWS service; it costs an hourly rate per AZ plus a small per-GB fee, which is nearly always cheaper than routing the same traffic through NAT. Beyond cost, the real senior argument is security posture: with endpoints you can drop the NAT gateway entirely for workloads that only talk to AWS services, and you can write bucket policies with an <code>aws:SourceVpce</code> condition so the data is unreachable from anywhere else even if credentials leak.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mặc định, khi gọi S3 hay SQS từ một subnet riêng thì traffic sẽ đi qua NAT gateway rồi tới endpoint công khai của dịch vụ. Traffic đó thực ra không hề rời khỏi mạng AWS, nhưng bạn vẫn phải trả tiền NAT, và bạn cũng không có cách nào diễn đạt được yêu cầu "bucket này chỉ được truy cập từ VPC của tôi". <strong>VPC endpoint</strong> giải quyết cả hai chuyện đó. <strong>Gateway endpoint</strong> chỉ tồn tại cho S3 và DynamoDB, hoàn toàn miễn phí, và hoạt động bằng cách thêm một route vào route table của bạn. <strong>Interface endpoint</strong> (tức PrivateLink) thì đặt hẳn một ENI có IP nội bộ vào trong subnet của bạn và dùng được với gần như mọi dịch vụ AWS còn lại; nó tính phí theo giờ cho mỗi AZ cộng một khoản nhỏ theo gigabyte — hầu như lúc nào cũng rẻ hơn việc đẩy đúng lượng traffic ấy qua NAT. Nhưng ngoài chuyện tiền, lập luận đáng giá hơn của một senior là về thế trận bảo mật: có endpoint rồi thì với những workload chỉ nói chuyện với dịch vụ AWS, bạn có thể bỏ hẳn NAT gateway; và bạn còn viết được bucket policy kèm điều kiện <code>aws:SourceVpce</code>, khiến dữ liệu không thể bị đọc từ bất kỳ đâu khác — kể cả khi credential bị lộ.</p></details>
<table>
<tr><th></th><th>Gateway endpoint</th><th>Interface endpoint (PrivateLink)</th></tr>
<tr><td>Services</td><td>S3, DynamoDB only</td><td>Almost all AWS services + your own / partner services</td></tr>
<tr><td>Mechanism</td><td>Route table entry (prefix list)</td><td>ENI with a private IP in your subnet</td></tr>
<tr><td>Cost</td><td><strong>Free</strong></td><td>~$0.01/hour per AZ + ~$0.01/GB</td></tr>
<tr><td>Works from on-prem / peered VPC</td><td>❌</td><td>✅</td></tr>
<tr><td>DNS</td><td>Uses the public DNS name, routed privately</td><td>Private DNS overrides the service hostname</td></tr>
</table>
<p><strong>Locking a bucket to your VPC:</strong></p>
<pre>{
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:*",
  "Resource": ["arn:aws:s3:::my-bucket", "arn:aws:s3:::my-bucket/*"],
  "Condition": { "StringNotEquals": { "aws:SourceVpce": "vpce-0abc123" } }
}
→ leaked credentials are useless from outside the VPC.</pre>
<p><strong>PrivateLink also works the other way:</strong> you can publish your own service behind an NLB as an endpoint service, and a partner or another account consumes it through an interface endpoint in their VPC. No VPC peering, no overlapping-CIDR problem, no route sharing — and the connection is one-directional by construction, which is why SaaS vendors on AWS offer it.</p>
<div class="key-point">Rule of thumb: always add the free S3 and DynamoDB gateway endpoints. Add interface endpoints for ECR, Secrets Manager, KMS, SQS and CloudWatch Logs when your NAT bill or your compliance requirements justify it — and note that ECR needs <em>both</em> ECR endpoints plus the S3 gateway endpoint to pull images.</div>`,
      },
      {
        q: 'Route 53 routing policies and health checks — what do you use in practice?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Route 53 is DNS with routing logic attached, and the policy you pick encodes your failover and traffic-shaping strategy. <strong>Simple</strong> is a plain record; <strong>weighted</strong> splits traffic by percentage and is the standard mechanism for canary releases and blue/green cutovers; <strong>latency-based</strong> sends each user to the Region that is fastest for them; <strong>failover</strong> pairs a primary with a standby and switches on a health check; <strong>geolocation</strong> and <strong>geoproximity</strong> route by where the user is, which is how data-residency and localisation requirements get enforced. The AWS-specific feature that matters most is the <strong>alias record</strong>: it points at an ALB, CloudFront distribution or S3 website, resolves to the current IPs automatically, works at the zone apex where a CNAME is illegal, and is not billed for queries. The important caveat for any DNS-based failover is that clients and resolvers cache aggressively, so your real recovery time is TTL plus health-check detection time — which is why DNS failover is a minutes-scale tool, not a seconds-scale one.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Route 53 là DNS có gắn thêm logic định tuyến, và policy bạn chọn chính là cách bạn mã hóa chiến lược chuyển đổi dự phòng và điều tiết lưu lượng của mình. <strong>Simple</strong> là bản ghi thường; <strong>weighted</strong> chia traffic theo tỷ lệ phần trăm và là cơ chế tiêu chuẩn để chạy canary hay chuyển đổi blue/green; <strong>latency-based</strong> đưa mỗi người dùng tới region nhanh nhất đối với họ; <strong>failover</strong> ghép một bên chính với một bên dự phòng rồi tự chuyển khi health check báo hỏng; còn <strong>geolocation</strong> và <strong>geoproximity</strong> định tuyến theo vị trí người dùng — đây chính là cách người ta đáp ứng yêu cầu lưu trú dữ liệu và bản địa hóa. Tính năng riêng của AWS đáng chú ý nhất là <strong>alias record</strong>: nó trỏ thẳng tới ALB, CloudFront hay S3 website, tự phân giải ra IP hiện hành, dùng được ngay ở gốc domain — nơi mà CNAME bị cấm — và không bị tính tiền theo lượt truy vấn. Còn một lưu ý quan trọng cho mọi kiểu failover dựa trên DNS: client và resolver cache rất lì, nên thời gian phục hồi thật sự bằng TTL cộng với thời gian phát hiện của health check. Vì vậy failover bằng DNS là công cụ tính bằng phút, đừng kỳ vọng nó phản ứng trong vài giây.</p></details>
<table>
<tr><th>Policy</th><th>Use it for</th></tr>
<tr><td><strong>Weighted</strong></td><td>Canary (5% → 25% → 100%), blue/green, gradual migration between stacks</td></tr>
<tr><td><strong>Latency</strong></td><td>Multi-region active-active — send users to the fastest Region</td></tr>
<tr><td><strong>Failover</strong></td><td>Active-passive DR: primary + standby, driven by a health check</td></tr>
<tr><td><strong>Geolocation</strong></td><td>Data residency, legal restrictions, localised content</td></tr>
<tr><td><strong>Multivalue answer</strong></td><td>Cheap client-side load spreading with health checking (not a load balancer)</td></tr>
</table>
<p><strong>Health checks can watch three things:</strong> an endpoint (HTTP/HTTPS/TCP from multiple global checkers), a CloudWatch alarm (useful when "healthy" is a business metric, not a 200 response), or other health checks combined with AND/OR/NOT — the last one lets you express "the Region is healthy only if the API <em>and</em> the database are healthy".</p>
<p><strong>The failover-time arithmetic people get wrong:</strong></p>
<pre>Health check interval 30 s × 3 failures  = up to 90 s to mark unhealthy
+ record TTL 60 s                        = up to 60 s of stale caching
+ badly behaved resolvers/clients        = sometimes much longer
─────────────────────────────────────────────────────────
Realistic RTO ≈ 2-4 minutes, not "instant"

Need seconds? Use Global Accelerator (anycast IPs, no DNS caching)
or an in-Region ALB with multiple healthy targets.</pre>
<div class="key-point">Prefer alias records over CNAMEs for AWS targets — free queries, works at the zone apex, and follows the target's IP changes. And keep TTLs low (60 s) on anything you intend to fail over, but raise them again afterwards; low TTLs everywhere just increase query cost and resolver load.</div>`,
      },
      // ──── 4. COMPUTE ────
      {
        q: 'EC2 vs ECS vs EKS vs Fargate vs Lambda — how do you actually decide?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The honest decision framework is not about technology but about two questions: how much operational surface does the team want to own, and what does the traffic shape look like. <strong>Lambda</strong> wins for spiky, event-driven or low-duty-cycle workloads because you pay per millisecond and nothing when idle — but it is genuinely expensive for steady high-throughput services and imposes hard limits on duration, package size and long-lived connections. <strong>Fargate</strong> gives you containers without managing nodes: more expensive per vCPU-hour than EC2, dramatically cheaper in engineer-hours, and the right default for most teams. <strong>ECS</strong> is the simpler orchestrator that most teams should pick unless they need something Kubernetes-specific, while <strong>EKS</strong> is worth its control-plane cost and operational weight only when you need the ecosystem — operators, service mesh, multi-cloud portability, or an existing Kubernetes skill base. Plain <strong>EC2</strong> remains correct for licensing constraints, GPUs, unusual kernels, or lift-and-shift. The senior instinct is to pick the least operationally expensive option that meets the constraints, and to notice that Fargate-versus-EC2 is a pure cost-versus-effort calculation you can compute rather than argue about.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khung quyết định trung thực ở đây không nằm ở công nghệ, mà nằm ở hai câu hỏi: đội của bạn muốn ôm bao nhiêu phần việc vận hành, và hình dạng lưu lượng trông ra sao. <strong>Lambda</strong> thắng ở những workload giật cục, hướng sự kiện hoặc chạy thưa, bởi bạn trả tiền theo mili-giây và không tốn gì khi rảnh — nhưng nó thật sự đắt với dịch vụ chạy đều và throughput cao, đồng thời áp các giới hạn cứng về thời gian chạy, kích thước gói và kết nối dài hạn. <strong>Fargate</strong> cho bạn chạy container mà không phải quản node: đắt hơn EC2 nếu tính theo giờ vCPU, nhưng rẻ hơn rất nhiều nếu tính theo giờ công kỹ sư — và đây là lựa chọn mặc định hợp lý cho phần lớn các đội. <strong>ECS</strong> là bộ điều phối đơn giản hơn, và hầu hết các đội nên chọn nó trừ khi cần một thứ gì đó chỉ Kubernetes mới có; còn <strong>EKS</strong> chỉ xứng đáng với chi phí control plane và gánh nặng vận hành khi bạn thật sự cần hệ sinh thái của nó — operator, service mesh, khả năng chạy đa cloud, hoặc đội đã sẵn kỹ năng Kubernetes. <strong>EC2</strong> thuần vẫn đúng cho các ràng buộc về bản quyền phần mềm, cho GPU, cho nhân hệ điều hành đặc biệt, hoặc khi bê nguyên hệ thống cũ lên. Bản năng của một senior là chọn phương án tốn ít công vận hành nhất mà vẫn thỏa các ràng buộc — và nhận ra rằng chuyện Fargate hay EC2 là một phép tính chi phí đổi lấy công sức, tính ra được chứ không cần tranh cãi.</p></details>
<table>
<tr><th></th><th>Lambda</th><th>Fargate</th><th>ECS on EC2</th><th>EKS</th><th>EC2</th></tr>
<tr><td>You manage</td><td>Code only</td><td>Container</td><td>Container + nodes</td><td>Container + nodes + K8s</td><td>Everything</td></tr>
<tr><td>Scale to zero</td><td>✅</td><td>❌</td><td>❌</td><td>❌</td><td>❌</td></tr>
<tr><td>Max runtime</td><td>15 min</td><td>Unlimited</td><td>Unlimited</td><td>Unlimited</td><td>Unlimited</td></tr>
<tr><td>Cost at steady high load</td><td>Worst</td><td>Medium</td><td>Good</td><td>Good</td><td>Best (with RI/Spot)</td></tr>
<tr><td>Cost when idle/spiky</td><td>Best</td><td>Poor</td><td>Poor</td><td>Poor</td><td>Worst</td></tr>
<tr><td>Ops burden</td><td>Lowest</td><td>Low</td><td>Medium</td><td>Highest</td><td>High</td></tr>
</table>
<p><strong>A decision path that survives follow-up questions:</strong></p>
<pre>Event-driven, bursty, &lt; 15 min, no long-lived connections?  → Lambda
Need Kubernetes ecosystem / already have K8s expertise?     → EKS (Fargate or nodes)
Just want to run containers reliably on AWS?                → ECS on Fargate
Steady 24/7 high load, cost-sensitive, ops team exists?     → ECS/EKS on EC2 + Spot + Savings Plans
GPU, licensing, special kernel, lift-and-shift?             → EC2</pre>
<p><strong>The crossover that senior engineers quantify:</strong> Lambda is cheaper than a container until roughly the point where a function is running continuously. Once a workload keeps one container fully busy around the clock, an equivalently sized Fargate task is usually several times cheaper — and an EC2 instance under a Savings Plan cheaper again. Do the arithmetic; do not argue "serverless is cheaper" as a principle.</p>
<div class="key-point">Strong closing line: <em>"I default to ECS on Fargate because it removes node management without the Kubernetes tax, and I move to EKS only when a concrete requirement — an operator, a mesh, portability — justifies the extra operational surface."</em></div>`,
      },
      {
        q: 'How does Auto Scaling work, and what makes a scaling policy actually good?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>An Auto Scaling Group maintains a desired count of instances across AZs, replaces unhealthy ones, and adjusts capacity according to a policy. The policy you should reach for first is <strong>target tracking</strong> — you declare a target such as 50% average CPU or a fixed number of requests per target, and AWS manages the maths — because step scaling requires you to hand-tune thresholds that will be wrong after the next code change. The subtle part is choosing the right metric: CPU is a poor proxy for most web services, and ALB <strong>request count per target</strong> or a queue-depth metric usually tracks real load far better. The other half of a good policy is timing: scale out aggressively and scale in slowly, because being briefly over-provisioned costs a few dollars while being under-provisioned costs an outage. Finally, remember that the ASG only starts an instance — if your application takes three minutes to warm up, your effective reaction time is three minutes, which is exactly why warm pools, pre-baked AMIs and correct health-check grace periods matter more than the scaling policy itself.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Auto Scaling Group giữ cho số lượng instance mong muốn được duy trì và trải đều qua các AZ, tự thay thế những instance hỏng, và tăng giảm công suất theo policy bạn đặt. Loại policy nên dùng trước tiên là <strong>target tracking</strong>: bạn chỉ khai báo một mục tiêu, ví dụ CPU trung bình 50% hay một số request cố định trên mỗi target, rồi để AWS lo phần tính toán — bởi vì step scaling bắt bạn tự chỉnh tay các ngưỡng, mà những ngưỡng đó sẽ sai ngay sau lần đổi code kế tiếp. Phần tinh tế nằm ở chỗ chọn đúng chỉ số: CPU là thước đo khá tệ cho phần lớn dịch vụ web, còn <strong>số request trên mỗi target</strong> của ALB hoặc độ dài hàng đợi thường phản ánh tải thật chính xác hơn nhiều. Nửa còn lại của một policy tốt là chuyện thời gian: hãy mở rộng thật nhanh và thu hẹp thật chậm, vì thừa công suất một lúc chỉ tốn vài đô, còn thiếu công suất thì trả giá bằng cả một sự cố. Cuối cùng, đừng quên ASG chỉ làm mỗi việc là bật instance lên: nếu ứng dụng của bạn mất ba phút mới khởi động xong, thì thời gian phản ứng thật sự của hệ thống là ba phút — và đó chính là lý do warm pool, AMI dựng sẵn cùng khoảng ân hạn health check còn quan trọng hơn cả bản thân cái policy.</p></details>
<table>
<tr><th>Policy type</th><th>When</th></tr>
<tr><td><strong>Target tracking</strong></td><td>Default choice. "Keep ALBRequestCountPerTarget at 1000" — AWS computes the rest.</td></tr>
<tr><td><strong>Step scaling</strong></td><td>When you need different responses at different severities (+1 at 60%, +4 at 85%).</td></tr>
<tr><td><strong>Scheduled</strong></td><td>Known patterns — business hours, a nightly batch, a scheduled campaign.</td></tr>
<tr><td><strong>Predictive</strong></td><td>Strong daily/weekly cycles; ML forecasts and pre-scales ahead of the curve.</td></tr>
</table>
<p><strong>Choosing the metric — the part that separates good from cargo-cult:</strong></p>
<pre>❌ CPU 70%          — fine for CPU-bound work, meaningless for I/O-bound APIs
✅ ALBRequestCountPerTarget — tracks actual demand per instance
✅ SQS ApproximateNumberOfMessagesVisible / instance count  — for workers
✅ p99 latency (via a custom metric)  — scales on what users actually feel
✅ Concurrent connections            — for websocket / streaming services</pre>
<p><strong>Asymmetric timing:</strong></p>
<pre>Scale OUT : react in 1-2 datapoints, short cooldown   → capacity ahead of demand
Scale IN  : require many datapoints, long cooldown    → avoid thrashing
+ health check grace period &gt; app startup time        → or the ASG kills
                                                        instances that are
                                                        still booting</pre>
<p><strong>Reliability details:</strong> spread across at least three AZs and let the ASG rebalance; use <strong>ELB health checks</strong> rather than EC2 status checks so a hung application is actually replaced; combine On-Demand and Spot with a mixed-instances policy and multiple instance types so a single capacity shortfall cannot stall scaling; and use instance refresh for rolling AMI updates.</p>
<div class="key-point">The line that shows operational maturity: <em>"scaling policy is the easy half — the reaction time is dominated by instance boot plus application warm-up, so I optimise that first and use target tracking on a demand-proportional metric rather than CPU."</em></div>`,
      },
      {
        q: 'Explain the Lambda concurrency model and cold starts. How do you keep latency predictable?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Lambda's unit of scaling is the <strong>execution environment</strong>, and each one handles exactly one request at a time — so concurrency equals the number of simultaneous in-flight requests, and throughput is concurrency divided by average duration. A <strong>cold start</strong> happens whenever a new environment must be created: AWS provisions it, downloads your code, starts the runtime and runs your initialisation code before the handler ever executes. That last part is the piece you control — heavy SDK construction, framework bootstrapping or a fat dependency tree can dwarf the platform's own overhead, and a Lambda placed inside a VPC used to add seconds until AWS re-architected ENI attachment. The tools for predictability are <strong>provisioned concurrency</strong>, which keeps environments initialised and warm at a price, <strong>SnapStart</strong> for JVM workloads, which snapshots the post-initialisation state and restores it, and simply doing less work at init. The account-level ceiling matters too: concurrency is a shared regional quota, so one runaway function can starve every other function in the account unless you set reserved concurrency as a bulkhead.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đơn vị mở rộng của Lambda là <strong>execution environment</strong>, và mỗi environment tại một thời điểm chỉ phục vụ đúng một request — nên độ đồng thời chính bằng số request đang chạy song song, còn throughput bằng độ đồng thời chia cho thời lượng trung bình. <strong>Cold start</strong> xảy ra mỗi khi cần dựng một environment mới: AWS cấp phát nó, tải code của bạn về, khởi động runtime, rồi chạy phần code khởi tạo trước khi handler được gọi lần đầu. Chính phần cuối đó mới là thứ bạn kiểm soát được — việc dựng SDK nặng nề, khởi động cả một framework hay kéo theo cây phụ thuộc phình to hoàn toàn có thể lớn hơn nhiều so với chi phí nền tảng; và Lambda đặt trong VPC trước đây từng cộng thêm vài giây, cho tới khi AWS thiết kế lại cách gắn ENI. Bộ công cụ để giữ độ trễ ổn định gồm: <strong>provisioned concurrency</strong> — giữ sẵn các environment đã khởi tạo và còn ấm, tất nhiên là mất tiền; <strong>SnapStart</strong> cho các workload JVM — chụp lại trạng thái sau khởi tạo rồi phục hồi; và đơn giản nhất là làm ít việc đi ở bước init. Cũng đừng quên trần ở cấp tài khoản: độ đồng thời là hạn mức dùng chung theo region, nên chỉ một function chạy loạn cũng đủ bỏ đói mọi function khác trong tài khoản — trừ khi bạn đặt reserved concurrency làm vách ngăn.</p></details>
<pre>Cold start anatomy
├── AWS: provision environment, download code   ← platform, ~100-400 ms
├── AWS: start runtime                          ← platform
├── YOUR init code (outside the handler)        ← YOU control this
│     DB pool, SDK clients, framework bootstrap, config load
└── handler(event)                              ← billed duration starts here-ish

Warm invoke = only the handler runs. The init block is reused.</pre>
<p><strong>Concurrency arithmetic:</strong></p>
<pre>Concurrency = requests/sec × average duration (seconds)
   1000 rps × 0.2 s = 200 concurrent environments

Regional default quota ≈ 1000 concurrent (raisable).
Burst limit applies: Lambda adds capacity in bursts, then +500/min.
Exceed it → TooManyRequestsException (throttle), 429 to the caller.</pre>
<table>
<tr><th>Control</th><th>Effect</th></tr>
<tr><td><strong>Reserved concurrency</strong></td><td>Caps a function <em>and</em> guarantees it that slice — a bulkhead in both directions</td></tr>
<tr><td><strong>Provisioned concurrency</strong></td><td>Pre-initialised, always-warm environments. Removes cold starts, costs money while idle</td></tr>
<tr><td><strong>SnapStart</strong></td><td>JVM: snapshot after init, restore on invoke — large cold-start reduction, near zero cost</td></tr>
</table>
<p><strong>Practical latency work, in order of payoff:</strong> move client construction outside the handler so it is reused, trim the deployment package and lazy-load rarely used dependencies, prefer a lighter runtime for latency-critical paths, raise the memory setting (CPU scales with memory — a function can get both faster <em>and</em> cheaper), and apply provisioned concurrency only to the user-facing functions rather than everything.</p>
<div class="key-point">The nuance interviewers listen for: cold starts affect the <strong>tail</strong>, not the average — at steady traffic most invocations are warm. Chasing p50 with provisioned concurrency wastes money; the honest question is whether your p99 requirement tolerates the occasional cold start.</div>`,
      },
      {
        q: 'What are the real limits of serverless, and when would you say no to Lambda?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Lambda's constraints are hard, not advisory: a 15-minute maximum execution time, 10 GB of memory, a 6 MB synchronous payload, 512 MB of writable /tmp by default, and a deployment package limit that pushes large dependencies into container images. Those rule out long batch jobs, video transcoding of large files, and anything that wants to hold a persistent connection — WebSocket servers, database connection pools and long-polling consumers all fight the model rather than fit it. The economics are the second reason to say no: at steady high throughput, per-millisecond billing loses badly to a container that is already running, and the crossover arrives sooner than most teams expect. Then there is the architectural cost — cold starts on the tail, distributed tracing across dozens of functions, local testing that never quite matches production, and per-function IAM roles that multiply. My rule is that Lambda is excellent glue and excellent for spiky event-driven work, but a high-traffic, latency-sensitive, always-on API is usually a container.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các giới hạn của Lambda là giới hạn cứng chứ không phải khuyến nghị: tối đa 15 phút cho một lần chạy, 10 GB bộ nhớ, payload đồng bộ 6 MB, mặc định 512 MB dung lượng ghi được ở /tmp, và giới hạn kích thước gói triển khai khiến các phụ thuộc cồng kềnh buộc phải chuyển sang đóng gói bằng container image. Những con số đó loại thẳng các job batch chạy dài, việc transcode video lớn, và mọi thứ cần giữ kết nối lâu dài — server WebSocket, connection pool tới database hay consumer kiểu long-polling đều đang chống lại mô hình này chứ không hợp với nó. Lý do thứ hai để nói không là bài toán tiền: ở mức throughput cao và đều, cách tính tiền theo mili-giây thua đậm một container vốn đã chạy sẵn, và điểm giao nhau đến sớm hơn nhiều so với hình dung của phần lớn các đội. Rồi còn cái giá về mặt kiến trúc: cold start ở phần đuôi độ trễ, việc lần vết một request xuyên hàng chục function, chuyện test ở máy local không bao giờ giống hệt production, và số lượng IAM role nhân lên theo từng function. Nguyên tắc của tôi là: Lambda rất tốt để làm chất kết dính và rất tốt cho các workload hướng sự kiện giật cục — nhưng một API lưu lượng cao, nhạy độ trễ và chạy suốt ngày đêm thì thường nên là một container.</p></details>
<table>
<tr><th>Limit</th><th>Value</th><th>What it rules out</th></tr>
<tr><td>Execution time</td><td>15 minutes</td><td>Long batch, large ETL, big transcodes → Step Functions, Fargate, Batch</td></tr>
<tr><td>Memory</td><td>10 GB</td><td>Large in-memory datasets, some ML inference</td></tr>
<tr><td>Sync payload</td><td>6 MB (async 256 KB)</td><td>Large uploads → presigned S3 URL instead</td></tr>
<tr><td>/tmp</td><td>512 MB (up to 10 GB configurable)</td><td>Big intermediate files</td></tr>
<tr><td>Package</td><td>50 MB zipped / 250 MB unzipped (10 GB via image)</td><td>Fat runtimes without container packaging</td></tr>
<tr><td>Concurrency</td><td>~1000/Region default</td><td>Uncontrolled fan-out starving other functions</td></tr>
</table>
<p><strong>The architectural mismatches, which matter more than the numbers:</strong></p>
<ul>
<li><strong>Database connections</strong> — 500 concurrent Lambdas means 500 connection attempts. RDS Proxy exists precisely because of this; DynamoDB or an HTTP data API sidesteps it.</li>
<li><strong>Persistent connections</strong> — no long-lived WebSockets in the function itself; API Gateway holds the socket and invokes you per message, which is a different programming model.</li>
<li><strong>Warm local caches</strong> — you cannot rely on in-process caching, because environments come and go.</li>
<li><strong>Debugging and testing</strong> — local emulation is approximate, and a request spanning ten functions needs X-Ray to be comprehensible at all.</li>
</ul>
<p><strong>Where serverless is clearly right:</strong> S3-triggered processing, scheduled jobs, event glue between services, webhook receivers, low-traffic internal APIs, traffic that is idle most of the day, and anything where an ops team does not exist.</p>
<div class="key-point">The mature framing: <em>"serverless is not a maturity level, it is a workload fit. I choose it for spiky, event-driven, short-lived work — and I move to containers when the workload is steady, connection-heavy, or latency-critical at the tail."</em></div>`,
      },
      // ──── 5. STORAGE ────
      {
        q: 'S3 fundamentals a senior should know: durability, consistency, storage classes, lifecycle.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>S3 is an object store, not a filesystem: flat keys with no real directories, objects are immutable so an "update" writes a whole new version, and it offers eleven nines of durability by replicating across at least three AZs within a Region. Since December 2020 it provides <strong>strong read-after-write consistency</strong> for all operations, which retired a generation of workarounds — but note that consistency is per object, not transactional across objects. The storage classes are a cost-versus-access-latency curve: Standard for hot data, Standard-IA and One Zone-IA for infrequent access with a retrieval fee and a minimum 30-day billing duration, Glacier tiers for archives with retrieval times from minutes to hours, and <strong>Intelligent-Tiering</strong>, which moves objects automatically and is the right default when you genuinely cannot predict access patterns. Lifecycle rules then automate the transitions and expiry, and the detail people forget is to expire incomplete multipart uploads — orphaned parts are invisible in the console but fully billed, and they accumulate for years.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>S3 là kho lưu đối tượng chứ không phải hệ thống file: key nằm phẳng, không có thư mục thật, object thì bất biến nên mỗi lần "sửa" thực chất là ghi hẳn một bản mới; và nó cho độ bền mười một số chín nhờ nhân bản dữ liệu ra ít nhất ba AZ trong cùng region. Từ tháng 12 năm 2020, S3 đã cung cấp <strong>tính nhất quán mạnh ngay sau khi ghi</strong> cho mọi thao tác, xóa sổ cả một thế hệ mẹo lách trước đó — nhưng cần nhớ tính nhất quán này áp dụng cho từng object, chứ không phải là transaction trải trên nhiều object. Các storage class là một đường cong đánh đổi giữa chi phí và độ trễ truy cập: Standard cho dữ liệu nóng; Standard-IA và One Zone-IA cho dữ liệu ít truy cập, kèm phí lấy dữ liệu ra và bị tính tiền tối thiểu 30 ngày; các tầng Glacier dành cho lưu trữ lâu dài với thời gian lấy ra từ vài phút tới vài giờ; và <strong>Intelligent-Tiering</strong> tự động chuyển object giữa các tầng — đây là lựa chọn mặc định đúng đắn khi bạn thật sự không đoán được dữ liệu sẽ được truy cập ra sao. Lifecycle rule lo phần tự động chuyển tầng và xóa hết hạn; và chi tiết mà ai cũng quên là hãy đặt luật xóa các multipart upload dở dang — những mảnh mồ côi đó không hiện trên console nhưng vẫn bị tính tiền đầy đủ, và chúng tích tụ suốt nhiều năm.</p></details>
<table>
<tr><th>Class</th><th>Use for</th><th>Catch</th></tr>
<tr><td><strong>Standard</strong></td><td>Hot data, unpredictable access</td><td>Most expensive per GB</td></tr>
<tr><td><strong>Intelligent-Tiering</strong></td><td>Unknown/changing patterns</td><td>Small per-object monitoring fee</td></tr>
<tr><td><strong>Standard-IA</strong></td><td>Backups, older data still read occasionally</td><td>Retrieval fee + 30-day minimum + 128 KB minimum size</td></tr>
<tr><td><strong>One Zone-IA</strong></td><td>Reproducible data (thumbnails, derived files)</td><td>Single AZ — lost if that AZ is lost</td></tr>
<tr><td><strong>Glacier Instant / Flexible / Deep Archive</strong></td><td>Compliance archives, logs</td><td>Retrieval time minutes → 12 h; 90/180-day minimums</td></tr>
</table>
<p><strong>A lifecycle policy that reflects real practice:</strong></p>
<pre>Day   0  → S3 Standard
Day  30  → Standard-IA
Day  90  → Glacier Flexible Retrieval
Day 365  → Glacier Deep Archive
Day 2555 → Expire (7-year retention)

+ ALWAYS: AbortIncompleteMultipartUpload after 7 days
+ If versioning is on: expire noncurrent versions after N days,
  or old versions silently become your largest bill line.</pre>
<p><strong>Performance facts worth knowing:</strong> S3 sustains at least 3,500 PUT/COPY/POST/DELETE and 5,500 GET/HEAD requests per second <em>per prefix</em>, and prefixes scale horizontally — so spreading keys across prefixes multiplies throughput. Random key prefixes are no longer required for performance, but partitioning by prefix still helps very high-throughput workloads. Use multipart upload above ~100 MB for parallelism and resumability, and Transfer Acceleration or presigned multipart for slow long-distance uploads.</p>
<div class="key-point">Two things that mark experience: knowing S3 has been strongly consistent since 2020 (many answers are years out of date), and knowing that versioning plus no noncurrent-version expiry is one of the most common runaway-cost bugs on AWS.</div>`,
      },
      {
        q: 'How do you control access to S3 safely? (bucket policy, IAM, presigned URLs, Block Public Access)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>S3 has several overlapping access mechanisms, and the safe pattern is to use as few of them as possible. Turn on <strong>Block Public Access at the account level</strong> so no bucket can ever be made public by accident — this single setting prevents the most common AWS data leak. Use <strong>IAM policies</strong> for principals inside your account, <strong>bucket policies</strong> for cross-account access and for blanket conditions such as denying non-TLS requests, and never use legacy ACLs; AWS now disables them by default with Object Ownership set to bucket-owner-enforced, and that is the correct setting. For letting end users upload or download without proxying bytes through your servers, issue <strong>presigned URLs</strong>: they carry your permissions, expire quickly, and mean a browser talks straight to S3 — but they are bearer tokens, so keep the expiry short and scope them to a single key. For a static site or private media, put CloudFront in front with Origin Access Control so the bucket itself stays completely private.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>S3 có nhiều cơ chế phân quyền chồng lên nhau, và cách làm an toàn là dùng càng ít cơ chế càng tốt. Trước hết hãy bật <strong>Block Public Access ở mức tài khoản</strong>, để không một bucket nào có thể vô tình bị đưa ra công khai — chỉ riêng thiết lập này đã chặn được kiểu rò rỉ dữ liệu phổ biến nhất trên AWS. Dùng <strong>IAM policy</strong> cho các principal bên trong tài khoản của bạn; dùng <strong>bucket policy</strong> cho truy cập xuyên tài khoản và cho các điều kiện áp dụng toàn bucket, chẳng hạn từ chối mọi request không đi qua TLS; và đừng dùng ACL kiểu cũ nữa — AWS giờ đã tắt mặc định bằng cách đặt Object Ownership thành bucket-owner-enforced, và đó là thiết lập đúng. Còn để người dùng cuối tải lên hay tải xuống mà không phải đẩy toàn bộ dữ liệu qua server của bạn, hãy phát <strong>presigned URL</strong>: nó mang theo quyền của bạn, hết hạn nhanh, và giúp trình duyệt nói chuyện thẳng với S3 — nhưng hãy nhớ nó là một dạng token, ai cầm cũng dùng được, nên phải đặt thời hạn ngắn và giới hạn đúng một key. Với trang tĩnh hoặc file media riêng tư, hãy đặt CloudFront ở phía trước kèm Origin Access Control, để bản thân bucket luôn ở trạng thái hoàn toàn riêng tư.</p></details>
<pre>Decision guide
  Principal in my account          → IAM policy
  Another AWS account              → bucket policy (resource-based)
  Blanket rule for the whole bucket→ bucket policy (deny non-TLS, deny wrong VPCe)
  Browser upload/download          → presigned URL, short expiry
  Public website / media           → CloudFront + Origin Access Control, bucket private
  ACLs                             → don't. Object Ownership = bucket-owner-enforced</pre>
<p><strong>Baseline bucket policy every production bucket should have:</strong></p>
<pre>{
  "Sid": "DenyInsecureTransport",
  "Effect": "Deny",
  "Principal": "*",
  "Action": "s3:*",
  "Resource": ["arn:aws:s3:::bkt", "arn:aws:s3:::bkt/*"],
  "Condition": { "Bool": { "aws:SecureTransport": "false" } }
}</pre>
<p><strong>Presigned URL discipline:</strong></p>
<ul>
<li><strong>Short expiry</strong> — minutes for uploads, and remember the URL cannot outlive the credentials that signed it (a role session caps it at ~1 hour).</li>
<li><strong>Scope to one key and one method</strong> — a presigned PUT for <code>uploads/{userId}/{uuid}</code>, never a wildcard.</li>
<li><strong>Constrain the upload</strong> with a presigned POST policy: content-length range and content-type, so a user cannot upload 5 GB of anything.</li>
<li><strong>Validate after upload</strong> via an S3 event — never trust the client-declared content type.</li>
</ul>
<p><strong>Defence in depth to have an answer for:</strong> default encryption (SSE-S3 or SSE-KMS), versioning plus MFA delete or Object Lock for ransomware resistance, server access logging or CloudTrail data events for audit, and IAM Access Analyzer to detect any bucket reachable from outside the account.</p>
<div class="key-point">If you say one thing about S3 security, say this: <em>"Block Public Access at the account level, ACLs disabled, and CloudFront with OAC for anything public — so the bucket is never itself public, no matter what someone changes later."</em></div>`,
      },
      {
        q: 'EBS vs EFS vs S3 vs instance store — which storage for which job?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>These are four different storage models and the choice follows the access pattern. <strong>EBS</strong> is a network-attached block device: it looks like a disk, is zonal, and attaches to one instance at a time (Multi-Attach exists but is a niche clustered-filesystem feature) — it is what you put a database or an OS on. <strong>EFS</strong> is a managed NFS filesystem: multiple instances across AZs mount it simultaneously, which is exactly what you need for shared uploads or legacy applications that expect a POSIX path, at meaningfully higher cost and latency than EBS. <strong>S3</strong> is object storage reached over HTTP — effectively unlimited, cheapest by far, and the right home for uploads, backups, static assets and data-lake files, but it is not a filesystem and you should not pretend it is with a FUSE mount. <strong>Instance store</strong> is physically attached NVMe: by far the fastest and included in the instance price, but the data is gone when the instance stops, so it is only for caches, scratch space and replicated shards. The senior instinct is to push data toward S3 whenever the application can be changed to speak object storage, because the cost and durability differences are an order of magnitude.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây là bốn mô hình lưu trữ khác nhau, và cách chọn phụ thuộc vào kiểu truy cập. <strong>EBS</strong> là thiết bị khối gắn qua mạng: nhìn như một ổ đĩa, thuộc về một AZ, và tại một thời điểm chỉ gắn được vào một instance (có Multi-Attach nhưng đó là tính năng hẹp dành cho hệ thống file dạng cluster) — đây là chỗ bạn đặt database hoặc hệ điều hành. <strong>EFS</strong> là hệ thống file NFS dạng managed: nhiều instance ở nhiều AZ mount cùng lúc được, đúng thứ bạn cần cho thư mục upload dùng chung hoặc cho ứng dụng cũ vốn đòi một đường dẫn POSIX — đổi lại chi phí và độ trễ cao hơn EBS đáng kể. <strong>S3</strong> là kho đối tượng truy cập qua HTTP — dung lượng gần như vô hạn, rẻ hơn hẳn, và là chỗ đúng cho file người dùng tải lên, bản sao lưu, tài nguyên tĩnh và dữ liệu của data lake; nhưng nó không phải hệ thống file, và đừng cố giả vờ nó là hệ thống file bằng cách mount FUSE. <strong>Instance store</strong> là ổ NVMe gắn thẳng vào máy: nhanh nhất trong tất cả và đã nằm trong giá thuê instance, nhưng dữ liệu bay sạch khi instance dừng — nên nó chỉ dùng cho cache, vùng nháp và các shard đã có bản sao nơi khác. Bản năng của một senior là đẩy dữ liệu về phía S3 bất cứ khi nào ứng dụng còn có thể sửa để nói chuyện với kho đối tượng, bởi khác biệt về chi phí và độ bền lên tới cả một bậc độ lớn.</p></details>
<table>
<tr><th></th><th>EBS</th><th>EFS</th><th>S3</th><th>Instance store</th></tr>
<tr><td>Model</td><td>Block</td><td>File (NFS)</td><td>Object (HTTP)</td><td>Block, local</td></tr>
<tr><td>Attach</td><td>1 instance, 1 AZ</td><td>Many instances, many AZs</td><td>Anything, anywhere</td><td>1 instance, ephemeral</td></tr>
<tr><td>Latency</td><td>Sub-ms (gp3/io2)</td><td>Low ms</td><td>Tens of ms</td><td>Lowest (µs)</td></tr>
<tr><td>Durability</td><td>Replicated in AZ; snapshot to S3</td><td>Multi-AZ</td><td>11 nines, multi-AZ</td><td><strong>None</strong> — lost on stop</td></tr>
<tr><td>Relative cost/GB</td><td>Medium</td><td>High</td><td>Lowest</td><td>Included</td></tr>
<tr><td>Use for</td><td>Databases, OS volumes</td><td>Shared app files, legacy POSIX apps, EKS RWX volumes</td><td>Uploads, backups, static assets, data lake</td><td>Cache, scratch, temp shards</td></tr>
</table>
<p><strong>EBS volume types, briefly:</strong> <code>gp3</code> is the default — you provision IOPS and throughput independently of size, which makes it cheaper than the old <code>gp2</code> for almost every workload; <code>io2 Block Express</code> is for databases needing very high sustained IOPS and higher durability; <code>st1/sc1</code> are throughput-optimised HDDs for large sequential scans and logs.</p>
<p><strong>Traps to mention:</strong> EBS snapshots are incremental but a restored volume is lazily loaded, so first-touch reads are slow unless you enable fast snapshot restore; EFS in Bursting mode accumulates credits and can throttle badly under sustained load (use Elastic throughput); and mounting S3 as a filesystem gives you neither POSIX semantics nor good performance — redesign to use the SDK instead.</p>
<div class="key-point">Quick heuristic: <em>block for one writer, file for many writers needing POSIX, object for everything else — and everything else is usually most of the data.</em></div>`,
      },
      // ──── 6. DATABASES ────
      {
        q: 'RDS Multi-AZ vs read replicas — what does each actually give you?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>These solve different problems and are constantly confused. <strong>Multi-AZ</strong> is availability: AWS keeps a synchronous standby in another AZ that you cannot read from and cannot see, and on failure it flips the DNS endpoint to the standby, typically within a minute or two. Because replication is synchronous, there is no data loss, but you get zero extra read capacity — you are paying for a hot spare. <strong>Read replicas</strong> are scalability: asynchronous copies you can query, optionally in another Region, which means they lag by some amount and can be promoted manually but do not fail over automatically. So the correct answer to "our database is slow" is a read replica, and the correct answer to "what if the AZ dies" is Multi-AZ, and a serious production system usually wants both. Worth knowing too: the newer <em>Multi-AZ DB cluster</em> deployment gives two <em>readable</em> standbys and much faster failover, which blurs the line, and Aurora replaces this whole model with a shared storage layer where replicas are readable and failover is seconds.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hai thứ này giải quyết hai bài toán khác nhau nhưng lại bị nhầm lẫn suốt. <strong>Multi-AZ</strong> là chuyện sẵn sàng: AWS giữ một bản standby đồng bộ ở AZ khác mà bạn không đọc được và cũng không nhìn thấy; khi có sự cố, nó trỏ DNS endpoint sang bản standby đó, thường trong khoảng một tới hai phút. Vì sao chép là đồng bộ nên không mất dữ liệu, nhưng bạn cũng chẳng có thêm chút năng lực đọc nào — bạn đang trả tiền cho một bản dự phòng nằm chờ. <strong>Read replica</strong> là chuyện mở rộng: đó là các bản sao bất đồng bộ mà bạn truy vấn được, thậm chí đặt ở region khác, nên chúng luôn trễ một chút, có thể được nâng lên làm primary bằng tay nhưng không tự động chuyển đổi khi hỏng. Vậy nên câu trả lời đúng cho "database chậm quá" là read replica, còn câu trả lời đúng cho "lỡ AZ đó chết thì sao" là Multi-AZ — và một hệ thống production nghiêm túc thường cần cả hai. Cũng nên biết thêm: kiểu triển khai mới <em>Multi-AZ DB cluster</em> cho bạn hai bản standby <em>đọc được</em> và chuyển đổi nhanh hơn nhiều, làm mờ ranh giới giữa hai khái niệm; còn Aurora thì thay hẳn mô hình này bằng một tầng lưu trữ dùng chung, ở đó replica đọc được và thời gian failover chỉ tính bằng giây.</p></details>
<table>
<tr><th></th><th>Multi-AZ (standby)</th><th>Read replica</th></tr>
<tr><td>Purpose</td><td>High availability / DR</td><td>Read scaling</td></tr>
<tr><td>Replication</td><td>Synchronous</td><td>Asynchronous (lag)</td></tr>
<tr><td>Readable?</td><td>❌ (classic Multi-AZ)</td><td>✅</td></tr>
<tr><td>Automatic failover</td><td>✅ (~60-120 s)</td><td>❌ (manual promotion)</td></tr>
<tr><td>Cross-Region</td><td>❌</td><td>✅</td></tr>
<tr><td>Data loss on failure</td><td>None</td><td>Possible (whatever had not replicated)</td></tr>
</table>
<p><strong>Application consequences of read replicas:</strong></p>
<pre>Write → primary            ┐
Read  → replica (lagging)  ┘  → read-your-own-writes breaks

Fixes:
  • route reads that follow a write to the primary for N seconds
  • session/sticky consistency per user
  • optimistic UI update, reconcile later
  • monitor ReplicaLag and alarm on it — lag grows silently under write bursts</pre>
<p><strong>Failover behaviour to design for:</strong> the endpoint stays the same but the IP changes, so a connection pool that caches DNS forever will keep talking to a dead host — set a short JVM/driver DNS TTL, and make sure the application reconnects rather than serving errors for ten minutes. Failover also happens during maintenance windows and instance resizes, so "the database briefly disappears" is a normal event you must handle, not an incident.</p>
<div class="key-point">One-liner that lands: <em>"Multi-AZ buys availability and costs you a duplicate instance; read replicas buy read throughput and cost you consistency. They are not alternatives — most production systems need both."</em></div>`,
      },
      {
        q: 'Aurora vs standard RDS — what is actually different, and when is Aurora worth it?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Aurora keeps the MySQL and PostgreSQL wire protocols but replaces the storage engine with a distributed layer that spreads six copies of your data across three AZs and pushes redo logging into storage. The consequences are architectural rather than cosmetic: replicas share the same storage instead of replaying a log, so replica lag is typically tens of milliseconds and adding a reader takes minutes with no data copy; failover is usually under 30 seconds; storage grows automatically to 128 TB; and backups and point-in-time restore are continuous rather than snapshot-based. Aurora <strong>Serverless v2</strong> then scales capacity in fine-grained increments, which is genuinely useful for spiky or unpredictable workloads. The trade-off is cost — Aurora's instances are pricier and you pay per million I/O requests unless you use the I/O-Optimized configuration — plus vendor lock-in and slightly lagging support for the newest engine versions. So Aurora earns its keep for read-heavy production workloads that need fast failover and many replicas; a small internal database on RDS PostgreSQL is fine and cheaper.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Aurora vẫn giữ nguyên giao thức của MySQL và PostgreSQL, nhưng thay hẳn tầng lưu trữ bên dưới bằng một lớp phân tán: dữ liệu được giữ sáu bản trải trên ba AZ, và phần ghi redo log được đẩy xuống chính tầng lưu trữ. Hệ quả là những khác biệt mang tính kiến trúc chứ không phải trang trí: các replica dùng chung một kho lưu trữ thay vì phải phát lại log, nên độ trễ replica thường chỉ vài chục mili-giây và thêm một replica chỉ mất vài phút mà không phải sao chép dữ liệu; failover thường dưới 30 giây; dung lượng tự lớn dần tới 128 TB; còn sao lưu và khôi phục về thời điểm bất kỳ thì diễn ra liên tục chứ không dựa vào snapshot. Bản <strong>Serverless v2</strong> còn co giãn công suất theo từng nấc nhỏ, rất hữu ích cho các workload giật cục hoặc khó đoán. Đánh đổi nằm ở chi phí — instance của Aurora đắt hơn, và bạn còn trả tiền theo mỗi triệu lượt I/O trừ khi dùng cấu hình I/O-Optimized — cộng thêm chuyện bị trói vào AWS và việc hỗ trợ các phiên bản engine mới nhất thường chậm hơn đôi chút. Vì vậy Aurora xứng đáng với các hệ production đọc nhiều, cần failover nhanh và cần nhiều replica; còn một database nội bộ nhỏ thì cứ RDS PostgreSQL là ổn và rẻ hơn.</p></details>
<pre>Standard RDS                        Aurora
┌──────────┐                        ┌──────────┐  ┌────────┐  ┌────────┐
│ primary  │──async log──►replica   │ writer   │  │ reader │  │ reader │
│ + EBS    │                        └────┬─────┘  └───┬────┘  └───┬────┘
└──────────┘                             └───────────┼───────────┘
                                          shared distributed storage
                                       6 copies across 3 AZs, self-healing</pre>
<table>
<tr><th></th><th>RDS</th><th>Aurora</th></tr>
<tr><td>Replica lag</td><td>Seconds (async)</td><td>Typically &lt; 100 ms</td></tr>
<tr><td>Failover</td><td>60-120 s</td><td>Usually &lt; 30 s</td></tr>
<tr><td>Read replicas</td><td>Up to 5, each copies data</td><td>Up to 15, share storage</td></tr>
<tr><td>Storage</td><td>Provisioned, resize manually</td><td>Auto-grows to 128 TB</td></tr>
<tr><td>Backup</td><td>Snapshots + logs</td><td>Continuous to S3, PITR</td></tr>
<tr><td>Cost</td><td>Lower baseline</td><td>~20% higher instances + I/O charges</td></tr>
</table>
<p><strong>Aurora-specific features worth naming:</strong> the <strong>reader endpoint</strong> load-balances across replicas automatically; <strong>Global Database</strong> replicates to other Regions with roughly one-second lag and sub-minute promotion for DR; <strong>fast cloning</strong> creates a copy-on-write clone of a production database in minutes for testing; and <strong>Serverless v2</strong> scales in 0.5-ACU increments without dropping connections.</p>
<div class="key-point">Cost nuance a senior should raise unprompted: standard Aurora bills per I/O request, so a very I/O-heavy workload can cost far more than expected — <em>Aurora I/O-Optimized</em> removes that charge for a higher fixed price, and above roughly 25% of the bill being I/O it is the cheaper option.</div>`,
      },
      {
        q: 'DynamoDB data modelling: partition keys, hot partitions, GSI vs LSI, single-table design.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>DynamoDB is not a relational database with a different syntax — you model for the access patterns first and the entities second, because there are no joins and every query must be satisfiable by a key. The <strong>partition key</strong> determines which physical partition an item lands on, so it must have high cardinality and even access distribution; a low-cardinality key like a status field, or a key like "today's date" that concentrates all writes on one value, produces a <strong>hot partition</strong> that throttles regardless of how much capacity the table has. The <strong>sort key</strong> is what turns a key-value store into something queryable: composite sort keys let one query fetch a parent and its children, or a range of time. A <strong>GSI</strong> gives you a completely different partition and sort key, is eventually consistent, and has its own capacity — while an <strong>LSI</strong> shares the partition key, must be created with the table, and imposes a 10 GB limit per partition key. <strong>Single-table design</strong> follows from all this: overloaded generic keys let one table serve many access patterns in one round trip, at the price of a schema that is unreadable without documentation.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>DynamoDB không phải là database quan hệ đổi cú pháp — ở đây bạn phải mô hình hóa theo các mẫu truy vấn trước, rồi mới tới thực thể, bởi vì không có join và mọi truy vấn đều phải trả lời được bằng khóa. <strong>Partition key</strong> quyết định item nằm ở phân vùng vật lý nào, nên nó phải có độ đa dạng cao và lượng truy cập rải đều; một khóa ít giá trị như trường trạng thái, hay một khóa kiểu "ngày hôm nay" khiến toàn bộ lệnh ghi dồn vào một giá trị, sẽ tạo ra <strong>hot partition</strong> và bị throttle bất kể bạn cấp cho bảng bao nhiêu capacity đi nữa. <strong>Sort key</strong> chính là thứ biến một kho key-value thành thứ truy vấn được: sort key ghép nhiều thành phần cho phép một câu query lấy về cả bản ghi cha lẫn các bản ghi con, hoặc lấy trọn một khoảng thời gian. <strong>GSI</strong> cho bạn một cặp partition key và sort key hoàn toàn khác, chỉ nhất quán cuối cùng, và có capacity riêng; còn <strong>LSI</strong> thì dùng chung partition key, bắt buộc phải tạo cùng lúc với bảng, và áp giới hạn 10 GB cho mỗi giá trị partition key. <strong>Single-table design</strong> chính là hệ quả của tất cả những điều trên: dùng các khóa chung chung được "gán nhiều nghĩa" để một bảng phục vụ nhiều mẫu truy vấn chỉ trong một lượt đi về — đổi lại là một schema mà không đọc tài liệu thì chẳng ai hiểu nổi.</p></details>
<pre>Access patterns first, schema second:
  1. get user by id
  2. list a user's orders, newest first
  3. get order + its line items in one query
  4. find all orders with status = SHIPPED   ← needs a GSI

Single-table encoding
  PK              SK                    type      ...
  USER#123        PROFILE               User
  USER#123        ORDER#2026-03-01#900  Order     GSI1PK=STATUS#SHIPPED
  ORDER#900       ITEM#1                LineItem
  ORDER#900       ITEM#2                LineItem

  Query(PK=USER#123, SK begins_with ORDER#)  → pattern 2, one call
  Query(PK=ORDER#900)                        → pattern 3, one call</pre>
<table>
<tr><th></th><th>GSI</th><th>LSI</th></tr>
<tr><td>Partition key</td><td>Any attribute</td><td>Same as table</td></tr>
<tr><td>Created</td><td>Any time</td><td>Only at table creation</td></tr>
<tr><td>Consistency</td><td>Eventual only</td><td>Strong available</td></tr>
<tr><td>Capacity</td><td>Its own</td><td>Shares the table's</td></tr>
<tr><td>Limit</td><td>20 per table</td><td>5, and 10 GB per partition key</td></tr>
</table>
<p><strong>Hot partition fixes:</strong> add a random or calculated suffix to spread writes (write sharding), e.g. <code>DATE#2026-03-01#7</code> with 10 shards read in parallel; use a naturally high-cardinality key such as user or order id; and remember that adaptive capacity absorbs mild imbalance automatically but cannot save a genuinely single-valued key.</p>
<div class="key-point">The framing that signals real DynamoDB experience: <em>"I write down the access patterns before the schema, because in DynamoDB an access pattern you forgot is a table migration, not a new query."</em> And avoid Scan in production — it reads the whole table and bills you for it.</div>`,
      },
      {
        q: 'DynamoDB operations: capacity modes, consistency, transactions, streams and TTL.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Capacity comes in two modes: <strong>on-demand</strong>, which requires no forecasting and is the right default for spiky or unknown traffic, and <strong>provisioned</strong>, which is substantially cheaper at steady predictable load and can be combined with auto scaling — the crossover is usually around a consistently high utilisation, so measure before choosing. Reads default to <strong>eventually consistent</strong> and cost half of a strongly consistent read; strongly consistent reads are available on the table but never on a GSI, which is a design constraint people discover late. DynamoDB does support <strong>ACID transactions</strong> across up to 100 items via TransactWriteItems, at double the write cost, and it supports optimistic concurrency far more cheaply through <strong>condition expressions</strong> — which is also how you implement idempotency, by making the write conditional on the item not already existing. <strong>Streams</strong> emit an ordered, per-partition-key change log that Lambda can consume, which is the mechanism behind change data capture, materialised views and the outbox pattern on DynamoDB, and <strong>TTL</strong> deletes expired items for free, though asynchronously — so it is a cleanup mechanism, not a precise scheduler.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Capacity có hai chế độ: <strong>on-demand</strong> không đòi bạn dự báo gì cả và là lựa chọn mặc định đúng cho lưu lượng giật cục hoặc chưa rõ hình dạng; còn <strong>provisioned</strong> rẻ hơn đáng kể khi tải đều và đoán trước được, lại có thể ghép với auto scaling — điểm giao nhau thường rơi vào vùng sử dụng cao và ổn định, nên hãy đo trước rồi hãy chọn. Lệnh đọc mặc định là <strong>nhất quán cuối cùng</strong> và chỉ tốn một nửa so với đọc nhất quán mạnh; đọc nhất quán mạnh thì dùng được trên bảng nhưng không bao giờ dùng được trên GSI — đây là một ràng buộc thiết kế mà nhiều người phát hiện ra khá muộn. DynamoDB có hỗ trợ <strong>transaction ACID</strong> trên tối đa 100 item thông qua TransactWriteItems, với chi phí ghi gấp đôi; và nó còn hỗ trợ khóa lạc quan theo cách rẻ hơn nhiều nhờ <strong>condition expression</strong> — đây cũng chính là cách để cài đặt idempotency, bằng việc chỉ cho ghi khi item chưa tồn tại. <strong>Streams</strong> phát ra một dòng thay đổi có thứ tự theo từng partition key mà Lambda có thể tiêu thụ; đây là nền tảng cho change data capture, cho các read model dựng sẵn và cho pattern outbox trên DynamoDB. Còn <strong>TTL</strong> thì xóa các item hết hạn miễn phí, nhưng chạy bất đồng bộ — nên hãy coi nó là cơ chế dọn dẹp, đừng coi là một bộ hẹn giờ chính xác.</p></details>
<table>
<tr><th>Concern</th><th>Mechanism</th><th>Cost note</th></tr>
<tr><td>Unpredictable traffic</td><td>On-demand capacity</td><td>~5-7× per-request price of provisioned</td></tr>
<tr><td>Steady traffic</td><td>Provisioned + auto scaling</td><td>Cheapest above ~15-20% sustained utilisation</td></tr>
<tr><td>Read cost</td><td>Eventually consistent</td><td>0.5 RCU vs 1 RCU strongly consistent</td></tr>
<tr><td>All-or-nothing writes</td><td>TransactWriteItems (≤100 items)</td><td>2× write units</td></tr>
<tr><td>Optimistic locking / idempotency</td><td>ConditionExpression</td><td>Free — no extra units</td></tr>
<tr><td>Change capture</td><td>Streams → Lambda</td><td>Ordered per partition key, 24 h retention</td></tr>
<tr><td>Expiry</td><td>TTL attribute</td><td>Free deletes, but can lag by hours</td></tr>
</table>
<p><strong>Idempotent write with a condition expression:</strong></p>
<pre>PutItem
  Item:      { PK: "PAYMENT#abc", amount: 100, status: "CHARGED" }
  Condition: attribute_not_exists(PK)

→ first call succeeds; every retry fails with
  ConditionalCheckFailedException, which the caller treats as
  "already done" — exactly-once effect over at-least-once delivery.</pre>
<p><strong>Operational features to have opinions on:</strong> <strong>DAX</strong> is an in-front microsecond cache for read-heavy workloads but only helps eventually-consistent reads; <strong>Global Tables</strong> give multi-Region active-active with last-writer-wins conflict resolution, which is fine for profiles and wrong for counters; and <strong>PITR</strong> gives 35 days of point-in-time restore and should simply always be on for production tables.</p>
<div class="key-point">Two DynamoDB facts that separate real users from readers of the docs: GSIs are <em>never</em> strongly consistent, and a conditional write is the cheapest concurrency primitive on AWS — no transaction, no lock, no extra capacity.</div>`,
      },
      {
        q: 'When do you pick DynamoDB over RDS/Aurora on AWS?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The deciding factor is whether your access patterns are known and stable, not whether your data is "relational" — almost all data is relational in some sense. Choose <strong>DynamoDB</strong> when you can enumerate the queries up front, when you need single-digit-millisecond latency at effectively unlimited scale, when traffic is spiky enough that on-demand capacity is attractive, or when you want an operationally invisible database with no connection pool, no version upgrades and no vacuuming. Choose <strong>RDS or Aurora</strong> when queries are ad hoc or will evolve, when you need joins, aggregations, secondary indexes on many columns, or real transactional integrity across many rows, and when analysts or internal tools need to run SQL you did not anticipate. The failure mode to warn against is picking DynamoDB for a domain with rich, changing query needs and then discovering that each new report requires either a new GSI, a full table scan, or a pipeline into another store — at which point you have the operational cost of NoSQL and the modelling constraints without the benefit.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Yếu tố quyết định là các mẫu truy vấn của bạn đã rõ và ổn định hay chưa, chứ không phải chuyện dữ liệu có "quan hệ" hay không — vì gần như dữ liệu nào cũng có tính quan hệ ở một mức nào đó. Hãy chọn <strong>DynamoDB</strong> khi bạn liệt kê được trước toàn bộ các câu truy vấn, khi cần độ trễ một chữ số mili-giây ở quy mô gần như không giới hạn, khi lưu lượng giật cục đủ mạnh để chế độ on-demand trở nên hấp dẫn, hoặc khi bạn muốn một database "vô hình" về mặt vận hành — không connection pool, không nâng cấp phiên bản, không phải chạy vacuum. Hãy chọn <strong>RDS hay Aurora</strong> khi các truy vấn còn tùy hứng hoặc chắc chắn sẽ thay đổi, khi bạn cần join, cần tổng hợp, cần index phụ trên nhiều cột, hoặc cần tính toàn vẹn giao dịch thật sự trên nhiều dòng dữ liệu — và cả khi đội phân tích hay các công cụ nội bộ cần chạy những câu SQL mà bạn không lường trước. Kiểu thất bại cần cảnh báo là chọn DynamoDB cho một nghiệp vụ có nhu cầu truy vấn phong phú và hay đổi, rồi phát hiện ra mỗi báo cáo mới lại đòi thêm một GSI, một lần quét toàn bảng, hoặc một pipeline đổ sang kho khác — lúc đó bạn lãnh đủ chi phí vận hành của NoSQL cùng mọi ràng buộc mô hình hóa, mà chẳng hưởng được lợi ích nào.</p></details>
<table>
<tr><th>Signal</th><th>Points to</th></tr>
<tr><td>Access patterns known and few</td><td>DynamoDB</td></tr>
<tr><td>Ad hoc queries, reporting, evolving requirements</td><td>RDS / Aurora</td></tr>
<tr><td>Needs joins or multi-row aggregation</td><td>RDS / Aurora</td></tr>
<tr><td>Unbounded scale, predictable latency at any size</td><td>DynamoDB</td></tr>
<tr><td>Very spiky traffic / scale to near zero</td><td>DynamoDB on-demand (or Aurora Serverless v2)</td></tr>
<tr><td>Serverless app with thousands of concurrent Lambdas</td><td>DynamoDB (no connection pool problem)</td></tr>
<tr><td>Strong multi-entity transactional integrity</td><td>RDS / Aurora</td></tr>
</table>
<p><strong>The pragmatic answer most systems land on:</strong> Aurora or RDS as the system of record because requirements change, DynamoDB for the specific high-volume, well-understood pieces — sessions, idempotency keys, event/audit logs, feature flags, shopping carts, rate-limit counters — and S3 plus Athena for anything analytical. Using the right store per access pattern is normal; forcing one store to do everything is what causes pain.</p>
<p><strong>Connection pooling nuance:</strong> a fleet of Lambdas talking to RDS exhausts connections quickly, which is why RDS Proxy exists. DynamoDB has no such problem because it is an HTTPS API with no persistent connections — a genuine architectural reason to choose it in serverless designs, independent of data shape.</p>
<div class="key-point">The mature line: <em>"DynamoDB is a fantastic database when you know the questions in advance. If the questions are still changing, a relational database is cheaper — not in dollars, in engineering time."</em></div>`,
      },
      {
        q: 'How do you use ElastiCache well, and what breaks when you add caching on AWS?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>ElastiCache gives you managed Redis or Memcached inside your VPC, and in practice Redis is the default because it supports replication, persistence, cluster mode and useful data structures like sorted sets and streams. The pattern almost everyone should start with is <strong>cache-aside</strong> with a modest TTL: read from cache, fall through to the database on a miss, populate, and let the TTL bound staleness. What breaks is rarely the cache itself — it is the failure behaviour around it. A cold or failed cache sends full traffic to the database, so the database must be able to survive a cache outage or you have simply moved your single point of failure; a popular key expiring under load triggers a stampede that a single-flight lock or a jittered TTL prevents; and writes that update the database without invalidating the cache serve stale data indefinitely. Operationally, the things that actually page you are memory pressure with the wrong eviction policy, a Multi-AZ failover that drops every connection at once, and clients that do not use cluster-aware libraries.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>ElastiCache cho bạn một Redis hoặc Memcached dạng managed nằm ngay trong VPC, và trên thực tế Redis là lựa chọn mặc định vì nó hỗ trợ nhân bản, lưu xuống đĩa, chế độ cluster cùng các cấu trúc dữ liệu hữu ích như sorted set và stream. Mẫu mà gần như ai cũng nên bắt đầu là <strong>cache-aside</strong> với TTL vừa phải: đọc từ cache trước, trượt thì rơi xuống database, nạp lại vào cache, rồi để TTL giới hạn mức độ cũ của dữ liệu. Thứ hay hỏng thường không phải bản thân cache, mà là cách hệ thống cư xử quanh nó khi có sự cố. Cache nguội hoặc cache chết sẽ dội toàn bộ lưu lượng xuống database, nên database buộc phải sống nổi khi cache sập — nếu không thì bạn chỉ vừa dời điểm chết duy nhất sang chỗ khác mà thôi. Một key phổ biến hết hạn giữa lúc tải cao sẽ gây ra cơn bão dồn xuống database, và cách chặn là dùng khóa cho đúng một request đi tính lại hoặc rắc thêm jitter vào TTL. Còn những lệnh ghi chỉ cập nhật database mà quên xóa cache thì sẽ phục vụ dữ liệu cũ vô thời hạn. Về mặt vận hành, những thứ thật sự làm bạn bị gọi lúc nửa đêm là: bộ nhớ đầy mà chính sách eviction đặt sai, một lần failover Multi-AZ làm đứt sạch mọi kết nối cùng lúc, và client không dùng thư viện hiểu được chế độ cluster.</p></details>
<pre>Cache-aside (start here)
  value = redis.get(key)
  if (value == null) {
      value = db.query(...)
      redis.setex(key, ttlWithJitter(300), value)   ← jitter avoids
  }                                                    synchronised expiry
  return value

Write path
  db.update(...)
  redis.del(key)        ← invalidate, don't update: simpler and safer</pre>
<table>
<tr><th>Problem</th><th>Symptom</th><th>Fix</th></tr>
<tr><td><strong>Stampede</strong></td><td>Hot key expires, hundreds of DB queries at once</td><td>Single-flight lock, serve stale while refreshing, jittered TTL</td></tr>
<tr><td><strong>Penetration</strong></td><td>Repeated lookups of keys that do not exist</td><td>Cache the negative result briefly, or a Bloom filter</td></tr>
<tr><td><strong>Avalanche</strong></td><td>Cache node dies, DB collapses</td><td>Multi-AZ with replicas, DB capacity headroom, circuit breaker</td></tr>
<tr><td><strong>Stale data</strong></td><td>Users see old values after a write</td><td>Invalidate on write; keep TTLs short for volatile data</td></tr>
</table>
<p><strong>AWS-specific operational points:</strong> enable <strong>Multi-AZ with automatic failover</strong> and expect a connection reset when it happens — the client must reconnect cleanly; watch <code>Evictions</code>, <code>DatabaseMemoryUsagePercentage</code> and <code>CPUUtilization</code> and set <code>maxmemory-policy</code> to <code>allkeys-lru</code> for a pure cache rather than the default <code>noeviction</code>, which starts rejecting writes when full; use <strong>cluster mode</strong> for sharding beyond one node's memory and make sure the client library understands slot redirection; and keep the cache in private subnets with a security group that only the application can reach — an internet-exposed Redis is a well-known breach vector.</p>
<div class="key-point">The senior instinct: <em>"design so the system degrades when the cache disappears rather than falls over — if the database cannot survive a cold cache, the cache is not an optimisation, it is a dependency."</em></div>`,
      },
      // ──── 7. MESSAGING & EVENTS ────
      {
        q: 'SQS in depth: standard vs FIFO, visibility timeout, long polling, DLQ.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p><strong>Standard</strong> queues give nearly unlimited throughput with at-least-once delivery and best-effort ordering, while <strong>FIFO</strong> queues guarantee exact ordering within a message group and exactly-once processing, at a much lower throughput ceiling — so you pick FIFO only when ordering is a real requirement, and you use the message group id to keep parallelism. The mechanic that causes most production bugs is the <strong>visibility timeout</strong>: receiving a message does not delete it, it hides it for a period, and if your consumer has not deleted it by then the message reappears and is processed again. That means the timeout must exceed your worst-case processing time, or you get silent duplicate work — and for long jobs you extend the timeout with a heartbeat rather than setting a huge fixed value. <strong>Long polling</strong> should always be on: it cuts empty receives, reduces cost and lowers latency. Finally, every queue needs a <strong>dead-letter queue</strong> with a sensible maxReceiveCount, because without one a permanently failing message — a poison pill — is retried forever and can consume your entire consumer capacity.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Queue <strong>standard</strong> cho throughput gần như không giới hạn, giao ít nhất một lần và chỉ cố gắng giữ thứ tự ở mức tương đối; còn queue <strong>FIFO</strong> bảo đảm thứ tự chính xác trong từng nhóm message và xử lý đúng một lần, nhưng trần throughput thấp hơn nhiều — nên chỉ chọn FIFO khi thứ tự thật sự là yêu cầu, và hãy dùng message group id để vẫn giữ được khả năng xử lý song song. Cơ chế gây ra nhiều lỗi production nhất là <strong>visibility timeout</strong>: khi bạn nhận một message thì nó không hề bị xóa, nó chỉ được ẩn đi trong một khoảng thời gian; nếu hết khoảng đó mà consumer chưa xóa, message sẽ hiện lại và bị xử lý thêm lần nữa. Nghĩa là timeout phải dài hơn thời gian xử lý trong trường hợp tệ nhất, nếu không bạn sẽ âm thầm làm trùng công việc — và với các job chạy lâu thì hãy gia hạn timeout bằng nhịp heartbeat thay vì đặt đại một con số thật to. <strong>Long polling</strong> thì luôn nên bật: nó giảm số lần nhận rỗng, giảm chi phí và giảm cả độ trễ. Cuối cùng, mọi queue đều cần một <strong>dead-letter queue</strong> với maxReceiveCount hợp lý, bởi nếu không thì một message hỏng vĩnh viễn — kiểu "viên thuốc độc" — sẽ bị retry mãi mãi và có thể ngốn sạch năng lực xử lý của toàn bộ consumer.</p></details>
<table>
<tr><th></th><th>Standard</th><th>FIFO</th></tr>
<tr><td>Ordering</td><td>Best effort</td><td>Strict, per message group id</td></tr>
<tr><td>Delivery</td><td>At least once (duplicates possible)</td><td>Exactly once processing</td></tr>
<tr><td>Throughput</td><td>Effectively unlimited</td><td>300 msg/s (3,000 batched); high-throughput mode much higher</td></tr>
<tr><td>Dedup</td><td>—</td><td>5-minute dedup window by content hash or explicit id</td></tr>
<tr><td>Use for</td><td>Most work queues</td><td>Per-account/per-entity ordering, financial sequences</td></tr>
</table>
<p><strong>Visibility timeout — the bug in slow motion:</strong></p>
<pre>t=0    consumer receives message, visibility timeout = 30 s
t=30   still processing (the job takes 45 s)
t=30   SQS makes the message visible again
t=31   ANOTHER consumer picks it up → the work runs twice
t=45   first consumer calls DeleteMessage → succeeds, damage done

Fixes: set the timeout above p99 processing time,
       call ChangeMessageVisibility as a heartbeat for long jobs,
       and make the handler idempotent regardless.</pre>
<p><strong>Settings that should be deliberate on every queue:</strong></p>
<ul>
<li><strong>ReceiveMessageWaitTimeSeconds = 20</strong> (long polling) — fewer empty receives, lower cost, lower latency.</li>
<li><strong>maxReceiveCount 3-5 → DLQ</strong>, plus an alarm on <code>ApproximateNumberOfMessagesVisible</code> on the DLQ. A silent DLQ is a silent data-loss channel.</li>
<li><strong>Message retention</strong> up to 14 days — long enough to fix a bug and redrive.</li>
<li><strong>Batching</strong> (up to 10 messages) — the single biggest cost and throughput lever.</li>
<li><strong>Large payloads</strong> — the limit is 256 KB; put the body in S3 and send a pointer (the Extended Client Library does this for you).</li>
</ul>
<div class="key-point">The two sentences that show you have run SQS in production: <em>"the visibility timeout must exceed worst-case processing time, and the handler must be idempotent anyway"</em>, and <em>"every queue gets a DLQ with an alarm — otherwise poison messages either loop forever or disappear quietly."</em></div>`,
      },
      {
        q: 'SQS vs SNS vs EventBridge vs Kinesis vs MSK — which messaging service and why?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>They differ along two axes: point-to-point versus fan-out, and queue versus replayable log. <strong>SQS</strong> is a work queue — one message, one consumer, deleted when done — which is what you want for task distribution and load levelling. <strong>SNS</strong> is pub/sub fan-out: one publish, many subscribers, no storage and no replay, and the standard pattern is SNS fanning out into several SQS queues so each consumer gets durability and its own retry behaviour. <strong>EventBridge</strong> is the event bus with content-based routing rules, schema registry, third-party SaaS sources and scheduling — it is the right default for decoupling services by domain events, at a slightly higher latency than SNS. <strong>Kinesis Data Streams</strong> is an ordered, replayable log sharded by partition key, so it suits streaming analytics, clickstreams and anything where multiple consumers must read the same ordered history at their own pace. <strong>MSK</strong> is managed Kafka, which you choose when you genuinely need Kafka's ecosystem, longer retention or existing tooling, accepting more operational weight. The heuristic: task to do → SQS, notify many → SNS or EventBridge, ordered stream to reprocess → Kinesis or MSK.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Năm dịch vụ này khác nhau trên hai trục: một-đối-một hay phát tán ra nhiều nơi, và hàng đợi hay log phát lại được. <strong>SQS</strong> là hàng đợi công việc — một message, một consumer, xử lý xong thì xóa — đúng thứ bạn cần để chia việc và san đều tải. <strong>SNS</strong> là pub/sub phát tán: publish một lần, nhiều bên nhận, không lưu trữ và không phát lại được; mẫu chuẩn là SNS bắn ra nhiều queue SQS, để mỗi consumer có được tính bền vững và cơ chế retry riêng của mình. <strong>EventBridge</strong> là event bus có luật định tuyến theo nội dung, có schema registry, kết nối được nguồn SaaS bên ngoài và hẹn giờ được — đây là lựa chọn mặc định hợp lý để tách rời các service theo sự kiện nghiệp vụ, đổi lại độ trễ nhỉnh hơn SNS một chút. <strong>Kinesis Data Streams</strong> là một log có thứ tự, phát lại được, chia shard theo partition key — hợp cho phân tích dòng dữ liệu, cho clickstream và cho mọi trường hợp nhiều consumer cần đọc cùng một lịch sử có thứ tự theo nhịp riêng của mình. <strong>MSK</strong> là Kafka dạng managed, chọn nó khi bạn thật sự cần hệ sinh thái Kafka, cần giữ dữ liệu lâu hơn hoặc đã có sẵn công cụ, và chấp nhận gánh nặng vận hành lớn hơn. Nguyên tắc dễ nhớ: có việc cần làm → SQS; cần báo cho nhiều bên → SNS hoặc EventBridge; cần một dòng có thứ tự và xử lý lại được → Kinesis hoặc MSK.</p></details>
<table>
<tr><th></th><th>SQS</th><th>SNS</th><th>EventBridge</th><th>Kinesis</th><th>MSK</th></tr>
<tr><td>Model</td><td>Queue</td><td>Pub/sub</td><td>Event bus</td><td>Ordered log</td><td>Ordered log</td></tr>
<tr><td>Consumers per message</td><td>One</td><td>Many</td><td>Many (rules)</td><td>Many, independent</td><td>Many, independent</td></tr>
<tr><td>Replay</td><td>❌</td><td>❌</td><td>Archive + replay</td><td>✅ (retention)</td><td>✅ (retention)</td></tr>
<tr><td>Ordering</td><td>FIFO queues only</td><td>FIFO topics only</td><td>❌</td><td>Per shard</td><td>Per partition</td></tr>
<tr><td>Routing logic</td><td>—</td><td>Filter policies</td><td>Rich content rules</td><td>—</td><td>—</td></tr>
<tr><td>Ops burden</td><td>None</td><td>None</td><td>None</td><td>Shard management</td><td>Highest</td></tr>
</table>
<p><strong>The fan-out pattern you should be able to draw:</strong></p>
<pre>OrderPlaced
     │
   [SNS topic]  or  [EventBridge bus]
     ├──► SQS: email-queue      ──► Lambda (retries, DLQ)
     ├──► SQS: inventory-queue  ──► ECS worker
     └──► SQS: analytics-queue  ──► Firehose → S3

Why a queue behind the topic? Durability + per-consumer retry + DLQ.
Subscribing Lambda directly to SNS means a failure is retried
by SNS policy only, then dropped.</pre>
<p><strong>Choosing between the two "event" options:</strong> SNS is cheaper and lower latency with simple attribute-based filtering; EventBridge costs a bit more and adds tens of milliseconds but gives content-based rules on the whole payload, a schema registry, archive and replay, cross-account buses, SaaS partner sources and scheduled rules. For internal domain events at moderate volume, EventBridge; for very high-volume simple fan-out, SNS.</p>
<div class="key-point">The distinction interviewers probe: <em>"a queue deletes the message once it is handled; a log keeps it so any consumer can re-read history."</em> If someone might need to reprocess the last three days of events, you need Kinesis/MSK — not SQS.</div>`,
      },
      {
        q: 'How do you build reliable event processing on AWS? (idempotency, ordering, retries, poison messages)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Every AWS messaging service is at-least-once, so the only correct assumption is that every handler will occasionally run twice — which means <strong>idempotency is not optional, it is the design</strong>. The cheapest implementation is a DynamoDB item keyed by the message or business id written with a condition expression, so a duplicate fails the condition and is acknowledged without redoing the work. Ordering is the second constraint: you never get global ordering, so you scope it — a FIFO message group id or a Kinesis partition key per entity gives per-entity order while still processing different entities in parallel, and consumers should tolerate out-of-order arrival by carrying a version number and ignoring stale events. Retries need exponential backoff with jitter and a bounded attempt count, after which the message goes to a DLQ with an alarm and a documented redrive procedure — a poison message left looping will eventually consume all your consumer capacity. Finally, publishing must be atomic with the database write, which on AWS means the transactional outbox pattern or DynamoDB Streams, because a write that succeeds and an event that never publishes is the failure nobody notices until reconciliation.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mọi dịch vụ messaging của AWS đều giao ít nhất một lần, nên giả định đúng duy nhất là: sớm muộn gì mỗi handler cũng sẽ chạy hai lần — nghĩa là <strong>idempotency không phải tùy chọn, nó chính là thiết kế</strong>. Cách cài đặt rẻ nhất là một item DynamoDB lấy khóa theo message id hoặc theo id nghiệp vụ, ghi kèm condition expression; khi bản trùng ghi vào thì điều kiện không thỏa, và bạn chỉ việc báo đã nhận rồi bỏ qua chứ không làm lại công việc. Ràng buộc thứ hai là thứ tự: bạn không bao giờ có thứ tự toàn cục, nên hãy khoanh vùng nó lại — dùng message group id của FIFO hoặc partition key của Kinesis theo từng entity, như vậy vừa giữ đúng thứ tự trong từng entity vừa xử lý song song được các entity khác nhau; đồng thời consumer nên chịu được cảnh event đến sai thứ tự bằng cách mang theo số version và bỏ qua những event đã cũ. Phần retry thì cần exponential backoff kèm jitter và giới hạn số lần thử, sau đó đẩy message vào DLQ kèm cảnh báo và một quy trình xử lý lại được viết rõ ràng — một message hỏng cứ lặp mãi rồi sẽ ngốn sạch năng lực của consumer. Cuối cùng, việc phát event phải nguyên tử với lệnh ghi database, mà trên AWS nghĩa là dùng pattern transactional outbox hoặc DynamoDB Streams — bởi vì trường hợp ghi thành công nhưng event không bao giờ được phát chính là kiểu lỗi chẳng ai phát hiện ra, cho tới lúc đi đối soát.</p></details>
<pre>Idempotent consumer on AWS
  handler(event):
    try:
      dynamo.PutItem(
        Item      = { PK: "MSG#" + event.id, ttl: now + 7d, status: "DONE" },
        Condition = attribute_not_exists(PK))
    except ConditionalCheckFailed:
      return ACK          ← already processed, do nothing, delete message

    doTheWork(event)      ← the real side effect
    return ACK</pre>
<table>
<tr><th>Problem</th><th>AWS mechanism</th></tr>
<tr><td>Duplicate delivery</td><td>Conditional write on a dedup key (DynamoDB), or FIFO dedup id</td></tr>
<tr><td>Ordering per entity</td><td>SQS FIFO MessageGroupId / Kinesis partition key = entity id</td></tr>
<tr><td>Out-of-order arrival</td><td>Version/sequence number in the payload; drop stale updates</td></tr>
<tr><td>Transient failure</td><td>Backoff + jitter; Lambda event-source retry config; SQS redrive</td></tr>
<tr><td>Poison message</td><td>maxReceiveCount → DLQ, alarm on DLQ depth, documented redrive</td></tr>
<tr><td>DB write + publish atomicity</td><td>Outbox table + poller, or DynamoDB Streams → Lambda → bus</td></tr>
<tr><td>Blocked shard (Kinesis)</td><td>BisectBatchOnFunctionError, MaximumRetryAttempts, OnFailure destination</td></tr>
</table>
<p><strong>Lambda-specific reliability settings people forget:</strong> for SQS event sources use <code>ReportBatchItemFailures</code> so one bad record does not fail the whole batch; for Kinesis and DynamoDB Streams set <code>MaximumRetryAttempts</code> and a failure destination, otherwise a single failing record blocks its shard indefinitely; and set <code>MaximumConcurrency</code> on the SQS source so a queue backlog cannot consume the account's entire concurrency pool.</p>
<div class="key-point">The sentence to end on: <em>"exactly-once delivery does not exist — exactly-once <strong>effect</strong> does, and you get it by combining at-least-once delivery with an idempotent consumer. Everything else is bookkeeping around that."</em></div>`,
      },
      // ──── 8. OBSERVABILITY & OPERATIONS ────
      {
        q: 'How do you make a distributed AWS system observable? (CloudWatch, X-Ray, structured logs)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Observability on AWS is three data types with three different cost and query profiles. <strong>Metrics</strong> in CloudWatch are cheap to evaluate and are what alarms should run on; the trap is <strong>cardinality</strong>, because every unique dimension combination is a separate billed custom metric, so putting a user id or request id in a dimension produces a spectacular bill. <strong>Logs</strong> should be structured JSON with a correlation id on every line, because CloudWatch Logs Insights can query fields but not parse arbitrary prose, and retention should be set explicitly — the default of never-expire is one of the most common silent costs on AWS. <strong>Traces</strong> via X-Ray or OpenTelemetry are what make a request across API Gateway, three Lambdas and a queue comprehensible at all, and they must be sampled because tracing everything is unaffordable. The operational discipline that matters more than the tooling: alarm on symptoms users feel — error rate, p99 latency, queue age — not on causes like CPU, and make every alarm actionable, because an alarm nobody acts on trains the team to ignore the dashboard.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khả năng quan sát trên AWS gồm ba loại dữ liệu, với ba đặc tính chi phí và truy vấn khác hẳn nhau. <strong>Metric</strong> trong CloudWatch rất rẻ để đánh giá, và đây mới là thứ mà cảnh báo nên chạy trên đó; cái bẫy nằm ở <strong>độ đa dạng của nhãn</strong>: mỗi tổ hợp dimension duy nhất được tính là một custom metric riêng và bị tính tiền riêng, nên nhét user id hay request id vào dimension sẽ đẻ ra một hóa đơn kinh hoàng. <strong>Log</strong> thì nên là JSON có cấu trúc, kèm một correlation id trên từng dòng, bởi CloudWatch Logs Insights truy vấn được theo trường chứ không đọc hiểu được văn xuôi tùy hứng; và thời gian lưu log phải được đặt tường minh — để mặc định "giữ mãi mãi" là một trong những khoản chi âm thầm phổ biến nhất trên AWS. <strong>Trace</strong> qua X-Ray hoặc OpenTelemetry chính là thứ khiến một request đi xuyên API Gateway, ba Lambda và một hàng đợi trở nên hiểu được; và bắt buộc phải lấy mẫu, vì trace toàn bộ thì không kham nổi chi phí. Nhưng thứ quan trọng hơn cả công cụ là kỷ luật vận hành: hãy cảnh báo trên những triệu chứng mà người dùng cảm nhận được — tỷ lệ lỗi, độ trễ p99, tuổi message trong hàng đợi — chứ đừng cảnh báo trên nguyên nhân như CPU; và mọi cảnh báo đều phải kèm hành động cụ thể, bởi một cảnh báo mà chẳng ai làm gì sẽ dạy cả đội thói quen phớt lờ dashboard.</p></details>
<table>
<tr><th></th><th>Store</th><th>Use for</th><th>Cost driver</th></tr>
<tr><td><strong>Metrics</strong></td><td>CloudWatch Metrics</td><td>Alarms, dashboards, autoscaling</td><td>Custom metric count = cardinality</td></tr>
<tr><td><strong>Logs</strong></td><td>CloudWatch Logs (+ S3 archive)</td><td>Investigation, audit</td><td>Ingestion GB + retention</td></tr>
<tr><td><strong>Traces</strong></td><td>X-Ray / OTel → Jaeger</td><td>Latency attribution across services</td><td>Traces recorded → sample</td></tr>
</table>
<p><strong>Structured logging that actually helps at 3 a.m.:</strong></p>
<pre>{"level":"ERROR","ts":"2026-03-01T10:22:01Z","service":"checkout",
 "traceId":"1-65f0...","orderId":"900","userId":"123",
 "msg":"payment declined","provider":"stripe","code":"card_declined"}

Logs Insights:
  fields @timestamp, orderId, code
  | filter service = "checkout" and level = "ERROR"
  | stats count() by code</pre>
<p><strong>Alarms that are worth having:</strong></p>
<ul>
<li><strong>ALB 5xx rate and p99 target response time</strong> — what users experience.</li>
<li><strong>SQS ApproximateAgeOfOldestMessage</strong> — the single best signal that consumers are falling behind; queue <em>depth</em> alone is misleading.</li>
<li><strong>DLQ depth &gt; 0</strong> — always, on every DLQ.</li>
<li><strong>Lambda Throttles and Errors</strong>, and DynamoDB <code>ThrottledRequests</code>.</li>
<li><strong>Composite alarms</strong> to suppress the storm — one page saying "checkout is down", not forty saying "a metric moved".</li>
</ul>
<p><strong>Cost control:</strong> set log retention on every log group (30-90 days hot, then export to S3), use metric filters to turn log patterns into cheap metrics rather than querying logs from an alarm, sample traces at a few percent with a higher rate on errors, and use CloudWatch Contributor Insights instead of high-cardinality dimensions.</p>
<div class="key-point">The high-signal statement: <em>"alarms run on metrics because they are cheap to evaluate; logs and traces are for investigating after the alarm fires. And I never put unbounded identifiers into metric dimensions — that is how a monitoring bill overtakes a compute bill."</em></div>`,
      },
      // ──── 9. IaC & DEPLOYMENT ────
      {
        q: 'CloudFormation vs CDK vs Terraform — how do you choose, and how do you manage state safely?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>All three describe infrastructure as code; they differ in language, state ownership and blast radius. <strong>CloudFormation</strong> is AWS-native declarative YAML with state managed by AWS, so there is no state file to lose, and it supports drift detection and automatic rollback — but it is verbose and only covers AWS. <strong>CDK</strong> compiles a real programming language down to CloudFormation, which gives you loops, types, tests and reusable constructs, at the cost of a generated-template indirection that makes debugging harder and encourages abstractions that hide what is actually deployed. <strong>Terraform</strong> is multi-cloud, has a mature module ecosystem and a plan output people trust, but you own the state file, which must live in remote storage with locking or two engineers running apply concurrently will corrupt it. The choice usually follows the organisation rather than the technology: AWS-only shop with strong AWS skills → CDK; multi-cloud or existing Terraform expertise → Terraform. What matters far more than the tool is the discipline — no console changes, plan reviewed in a pull request, separate state per environment, and a pipeline rather than laptops running apply.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả ba đều mô tả hạ tầng bằng code; khác nhau ở ngôn ngữ, ở việc ai giữ state, và ở phạm vi thiệt hại khi có sự cố. <strong>CloudFormation</strong> là YAML khai báo do chính AWS làm, state cũng do AWS giữ nên chẳng có file state nào để mà làm mất, lại có sẵn phát hiện lệch cấu hình và tự động rollback — nhưng nó dài dòng và chỉ dùng được cho AWS. <strong>CDK</strong> biên dịch một ngôn ngữ lập trình thật xuống thành CloudFormation, nhờ đó bạn có vòng lặp, có kiểu dữ liệu, viết test được và tái sử dụng được các construct — đổi lại là một lớp gián tiếp qua template sinh tự động khiến việc gỡ lỗi khó hơn, và nó cũng dễ dụ người ta tạo ra những lớp trừu tượng che mất thứ đang thực sự được triển khai. <strong>Terraform</strong> thì đa cloud, có hệ sinh thái module trưởng thành và bản plan mà mọi người tin tưởng, nhưng bạn phải tự giữ file state — file này bắt buộc phải nằm ở kho lưu trữ từ xa có khóa, nếu không chỉ cần hai kỹ sư cùng chạy apply là hỏng state. Việc chọn thường phụ thuộc vào tổ chức hơn là công nghệ: công ty chỉ dùng AWS và mạnh về AWS thì chọn CDK; còn đa cloud hoặc đã sẵn kinh nghiệm Terraform thì chọn Terraform. Nhưng quan trọng hơn công cụ rất nhiều là kỷ luật: không sửa tay trên console, bản plan phải được review trong pull request, mỗi môi trường một state riêng, và việc apply phải do pipeline chạy chứ không phải máy cá nhân.</p></details>
<table>
<tr><th></th><th>CloudFormation</th><th>CDK</th><th>Terraform</th></tr>
<tr><td>Language</td><td>YAML/JSON</td><td>TypeScript/Python/Java/Go</td><td>HCL</td></tr>
<tr><td>State</td><td>Managed by AWS</td><td>Managed by AWS (via CFN)</td><td><strong>You own the state file</strong></td></tr>
<tr><td>Multi-cloud</td><td>❌</td><td>❌ (CDKTF exists)</td><td>✅</td></tr>
<tr><td>Rollback</td><td>Automatic</td><td>Automatic</td><td>Manual (re-apply)</td></tr>
<tr><td>Preview</td><td>Change sets</td><td>cdk diff</td><td>terraform plan</td></tr>
<tr><td>Main risk</td><td>Verbosity, slow stacks</td><td>Hidden complexity in constructs</td><td>State corruption / drift</td></tr>
</table>
<p><strong>Non-negotiable practices whichever you pick:</strong></p>
<ul>
<li><strong>Remote state with locking</strong> (Terraform: S3 + DynamoDB lock table, or Terraform Cloud). Never local state, never state in git — it contains secrets.</li>
<li><strong>Separate state/stack per environment</strong> and per blast-radius boundary. One stack containing the VPC, the database and the app means a trivial app change can propose to replace the database.</li>
<li><strong>Plan in the PR, apply from CI</strong> using an OIDC-federated role — no long-lived keys on laptops.</li>
<li><strong>Deletion protection and prevent-destroy</strong> on databases and stateful resources.</li>
<li><strong>Drift detection</strong> on a schedule, because someone will eventually "just fix it quickly" in the console.</li>
</ul>
<div class="key-point">The answer that shows scars: <em>"the tool matters less than the blast radius. I split stacks so stateful resources live apart from application resources — the worst IaC incidents I have seen were a plan that quietly proposed replacing a database."</em></div>`,
      },
      {
        q: 'Blue/green, canary, rolling — how do you deploy safely on AWS?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A <strong>rolling</strong> deployment replaces instances or tasks in batches: cheapest in resources, but two versions run simultaneously and rollback means rolling forward again, so it demands backward-compatible changes. <strong>Blue/green</strong> stands up a complete parallel environment and switches traffic at the load balancer or via Route 53, which gives near-instant rollback because the old stack is still running — at the price of double capacity during the cutover. <strong>Canary</strong> shifts a small percentage of traffic to the new version, watches metrics, then proceeds or aborts automatically, which is the safest option and the one that catches problems synthetic tests never do. AWS gives you these natively: CodeDeploy does blue/green and linear or canary traffic shifting for ECS and Lambda, Lambda aliases shift weight between versions, and ECS supports rolling updates with circuit breakers that auto-rollback on failed health checks. The part people underestimate is the database: schema changes must be backward compatible through an expand-migrate-contract sequence, because during any of these strategies old and new code are reading the same schema at the same time — and no traffic-shifting trick can roll back a dropped column.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Triển khai <strong>rolling</strong> thay thế instance hoặc task theo từng đợt: tốn ít tài nguyên nhất, nhưng có hai phiên bản cùng chạy song song, và muốn rollback thì phải triển khai tiếp một lần nữa — nên nó đòi hỏi mọi thay đổi phải tương thích ngược. <strong>Blue/green</strong> dựng hẳn một môi trường song song đầy đủ rồi chuyển traffic ở load balancer hoặc qua Route 53, nhờ vậy rollback gần như tức thì vì stack cũ vẫn còn nguyên đó — cái giá là phải gánh gấp đôi công suất trong lúc chuyển. <strong>Canary</strong> thì đẩy một phần nhỏ traffic sang phiên bản mới, theo dõi các chỉ số, rồi tự động đi tiếp hoặc tự động hủy; đây là cách an toàn nhất và cũng là cách bắt được những vấn đề mà test tổng hợp không bao giờ phát hiện ra. AWS hỗ trợ sẵn cả ba: CodeDeploy làm được blue/green và chuyển traffic kiểu tuyến tính hoặc canary cho ECS lẫn Lambda; alias của Lambda cho phép chia tỷ lệ giữa các version; còn ECS hỗ trợ rolling update kèm circuit breaker tự rollback khi health check hỏng. Phần mà người ta hay xem nhẹ chính là database: mọi thay đổi schema phải tương thích ngược theo trình tự mở rộng – chuyển đổi – thu hẹp, bởi trong bất kỳ chiến lược nào ở trên thì code cũ và code mới cũng đang đọc cùng một schema tại cùng một thời điểm — và không mẹo chuyển traffic nào cứu được một cột đã bị xóa.</p></details>
<table>
<tr><th></th><th>Rolling</th><th>Blue/Green</th><th>Canary</th></tr>
<tr><td>Extra capacity</td><td>Small</td><td>2×</td><td>Small</td></tr>
<tr><td>Rollback speed</td><td>Slow (roll forward)</td><td>Instant (switch back)</td><td>Instant (stop shifting)</td></tr>
<tr><td>Blast radius on a bad release</td><td>Grows batch by batch</td><td>All at once at cutover</td><td>Limited to the canary %</td></tr>
<tr><td>Two versions live</td><td>Yes</td><td>Briefly</td><td>Yes, by design</td></tr>
<tr><td>AWS support</td><td>ECS/ASG native</td><td>CodeDeploy, ALB target groups, Route 53 weights</td><td>CodeDeploy, Lambda alias weights</td></tr>
</table>
<p><strong>Expand-migrate-contract — the only safe schema change:</strong></p>
<pre>1. EXPAND    add the new nullable column / new table  (old code unaffected)
2. Deploy    new code writes BOTH old and new, reads old
3. MIGRATE   backfill existing rows
4. Deploy    new code reads new
5. CONTRACT  drop the old column — a separate release, days later

Never: rename a column and deploy in one step. During the rollout,
the old pods are still selecting the old name.</pre>
<p><strong>What makes a deployment "safe" beyond the strategy:</strong> automatic rollback wired to real alarms (error rate, latency) rather than a human watching a graph; ECS deployment circuit breaker enabled; health checks that check dependencies the app truly needs; feature flags so a risky code path can be disabled without a deploy at all; and rehearsed rollback — a rollback path nobody has ever executed is a hypothesis, not a plan.</p>
<div class="key-point">The senior nuance: <em>"traffic shifting solves the code rollback problem, not the data rollback problem. That is why every schema change is backward compatible and shipped separately from the code that needs it."</em></div>`,
      },
      // ──── 10. COST & RELIABILITY ────
      {
        q: 'How do you control AWS cost? Pricing models and the traps that inflate bills.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Cost work splits into buying compute correctly and stopping the waste that nobody notices. On purchasing, <strong>On-Demand</strong> is the flexible baseline, <strong>Savings Plans</strong> and <strong>Reserved Instances</strong> cut up to about 70% in exchange for a one- or three-year commitment — Compute Savings Plans being the flexible modern default — and <strong>Spot</strong> saves up to 90% for anything interruption-tolerant such as batch, CI runners and stateless workers, given a two-minute termination notice. The traps are more interesting because they rarely appear in architecture diagrams: <strong>data transfer</strong> is the classic one, since cross-AZ traffic, NAT gateway processing and egress to the internet are billed per gigabyte and can quietly exceed compute; then unattached EBS volumes and old snapshots, S3 versioning without noncurrent-version expiry, CloudWatch log groups retained forever, idle non-production environments running nights and weekends, and over-provisioned instances chosen by guesswork. The discipline that fixes it long-term is not a one-off cleanup but tagging with cost allocation, per-team budgets and alerts, and making cost a number each team sees rather than a central function's problem.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Việc tối ưu chi phí chia làm hai mảng: mua compute cho đúng cách, và chặn những khoản lãng phí mà chẳng ai để ý. Về mua sắm, <strong>On-Demand</strong> là mức nền linh hoạt; <strong>Savings Plans</strong> và <strong>Reserved Instance</strong> giảm được tới khoảng 70% để đổi lấy cam kết một hoặc ba năm — trong đó Compute Savings Plans là lựa chọn hiện đại và linh hoạt nhất; còn <strong>Spot</strong> tiết kiệm tới 90% cho mọi thứ chịu được việc bị ngắt giữa chừng như job batch, máy chạy CI hay worker không giữ trạng thái, với thông báo trước hai phút khi bị thu hồi. Nhưng phần cái bẫy mới đáng nói, vì chúng hiếm khi xuất hiện trên sơ đồ kiến trúc: kinh điển nhất là <strong>truyền dữ liệu</strong> — traffic giữa các AZ, phí xử lý của NAT gateway và dữ liệu đi ra internet đều tính theo gigabyte và hoàn toàn có thể vượt cả tiền compute; tiếp theo là các volume EBS không còn gắn vào đâu cùng đống snapshot cũ, S3 bật versioning mà không đặt luật xóa bản cũ, các log group CloudWatch giữ mãi mãi, những môi trường không phải production chạy suốt đêm và cuối tuần, và các instance được chọn quá to chỉ vì đoán mò. Thứ giải quyết được vấn đề về lâu dài không phải một đợt tổng vệ sinh, mà là kỷ luật: gắn tag để phân bổ chi phí, đặt ngân sách và cảnh báo cho từng đội, và biến chi phí thành một con số mà mỗi đội đều nhìn thấy — thay vì để nó là việc riêng của một bộ phận trung tâm.</p></details>
<table>
<tr><th>Model</th><th>Saving</th><th>Use for</th></tr>
<tr><td>On-Demand</td><td>—</td><td>Unpredictable, short-lived, new workloads</td></tr>
<tr><td>Compute Savings Plan</td><td>Up to ~66%</td><td>Steady baseline; flexible across instance family, Region, EC2/Fargate/Lambda</td></tr>
<tr><td>Reserved Instances</td><td>Up to ~72%</td><td>Very stable workloads, RDS/ElastiCache especially</td></tr>
<tr><td>Spot</td><td>Up to ~90%</td><td>Batch, CI, stateless workers, big data — anything restartable</td></tr>
<tr><td>Graviton (ARM)</td><td>~20-40% better price/perf</td><td>Almost anything that compiles for ARM — often the easiest single win</td></tr>
</table>
<p><strong>The waste checklist, roughly in order of how much it usually finds:</strong></p>
<ol>
<li><strong>Data transfer</strong> — NAT gateway processing, cross-AZ chatter, internet egress. Fix with VPC endpoints, AZ-aware routing, and CloudFront for egress.</li>
<li><strong>Idle non-production</strong> — stop dev/staging outside working hours; this alone is often 20-30% of a small account.</li>
<li><strong>Orphaned resources</strong> — unattached EBS volumes, old snapshots, unused Elastic IPs, empty load balancers.</li>
<li><strong>S3 lifecycle gaps</strong> — no transition rules, no noncurrent-version expiry, no abort-incomplete-multipart rule.</li>
<li><strong>CloudWatch Logs</strong> — retention set to Never Expire on every log group by default.</li>
<li><strong>Over-provisioning</strong> — right-size from Compute Optimizer data, not from a guess made two years ago.</li>
</ol>
<p><strong>Governance that keeps it fixed:</strong> mandatory cost-allocation tags enforced by SCP or Config, AWS Budgets with alerts per team, Cost Anomaly Detection for surprises, and a monthly review of the top movers in Cost Explorer.</p>
<div class="key-point">The observation that marks experience: <em>"the biggest line on a surprising bill is usually not compute — it is data transfer and forgotten storage. I look at NAT processing, cross-AZ traffic and S3 versioning before I look at instance sizes."</em></div>`,
      },
      {
        q: 'Design for failure on AWS: Multi-AZ, multi-region, RTO/RPO and DR strategies.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Start from the business numbers, not the diagram: <strong>RPO</strong> says how much data you may lose and <strong>RTO</strong> says how long you may be down, and those two numbers determine which of the four DR strategies you can afford. <strong>Backup and restore</strong> is cheapest with an RTO of hours; <strong>pilot light</strong> keeps the data replicated and the core services scaled to zero; <strong>warm standby</strong> runs a smaller live copy you scale up on failover; <strong>multi-site active-active</strong> gives near-zero RTO and costs roughly double while forcing you to solve write conflicts. Within a Region, Multi-AZ is the baseline and should simply be assumed — it is cheap, adds no meaningful latency and covers the failure you will actually experience. Cross-region is a different class of problem because replication is asynchronous, so a failover loses whatever was in flight, and the stateless tier is never the hard part — the data is. The two things I would emphasise in an interview are that an untested failover does not work, and that most real outages are not AWS losing an AZ but a bad deployment, so a fast rollback path protects availability more than a second Region does.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy bắt đầu từ những con số của nghiệp vụ chứ không phải từ sơ đồ: <strong>RPO</strong> cho biết bạn được phép mất bao nhiêu dữ liệu, <strong>RTO</strong> cho biết bạn được phép ngưng bao lâu — và chính hai con số đó quyết định bạn kham nổi chiến lược DR nào trong bốn cách. <strong>Backup and restore</strong> rẻ nhất, với RTO tính bằng giờ; <strong>pilot light</strong> giữ dữ liệu luôn được sao chép còn các service lõi thì thu về mức không; <strong>warm standby</strong> chạy sẵn một bản sao thu nhỏ và sẽ mở rộng lên khi cần chuyển đổi; còn <strong>multi-site active-active</strong> cho RTO gần bằng không nhưng tốn khoảng gấp đôi chi phí và buộc bạn phải tự giải bài toán xung đột khi ghi. Trong phạm vi một region, Multi-AZ là mức nền và nên được mặc định coi là bắt buộc — nó rẻ, gần như không thêm độ trễ, lại chống đúng loại sự cố bạn sẽ thật sự gặp. Còn đa region là một lớp bài toán khác hẳn, bởi việc sao chép là bất đồng bộ nên mỗi lần failover đều mất phần dữ liệu đang trên đường; và phần khó chưa bao giờ nằm ở tầng không trạng thái, nó nằm ở dữ liệu. Hai điều tôi sẽ nhấn mạnh trong một buổi phỏng vấn: một cơ chế failover chưa từng được diễn tập thì coi như không hoạt động; và phần lớn sự cố thật sự không phải do AWS mất một AZ, mà do một lần deploy lỗi — nên một đường rollback thật nhanh còn bảo vệ tính sẵn sàng tốt hơn cả việc dựng thêm một region.</p></details>
<table>
<tr><th>Strategy</th><th>RPO</th><th>RTO</th><th>Relative cost</th></tr>
<tr><td><strong>Backup &amp; restore</strong></td><td>Hours</td><td>Hours–days</td><td>$</td></tr>
<tr><td><strong>Pilot light</strong></td><td>Minutes</td><td>Tens of minutes</td><td>$$</td></tr>
<tr><td><strong>Warm standby</strong></td><td>Seconds–minutes</td><td>Minutes</td><td>$$$</td></tr>
<tr><td><strong>Active-active</strong></td><td>Near zero</td><td>Near zero</td><td>$$$$</td></tr>
</table>
<p><strong>What each AWS data service gives you:</strong></p>
<pre>RDS/Aurora   Multi-AZ (sync, no loss) + cross-Region read replica (async)
             Aurora Global Database: ~1 s lag, &lt; 1 min promotion
DynamoDB     Global Tables: active-active, last-writer-wins conflicts
S3           Cross-Region Replication (async), versioning, Object Lock
EBS          Snapshots (can be copied cross-Region); volumes are zonal
Secrets/KMS  Replicate secrets and use multi-Region keys, or the standby
             Region cannot decrypt anything — a very common gap</pre>
<p><strong>Resilience inside a single Region, which is where most of the value is:</strong> three AZs with capacity headroom so losing one does not saturate the rest; health checks that remove bad targets quickly; timeouts, retries with backoff and circuit breakers so a slow dependency does not cascade; bulkheads so one integration cannot exhaust the shared thread or connection pool; graceful degradation paths, such as serving cached or partial results when a downstream is unavailable.</p>
<p><strong>Testing:</strong> schedule game days, use AWS Fault Injection Simulator to actually kill an AZ or inject latency, and rehearse the runbook. Also verify that quotas and capacity exist in the standby Region — a failover that fails because of an unraised service quota is a well-documented way to turn an outage into a longer outage.</p>
<div class="key-point">The framing that lands with senior interviewers: <em>"I would rather have one Region with excellent deployment safety, tested Multi-AZ failover and real backups than two Regions and an untested failover script. Multi-region is a compliance or RTO decision, not a badge of maturity."</em></div>`,
      },
    ],
  },
];
