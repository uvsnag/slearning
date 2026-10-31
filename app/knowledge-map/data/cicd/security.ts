import type { KmNode } from '../../types';

export const qualitySecurity: KmNode = {
  title: 'Quality Gates & Security',
  level: 'intermediate',
  summary:
    'Automatic checks that block bad or unsafe code, and how to protect the pipeline itself.',
  simple:
    'Quality gates are the security checkpoints at an airport. Every change walks through them, and anything suspicious stops before boarding.',
  points: [
    'Shift left: find problems in the PR, not in production.',
    'Scan your code, your dependencies and your images.',
    'The pipeline holds keys to production, so it is an attack target too.',
  ],
  children: [
    {
      title: 'Linting & Formatting',
      level: 'beginner',
      summary: 'Tools that check code style and common mistakes automatically on every change.',
      simple:
        'A spell checker for code. It catches the small stuff so reviewers can focus on the big stuff.',
      points: [
        'JavaScript: ESLint + Prettier. Java: Checkstyle, Spotless, SpotBugs, PMD.',
        'Run them in a pre-commit hook and again in CI (hooks can be skipped).',
        'Fail the build on lint errors; don’t let warnings pile up forever.',
      ],
    },
    {
      title: 'Quality Gates',
      level: 'intermediate',
      summary:
        'Rules a change must pass before it can merge or deploy (tests, coverage, scans, approvals).',
      simple: 'A bouncer with a checklist: no green checks, no entry.',
      points: [
        'Required status checks on the PR via branch protection.',
        'SonarQube/SonarCloud: gates on new bugs, code smells and coverage of new code.',
        'Gate on new issues; old ones get fixed over time.',
        'Too many slow or noisy gates make people look for ways around them.',
      ],
    },
    {
      title: 'SAST',
      level: 'intermediate',
      summary:
        'Static Application Security Testing: scans source code for security bugs without running it.',
      simple: 'Reading the building plans to spot a missing fire exit before anything is built.',
      points: [
        'Finds things like SQL injection, unsafe deserialization, hard-coded secrets.',
        'Tools: CodeQL, Semgrep, SonarQube, SpotBugs with Find Security Bugs.',
        'Runs on PRs; tune rules to cut false positives or people stop reading results.',
      ],
    },
    {
      title: 'DAST',
      level: 'advanced',
      summary:
        'Dynamic Application Security Testing: attacks a running app from the outside to find holes.',
      points: [
        'Runs against a deployed test environment, not source code.',
        'Tools: OWASP ZAP, Burp Suite.',
        'Finds missing security headers, injection, auth problems at runtime.',
        'Slower; often run nightly or before release rather than on every PR.',
      ],
    },
    {
      title: 'Dependency Scanning',
      level: 'intermediate',
      summary:
        'SCA (Software Composition Analysis): checks your libraries for known vulnerabilities and bad licenses.',
      simple:
        'Most of your app is other people’s code. This checks the recall list for every part you bought.',
      points: [
        'Tools: Dependabot, Renovate, Snyk, OWASP Dependency-Check, <code>npm audit</code>.',
        'Scan container images too: Trivy, Grype.',
        'Keep dependencies updated in small, regular PRs; big jumps hurt.',
        'Fail on critical, fixable issues; track the rest.',
      ],
    },
    {
      title: 'SBOM',
      level: 'advanced',
      summary:
        'Software Bill of Materials: a list of every component and version inside your artifact.',
      points: [
        'Standard formats: SPDX and CycloneDX.',
        'Generate in the pipeline with Syft, Trivy or build plugins (CycloneDX for Maven/Gradle).',
        'When a new CVE appears, you can instantly see which apps contain the library.',
        'Increasingly required by customers and regulations.',
      ],
    },
    {
      title: 'Secrets Management',
      level: 'intermediate',
      summary:
        'Keep passwords, tokens and keys out of code and logs; inject them only when needed.',
      simple:
        'Don’t tape the house key to the front door. Keep it in a safe and hand it out only to who needs it.',
      points: [
        'Never commit secrets; scan for them (gitleaks, GitHub secret scanning with push protection).',
        'Store them in the CI secret store or a vault (HashiCorp Vault, AWS Secrets Manager, Azure Key Vault).',
        'Scope secrets to the environment and job that need them.',
        'A leaked secret must be rotated, not just deleted from Git history.',
      ],
    },
    {
      title: 'OIDC Instead of Static Keys',
      level: 'advanced',
      summary:
        'The pipeline proves its identity to the cloud and gets short-lived credentials, with no stored keys.',
      points: [
        'The CI provider issues a signed token saying "this is repo X, branch main, env prod".',
        'The cloud (AWS, Azure, GCP) trusts that issuer and exchanges it for temporary credentials.',
        'No long-lived access keys to leak or rotate.',
        'Restrict trust by repo, branch and environment, not just the organization.',
      ],
      tip: 'If your pipeline has a cloud access key saved as a secret, moving to OIDC is one of the best security upgrades you can make.',
    },
    {
      title: 'Signing & Provenance',
      level: 'expert',
      summary:
        'Prove who built an artifact, from which source, and that nobody changed it afterwards.',
      points: [
        'Sign images and artifacts, e.g. with Sigstore cosign (keyless, using OIDC identity).',
        'Provenance: a signed record of source commit, builder and build steps.',
        'SLSA (Supply-chain Levels for Software Artifacts) defines levels of build integrity.',
        'Deploy-time policy (e.g. Kyverno, admission controllers) can reject unsigned images.',
        'Pin third-party CI actions and base images by digest to avoid tampered updates.',
      ],
    },
  ],
};
