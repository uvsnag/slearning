import type { KmTopic } from '../../types';
import overview from '../../image/cleanarchitecture.png';
import { boundaries } from './boundaries';
import { cleanCode } from './clean-code';
import { componentPrinciples } from './component-principles';
import { crossingBoundaries } from './crossing-boundaries';
import { whyArchitecture } from './foundations';
import { layers } from './layers';
import { organizingCode } from './organizing';
import { relatedIdeas } from './related';
import { solid } from './solid';
import { springBoot } from './spring-boot';
import { testingArchitecture } from './testing';
import { tradeoffs } from './tradeoffs';

export const cleanArchitecture: KmTopic = {
  id: 'clean-architecture',
  name: 'Clean Architecture',
  icon: '🧅',
  description:
    'Keep business rules independent of frameworks — from SOLID and the Dependency Rule to Spring Boot, ArchUnit and trade-offs.',
  image: {
    src: overview.src,
    alt: 'Clean Architecture overview (Vietnamese labels): four circles — Entities (Order, Customer, Product) in the centre, Use Cases, Interface Adapters (controller, presenter, gateway, mapper) and Frameworks & Drivers (Spring Boot, JPA/Hibernate, UI, HTTP clients) — with dependencies pointing inward',
    caption:
      'Note: several labels are garbled ("Spring Boot (Weo)" = Web, "OrderControlier", "Define cm core doanainh rules…", "External Wrld"); "CreateOrder" is shown twice as a Java interface; one database icon in the outer ring is labelled "HTTP Clients"; and "Giao diện" (UI) is a loose translation of Interface Adapters — that ring holds controllers, presenters and gateways, not just UI.',
  },
  root: {
    title: 'Clean Architecture',
    level: 'beginner',
    summary:
      'A way to structure apps so business rules sit in the middle and frameworks, databases and UI plug in from outside.',
    simple:
      'Think of your app as a castle. The treasure (business rules) is in the keep at the centre. Walls and gates (web, database, frameworks) surround it, and all roads lead inward, never out.',
    points: [
      'Coined by Robert C. Martin ("Uncle Bob") in a 2012 blog post, expanded in his 2017 book.',
      'Builds on Hexagonal (Cockburn, 2005) and Onion (Palermo, 2008) architectures.',
      'The branches follow a learning path: start at "Why Architecture Matters", end at Trade-offs &amp; Pitfalls.',
      'Click "Next" in the panel to walk through every concept in order.',
    ],
    children: [
      whyArchitecture,
      cleanCode,
      solid,
      layers,
      boundaries,
      crossingBoundaries,
      organizingCode,
      springBoot,
      testingArchitecture,
      componentPrinciples,
      relatedIdeas,
      tradeoffs,
    ],
  },
};
