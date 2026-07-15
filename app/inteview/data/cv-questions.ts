// Interview data: CV-based questions (Nguyen Van Sang — Senior Fullstack Developer)
import type { PvTopic } from '../types';

export const topics: PvTopic[] = [
  {
    id: 'cv-questions',
    name: 'CV-Based Questions',
    icon: '📋',
    questions: [
      // --- PROFESSIONAL SUMMARY / GENERAL ---
      {
        q: 'Tell me about yourself and your experience.',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>I'm a senior fullstack developer with around seven years across logistics, e-commerce, and TV service platforms. Right now at CyberLogitec I own architecture and performance work on a large freight-forwarding system — booking, warehouse, accounting, billing — built on <code>Java 21</code>, Spring Boot, and Next.js. Before that I led a small team at WOWCNS and built full-stack features at ALLEXCEED. My core strengths are system design, SQL optimization, and shipping high-performance enterprise apps, and lately I've driven AI-assisted development to lift the whole team's productivity. I'm looking for a senior role where I can own architectural decisions and keep growing as a technical leader.</p></div>
<p>This is usually the <strong>first question</strong>. Prepare a 2-minute elevator pitch following this structure:</p>
<pre>Formula: Present → Past → Future

"I'm a Senior Fullstack Developer with ~7 years of experience 
in Java Spring Boot and React/Next.js. Currently at CyberLogitec, 
I work on a large-scale logistics platform handling freight forwarding 
operations — booking, warehouse, accounting, and billing.

Previously, I led teams at WOWCNS (e-commerce) and developed 
TV service management systems at ALLEXCEED.

I specialize in system architecture, SQL optimization, and 
building high-performance enterprise applications. I'm also 
passionate about leveraging AI tools to improve developer productivity.

I'm looking for a senior role where I can contribute to 
architectural decisions and continue growing as a technical leader."</pre>
<div class="key-point">Keep it to 2 minutes. Focus on: years of experience, current role, key technologies, what you're looking for. Don't read your CV — tell a story.</div>`,
      },
      {
        q: 'Why are you leaving your current company?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I've had a strong four years at CyberLogitec and grown from senior developer to deputy team lead, so this isn't about running from anything. I'm looking for a role where I can own architecture end-to-end and see my work land in a product with broader impact. I always frame it around what I'm moving toward — more ownership and technical challenge — not complaints about where I am. It's genuinely been a great place to build enterprise logistics systems, and I'd talk about it that way in front of any interviewer.</p></div>
<p>Be honest but positive. Focus on what you want, not what you're running from.</p>
<ul>
<li><strong>Good answers</strong>: seeking growth, want to work with a specific tech stack, looking for more architectural challenges, want to contribute to a product company.</li>
<li><strong>Bad answers</strong>: bad manager, low salary, bored (too negative).</li>
</ul>
<pre>Example: "I've had a great ~4 years at CyberLogitec working on 
enterprise logistics systems. I've grown from a senior developer 
to a deputy team lead. Now I'm looking for a role where I can 
take on more ownership of system architecture decisions and work 
on products with a broader impact."</pre>
<div class="key-point">Never badmouth your current employer. Even if the reason is salary, frame it positively: "I'm looking for a role that better reflects my experience and contributions."</div>`,
      },
      {
        q: 'Describe a challenging project you worked on and how you solved it.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>The one I reach for is the FWD database migration toolkit. We had to move data across multiple PostgreSQL environments — 10-plus modules, 100-plus tables — and the manual scripting was slow and error-prone. I was the sole developer, so I designed a streaming pipeline on the PostgreSQL <code>COPY</code> protocol pushing up to 100K rows a batch, added multi-phase validation with schema comparison and row-level reconciliation, plus PII masking and a real-time Socket.IO monitoring UI. The result was hours of manual work collapsed into one automated workflow with zero production incidents, and it's now used across the org.</p></div>
<p>Use the <strong>STAR method</strong>: Situation → Task → Action → Result.</p>
<pre>Example (FWD Database Migration Toolkit):

Situation: "At CyberLogitec, we needed to migrate data across 
multiple PostgreSQL environments covering 10+ modules (~100+ tables). 
Manual scripting took hours and was error-prone."

Task: "As the sole developer, I was responsible for building an 
automated migration toolkit from scratch."

Action: 
- "I designed a streaming-based pipeline using PostgreSQL COPY 
  protocol for high-throughput data transfer (up to 100K rows/batch)."
- "Built multi-phase validation: schema comparison, row-level 
  validation, and record reconciliation."
- "Implemented data masking for PII compliance."
- "Created a real-time monitoring UI with Socket.IO for 
  progress tracking and fail-safe controls."

Result: "Reduced migration effort from hours to a single automated 
workflow. Achieved zero production incidents thanks to robust 
validation. The tool is now used across the organization."</pre>
<div class="key-point">Always quantify results: time saved, incidents prevented, performance improved. The interviewer wants to know your <strong>impact</strong>, not just what you did.</div>`,
      },
      {
        q: 'You mention ~7 years of experience. What has your growth trajectory been?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>My trajectory has been a steady climb in scope. I started at ALLEXCEED as a full-stack developer on a fifteen-person team, focused on building solid features and learning the craft. At WOWCNS I stepped up to team lead over four developers, so leadership and team throughput became my focus. At CyberLogitec I moved from senior developer to deputy team lead, and now I own architecture decisions, code reviews, and SQL tuning, and I led the migration to a modern stack. The through-line is responsibility growing from writing code, to leading people, to setting technical direction.</p></div>
<p>Show progression from junior developer to senior/lead with increasing responsibilities.</p>
<pre>Timeline:
2019-2021 (ALLEXCEED): 
  → Full-stack developer, team of 15
  → Built features with React Hooks + Spring Boot
  → Focus: learning, building, improving UI/UX

2021-2022 (WOWCNS):
  → Team Lead, managed 4 developers
  → Led full-stack development, mentoring
  → Focus: leadership, team productivity

2022-Present (CyberLogitec):
  → Senior Full-Stack Developer → Deputy Team Lead
  → Architecture decisions, code reviews, SQL optimization
  → Led migration to modern stack (Next.js, Java 21, Spring Modulith)
  → Introduced AI-assisted development practices
  → Focus: architecture, performance, tech strategy</pre>
<div class="key-point">Highlight how your responsibilities grew: from writing features → leading teams → making architecture decisions → mentoring → setting tech direction.</div>`,
      },
      // --- ARCHITECTURE / SYSTEM DESIGN ---
      {
        q: 'You mention Hexagonal Architecture and Spring Modulith. Explain the benefits.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>On CARIS we combined hexagonal architecture with Spring Modulith, and the payoff was real. Ports and adapters kept business logic free of framework dependencies, so it was trivial to unit test and I could swap adapters — database or messaging — without touching the core. Spring Modulith then enforced module boundaries inside a single deployable: package-level isolation, architecture violations caught at test time, and event-based communication between modules. It gives you most of the isolation benefits of microservices while keeping a monolith's operational simplicity, and it leaves the door open to extract services later when the pain justifies it.</p></div>
<p>Based on your CARIS UPGRADE project using <strong>Spring Modulith</strong> with <strong>Hexagonal Architecture</strong>.</p>
<pre>Hexagonal Architecture (Ports & Adapters):
  ┌─────────────────────────────────────┐
  │          Application Core           │
  │   ┌─────────────────────────┐       │
  │   │    Domain / Business    │       │
  │   │       Logic             │       │
  │   └────────┬────────────────┘       │
  │            │                        │
  │   ┌────────┴────────────────┐       │
  │   │    Ports (Interfaces)   │       │
  │   └────────┬────────────────┘       │
  └────────────┼────────────────────────┘
       ┌───────┼───────┐
  [REST API] [DB]  [Messaging]   ← Adapters (interchangeable)</pre>
<p><strong>Benefits:</strong></p>
<ul>
<li><strong>Testability</strong>: Business logic has no framework dependencies — easy to unit test.</li>
<li><strong>Flexibility</strong>: Swap database (PostgreSQL → MongoDB) without changing business logic.</li>
<li><strong>Maintainability</strong>: Clear boundaries prevent spaghetti code.</li>
</ul>
<p><strong>Spring Modulith</strong>:</p>
<ul>
<li>Enforces module boundaries within a monolith (package-level isolation).</li>
<li>Detects architecture violations at test time.</li>
<li>Provides event-based inter-module communication.</li>
<li>Documents module dependencies automatically.</li>
</ul>
<pre>// Spring Modulith module structure
com.example.logistics
  ├── booking/         // module
  │   ├── BookingService.java
  │   ├── internal/    // package-private (hidden from other modules)
  │   └── BookingApi.java  // exposed API
  ├── warehouse/       // another module
  └── accounting/      // another module</pre>
<div class="key-point">Spring Modulith gives you the module isolation benefits of microservices while keeping the simplicity of a monolith. It's a great middle ground — you can extract to microservices later when needed.</div>`,
      },
      {
        q: 'Explain how you standardized API patterns. What does API standardization include?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>When I say standardized API patterns, I mean every endpoint behaves predictably. We locked down one response envelope and one error envelope, a consistent HTTP status-code convention, uniform pagination and naming, and a single global exception handler with <code>@RestControllerAdvice</code> so error handling wasn't reinvented per controller. Auth and the request lifecycle — authenticate, authorize, validate, business logic, respond — were the same everywhere, and OpenAPI/Swagger gave us auto-generated docs and contract validation. The win is fewer defects, because a developer who's seen one endpoint already understands the next.</p></div>
<p>From your CARIS UPGRADE project: "Standardized API patterns (error handling, authentication, request lifecycle)."</p>
<pre>// 1. Consistent response format
{
  "status": "success",           // or "error"
  "data": { ... },               // response payload
  "message": "User created",     // human-readable
  "timestamp": "2025-01-01T12:00:00Z",
  "path": "/api/users"
}

// 2. Error response format
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Validation failed",
    "details": [
      { "field": "email", "message": "Invalid email format" }
    ]
  },
  "timestamp": "2025-01-01T12:00:00Z"
}

// 3. HTTP status codes convention
200 OK            → successful GET/PUT
201 Created       → successful POST (resource created)
204 No Content    → successful DELETE
400 Bad Request   → validation error
401 Unauthorized  → not authenticated
403 Forbidden     → authenticated but no permission
404 Not Found     → resource doesn't exist
409 Conflict      → duplicate/conflict
500 Internal      → server error (log, don't expose details)</pre>
<p><strong>Standardization includes:</strong></p>
<ul>
<li><strong>Request lifecycle</strong>: Authentication → Authorization → Validation → Business Logic → Response</li>
<li><strong>Naming conventions</strong>: <code>GET /api/v1/users</code>, <code>POST /api/v1/users</code>, <code>PUT /api/v1/users/{id}</code></li>
<li><strong>Pagination</strong>: <code>?page=0&size=20&sort=name,asc</code></li>
<li><strong>OpenAPI/Swagger</strong>: auto-generated API documentation</li>
<li><strong>Global exception handler</strong>: <code>@RestControllerAdvice</code></li>
</ul>
<div class="key-point">API standardization reduces defects because every developer follows the same patterns. Use OpenAPI/Swagger to generate docs and validate contracts.</div>`,
      },
      // --- SQL OPTIMIZATION ---
      {
        q: 'You mention SQL optimization as a key skill. Walk me through your approach.',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>My approach is always identify, analyze, optimize, validate — never guess. I find the slow queries first, usually through <code>pg_stat_statements</code> or slow-query logs, then run <code>EXPLAIN ANALYZE</code> to see where the plan hurts — sequential scans on big tables, bad row estimates, nested loops. From there it's the right index, often a composite with equality columns first and a covering <code>INCLUDE</code>, or rewriting the query — replacing correlated subqueries with joins, dropping SELECT-star, moving to keyset pagination. On FWD I took a query from eight seconds to fifty milliseconds with one composite covering index. Then I always validate by comparing plans and timing under load.</p></div>
<p>From your CV: "Optimized SQL queries and tuned database performance through indexing and query restructuring."</p>
<pre>Step-by-step approach:

1. IDENTIFY slow queries
   → Use slow query logs (pg_stat_statements in PostgreSQL)
   → Monitor with APM tools
   → Check batch/reporting job durations

2. ANALYZE with EXPLAIN ANALYZE
   → Look for: Seq Scan on large tables, nested loops, 
     high actual rows vs estimated rows

3. OPTIMIZE
   a) Add missing indexes
      → WHERE, JOIN, ORDER BY columns
      → Composite indexes (equality first, range last)
      → Covering indexes for frequently-read queries

   b) Rewrite query
      → Replace correlated subqueries with JOINs
      → Use CTEs for readability
      → Avoid SELECT * — specify columns
      → Replace OFFSET pagination with keyset pagination

   c) Database-level tuning
      → Update statistics (ANALYZE)
      → Configure connection pooling (HikariCP)
      → Partition large tables by date

4. VALIDATE
   → Compare execution plans before/after
   → Measure query time improvement
   → Test under load</pre>
<p><strong>Real example from FWD project:</strong></p>
<pre>-- Before: 8 seconds (full table scan, no index)
SELECT o.*, c.name FROM orders o
JOIN customers c ON o.customer_id = c.id
WHERE o.status = 'pending' AND o.created_at > '2024-01-01'
ORDER BY o.created_at DESC;

-- After: 50ms (composite index + covering)
CREATE INDEX idx_orders_status_date 
ON orders(status, created_at DESC) INCLUDE (customer_id);

-- Also restructured batch reports to use:
-- Partitioned tables by month
-- Materialized views for aggregations</pre>
<div class="key-point">SQL optimization is iterative: identify → analyze → optimize → validate. Always use EXPLAIN ANALYZE to verify improvements. The biggest gains usually come from adding the right indexes and rewriting bad queries.</div>`,
      },
      // --- TEAM LEADERSHIP ---
      {
        q: 'You were a Deputy Team Lead. How do you handle code reviews?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>For me code review is about quality and teaching, not gatekeeping. I focus on correctness, edge cases, security like SQL injection or exposed secrets, and performance traps like N+1 queries — and I let ESLint and Prettier handle formatting so I never bikeshed on style. Tone matters: I ask questions rather than issue commands, praise good code, and mark comments as nit versus required so people know what actually blocks the PR. I turn reviews around within a day and keep batches small, under 400 lines, so I'm never the bottleneck. And if I see the same issue twice, I turn it into a team guideline or a lint rule.</p></div>
<p>From your CV: "Conducted code reviews and enforced coding standards across the team."</p>
<pre>My code review approach:

1. REVIEW CHECKLIST
   □ Does it solve the requirement correctly?
   □ Are edge cases handled?
   □ Is the code readable and maintainable?
   □ Are there performance concerns (N+1 queries, missing indexes)?
   □ Security: SQL injection, XSS, exposed secrets?
   □ Tests: unit tests for new logic?
   □ Naming: clear variable/function names?

2. TONE
   → Ask questions instead of commands
   → "What do you think about using a Map here?" vs "Use a Map."
   → Praise good code: "Nice use of Optional here 👍"
   → Explain the WHY behind suggestions

3. SCOPE
   → Focus on logic and design, not formatting (let ESLint/Prettier handle that)
   → Don't block PRs for style preferences
   → Mark comments as "nit" (nice to have) vs "required" (must fix)

4. TURNAROUND
   → Review within 24 hours (don't block teammates)
   → Keep review batches small (&lt;400 lines)
   → Pair-review for complex changes</pre>
<div class="key-point">Good code reviews improve code quality AND team capability. Focus on teaching, not gatekeeping. If you find the same issue repeatedly, create a team guideline or ESLint rule.</div>`,
      },
      {
        q: 'How do you mentor junior developers?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>My goal with mentoring is to create independent developers, not dependents. I start juniors with pair programming and small, well-scoped tasks with clear acceptance criteria, then ramp complexity as they gain confidence. I use code reviews as teaching moments — always explaining the why, not just the what — and I run weekly one-on-ones to unblock them and set stretch goals. When they hit a wall I resist just handing over the answer; I guide them through debugging with questions like what does the error say and where would you look. At WOWCNS that approach measurably sped up onboarding and lifted the team's productivity.</p></div>
<p>From your CV: "Mentored junior developers and resolved complex technical issues."</p>
<pre>Mentoring strategies I use:

1. STRUCTURED ONBOARDING
   → Pair programming for the first week
   → Assign small, well-defined tasks with clear acceptance criteria
   → Gradually increase complexity

2. CODE REVIEWS AS TEACHING
   → Explain WHY, not just WHAT to change
   → Share relevant documentation/articles
   → Show patterns they'll reuse

3. TECHNICAL GROWTH
   → Weekly 1:1 to discuss blockers and goals
   → Assign stretch tasks just beyond their comfort zone
   → Let them present solutions in team meetings

4. PROBLEM-SOLVING SKILLS
   → Don't give answers immediately — guide them through debugging
   → "What does the error message say?"
   → "Where would you look to find the root cause?"
   → "What have you tried so far?"

5. EXAMPLE
   At WOWCNS, I led 4 junior developers:
   → Established coding standards and review process
   → Created reusable templates for common patterns
   → Result: team productivity increased, faster onboarding</pre>
<div class="key-point">The best mentoring creates independent developers. Teach them HOW to solve problems, not just the solutions. If they always need you, you haven't mentored — you've created dependency.</div>`,
      },
      // --- MIGRATION & MODERNIZATION ---
      {
        q: 'Tell me about the legacy system migration (CARIS UPGRADE). What challenges did you face?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>CARIS was migrating a live legacy logistics system onto Next.js, <code>Java 21</code>, and Spring Modulith with zero data loss and no downtime. The hardest constraint was business continuity — it's in production — so we used the Strangler Fig pattern and migrated module by module, sales first, then freight, then warehouse. Data migration across 100-plus tables I handled with the automated toolkit and its validation. The team was new to the stack, so I invested heavily in coding standards, reusable patterns, and pair programming, and I redesigned the inconsistent legacy APIs around our new standard. The lesson: migrate incrementally, keep backward compatibility, validate relentlessly, and bring the team along.</p></div>
<p>From your CV: "Led the migration of a legacy logistics system to a modern stack (Next.js, Java 21, Spring Modulith), ensuring business continuity and zero data loss."</p>
<pre>CARIS UPGRADE Migration Overview:

FROM: Legacy logistics system
TO: Next.js + React + TypeScript + Zustand + TanStack Query (Frontend)
    Java 21 + Spring Boot + Spring Modulith + MyBatis (Backend)
    SQL Server (Database)

Challenges & Solutions:

1. BUSINESS CONTINUITY
   Challenge: System is in production, can't stop operations
   Solution: Strangler Fig pattern — migrate module by module
   → Sales module first, then freight, then warehouse

2. DATA MIGRATION
   Challenge: ~100+ tables across 10+ modules
   Solution: Built automated migration toolkit with validation
   → Schema comparison + row-level validation + reconciliation

3. TEAM ADOPTION
   Challenge: Team unfamiliar with new stack (Next.js, TypeScript, Zustand)
   Solution: Created coding standards, reusable patterns, pair programming
   → Gradual adoption, learning sprints

4. API REDESIGN
   Challenge: Legacy APIs inconsistent, poorly documented
   Solution: Standardized API patterns with OpenAPI/Swagger
   → Consistent error handling, auth, request lifecycle

5. PERFORMANCE
   Challenge: Complex data grids with large datasets
   Solution: Server-side pagination, optimistic updates, 
   TanStack Query for caching</pre>
<div class="key-point">Key to successful migrations: do it incrementally (Strangler Fig), maintain backward compatibility, have robust validation, and bring the team along through mentoring and documentation.</div>`,
      },
      // --- AI-ASSISTED DEVELOPMENT ---
      {
        q: 'You mention AI-assisted development. How do you use AI tools in your workflow?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I've pushed AI into the team's everyday workflow, deliberately. I use it to knock out boilerplate — CRUD endpoints, test scaffolding, migration scripts — and to modernize legacy patterns, like converting JavaScript to TypeScript or class components to hooks. The bigger lever was building a shared library of reusable, standardized prompts so the whole team gets consistent output, for example "convert this Spring controller to follow our API standard." I treat every AI output as a first draft that I review and test — it's an accelerator, not an authority. The clearest value is eliminating repetitive work so engineers spend their time on the hard problems.</p></div>
<p>From your CV: "Introduced AI-assisted development practices by researching and creating reusable prompts, accelerating development and refactoring."</p>
<pre>How I use AI tools:

1. CODE GENERATION
   → Generate boilerplate code (CRUD endpoints, entity classes)
   → Create unit test scaffolding
   → Generate SQL migration scripts
   → Convert legacy code patterns to modern equivalents

2. CODE REVIEW ASSISTANCE
   → Ask AI to review code for potential issues
   → Identify security vulnerabilities
   → Suggest performance improvements

3. REFACTORING
   → Convert JavaScript to TypeScript
   → Modernize class components to hooks
   → Restructure code to follow design patterns

4. DOCUMENTATION
   → Generate API documentation
   → Create code comments for complex logic
   → Write README sections

5. REUSABLE PROMPTS
   → Created a library of prompts for common tasks
   → Standardized AI usage across the team
   → "Convert this Spring Controller to follow our API standard"

Tools: GitHub Copilot, Gemini, OpenRouter (multiple providers)
SLearning Studio: Built multi-provider AI orchestration system</pre>
<div class="key-point">AI tools amplify productivity but require good prompts and human verification. I treat AI output as a first draft — always review and test. The biggest value is in eliminating repetitive boilerplate work.</div>`,
      },
      // --- TECHNICAL DEEP-DIVE ---
      {
        q: 'You work with both PostgreSQL and SQL Server. What are the key differences?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>I've shipped on both, and the differences that actually bite you are practical ones. Both default to Read Committed and both do MVCC, but Postgres keeps versions append-only while SQL Server uses tempdb. Day to day it's syntax and features: UPSERT is <code>ON CONFLICT</code> in Postgres versus <code>MERGE</code> in SQL Server, pagination is <code>LIMIT/OFFSET</code> versus <code>OFFSET/FETCH</code>, and Postgres gives you JSONB and multiple procedural languages where SQL Server gives you T-SQL and the Microsoft ecosystem. My rule of thumb: Postgres for greenfield — it's free, extensible, and JSONB is excellent — and SQL Server where you're already in a Microsoft shop.</p></div>
<table><tr><th>Feature</th><th>PostgreSQL</th><th>SQL Server</th></tr>
<tr><td>License</td><td>Open source (free)</td><td>Commercial (Microsoft)</td></tr>
<tr><td>Default isolation</td><td>Read Committed</td><td>Read Committed</td></tr>
<tr><td>MVCC</td><td>Yes (append-only)</td><td>Yes (tempdb-based)</td></tr>
<tr><td>JSON support</td><td>Excellent (JSONB)</td><td>Good (JSON functions)</td></tr>
<tr><td>Full-text search</td><td>Built-in (tsvector)</td><td>Built-in (FTS)</td></tr>
<tr><td>Partitioning</td><td>Declarative (10+)</td><td>Declarative (2016+)</td></tr>
<tr><td>Replication</td><td>Streaming, logical</td><td>Always On, log shipping</td></tr>
<tr><td>Procedural lang</td><td>PL/pgSQL, multiple</td><td>T-SQL only</td></tr>
<tr><td>UPSERT syntax</td><td>ON CONFLICT</td><td>MERGE</td></tr>
<tr><td>LIMIT</td><td>LIMIT N OFFSET M</td><td>OFFSET M ROWS FETCH NEXT N</td></tr>
</table>
<pre>-- PostgreSQL: UPSERT
INSERT INTO users (email, name) VALUES ('john@mail.com', 'John')
ON CONFLICT (email) DO UPDATE SET name = EXCLUDED.name;

-- SQL Server: MERGE
MERGE INTO users AS target
USING (VALUES ('john@mail.com', 'John')) AS source (email, name)
ON target.email = source.email
WHEN MATCHED THEN UPDATE SET name = source.name
WHEN NOT MATCHED THEN INSERT (email, name) VALUES (source.email, source.name);</pre>
<div class="key-point">PostgreSQL is preferred for new projects (free, extensible, JSONB, community). SQL Server is common in enterprise environments with Microsoft ecosystems.</div>`,
      },
      {
        q: 'Explain your experience with MyBatis vs JPA. When would you choose each?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I've used both heavily and pick based on where the complexity lives. At CyberLogitec on FWD and CARIS it was MyBatis, because the logistics queries had five-plus joins against legacy schemas we couldn't change, and I wanted full control over every statement with dynamic SQL. At WOWCNS it was JPA with Spring Data, because that work was CRUD-heavy e-commerce on a schema we owned, where derived queries and rapid development mattered more. So: MyBatis when SQL is complex or the schema is fixed and DBA-managed, JPA when you're CRUD-dominant on a greenfield domain. On CARIS we kept Spring Boot for DI, security, and the API layer while MyBatis handled the heavy queries.</p></div>
<p>From your CV: You used MyBatis in CyberLogitec projects and JPA in WOWCNS.</p>
<pre>My experience:

MyBatis (CyberLogitec — FWD, CARIS):
  → Complex logistics queries with 5+ JOINs
  → Legacy database schemas (can't change table structure)
  → DBA team writes and optimizes SQL
  → Full control over every query
  → Dynamic SQL with &lt;if&gt;, &lt;foreach&gt;, &lt;where&gt;

JPA/Hibernate (WOWCNS — WowNet, MyOffice):
  → CRUD-heavy e-commerce features
  → Rapid development with Spring Data JPA
  → Domain-driven design with entity relationships
  → Method name queries (findByEmailAndStatus)

Decision Guide:
┌─────────────────────────────────────────────┐
│ Choose MyBatis when:                        │
│  → Complex reporting queries                │
│  → Legacy DB schema you can't modify        │
│  → DBA team manages SQL                     │
│  → Need fine-grained SQL control            │
│  → High-performance batch operations        │
├─────────────────────────────────────────────┤
│ Choose JPA when:                            │
│  → CRUD-dominant application                │
│  → Greenfield project (design your schema)  │
│  → Domain-driven design                     │
│  → Rapid prototyping                        │
│  → Team familiar with ORM concepts          │
└─────────────────────────────────────────────┘</pre>
<div class="key-point">In the CARIS project, we used MyBatis for complex logistics queries that would be hard to express with JPQL, while keeping Spring Boot for DI, security, and API layer.</div>`,
      },
      {
        q: 'How do you handle high-volume data processing and batch operations?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>For high volume I lean on database-native paths rather than fighting the ORM. On the FWD toolkit I used the PostgreSQL <code>COPY</code> protocol to stream up to 100K rows a batch, which skips per-row INSERT overhead entirely, and for MyBatis batch inserts I flush every 500 to 1000 records to stay under SQL length limits. I always process in chunks with progress tracking and resume-on-failure, surfaced through a real-time Socket.IO UI. On the database side I'll stage into UNLOGGED tables, bump <code>work_mem</code>, and partition by date. And whatever the throughput, I validate integrity before and after and mask PII along the way.</p></div>
<p>From your CV: "High-volume data processing (batch, streaming)" and "up to 100K rows/batch."</p>
<pre>Strategies I've used:

1. STREAMING WITH PostgreSQL COPY PROTOCOL
   → Bypasses row-by-row INSERT overhead
   → Direct binary stream into tables
   → Used in FWD Migration Toolkit (100K rows/batch)

2. BATCH INSERT WITH MyBatis
   &lt;insert id="batchInsert"&gt;
     INSERT INTO records (col1, col2) VALUES
     &lt;foreach collection="list" item="item" separator=","&gt;
       (#{item.col1}, #{item.col2})
     &lt;/foreach&gt;
   &lt;/insert&gt;
   → Flush every 500-1000 records to avoid SQL length limits

3. CHUNKED PROCESSING
   → Process large datasets in chunks (1000 rows at a time)
   → Track progress, support resume on failure
   → Real-time monitoring UI with Socket.IO

4. DATABASE OPTIMIZATION FOR BATCH
   → Disable indexes before bulk insert, rebuild after
   → Use UNLOGGED tables for staging data
   → Increase work_mem for sorting operations
   → Partition tables by date for faster operations

5. MONITORING & SAFETY
   → Progress tracking with percentage, ETA
   → Fail-safe: pause/resume/rollback controls
   → Data validation before and after migration
   → Data masking for PII compliance</pre>
<div class="key-point">For high-volume operations: use database-native protocols (COPY, bulk insert), process in chunks, monitor progress, and always validate data integrity after processing.</div>`,
      },
      // --- PERSONAL PROJECT ---
      {
        q: 'Tell me about your personal project (SLearning Studio). What did you learn?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>SLearning Studio is my personal AI-assisted English-learning and developer-utility platform, and it's where I get to own something end to end. Architecturally it's client-first with a static export to GitHub Pages and Google Sheets as a dynamic content source, so it runs at zero server cost. The interesting part was multi-provider AI orchestration across Gemini, OpenRouter, and GitHub Models with configurable fallback and bounded conversation memory to control cost. I also wrestled with the Web Speech API and its iOS quirks, and migrated the whole thing from 2022 JavaScript to TypeScript and Next.js. Mostly it taught me how to build multi-provider AI systems and carry real product ownership.</p></div>
<p>From your CV: SLearning Studio — AI-assisted English learning and developer utility platform.</p>
<pre>Key technical highlights:

1. ARCHITECTURE
   → Client-first, configurable system
   → React Context + Reducer for shared state
   → Static export to GitHub Pages (no server costs)
   → Google Sheets as dynamic content source

2. AI INTEGRATION
   → Multi-provider orchestration (Gemini, OpenRouter, GitHub Models)
   → Flexible model routing with configurable fallback
   → Bounded conversation memory (15 turns / 30 messages)
     → Optimizes cost and performance

3. WEB APIs
   → Web Speech API (speech recognition & synthesis)
   → Mobile/iOS-specific handling for speech
   → YouTube IFrame API for subtitle-based learning

4. FULL MIGRATION
   → Originally JavaScript (2022) → TypeScript + Next.js (2025)
   → App Router with static export
   → Improved scalability and maintainability

What I learned:
   → How to build multi-provider AI systems
   → Mobile browser quirks with Web Speech API
   → Static site generation with dynamic content
   → End-to-end product ownership</pre>
<div class="key-point">Personal projects demonstrate initiative, curiosity, and end-to-end capability. This project shows: AI integration, modern React/Next.js, API orchestration, and product thinking.</div>`,
      },
      // --- BEHAVIORAL ---
      {
        q: 'Describe a time you disagreed with a technical decision. How did you handle it?',
        difficulty: 'hard',
        a: `<div class="interview-answer"><p>On CARIS we debated Redux versus Zustand for state management, and I favored Zustand while most of the team knew Redux. Rather than argue, I built a small proof-of-concept in both and compared bundle size, boilerplate, learning curve, and performance on our actual use case. I presented concrete numbers — Zustand cut our state code by roughly forty percent — and I took the Redux DevTools concern seriously and showed it was solved with middleware. The team chose Zustand and onboarding went faster than expected. The key was letting the POC make the argument, not me, and never framing it as I was right and they were wrong.</p></div>
<p>Use the <strong>STAR method</strong> and show professional conflict resolution.</p>
<pre>Example structure:

Situation: "During the CARIS migration, there was a debate about 
whether to use Redux or Zustand for state management."

Task: "I needed to present a case for the better option 
while respecting the team's familiarity with Redux."

Action:
- "I created a small proof-of-concept with both libraries"
- "Compared: bundle size, boilerplate, learning curve, performance"
- "Presented findings to the team with concrete code examples"
- "Highlighted that Zustand would reduce our code by ~40%"
- "Listened to concerns about Redux DevTools (solved with middleware)"

Result: "The team agreed on Zustand. Onboarding was faster than 
expected, and we reduced state management code significantly. 
The key was letting the POC speak for itself rather than arguing."</pre>
<div class="key-point">Show: data-driven decision making, willingness to listen, focusing on team success over personal preferences. Never say "I was right and they were wrong."</div>`,
      },
      {
        q: 'How do you handle working in an Agile/Scrum team?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>I'm comfortable across the full Scrum cycle and I treat it as a tool for adaptability, not ceremony for its own sake. In standups I keep it tight — done, doing, blockers — and in planning I help break stories into tasks, estimate in story points, and flag technical risk early. As deputy team lead I'll facilitate ceremonies when needed, shield the team from mid-sprint interruptions, track velocity, and coordinate cross-team dependencies. Reviews and retros are where the real value is — demoing to stakeholders and turning retro takeaways into concrete action items. The point is continuous improvement, and I can always give examples of how that helped us deliver.</p></div>
<p>From your CV: "Experienced in Agile environments" and "Supported sprint planning, task coordination."</p>
<pre>My Agile experience:

DAILY STANDUPS
→ What I did yesterday, what I'll do today, blockers
→ Keep it under 2 minutes per person

SPRINT PLANNING
→ Help break user stories into tasks
→ Estimate using story points (Fibonacci)
→ Identify technical risks early

SPRINT REVIEW / DEMO
→ Demo completed features to stakeholders
→ Gather feedback for next sprint

RETROSPECTIVE
→ What went well, what to improve
→ Action items for next sprint

As Deputy Team Lead:
→ Facilitate ceremonies when needed
→ Shield team from external interruptions during sprint
→ Track velocity and identify capacity issues
→ Coordinate with other teams for cross-team dependencies</pre>
<div class="key-point">Show that you understand Agile is about adaptability and continuous improvement, not just ceremonies. Mention concrete examples of how Agile helped your team deliver better.</div>`,
      },
      {
        q: 'How do you prioritize tasks when you have multiple urgent requests?',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I run everything through an urgency-versus-importance lens. A production bug is urgent and important, so it's done now; architecture work is important but not urgent, so it gets scheduled; minor requests get delegated or dropped. Just as important, I communicate — I tell stakeholders what I'm doing and what's deferred, and I'll say I can do A today and B tomorrow, does that work. If a task is too big I split it and deliver incremental value. Concretely, when a production bug, a feature deadline, and a review request all landed at once, I fixed the bug first, reviewed the PR while waiting on a rebuild to unblock a teammate, and negotiated a short extension with the PM.</p></div>
<pre>My prioritization framework:

1. URGENCY vs IMPORTANCE MATRIX (Eisenhower)
   ┌─────────────────┬─────────────────┐
   │  URGENT +       │  NOT URGENT +   │
   │  IMPORTANT      │  IMPORTANT      │
   │  → Do now       │  → Schedule     │
   │  (production    │  (architecture  │
   │   bugs)         │   improvements) │
   ├─────────────────┼─────────────────┤
   │  URGENT +       │  NOT URGENT +   │
   │  NOT IMPORTANT  │  NOT IMPORTANT  │
   │  → Delegate     │  → Eliminate    │
   │  (minor UI fix) │  (nice-to-have) │
   └─────────────────┴─────────────────┘

2. COMMUNICATE
   → Tell stakeholders what you're working on and what's deferred
   → "I can do A today and B tomorrow. Is that acceptable?"

3. BREAK IT DOWN
   → If a task is too big, split it
   → Deliver incremental value

Real example: During a sprint, production bug + feature deadline + 
code review request all came at once.
→ Fixed production bug first (urgent + important)
→ Reviewed PR during waiting time (quick, unblocks teammate)
→ Negotiated feature deadline extension with PM</pre>
<div class="key-point">Show that you communicate proactively, negotiate deadlines when needed, and make transparent decisions about priorities.</div>`,
      },
      {
        q: 'How comfortable are you working in English with international teams?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>I'm at a professional working level and comfortable operating day-to-day in English with international teams — honestly, this interview is the proof. I run standups in English, write documentation and code review comments in English, and I do all my Slack and email with international colleagues in English, on top of consuming English technical docs constantly. If pressed on limits, I'm honest: technical discussion is completely natural for me, and for very nuanced business conversations I'll occasionally take a moment to make sure I'm precise. And if I don't understand something, I ask for clarification — that's just good communication.</p></div>
<p>From your CV: "Professional Working Proficiency (Intermediate–Upper Intermediate). Comfortable working and communicating in English with international teams."</p>
<pre>Demonstrate during the interview:
→ The fact that you're interviewing in English IS the proof
→ Mention specific examples:
  - Daily standups in English
  - Written documentation and code reviews in English
  - Email/Slack communication with international colleagues
  - Reading English technical documentation
  - This interview itself!

If asked about challenges:
→ Be honest: "Technical discussions in English are natural for me. 
   I sometimes need a moment for very nuanced business discussions, 
   but I always ensure clear communication."</pre>
<div class="key-point">Don't just say "my English is good." Show it through the quality of your responses during the interview. If you don't understand a question, ask for clarification — that's professional communication.</div>`,
      },
      {
        q: 'What is your experience with Docker and CI/CD? Describe your workflow.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>I use Docker across the whole lifecycle. Locally it's Docker Compose to stand up Postgres, Redis, and the app so everyone runs the same environment. For production I write multi-stage Dockerfiles — build in a JDK image, run on a slim Alpine JRE, run as a non-root user to shrink the image and the attack surface. On the pipeline side I've set up GitHub Actions and GitLab CI with build, test, docker-build, and deploy stages and environment-specific config through pipeline variables. For SLearning Studio it's a GitHub Actions flow that builds, exports the static Next.js site, and deploys to Pages. My CI/CD is pragmatic, but I understand the full pipeline end to end.</p></div>
<p>From your CV: "Docker" and "basic CI/CD pipelines" in your tech stack.</p>
<pre>My Docker experience:

1. LOCAL DEVELOPMENT
   → Docker Compose for local dev environment
   → PostgreSQL, Redis, app containers
   → Consistent "works on my machine" solution

2. DEPLOYMENT
   → Multi-stage Dockerfile for production images
   → Minimize image size with Alpine base
   → Non-root user for security

3. CI/CD PIPELINE
   → GitHub Actions / GitLab CI
   → Stages: Build → Test → Docker Build → Deploy
   → Environment-specific configs via pipeline variables

Example Dockerfile (Spring Boot):
FROM eclipse-temurin:21-jdk AS builder
WORKDIR /app
COPY . .
RUN ./mvnw package -DskipTests

FROM eclipse-temurin:21-jre-alpine
WORKDIR /app
COPY --from=builder /app/target/*.jar app.jar
USER 1001
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]

For SLearning Studio:
→ GitHub Actions: build → export → deploy to GitHub Pages
→ Static export with Next.js</pre>
<div class="key-point">Even with "basic" CI/CD experience, show that you understand the full pipeline: build, test, containerize, deploy. Mention any automation you've created.</div>`,
      },
      {
        q: 'What are your salary expectations?',
        difficulty: 'tricky',
        a: `<div class="interview-answer"><p>I treat this as a negotiation, so I come prepared but stay flexible. I've researched the market range for a senior fullstack role in HCMC, so I know where I stand. If it comes up early I'll deflect politely and ask about the budget for the role first, because I'd rather understand the full scope before naming a number. When pressed I give a researched range grounded in my seven years and both my Java and React/Next.js depth, and I note I care about the total package — growth, learning, benefits — not just base. My rule is to avoid giving the first number, and to do the real negotiating after they've decided they want me.</p></div>
<p>This is a negotiation question. Be prepared but flexible.</p>
<pre>Strategies:

1. RESEARCH FIRST
   → Know the market range for your role/location
   → Senior Fullstack Developer in HCMC: research current ranges
   → Websites: Glassdoor, TopCV, LinkedIn salary insights

2. DEFLECT EARLY (if asked too soon)
   → "I'd like to understand the full role and responsibilities first.
      What's the budget range for this position?"

3. GIVE A RANGE (when pressed)
   → "Based on my 7 years of experience, leadership skills, and
      expertise in both Java and React/Next.js, I'm looking for
      [range]. But I'm flexible depending on the total package
      — benefits, learning opportunities, and career growth
      are also important to me."

4. TOTAL COMPENSATION
   → Don't just look at base salary
   → Consider: bonus, equity, insurance, remote policy,
      learning budget, vacation days, hardware</pre>
<div class="key-point">Never give the first number if you can avoid it. Let the company share their range. Your leverage increases after they decide they want you — negotiate after receiving an offer, not during the interview.</div>`,
      },
      {
        q: 'Where do you see yourself in 3-5 years?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>In three to five years I want to grow along two tracks. Technically, I want to go deeper on system architecture and cloud-native patterns like Kubernetes and service mesh, and contribute to higher-level architectural decisions while staying hands-on with code. On the leadership side, I want to move from team lead toward a technical lead or architect role — defining tech strategy and best practices and building high-performing teams. I see this role as a strong next step because it lets me do both. I'm not after someone's title; I'm after bigger technical and team impact.</p></div>
<pre>Good structure:

"In the next 3-5 years, I want to grow in two directions:

TECHNICAL:
→ Deepen my expertise in system architecture and design
→ Learn more about cloud-native patterns (Kubernetes, service mesh)
→ Contribute to architectural decisions at a higher level
→ Stay hands-on with coding while mentoring teams

LEADERSHIP:
→ Grow from team lead to technical lead / architect role
→ Define tech strategy and best practices for engineering teams
→ Build and mentor high-performing teams

I see this role as a great next step because [specific reason 
related to the company/role]."</pre>
<div class="key-point">Show ambition aligned with the company's growth. Don't say "I want your manager's job" — say "I want to grow into a role where I can have a bigger technical and team impact."</div>`,
      },
      {
        q: 'You list Webix and IBSheet as skills. Explain what they are and when to use them.',
        difficulty: 'medium',
        a: `<div class="interview-answer"><p>Both are enterprise UI libraries built for data-intensive back-office applications, which is exactly what logistics demands. IBSheet is a Korean spreadsheet-style grid — Excel-like editing in the browser, virtual scrolling over 100K-plus rows, copy-paste from Excel — which operators love for data entry and reporting. Webix is a broader widget library with rich grids, charts, and forms and server-side data handling for large datasets. On the FWD project we used both for booking and invoicing forms and the big freight-operations grids. The modern equivalent is something like AG Grid with better React integration, so the choice really comes down to the existing codebase and team familiarity.</p></div>
<p>Both are enterprise UI component libraries focused on <strong>data-intensive applications</strong> (grids, charts, forms).</p>
<pre>IBSheet:
→ Korean enterprise spreadsheet-like grid component
→ Excel-like editing in the browser
→ Handles 100K+ rows with virtual scrolling
→ Used in logistics systems for data entry and reporting
→ Supports copy-paste from Excel, cell formatting, formulas

Webix:
→ Full UI library with 100+ widgets
→ Rich data grid, charts, forms, scheduling
→ Built for enterprise back-office applications
→ Server-side data processing for large datasets

Both used in CyberLogitec FWD project:
→ Complex data entry forms for booking, invoicing
→ Large data grids displaying freight operations
→ Excel-like editing experience for logistics operators

vs Modern alternatives (AG Grid, MUI DataGrid):
→ IBSheet/Webix have been proven in enterprise logistics
→ AG Grid is the modern equivalent with better React integration
→ Choice depends on existing codebase and team familiarity</pre>
<div class="key-point">These are specialized enterprise tools. When asked, explain that enterprise logistics requires spreadsheet-like UIs with massive data handling — different from typical web apps.</div>`,
      },
      {
        q: 'Do you have any questions for us?',
        difficulty: 'easy',
        a: `<div class="interview-answer"><p>I always come with questions, because the interview goes both ways. I'd ask what success looks like in the first ninety days, and what the biggest technical challenges facing the team are right now. On the team side I'm curious how engineering is structured and what the code-review and deployment process looks like. And on growth, how you support career development for senior engineers and whether there's a mentoring culture. I deliberately skip anything I could find on the website, or salary in a first interview — I want the questions to show genuine interest and seniority.</p></div>
<p>ALWAYS ask questions. It shows interest and helps you evaluate the company.</p>
<pre>Good questions to ask:

ABOUT THE ROLE:
→ "What does a typical day look like for this position?"
→ "What are the biggest technical challenges the team faces?"
→ "What would success look like in the first 90 days?"

ABOUT THE TEAM:
→ "How is the engineering team structured?"
→ "What's the code review and deployment process?"
→ "What tech stack are you using and are there plans to evolve it?"

ABOUT GROWTH:
→ "What learning and development opportunities do you offer?"
→ "How do you support career growth for senior developers?"
→ "Is there a mentoring culture in the team?"

ABOUT THE PRODUCT:
→ "What's the product roadmap for the next year?"
→ "Who are your main users and what problems do you solve?"

AVOID:
→ Don't ask about salary/benefits in the first interview
→ Don't ask things easily found on the company website
→ Don't ask "Do I have the job?"</pre>
<div class="key-point">Prepare 3-5 questions before the interview. The quality of your questions tells the interviewer a lot about your seniority and genuine interest.</div>`,
      },
    ],
  },
];
