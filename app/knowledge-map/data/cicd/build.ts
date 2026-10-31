import type { KmNode } from '../../types';

export const buildAutomation: KmNode = {
  title: 'Build Automation',
  level: 'beginner',
  summary: 'Turning source code into a tested, versioned artifact the same way every time.',
  simple:
    'A build tool is a recipe that a machine can follow exactly. Same ingredients in, same cake out, no matter who presses the button.',
  points: [
    'One command should build and test the whole project.',
    'Pin your dependencies so builds don’t change by themselves.',
    'The output is an artifact with a clear version, stored in a repository.',
  ],
  children: [
    {
      title: 'Build Tools',
      level: 'beginner',
      summary:
        'Maven, Gradle and npm compile code, fetch dependencies, run tests and package the result.',
      simple:
        'The build tool is the kitchen robot: it gets the ingredients (dependencies), mixes them (compile), tastes (tests) and boxes the cake (package).',
      points: [
        'Maven: <code>mvn verify</code> runs compile, tests and packaging in fixed phases.',
        'Gradle: <code>./gradlew build</code>; flexible, fast with its build cache.',
        'npm: <code>npm ci</code> then <code>npm test</code> and <code>npm run build</code>.',
        'Commit the wrapper (<code>gradlew</code>, <code>mvnw</code>) so CI uses the same tool version as you.',
      ],
      tip: 'If you can’t build the project with one command on a clean machine, fix that before writing any pipeline.',
    },
    {
      title: 'Lockfiles',
      level: 'beginner',
      summary:
        'A file that records the exact version of every dependency, so every install is identical.',
      simple:
        'A shopping list that says "Brand X, 500 g, batch 42" instead of just "flour". You get the same flour every time.',
      points: [
        'npm: <code>package-lock.json</code>; Yarn: <code>yarn.lock</code>; pnpm: <code>pnpm-lock.yaml</code>.',
        'Always commit the lockfile.',
        'In CI use <code>npm ci</code>: it installs exactly the lockfile and fails if it’s out of sync.',
        'Gradle has dependency locking; Maven usually pins exact versions in the POM.',
        'Update dependencies on purpose (e.g. with Renovate or Dependabot PRs), not by accident.',
      ],
    },
    {
      title: 'Reproducible Builds',
      level: 'intermediate',
      summary:
        'Building the same commit twice gives the same result, with no hidden outside inputs.',
      simple:
        'If two bakers follow the recipe and get different cakes, something in the kitchen is secretly changing. Find it and pin it down.',
      points: [
        'Pin tool versions (JDK, Node), dependency versions and base images.',
        'Build in a clean, fresh environment (a container or fresh runner).',
        'Avoid "latest" tags and downloads from random URLs during the build.',
        'Don’t rely on files left over from a previous build.',
      ],
    },
    {
      title: 'Artifacts & Repositories',
      level: 'intermediate',
      summary:
        'The built output (JAR, npm package, Docker image) is stored in a repository for later deploys.',
      simple:
        'The finished cake goes into a labeled freezer, not back into the oven. Every deploy takes it from the freezer.',
      points: [
        'Examples: JAR/WAR, npm tarball, static site bundle, container image.',
        'Stored in Nexus, Artifactory, GitHub Packages, or a container registry.',
        'Released artifacts are immutable: never overwrite version 1.2.3.',
        'Keep a link from artifact to commit SHA and build number.',
      ],
    },
    {
      title: 'Semantic Versioning',
      level: 'beginner',
      summary:
        'Version numbers as MAJOR.MINOR.PATCH, where each part signals what kind of change it is.',
      simple:
        'Like a promise on the label: a PATCH fixes things, a MINOR adds things, a MAJOR may break things you rely on.',
      points: [
        'MAJOR: breaking change (2.0.0).',
        'MINOR: new feature, still compatible (1.3.0).',
        'PATCH: bug fix only (1.2.4).',
        'Pre-releases: <code>2.0.0-rc.1</code>; Maven snapshots: <code>1.3.0-SNAPSHOT</code>.',
        'Most important for libraries and APIs that others depend on.',
      ],
    },
    {
      title: 'Automated Versioning',
      level: 'advanced',
      summary: 'Let the pipeline pick version numbers and changelogs from commit messages or tags.',
      points: [
        'Conventional Commits: <code>feat:</code>, <code>fix:</code>, <code>feat!:</code> describe the change type.',
        'Tools like semantic-release or release-please bump the version and write the changelog.',
        'Apps deployed continuously often just use the commit SHA or build number.',
        'Never let two builds produce the same version number with different content.',
      ],
    },
  ],
};
