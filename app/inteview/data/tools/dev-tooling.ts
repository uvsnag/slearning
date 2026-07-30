// Tools & Technologies — build tools, package managers, bundlers, testing, code quality
import type { PvQuestion } from '../../types';

export const questions: PvQuestion[] = [
  {
    q: 'Maven vs Gradle — how do they differ and what should you know about dependency management?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p><strong>Maven</strong> is declarative XML with a fixed lifecycle: predictable, boring, and easy for anyone to read, which is why it still dominates enterprise Java. <strong>Gradle</strong> is a programmable build (Groovy/Kotlin DSL) with an incremental task graph, build cache, and configuration cache, so it is significantly faster on large multi-module projects — at the cost of builds that can become code nobody understands. The knowledge that matters in either is dependency management: understand <code>compile</code> versus <code>runtime</code> versus <code>test</code> scope (and Gradle's <code>api</code> versus <code>implementation</code>, which controls what leaks onto consumers' compile classpath), how transitive conflicts are resolved (Maven takes the nearest definition, Gradle takes the highest version), and how to pin everything centrally with a BOM or platform so upgrades are one line and reproducible.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>Maven</strong> là build khai báo bằng XML với lifecycle cố định: dễ đoán, "nhạt" theo nghĩa tốt, và ai đọc cũng hiểu — đó là lý do nó vẫn chiếm ưu thế trong Java doanh nghiệp. <strong>Gradle</strong> là build lập trình được (DSL Groovy/Kotlin) với đồ thị task incremental, build cache và configuration cache, nên nhanh hơn đáng kể trên các project nhiều module — nhưng đánh đổi là file build có thể biến thành đoạn code không ai hiểu. Điều quan trọng cần nắm ở cả hai là quản lý dependency: hiểu scope <code>compile</code> so với <code>runtime</code> so với <code>test</code> (và <code>api</code> so với <code>implementation</code> của Gradle — thứ quyết định cái gì lọt ra classpath biên dịch của bên dùng), hiểu cách giải quyết xung đột phiên bản gián tiếp (Maven lấy khai báo gần nhất, Gradle lấy version cao nhất), và cách ghim toàn bộ version ở một chỗ bằng BOM hay platform để việc nâng cấp chỉ sửa một dòng và tái lập được.</p></details>
<pre>&lt;!-- Maven: BOM-managed versions, explicit scopes --&gt;
&lt;dependencyManagement&gt;&lt;dependencies&gt;
  &lt;dependency&gt;&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-dependencies&lt;/artifactId&gt;
    &lt;version&gt;3.3.2&lt;/version&gt;&lt;type&gt;pom&lt;/type&gt;&lt;scope&gt;import&lt;/scope&gt;&lt;/dependency&gt;
&lt;/dependencies&gt;&lt;/dependencyManagement&gt;
&lt;dependencies&gt;
  &lt;dependency&gt;&lt;groupId&gt;org.springframework.boot&lt;/groupId&gt;
    &lt;artifactId&gt;spring-boot-starter-web&lt;/artifactId&gt;&lt;/dependency&gt;  &lt;!-- no version --&gt;
&lt;/dependencies&gt;

// Gradle (Kotlin DSL): api vs implementation is the important distinction
dependencies {
  implementation(platform("org.springframework.boot:spring-boot-dependencies:3.3.2"))
  implementation("org.springframework.boot:spring-boot-starter-web") // internal
  api("com.acme:shared-model")            // leaks to consumers ON PURPOSE
  runtimeOnly("org.postgresql:postgresql")
  testImplementation("org.junit.jupiter:junit-jupiter")
}
// Using implementation instead of api (or compile) is what keeps module
// boundaries real and recompilation fast.</pre>
<pre># Commands you should know cold
mvn -B clean verify                 # full build incl. tests + checks
mvn dependency:tree -Dincludes=com.fasterxml.jackson   # find the conflict
mvn versions:display-dependency-updates
mvn -pl orders-api -am install      # build one module and its deps
./gradlew build --scan              # build scan = where the time went
./gradlew dependencies --configuration runtimeClasspath
./gradlew :orders-api:test --tests '*OrderServiceTest*'

# The "why is the wrong version on the classpath" workflow
1. dependency:tree / dependencies → who pulls it in transitively
2. resolve deliberately: Maven &lt;exclusions&gt; or dependencyManagement pin;
   Gradle constraints / resolutionStrategy.force
3. lock it: Gradle dependency locking, or a BOM everywhere in Maven
# NoSuchMethodError / NoClassDefFoundError at runtime is almost always a
# version conflict that compiled fine — jar hell, not a code bug.</pre>
<p><strong>Also worth mentioning:</strong> reproducible builds matter (pin plugin versions too, and use the Maven wrapper or Gradle wrapper so CI and laptops agree); Gradle's remote build cache is the single biggest CI speedup on large repos; multi-module structure should mirror your architecture so a module cannot import what it should not; and dependency scanning (OWASP dependency-check, Snyk) belongs in the same build so a vulnerable transitive dependency fails the pipeline.</p>
<div class="key-point">Maven for predictable, readable enterprise builds; Gradle for speed and flexibility on large multi-module projects. In both, master scopes/configurations, transitive conflict resolution, and central version pinning with a BOM/platform — most "weird runtime error" tickets are dependency conflicts.</div>`,
  },
  {
    q: 'npm vs yarn vs pnpm, lockfiles, and how do you manage a JavaScript monorepo?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>All three resolve the same registry, so the differences are speed, disk usage, and strictness. <strong>pnpm</strong> is the current default choice: it stores every package version once in a global content-addressable store and links it into <code>node_modules</code>, which is fast, saves gigabytes, and — importantly — creates a <em>strict</em> tree where a package you did not declare is not importable, catching phantom dependencies that npm's flat hoisting hides. The <strong>lockfile</strong> is the real contract: commit it, install with <code>npm ci</code>/<code>pnpm install --frozen-lockfile</code> in CI so builds are reproducible, and treat lockfile changes as reviewable. For monorepos, workspaces handle linking while <strong>Turborepo</strong> or <strong>Nx</strong> add the part that matters at scale: a task graph with caching and affected-project detection so CI only rebuilds and retests what actually changed.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Cả ba đều lấy package từ cùng một registry, nên khác biệt nằm ở tốc độ, dung lượng đĩa và mức độ nghiêm ngặt. <strong>pnpm</strong> hiện là lựa chọn mặc định hợp lý: nó lưu mỗi phiên bản package đúng một lần trong một store dùng chung rồi link vào <code>node_modules</code>, nhờ vậy cài nhanh, tiết kiệm hàng gigabyte, và — quan trọng hơn — tạo ra cây dependency <em>nghiêm ngặt</em>: package nào bạn không khai báo thì không import được, bắt được lỗi "phantom dependency" mà kiểu hoisting phẳng của npm che mất. <strong>Lockfile</strong> mới là hợp đồng thật: hãy commit nó, và trong CI thì cài bằng <code>npm ci</code>/<code>pnpm install --frozen-lockfile</code> để build tái lập được, đồng thời coi thay đổi lockfile là thứ phải review. Với monorepo, workspaces lo phần link các package nội bộ, còn <strong>Turborepo</strong> hoặc <strong>Nx</strong> bổ sung phần quan trọng khi quy mô lớn: một đồ thị task có cache và có phát hiện "project bị ảnh hưởng", để CI chỉ build và test lại đúng những gì đã thay đổi.</p></details>
<pre>                npm                yarn (berry)        pnpm
install speed   ok                 fast                fastest
disk            duplicated         PnP/zero-installs   single global store
node_modules    flat, hoisted      PnP (no folder)     symlinked, strict
strictness      ❌ phantom deps    ✅                  ✅
lockfile        package-lock.json  yarn.lock           pnpm-lock.yaml
# "Phantom dependency": your code imports lodash and it works because a
# dependency of a dependency hoisted it. Then that package drops lodash
# and your build breaks with no change on your side. pnpm makes this a
# compile-time error instead of a production surprise.

# Reproducible installs (never run bare \`install\` in CI)
npm ci                              # exact lockfile, deletes node_modules
pnpm install --frozen-lockfile      # fails if lockfile is out of date
# and pin the toolchain itself:
"packageManager": "pnpm@9.7.0",  "engines": { "node": ">=20 <21" }</pre>
<pre># Monorepo layout with workspaces
pnpm-workspace.yaml:  packages: ["apps/*", "packages/*"]
apps/web (Next.js)   apps/admin   packages/ui   packages/api-client   packages/config
# Internal packages are just workspace dependencies:
"dependencies": { "@acme/ui": "workspace:*" }

# Turborepo: declare the task graph once, get caching for free
// turbo.json
{ "tasks": {
    "build": { "dependsOn": ["^build"], "outputs": [".next/**","dist/**"] },
    "test":  { "dependsOn": ["build"], "outputs": ["coverage/**"] },
    "lint":  {} } }
turbo run build test --filter=...[origin/main]    # only affected projects
# With a remote cache, a colleague's or CI's previous build of an unchanged
# package is reused → minutes instead of tens of minutes.
# Nx does the same plus generators, module-boundary lint rules, and a
# richer dependency graph — heavier, better for very large repos.</pre>
<p><strong>Version and release hygiene:</strong> understand semver ranges (<code>^1.2.3</code> allows minors — fine for apps with a lockfile, dangerous for libraries without one), use Renovate/Dependabot with grouped PRs rather than manual upgrades, and use Changesets for versioning and publishing packages out of a monorepo. Security-wise, prefer <code>--ignore-scripts</code>, audit in CI, and remember that a lockfile is also a supply-chain control because it pins integrity hashes.</p>
<div class="key-point">Prefer pnpm for speed, disk, and strict dependency resolution; always commit the lockfile and install frozen in CI. For monorepos, workspaces plus Turborepo/Nx give a cached task graph and affected-only builds — that is what keeps a large repo's CI from becoming unusable.</div>`,
  },
  {
    q: 'How do modern JavaScript bundlers work, and how do you keep builds fast?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>A bundler resolves your module graph and produces optimized output: transpiling, tree-shaking unused exports, code-splitting per route or dynamic import, hashing filenames for long-term caching, and inlining or emitting assets. <strong>Webpack</strong> is the mature, plugin-rich option that still powers many production apps; <strong>Vite</strong> is now the default for new projects because dev mode serves native ES modules (so startup is instant and HMR does not degrade with app size) while production builds go through Rollup; <strong>esbuild</strong> and <strong>SWC</strong> are the Go/Rust transpilers that made everything fast and are used inside other tools (Next.js uses SWC; Turbopack and Rspack are the next iteration). Keeping builds fast is mostly about not doing unnecessary work: use the fast transpiler, run type-checking in parallel rather than inside the bundle step, avoid barrel files that defeat tree-shaking, and cache aggressively in CI.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Bundler phân giải đồ thị module rồi tạo ra output đã tối ưu: transpile, tree-shaking để bỏ các export không dùng, code-splitting theo route hoặc theo dynamic import, băm tên file để cache lâu dài, và inline hoặc xuất các asset. <strong>Webpack</strong> là lựa chọn lâu năm với hệ plugin phong phú và vẫn đang chạy nhiều app production; <strong>Vite</strong> giờ là mặc định cho project mới vì chế độ dev phục vụ ES module gốc (nên khởi động tức thì và HMR không chậm đi theo kích thước app), còn bản build production thì đi qua Rollup; <strong>esbuild</strong> và <strong>SWC</strong> là hai transpiler viết bằng Go/Rust đã làm mọi thứ nhanh lên và được dùng bên trong các tool khác (Next.js dùng SWC; Turbopack và Rspack là thế hệ tiếp theo). Muốn build nhanh thì chủ yếu là đừng làm việc vô ích: dùng transpiler nhanh, chạy type-check song song thay vì nhét vào bước bundle, tránh barrel file làm mất tác dụng tree-shaking, và cache thật mạnh trong CI.</p></details>
<pre>// What the build actually does
entry → resolve imports → transform (TS/JSX via SWC/esbuild/Babel)
      → tree-shake (needs ESM + no side effects) → split chunks
      → minify → emit with content hashes → manifest
// Content hashing is what lets you cache JS for a year:
//   app.4f9a2c.js  →  Cache-Control: public, max-age=31536000, immutable

// Why Vite dev feels instant
dev:   browser requests /src/App.tsx → Vite transforms THAT file only
       (native ESM, no bundle) → HMR replaces one module
build: Rollup bundles for production (you still ship optimized bundles)
// Webpack dev rebuilds a bundle graph, which grows with the project.</pre>
<pre>// Things that make bundles big or builds slow — and the fixes
❌ import { Button } from '@/components'      // barrel file pulls in ALL
✅ import { Button } from '@/components/Button'
   (or configure optimizePackageImports / babel-plugin-transform-imports)
❌ import moment from 'moment'                // 300kb, no tree-shaking
✅ date-fns / dayjs / Intl.DateTimeFormat
❌ one giant route bundle
✅ dynamic import for heavy, rarely used code:
   const Chart = lazy(() => import('./Chart'));      // React
   const { default: pdf } = await import('pdf-lib'); // on demand
❌ type-checking inside the bundler on every save
✅ transpile-only (SWC/esbuild) + tsc --noEmit in a parallel CI job
❌ source maps in the shipped bundle
✅ hidden-source-map + upload to Sentry, then delete from the artifact

// Measure before optimizing
npx vite-bundle-visualizer      # or webpack-bundle-analyzer / next build
// Check: which dependency is the biggest? is anything duplicated at two
// versions? is a server-only module leaking into the client bundle?</pre>
<pre># CI speed checklist
- cache the package store (~/.pnpm-store) and the framework build cache
  (.next/cache, node_modules/.cache) keyed by the lockfile hash
- run lint / typecheck / unit tests in parallel jobs, not sequentially
- build once and reuse the artifact across environments
- Turborepo/Nx remote cache so unchanged packages are never rebuilt
# Targets worth defending in review: a size budget per route enforced in CI
# (bundlesize / next-bundle-analysis), because bundles only grow otherwise.</pre>
<div class="key-point">Vite (Rollup) for new apps, Webpack where it already works, with SWC/esbuild doing the transpiling — and content hashing plus code splitting for cache-friendly output. Keep builds fast by avoiding barrel files and heavy libraries, moving type-checking out of the bundle step, caching in CI, and enforcing a bundle-size budget.</div>`,
  },
  {
    q: 'What does a solid Java testing stack look like — JUnit 5, Mockito and Testcontainers?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p><strong>JUnit 5</strong> is the harness (parameterized tests, nested contexts, extensions), <strong>AssertJ</strong> gives readable fluent assertions, <strong>Mockito</strong> stubs collaborators for unit tests, and <strong>Testcontainers</strong> is the piece that changed integration testing: it starts a real Postgres, Kafka, or Redis in Docker for the test run, so you test against the actual engine instead of H2 pretending to be Postgres. My layering is a wide base of fast unit tests with no Spring context, a middle layer of slice tests (<code>@DataJpaTest</code>, <code>@WebMvcTest</code>) for mapping and controller behaviour, and a smaller set of full <code>@SpringBootTest</code> integration tests on Testcontainers for the paths that involve real SQL, transactions, and messaging. The rule I care most about: mock what you own and cannot control, use the real thing for infrastructure, and never assert on mock call counts when you could assert on observable state.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p><strong>JUnit 5</strong> là bộ khung chạy test (parameterized test, nested context, extension), <strong>AssertJ</strong> cho các assertion dạng fluent dễ đọc, <strong>Mockito</strong> để stub các collaborator trong unit test, và <strong>Testcontainers</strong> là mảnh ghép đã thay đổi hẳn cách test tích hợp: nó khởi động một Postgres, Kafka hay Redis thật bằng Docker trong lúc chạy test, nên bạn test trên đúng engine thật chứ không phải H2 đóng vai Postgres. Cách tôi phân tầng: một lớp đáy rộng gồm unit test nhanh, không cần Spring context; lớp giữa là các slice test (<code>@DataJpaTest</code>, <code>@WebMvcTest</code>) để kiểm tra mapping và hành vi controller; và một số ít test tích hợp đầy đủ <code>@SpringBootTest</code> chạy trên Testcontainers cho những luồng liên quan tới SQL thật, transaction và messaging. Nguyên tắc tôi coi trọng nhất: chỉ mock những thứ mình sở hữu mà không kiểm soát được, còn hạ tầng thì dùng đồ thật, và đừng assert số lần gọi mock khi có thể assert vào trạng thái quan sát được.</p></details>
<pre>// Unit test: no Spring, no database, milliseconds
@ExtendWith(MockitoExtension.class)
class OrderServiceTest {
  @Mock PaymentGateway payments;      // external, slow, non-deterministic
  @Mock OrderRepository repo;
  @InjectMocks OrderService service;

  @Test void rejects_order_when_payment_declined() {
    when(payments.charge(any())).thenReturn(Result.declined("card_declined"));
    assertThatThrownBy(() -> service.place(anOrder()))
      .isInstanceOf(PaymentFailedException.class)
      .hasMessageContaining("declined");
    verify(repo, never()).save(any());        // behaviour that MATTERS
  }
  @ParameterizedTest @CsvSource({"0,false", "1,true", "999,true"})
  void quantity_validation(int qty, boolean valid) { ... }
}
// ❌ Do not mock value objects, DTOs, or the class under test.
// ❌ Do not mock the repository AND assert on SQL — pick a layer.</pre>
<pre>// Integration test against the REAL database
@SpringBootTest
@Testcontainers
class OrderRepositoryIT {
  @Container @ServiceConnection            // Spring Boot 3.1+ wires the URL
  static PostgreSQLContainer&lt;?&gt; db = new PostgreSQLContainer&lt;&gt;("postgres:16");

  @Autowired OrderRepository repo;

  @Test void unique_idempotency_key_prevents_double_insert() {
    repo.save(order("key-1"));
    assertThatThrownBy(() -> repo.saveAndFlush(order("key-1")))
      .isInstanceOf(DataIntegrityViolationException.class);
  }
}
// Why not H2: different SQL dialect, no real constraint/locking semantics,
// no JSONB, no window-function edge cases → green tests, broken production.
// Testcontainers also runs Kafka, Redis, LocalStack, MinIO, WireMock, and
// can reuse containers between runs (testcontainers.reuse.enable=true).

// Slice tests: fast-ish, focused
@DataJpaTest      → JPA mappings, queries, constraints (with Testcontainers)
@WebMvcTest       → controller + validation + JSON, services mocked
@RestClientTest / WireMock → outbound HTTP clients, incl. failure injection</pre>
<pre>// The pyramid I actually aim for
many   unit tests (no context)        ~ms      — logic, edge cases
some   slice tests                    ~100ms   — wiring, mapping, HTTP layer
few    integration tests (containers) ~seconds — SQL, transactions, messaging
tiny   end-to-end (Playwright/API)    ~minutes — 3-5 critical journeys
// Practices: JaCoCo coverage as a signal not a target; @Transactional
// rollback or Flyway-per-test-class for isolation; fixed clocks and
// injected Clock for time-dependent code; no Thread.sleep — use Awaitility;
// flaky tests get quarantined AND fixed, never retried silently.</pre>
<div class="key-point">JUnit 5 + AssertJ + Mockito for fast isolated logic tests, slice tests for wiring, and Testcontainers for real Postgres/Kafka integration tests — H2 substitutes hide dialect and constraint bugs. Mock external systems, use the real infrastructure, and assert on state rather than on interaction counts.</div>`,
  },
  {
    q: 'What does a solid JavaScript testing stack look like — Vitest/Jest, Testing Library, MSW and Playwright?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>The modern default is <strong>Vitest</strong> (or Jest on older setups) for unit and component tests, <strong>Testing Library</strong> for rendering components and querying them the way a user would — by role and label, not by CSS class or internal state — <strong>MSW</strong> to intercept HTTP at the network layer so components exercise real fetch code against mocked responses, and <strong>Playwright</strong> for a small set of end-to-end journeys in real browsers. The principle that makes these tests durable is testing behaviour instead of implementation: assert what the user sees after an interaction, not that a hook was called. That way a refactor from <code>useState</code> to a store, or from Axios to fetch, does not rewrite your test suite — which is exactly what happens when tests mock modules and reach into internals.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Bộ mặc định hiện nay là <strong>Vitest</strong> (hoặc Jest với các project cũ) cho unit test và component test, <strong>Testing Library</strong> để render component rồi truy vấn theo cách người dùng nhìn thấy — theo role và label, không theo class CSS hay state nội bộ — <strong>MSW</strong> để chặn HTTP ở tầng network, nhờ đó component vẫn chạy code fetch thật nhưng nhận response giả, và <strong>Playwright</strong> cho một số ít luồng end-to-end trên browser thật. Nguyên tắc giúp test sống lâu là kiểm tra hành vi thay vì kiểm tra cách hiện thực: hãy assert những gì người dùng thấy sau một tương tác, đừng assert rằng một hook đã được gọi. Nhờ vậy, khi refactor từ <code>useState</code> sang store, hay từ Axios sang fetch, bạn không phải viết lại cả bộ test — điều luôn xảy ra với những test mock module và móc vào bên trong.</p></details>
<pre>// Component test: query like a user, assert what a user sees
test('shows an error when the coupon is invalid', async () => {
  render(&lt;Checkout /&gt;);
  await userEvent.type(screen.getByLabelText(/coupon/i), 'BAD10');
  await userEvent.click(screen.getByRole('button', { name: /apply/i }));
  expect(await screen.findByText(/coupon is not valid/i)).toBeVisible();
});
// Query priority: getByRole > getByLabelText > getByText > getByTestId
// ❌ container.querySelector('.btn-primary')  → breaks on any restyle
// ❌ expect(setState).toHaveBeenCalled()      → tests implementation
// findBy* = async (waits); getBy* = must exist now; queryBy* = may be absent</pre>
<pre>// MSW: mock the network, not your modules
const server = setupServer(
  http.post('/api/coupons/validate', async ({ request }) => {
    const { code } = await request.json();
    return code === 'GOOD10'
      ? HttpResponse.json({ discountCents: 1000 })
      : HttpResponse.json({ error: 'invalid_coupon' }, { status: 422 });
  }),
);
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
// Benefits: the same handlers work in tests, Storybook, and local dev;
// your fetch/React Query code is really executed (retries, error states);
// and an unmocked request FAILS the test instead of hitting the network.
// ❌ vi.mock('axios') → couples the test to the HTTP client you happen to use</pre>
<pre>// E2E with Playwright: few, high-value, on real browsers
test('user can check out', async ({ page }) => {
  await page.goto('/');
  await page.getByRole('link', { name: 'Headphones' }).click();
  await page.getByRole('button', { name: 'Add to cart' }).click();
  await page.getByRole('link', { name: /cart/i }).click();
  await expect(page.getByText('Order confirmed')).toBeVisible();
});
// Stability rules that eliminate flakiness:
// - web-first assertions auto-wait (expect(locator).toBeVisible()) —
//   never page.waitForTimeout()
// - role/label locators, not CSS chains
// - seed state via API or a storageState login, not by clicking through auth
// - one browser context per test → no shared cookies
// - trace/video on retry (trace: 'on-first-retry') so CI failures are debuggable

// Distribution
many  unit (pure functions, reducers, utils)        — instant
many  component (Testing Library + MSW)             — the sweet spot
few   integration (route handlers, server actions)
tiny  E2E (Playwright: login, checkout, one admin flow)
// Plus: accessibility checks (jest-axe / @axe-core/playwright) and visual
// regression (Playwright screenshots / Chromatic) where UI details matter.</pre>
<div class="key-point">Vitest/Jest + Testing Library queried by role and label, MSW mocking the network instead of your modules, and a handful of Playwright journeys with web-first assertions. Test what the user observes so refactors do not break the suite — and let an unmocked request or a hard-coded wait be a test failure, not a habit.</div>`,
  },
  {
    q: 'How do you enforce code quality automatically — linters, formatters, SonarQube and hooks?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>The goal is that no human ever reviews formatting or catchable bugs. The layering I set up: a <strong>formatter</strong> with zero options in practice (Prettier, Spotless/google-java-format) so style is never discussed; a <strong>linter</strong> for real rules (ESLint with type-aware rules, plus <code>eslint-plugin-security</code>; Checkstyle/SpotBugs/Error Prone in Java); <strong>TypeScript in strict mode</strong> as the cheapest bug-catcher available; <strong>pre-commit hooks</strong> (husky + lint-staged, or lefthook) to format and lint only the staged files so commits stay fast; and <strong>CI as the real gate</strong> with the same commands, because a hook can always be skipped. On top of that, <strong>SonarQube</strong> or Semgrep tracks issues, duplication, and coverage over time and — crucially — is configured to gate on <em>new</em> code rather than demanding the legacy backlog be fixed first.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mục tiêu là không còn con người nào phải review chuyện format hay những lỗi mà máy bắt được. Cách tôi phân tầng: một <strong>formatter</strong> gần như không cần cấu hình (Prettier, Spotless/google-java-format) để không ai còn tranh luận về style; một <strong>linter</strong> cho các quy tắc thật sự có ý nghĩa (ESLint kèm các rule dùng thông tin type, cộng <code>eslint-plugin-security</code>; còn Java thì Checkstyle/SpotBugs/Error Prone); bật <strong>TypeScript strict mode</strong> vì đây là cách bắt bug rẻ nhất; <strong>pre-commit hook</strong> (husky + lint-staged, hoặc lefthook) để format và lint chỉ trên file đã stage, giữ cho commit vẫn nhanh; và <strong>CI mới là cổng chốt thật</strong>, chạy đúng những lệnh đó, vì hook thì luôn có thể bị bỏ qua. Trên cùng, <strong>SonarQube</strong> hoặc Semgrep theo dõi issue, mức trùng lặp code và coverage theo thời gian — và điểm quan trọng là hãy cấu hình nó chốt trên <em>code mới</em> thay vì đòi phải dọn hết nợ cũ trước đã.</p></details>
<pre># JS/TS: format + lint + typecheck, each doing one job
// .eslintrc — type-aware rules catch real bugs, not style
extends: [eslint:recommended, plugin:@typescript-eslint/strict-type-checked,
          plugin:react-hooks/recommended, prettier]
rules:
  "@typescript-eslint/no-floating-promises": error   # forgotten await
  "@typescript-eslint/no-misused-promises": error
  "react-hooks/exhaustive-deps": error               # stale closures
// tsconfig
{ "strict": true, "noUncheckedIndexedAccess": true,
  "noUnusedLocals": true, "exactOptionalPropertyTypes": true }

# Hooks: fast, staged-only
// package.json
"lint-staged": { "*.{ts,tsx}": ["prettier --write", "eslint --fix"] }
// .husky/pre-commit  → npx lint-staged
// .husky/commit-msg  → npx commitlint --edit   (conventional commits)
# Keep hooks under a couple of seconds or people will --no-verify.</pre>
<pre># Java: the same idea, different tools
spotless (google-java-format)  → mvn spotless:apply / spotless:check
Checkstyle                     → conventions, naming, imports
SpotBugs + FindSecBugs         → bytecode analysis, security patterns
Error Prone / NullAway         → compile-time bug patterns, nullability
ArchUnit                       → architecture as a TEST:
  noClasses().that().resideInAPackage("..controller..")
    .should().dependOnClassesThat().resideInAPackage("..repository..");
# ArchUnit is underrated: layering rules that are enforced, not documented.</pre>
<pre># SonarQube / SonarCloud — trend + gate, on new code
quality gate (recommended shape):
  new code coverage      >= 80%
  new duplicated lines   <  3%
  new blocker/critical issues = 0
  security hotspots reviewed
# "Clean as you code": legacy debt is tracked, not blocking; anything you
# touch must meet the bar. This is what makes adoption possible.
# Also useful: Semgrep for custom org rules ("never call this API directly",
# "all endpoints must have @PreAuthorize"), Danger for PR conventions.

# CI is the gate (hooks are convenience)
- run: pnpm lint && pnpm typecheck && pnpm test -- --coverage
- run: mvn -B verify   # spotless:check, checkstyle, spotbugs, tests, jacoco
- run: sonar-scanner   # after tests so coverage is imported
# Fail fast, run jobs in parallel, and never let "the pipeline is red on
# main" become normal — a red main is an outage of the development process.</pre>
<div class="key-point">Automate style away (Prettier/Spotless), lint for genuine bug patterns with type-aware and security rules, enable TypeScript strict mode, keep pre-commit hooks fast and staged-only, and gate in CI. Use SonarQube's "clean as you code" gate on new code so quality improves without a mandated legacy cleanup.</div>`,
  },
];
