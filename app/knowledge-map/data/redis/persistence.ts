import type { KmNode } from '../../types';

export const persistence: KmNode = {
  title: 'Persistence & Replication',
  level: 'intermediate',
  summary: 'How Redis saves data to disk (RDB, AOF) and copies it to replicas.',
  simple:
    'RAM forgets everything when the power goes out. Persistence is taking photos (RDB) or keeping a diary (AOF); replication is having a twin who copies everything you do.',
  points: [
    'Default config: RDB snapshots on, AOF off.',
    'You can use RDB, AOF, both, or nothing (pure cache).',
    'Replication gives read copies and a standby for failover, not backups.',
  ],
  children: [
    {
      title: 'RDB snapshots',
      level: 'intermediate',
      summary: 'A compact point-in-time dump of all data, written to a file every so often.',
      simple: 'Like taking a photo of your whiteboard every few minutes. Lose power and you only lose what you wrote after the last photo.',
      points: [
        'BGSAVE forks a child process that writes the file while the parent keeps serving.',
        'Rules like "save 3600 1 300 100 60 10000": save if N changes in M seconds.',
        'Small file, fast restarts, great for backups.',
        'You can lose minutes of writes on a crash.',
      ],
      tip: 'Fork on a big dataset needs spare RAM because of copy-on-write. Leave headroom (often 30–50%) on write-heavy servers.',
    },
    {
      title: 'AOF',
      level: 'intermediate',
      summary: 'Append Only File: logs every write command and replays them on restart.',
      simple: 'A diary of every change. After a crash you re-read the diary and rebuild the whiteboard.',
      points: [
        'appendfsync everysec (default): lose at most about 1 second of writes.',
        '<code>always</code>: safest, much slower. <code>no</code>: the OS decides when to flush.',
        'Rewrite (BGREWRITEAOF) compacts the log in the background.',
        'Since 7.0, multi-part AOF: a base file plus incremental files and a manifest.',
      ],
    },
    {
      title: 'Choosing persistence',
      level: 'advanced',
      summary: 'Pick based on how much data you can lose and how fast you must restart.',
      points: [
        'Pure cache: turn both off for maximum speed.',
        'Can lose minutes: RDB alone.',
        'Can lose about a second: AOF everysec, usually with RDB preamble (hybrid, on by default).',
        'Copy RDB files off the server for real backups.',
      ],
      tip: 'Persistence on a primary with replicas: if the primary restarts empty with persistence off, replicas copy the empty dataset. Never auto-restart a non-persistent primary.',
    },
    {
      title: 'Replication',
      level: 'intermediate',
      summary: 'Replicas keep a live copy of the primary’s data by receiving its write stream.',
      simple: 'A twin who watches everything you write and copies it into their own notebook.',
      points: [
        'Set with REPLICAOF host port. Replicas are read-only by default.',
        'Asynchronous: the primary doesn’t wait, so a few writes can be lost on failover.',
        'Partial resync (PSYNC) uses a backlog buffer after short disconnects.',
        'Read from replicas to scale reads, accepting slightly stale data.',
      ],
      children: [
        {
          title: 'WAIT & consistency',
          level: 'expert',
          summary: 'WAIT blocks until N replicas confirm your writes, reducing (not removing) loss risk.',
          points: [
            'WAIT numreplicas timeout returns how many replicas acknowledged.',
            'Still not strong consistency: a failover can pick a replica that missed writes.',
            'min-replicas-to-write makes the primary refuse writes when replicas are gone.',
          ],
        },
      ],
    },
  ],
};
