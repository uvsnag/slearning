// Interview data: legacy system modernization
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'legacy-modernization',
    name: 'Legacy Modernization',
    icon: '🏚️',
    questions: [
      // ──── 0. LEGACY MODERNIZATION SUMMARY — knowledge map ────
      {
        q: 'Legacy Modernization Summary — Knowledge Map',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>A revision checklist for modernizing a legacy enterprise system: choosing a strategy, recovering hidden business rules, proving behaviour parity, running old and new side by side, and organising a large team around the migration. Concept names only; use it to spot gaps, not as a tutorial.</p></div>
<h3>1. Strategy</h3>
<ul>
<li>Rewrite (big bang) vs refactor in place vs strangler fig (incremental replacement)</li>
<li>The 6 Rs: retain, retire, rehost, replatform, refactor, rebuild</li>
<li>Migration unit: screen, module, business capability</li>
<li>Prioritization: business value × risk × dependency × usage</li>
</ul>
<h3>2. Understanding the Legacy</h3>
<ul>
<li>Undocumented business rules: code archaeology, SQL/stored procedures, logs, users</li>
<li>Domain experts and key users, "tribal knowledge"</li>
<li>Behaviour inventory per screen (fields, validations, buttons, side effects)</li>
<li>Bugs that users depend on ("bug-compatible" decisions)</li>
</ul>
<h3>3. Proving Parity</h3>
<ul>
<li>Characterization tests, golden-master / snapshot testing</li>
<li>Parity testing: same input → compare old vs new outputs</li>
<li>Shadow traffic / dark launch, data reconciliation reports</li>
<li>Money and dates: BigDecimal, rounding mode, timezone, cut-off rules</li>
</ul>
<h3>4. Coexistence &amp; Rollout</h3>
<ul>
<li>Routing at gateway / menu level, feature flags per tenant or per user group</li>
<li>Shared database: expand-and-contract schema changes, compatibility views</li>
<li>Stored-procedure-heavy logic: call, wrap, or port</li>
<li>Pilot users, staged rollout, rollback plan, decommissioning old code</li>
</ul>
<h3>5. Team &amp; Delivery</h3>
<ul>
<li>Conventions, shared component library, reference screen ("golden screen")</li>
<li>Code review checklists, definition of done for a migrated screen</li>
<li>Estimation by complexity tiers, tracking burn-down per module</li>
<li>AI-assisted migration with human review</li>
</ul>
<h3>6. Senior / Interview Hot Topics</h3>
<ul>
<li>Why big-bang rewrites fail (second-system effect, moving target, lost rules)</li>
<li>How do you know the new screen behaves the same?</li>
<li>How do you migrate without a freeze on new features?</li>
<li>How do you measure success of a modernization?</li>
</ul>
<div class="key-point">The story interviewers want: incremental migration (strangler), explicit discovery of business rules, automated parity checks against the old system, a reversible rollout, and metrics that show it worked.</div>`,
      },

      // ──── 1. STRATEGY ────
      {
        q: 'Rewrite, refactor or strangler fig — how do you choose a modernization strategy?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>A <strong>big-bang rewrite</strong> builds the new system in parallel and switches over on one day. It looks clean but is the riskiest option: the old system keeps changing while you rebuild, years of undocumented rules get lost, and there is no value until the very end. <strong>Refactoring in place</strong> is safest when the technology is still acceptable and the problem is code quality, but it cannot get you off a dead UI framework or runtime. The <strong>strangler fig</strong> approach replaces the system piece by piece — one screen or one capability at a time — while the old and new parts run together and traffic moves over gradually. For an enterprise platform with many modules and live users, like a logistics system covering freight, warehouse and accounting, strangler is almost always the right default: each step delivers value, each step can be rolled back, and the rules are verified one screen at a time.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Rewrite kiểu big bang</strong> — xây hẳn hệ thống mới rồi chuyển sang trong một lần — nghe thì gọn nhưng rủi ro nhất. Trong lúc bạn xây lại, hệ thống cũ vẫn tiếp tục thay đổi; các business rule không có tài liệu dễ bị rơi rớt; và phải đợi tới cuối dự án mới thấy được giá trị. <strong>Refactor tại chỗ</strong> thì an toàn nhất, nhưng chỉ hợp khi công nghệ còn dùng được và vấn đề nằm ở chất lượng code; nó không giúp bạn thoát khỏi một UI framework hay runtime đã lỗi thời. <strong>Strangler fig</strong> thì thay dần từng phần — mỗi lần một screen hoặc một nghiệp vụ — trong khi cũ và mới chạy song song, và người dùng được chuyển sang từ từ. Với một nền tảng doanh nghiệp nhiều module, đang có người dùng thật, như hệ thống logistics gồm vận tải, kho và kế toán, thì gần như lúc nào strangler cũng là lựa chọn đúng: bước nào cũng ra giá trị, bước nào cũng rollback được, và business rule được kiểm chứng theo từng screen.</p></details>
<table><tr><th></th><th>Big-bang rewrite</th><th>Refactor in place</th><th>Strangler fig</th></tr>
<tr><td>Value delivered</td><td>Only at the end</td><td>Continuous, small</td><td>Continuous, per slice</td></tr>
<tr><td>Risk</td><td>Very high</td><td>Low</td><td>Medium, controlled</td></tr>
<tr><td>Changes tech stack</td><td>Yes</td><td>No</td><td>Yes, gradually</td></tr>
<tr><td>Rollback</td><td>Hard</td><td>Easy</td><td>Per slice</td></tr>
<tr><td>Fits</td><td>Small, well-understood systems</td><td>OK stack, messy code</td><td>Large, live, business-critical systems</td></tr>
</table>
<pre>Strangler in practice (CARIS-style):
  [Legacy shell / menu] ──▶ old screen  (not migrated yet)
                       └──▶ new Next.js screen ──▶ Spring Boot API ──▶ same SQL Server DB
  Move one screen at a time → verify parity → switch menu entry → retire old screen</pre>
<div class="key-point">Default to strangler for large live systems. Justify any big-bang rewrite with why the system is small, well understood, or truly frozen — interviewers want to hear that you know why rewrites fail.</div>`,
      },
      {
        q: 'How do you prioritize and sequence which screens or modules to migrate first?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I score each candidate on business value, risk, dependencies and usage, and the sequence comes from those scores rather than from the menu order. The first slice should be a <strong>low-risk, medium-complexity screen</strong> that exercises the whole new stack — routing, auth, the grid and form components, an API, a database call — so it becomes the reference implementation everyone copies. After that, move along dependency lines: shared master-data screens like customers, ports and currencies come before the transaction screens that depend on them, and read-only inquiry screens come before screens that post to accounting. Highest-risk areas like billing and invoicing go later, once the team, the shared components and the parity tooling are mature. Screens almost nobody uses are candidates for retirement rather than migration.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi không migrate theo thứ tự trên menu. Tôi chấm điểm từng screen theo giá trị nghiệp vụ, mức rủi ro, mức phụ thuộc và tần suất sử dụng, rồi xếp thứ tự dựa vào đó. Screen đầu tiên nên là loại <strong>rủi ro thấp, độ phức tạp vừa phải</strong>, nhưng phải đi qua đủ cả stack mới — routing, xác thực, grid, form, API, truy vấn database — để nó thành mẫu chuẩn cho cả team làm theo. Sau đó đi theo chiều phụ thuộc: dữ liệu master dùng chung như khách hàng, cảng, tiền tệ làm trước các screen giao dịch dùng tới chúng; screen chỉ tra cứu làm trước screen có ghi bút toán sang kế toán. Những vùng nguy hiểm nhất như billing hay xuất hóa đơn thì để sau, khi team đã quen tay, component dùng chung đã ổn và công cụ kiểm tra parity đã sẵn sàng. Còn screen gần như không ai dùng thì nên tính chuyện bỏ luôn, khỏi migrate.</p></details>
<table><tr><th>Factor</th><th>Question</th><th>Effect on order</th></tr>
<tr><td>Usage</td><td>How many users / hits per day?</td><td>Unused → retire, not migrate</td></tr>
<tr><td>Dependencies</td><td>Does it rely on master data or other screens?</td><td>Dependencies first</td></tr>
<tr><td>Risk</td><td>Does it post money, send EDI, affect customers?</td><td>High risk → later, with more verification</td></tr>
<tr><td>Complexity</td><td>Fields, grids, business rules, stored procedures</td><td>Start medium, not trivial or hardest</td></tr>
<tr><td>Value</td><td>Pain in the old screen, new feature requests waiting</td><td>Higher value → earlier</td></tr>
</table>
<pre>Wave 1: reference screen + shell, auth, shared grid/form
Wave 2: master data (customer, port, carrier, currency)
Wave 3: inquiry / read-only screens (shipment search, tracking)
Wave 4: transactional screens (booking, warehouse receipt)
Wave 5: accounting / billing / EDI — strictest parity checks</pre>
<div class="key-point">First migrate a representative screen that becomes the template, then follow dependencies, and leave money-moving screens until your tooling and team are proven.</div>`,
      },

      // ──── 2. UNDERSTANDING THE LEGACY ────
      {
        q: 'How do you discover undocumented business rules in a legacy system?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>In a system that has run for ten or more years, the code <em>is</em> the specification, so I use several sources and cross-check them. First, read the code end to end for each screen, including the parts people forget: client-side validation, hidden fields, event handlers on grid cells, and especially SQL, stored procedures and triggers, where much of the logic usually lives. Second, sit with real users and watch them work, because they know the workarounds and the cases that matter at month-end. Third, look at production data and logs to see which branches actually run — a rule that never fires may not be worth porting. I record each rule in a per-screen behaviour inventory with an example input and the expected output, and those examples become the parity tests. When I find behaviour that looks like a bug, I don't silently fix it; I confirm with the business whether to keep it, because users or downstream reports may depend on it.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Hệ thống chạy mười năm thì code <em>chính là</em> tài liệu đặc tả, nên tôi lấy thông tin từ nhiều nguồn rồi đối chiếu với nhau. Một là đọc code của từng screen từ đầu tới cuối, kể cả mấy chỗ hay bị bỏ qua: validate phía client, field ẩn, event trên từng ô của grid, và nhất là SQL, stored procedure, trigger — nơi thường giấu phần lớn logic. Hai là ngồi cạnh người dùng thật xem họ làm việc, vì họ mới biết các mẹo lách và những case chỉ xảy ra lúc chốt sổ cuối tháng. Ba là xem dữ liệu production và log để biết nhánh nào thực sự có chạy — rule chưa bao giờ được kích hoạt thì có khi không cần chuyển. Mỗi rule tôi ghi vào một bảng hành vi theo screen, kèm ví dụ input và output mong đợi; chính các ví dụ này sau đó thành test parity. Gặp hành vi trông như bug thì tôi không âm thầm sửa, mà hỏi lại phía nghiệp vụ có giữ không, vì có thể người dùng hoặc báo cáo phía sau đang dựa vào nó.</p></details>
<ul>
<li><strong>Code</strong>: UI event handlers, validation, hidden/computed fields, SQL, stored procedures, triggers, batch jobs.</li>
<li><strong>People</strong>: key users, BA, support team, old tickets and change requests.</li>
<li><strong>Data</strong>: production data distributions, logs, audit tables — which paths actually execute.</li>
<li><strong>Configuration</strong>: per-tenant settings, code tables, flags that switch behaviour.</li>
</ul>
<pre>Behaviour inventory — Booking screen (excerpt)
| # | Rule                                          | Source              | Example                        |
|---|-----------------------------------------------|---------------------|--------------------------------|
| 1 | ETD cannot be before booking date             | JS onChange         | 2025-03-01 &lt; 2025-03-02 → error |
| 2 | Container qty required when mode = FCL        | SP usp_SaveBooking  | FCL, qty null → error          |
| 3 | Office code defaults from user's branch       | hidden field        | user HCM → office SGN          |
| 4 | Rounding of freight amount = HALF_UP, 2 dp    | SP calc             | 10.005 → 10.01                 |
| 5 | Tenant X skips credit check (config flag)     | code table          | tenant X → no warning          |</pre>
<div class="key-point">Treat legacy code, users and production data as three independent sources of truth. Write every rule down with a concrete example — that list becomes your parity test suite.</div>`,
      },
      {
        q: 'The legacy logic lives mostly in stored procedures. Do you port it to Java or keep calling it?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>It depends on the procedure, so I classify them instead of making one global decision. Procedures that are <strong>set-based and data-heavy</strong> — month-end closing, bulk recalculation, large reports — often perform better in the database, so I keep calling them from the new backend through MyBatis and wrap them behind a clear service interface. Procedures that hold <strong>business decision logic</strong> — validations, pricing, status transitions — are better ported to Java, where they can be unit tested, reviewed and reused, but only after characterization tests capture their current behaviour. Procedures that are shared with other systems or batch jobs stay in place until every caller is migrated. The important principle is not to port and change behaviour in the same step: first wrap and test, then port with parity checks, then improve.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Không có một câu trả lời chung cho mọi procedure, nên tôi chia chúng thành từng nhóm. Nhóm <strong>xử lý theo tập, nặng dữ liệu</strong> — chốt sổ cuối tháng, tính lại hàng loạt, báo cáo lớn — thường chạy trong database nhanh hơn, nên tôi vẫn gọi chúng từ backend mới qua MyBatis, chỉ bọc lại sau một service interface rõ ràng. Nhóm chứa <strong>logic quyết định nghiệp vụ</strong> — validate, tính giá, chuyển trạng thái — thì nên port sang Java để còn unit test, review và tái sử dụng được, nhưng chỉ làm sau khi đã có characterization test ghi lại hành vi hiện tại. Còn procedure đang được hệ thống khác hoặc batch job dùng chung thì giữ nguyên cho tới khi mọi bên gọi đã chuyển xong. Nguyên tắc của tôi: đừng vừa port vừa đổi hành vi trong cùng một bước. Bọc lại và viết test trước, port có kiểm tra parity sau, rồi mới tính chuyện cải tiến.</p></details>
<table><tr><th>Procedure type</th><th>Decision</th><th>Why</th></tr>
<tr><td>Set-based batch, reports, closing</td><td>Keep, call via MyBatis</td><td>Database does it faster; low change rate</td></tr>
<tr><td>Validation, pricing, status rules</td><td>Port to Java (after tests)</td><td>Testable, reviewable, reusable</td></tr>
<tr><td>Shared with other systems / jobs</td><td>Keep until all callers migrate</td><td>Avoid two diverging copies</td></tr>
<tr><td>Dead or unused</td><td>Retire</td><td>Confirm with logs / execution stats</td></tr>
</table>
<pre>&lt;!-- MyBatis: wrap an existing SQL Server procedure --&gt;
&lt;select id="calcFreight" statementType="CALLABLE" resultMap="FreightResult"&gt;
  { call usp_CalcFreight(
      #{bookingNo, mode=IN, jdbcType=VARCHAR},
      #{tenantId,  mode=IN, jdbcType=VARCHAR}) }
&lt;/select&gt;

// Java side: callers depend on the interface, not the procedure
public interface FreightCalculator { FreightResult calculate(String bookingNo, String tenantId); }
// v1: SpFreightCalculator (calls usp_CalcFreight)
// v2: JavaFreightCalculator (ported) — switched by flag after parity passes</pre>
<div class="key-point">Classify procedures: keep the set-based heavy ones, port decision logic after characterization tests, and hide both behind one interface so you can switch implementations safely.</div>`,
      },

      // ──── 3. PROVING PARITY ────
      {
        q: 'How do you prove the migrated screen behaves the same as the old one? (characterization and parity testing)',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>I don't rely on manual testing alone; I build automated evidence. <strong>Characterization tests</strong> capture what the old code actually does today — not what it should do — by running real inputs through it and recording the outputs as the expected result, a technique also called golden master. For the backend I run the same inputs through the old path and the new API and compare results field by field, ignoring known differences like timestamps or generated IDs. For data-writing screens I compare the database state after the old and the new flow, and for reports I reconcile totals and row counts. Before switching users over, a pilot group uses the new screen on real work while I reconcile the results daily. Any difference is triaged: a bug in the new code, an intentional change agreed with the business, or a bug in the old code that we decide to keep or fix.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi không trông vào test tay, mà dựng bằng chứng tự động. <strong>Characterization test</strong> (còn gọi là golden master) ghi lại những gì code cũ <em>đang thực sự làm</em> hôm nay — không phải những gì nó nên làm — bằng cách cho dữ liệu thật chạy qua rồi lưu output lại làm kết quả mong đợi. Ở backend, tôi cho cùng một bộ input chạy qua luồng cũ và API mới, rồi so từng field, bỏ qua những khác biệt đã biết như timestamp hay ID tự sinh. Với screen có ghi dữ liệu thì so trạng thái database sau hai luồng; với báo cáo thì đối soát tổng tiền và số dòng. Trước khi chuyển hết người dùng, cho một nhóm pilot dùng screen mới với công việc thật, và tôi đối soát kết quả mỗi ngày. Khác biệt nào cũng phải được phân loại: bug của code mới, thay đổi có chủ đích đã thống nhất với nghiệp vụ, hay bug của code cũ mà team quyết định giữ hoặc sửa.</p></details>
<pre>Parity harness (backend)
for each case in recorded_inputs:          # captured from prod-like data
    old = callLegacy(case)                 # legacy endpoint / SP
    new = callNewApi(case)                 # Spring Boot API
    diff = compare(old, new, ignore=["updatedAt", "id"],
                   numeric=BigDecimalExact)
    if diff: report(case, diff)

Result: 1,240 cases · 1,231 equal · 9 diffs
  6 → new bug (fixed)
  2 → legacy bug, business approved fix (documented)
  1 → legacy bug, kept for compatibility (report depends on it)</pre>
<pre>// JUnit golden-master style test
@ParameterizedTest
@MethodSource("goldenCases")             // JSON files: input + legacy output
void matchesLegacy(GoldenCase c) {
  var actual = bookingService.save(c.input());
  assertThat(actual).usingRecursiveComparison()
      .ignoringFields("id", "createdAt")
      .isEqualTo(c.expectedFromLegacy());
}</pre>
<div class="key-point">"Same behaviour" must be measured, not assumed: record legacy outputs as golden masters, compare old vs new automatically, reconcile real pilot data, and triage every difference explicitly.</div>`,
      },
      {
        q: 'How do you prevent regressions in accounting and billing numbers during a migration?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>Money is where small technical differences turn into real incidents, so I control the usual suspects explicitly. Amounts use <code>BigDecimal</code> in Java and a decimal library or integer minor units in TypeScript — never <code>double</code> or plain JavaScript numbers for calculations. Rounding must match the legacy exactly: the same mode (HALF_UP versus banker's rounding), the same number of decimals per currency, and the same <em>place</em> in the calculation, because rounding each line and then summing gives a different total from summing and then rounding. Dates are the second trap: business dates such as ETD or invoice date should be date-only values, and timestamps must be converted with a clear timezone per office, since an off-by-one-day error moves an invoice into another accounting period. Exchange-rate selection rules and period cut-offs are copied exactly. Then I verify with reconciliation: totals per customer, per currency and per period from old and new must match to the cent before go-live.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Với tiền, chỉ một khác biệt kỹ thuật nhỏ cũng thành sự cố thật, nên tôi kiểm soát chặt mấy thủ phạm quen mặt. Số tiền thì dùng <code>BigDecimal</code> bên Java, còn bên TypeScript dùng thư viện decimal hoặc lưu theo đơn vị nhỏ nhất dạng số nguyên — tuyệt đối không tính bằng <code>double</code> hay number thường của JavaScript. Cách làm tròn phải khớp y hệt hệ thống cũ: cùng kiểu (HALF_UP hay làm tròn kiểu ngân hàng), cùng số chữ số thập phân cho từng loại tiền, và cùng <em>chỗ</em> làm tròn — vì làm tròn từng dòng rồi cộng sẽ ra tổng khác với cộng hết rồi mới làm tròn. Cái bẫy thứ hai là ngày tháng: ngày nghiệp vụ như ETD hay ngày hóa đơn nên lưu dạng chỉ có ngày, còn timestamp phải quy đổi theo múi giờ rõ ràng của từng văn phòng — lệch một ngày thôi là hóa đơn nhảy sang kỳ kế toán khác. Rule chọn tỷ giá và mốc khóa kỳ cũng phải chép lại đúng y. Cuối cùng là đối soát: tổng theo khách hàng, theo loại tiền, theo kỳ giữa hệ thống cũ và mới phải khớp tới từng xu rồi mới go-live.</p></details>
<pre>// ❌ Floating point
0.1 + 0.2                        // 0.30000000000000004 (JS)
new BigDecimal(0.1)              // 0.1000000000000000055511... (Java)

// ✅ Java
BigDecimal amt = new BigDecimal("10.005").setScale(2, RoundingMode.HALF_UP); // 10.01
// Match legacy rounding PLACE:
//   legacy: round each line → sum      (sum of rounded)
//   naive : sum → round once           (can differ by 0.01 per invoice)

// ✅ TypeScript: don't calculate money on the client; display server values.
// If you must, use a decimal lib or integer minor units:
const cents = 1005;                // 10.05 USD
// Currency scale: VND 0 dp, USD 2 dp, KWD 3 dp</pre>
<table><tr><th>Trap</th><th>Control</th></tr>
<tr><td>Floating point</td><td>BigDecimal / decimal library, string constructors</td></tr>
<tr><td>Rounding mode and place</td><td>Copy legacy exactly; golden tests per currency</td></tr>
<tr><td>Timezone / date shift</td><td>LocalDate for business dates, explicit office timezone</td></tr>
<tr><td>Exchange rate choice</td><td>Same rate date rule (booking date vs invoice date)</td></tr>
<tr><td>Period cut-off</td><td>Same closing rules; test month-end boundaries</td></tr>
</table>
<div class="key-point">For money: BigDecimal, identical rounding mode and rounding place, date-only business dates with explicit timezones — and reconcile totals per customer, currency and period before go-live.</div>`,
      },

      // ──── 4. COEXISTENCE & ROLLOUT ────
      {
        q: 'How do you run the old and new systems side by side, and how do you roll back?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>Coexistence needs one entry point that decides, per screen, whether a user gets the old or the new version. That can be the application menu, a reverse proxy or gateway route, or a feature flag evaluated per tenant, per office or per user group. Both versions read and write the same database during the transition, so a user can switch back and their data is still there — that is what makes rollback cheap. The rollout goes in stages: internal testers, then a pilot group of key users, then one tenant or office, then everyone. Rollback is a flag change, not a redeploy, and it must be rehearsed. The old screen is only deleted after the new one has run cleanly through at least one full business cycle, such as a month-end close, because many accounting and billing rules only show up then.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Muốn chạy song song thì cần một điểm vào duy nhất quyết định, theo từng screen, người dùng thấy bản cũ hay bản mới. Điểm đó có thể là menu của ứng dụng, một route trên reverse proxy hay gateway, hoặc một feature flag bật theo tenant, theo văn phòng hay theo nhóm người dùng. Trong giai đoạn chuyển tiếp, cả hai bản cùng đọc ghi vào một database, nên người dùng quay về bản cũ lúc nào cũng được mà dữ liệu vẫn nguyên — nhờ vậy rollback rất rẻ. Rollout đi từng bước: tester nội bộ, rồi nhóm key user pilot, rồi một tenant hoặc một văn phòng, cuối cùng mới tới tất cả. Rollback là tắt một flag chứ không phải deploy lại, và phải tập dượt trước. Screen cũ chỉ xóa khi screen mới đã chạy êm qua ít nhất một chu kỳ nghiệp vụ trọn vẹn, ví dụ một lần chốt sổ cuối tháng, vì rất nhiều rule kế toán và billing chỉ lộ ra đúng lúc đó.</p></details>
<pre>Menu / router decides per screen:
  if (flags.isEnabled("new-booking-screen", { tenant, office, userGroup }))
      → /next/booking          (Next.js + Spring Boot)
  else
      → /legacy/booking.do     (old screen)
  Both → same SQL Server tables → switching back keeps the data

Rollout stages:
  dev/QA → internal testers → pilot key users → 1 office → 1 tenant → all
  Rollback = flip flag (seconds), rehearsed before each stage
  Decommission old screen after a full month-end cycle with no diffs</pre>
<ul>
<li>Keep both versions writing <strong>compatible data</strong> — the new screen must not write values the old screen can't read.</li>
<li>Log which version handled each transaction, so incidents can be traced to old vs new.</li>
<li>Avoid "dual maintenance" drift: freeze feature work on the old screen once its replacement is in pilot.</li>
</ul>
<div class="key-point">One router or flag per screen, the same database underneath, staged rollout by user group, rollback by flipping a flag — and retire old code only after a full business cycle.</div>`,
      },
      {
        q: 'How do you change the database schema when the legacy and new systems share the same database?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>While both systems run, every schema change must be <strong>backward compatible</strong>, because the old code cannot be updated as easily. I use the expand-and-contract pattern. Expand: add new columns or tables as nullable or with defaults, never rename or drop anything the old system uses. Migrate: the new code writes both the old and new shape — or a trigger or backfill job keeps them in sync — and existing data is backfilled in batches. Contract: only after the old system no longer touches the old column is it dropped, in a later release. Renames are done as add-new, copy, switch readers, then drop-old. Compatibility views can present a new structure to the new code while the old tables stay intact. All changes go through versioned migration scripts reviewed like code, and they are tested against a copy of production data, since locking a large table during business hours is an outage of its own.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Khi hai hệ thống cùng chạy, mọi thay đổi schema phải <strong>tương thích ngược</strong>, vì code cũ đâu dễ sửa theo. Tôi dùng mẫu expand–contract. Bước expand: thêm cột hoặc bảng mới dạng nullable hoặc có giá trị mặc định, tuyệt đối không đổi tên hay xóa thứ mà hệ thống cũ đang dùng. Bước migrate: code mới ghi cả dạng cũ lẫn dạng mới — hoặc dùng trigger, job backfill để giữ hai bên đồng bộ — và dữ liệu cũ được backfill theo từng lô. Bước contract: chỉ khi hệ thống cũ không còn đụng tới cột cũ nữa mới xóa nó, ở một bản release sau. Đổi tên cột cũng đi đúng trình tự đó: thêm cột mới, chép dữ liệu, chuyển phía đọc sang, rồi mới xóa cột cũ. Có thể dùng view để code mới thấy cấu trúc mới trong khi bảng cũ vẫn giữ nguyên. Mọi thay đổi đều đi qua migration script có version, được review như code, và chạy thử trên bản sao dữ liệu production trước — vì lỡ khóa một bảng lớn giữa giờ làm việc thì bản thân việc đó đã là sự cố.</p></details>
<pre>Goal: split shipment.consignee_text → consignee_id (FK to customer)

Release 1 (expand)
  ALTER TABLE shipment ADD consignee_id INT NULL;            -- old code unaffected
Release 2 (migrate)
  new code writes BOTH consignee_text and consignee_id
  backfill job: UPDATE ... in batches of 5,000 rows
Release 3 (switch readers)
  new code reads consignee_id; old screens still read consignee_text
Release N (contract) — after the last legacy screen is retired
  ALTER TABLE shipment DROP COLUMN consignee_text;</pre>
<ul>
<li>Never: rename/drop columns in use, add NOT NULL without default, change a column's meaning.</li>
<li>SQL Server: large <code>ALTER</code> or index builds — use <code>ONLINE = ON</code> where available, run off-hours, batch updates to avoid lock escalation.</li>
<li>Version migrations with Flyway or Liquibase so every environment is reproducible.</li>
</ul>
<div class="key-point">Shared database = additive changes only. Expand, migrate and backfill, switch readers, and contract only after the last legacy reader is gone.</div>`,
      },

      // ──── 5. UI MIGRATION ────
      {
        q: 'How do you translate legacy UI patterns (stateful grids, big forms, global variables) into React?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Legacy enterprise UIs are usually imperative: event handlers reach into widgets, read and set values directly, and global variables carry state between them. A direct line-by-line translation into React produces fragile code full of refs and effects. Instead I map the behaviour, not the code. Each screen gets explicit state — form state in a form library like React Hook Form with a schema for validation, server data in TanStack Query or server components, and only small UI state in local state. "When field A changes, recalculate B and disable C" becomes derived values or a single handler, not chains of change events. Editable grids are the hardest part, so they are built once as a shared component with a clear API for columns, editing, validation and dirty-row tracking, and every screen reuses it. Business rules move to the backend wherever possible, so the frontend stays thin and the same rule isn't implemented twice.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>UI doanh nghiệp đời cũ thường viết kiểu mệnh lệnh: event handler thò tay vào từng widget để đọc, gán giá trị, còn state thì được chuyền qua lại bằng biến toàn cục. Dịch thẳng từng dòng sang React chỉ ra một mớ code mong manh, đầy ref và effect. Vì vậy tôi chuyển <em>hành vi</em>, không chuyển code. Mỗi screen có state rõ ràng: state của form để trong thư viện form như React Hook Form, validate bằng schema; dữ liệu từ server để trong TanStack Query hoặc server component; chỉ những state UI lặt vặt mới để local. Kiểu "field A đổi thì tính lại B và khóa C" sẽ thành giá trị tính ra (derived) hoặc một handler duy nhất, chứ không phải một chuỗi sự kiện change nối đuôi nhau. Khó nhất là grid cho sửa trực tiếp, nên nó được làm một lần thành component dùng chung, có API rõ ràng cho cột, chỉnh sửa, validate và đánh dấu dòng đã đổi, rồi mọi screen dùng lại. Business rule thì đẩy về backend được bao nhiêu hay bấy nhiêu, để frontend gọn và một rule không phải viết hai lần.</p></details>
<table><tr><th>Legacy pattern</th><th>React equivalent</th></tr>
<tr><td>Global variables between handlers</td><td>Explicit state: form state, query cache, small store</td></tr>
<tr><td><code>onChange</code> chains setting other widgets</td><td>Derived values / one handler + schema rules</td></tr>
<tr><td>Validation scattered in handlers</td><td>Schema (zod/yup) + server validation as source of truth</td></tr>
<tr><td>Editable grid with manual dirty flags</td><td>Shared grid component tracking added/edited/deleted rows</td></tr>
<tr><td>Popup windows returning values</td><td>Modal components with typed callbacks</td></tr>
<tr><td>Business logic in the page</td><td>Move to Spring Boot service; UI calls API</td></tr>
</table>
<pre>// Legacy (imperative)
onChangeMode() { if (mode.value === 'FCL') { qty.enable(); cbm.disable(); } ... }

// React (declarative)
const mode = watch('mode');
&lt;NumberField name="containerQty" disabled={mode !== 'FCL'} /&gt;
&lt;NumberField name="cbm" disabled={mode === 'FCL'} /&gt;
// schema: containerQty required when mode === 'FCL'</pre>
<div class="key-point">Migrate behaviour, not code: explicit state, declarative rules, one shared grid and form toolkit, and business logic pushed to the backend.</div>`,
      },

      // ──── 6. TEAM & DELIVERY ────
      {
        q: 'How do you keep a 30-person team consistent and productive during a large migration?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>At that size, consistency doesn't come from people remembering rules; it comes from making the right way the easy way. First, a <strong>reference screen</strong>, fully migrated and reviewed, shows the agreed structure for folders, API calls, form handling, error handling and tests, and every new screen starts from it. Second, a <strong>shared component library</strong> for grids, forms, popups and code-lookup fields, owned by a small core group, so thirty people aren't each building their own grid. Third, conventions enforced by tooling — ESLint, Prettier, TypeScript strict mode, code generators or reusable AI prompts that produce the skeleton — and a clear <strong>definition of done</strong> per screen that includes the behaviour inventory, parity tests and review. Fourth, code review with a checklist, and rotating reviewers so knowledge spreads. And finally, short feedback loops: a weekly sync on common problems, and fixes to shared components rolled out to everyone rather than patched screen by screen.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Ở quy mô ba mươi người, sự nhất quán không đến từ việc ai cũng tự nhớ quy tắc, mà đến từ việc làm cho cách đúng cũng là cách dễ nhất. Thứ nhất, có một <strong>screen mẫu</strong> đã migrate hoàn chỉnh và review kỹ, thể hiện đúng cấu trúc đã thống nhất về thư mục, gọi API, xử lý form, xử lý lỗi và test — screen mới nào cũng bắt đầu từ đó. Thứ hai, một <strong>thư viện component dùng chung</strong> cho grid, form, popup, field tra mã, do một nhóm core nhỏ phụ trách, để không ai phải tự chế grid riêng. Thứ ba, quy ước được tool ép buộc — ESLint, Prettier, TypeScript strict mode, bộ generate code hoặc prompt AI dùng lại để dựng khung — cùng một <strong>definition of done</strong> rõ ràng cho mỗi screen: có bảng hành vi, có test parity, đã qua review. Thứ tư, code review theo checklist và luân phiên người review để kiến thức lan ra cả team. Cuối cùng là vòng phản hồi ngắn: họp hằng tuần về các vấn đề chung, và lỗi nào nằm ở component dùng chung thì sửa một chỗ cho tất cả, thay vì vá từng screen.</p></details>
<ul>
<li><strong>Reference ("golden") screen</strong> — the template; update it when conventions change.</li>
<li><strong>Shared components</strong> — grid, form fields, code lookup, date/amount inputs, popups; one owner team.</li>
<li><strong>Tooling over documents</strong> — lint rules, strict TS, generators/AI prompts for boilerplate.</li>
<li><strong>Definition of done</strong> — behaviour inventory signed off, parity tests green, i18n, permissions, review approved.</li>
<li><strong>Review checklist</strong> — business rules covered, money/date handling, error states, no copy-pasted logic.</li>
</ul>
<pre>Definition of Done — migrated screen
[ ] Behaviour inventory reviewed with BA / key user
[ ] All rules covered by unit or parity tests
[ ] Uses shared grid/form components (no local forks)
[ ] Permissions and tenant config verified
[ ] Parity run: 0 unexplained diffs
[ ] Code review approved by 1 core member</pre>
<div class="key-point">Scale consistency with a reference screen, a shared component library, tool-enforced conventions and a strict definition of done — not with longer documentation.</div>`,
      },
      {
        q: 'How do you estimate migration work, and how do you measure whether the modernization succeeded?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I estimate by <strong>complexity tiers</strong> rather than guessing every screen individually. After migrating a few representative screens, I define tiers — simple, medium, complex — by measurable traits such as number of fields and grids, number of business rules, stored procedures involved, and integrations like EDI or accounting posting. Each tier gets an effort range based on real data from the first screens, and I recalibrate as the team speeds up with shared components and AI-generated skeletons. I add explicit buffers for discovery and parity fixing, because finding hidden rules is usually the part people underestimate. For success, I track delivery metrics — screens migrated per sprint, time per tier — and, more importantly, outcome metrics: defects found after go-live, parity differences, performance of key screens, user adoption of the new version, and how quickly new features can now be added compared to the old system.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Tôi không đoán riêng từng screen, mà estimate theo <strong>bậc độ phức tạp</strong>. Sau khi làm xong vài screen tiêu biểu, tôi chia bậc — đơn giản, trung bình, phức tạp — dựa trên những thứ đếm được: số field, số grid, số business rule, số stored procedure liên quan, và các tích hợp như EDI hay ghi bút toán kế toán. Mỗi bậc có một khoảng effort lấy từ số liệu thật của mấy screen đầu, và tôi chỉnh lại khi team nhanh dần lên nhờ component dùng chung và code khung do AI sinh. Tôi luôn cộng thêm buffer rõ ràng cho phần tìm hiểu nghiệp vụ và sửa lỗi parity, vì đào ra các rule ẩn gần như lúc nào cũng bị đánh giá thấp. Để đo thành công, tôi theo dõi chỉ số tiến độ — số screen migrate mỗi sprint, thời gian theo từng bậc — nhưng quan trọng hơn là chỉ số kết quả: số bug sau go-live, số khác biệt parity, hiệu năng các screen chính, tỷ lệ người dùng đã chuyển sang bản mới, và giờ thêm một tính năng mới nhanh hơn hệ thống cũ bao nhiêu.</p></details>
<table><tr><th>Tier</th><th>Traits (example)</th><th>Effort (calibrated)</th></tr>
<tr><td>Simple</td><td>1 form or inquiry grid, &lt; 10 rules, no SP</td><td>~1 day</td></tr>
<tr><td>Medium</td><td>Form + editable grid, 10–30 rules, 1–3 SPs</td><td>~2–3 days (was ~10 before shared components + AI prompts)</td></tr>
<tr><td>Complex</td><td>Multi-tab, many grids, accounting/EDI, heavy SPs</td><td>1–2 weeks + extra parity time</td></tr>
</table>
<ul>
<li><strong>Delivery</strong>: screens per sprint by tier, cycle time, review rework rate.</li>
<li><strong>Quality</strong>: post-go-live defects per screen, unexplained parity diffs, rollbacks.</li>
<li><strong>Outcome</strong>: page load and save time, user adoption, support tickets, lead time for new features.</li>
</ul>
<div class="key-point">Estimate from tiers calibrated on real migrated screens, with explicit buffer for discovery. Measure success by quality and outcomes after go-live, not just by the number of screens converted.</div>`,
      },
    ],
  },
];
