import type { KmTopic } from '../../types';
import { aggregation, joins } from './aggregation-joins';
import { apps } from './apps';
import { comparison } from './compare';
import { indexes } from './indexes';
import { dml, schema } from './modifying';
import { querying, relational } from './relational';
import { subqueries, windowFunctions } from './subqueries-windows';
import { transactions } from './transactions';

export const sql: KmTopic = {
  id: 'sql',
  name: 'SQL (PostgreSQL & SQL Server)',
  icon: '🗄️',
  description:
    'SQL for PostgreSQL and SQL Server — from your first SELECT to indexes, query plans, transactions and scaling, with side-by-side syntax.',
  root: {
    title: 'SQL',
    level: 'beginner',
    summary:
      'The standard language for querying and changing data in relational databases, shown for PostgreSQL and SQL Server.',
    simple:
      'A relational database is a set of linked tables, like spreadsheets that know about each other. SQL is how you ask them questions ("which customers spent the most?") and update them. PostgreSQL and SQL Server speak it with slightly different accents.',
    points: [
      'Branches go from the basics to expert topics — follow them in order or use Next.',
      'Badge colors show the level: Beginner → Intermediate → Advanced → Expert.',
      'Where syntax differs, examples show both, labelled <code>-- PostgreSQL</code> and <code>-- SQL Server</code>.',
    ],
    children: [
      relational,
      querying,
      aggregation,
      joins,
      subqueries,
      windowFunctions,
      dml,
      schema,
      indexes,
      transactions,
      apps,
      comparison,
    ],
  },
};
