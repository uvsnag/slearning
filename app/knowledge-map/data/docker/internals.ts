import type { KmNode } from '../../types';

export const internals: KmNode = {
  title: 'How Containers Work',
  level: 'expert',
  summary:
    'The Linux features and standards under Docker: namespaces, cgroups, overlay filesystems, OCI, containerd and runc.',
  simple:
    'A container isn’t magic. It is a normal Linux process wearing blinkers (namespaces), on a diet (cgroups), looking at a layered filesystem.',
  points: [
    'Namespaces decide what a process can see.',
    'cgroups decide how much it can use.',
    'Union filesystems stack image layers; OCI standards make images portable.',
  ],
  children: [
    {
      title: 'Namespaces',
      level: 'expert',
      summary:
        'Linux namespaces give a process its own view of PIDs, network, mounts, hostname and users.',
      points: [
        'PID: the app sees itself as PID 1.',
        'NET: its own interfaces, IPs and ports.',
        'MNT: its own filesystem tree. UTS: its own hostname. IPC: its own shared memory.',
        'USER: maps container root to an unprivileged host user (rootless).',
        'From the host, <code>ps</code> shows the container process like any other.',
      ],
    },
    {
      title: 'cgroups',
      level: 'expert',
      summary:
        'Control groups limit and measure CPU, memory, I/O and process count for a group of processes.',
      points: [
        '<code>--memory</code> and <code>--cpus</code> turn into cgroup settings.',
        'Memory over the limit triggers the kernel OOM killer inside that cgroup.',
        'CPU limits are enforced by throttling (CFS quota), which can add latency spikes.',
        'cgroup v2 is the default on modern distros; old JVMs and tools may not read it correctly.',
      ],
    },
    {
      title: 'Union FS & overlay2',
      level: 'expert',
      summary:
        'overlay2 stacks read-only image layers with one writable layer on top to form the container’s filesystem.',
      points: [
        'Lower dirs = image layers, upper dir = container writes, merged = what the app sees.',
        'Copy-on-write: changing a file copies it up into the writable layer first.',
        'Deleting a lower-layer file creates a "whiteout" marker; the bytes still exist below.',
        'Write-heavy data (databases, logs) belongs in volumes, not the writable layer.',
      ],
    },
    {
      title: 'OCI Standards',
      level: 'expert',
      summary:
        'The Open Container Initiative defines open specs for images, runtimes and registries.',
      points: [
        'Image spec: manifest + config + layer tarballs, addressed by sha256 digests.',
        'Runtime spec: how to run an unpacked bundle (config.json + rootfs).',
        'Distribution spec: the registry HTTP API.',
        'Because of OCI, Docker, Podman, Kubernetes and buildpacks all share images.',
      ],
    },
    {
      title: 'containerd & runc',
      level: 'expert',
      summary:
        'Docker hands work to containerd (manages containers and images), which uses runc to create each container.',
      points: [
        'Chain: docker CLI → dockerd → containerd → containerd-shim → runc.',
        'runc sets up namespaces and cgroups, starts the process, then exits.',
        'The shim keeps the container running even if dockerd restarts (with live-restore).',
        'Kubernetes skips dockerd and talks to containerd through the CRI.',
        'Alternative runtimes: crun, gVisor (sandboxed), Kata Containers (micro-VMs).',
      ],
    },
    {
      title: 'Docker on Mac & Windows',
      level: 'advanced',
      summary: 'Linux containers need a Linux kernel, so Docker Desktop runs a hidden Linux VM.',
      points: [
        'Windows uses WSL 2; Mac uses Apple’s Virtualization framework.',
        'Bind mounts cross the VM boundary, which is why they can be slow.',
        'Memory and CPU for all containers come from the VM’s settings.',
        'Native Windows containers exist, but are a separate, much rarer world.',
      ],
    },
  ],
};
