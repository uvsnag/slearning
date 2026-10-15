// Interview data: Non-technical questions commonly asked in senior developer / leader interviews
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'cv-questions',
    name: 'Non-Technical Questions',
    icon: '💬',
    questions: [
      // ──── 0. NON-TECHNICAL QUESTIONS SUMMARY — knowledge map ────
      {
        q: 'Non-Technical Questions Summary — Knowledge Map',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A preparation map for the non-technical side of senior developer and leader interviews — behavioral, leadership, communication, and career questions, organized so you can prepare stories for each theme before the real conversation.</p></div>
<h3>1. Self-Introduction &amp; Motivation</h3>
<ul>
<li>"Tell me about yourself" — 2-minute pitch (present → past → future)</li>
<li>Why are you leaving / why this company / why this role</li>
<li>Strengths and weaknesses — honest, with evidence and improvement plan</li>
<li>5-year vision aligned with the role</li>
</ul>
<h3>2. Leadership &amp; People</h3>
<ul>
<li>Leadership style (servant leadership, situational leadership)</li>
<li>Mentoring and growing juniors</li>
<li>Delegation: what to delegate, what to keep</li>
<li>Handling an underperforming team member</li>
<li>Resolving conflict between teammates</li>
</ul>
<h3>3. Behavioral Stories (STAR)</h3>
<ul>
<li>STAR structure: Situation → Task → Action → Result</li>
<li>Disagreement with a decision (manager, PO, teammate)</li>
<li>A failure or mistake and what you learned</li>
<li>Influencing without authority</li>
<li>Biggest achievement with measurable impact</li>
</ul>
<h3>4. Working Under Constraints</h3>
<ul>
<li>Prioritizing when everything is urgent (urgent/important matrix)</li>
<li>Tight deadlines and pressure — scope, communication, trade-offs</li>
<li>Decisions with incomplete information (reversible vs irreversible)</li>
<li>Pushing back on unrealistic requirements — saying no with options</li>
</ul>
<h3>5. Communication</h3>
<ul>
<li>Explaining technical topics to non-technical stakeholders</li>
<li>Giving and receiving feedback (SBI model)</li>
<li>Status reporting: no surprises, raise risks early</li>
<li>Working across time zones / with international teams</li>
</ul>
<h3>6. Closing Topics</h3>
<ul>
<li>Salary expectations: research a range, let them anchor if possible</li>
<li>Questions to ask the interviewer (team, process, success criteria)</li>
</ul>
<div class="key-point">Rule of thumb: prepare 6–8 real stories from your career and map each one to multiple questions. Interviewers remember concrete stories with outcomes ("we shipped two weeks early after I cut scope X") far more than abstract principles.</div>`,
      },

      // ──── 1. SELF-INTRODUCTION & MOTIVATION ────
      {
        q: 'Tell me about yourself.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>This is almost always the first question and it sets the tone of the interview. A good answer is a two-minute pitch structured as present, past, then future: current role and main responsibilities, the most relevant past experience, and what you are looking for next. For a senior or lead role, emphasize ownership, decisions, and people impact — not a list of technologies. The goal is a clear story, not a spoken CV.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đây hầu như luôn là câu hỏi đầu tiên và nó định hình không khí của buổi phỏng vấn. Một câu trả lời tốt là phần giới thiệu khoảng hai phút theo cấu trúc hiện tại, quá khứ, rồi tương lai: vai trò hiện tại và các trách nhiệm chính, kinh nghiệm quá khứ liên quan nhất, và điều bạn đang tìm kiếm tiếp theo. Với vị trí senior hay lead, hãy nhấn mạnh sự làm chủ công việc, các quyết định và tác động đến con người — chứ không phải liệt kê công nghệ. Mục tiêu là kể một câu chuyện rõ ràng, không phải đọc lại CV bằng lời.</p></details>
<pre>Formula: Present → Past → Future (~2 minutes)

Present: role, scope, what you own
  "I'm a senior fullstack developer, currently acting as deputy
   team lead. I own architecture decisions and code quality for
   a logistics platform used by hundreds of operators."

Past: 1–2 highlights that match THIS role
  "Before that I led a small team through a legacy migration
   with zero downtime, and mentored several juniors to mid level."

Future: why you're here
  "I'm looking for a role with more ownership of technical
   direction, which is why this position caught my attention."</pre>
<div class="key-point">Tailor the pitch to the role: for a lead role, lead with team and decision-making impact; for a senior IC role, lead with technical ownership. Keep it under 2 minutes and stop — let them pull the threads they care about.</div>`,
      },
      {
        q: 'Why are you leaving your current company? Why do you want to join us?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Answer honestly but frame it as a "pull", not a "push": talk about what you want next (more ownership, bigger scope, a product with wider impact) rather than what you are escaping. Never criticize your current employer, manager, or teammates — interviewers assume you would talk about them the same way later. For "why us", show you did research: name something specific about their product, engineering culture, or challenges, and connect it to your experience.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy trả lời trung thực nhưng đóng khung theo hướng "lực kéo" chứ không phải "lực đẩy": nói về điều bạn muốn có tiếp theo (nhiều quyền làm chủ hơn, phạm vi lớn hơn, một sản phẩm có tầm ảnh hưởng rộng hơn) thay vì điều bạn đang muốn trốn tránh. Đừng bao giờ chỉ trích công ty, sếp hay đồng nghiệp hiện tại — người phỏng vấn sẽ ngầm hiểu rằng sau này bạn cũng sẽ nói về họ theo cách đó. Với câu "tại sao chọn chúng tôi", hãy cho thấy bạn đã tìm hiểu: nêu một điều cụ thể về sản phẩm, văn hóa kỹ thuật hay thách thức của họ, và kết nối nó với kinh nghiệm của bạn.</p></details>
<pre>Good framing:
  "I've grown a lot in my current role — from senior developer
   to deputy lead. What I can't get there is ownership of
   product-level architecture, and that's exactly what this
   role offers."

Why us (show research):
  "I saw your team is scaling the platform from X to Y users.
   I've been through a similar scaling phase and I'd love to
   contribute to that kind of challenge."

Avoid:
  ✗ "My manager doesn't listen to me."
  ✗ "The salary is too low." (even if true — reframe)
  ✗ "I'm bored."</pre>
<div class="key-point">Even if the real reason is salary or a bad manager, frame it positively: "I'm looking for a role that better matches my experience and the level of responsibility I can take on." Pull, not push.</div>`,
      },
      {
        q: 'What are your greatest strengths and weaknesses?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>For strengths, pick one or two that match the role and back each with a short piece of evidence — a result, not an adjective. For weaknesses, name a real one (not a disguised strength like "I work too hard"), show self-awareness about its cost, and describe the concrete thing you are doing about it. Interviewers are testing honesty and self-awareness, not looking for a perfect person.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với điểm mạnh, hãy chọn một hoặc hai điểm phù hợp với vị trí và chứng minh mỗi điểm bằng một bằng chứng ngắn gọn — một kết quả cụ thể, không phải một tính từ. Với điểm yếu, hãy nêu một điểm yếu thật (không phải điểm mạnh được ngụy trang kiểu "tôi làm việc chăm quá"), thể hiện sự tự nhận thức về cái giá của nó, và mô tả hành động cụ thể bạn đang làm để cải thiện. Người phỏng vấn đang kiểm tra sự trung thực và khả năng tự nhận thức, chứ không tìm kiếm một con người hoàn hảo.</p></details>
<pre>Strength (claim + evidence):
  "I'm good at simplifying systems. On my last project I
   replaced three overlapping services with one module and
   cut our incident rate noticeably."

Weakness (real + cost + fix):
  "I tend to hold on to technical work instead of delegating.
   It became a bottleneck when I became a lead — reviews piled
   up on me. I now deliberately assign ownership of whole
   features to teammates and limit myself to reviewing the
   architecture, not every line."

Avoid:
  ✗ "I'm a perfectionist." (cliché, sounds evasive)
  ✗ A weakness that disqualifies you for the role
    (e.g., "I hate meetings" when applying as a lead)</pre>
<div class="key-point">The formula for weaknesses: real weakness → what it cost you → what you changed → evidence it's improving. That sequence demonstrates exactly the self-awareness and growth mindset senior roles require.</div>`,
      },
      {
        q: 'Where do you see yourself in 5 years?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Interviewers ask this to check whether your ambitions fit the role and whether you are likely to stay and grow. A good answer shows direction without rigid titles: for example, growing from senior engineer toward technical leadership or architecture, with more influence over product and people. Connect the vision to the company — show that this role is a logical step on that path, not a random stop.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Người phỏng vấn hỏi câu này để kiểm tra xem tham vọng của bạn có phù hợp với vị trí không và liệu bạn có khả năng gắn bó, phát triển lâu dài hay không. Một câu trả lời tốt thể hiện định hướng mà không bám cứng vào chức danh: ví dụ, phát triển từ senior engineer lên vai trò lãnh đạo kỹ thuật hoặc kiến trúc sư, với ảnh hưởng lớn hơn đến sản phẩm và con người. Hãy kết nối tầm nhìn đó với công ty — cho thấy vị trí này là một bước đi hợp lý trên con đường đó, chứ không phải một điểm dừng ngẫu nhiên.</p></details>
<pre>Example:
  "In five years I want to be the person a company trusts with
   its hardest technical decisions — whether that title is
   principal engineer or engineering manager depends on where
   I can contribute most. Short term, that means deepening my
   architecture skills and growing the people around me. This
   role is attractive precisely because it offers both."

Avoid:
  ✗ "I want your job." (as a joke — risky)
  ✗ "I plan to start my own company." (signals you'll leave)
  ✗ "I haven't thought about it." (no direction)</pre>
<div class="key-point">Show ambition with flexibility: a clear direction (more technical ownership, more people impact) without demanding a specific title on a specific date. Then tie it to the role: "this position is the next step on that path."</div>`,
      },

      // ──── 2. LEADERSHIP & PEOPLE ────
      {
        q: 'Describe your leadership style.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A strong answer avoids naming one fixed style and instead describes adapting to the person and the situation — close guidance for juniors, goals and autonomy for seniors, and direct decisions during incidents. Mention concrete habits: setting clear expectations, removing blockers, giving credit publicly and feedback privately, and making decisions when the team is stuck. End with evidence, such as people you grew or a team outcome.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một câu trả lời mạnh sẽ tránh gán mình vào một phong cách cố định, mà thay vào đó mô tả việc thích ứng theo từng người và từng tình huống — hướng dẫn sát sao với junior, đặt mục tiêu và trao quyền tự chủ cho senior, và quyết đoán trực tiếp khi có sự cố. Hãy nêu những thói quen cụ thể: đặt kỳ vọng rõ ràng, gỡ bỏ vướng mắc, khen công khai và góp ý riêng tư, và ra quyết định khi cả nhóm bế tắc. Kết thúc bằng bằng chứng, chẳng hạn những người bạn đã giúp trưởng thành hoặc một kết quả của nhóm.</p></details>
<pre>Situational leadership in practice:

  Junior, new task     → Direct: pair, small tasks, close review
  Mid, growing         → Coach: guide with questions, review design
  Senior, experienced  → Delegate: agree on outcome, stay out of HOW
  Incident / deadline  → Decisive: make the call, explain later

My habits as a lead:
  → Clear expectations: definition of done, owner per task
  → Remove blockers before they ask (access, decisions, dependencies)
  → Praise in public, correct in private
  → Decide when the team is split — and own the outcome</pre>
<div class="key-point">The strongest close is evidence: "Two developers I mentored were promoted to mid-level within a year" says more about your leadership than any label like "servant leader".</div>`,
      },
      {
        q: 'How do you mentor and grow junior developers?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The goal of mentoring is independence, not dependence. Start new developers with pair programming and small, well-defined tasks, then increase scope as confidence grows. Use code reviews as teaching moments by explaining the "why" behind every suggestion. Hold regular one-on-ones to unblock them and set growth goals. When a junior is stuck, ask guiding questions instead of giving the answer — they remember what they discovered far better than what they were told.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mục tiêu của mentoring là sự độc lập, không phải sự phụ thuộc. Hãy để developer mới bắt đầu với pair programming và những task nhỏ, được định nghĩa rõ ràng, rồi tăng dần phạm vi khi họ tự tin hơn. Dùng code review như những buổi dạy học bằng cách giải thích "tại sao" đằng sau mỗi góp ý. Tổ chức one-on-one định kỳ để gỡ vướng mắc và đặt mục tiêu phát triển. Khi một bạn junior bị bí, hãy đặt câu hỏi gợi mở thay vì đưa ra đáp án — họ nhớ điều tự mình khám phá tốt hơn nhiều so với điều được chỉ sẵn.</p></details>
<pre>Mentoring playbook:

1. ONBOARD
   → Pair for the first week; assign a "first win" task
     achievable in 2–3 days

2. GROW SCOPE GRADUALLY
   → Task → feature → feature + design → feature + design
     + owning the release

3. TEACH THROUGH REVIEWS
   → Explain WHY, link to docs/patterns, show the reusable
     principle, not just the fix

4. GUIDE, DON'T SOLVE
   → "What have you tried? What does the log say? What would
     you check next?" — answer with questions first

5. TRACK GROWTH
   → Regular 1:1s, concrete goals ("lead the next small
     feature end-to-end"), celebrate visible progress</pre>
<div class="key-point">Measure mentoring by outcomes: how quickly juniors become independent and what they can own alone. "A junior I mentored went from assigned bugfixes to owning a full module in eight months" is the answer interviewers want to hear.</div>`,
      },
      {
        q: 'How do you decide what to delegate and what to keep yourself?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Delegate based on two axes: how critical the task is and how much it would grow the person doing it. Keep irreversible, high-risk decisions (architecture direction, production incident calls) and delegate everything that is a growth opportunity for someone else, even if you could do it faster yourself. Delegate the outcome, not the steps: agree on the goal, constraints, and check-in points, then let the person own the "how". The common senior-to-lead mistake is hoarding interesting work and becoming the bottleneck.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy giao việc dựa trên hai trục: mức độ quan trọng của task và mức độ nó giúp người nhận phát triển. Giữ lại những quyết định không thể đảo ngược, rủi ro cao (định hướng kiến trúc, quyết định khi có sự cố production) và giao tất cả những gì là cơ hội phát triển cho người khác, kể cả khi tự bạn làm sẽ nhanh hơn. Hãy giao kết quả, không giao từng bước: thống nhất mục tiêu, ràng buộc và các điểm kiểm tra, rồi để người đó tự làm chủ cách thực hiện. Sai lầm phổ biến khi chuyển từ senior lên lead là ôm hết việc hay ho và tự biến mình thành nút thắt cổ chai.</p></details>
<pre>Delegation matrix:

                    Low risk          High risk
  Grows them    →  DELEGATE fully    DELEGATE with check-ins
  Routine       →  DELEGATE + docs   KEEP or pair on it

Delegate the OUTCOME, not the steps:
  ✓ "Own the export feature: done means X, constraint is Y,
     check in with me after the design and before release."
  ✗ "First create this class, then add this method..."

Signs you delegate too little:
  → You're the review bottleneck
  → The team waits on your decisions daily
  → Nothing ships when you're on leave</pre>
<div class="key-point">"If I'm the only one who can do it, that's a problem I created." Leads are measured by what the team ships, not what they personally code. Delegating something you'd do faster yourself is an investment, not a loss.</div>`,
      },
      {
        q: 'How do you handle an underperforming team member?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Start with diagnosis, not judgment: underperformance usually has a cause — unclear expectations, a skill gap, personal issues, or low motivation — and each needs a different response. Talk privately, describe the gap with specific observable facts, and listen first. Then agree on a concrete improvement plan with clear expectations, support (mentoring, pairing, training), and a timeline. Document progress and follow up regularly. Escalate to the manager or HR only if there is no improvement after genuine support — and never embarrass the person in front of the team.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy bắt đầu bằng việc chẩn đoán, không phải phán xét: hiệu suất kém thường có nguyên nhân — kỳ vọng không rõ ràng, thiếu kỹ năng, vấn đề cá nhân, hoặc mất động lực — và mỗi nguyên nhân cần một cách xử lý khác nhau. Hãy trao đổi riêng, mô tả khoảng cách bằng những sự kiện cụ thể quan sát được, và lắng nghe trước. Sau đó thống nhất một kế hoạch cải thiện cụ thể với kỳ vọng rõ ràng, sự hỗ trợ (mentoring, pairing, đào tạo) và mốc thời gian. Ghi lại tiến triển và theo dõi định kỳ. Chỉ chuyển lên quản lý hoặc HR khi không có cải thiện dù đã hỗ trợ thật lòng — và tuyệt đối không làm người đó mất mặt trước cả nhóm.</p></details>
<pre>Step by step:

1. OBSERVE & GATHER FACTS
   → Specific examples, not impressions: missed deadlines,
     repeated review issues, dropped tasks

2. PRIVATE CONVERSATION — LISTEN FIRST
   → "I've noticed X and Y. How do you see it? Is anything
     getting in your way?"
   → Often reveals: unclear requirements, burnout, personal
     situation, wrong task fit

3. AGREE ON A PLAN
   → Clear expectations + support + timeline
   → "For the next month: smaller tasks with explicit
     acceptance criteria, pairing twice a week, check-in
     every Friday."

4. FOLLOW UP & DOCUMENT
   → Recognize improvement quickly; adjust the plan if needed

5. ESCALATE ONLY AFTER REAL SUPPORT
   → If no change: involve the manager with the documented
     history — fairness protects both sides</pre>
<div class="key-point">The order matters: facts → private conversation → support → timeline → escalation as last resort. Jumping straight to criticism or to HR signals poor leadership. Most "underperformance" turns out to be a fixable mismatch.</div>`,
      },
      {
        q: 'Two of your team members strongly disagree with each other. How do you resolve it?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>First separate the disagreement from the people: a technical dispute is healthy as long as it stays about the problem. Get both sides to state the other's position until each feels understood, then move the discussion to shared criteria — performance, maintainability, deadline, cost — and evaluate both options against them. If data can settle it, run a quick spike or prototype. If it is still a tie, the lead makes the call, explains why, and the team commits ("disagree and commit"). Act early: unresolved conflict spreads to the whole team.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trước tiên hãy tách sự bất đồng ra khỏi con người: tranh luận kỹ thuật là lành mạnh miễn là nó xoay quanh vấn đề. Yêu cầu hai bên trình bày lại quan điểm của đối phương cho đến khi cả hai cảm thấy được hiểu, rồi đưa cuộc thảo luận về các tiêu chí chung — hiệu năng, khả năng bảo trì, deadline, chi phí — và đánh giá cả hai phương án dựa trên đó. Nếu dữ liệu có thể phân định, hãy làm nhanh một bản spike hoặc prototype. Nếu vẫn bất phân thắng bại, lead sẽ ra quyết định, giải thích lý do, và cả nhóm cam kết thực hiện ("disagree and commit"). Hãy hành động sớm: mâu thuẫn không được giải quyết sẽ lan ra cả nhóm.</p></details>
<pre>Resolution sequence:

1. DEPERSONALIZE
   → "We're comparing two designs, not two people."

2. STEELMAN EACH SIDE
   → Each person restates the OTHER's argument until the
     other agrees it's fair

3. AGREE ON CRITERIA FIRST
   → Performance? Time to ship? Maintainability? Risk?
   → Score both options against the SAME criteria

4. LET DATA DECIDE IF POSSIBLE
   → Timebox a spike: "Both approaches, 1 day each,
     benchmark on real data."

5. TIE-BREAK AND COMMIT
   → Lead decides, explains the reasoning, documents it
     (mini ADR), and everyone commits — no relitigating</pre>
<div class="key-point">Never decide by "who argues loudest" or let it fester hoping it resolves itself. Criteria first, data where possible, then a clear decision with reasons. A documented decision prevents the same fight from repeating in three months.</div>`,
      },

      // ──── 3. BEHAVIORAL STORIES (STAR) ────
      {
        q: 'Tell me about a time you disagreed with a decision made by your manager or team.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Use the STAR structure and pick a real technical disagreement. The pattern that interviewers want to see: you voiced the concern early, privately, and with evidence rather than emotion; you proposed an alternative with its trade-offs; and regardless of the outcome, once the decision was made you committed to it fully. Both endings are fine — being proven right (handled gracefully) or being proven wrong (and learning from it). What fails the question is either silent compliance or undermining the decision after it was made.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy dùng cấu trúc STAR và chọn một bất đồng kỹ thuật có thật. Khuôn mẫu mà người phỏng vấn muốn thấy: bạn nêu lo ngại sớm, một cách riêng tư và bằng bằng chứng thay vì cảm xúc; bạn đề xuất một phương án thay thế kèm các đánh đổi của nó; và dù kết quả thế nào, một khi quyết định đã được đưa ra thì bạn cam kết thực hiện trọn vẹn. Cả hai kết cục đều ổn — bạn đúng (và xử lý khéo léo) hoặc bạn sai (và rút ra bài học). Điều khiến câu trả lời thất bại là hoặc im lặng phục tùng, hoặc ngấm ngầm phá quyết định sau khi nó đã được chốt.</p></details>
<pre>STAR skeleton for this story:

Situation: "The team decided to ship feature X without
  integration tests to hit a deadline."

Task: "I believed this risked a production incident in our
  billing flow, and as senior dev I had to raise it."

Action:
  → Raised it privately with the lead first, with data:
    "the last two incidents came from exactly this path"
  → Proposed a middle ground: cover only the 3 critical
    paths — one extra day instead of five
  → Accepted the final call and helped execute it

Result: "We shipped one day later with the critical tests.
  A bug those tests caught would have hit every invoice."
  (Or: "They decided to ship without tests; I committed to
  the decision and we added tests right after — and I learned
  the deadline mattered more than I'd estimated.")</pre>
<div class="key-point">The skill being tested is not "being right" — it's disagreeing professionally: early, private, evidence-based, with an alternative, followed by full commitment to the final decision. "Disagree and commit" is the phrase to embody.</div>`,
      },
      {
        q: 'Tell me about a time you failed or made a serious mistake. What did you learn?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Pick a real failure with real stakes — not a disguised success. Own it in the first sentence without blaming others, then spend most of the answer on the response: how you detected it, contained the damage, communicated honestly, and fixed the root cause. End with the systemic change that prevents repeats — a process, a check, a habit — and if possible, evidence it worked. Interviewers ask this to check honesty, accountability, and whether failures make you better.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy chọn một thất bại có thật với hậu quả thật — không phải một thành công được ngụy trang. Nhận trách nhiệm ngay trong câu đầu tiên mà không đổ lỗi cho người khác, rồi dành phần lớn câu trả lời cho cách xử lý: bạn phát hiện ra sao, khoanh vùng thiệt hại thế nào, giao tiếp trung thực ra sao, và sửa nguyên nhân gốc như thế nào. Kết thúc bằng thay đổi mang tính hệ thống giúp ngăn lặp lại — một quy trình, một bước kiểm tra, một thói quen — và nếu được, kèm bằng chứng nó hiệu quả. Người phỏng vấn hỏi câu này để kiểm tra sự trung thực, tinh thần trách nhiệm, và liệu thất bại có giúp bạn giỏi lên không.</p></details>
<pre>Structure: Own it → Impact → Response → Systemic fix

Example:
  "I once ran a data update script against production
   thinking it was staging. It corrupted part of a table."     (own it)

  "About 2,000 records were affected before I noticed."        (impact)

  "I immediately told my lead — before trying to quietly fix
   it — we restored from backup within the hour, and I
   personally verified every affected record."                 (response)

  "Then I changed the system, not just my behavior: separate
   credentials per environment, destructive scripts require
   a --env flag and a dry-run first. The team adopted it and
   that class of mistake hasn't happened since."               (fix)

Red flags to avoid:
  ✗ "My biggest failure is trusting people too much."
  ✗ A story where it was really someone else's fault
  ✗ No systemic change — only "I'm more careful now"</pre>
<div class="key-point">Report first, fix second, systematize third. "I told my lead immediately" is a stronger senior signal than a story with no mistake at all — hiding problems is the one thing that is unforgivable in senior roles.</div>`,
      },
      {
        q: 'Tell me about a time you influenced a decision without having authority.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>This question targets a core senior skill: changing outcomes through credibility, evidence, and relationships instead of position. A strong story shows you understood the decision-maker's priorities, translated your proposal into their language (risk, cost, time — not elegance), built a small proof instead of a long argument, and recruited allies before the meeting rather than fighting in it. The result should be a changed decision and, ideally, a lasting improvement.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Câu hỏi này nhắm vào một kỹ năng cốt lõi của senior: thay đổi kết quả bằng uy tín, bằng chứng và các mối quan hệ thay vì chức vụ. Một câu chuyện mạnh sẽ cho thấy bạn hiểu các ưu tiên của người ra quyết định, diễn đạt đề xuất của mình bằng ngôn ngữ của họ (rủi ro, chi phí, thời gian — chứ không phải sự thanh thoát của code), xây một bản chứng minh nhỏ thay vì tranh luận dài dòng, và tìm đồng minh trước cuộc họp thay vì đấu tay đôi trong đó. Kết quả nên là một quyết định được thay đổi, và lý tưởng hơn, một cải thiện lâu dài.</p></details>
<pre>Influence toolkit (what the story should show):

1. SPEAK THEIR LANGUAGE
   → To a PM: ship risk, delay cost. To a manager: team
     velocity, incident count. Not "cleaner code".

2. PROOF OVER ARGUMENT
   → A 1-day prototype or a benchmark beats a 1-hour debate
   → "I built a small demo showing the approach cut load
      time from 4s to 400ms — the demo made the decision."

3. ALLIES BEFORE THE MEETING
   → Walk key people through it 1:1 first; enter the meeting
     with support, not an ambush

4. MAKE IT CHEAP TO SAY YES
   → Propose a pilot, a timebox, a reversible first step
   → "Let's try it on one module for one sprint."</pre>
<div class="key-point">Influence without authority = credibility × evidence × empathy for the decision-maker's constraints. The worst version of this story is "I was right and kept repeating it louder." The best version is "I made it easy and safe for them to choose the better option."</div>`,
      },
      {
        q: 'What is your biggest professional achievement?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Choose an achievement that matches the role you are applying for, tell it as a short STAR story, and quantify the result. For a senior/lead role, the strongest achievements show ownership end-to-end plus impact beyond yourself: a system you led to production, a migration with zero downtime, a team or person you grew, a process that outlived you. Be precise about your personal contribution versus the team's — inflating "we" into "I" is a common red flag interviewers probe.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy chọn một thành tựu phù hợp với vị trí bạn đang ứng tuyển, kể nó như một câu chuyện STAR ngắn gọn, và định lượng kết quả. Với vị trí senior/lead, những thành tựu mạnh nhất thể hiện sự làm chủ từ đầu đến cuối cùng tác động vượt ra ngoài bản thân: một hệ thống bạn dẫn dắt đến production, một cuộc migration không downtime, một người hay một nhóm bạn giúp trưởng thành, một quy trình còn tồn tại sau khi bạn rời đi. Hãy chính xác về đóng góp cá nhân so với của cả nhóm — thổi phồng "chúng tôi" thành "tôi" là một dấu hiệu đỏ phổ biến mà người phỏng vấn sẽ đào sâu.</p></details>
<pre>Picking the right story:

  Applying for lead role   → achievement about people/process
  Applying for senior IC   → achievement about system/impact

Quantify everything you can:
  → scale:   users, requests/day, tables, team size
  → impact:  time saved, incidents prevented, % faster
  → scope:   "sole developer", "led 4 people", "6 months"

Example shape:
  "The achievement I'm proudest of is leading a legacy system
   migration while it stayed in production — zero downtime,
   zero data loss, module by module over 8 months. My specific
   role was the architecture and the migration tooling; the
   team of 5 executed the modules. It's now the template other
   teams in the company follow."</pre>
<div class="key-point">Formula: context + your specific role + measurable result + lasting effect. "It became the template others follow" or "the process survived after I left" elevates a good story into a leadership story.</div>`,
      },

      // ──── 4. WORKING UNDER CONSTRAINTS ────
      {
        q: 'How do you prioritize when everything is urgent?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>When everything is labeled urgent, the first job is to make the real priorities visible. Triage by impact and deadline: production incidents affecting users come first, then revenue- or deadline-critical work, then everything else by value versus effort. Crucially, do not prioritize silently — go back to stakeholders with the full list and say "I can do A today or B today, not both; which one hurts more to delay?" Making the trade-off explicit and letting the owner choose turns conflict into a shared decision.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khi mọi thứ đều bị gắn nhãn khẩn cấp, việc đầu tiên là làm cho các ưu tiên thật sự trở nên rõ ràng. Hãy phân loại theo tác động và deadline: sự cố production ảnh hưởng người dùng đứng đầu, rồi đến công việc gắn với doanh thu hoặc deadline quan trọng, sau đó là phần còn lại theo tỷ lệ giá trị trên công sức. Quan trọng nhất, đừng tự ưu tiên trong im lặng — hãy quay lại với các bên liên quan cùng danh sách đầy đủ và nói "tôi có thể làm A hôm nay hoặc B hôm nay, không thể cả hai; trì hoãn cái nào thì đau hơn?" Việc nêu rõ sự đánh đổi và để người chịu trách nhiệm lựa chọn sẽ biến xung đột thành một quyết định chung.</p></details>
<pre>Triage order:

  1. Production down / users blocked      → now
  2. Hard external deadline (legal,
     customer commitment, release)        → today
  3. Unblocks other people                → before solo work
  4. High value / low effort              → next
  5. Everything else                      → scheduled, not lost

The key move — make trade-offs explicit:
  ✗ Silently work overtime on everything
  ✗ Silently drop something and hope nobody notices
  ✓ "Here's the list. I can deliver A by Friday OR B by
     Friday. A affects 10 users, B blocks the release.
     I suggest B — do you agree?"</pre>
<div class="key-point">Seniority here means refusing to pretend everything fits. The answer interviewers want: triage by impact, communicate the conflict early, propose a trade-off, and let the stakeholder own the choice — never silent heroics or silent drops.</div>`,
      },
      {
        q: 'How do you handle tight deadlines and pressure?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Pressure is managed with scope and communication, not heroics. When a deadline looks unrealistic, say so early with evidence, then negotiate the variables: cut scope to a smaller version that still delivers the core value, add help where it genuinely helps, or move the date. Protect quality on the critical path — skipping tests on the billing flow to save two days is a trade that fails later. Keep stakeholders updated so there are no surprises, and after the crunch, hold a retro so the same crisis does not repeat.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Áp lực được quản lý bằng phạm vi công việc và giao tiếp, chứ không phải sự gồng mình anh hùng. Khi một deadline có vẻ bất khả thi, hãy nói ra sớm kèm bằng chứng, rồi đàm phán các biến số: cắt phạm vi xuống một phiên bản nhỏ hơn nhưng vẫn mang lại giá trị cốt lõi, thêm người ở chỗ thật sự hữu ích, hoặc dời ngày. Hãy bảo vệ chất lượng trên đường găng — bỏ test ở luồng thanh toán để tiết kiệm hai ngày là một đánh đổi sẽ thất bại về sau. Cập nhật thường xuyên cho các bên liên quan để không có bất ngờ, và sau đợt cao điểm, hãy tổ chức retro để cùng một khủng hoảng không lặp lại.</p></details>
<pre>Deadline negotiation — the variables:

  Scope    → "The full feature needs 3 weeks. A version with
              the 2 core flows ships in 1 week. Start there?"
  People   → add help only where parallelizable
  Time     → move the date, with the cost stated
  Quality  → the variable you DON'T cut on critical paths

Under pressure, in order:
  1. Re-confirm what "must have" really means
  2. Raise the risk early — bad news doesn't improve with age
  3. Cut scope transparently, never quality silently
  4. Shield the team: one prioritized list, no panic swirl
  5. Afterwards: retro — why were we surprised?</pre>
<div class="key-point">The phrase that shows seniority: "I give bad news early, when there are still options — not at the deadline, when there are none." Silent overtime that barely saves a date teaches the organization to repeat the mistake.</div>`,
      },
      {
        q: 'How do you make decisions when you don’t have enough information?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>First classify the decision: if it is reversible, decide fast with the information you have, because the cost of delay exceeds the cost of a wrong-but-correctable choice. If it is hard to reverse — a database choice, a public API contract — invest in cheap information first: a timeboxed spike, a prototype, advice from someone who has done it. When you must choose under uncertainty, prefer the option that keeps the most doors open, state your assumptions explicitly, and define in advance what signal would make you revisit the decision.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Trước hết hãy phân loại quyết định: nếu nó có thể đảo ngược, hãy quyết nhanh với thông tin đang có, vì cái giá của sự chậm trễ lớn hơn cái giá của một lựa chọn sai nhưng sửa được. Nếu nó khó đảo ngược — chọn cơ sở dữ liệu, một hợp đồng API công khai — hãy đầu tư trước vào thông tin giá rẻ: một bản spike có giới hạn thời gian, một prototype, lời khuyên từ người đã từng làm. Khi buộc phải chọn trong sự không chắc chắn, hãy ưu tiên phương án giữ lại nhiều cánh cửa nhất, nêu rõ các giả định của bạn, và định nghĩa trước tín hiệu nào sẽ khiến bạn xem xét lại quyết định.</p></details>
<pre>Decision framework:

1. CLASSIFY: one-way or two-way door?
   → Two-way (reversible): decide today, adjust later
   → One-way (DB choice, public API, data model):
     slow down, buy information

2. BUY CHEAP INFORMATION
   → Timebox a spike: "2 days to prototype both options"
   → Ask someone who has operated this in production

3. DECIDE WITH GUARDRAILS
   → Prefer the option that's easiest to change later
   → Write down assumptions: "This holds if traffic stays
     under 10x current"
   → Set a revisit trigger: "If p99 latency exceeds 500ms,
     we re-evaluate"

4. COMMUNICATE THE UNCERTAINTY
   → "We're choosing X based on A and B; the risk is C;
      here's how we'll detect if we were wrong."</pre>
<div class="key-point">The senior failure mode is treating every decision the same: agonizing over reversible ones (analysis paralysis) or rushing irreversible ones. Name the type first — "this is a two-way door, let's just try it" is a sentence that marks experience.</div>`,
      },
      {
        q: 'A stakeholder demands a feature by a deadline you know is unrealistic. How do you say no?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Never a flat "no" and never a silent "yes" that fails later — both destroy trust. Acknowledge the goal behind the request, show your estimate with enough detail to be credible, and then offer real options: a reduced scope that fits the date, the full scope with a realistic date, or what else in the current plan would have to drop. Let the stakeholder choose among honest trade-offs. If they insist on the impossible, escalate transparently with the risks in writing rather than quietly accepting failure.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Đừng bao giờ nói "không" thẳng thừng và cũng đừng im lặng nhận "có" để rồi thất bại sau đó — cả hai đều phá hủy lòng tin. Hãy ghi nhận mục tiêu đằng sau yêu cầu, trình bày ước lượng của bạn đủ chi tiết để đáng tin, rồi đưa ra các lựa chọn thực tế: một phạm vi rút gọn vừa với ngày hẹn, phạm vi đầy đủ với một ngày thực tế, hoặc việc gì trong kế hoạch hiện tại sẽ phải bỏ ra. Hãy để stakeholder lựa chọn giữa những đánh đổi trung thực. Nếu họ vẫn khăng khăng đòi điều bất khả thi, hãy báo cáo lên cấp trên một cách minh bạch kèm các rủi ro bằng văn bản, thay vì âm thầm chấp nhận thất bại.</p></details>
<pre>The "no with options" script:

1. ACKNOWLEDGE THE GOAL
   "I understand this demo matters for the client renewal."

2. SHOW THE MATH (credibility)
   "The full feature is ~15 days: 6 backend, 5 frontend,
    4 testing — here's the breakdown."

3. OFFER REAL OPTIONS
   a) "Core flow only, by your date — the rest ships 2
       weeks later"
   b) "Everything, 2 weeks after your date"
   c) "Your date and full scope — if we pause project X;
       that's your call, not mine"

4. IF THEY INSIST ON THE IMPOSSIBLE
   → Put the risk in writing, escalate openly:
     "I'll do my best, and I need you to know the risks
      I've listed — this isn't a surprise later."</pre>
<div class="key-point">You're not saying no to the person — you're showing them the real trade-offs and letting them own the choice. The unforgivable version is agreeing while knowing it will fail: that converts their problem into your broken promise.</div>`,
      },

      // ──── 5. COMMUNICATION ────
      {
        q: 'How do you explain complex technical topics to non-technical stakeholders?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Start from what they care about — money, time, risk, users — and work backward to the technology, never the other way around. Lead with the conclusion ("we need two weeks to fix this or we risk losing orders"), then give detail only as requested. Use analogies anchored in their world, show rather than tell when possible, and drop all jargon: "technical debt" becomes "shortcuts we took that now slow every new feature". Check understanding by inviting questions, and close with the decision you need from them.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy bắt đầu từ điều họ quan tâm — tiền bạc, thời gian, rủi ro, người dùng — rồi đi ngược về phía công nghệ, đừng bao giờ làm theo chiều ngược lại. Mở đầu bằng kết luận ("chúng ta cần hai tuần để sửa việc này, nếu không có nguy cơ mất đơn hàng"), rồi mới đưa chi tiết khi được hỏi. Dùng phép so sánh gắn với thế giới của họ, trình diễn thay vì diễn giải khi có thể, và loại bỏ mọi thuật ngữ: "nợ kỹ thuật" trở thành "những lối tắt chúng ta đã đi mà giờ đang làm chậm mọi tính năng mới". Kiểm tra mức độ hiểu bằng cách mời họ đặt câu hỏi, và kết thúc bằng quyết định bạn cần từ họ.</p></details>
<pre>Translation table:

  Tech-speak                 → Stakeholder-speak
  ─────────────────────────────────────────────────────
  "Refactor the module"      → "Rebuild the slow part so
                                new features ship faster"
  "Technical debt"           → "Shortcuts that now cost us
                                2 extra days per feature"
  "Scalability issue"        → "At 2x users, the system
                                becomes too slow to use"
  "p99 latency regression"   → "1 in 100 customers waits
                                over 5 seconds"

Structure for any stakeholder update:
  1. Conclusion first ("bottom line up front")
  2. What it means for THEM (cost / time / risk)
  3. Options with trade-offs
  4. The decision you need, by when</pre>
<div class="key-point">The test of a senior communicator: the stakeholder can correctly repeat your point to their own boss. If they can't, you explained technology instead of impact. Conclusion first, their language, decision needed — every time.</div>`,
      },
      {
        q: 'How do you give and receive feedback?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Give feedback that is specific, timely, and about behavior rather than personality — the SBI model (Situation, Behavior, Impact) keeps it factual: "in yesterday's review (S), the comment 'this is wrong' without explanation (B) left the junior not knowing what to fix (I)". Praise publicly and promptly; correct privately and soon. When receiving feedback, listen without defending, ask clarifying questions, thank the person, and then visibly act on it — people only keep giving feedback to those who do something with it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy đưa phản hồi cụ thể, kịp thời, và nhắm vào hành vi thay vì tính cách — mô hình SBI (Situation, Behavior, Impact) giữ cho nó dựa trên sự kiện: "trong buổi review hôm qua (S), lời nhận xét 'sai rồi' mà không giải thích (B) khiến bạn junior không biết phải sửa gì (I)". Khen công khai và kịp thời; góp ý riêng tư và sớm. Khi nhận phản hồi, hãy lắng nghe mà không phòng thủ, đặt câu hỏi làm rõ, cảm ơn người góp ý, rồi hành động một cách rõ ràng — người ta chỉ tiếp tục góp ý cho những ai thật sự làm gì đó với phản hồi nhận được.</p></details>
<pre>Giving — the SBI model:
  Situation: "In Monday's planning meeting..."
  Behavior:  "...you interrupted the QA twice mid-sentence..."
  Impact:    "...and she stopped raising concerns. We may
              have missed test risks because of it."
  (Then ask: "How did you see it?")

  ✓ Specific, recent, behavioral, private
  ✗ "You're always dismissive" (vague, personal, 'always')

Receiving:
  1. Listen fully — don't build your defense while they talk
  2. Ask for specifics: "Can you give me an example?"
  3. Thank them — even when it stings
  4. Act visibly, and follow up: "I changed X — is it better?"</pre>
<div class="key-point">The senior signal on receiving: "I actively ask for feedback, and I make it safe to give — if someone tells me something uncomfortable and I react badly, that's the last honest feedback I'll ever get from them."</div>`,
      },
      {
        q: 'How do you keep your manager and stakeholders informed? (status, risks, bad news)',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The principle is "no surprises": a manager should never first learn about a problem when it is already a crisis. Report status in terms of outcomes and risks, not activity — "on track for Friday, one risk: the vendor API is unstable, mitigation in progress" beats a list of tasks done. Deliver bad news early, with your plan attached: what happened, impact, what you are doing, what you need. Adapt the channel to the audience: short async updates for routine, a direct conversation for anything painful.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Nguyên tắc là "không có bất ngờ": người quản lý không bao giờ nên biết về một vấn đề lần đầu tiên khi nó đã thành khủng hoảng. Hãy báo cáo tình trạng theo kết quả và rủi ro, chứ không phải theo hoạt động — "đúng tiến độ cho thứ Sáu, một rủi ro: API của vendor không ổn định, đang xử lý giảm thiểu" tốt hơn một danh sách các task đã làm. Hãy đưa tin xấu sớm, kèm theo kế hoạch của bạn: chuyện gì đã xảy ra, tác động, bạn đang làm gì, bạn cần gì. Điều chỉnh kênh liên lạc theo đối tượng: cập nhật ngắn gọn bất đồng bộ cho việc thường ngày, trao đổi trực tiếp cho bất cứ điều gì khó nói.</p></details>
<pre>Status update template (30 seconds to read):

  ✅ On track / ⚠ At risk / 🔴 Blocked
  → Done since last update: (outcomes, not tasks)
  → Next: (what ships next)
  → Risks: (what could go wrong + mitigation)
  → Need from you: (decision / access / nothing)

Bad news protocol:
  1. Early — as soon as the risk is real, not at the deadline
  2. Direct channel — a call or face-to-face, not buried
     in a ticket
  3. With a plan — "here's the impact, here's what I'm
     doing, here's what I need"
  4. Follow up in writing so there's a record</pre>
<div class="key-point">"Bad news early is a gift; bad news late is a betrayal." Managers can help with a risk; they can only do damage control with a surprise. Being trusted with bad news is what gets you trusted with bigger scope.</div>`,
      },

      // ──── 6. CLOSING TOPICS ────
      {
        q: 'What are your salary expectations?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Come prepared with market research for your role, level, and location, and answer with a range whose bottom you would genuinely accept. If possible, let them state their budget first ("could you share the range for this role?"), since anchoring against their number is stronger. Frame the figure around value, not need, and mention that the total package matters — bonus, remote policy, growth, learning budget. Never lie about your current salary, and never accept pressure to decide on the spot.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy chuẩn bị trước bằng việc khảo sát thị trường cho vai trò, cấp bậc và khu vực của bạn, và trả lời bằng một khoảng lương mà mức thấp nhất bạn thật sự chấp nhận được. Nếu có thể, hãy để họ nói ngân sách trước ("anh/chị có thể chia sẻ khoảng lương cho vị trí này không?"), vì việc đàm phán dựa trên con số của họ sẽ có lợi hơn. Hãy đóng khung con số quanh giá trị bạn mang lại, không phải nhu cầu của bạn, và đề cập rằng tổng đãi ngộ cũng quan trọng — thưởng, chính sách remote, cơ hội phát triển, ngân sách học tập. Đừng bao giờ nói dối về mức lương hiện tại, và đừng chấp nhận áp lực phải quyết định ngay tại chỗ.</p></details>
<pre>Playbook:

1. RESEARCH FIRST
   → Market range for this role + level + city
     (salary reports, peers, recruiters)

2. TRY TO LET THEM ANCHOR
   → "I'm flexible for the right role — could you share
      the budgeted range?"

3. IF YOU MUST GO FIRST — GIVE A RANGE
   → "Based on my research and experience, I'm looking at
      X–Y. The full package matters too: growth path,
      remote policy, bonus."
   → Your bottom number = one you'd actually sign

4. FRAME AS VALUE
   → "Given that I can own architecture and mentor the
      team from day one, I believe X–Y is fair."

Don't:
  ✗ Apologize for your number
  ✗ Lie about current salary
  ✗ Accept on the spot — "I'd like a day to review the
    full offer" is always acceptable</pre>
<div class="key-point">The range trick: interviewers hear your bottom number as your expectation, so set the bottom of your range at a number you would genuinely be happy with — never a number you'd resent.</div>`,
      },
      {
        q: 'Do you have any questions for us?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>Always have questions — "no, everything is clear" signals low interest. Good questions do double duty: they give you real information for your decision and show what you care about. For a senior or lead role, ask about success criteria, how technical decisions are made, team health, and the biggest current challenge. Asking "what would make the person in this role successful in the first six months?" also lets you hear the real job behind the job description.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hãy luôn có câu hỏi — trả lời "không, mọi thứ đều rõ rồi" là dấu hiệu của sự thiếu quan tâm. Những câu hỏi tốt mang lại lợi ích kép: chúng cho bạn thông tin thật để ra quyết định và đồng thời thể hiện điều bạn quan tâm. Với vị trí senior hay lead, hãy hỏi về tiêu chí thành công, cách các quyết định kỹ thuật được đưa ra, sức khỏe của nhóm, và thách thức lớn nhất hiện tại. Câu hỏi "điều gì sẽ khiến người đảm nhận vị trí này thành công trong sáu tháng đầu?" cũng giúp bạn nghe được công việc thật đằng sau bản mô tả công việc.</p></details>
<pre>Strong questions for a senior/lead interview:

About the role:
  → "What would success look like in the first 6 months?"
  → "Why is this position open — growth or replacement?"

About engineering culture:
  → "How are technical decisions made — who has the final
     say on architecture?"
  → "What does your code review and release process look
     like?"
  → "How do you balance feature work vs. tech debt?"

About the team:
  → "What's the team's biggest challenge right now?"
  → "How has the team changed in the last year?"

Save for the offer stage:
  → salary details, leave policy, perks</pre>
<div class="key-point">Ask about the thing you'd actually regret not knowing: how decisions are made and what the biggest problem is. The interviewer's comfort (or discomfort) answering "what's the biggest challenge right now?" tells you more than the answer itself.</div>`,
      },
    ],
  },
];
