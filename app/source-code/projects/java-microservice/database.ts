import { DbConnection } from '../../types';

/**
 * Simulated databases for the Java Microservice demo.
 *
 * The rows across the four connections tell ONE consistent story, so the
 * saga/outbox/idempotency patterns can be traced through the data:
 *
 *   ord-1001  happy path            → CONFIRMED   (payment AUTH, stock RESERVED)
 *   ord-1002  payment declined      → CANCELLED_PAYMENT_DECLINED (8999 > 5000 limit)
 *   ord-1003  no stock after payment→ CANCELLED_NO_STOCK (AUTH + compensating REFUND)
 *   ord-1004  outbox not drained yet→ PAYMENT_PENDING (outbox row still PENDING)
 *   ord-1005  saga in flight        → INVENTORY_PENDING (stock RESERVED, reply pending)
 */

const ordersDb: DbConnection = {
  name: 'orders-db',
  engine: 'PostgreSQL',
  description: 'order-service database (localhost:5433/orders)',
  schemas: [
    {
      name: 'public',
      tables: [
        {
          name: 'orders',
          comment: 'Order aggregate — status is advanced by the saga orchestrator',
          columns: [
            { name: 'id', type: 'varchar(24)', pk: true },
            { name: 'customer_id', type: 'varchar(24)' },
            { name: 'sku', type: 'varchar(24)' },
            { name: 'quantity', type: 'int' },
            { name: 'unit_price', type: 'numeric(12,2)' },
            { name: 'total_amount', type: 'numeric(12,2)' },
            { name: 'status', type: 'varchar(32)', comment: 'saga state machine' },
            { name: 'idempotency_key', type: 'varchar(64)', comment: 'UNIQUE' },
            { name: 'version', type: 'bigint', comment: 'optimistic locking' },
            { name: 'created_at', type: 'timestamptz' },
          ],
          rows: [
            [
              'ord-1001',
              'cust-501',
              'SKU-100',
              2,
              '49.90',
              '99.80',
              'CONFIRMED',
              'idem-7f3a9c1e',
              3,
              '2026-07-09 08:11:04+00',
            ],
            [
              'ord-1002',
              'cust-502',
              'SKU-200',
              1,
              '8999.00',
              '8999.00',
              'CANCELLED_PAYMENT_DECLINED',
              'idem-2b8de4a1',
              2,
              '2026-07-09 08:14:31+00',
            ],
            [
              'ord-1003',
              'cust-503',
              'SKU-100',
              50,
              '49.90',
              '2495.00',
              'CANCELLED_NO_STOCK',
              'idem-9c4f11d0',
              3,
              '2026-07-09 08:20:17+00',
            ],
            [
              'ord-1004',
              'cust-501',
              'SKU-300',
              1,
              '149.00',
              '149.00',
              'PAYMENT_PENDING',
              'idem-5e77ab32',
              1,
              '2026-07-09 09:02:45+00',
            ],
            [
              'ord-1005',
              'cust-504',
              'SKU-100',
              1,
              '49.90',
              '49.90',
              'INVENTORY_PENDING',
              'idem-c1d2e3f4',
              2,
              '2026-07-09 09:05:12+00',
            ],
          ],
        },
        {
          name: 'outbox_events',
          comment:
            'Transactional outbox — PENDING rows are waiting for the relay (or for Kafka to come back)',
          columns: [
            {
              name: 'id',
              type: 'varchar(36)',
              pk: true,
              comment: 'eventId used by consumers to dedupe',
            },
            { name: 'aggregate_id', type: 'varchar(24)' },
            { name: 'event_type', type: 'varchar(48)' },
            { name: 'destination_topic', type: 'varchar(64)' },
            { name: 'payload', type: 'jsonb' },
            { name: 'status', type: 'varchar(16)' },
            { name: 'occurred_at', type: 'timestamptz' },
            { name: 'published_at', type: 'timestamptz', nullable: true },
          ],
          rows: [
            [
              'evt-0d81f2ce',
              'ord-1001',
              'AuthorizePayment',
              'payment-commands',
              '{"orderId":"ord-1001","amount":99.80}',
              'PUBLISHED',
              '08:11:04',
              '08:11:04',
            ],
            [
              'evt-4a17c9b0',
              'ord-1001',
              'ReserveStock',
              'inventory-commands',
              '{"orderId":"ord-1001","sku":"SKU-100","quantity":2}',
              'PUBLISHED',
              '08:11:06',
              '08:11:06',
            ],
            [
              'evt-98e2d4f7',
              'ord-1001',
              'OrderConfirmed',
              'order-events',
              '{"orderId":"ord-1001"}',
              'PUBLISHED',
              '08:11:07',
              '08:11:08',
            ],
            [
              'evt-b52e8a19',
              'ord-1002',
              'AuthorizePayment',
              'payment-commands',
              '{"orderId":"ord-1002","amount":8999.00}',
              'PUBLISHED',
              '08:14:31',
              '08:14:32',
            ],
            [
              'evt-c9f01d3a',
              'ord-1003',
              'AuthorizePayment',
              'payment-commands',
              '{"orderId":"ord-1003","amount":2495.00}',
              'PUBLISHED',
              '08:20:17',
              '08:20:18',
            ],
            [
              'evt-71bd6e02',
              'ord-1003',
              'ReserveStock',
              'inventory-commands',
              '{"orderId":"ord-1003","sku":"SKU-100","quantity":50}',
              'PUBLISHED',
              '08:20:19',
              '08:20:19',
            ],
            [
              'evt-e3a54c88',
              'ord-1003',
              'RefundPayment',
              'payment-commands',
              '{"orderId":"ord-1003","amount":2495.00}',
              'PUBLISHED',
              '08:20:21',
              '08:20:21',
            ],
            [
              'evt-f60b7d15',
              'ord-1004',
              'AuthorizePayment',
              'payment-commands',
              '{"orderId":"ord-1004","amount":149.00}',
              'PENDING',
              '09:02:45',
              null,
            ],
            [
              'evt-2c48a9e6',
              'ord-1005',
              'AuthorizePayment',
              'payment-commands',
              '{"orderId":"ord-1005","amount":49.90}',
              'PUBLISHED',
              '09:05:12',
              '09:05:12',
            ],
            [
              'evt-8891fb3d',
              'ord-1005',
              'ReserveStock',
              'inventory-commands',
              '{"orderId":"ord-1005","sku":"SKU-100","quantity":1}',
              'PUBLISHED',
              '09:05:14',
              '09:05:14',
            ],
          ],
        },
        {
          name: 'processed_requests',
          comment: 'Idempotency ledger — replaying a key returns the stored response',
          columns: [
            { name: 'idempotency_key', type: 'varchar(64)', pk: true },
            { name: 'request_hash', type: 'varchar(64)', comment: 'SHA-256 of the request body' },
            { name: 'http_status', type: 'int' },
            { name: 'response_body', type: 'text' },
            { name: 'created_at', type: 'timestamptz' },
          ],
          rows: [
            [
              'idem-7f3a9c1e',
              '3e1f8a…d92c',
              201,
              '{"orderId":"ord-1001","status":"PAYMENT_PENDING"}',
              '2026-07-09 08:11:04+00',
            ],
            [
              'idem-2b8de4a1',
              '77b4c0…41aa',
              201,
              '{"orderId":"ord-1002","status":"PAYMENT_PENDING"}',
              '2026-07-09 08:14:31+00',
            ],
            [
              'idem-9c4f11d0',
              'a90d17…6b3e',
              201,
              '{"orderId":"ord-1003","status":"PAYMENT_PENDING"}',
              '2026-07-09 08:20:17+00',
            ],
            [
              'idem-5e77ab32',
              'c25e99…08d1',
              201,
              '{"orderId":"ord-1004","status":"PAYMENT_PENDING"}',
              '2026-07-09 09:02:45+00',
            ],
          ],
        },
      ],
    },
  ],
};

const paymentsDb: DbConnection = {
  name: 'payments-db',
  engine: 'PostgreSQL',
  description: 'payment-service database (localhost:5434/payments)',
  schemas: [
    {
      name: 'public',
      tables: [
        {
          name: 'payment_transactions',
          comment: 'Append-only ledger — the REFUND row is the saga compensation for ord-1003',
          columns: [
            { name: 'id', type: 'varchar(24)', pk: true },
            { name: 'order_id', type: 'varchar(24)' },
            { name: 'type', type: 'varchar(8)', comment: 'AUTH | REFUND' },
            { name: 'amount', type: 'numeric(12,2)' },
            { name: 'status', type: 'varchar(16)' },
            { name: 'reason', type: 'varchar(64)', nullable: true },
            { name: 'ref_transaction_id', type: 'varchar(24)', nullable: true },
            { name: 'created_at', type: 'timestamptz' },
          ],
          rows: [
            [
              'pay-9001a3f2',
              'ord-1001',
              'AUTH',
              '99.80',
              'AUTHORIZED',
              null,
              null,
              '2026-07-09 08:11:05+00',
            ],
            [
              'pay-9002be71',
              'ord-1002',
              'AUTH',
              '8999.00',
              'DECLINED',
              'amount_over_limit',
              null,
              '2026-07-09 08:14:33+00',
            ],
            [
              'pay-9003c8d4',
              'ord-1003',
              'AUTH',
              '2495.00',
              'AUTHORIZED',
              null,
              null,
              '2026-07-09 08:20:18+00',
            ],
            [
              'pay-9004f1e9',
              'ord-1003',
              'REFUND',
              '2495.00',
              'COMPLETED',
              null,
              'pay-9003c8d4',
              '2026-07-09 08:20:22+00',
            ],
          ],
        },
        {
          name: 'processed_events',
          comment: 'Idempotent consumer — eventIds already handled; duplicates are skipped',
          columns: [
            { name: 'event_id', type: 'varchar(36)', pk: true },
            { name: 'consumed_at', type: 'timestamptz' },
          ],
          rows: [
            ['evt-0d81f2ce', '2026-07-09 08:11:05+00'],
            ['evt-b52e8a19', '2026-07-09 08:14:33+00'],
            ['evt-c9f01d3a', '2026-07-09 08:20:18+00'],
            ['evt-e3a54c88', '2026-07-09 08:20:22+00'],
            ['evt-2c48a9e6', '2026-07-09 09:05:13+00'],
          ],
        },
      ],
    },
  ],
};

const inventoryDb: DbConnection = {
  name: 'inventory-db',
  engine: 'PostgreSQL',
  description: 'inventory-service database (localhost:5435/inventory)',
  schemas: [
    {
      name: 'public',
      tables: [
        {
          name: 'inventory_stock',
          comment:
            'SKU-100 started at 40: ord-1001 took 2, ord-1005 took 1, ord-1003 (x50) was rejected',
          columns: [
            { name: 'sku', type: 'varchar(24)', pk: true },
            { name: 'name', type: 'varchar(80)' },
            { name: 'available', type: 'int', comment: 'CHECK (available >= 0)' },
            { name: 'reserved', type: 'int' },
            { name: 'updated_at', type: 'timestamptz' },
          ],
          rows: [
            ['SKU-100', 'Wireless Mouse', 37, 3, '2026-07-09 09:05:15+00'],
            ['SKU-200', '4K Projector', 5, 0, '2026-07-08 17:40:00+00'],
            ['SKU-300', 'Mechanical Keyboard', 12, 0, '2026-07-08 17:40:00+00'],
          ],
        },
        {
          name: 'stock_reservations',
          comment: 'UNIQUE(order_id) doubles as the idempotency guard for redelivered commands',
          columns: [
            { name: 'id', type: 'varchar(24)', pk: true },
            { name: 'order_id', type: 'varchar(24)', comment: 'UNIQUE' },
            { name: 'sku', type: 'varchar(24)' },
            { name: 'quantity', type: 'int' },
            { name: 'status', type: 'varchar(16)' },
            { name: 'reason', type: 'varchar(64)', nullable: true },
            { name: 'created_at', type: 'timestamptz' },
          ],
          rows: [
            ['res-a2210b4f', 'ord-1001', 'SKU-100', 2, 'RESERVED', null, '2026-07-09 08:11:06+00'],
            [
              'res-19c8d3e7',
              'ord-1003',
              'SKU-100',
              50,
              'REJECTED',
              'insufficient_stock',
              '2026-07-09 08:20:20+00',
            ],
            ['res-66b0f1a9', 'ord-1005', 'SKU-100', 1, 'RESERVED', null, '2026-07-09 09:05:15+00'],
          ],
        },
      ],
    },
  ],
};

const redisCache: DbConnection = {
  name: 'redis-cache',
  engine: 'Redis',
  description: 'Shared Redis: idempotency latches, price cache, gateway rate-limit buckets',
  schemas: [
    {
      name: 'db0',
      tables: [
        {
          name: 'keys',
          comment: 'One keyspace, three patterns living side by side',
          columns: [
            { name: 'key', type: 'string', pk: true },
            { name: 'type', type: 'type' },
            { name: 'ttl_sec', type: 'int', comment: '-1 = no expiry' },
            { name: 'value', type: 'string' },
          ],
          rows: [
            ['idem:orders:idem-7f3a9c1e', 'string', 82_817, '3e1f8a…d92c (request hash)'],
            ['idem:orders:idem-5e77ab32', 'string', 86_311, 'c25e99…08d1 (request hash)'],
            ['product-price::SKU-100', 'string', 512, '49.90'],
            ['product-price::SKU-300', 'string', 244, '149.00'],
            ['request_rate_limiter.{api-key:demo-key-mobile}.tokens', 'string', 1, '18'],
            ['request_rate_limiter.{api-key:demo-key-mobile}.timestamp', 'string', 1, '1783934712'],
            ['lock:settlement:2026-07-08', 'string', 212, 'order-service-1'],
          ],
        },
      ],
    },
  ],
};

export const JAVA_MICROSERVICE_DATABASES: DbConnection[] = [
  ordersDb,
  paymentsDb,
  inventoryDb,
  redisCache,
];
