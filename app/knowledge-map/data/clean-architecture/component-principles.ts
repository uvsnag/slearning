import type { KmNode } from '../../types';

export const componentPrinciples: KmNode = {
  title: 'Component Principles',
  level: 'advanced',
  summary:
    'Rules for grouping classes into components (jars, modules) and for how those components depend on each other.',
  simple:
    'SOLID is about arranging furniture in a room. Component principles are about which rooms go on which floor, and which stairs connect them.',
  points: [
    'A component is the smallest deployable unit: a jar, a Gradle/Maven module, an npm package.',
    'Three cohesion rules decide what goes inside a component.',
    'Three coupling rules decide how components may depend on each other.',
    'From Robert C. Martin’s earlier work, repeated in "Clean Architecture" (2017).',
  ],
  children: [
    {
      title: 'Component Cohesion',
      level: 'advanced',
      summary: 'REP, CCP and CRP: three forces that decide which classes belong in one component.',
      points: [
        'REP and CCP make components bigger; CRP makes them smaller.',
        'You can’t fully satisfy all three at once.',
        'The right balance shifts as the project matures.',
      ],
      children: [
        {
          title: 'REP: Reuse/Release',
          level: 'advanced',
          summary:
            'Classes you reuse together should be released together, with one version number.',
          points: [
            'Reuse/Release Equivalence Principle.',
            'If people reuse it, give it releases, versions and release notes.',
            'Classes in one component should make sense as a group to its users.',
          ],
        },
        {
          title: 'CCP: Common Closure',
          level: 'advanced',
          summary: 'Group classes that change for the same reason at the same time.',
          points: [
            'Common Closure Principle: SRP applied to components.',
            'A business change should touch one component, not five.',
            'Fewer components to rebuild, retest and redeploy.',
          ],
        },
        {
          title: 'CRP: Common Reuse',
          level: 'advanced',
          summary: 'Don’t force users of a component to depend on classes they don’t use.',
          points: [
            'Common Reuse Principle: ISP applied to components.',
            'If you use one class, you depend on the whole jar and its releases.',
            'Split components whose classes aren’t used together.',
          ],
        },
        {
          title: 'The Tension Triangle',
          level: 'expert',
          summary: 'Balancing REP, CCP and CRP means trading reusability against ease of change.',
          points: [
            'Early on, favour CCP: easy to develop beats easy to reuse.',
            'Later, as others reuse your code, move toward REP and CRP.',
            'Too much REP + CRP: tiny changes ripple through many components.',
            'Too much CCP + REP: users pull in too much and get needless releases.',
            'Too much CCP + CRP: components are hard to reuse.',
          ],
        },
      ],
    },
    {
      title: 'Component Coupling',
      level: 'advanced',
      summary: 'ADP, SDP and SAP: rules for the dependency graph between components.',
      points: [
        'The dependency graph is a map of what breaks when something changes.',
        'It should flow in one direction, toward stable, abstract components.',
        'This is the same idea as the Dependency Rule, at a bigger scale.',
      ],
      children: [
        {
          title: 'ADP: Acyclic Dependencies',
          level: 'advanced',
          summary: 'The component dependency graph must have no cycles.',
          points: [
            'A cycle (A → B → C → A) turns three components into one big blob.',
            'You can’t release, build or test them independently any more.',
            'Break a cycle with Dependency Inversion or by extracting a new shared component.',
            'Tools: ArchUnit <code>slices().should().beFreeOfCycles()</code>, jdepend, IDE diagrams.',
          ],
        },
        {
          title: 'SDP: Stable Dependencies',
          level: 'expert',
          summary: 'Depend in the direction of stability: on things that are hard to change.',
          points: [
            'A component many others depend on is "stable": changing it is costly.',
            'Instability <code>I = Ce / (Ca + Ce)</code>: outgoing over total dependencies.',
            '<code>I = 0</code> is maximally stable, <code>I = 1</code> is maximally unstable.',
            'Volatile code (UI, adapters) should depend on stable code, never the reverse.',
          ],
        },
        {
          title: 'SAP: Stable Abstractions',
          level: 'expert',
          summary: 'A stable component should also be abstract, so it can still be extended.',
          points: [
            'Abstractness <code>A</code> = abstract classes and interfaces ÷ all classes.',
            'Stable + concrete is the "Zone of Pain": rigid and hard to change.',
            'Unstable + abstract is the "Zone of Uselessness": interfaces nobody uses.',
            'Aim for the Main Sequence: distance <code>D = |A + I − 1|</code> close to 0.',
          ],
          tip: 'Stable concrete things like <code>String</code> live in the Zone of Pain safely because they almost never change.',
        },
      ],
    },
  ],
};
