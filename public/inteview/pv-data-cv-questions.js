// Interview data: CV-based questions (Nguyen Van Sang — Senior Fullstack Developer)
(function () {
  (window.__pvTopics = window.__pvTopics || []).push({
    id: 'cv-questions',
    name: 'CV-Based Questions',
    icon: '📋',
    questions: [
      // --- PROFESSIONAL SUMMARY / GENERAL ---
      {
        q: 'Tell me about yourself and your experience.',
        difficulty: 'easy',
        a: `<p>This is usually the <strong>first question</strong>. Prepare a 2-minute elevator pitch following this structure:</p>
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
        a: `<p>Be honest but positive. Focus on what you want, not what you're running from.</p>
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
        a: `<p>Use the <strong>STAR method</strong>: Situation → Task → Action → Result.</p>
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
        a: `<p>Show progression from junior developer to senior/lead with increasing responsibilities.</p>
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
        a: `<p>Based on your CARIS UPGRADE project using <strong>Spring Modulith</strong> with <strong>Hexagonal Architecture</strong>.</p>
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
        a: `<p>From your CARIS UPGRADE project: "Standardized API patterns (error handling, authentication, request lifecycle)."</p>
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
        a: `<p>From your CV: "Optimized SQL queries and tuned database performance through indexing and query restructuring."</p>
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
        a: `<p>From your CV: "Conducted code reviews and enforced coding standards across the team."</p>
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
        a: `<p>From your CV: "Mentored junior developers and resolved complex technical issues."</p>
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
        a: `<p>From your CV: "Led the migration of a legacy logistics system to a modern stack (Next.js, Java 21, Spring Modulith), ensuring business continuity and zero data loss."</p>
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
        a: `<p>From your CV: "Introduced AI-assisted development practices by researching and creating reusable prompts, accelerating development and refactoring."</p>
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
        a: `<table><tr><th>Feature</th><th>PostgreSQL</th><th>SQL Server</th></tr>
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
        a: `<p>From your CV: You used MyBatis in CyberLogitec projects and JPA in WOWCNS.</p>
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
        a: `<p>From your CV: "High-volume data processing (batch, streaming)" and "up to 100K rows/batch."</p>
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
        a: `<p>From your CV: SLearning Studio — AI-assisted English learning and developer utility platform.</p>
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
        a: `<p>Use the <strong>STAR method</strong> and show professional conflict resolution.</p>
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
        a: `<p>From your CV: "Experienced in Agile environments" and "Supported sprint planning, task coordination."</p>
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
        a: `<pre>My prioritization framework:

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
        a: `<p>From your CV: "Professional Working Proficiency (Intermediate–Upper Intermediate). Comfortable working and communicating in English with international teams."</p>
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
        a: `<p>From your CV: "Docker" and "basic CI/CD pipelines" in your tech stack.</p>
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
        a: `<p>This is a negotiation question. Be prepared but flexible.</p>
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
        a: `<pre>Good structure:

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
        a: `<p>Both are enterprise UI component libraries focused on <strong>data-intensive applications</strong> (grids, charts, forms).</p>
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
        a: `<p>ALWAYS ask questions. It shows interest and helps you evaluate the company.</p>
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
  });
})();
