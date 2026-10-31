import type { KmTopic } from '../../types';
import overview from '../../image/spring.png';
import { aop } from './aop';
import { asyncMessaging } from './async';
import { gettingStarted } from './basics';
import { configuration } from './config';
import { data, transactions } from './data';
import { internals } from './internals';
import { ioc } from './ioc';
import { production } from './production';
import { security } from './security';
import { testing } from './testing';
import { web } from './web';

export const springBoot: KmTopic = {
  id: 'spring-boot',
  name: 'Spring Boot',
  icon: '🌱',
  description:
    'Build production-ready Java apps with Spring Boot — from your first REST API to transactions, security, testing and startup internals.',
  image: {
    src: overview.src,
    alt: 'Spring overview: Spring Framework modules (core container, AOP, data, web, testing) and what Spring Boot adds on top — starters, auto-configuration, embedded servers and Actuator',
    caption:
      'Note: "Starter dependencies" appears twice; Undertow support was removed in Spring Boot 4.0 (Tomcat is the default, Jetty the alternative); the web module also has WebFlux for reactive apps.',
  },
  root: {
    title: 'Spring Boot',
    level: 'beginner',
    summary:
      'An opinionated layer on top of the Spring Framework that sets everything up so you can just write your app.',
    simple:
      'Spring is a huge box of parts. Spring Boot looks at which parts you picked, snaps them together with good defaults, and gives you one jar that runs with java -jar.',
    points: [
      'Branches follow a learning path: start at Getting started, end at Versions & Internals.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Java basics, Kafka and Microservices have their own topics. This one links to them where needed.',
      'Facts are for Spring Boot 3.x, with notes where Spring Boot 4 changed something.',
    ],
    children: [
      gettingStarted,
      ioc,
      configuration,
      web,
      data,
      transactions,
      aop,
      security,
      asyncMessaging,
      testing,
      production,
      internals,
    ],
  },
};
