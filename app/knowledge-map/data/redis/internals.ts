import type { KmNode } from '../../types';

export const internals: KmNode = {
  title: 'Internals',
  level: 'expert',
  summary: 'How Redis works inside: the event loop, threads, memory encodings and the wire protocol.',
  simple:
    'Under the hood, Redis is one very fast chef with a few helpers, who stores ingredients in different containers depending on how many there are.',
  points: [
    'Command execution is single-threaded; helpers handle I/O and background jobs.',
    'Each data type switches between compact and fast encodings as it grows.',
    'Knowing this explains why big keys and O(N) commands hurt so much.',
  ],
  children: [
    {
      title: 'Single-threaded event loop',
      level: 'advanced',
      summary: 'One main thread runs all commands in order, using epoll/kqueue to juggle thousands of sockets.',
      simple: 'One cashier serving a long line very quickly. No two customers are ever served at the same time, so nothing gets mixed up.',
      points: [
        'No locks needed inside, so each command is naturally atomic.',
        'I/O multiplexing: one thread watches many connections and handles whichever is ready.',
        'Memory access is fast, so CPU is rarely the limit; network usually is.',
        'Downside: one slow command blocks every client.',
      ],
      tip: 'Interview answer to "why is single-threaded Redis fast?": in-memory data, efficient structures, no lock overhead, and non-blocking I/O.',
    },
    {
      title: 'I/O threads',
      level: 'expert',
      summary: 'Since 6.0, extra threads can read and write sockets while commands still run on one thread.',
      points: [
        'Enable with <code>io-threads 4</code> (off by default).',
        'Helps on many-core machines with lots of clients and small commands.',
        'Redis 8.0 reworked I/O threading for clearly higher throughput.',
        'Background threads (bio) also handle lazy free (UNLINK), AOF fsync and file closing.',
      ],
      tip: 'Valkey 8 has its own multi-threaded I/O design, which is one of its main selling points.',
    },
    {
      title: 'Encodings',
      level: 'expert',
      summary: 'Each type uses a compact layout when small and switches to a faster one when big.',
      points: [
        'Check with OBJECT ENCODING key.',
        'Thresholds like hash-max-listpack-entries (128) and -value (64 bytes) control the switch.',
        'Conversion is one way: a big hash doesn’t shrink back to listpack.',
      ],
      children: [
        {
          title: 'Strings: int, embstr, raw',
          level: 'expert',
          summary: 'Small integers, short strings and long strings are stored differently.',
          points: [
            '<code>int</code>: values that fit a 64-bit integer.',
            '<code>embstr</code>: strings up to 44 bytes, stored in one allocation with the object.',
            '<code>raw</code>: longer strings, using SDS (Simple Dynamic String).',
          ],
        },
        {
          title: 'listpack',
          level: 'expert',
          summary: 'A compact, contiguous block of entries used for small hashes, lists, sets and sorted sets.',
          points: [
            'Replaced ziplist in Redis 7.0; avoids ziplist’s cascading update problem.',
            'Very memory-efficient, but lookups are a linear scan, so only for small collections.',
            'Lists use a quicklist: a linked list of listpack nodes.',
            'Small integer-only sets use <code>intset</code>.',
          ],
        },
        {
          title: 'skiplist + hashtable',
          level: 'expert',
          summary: 'Large sorted sets use a skiplist for order plus a hash table for O(1) score lookup.',
          points: [
            'Skiplist: linked lists with "express lanes", giving O(log N) insert and range reads.',
            'Easier than balanced trees and great for range queries.',
            'The hash table maps member → score for ZSCORE in O(1).',
          ],
        },
        {
          title: 'Dict & rehashing',
          level: 'expert',
          summary: 'Redis hash tables grow by rehashing incrementally, a few buckets at a time.',
          points: [
            'Two tables exist during a resize; old buckets move over gradually.',
            'Each command and a background cron do a little rehash work.',
            'Avoids one huge pause when a big table doubles in size.',
          ],
        },
      ],
    },
    {
      title: 'Fork & copy-on-write',
      level: 'expert',
      summary: 'RDB saves and AOF rewrites fork the process; the OS shares memory pages until they change.',
      points: [
        'The child sees a frozen snapshot of memory without copying it upfront.',
        'Every page the parent writes during the save is copied, costing extra RAM.',
        'Fork itself can take tens of ms on large datasets; disable Transparent Huge Pages.',
      ],
    },
    {
      title: 'RESP protocol',
      level: 'advanced',
      summary: 'REdis Serialization Protocol: the simple text-based format clients and server talk in.',
      simple: 'A tiny shared language with a symbol at the start of each reply saying what kind of answer follows.',
      points: [
        'RESP2: simple strings (+), errors (-), integers (:), bulk strings ($), arrays (*).',
        'RESP3 (6.0+, via HELLO 3): adds maps, sets, doubles, booleans and push messages.',
        'Push messages make client-side caching and Pub/Sub on a normal connection possible.',
        'Easy to parse, which is why there are clients for almost every language.',
      ],
    },
  ],
};
