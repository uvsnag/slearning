import type { KmNode } from '../../types';

export const infraAndData: KmNode = {
  title: 'Containers, IaC & Databases',
  level: 'advanced',
  summary:
    'Building images, managing infrastructure as code, GitOps, and shipping database changes safely.',
  simple:
    'The app is not the only thing that changes. Servers, networks and database tables change too, and they deserve the same automated, reviewed path.',
  points: [
    'Container images are the most common deploy artifact today.',
    'Infrastructure and database changes live in Git and go through the pipeline.',
    'Database migrations are the riskiest part of most deploys.',
  ],
  children: [
    {
      title: 'Building Images in CI',
      level: 'intermediate',
      summary: 'The pipeline builds a Docker image from your artifact and pushes it to a registry.',
      simple:
        'You pack the app plus everything it needs into a sealed shipping box, label it, and put it in the warehouse.',
      points: [
        'Use multi-stage builds so the final image has no compilers or source.',
        'Cache layers: copy dependency files first, source code last.',
        'Alternatives without a Dockerfile: Jib (Java), Cloud Native Buildpacks, Spring Boot <code>bootBuildImage</code>.',
        'Scan the image (Trivy) before pushing to production registries.',
      ],
    },
    {
      title: 'Image Tags & Registries',
      level: 'intermediate',
      summary: 'Name images clearly and deploy by immutable tag or digest, never by "latest".',
      simple:
        '"latest" is like saying "the newest milk in the fridge": you never know which bottle you get.',
      points: [
        'Tag with the commit SHA and/or version: <code>shop-api:1.4.2</code>, <code>shop-api:3f2a9c1</code>.',
        'A digest (<code>@sha256:…</code>) points to exactly one image, forever.',
        'Registries: Docker Hub, GHCR, GitLab Registry, ECR, ACR, Harbor.',
        'Clean up old images with retention policies.',
      ],
    },
    {
      title: 'Infrastructure as Code',
      level: 'advanced',
      summary:
        'Describe servers, networks and cloud resources in code files, then let a tool create them.',
      points: [
        'Terraform/OpenTofu: declarative, multi-cloud; <code>plan</code> shows changes, <code>apply</code> makes them.',
        'Others: Pulumi (in JavaScript, Java and more), AWS CDK, CloudFormation, Bicep.',
        'Run <code>plan</code> on the PR so reviewers see the real change.',
        'Store state remotely with locking; never edit resources by hand ("drift").',
      ],
    },
    {
      title: 'GitOps',
      level: 'advanced',
      summary:
        'Git holds the desired state of your clusters; an agent in the cluster pulls and applies it.',
      points: [
        'Tools: Argo CD and Flux for Kubernetes.',
        'CI builds and pushes the image, then updates the image tag in a config repo.',
        'The agent notices the change and syncs the cluster; drift is reverted automatically.',
        'Pull-based: CI never needs cluster admin credentials.',
        'Rollback = revert the Git commit.',
      ],
    },
    {
      title: 'Migration Tools',
      level: 'intermediate',
      summary:
        'Flyway and Liquibase apply versioned database changes in order and track which ran.',
      simple:
        'A numbered list of renovation steps for the database. The tool remembers which steps are done and only runs the new ones.',
      points: [
        'Flyway: SQL files like <code>V3__add_email.sql</code>, run in version order.',
        'Liquibase: changelogs in XML/YAML/SQL with rollback support.',
        'Both keep a history table in the database.',
        'Never edit a migration that already ran; add a new one.',
        'Spring Boot runs Flyway or Liquibase on startup if it’s on the classpath.',
      ],
    },
    {
      title: 'Migrations in the Pipeline',
      level: 'advanced',
      summary: 'Decide when and how schema changes run relative to the new app version.',
      points: [
        'Run migrations as a separate pipeline step or job before the new app starts.',
        'With many instances, make sure only one runs migrations (tools use a lock).',
        'Test migrations against a copy of production-sized data; some lock tables for minutes.',
        'Old and new app versions will both see the new schema during rollout.',
      ],
    },
    {
      title: 'Expand & Contract',
      level: 'expert',
      summary:
        'Change a schema in backward-compatible steps so old and new app versions work at the same time.',
      points: [
        'Expand: add the new column or table; keep the old one.',
        'Migrate: app writes both, backfill old rows, then read from the new one.',
        'Contract: once no version uses the old column, drop it in a later release.',
        'Each step is safe to roll back; that’s the point.',
        'Also called "parallel change".',
      ],
      detail: `<pre><code>// Release 2 (expand): write both columns
user.setFullName(name);   // old column
user.setDisplayName(name); // new column
repo.save(user);

// Release 3: read displayName only
// Release 4 (contract): drop full_name in a migration</code></pre>`,
      tip: 'Renaming a column in one step breaks the old version during a rolling deploy. Expand & contract avoids that.',
    },
  ],
};
