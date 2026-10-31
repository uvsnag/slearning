import type { KmNode } from '../../types';

export const troubleshooting: KmNode = {
  title: 'Debugging & Orchestration',
  level: 'advanced',
  summary:
    'Find out why a container misbehaves, avoid classic mistakes, and know when to move to an orchestrator.',
  simple:
    'Things will break. This branch is your toolbox for finding out why, plus a look at what comes after one machine.',
  points: [
    'Start with logs, inspect and the exit code.',
    'Most bugs are config: ports, hosts, env, file permissions.',
    'Many servers and self-healing? That’s the job of an orchestrator like Kubernetes.',
  ],
  children: [
    {
      title: 'Debugging Tools',
      level: 'intermediate',
      summary: 'The commands to reach for when a container won’t start or won’t behave.',
      simple:
        'Like a doctor: ask what hurts (logs), check the chart (inspect), then look inside (exec).',
      points: [
        '<code>docker logs</code> first, then <code>docker inspect</code> (state, health, mounts).',
        '<code>docker exec -it c sh</code> to look around; check env, files, DNS.',
        'No shell (distroless)? Try <code>docker debug</code> or attach a helper container to its network.',
        'Override the command to keep it alive: <code>docker run -it --entrypoint sh img</code>.',
        'Build issues: <code>docker build --progress=plain --no-cache</code> shows every step.',
      ],
    },
    {
      title: 'Exit Codes',
      level: 'intermediate',
      summary: 'The exit code tells you how the main process died.',
      simple: 'The exit code is the note left behind saying why someone left the room.',
      points: [
        '<code>0</code>: finished normally. <code>1</code>: app error.',
        '<code>137</code> (128+9): SIGKILL, often the OOM killer or a stop timeout.',
        '<code>143</code> (128+15): SIGTERM, a normal stop.',
        '<code>126</code>/<code>127</code>: command not executable / not found.',
        '<code>docker inspect</code> shows <code>OOMKilled: true</code> when memory was the cause.',
      ],
    },
    {
      title: 'Common Pitfalls',
      level: 'intermediate',
      summary: 'The mistakes nearly everyone makes with Docker at least once.',
      simple: 'A list of potholes. Knowing where they are is half the job.',
      points: [
        'Using <code>localhost</code> to reach another container instead of its service name.',
        'App listening on 127.0.0.1 inside the container, so the published port doesn’t work.',
        'No volume for a database, so data disappears on re-create.',
        'Secrets in <code>ENV</code> or copied files; <code>:latest</code> in production.',
        'Shell-form <code>CMD</code>, so SIGTERM is ignored and stops take 10 seconds.',
        'Image built on arm64 Mac failing on amd64 servers ("exec format error").',
      ],
    },
    {
      title: 'Why Orchestration',
      level: 'intermediate',
      summary: 'Orchestrators run containers across many machines and keep them healthy for you.',
      simple:
        'Docker is one musician. An orchestrator is the conductor making sure 50 musicians play together, and replacing anyone who drops out.',
      points: [
        'Schedules containers onto machines with free resources.',
        'Restarts or moves failed containers automatically (self-healing).',
        'Rolling updates, scaling, service discovery and load balancing.',
        'You declare the desired state; it keeps reality matching it.',
      ],
    },
    {
      title: 'Kubernetes',
      level: 'advanced',
      summary:
        'The industry-standard orchestrator. It runs OCI images, though not through Docker Engine.',
      points: [
        'Main pieces: Pods, Deployments, Services, Ingress, ConfigMaps, Secrets.',
        'Since v1.24 Kubernetes talks to containerd or CRI-O directly; "dockershim" was removed.',
        'Images built with Docker still run fine: they are standard OCI images.',
        'Managed options: EKS, GKE, AKS. Simpler services: ECS, Cloud Run, Azure Container Apps.',
      ],
      tip: '"Kubernetes dropped Docker" means only the runtime. Your Dockerfiles and images keep working.',
    },
    {
      title: 'Docker Swarm',
      level: 'advanced',
      summary: 'Docker’s built-in, simpler orchestrator using Compose-style files.',
      points: [
        '<code>docker swarm init</code>, then <code>docker stack deploy -c compose.yaml app</code>.',
        'Easy to learn: services, replicas, overlay networks, secrets.',
        'Still maintained but rarely picked for new projects; Kubernetes won the market.',
      ],
    },
    {
      title: 'Interview Topics',
      level: 'advanced',
      summary: 'The Docker questions that keep coming up, with the short answer to give.',
      points: [
        'Container vs VM; image vs container.',
        'Layers and caching: why dependency files are copied before source.',
        'CMD vs ENTRYPOINT; COPY vs ADD; ARG vs ENV.',
        'Volumes vs bind mounts; how containers talk on a network.',
        'Multi-stage builds and keeping images small and secure.',
        'What isolates a container: namespaces and cgroups.',
      ],
      tip: 'Answer with a one-line definition, a tiny example and one trade-off. That shows real understanding.',
    },
  ],
};
