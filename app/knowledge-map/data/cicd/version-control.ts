import type { KmNode } from '../../types';

export const versionControl: KmNode = {
  title: 'Version Control & Branching',
  level: 'beginner',
  summary:
    'How code gets into the pipeline: Git, branches, pull requests, reviews and branching strategies.',
  simple:
    'Git is the shared history book of your code. Branching strategies are the house rules for who writes where and when pages get merged into the main book.',
  points: [
    'Everything the pipeline needs lives in Git: code, tests, pipeline config, infrastructure.',
    'Short-lived branches merge easily; long-lived ones become painful.',
    'Pull requests are where automation and humans check a change before it lands.',
  ],
  children: [
    {
      title: 'Git as the Source of Truth',
      level: 'beginner',
      summary:
        'Every build starts from a specific commit, so anything you build can be traced back to its code.',
      simple:
        'Each commit is a photo of the whole project. The pipeline always builds from a photo, never from someone’s laptop.',
      points: [
        'The commit hash (SHA) identifies exactly what was built.',
        'Keep pipeline files, Dockerfiles and infra code in the same repo.',
        'Never build releases from uncommitted local files.',
        'Tags (like <code>v1.4.0</code>) mark released versions.',
      ],
    },
    {
      title: 'Feature Branches & PRs',
      level: 'beginner',
      summary:
        'Work on a short branch, then open a pull request to merge it into main after checks pass.',
      simple:
        'You write your chapter on a separate sheet, then ask to staple it into the book. Before stapling, robots and teammates read it.',
      points: [
        'A PR (pull request, "merge request" in GitLab) shows the diff and runs the pipeline.',
        'Branch protection: require passing checks and an approval before merging.',
        'Keep branches small and short-lived: hours or a few days.',
        'Merge options: merge commit, squash or rebase. Pick one per repo and stick to it.',
      ],
    },
    {
      title: 'Code Review',
      level: 'beginner',
      summary: 'A teammate reads your change before it merges to catch bugs and share knowledge.',
      simple:
        'A second pair of eyes on a letter before you send it. They catch typos you read past ten times.',
      points: [
        'Let machines check style and formatting; humans focus on logic and design.',
        'Small PRs (a few hundred lines max) get better, faster reviews.',
        'Be kind and specific: suggest, explain why, and approve when good enough.',
        'CODEOWNERS files route reviews to the right people automatically.',
      ],
    },
    {
      title: 'Trunk-Based Development',
      level: 'intermediate',
      summary: 'Everyone merges small changes into one main branch (the trunk) at least daily.',
      simple:
        'One shared road everyone drives on, with short on-ramps. No long private side roads that later have to be joined back.',
      points: [
        'Branches live less than a day or two, or devs commit straight to main.',
        'Unfinished work hides behind feature flags instead of long branches.',
        'Main is always releasable; that’s what CI/CD needs.',
        'Used by most high-performing teams in the DORA research.',
      ],
      tip: 'Trunk-based development and continuous integration are almost the same idea seen from two sides.',
    },
    {
      title: 'GitFlow',
      level: 'intermediate',
      summary:
        'A branching model with develop, feature, release and hotfix branches around a main branch.',
      simple:
        'A busy highway system with many lanes and exits. It’s organized, but there’s a lot of merging traffic between lanes.',
      points: [
        '<code>main</code> holds releases; <code>develop</code> collects finished features.',
        'Release branches stabilize a version; hotfix branches patch production.',
        'Fits products with planned versions (installed apps, libraries with several supported versions).',
        'Too heavy for web apps that deploy often; even its author suggests simpler flows there.',
      ],
    },
    {
      title: 'Release Branches & Tags',
      level: 'intermediate',
      summary: 'Ways to mark and maintain released versions while main keeps moving.',
      simple:
        'A tag is a sticky note on a page saying "this is version 2.1". A release branch is a photocopy of that page you can still fix typos on.',
      points: [
        'Tag every release so you can rebuild or inspect it later.',
        'Use a release branch only if you must patch old versions in parallel.',
        'Fix bugs on main first, then cherry-pick to the release branch.',
        'Pushing a tag is a common trigger for the release pipeline.',
      ],
    },
  ],
};
