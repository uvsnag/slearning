import type { KmNode } from '../../types';

export const whyArchitecture: KmNode = {
  title: 'Why Architecture Matters',
  level: 'beginner',
  summary: 'Good structure keeps code cheap to change as the project and the team grow.',
  simple:
    'A messy kitchen still makes dinner on day one. After a year of never cleaning up, every meal takes three times longer. Architecture is how you keep the kitchen usable.',
  points: [
    'Software is meant to be soft: easy to change. Structure decides how easy.',
    'Two ideas carry most of it: low coupling and high cohesion.',
    'Goal: keep business rules apart from tools like databases and web frameworks.',
  ],
  children: [
    {
      title: 'What is Architecture?',
      level: 'beginner',
      summary: 'The shape of a system: its parts, how they connect, and which way they depend.',
      simple:
        'It’s the floor plan of a house. You can repaint rooms anytime, but moving the walls later is expensive, so you plan them first.',
      points: [
        'Covers the big decisions that are hard to undo later.',
        'Robert C. Martin: the goal is to minimise the people needed to build and maintain the system.',
        'Not about folders or frameworks. It’s about what depends on what.',
        'Good architecture makes the system easy to understand, develop, deploy and run.',
      ],
    },
    {
      title: 'Coupling',
      level: 'beginner',
      summary: 'How much one piece of code needs to know about another to work.',
      simple:
        'Two people tied at the ankle must walk together. Tight coupling is that rope: change one part and the other trips.',
      points: [
        'Tight coupling: a change in class A forces changes in B, C and D.',
        'Loose coupling: parts talk through small, stable interfaces.',
        'Hidden coupling hurts most: shared database tables, global state, magic strings.',
        'You can’t remove coupling, only choose where it points.',
      ],
      tip: 'Ask "if I change this, what else breaks?" The longer the list, the tighter the coupling.',
    },
    {
      title: 'Cohesion',
      level: 'beginner',
      summary: 'How well the things inside one module belong together.',
      simple:
        'A good toolbox holds tools for one job. A junk drawer holds batteries, keys and old receipts. High cohesion is the toolbox.',
      points: [
        'High cohesion: everything in a class serves one purpose.',
        'Low cohesion: "Utils" or "Manager" classes doing ten unrelated things.',
        'Things that change together should live together.',
        'High cohesion usually brings low coupling for free.',
      ],
    },
    {
      title: 'Cost of Change',
      level: 'beginner',
      summary: 'In messy code, each new feature costs more than the last one.',
      simple:
        'Like credit card debt: skipping cleanup feels free today, but interest piles up until every change is slow and scary.',
      points: [
        'Martin’s book shows teams growing while output per developer drops near zero.',
        '"We’ll clean it up later" rarely happens. The mess slows you down now.',
        'Clean structure keeps the cost of each feature roughly flat over time.',
        'Going fast by making a mess is a myth beyond a few weeks.',
      ],
      tip: 'In interviews, link architecture to money: "it keeps the cost of change low".',
    },
    {
      title: 'Policy vs Details',
      level: 'intermediate',
      summary:
        'Policy is your business rules. Details are the database, web, UI and frameworks around them.',
      simple:
        'A recipe is the policy. Whether you cook on gas or electric is a detail. The recipe shouldn’t care about the stove.',
      points: [
        'Policy: "an order over $100 ships free". It’s why the software exists.',
        'Details: PostgreSQL, Spring MVC, Kafka, a React screen.',
        'Details change more often than policy, so keep them at the edge.',
        'High-level policy should never depend on low-level details.',
      ],
    },
    {
      title: 'Keep Options Open',
      level: 'intermediate',
      summary: 'Good architecture lets you delay choices about tools until you know more.',
      simple:
        'You plan the party menu before booking the venue. You can pick the hall later, once you know how many guests are coming.',
      points: [
        'You can write and test business rules before choosing a database.',
        'Delaying a decision means you decide with more facts.',
        'Swapping a tool later stays possible, even if you never do it.',
        'This is a benefit of the structure, not a reason to build plugins for everything.',
      ],
      tip: 'Don’t sell Clean Architecture as "we can swap the database". The real win is testable, focused business code.',
    },
  ],
};
