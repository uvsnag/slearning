// Interview data: AI-assisted development (Claude, prompt engineering, agent skills)
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'ai-assisted-dev',
    name: 'AI-Assisted Development',
    icon: '🤖',
    questions: [
      // ──── 0. AI-ASSISTED DEVELOPMENT SUMMARY — knowledge map ────
      {
        q: 'AI-Assisted Development Summary — Knowledge Map',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A revision checklist for talking about AI-assisted development in a senior interview — how you use tools like Claude day to day, how you design reusable prompts and agent skills, how you verify the output, how you measure the benefit, and how you manage the risks for a team. Concept names only; use it to spot gaps, not as a tutorial.</p></div>
<h3>1. Tools &amp; Modes</h3>
<ul>
<li>Chat assistants (Claude, ChatGPT), IDE assistants (Copilot, Cursor), agentic CLI tools (Claude Code)</li>
<li>Autocomplete vs chat vs agent (reads files, runs commands, edits code)</li>
<li>Context window, tokens, model choice (fast vs strong model)</li>
</ul>
<h3>2. Prompt Design</h3>
<ul>
<li>Role + goal + context + constraints + examples + output format</li>
<li>Few-shot examples from your own codebase</li>
<li>Step-by-step / plan-first prompts, asking for assumptions and open questions</li>
<li>Reusable prompt templates, versioned in the repo</li>
<li>Project context files (CLAUDE.md), agent skills, custom commands</li>
</ul>
<h3>3. Use Cases</h3>
<ul>
<li>Legacy migration (screen by screen), boilerplate, mappers, DTOs, MyBatis XML</li>
<li>Unit test generation, test-data builders, refactoring</li>
<li>Code explanation, reading legacy code, documentation</li>
<li>Code review assistance, SQL review, log/stack-trace analysis</li>
</ul>
<h3>4. Verification &amp; Quality</h3>
<ul>
<li>Hallucinated APIs, plausible-but-wrong logic, missing edge cases</li>
<li>Review checklist for AI code, compile + lint + test gates</li>
<li>Behaviour parity checks against the legacy system</li>
<li>Human ownership: the author is responsible, not the model</li>
</ul>
<h3>5. Risks &amp; Governance</h3>
<ul>
<li>Data privacy: customer data, secrets, credentials in prompts</li>
<li>Company IP, approved tools, enterprise plans, no-training guarantees</li>
<li>Licensing of generated code, security vulnerabilities</li>
<li>Over-reliance, skill erosion for juniors</li>
</ul>
<h3>6. Senior / Interview Hot Topics</h3>
<ul>
<li>"AI generates 60–80% of the code" — what does that mean and how do you know it's correct?</li>
<li>"10 days → 2–3 days" — how was it measured, what's included?</li>
<li>When do you NOT use AI?</li>
<li>How would you roll out AI tools to a team safely?</li>
</ul>
<div class="key-point">Interviewers aren't testing whether you can type a prompt. They test judgement: how you give the model the right context, how you verify what it produces, how you measured the gain honestly, and how you keep the team and the company's data safe.</div>`,
      },

      // ──── 1. WORKFLOW ────
      {
        q: 'How do you use AI tools like Claude in your daily development work?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>I use AI as a fast pair programmer, not as an autopilot. The biggest use in my current project is legacy screen migration: I give Claude the legacy screen code, our target conventions for Next.js, React, TypeScript and Spring Boot with MyBatis, and an example of an already migrated screen, and it produces a first draft of the UI, API and SQL mapping. I then review, fix and test that draft. Beyond migration I use it to read and explain unfamiliar legacy code, generate unit test skeletons and test data, draft repetitive code like DTOs and mappers, and analyse stack traces or slow SQL. I don't use it for final decisions on architecture, security-sensitive logic or anything I can't verify myself. The rule I follow is simple: I only merge code I understand and could have written myself.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với tôi, AI giống một người pair programming rất nhanh, chứ không phải chế độ lái tự động. Việc tôi dùng nhiều nhất ở dự án hiện tại là migrate screen legacy. Tôi đưa cho Claude code của màn hình cũ, các convention của hệ thống mới (Next.js, React, TypeScript, Spring Boot, MyBatis) và một màn hình mẫu đã migrate xong. Từ đó nó sinh ra bản nháp đầu cho UI, API và SQL mapper, rồi tôi review, sửa và test lại. Ngoài ra tôi còn dùng AI để đọc hiểu code legacy lạ, dựng khung unit test và dữ liệu test, viết mấy phần lặp đi lặp lại như DTO hay mapper, và phân tích stack trace hoặc câu SQL chậm. Còn quyết định kiến trúc, logic liên quan tới bảo mật, hay bất cứ thứ gì tôi không tự kiểm chứng được thì tôi không giao cho AI. Nguyên tắc của tôi rất đơn giản: code nào tôi hiểu và tự viết ra được thì mới merge.</p></details>
<table><tr><th>Task</th><th>How I use AI</th><th>Who decides</th></tr>
<tr><td>Legacy screen migration</td><td>First draft from a reusable prompt + example screen</td><td>Me — review, parity test</td></tr>
<tr><td>Understanding legacy code</td><td>"Explain this procedure / list the business rules"</td><td>Me — confirm with BA / data</td></tr>
<tr><td>Unit tests</td><td>Generate cases + skeletons, I add edge cases</td><td>Me</td></tr>
<tr><td>Boilerplate (DTO, mapper, MyBatis XML)</td><td>Generate from schema</td><td>Me — compile + test</td></tr>
<tr><td>Debugging</td><td>Analyse stack trace / EXPLAIN plan, suggest causes</td><td>Me — reproduce first</td></tr>
<tr><td>Architecture, security, money logic</td><td>Sounding board only</td><td>Me + team</td></tr>
</table>
<div class="key-point">Frame AI as a pair programmer that drafts and explains, while you stay the author and reviewer. "I only merge code I understand" is the sentence interviewers want to hear.</div>`,
      },
      {
        q: 'How did you design reusable Claude prompts for legacy screen migration?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I treated the prompt like a small piece of software. First I migrated a few screens by hand to establish the target pattern — folder structure, React component style, API naming, MyBatis mapper style, validation and error handling. Then I wrote a prompt template with fixed sections: the goal, the project conventions, one complete example of a legacy screen and its migrated version, the new legacy screen as input, explicit constraints such as "preserve every business rule, don't invent fields, keep SQL behaviour identical", and a required output format listing each file plus a list of business rules found and open questions. I split it into steps — analyse the legacy screen, then generate backend, then frontend — because one giant prompt gave worse results. The template lives in the repo, so the team uses the same version and we improve it when reviews find repeated mistakes.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi coi prompt như một phần mềm nhỏ, cũng phải thiết kế và bảo trì. Đầu tiên tôi tự tay migrate vài màn hình để chốt mẫu chuẩn: cấu trúc thư mục, cách viết component React, cách đặt tên API, cách viết MyBatis mapper, validation và xử lý lỗi. Sau đó tôi viết prompt template gồm các phần cố định: mục tiêu, convention của dự án, một ví dụ hoàn chỉnh (màn hình legacy kèm bản đã migrate), màn hình legacy cần làm, và các ràng buộc rõ ràng như "giữ nguyên mọi business rule, không tự bịa field, SQL phải chạy y như cũ". Đầu ra cũng có format bắt buộc: liệt kê từng file, danh sách business rule tìm được và những câu hỏi còn chưa rõ. Tôi tách ra nhiều bước — phân tích màn hình cũ, sinh backend, rồi mới sinh frontend — vì nhồi hết vào một prompt khổng lồ thì kết quả tệ hơn hẳn. Template nằm trong repo nên cả team dùng chung một bản, và mỗi lần review phát hiện một lỗi lặp lại là chúng tôi cập nhật template.</p></details>
<pre>[Role]        You are migrating a legacy logistics screen to our new stack.
[Context]     Stack: Next.js + React + TypeScript, Spring Boot, MyBatis, SQL Server.
              Conventions: see CONVENTIONS.md (naming, folders, error handling).
[Example]     Legacy: BookingList.jsp + BookingDAO.java
              Migrated: booking-list/page.tsx, BookingController, BookingMapper.xml
[Input]       Legacy screen: &lt;files of the new screen&gt;
[Constraints] - Preserve every validation and business rule exactly.
              - Do not invent fields, endpoints or tables.
              - Keep SQL semantics identical (joins, filters, sort order).
              - If something is unclear, list it as a question — don't guess.
[Steps]       1) List business rules found  2) Backend  3) Frontend
[Output]      Each file in a separate block with its path,
              then "Business rules preserved" and "Open questions".</pre>
<div class="key-point">A good reusable prompt has fixed sections: goal, conventions, a real before/after example, constraints, steps and an output format that includes "open questions". Version it in the repo and improve it from review findings.</div>`,
      },
      {
        q: 'You say AI generated 60–80% of the initial code. How do you make sure that code is correct?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The 60–80% refers to the first draft by volume — mostly layout, form wiring, DTOs, mappers and CRUD SQL. Correctness comes from the verification steps after that, which take most of my time. First I review the code the same way I would review a junior's pull request, with special attention to business rules, because AI output is fluent and looks right even when it isn't. Second, the code must pass the normal gates: compile, lint, type-check and existing tests. Third, I check behaviour parity against the legacy screen — same inputs, same results, same validation messages, same totals — using real-like test data, and I compare the SQL the new code runs with the legacy SQL. Fourth, I add unit tests for the business logic, especially edge cases the model tends to miss: nulls, empty lists, rounding, date and time zone handling. Nothing is merged until it goes through normal team code review.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Con số 60–80% là nói về bản nháp đầu tiên, tính theo khối lượng code — chủ yếu là layout, binding form, DTO, mapper và SQL CRUD. Còn chuyện code có đúng hay không thì nằm ở các bước kiểm tra phía sau, và đó mới là chỗ tôi tốn nhiều thời gian nhất. Một là review như review PR của một bạn junior, soi kỹ business rule, vì code AI viết rất trơn tru, sai mà nhìn vẫn như đúng. Hai là qua đủ các bước kiểm tra thông thường: compile, lint, type check và chạy test có sẵn. Ba là so hành vi với màn hình legacy: cùng input thì phải ra cùng kết quả, cùng message validation, cùng số tổng — test bằng dữ liệu gần với thực tế, và so luôn câu SQL mới với SQL cũ. Bốn là bổ sung unit test cho business logic, nhất là các edge case mà model hay bỏ sót: null, list rỗng, làm tròn số, ngày giờ và timezone. Và không có gì được merge nếu chưa qua code review bình thường của team.</p></details>
<pre>AI draft  ──▶ 1. Self-review (business rules first)
          ──▶ 2. Gates: compile · lint · tsc · existing tests
          ──▶ 3. Parity check vs legacy
                 - same search inputs → same rows, same order
                 - same validation messages
                 - compare generated SQL with legacy SQL
          ──▶ 4. Unit tests for logic + edge cases
          ──▶ 5. Normal team code review → merge</pre>
<p><strong>Typical AI mistakes I look for</strong>: invented columns or API methods, a missing <code>WHERE</code> condition (e.g. tenant or deleted flag), changed sort order, lost validation, wrong rounding of amounts, swallowed exceptions, and copy-pasted logic from the example screen that doesn't apply.</p>
<div class="key-point">Be honest about the number: it's the share of the first draft, not of finished work. Then describe concrete verification — review, gates, parity testing against legacy, and tests for edge cases.</div>`,
      },
      {
        q: 'How did you measure that migration time went from about 10 days to 2–3 days? How would you defend that number?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>I'd explain the baseline and the scope clearly rather than just quoting the number. The 10 days came from our task tracking for medium-complexity screens migrated before we had the prompts — from starting analysis to the screen passing review and QA. After the reusable prompts were stable, the same category of screen took 2–3 days measured the same way, start to QA pass. It's not a perfect experiment: screens differ, and the team also got more familiar with the target architecture over time, so part of the gain is learning. That's why I describe it as "about" and for medium screens only — complex screens with heavy business logic improved much less, because the time there is in understanding rules and testing, not typing. I'd also mention the quality side: defect counts found in QA didn't go up, which matters more than speed.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi sẽ nói rõ mình so với cái gì và trong phạm vi nào, chứ không chỉ đưa ra một con số. Mốc 10 ngày lấy từ dữ liệu task tracking của các màn hình độ phức tạp trung bình đã migrate trước khi có bộ prompt, tính từ lúc bắt đầu phân tích tới khi qua review và QA. Khi bộ prompt dùng chung đã ổn định, cùng loại màn hình đó chỉ còn 2–3 ngày, đo theo đúng cách cũ. Tất nhiên đây không phải thí nghiệm hoàn hảo: mỗi màn hình một khác, và team cũng quen dần với kiến trúc mới, nên một phần cải thiện là nhờ kinh nghiệm. Vì vậy tôi luôn nói "khoảng" và chỉ áp dụng cho màn hình trung bình. Màn hình phức tạp, nhiều business logic thì cải thiện ít hơn nhiều, vì thời gian ở đó nằm ở việc hiểu rule và test, chứ không phải ở việc gõ code. Tôi cũng sẽ nhắc tới chất lượng: số bug QA tìm ra không hề tăng — điểm này còn quan trọng hơn cả tốc độ.</p></details>
<table><tr><th>Question an interviewer may ask</th><th>Good answer</th></tr>
<tr><td>What exactly was measured?</td><td>Start of analysis → QA pass, from the task tracker</td></tr>
<tr><td>Which screens?</td><td>Medium complexity only; complex screens improved less</td></tr>
<tr><td>Is it all because of AI?</td><td>No — also team familiarity and established patterns</td></tr>
<tr><td>Did quality drop?</td><td>QA defect rate stayed similar; review effort went up</td></tr>
<tr><td>Where did the saved time go?</td><td>Less typing and boilerplate; more time on review and testing</td></tr>
</table>
<div class="key-point">Defend a productivity number with its baseline, scope and limits. Admitting what else contributed ("team learning, established patterns") makes the claim more credible, not less.</div>`,
      },

      // ──── 2. PROMPTS, CONTEXT & SKILLS ────
      {
        q: 'What makes a good prompt for code generation?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A good prompt gives the model the same information a new teammate would need. That means a clear goal, the relevant context — the actual files, schema and conventions, not a vague description — and explicit constraints such as which libraries to use, what not to change, and how errors should be handled. A real example from the codebase is the single most effective ingredient, because the model copies patterns very well. You should also specify the output format, for example "full file contents with paths" or "a diff only", and ask the model to list assumptions and open questions rather than guess. For larger tasks, ask for a plan first, review the plan, then let it implement step by step. And keep the context focused: dumping the whole repository dilutes attention and costs more.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Một prompt tốt là prompt cho model đúng những gì bạn sẽ đưa cho một đồng nghiệp mới vào team. Tức là: mục tiêu rõ ràng; context thật — chính các file, schema và convention của dự án, chứ không phải mô tả chung chung; và các ràng buộc cụ thể như dùng thư viện nào, không được đụng vào đâu, xử lý lỗi thế nào. Thứ hiệu quả nhất là một ví dụ thật lấy từ codebase, vì model bắt chước pattern cực giỏi. Bạn cũng nên nói rõ format đầu ra, kiểu "trả về toàn bộ file kèm đường dẫn" hay "chỉ trả về diff", và yêu cầu model liệt kê các giả định và câu hỏi còn thắc mắc, thay vì để nó tự đoán. Việc lớn thì bảo nó lên plan trước, bạn duyệt plan rồi mới cho làm từng bước. Và giữ context gọn: đổ nguyên cả repo vào chỉ làm model bị loãng và tốn thêm chi phí.</p></details>
<table><tr><th>Element</th><th>Weak</th><th>Strong</th></tr>
<tr><td>Goal</td><td>"Make a booking API"</td><td>"Add GET /bookings search with paging, matching legacy filters"</td></tr>
<tr><td>Context</td><td>"We use Spring"</td><td>Controller + mapper of a similar feature, table DDL</td></tr>
<tr><td>Constraints</td><td>—</td><td>"MyBatis XML, no JPA; reuse PageRequest; don't change DTOs"</td></tr>
<tr><td>Example</td><td>—</td><td>An existing endpoint written the team's way</td></tr>
<tr><td>Output</td><td>—</td><td>"Full files with paths, then a test list"</td></tr>
<tr><td>Uncertainty</td><td>Model guesses</td><td>"List assumptions and questions; don't invent columns"</td></tr>
</table>
<div class="key-point">Goal + real context + constraints + one real example + output format + "ask, don't guess". Plan first for big tasks, and keep the context focused.</div>`,
      },
      {
        q: 'What are project context files (like CLAUDE.md) and agent skills, and why do they help a team?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Agentic tools like Claude Code read a project context file, such as <code>CLAUDE.md</code>, at the start of every session. It holds what every prompt would otherwise repeat: how to build and test the project, the architecture, coding conventions, folder layout, and rules like "never edit generated files". That makes results consistent across developers and saves everyone from rewriting the same context. <strong>Agent skills</strong> go one step further: a skill is a packaged, reusable workflow — instructions, templates and sometimes scripts — for one kind of task, such as "migrate a legacy screen" or "write a MyBatis mapper with tests", which the agent loads when that task comes up. For a team this turns individual prompt tricks into shared, versioned assets that can be reviewed in pull requests like code and improved when someone finds a better approach.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Các tool dạng agent như Claude Code sẽ đọc một file context của dự án, ví dụ <code>CLAUDE.md</code>, mỗi khi bắt đầu phiên làm việc. Trong đó ghi những thứ mà nếu không có thì prompt nào cũng phải nhắc lại: cách build và test, kiến trúc, convention, cấu trúc thư mục, và các luật kiểu "không bao giờ sửa file generate tự động". Nhờ vậy kết quả giữa các developer đồng đều hơn, và không ai phải gõ lại cùng một đống context. <strong>Agent skill</strong> thì tiến thêm một bước: đó là một quy trình đóng gói sẵn cho một loại việc — gồm hướng dẫn, template, đôi khi có cả script — như "migrate một screen legacy" hay "viết MyBatis mapper kèm test", và agent sẽ tự load nó khi gặp đúng loại việc đó. Với team, điều này biến mẹo prompt của từng người thành tài sản chung: có version, được review trong PR như code, và ai tìm ra cách hay hơn thì cập nhật cho cả team dùng.</p></details>
<pre># CLAUDE.md (excerpt)
## Build &amp; test
- Backend: ./gradlew test     Frontend: pnpm lint &amp;&amp; pnpm test
## Architecture
- Next.js App Router in /web, Spring Boot in /api, MyBatis XML in /api/src/main/resources/mapper
## Conventions
- API paths: /api/{module}/{resource}; errors via GlobalExceptionHandler
- Every query must filter by tenant_id and del_flag = 'N'
## Never
- Edit files under /generated; commit secrets; change DB schema without a migration

.claude/skills/migrate-screen/
  SKILL.md          ← steps: analyse → backend → frontend → checklist
  template-prompt.md
  example/          ← one gold-standard migrated screen</pre>
<div class="key-point">CLAUDE.md = shared project context loaded every time. Skills = shared, versioned workflows for repeated tasks. Both turn personal prompting into team standards.</div>`,
      },

      // ──── 3. RISKS ────
      {
        q: 'What kinds of mistakes does AI-generated code typically contain?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>The dangerous mistakes are the ones that look right. Models <strong>hallucinate</strong> APIs, library methods, configuration keys or database columns that don't exist, or that exist in a different version. They produce <strong>plausible but wrong logic</strong>: an off-by-one in paging, a missing filter such as tenant ID or a soft-delete flag, a changed sort order, or rounding money with <code>double</code>. They often skip <strong>edge cases and error handling</strong> — nulls, empty results, timeouts — or swallow exceptions. They can introduce <strong>security issues</strong> like string-concatenated SQL or MyBatis <code>&#36;{}</code> substitution, missing authorization checks, or logging sensitive data. And they may <strong>copy patterns blindly</strong> from the example you gave, including parts that don't apply. Tests the model writes for its own code can share the same misunderstanding, so they pass while the behaviour is wrong.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Lỗi nguy hiểm nhất là lỗi nhìn qua tưởng đúng. Model hay <strong>hallucinate</strong>: bịa ra API, hàm thư viện, key config hay cột database không tồn tại, hoặc chỉ có ở version khác. Nó viết ra <strong>logic nghe rất hợp lý nhưng sai</strong>: phân trang lệch một đơn vị, quên điều kiện lọc như tenant ID hay cờ soft delete, đảo thứ tự sort, hoặc làm tròn tiền bằng <code>double</code>. Nó hay bỏ qua <strong>edge case và xử lý lỗi</strong> — null, kết quả rỗng, timeout — hoặc nuốt luôn exception. Nó còn có thể tạo ra <strong>lỗ hổng bảo mật</strong> như nối chuỗi SQL hay dùng <code>&#36;{}</code> trong MyBatis, thiếu kiểm tra phân quyền, hoặc log cả dữ liệu nhạy cảm. Ngoài ra nó hay <strong>bắt chước máy móc</strong> ví dụ bạn đưa, kể cả những phần không áp dụng được. Cái bẫy cuối cùng: test do chính model viết cho code của nó thường mang cùng một cách hiểu sai, nên test vẫn xanh mà hành vi thì sai.</p></details>
<table><tr><th>Mistake</th><th>Example</th><th>How to catch it</th></tr>
<tr><td>Hallucinated API</td><td><code>StringUtils.isBlankOrNull()</code></td><td>Compile, IDE, check docs/version</td></tr>
<tr><td>Missing filter</td><td>No <code>tenant_id</code> / <code>del_flag</code> in WHERE</td><td>Review checklist, parity test</td></tr>
<tr><td>Money / dates</td><td><code>double</code> amounts, wrong time zone</td><td>Tests with real values, review</td></tr>
<tr><td>Security</td><td>MyBatis <code>&#36;{keyword}</code>, no auth check</td><td>Review, SAST, security checklist</td></tr>
<tr><td>Swallowed errors</td><td><code>catch (Exception e) {}</code></td><td>Lint rules, review</td></tr>
<tr><td>Self-confirming tests</td><td>Test asserts the bug</td><td>Write expected values from the spec, not the code</td></tr>
</table>
<div class="key-point">AI code fails in fluent, plausible ways. Review it for business rules, filters, money/date handling and security — and derive test expectations from the requirement or legacy system, never from the generated code.</div>`,
      },
      {
        q: 'What are the security, privacy and IP risks of using AI tools on company code, and how do you manage them?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The main risk is data leaving the company. Anything you paste into a prompt goes to the provider, so customer data, personal information, credentials, connection strings and confidential business logic must not go into a tool the company hasn't approved. The way to manage it is policy plus tooling: use only company-approved tools on enterprise or business plans that contractually don't train on your data and have retention controls; never paste production data — use masked or synthetic samples; keep secrets out of source and out of prompts; and configure agent tools so they can't read files like <code>.env</code>. There's also the risk of generated code containing vulnerabilities or code resembling licensed open source, which is handled with the same review, security scanning and dependency checks as human code. Finally, agents that run commands need limited permissions, so a wrong action can't damage production.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Rủi ro lớn nhất là dữ liệu bị đưa ra ngoài công ty. Thứ gì bạn dán vào prompt cũng được gửi tới nhà cung cấp, nên dữ liệu khách hàng, thông tin cá nhân, credential, connection string hay business logic mật tuyệt đối không được đưa vào tool chưa được công ty duyệt. Cách quản lý là kết hợp chính sách với cấu hình tool. Chỉ dùng tool công ty đã duyệt, ở gói enterprise hoặc business, có cam kết trong hợp đồng là không dùng dữ liệu của bạn để train và có kiểm soát thời gian lưu. Không bao giờ dán dữ liệu production — dùng dữ liệu đã mask hoặc dữ liệu giả. Secret thì để ngoài source code và ngoài prompt, và cấu hình agent để nó không đọc được các file như <code>.env</code>. Rủi ro thứ hai là code sinh ra có lỗ hổng, hoặc giống code open source có license; cái này xử lý bằng đúng quy trình review, security scan và kiểm tra dependency như với code người viết. Cuối cùng, agent được phép chạy lệnh thì phải giới hạn quyền, để lỡ có thao tác sai cũng không ảnh hưởng tới production.</p></details>
<table><tr><th>Risk</th><th>Control</th></tr>
<tr><td>Code / IP leaves the company</td><td>Approved tools only, enterprise plan, no-training + retention terms</td></tr>
<tr><td>Customer / personal data in prompts</td><td>Masked or synthetic data only; never production dumps</td></tr>
<tr><td>Secrets in prompts or context</td><td>Secret manager, deny-list <code>.env</code> / key files for agents</td></tr>
<tr><td>Insecure generated code</td><td>Code review, SAST, dependency scanning in CI</td></tr>
<tr><td>License contamination</td><td>Review unusual large snippets, provider IP indemnity, SCA tools</td></tr>
<tr><td>Agent runs a harmful command</td><td>Permission prompts, sandbox, no production credentials locally</td></tr>
</table>
<div class="key-point">Treat a prompt like sending data to a third party: approved tools, no real customer data, no secrets, and the same security review for AI code as for human code.</div>`,
      },
      {
        q: 'When should you NOT use AI to write code?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>I avoid relying on AI when I can't verify the result, when the cost of a subtle mistake is very high, or when the work is mostly about understanding rather than typing. Concretely: security-critical code such as authentication, authorization and cryptography; money and accounting calculations, where I may let AI draft but I write the expected values and tests myself; complex concurrency and distributed-transaction logic, where bugs only show up under load; and design decisions that depend on business context the model doesn't have. I also don't use it when the input would include data I'm not allowed to share, or when a junior is learning a concept for the first time and needs to struggle with it. And for small, precise changes it's often faster to just write the code than to explain the task.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi không dựa vào AI khi không tự kiểm chứng được kết quả, khi một lỗi nhỏ cũng gây hậu quả lớn, hoặc khi phần việc chính là hiểu vấn đề chứ không phải gõ code. Cụ thể là: code liên quan bảo mật như authentication, phân quyền, mã hóa; các phép tính tiền và kế toán — AI có thể viết nháp, nhưng kết quả mong đợi và test thì tôi tự viết; logic concurrency phức tạp và transaction phân tán, nơi bug chỉ lộ ra khi chạy tải thật; và các quyết định thiết kế cần hiểu nghiệp vụ mà model không hề có. Tôi cũng không dùng khi input có dữ liệu không được phép chia sẻ, hoặc khi một bạn junior đang học một khái niệm lần đầu và cần tự mày mò. Còn với những thay đổi nhỏ, rõ ràng thì nhiều khi tự sửa còn nhanh hơn ngồi giải thích cho AI.</p></details>
<table><tr><th>Situation</th><th>Why</th><th>Instead</th></tr>
<tr><td>Auth, permissions, crypto</td><td>Subtle bug = breach</td><td>Proven libraries + careful human review</td></tr>
<tr><td>Money / billing / accounting</td><td>Rounding and rule errors are costly</td><td>AI draft at most; human-written tests</td></tr>
<tr><td>Concurrency, sagas, locking</td><td>Bugs appear only under load</td><td>Design on paper, review with team</td></tr>
<tr><td>Can't share the input</td><td>Customer or confidential data</td><td>Masked sample, or don't use AI</td></tr>
<tr><td>Junior learning a concept</td><td>Skips the learning</td><td>Write first, use AI to review</td></tr>
<tr><td>Tiny, precise edit</td><td>Explaining takes longer</td><td>Just write it</td></tr>
</table>
<div class="key-point">Don't use AI where you can't verify the output, where a subtle mistake is very expensive, or where the data can't leave the company. Knowing the limits is what makes you credible.</div>`,
      },

      // ──── 4. TEAM ────
      {
        q: 'How would you roll out AI-assisted development to a team, and what review standards apply to AI-generated code?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>I'd start small and make it a team practice rather than individual habit. First agree on the rules with management and security: which tools are approved and what data may never be shared. Then pilot on one well-suited task — in our case medium-complexity screen migration — with a few people, build and refine shared prompt templates and a project context file, and measure time and defects against a baseline. Once it works, document it, run a short session for the team, and keep the prompts in the repository so improvements are reviewed like code. For review, the standard is that AI code is held to exactly the same bar as human code, and the author owns it completely: they must be able to explain every line. We added a few checklist items specific to AI output — check for invented APIs, missing filters and lost business rules — and asked for larger AI-generated changes to be split into reviewable pull requests.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi sẽ bắt đầu nhỏ, và biến nó thành cách làm chung của team chứ không phải thói quen riêng của vài người. Trước hết, thống nhất luật chơi với quản lý và bên security: tool nào được dùng, dữ liệu nào tuyệt đối không được đưa vào. Sau đó chạy thử trên một loại việc phù hợp — với chúng tôi là migrate các màn hình độ phức tạp trung bình — với vài người. Trong lúc đó xây dựng prompt template dùng chung và file context của dự án, rồi đo thời gian và số bug so với trước. Khi thấy hiệu quả thì viết tài liệu, tổ chức một buổi chia sẻ ngắn cho cả team, và để prompt trong repo để mọi thay đổi đều được review như code. Về review, tiêu chuẩn là code AI viết phải đạt đúng chuẩn như code người viết, và người tạo PR chịu trách nhiệm hoàn toàn: phải giải thích được từng dòng. Chúng tôi thêm vài mục vào checklist dành riêng cho code AI — API bị bịa, thiếu điều kiện lọc, business rule bị rơi mất — và yêu cầu thay đổi lớn do AI sinh ra phải chia thành các PR đủ nhỏ để review được.</p></details>
<pre>Rollout
  1. Rules      approved tools, forbidden data, who owns the policy
  2. Pilot      one task type, 2–3 people, baseline metrics
  3. Assets     prompt templates, CLAUDE.md, skills — in the repo
  4. Measure    lead time, QA defects, review comments
  5. Share      demo + guideline, pair with less experienced devs
  6. Improve    update prompts from repeated review findings

Review checklist additions for AI-generated code
  [ ] Author can explain every line
  [ ] No invented APIs / columns / config keys
  [ ] Business rules match legacy or spec (list them in the PR)
  [ ] Tenant / soft-delete / permission filters present
  [ ] No &#36;{} in MyBatis, no string-built SQL, no secrets in logs
  [ ] PR small enough to review (&lt; ~400 lines of logic)</pre>
<div class="key-point">Rules first, pilot, shared versioned prompts, measure, then scale. In review: same bar as human code, author fully owns it, plus a short AI-specific checklist.</div>`,
      },
      {
        q: 'How do you test AI-generated code, and how does AI affect junior developers?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>For testing, the key rule is that expected results must come from an independent source — the specification, the legacy system's actual output, or a value calculated by hand — never from reading the generated code. AI is useful for drafting test skeletons and listing cases, but I add the edge cases myself and check that each test fails when the logic is broken, otherwise it proves nothing. For migrations, parity tests that run the same inputs through the old and new system are the strongest check. For juniors, AI is a double-edged tool. It can explain code and speed them up, but if they accept output they don't understand, they stop building the skills to debug and design. So I ask juniors to try a problem themselves first, use AI to review or explain rather than to write, and be able to walk through their code in review without the tool. Used that way, it becomes a patient tutor instead of a shortcut.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Về test, nguyên tắc quan trọng nhất là kết quả mong đợi phải đến từ một nguồn độc lập: spec, kết quả thật của hệ thống legacy, hoặc con số tự tính tay — chứ không bao giờ lấy bằng cách đọc lại code AI vừa sinh. AI rất được việc khi dựng khung test và liệt kê các case, nhưng edge case thì tôi tự bổ sung, và tôi kiểm tra là test sẽ fail khi cố tình làm hỏng logic — không thì test đó chẳng chứng minh được gì. Với migration, cách kiểm tra mạnh nhất là parity test: chạy cùng một input qua hệ thống cũ và mới rồi so kết quả. Còn với junior, AI là con dao hai lưỡi. Nó giúp giải thích code và làm nhanh hơn, nhưng nếu các bạn cứ nhận code mà không hiểu thì kỹ năng debug và thiết kế sẽ dậm chân tại chỗ. Vì vậy tôi yêu cầu junior tự giải bài trước, dùng AI để review hoặc giải thích chứ không phải viết hộ, và khi review phải tự trình bày được code của mình mà không cần tool. Dùng như vậy thì AI là một người thầy kiên nhẫn, chứ không phải lối tắt.</p></details>
<pre>// Expected values come from the legacy system / spec, not the new code
@ParameterizedTest
@CsvSource({
  // weight, volume, legacyChargeableWeight  (captured from legacy screen)
  "100.0, 0.5,  100.0",
  "50.0,  1.2,  200.0",    // volumetric wins: 1.2 m³ × 166.67
  "0.0,   0.0,  0.0"
})
void chargeableWeight_matchesLegacy(BigDecimal w, BigDecimal v, BigDecimal expected) {
  assertThat(calc.chargeableWeight(w, v)).isEqualByComparingTo(expected);
}
// Sanity check: break the formula on purpose → this test must go red.</pre>
<ul>
<li><strong>Parity tests</strong>: same search criteria against old and new endpoints, compare rows and totals.</li>
<li><strong>Mutation thinking</strong>: if you can delete a line of logic and all tests still pass, the tests are too weak.</li>
<li><strong>Juniors</strong>: "try first, then ask AI", explain your PR without the tool, use AI as a reviewer and tutor.</li>
</ul>
<div class="key-point">Test AI code against independent expectations (spec, legacy output), and make sure tests can fail. For juniors, use AI to explain and review — not to replace the thinking they need to learn.</div>`,
      },
    ],
  },
];
