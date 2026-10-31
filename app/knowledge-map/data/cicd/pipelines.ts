import type { KmNode } from '../../types';

export const pipelines: KmNode = {
  title: 'Pipeline Concepts',
  level: 'intermediate',
  summary:
    'The building blocks every CI/CD tool shares: stages, jobs, runners, triggers, caching and artifacts.',
  simple:
    'Every CI tool uses different words, but they all describe the same assembly line: what starts it, which stations it has, and which machines do the work.',
  points: [
    'Pipelines are defined as code in the repo (YAML or a Jenkinsfile).',
    'Jobs run on runners (agents); stages order the jobs.',
    'Caching and parallel jobs keep the pipeline fast.',
  ],
  children: [
    {
      title: 'Pipeline as Code',
      level: 'beginner',
      summary: 'The pipeline is a file in your repo, versioned and reviewed like any other code.',
      simple:
        'The recipe is written down in the cookbook, not kept in one chef’s head or in a settings screen nobody remembers.',
      points: [
        'GitHub Actions: <code>.github/workflows/*.yml</code>. GitLab: <code>.gitlab-ci.yml</code>. Jenkins: <code>Jenkinsfile</code>.',
        'Changes to the pipeline go through PRs and review.',
        'You can see exactly which pipeline built an old commit.',
        'Avoid click-configured jobs in a web UI; they drift and get lost.',
      ],
    },
    {
      title: 'Stages, Jobs & Steps',
      level: 'beginner',
      summary:
        'A pipeline has stages (in order), each stage has jobs (can run in parallel), each job has steps.',
      simple:
        'Stages are the floors of a factory. On each floor several workers (jobs) work side by side, each following a checklist (steps).',
      points: [
        'Typical stages: build → test → scan → package → deploy.',
        'Jobs in the same stage run in parallel by default (GitLab) or when no <code>needs</code> link them (GitHub Actions).',
        'A failed job stops the later stages.',
        'Steps in one job share a workspace; jobs usually don’t.',
      ],
    },
    {
      title: 'Runners & Agents',
      level: 'beginner',
      summary:
        'The machines that actually execute jobs, either hosted by the CI provider or run by you.',
      simple:
        'Runners are the workers on the assembly line. You can rent them from the CI company or hire your own.',
      points: [
        'Hosted runners: zero maintenance, fresh VM per job, billed by minutes.',
        'Self-hosted runners: needed for private networks, special hardware (GPU) or lower cost at scale.',
        'Prefer ephemeral (single-use) runners so jobs can’t leave junk for the next one.',
        'Never run untrusted PRs from forks on self-hosted runners in your network.',
      ],
    },
    {
      title: 'Triggers',
      level: 'beginner',
      summary:
        'Events that start a pipeline: pushes, pull requests, tags, schedules or a manual click.',
      simple: 'The doorbell for the factory. Different bells start different lines.',
      points: [
        'On PR: build and test to decide if it can merge.',
        'On push to main: build, test and deploy to staging (or further).',
        'On tag: run the release pipeline.',
        'Scheduled (nightly): long tests, dependency scans. Manual: production deploy with approval.',
        'Path filters skip pipelines when only unrelated files (like docs) change.',
      ],
    },
    {
      title: 'Caching',
      level: 'intermediate',
      summary: 'Reuse downloaded dependencies and build outputs between runs to save time.',
      simple:
        'Instead of driving to the store for flour every time you bake, you keep a bag in the cupboard.',
      points: [
        'Cache <code>~/.m2</code>, <code>~/.gradle</code> or the npm cache, keyed by a hash of the lockfile.',
        'A changed lockfile = new key = fresh cache.',
        'Docker layer caching speeds up image builds.',
        'A cache is a speed-up only; the build must still work with an empty cache.',
      ],
    },
    {
      title: 'Parallelism & Matrix',
      level: 'intermediate',
      summary:
        'Run independent jobs side by side, or the same job across many versions and platforms.',
      simple:
        'Ten checkout lanes instead of one. A matrix is the same checklist run at several lanes, each with a different setup.',
      points: [
        'Split a slow test suite into shards that run at the same time.',
        'Matrix build: e.g. Java 17 and 21, or Node 20, 22 and 24, on Linux and Windows.',
        'Mostly useful for libraries that support many versions; apps usually test one.',
        'Use <code>needs</code> / dependencies to build a graph instead of a long chain.',
      ],
    },
    {
      title: 'Pipeline Artifacts',
      level: 'intermediate',
      summary: 'Files one job produces and hands to later jobs or keeps for people to download.',
      simple: 'A baton passed between runners in a relay, plus a few photos kept for the record.',
      points: [
        'Build once, then pass the built JAR or bundle to test and deploy jobs.',
        'Keep test reports and coverage files as artifacts for debugging.',
        'Pipeline artifacts expire; release artifacts belong in a real repository or registry.',
      ],
    },
  ],
};

export const tools: KmNode = {
  title: 'CI/CD Tools',
  level: 'intermediate',
  summary: 'A quick tour of the popular CI/CD platforms and when each one fits.',
  simple:
    'Like car brands: they all drive you there. Pick the one that fits where your code lives and how much you want to maintain.',
  points: [
    'The concepts transfer: learn one tool well and the others feel familiar.',
    'Usually the best pick is the one built into your code host.',
    'Self-hosted tools give control but cost maintenance time.',
  ],
  children: [
    {
      title: 'GitHub Actions',
      level: 'intermediate',
      summary: 'CI/CD built into GitHub; workflows are YAML files that run jobs on events.',
      simple: 'Lives right next to your code on GitHub, with a big shop of ready-made steps.',
      points: [
        'Workflows: <code>on</code> (triggers) → <code>jobs</code> → <code>steps</code>, with <code>runs-on</code> picking the runner.',
        'Reusable steps from the Marketplace via <code>uses: actions/checkout@v4</code>.',
        'Built-in secrets, environments with approvals, and OIDC to clouds.',
        'Pin third-party actions to a commit SHA for security.',
      ],
    },
    {
      title: 'GitLab CI/CD',
      level: 'intermediate',
      summary: 'GitLab’s built-in pipelines, defined in .gitlab-ci.yml with stages and jobs.',
      simple: 'An all-in-one box: code, CI, container registry and security scans in one product.',
      points: [
        'Clear <code>stages</code> model; <code>needs</code> for faster graphs.',
        'Easy self-hosted runners; popular for on-premise setups.',
        'Environments, review apps and a built-in registry.',
        'Templates and <code>include</code> share pipeline config across projects.',
      ],
    },
    {
      title: 'Jenkins',
      level: 'intermediate',
      summary:
        'The veteran open-source automation server, self-hosted, with a huge plugin ecosystem.',
      simple:
        'A big, old workshop you own. It can build anything, but you have to keep the machines oiled yourself.',
      points: [
        'Pipelines in a <code>Jenkinsfile</code> (Groovy-based declarative syntax).',
        'Thousands of plugins; also thousands of upgrades and security patches to manage.',
        'Still common in enterprises and on-premise networks.',
        'Use agents in containers and avoid running builds on the controller.',
      ],
    },
    {
      title: 'Azure DevOps & CircleCI',
      level: 'intermediate',
      summary:
        'Azure Pipelines fits Microsoft-centered teams; CircleCI is a fast hosted CI service.',
      simple:
        'Two more solid brands: one popular in Microsoft shops, one known for speed and simple setup.',
      points: [
        'Azure Pipelines: <code>azure-pipelines.yml</code>, tight Azure and Boards integration.',
        'CircleCI: <code>.circleci/config.yml</code>, reusable "orbs", strong caching.',
        'Both support GitHub repos too.',
      ],
    },
    {
      title: 'Choosing a Tool',
      level: 'intermediate',
      summary: 'Pick based on where your code lives, where you deploy, and who will maintain it.',
      simple:
        'Choose the toolbox that’s already in your garage unless it’s missing something you really need.',
      points: [
        'Code on GitHub → GitHub Actions; on GitLab → GitLab CI.',
        'Strict on-premise or air-gapped → GitLab self-managed or Jenkins.',
        'Count maintenance: hosted saves people time; self-hosted saves money at large scale.',
        'Avoid locking all logic into tool-specific YAML; keep the real work in scripts or build tools.',
      ],
      tip: 'Keep pipeline YAML thin: call ./gradlew build or npm run ci, so you can run the same thing locally and switch tools later.',
    },
  ],
};
