import type { KmNode } from '../../types';

export const fundamentals: KmNode = {
  title: 'Fundamentals',
  level: 'beginner',
  summary: 'What microservices are, how they differ from a monolith, and when they are worth it.',
  simple:
    'Before you cut an app into pieces, you need to know what you gain, what you pay, and whether one well-organised app would do the job.',
  children: [
    {
      title: 'What is a microservice?',
      level: 'beginner',
      summary: 'A small app that does one business job, owns its data, and is deployed on its own.',
      simple:
        'Think of a restaurant kitchen with stations: grill, salad, desserts. Each station has its own cook and fridge, and they talk by passing orders, not by reaching into each other’s fridge.',
      points: [
        'Built around one business capability, e.g. Orders, Payments, Catalog.',
        'Owns its own data. Other services ask through its API, never read its tables.',
        'Can be changed, deployed and scaled without touching the others.',
        'Talks over the network: HTTP, gRPC or messages.',
        'Size is not about lines of code. It should fit one team and one clear job.',
      ],
      tip: 'In interviews, stress "independently deployable" and "owns its data". Small size alone does not make a microservice.',
    },
    {
      title: 'The Monolith',
      level: 'beginner',
      summary: 'One app, one codebase, one deployment and usually one shared database.',
      simple:
        'A monolith is a one-room apartment: everything is close and easy to reach, but redecorating the kitchen means the whole place is a mess for a while.',
      points: [
        'Simple to build, test, run and debug: one process, one log file.',
        'Calls between parts are fast in-memory method calls.',
        'One database transaction can cover the whole use case.',
        'Grows painful when many teams change it at once and every release ships everything.',
        'A monolith is not bad by default. Most successful products started as one.',
      ],
    },
    {
      title: 'Why Microservices',
      level: 'beginner',
      summary: 'The real benefits: team independence, independent deploys and targeted scaling.',
      simple:
        'Like a city with separate shops instead of one giant store. One shop can renovate or open longer hours without closing the whole city.',
      points: [
        'Teams ship on their own schedule, without a big shared release train.',
        'Scale only the busy part, e.g. run 10 copies of Search and 2 of Admin.',
        'A crash in one service does not have to take down everything (if you design for it).',
        'Each service can pick the tech that fits, within reason.',
        'Smaller codebases are easier for new people to understand.',
      ],
    },
    {
      title: 'The Costs',
      level: 'beginner',
      summary: 'Microservices trade code complexity for network and operations complexity.',
      simple:
        'Separate shops need roads, delivery trucks and phone lines. A single store did not. That infrastructure is the price you pay.',
      points: [
        'Network calls are slow and can fail, time out or arrive twice.',
        'No more simple database transactions across services.',
        'Debugging means following one request across many services and logs.',
        'You need automation: CI/CD, monitoring, tracing, containers.',
        'Data is often only "eventually" consistent (in sync after a short delay).',
      ],
      tip: 'Martin Fowler calls this the "microservice premium": a cost you only want to pay when the system is complex enough.',
    },
    {
      title: 'Modular Monolith',
      level: 'intermediate',
      summary: 'One deployable app, split inside into strict modules with clear boundaries.',
      simple:
        'A big house with locked rooms. Everyone lives under one roof, but you can only enter a room through its door, not through the walls.',
      points: [
        'Each module has a public API and hides its internals and tables.',
        'Modules talk through interfaces or in-process events, not each other’s classes.',
        'Gives you most of the clean design, without the network costs.',
        'A clean module is easy to pull out into a service later.',
        'Tools: Java packages + ArchUnit tests, or Spring Modulith.',
      ],
      detail: `<pre><code>// Spring Modulith: fail the build if modules break their boundaries
@Test
void verifyModules() {
  ApplicationModules.of(ShopApplication.class).verify();
}</code></pre>`,
      tip: 'A great default for new products: start as a modular monolith and split only where you feel real pain.',
    },
    {
      title: 'When NOT to Use',
      level: 'intermediate',
      summary: 'Small teams, new products and unclear domains are usually better off with one app.',
      simple: 'Don’t build a highway system for a village with five cars.',
      points: [
        'One small team? You get the costs, but not the team-independence benefit.',
        'New product whose domain you do not understand yet → boundaries will be wrong.',
        'No CI/CD, monitoring or container platform yet → fix that first.',
        'Need strong, instant consistency everywhere → splitting the data hurts.',
        'Performance problems alone are rarely a reason. Profile and scale the monolith first.',
      ],
      tip: 'A good interview answer: "Microservices solve organisational scaling problems more than technical ones."',
    },
  ],
};
