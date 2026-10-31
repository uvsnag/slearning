import type { KmNode } from '../../types';

export const storage: KmNode = {
  title: 'Storage & Volumes',
  level: 'beginner',
  summary: 'Keep data alive after a container is gone, and share files between host and container.',
  simple:
    'A container is a rented room that gets cleaned after you leave. Volumes are your own storage unit that stays no matter which room you rent.',
  points: [
    'Volumes: managed by Docker, best for app data like databases.',
    'Bind mounts: a host folder mapped in, best for local development.',
    'tmpfs: in memory only, gone when the container stops.',
  ],
  children: [
    {
      title: 'Volumes',
      level: 'beginner',
      summary: 'Docker-managed storage that lives outside the container’s lifecycle.',
      simple: 'A USB drive you plug into whichever container needs it.',
      points: [
        'Create and use: <code>-v pgdata:/var/lib/postgresql/data</code>.',
        'Survive <code>docker rm</code>; delete with <code>docker volume rm</code>.',
        'Fast on Mac/Windows too, since they live inside Docker’s Linux VM.',
        'Several containers can share one volume (watch out for concurrent writes).',
      ],
      tip: 'Running a database in a container without a volume means losing all data on the next re-create.',
    },
    {
      title: 'Bind Mounts',
      level: 'beginner',
      summary: 'Mount a specific folder or file from the host into the container.',
      simple:
        'A window into your own desk: the container sees your files, and changes show up on both sides.',
      points: [
        'Example: <code>-v "$PWD/src:/app/src"</code> or <code>--mount type=bind,…</code>.',
        'Great for live code reload in development.',
        'Depends on host paths, so less portable for production.',
        'Add <code>:ro</code> to make it read-only.',
        'Can be slow on Mac/Windows for big folders like <code>node_modules</code>.',
      ],
    },
    {
      title: 'tmpfs Mounts',
      level: 'intermediate',
      summary: 'A memory-only mount for temporary or sensitive files.',
      simple: 'A whiteboard that is wiped when the meeting ends.',
      points: [
        '<code>--tmpfs /tmp</code>; never written to disk.',
        'Pairs well with a read-only root filesystem.',
        'Linux only.',
      ],
    },
    {
      title: '-v vs --mount',
      level: 'intermediate',
      summary: 'Two syntaxes for the same thing; --mount is longer but clearer.',
      simple: '-v is the shortcut; --mount spells everything out, so mistakes are easier to spot.',
      points: [
        '<code>--mount type=volume,source=data,target=/data</code>.',
        'With <code>-v</code>, a missing host path is silently created as an empty folder.',
        'With <code>--mount</code>, a missing bind source is an error.',
      ],
    },
    {
      title: 'Backup & Restore',
      level: 'advanced',
      summary: 'Volumes are just data on the host; back them up like any other data.',
      points: [
        'For databases, prefer the DB’s own dump tool over copying files.',
        'Generic trick: run a temporary container that mounts the volume and tars it out.',
        'Cloud and orchestrators offer volume snapshots.',
        'Test restores, not only backups.',
      ],
    },
  ],
};

export const networking: KmNode = {
  title: 'Networking',
  level: 'intermediate',
  summary: 'How containers talk to each other, to the host and to the outside world.',
  simple:
    'Docker builds little private office networks. Containers on the same network can call each other by name, like extensions in one office.',
  points: [
    'Default driver is bridge: a private network on one host.',
    'User-defined networks give built-in DNS by container name.',
    'Publish ports only for what the outside world must reach.',
  ],
  children: [
    {
      title: 'Bridge Network',
      level: 'intermediate',
      summary: 'The default: containers get private IPs on a virtual switch on the host.',
      simple: 'A home Wi-Fi router: devices inside talk freely, outsiders need port forwarding.',
      points: [
        'Containers without <code>--network</code> join the default <code>bridge</code>.',
        'Outbound internet works through NAT.',
        'Inbound needs <code>-p</code> port publishing.',
      ],
    },
    {
      title: 'User-defined Networks',
      level: 'intermediate',
      summary: 'Networks you create; containers on them find each other by name.',
      simple: 'Instead of remembering phone numbers (IPs), you just call "db".',
      points: [
        '<code>docker network create app</code>, then <code>--network app</code>.',
        'Built-in DNS: the API can connect to <code>postgres://db:5432</code>.',
        'The default bridge has no name-based DNS; always create your own.',
        'Compose creates one network per project for you.',
      ],
      detail: `<pre><code>// Inside the container, use the service name, not localhost
const pool = new Pool({ host: 'db', port: 5432 });</code></pre>`,
      tip: 'localhost inside a container means the container itself, not your laptop and not another container.',
    },
    {
      title: 'Host & None Networks',
      level: 'intermediate',
      summary: 'host shares the host’s network stack directly; none disables networking.',
      simple: 'host removes the apartment walls for networking; none cuts the phone line.',
      points: [
        '<code>--network host</code>: no port mapping, best raw performance, less isolation.',
        'Mainly a Linux feature; Docker Desktop support is limited.',
        '<code>--network none</code> for jobs that should never touch the network.',
      ],
    },
    {
      title: 'Reaching the Host',
      level: 'intermediate',
      summary: 'Call a service on your machine from inside a container.',
      simple: 'You need the house’s main number, not your room’s extension.',
      points: [
        'Docker Desktop: use <code>host.docker.internal</code>.',
        'Linux: add <code>--add-host=host.docker.internal:host-gateway</code>.',
        'The host service must listen on an interface the container can reach.',
      ],
    },
    {
      title: 'EXPOSE vs Publish',
      level: 'beginner',
      summary: 'EXPOSE only documents a port; -p actually opens it to the host.',
      simple: 'EXPOSE is the sign on the door, -p is unlocking it.',
      points: [
        'Containers on the same network can reach any listening port, exposed or not.',
        'Only published ports are reachable from outside the host.',
        'Don’t publish database ports in production unless you must.',
      ],
    },
    {
      title: 'Overlay & Other Drivers',
      level: 'advanced',
      summary: 'Drivers for multi-host and special setups: overlay, macvlan, ipvlan.',
      points: [
        'Overlay connects containers across several hosts (Swarm).',
        'Macvlan gives a container its own MAC/IP on the physical network.',
        'Kubernetes uses its own CNI plugins instead of Docker networks.',
      ],
    },
  ],
};
