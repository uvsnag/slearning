import type { KmNode } from '../../types';

export const security: KmNode = {
  title: 'Security',
  level: 'advanced',
  summary:
    'Lock down images and containers: least privilege, minimal images, scanning and real secret handling.',
  simple:
    'Containers have walls, but thin ones. Good security means fewer doors, fewer keys and nothing valuable left lying around.',
  points: [
    'Containers share the host kernel; a kernel bug can break the walls.',
    'Run as non-root, drop what you don’t need, keep images small and patched.',
    'Never bake secrets into images.',
  ],
  children: [
    {
      title: 'Run as Non-root',
      level: 'intermediate',
      summary: 'Use a normal user inside the container so a break-in gets fewer powers.',
      simple:
        'If a burglar gets in, it’s better they land in the guest room than with the master key.',
      points: [
        'Set <code>USER</code> in the Dockerfile.',
        'Root in a container is root on the host kernel (unless user namespaces are used).',
        'Ports below 1024 need extra rights; just listen on 8080 instead.',
        'Kubernetes can enforce it with <code>runAsNonRoot</code>.',
      ],
    },
    {
      title: 'Minimal Images',
      level: 'intermediate',
      summary:
        'Fewer packages in the image means fewer vulnerabilities and fewer tools for an attacker.',
      simple: 'An empty room has nothing to steal and nothing to trip over.',
      points: [
        'Use slim, distroless or hardened base images.',
        'Multi-stage builds keep compilers and curl out of production.',
        'No shell means an attacker can’t easily run commands.',
      ],
    },
    {
      title: 'Image Scanning',
      level: 'intermediate',
      summary: 'Tools that check image packages against known vulnerability (CVE) lists.',
      simple: 'A health check-up for your image: it lists known problems in the parts you used.',
      points: [
        'Tools: Docker Scout, Trivy, Grype, Snyk.',
        'Run in CI and fail the build on critical issues with a fix available.',
        'Rescan regularly: new CVEs appear for old images.',
        'Fix most issues by updating the base image and rebuilding.',
      ],
    },
    {
      title: 'Secrets',
      level: 'advanced',
      summary:
        'Pass passwords and keys at build or run time without leaving them in layers, history or env dumps.',
      points: [
        'Never use <code>ENV</code>, <code>ARG</code> or <code>COPY</code> for secrets: they stay in the image.',
        'Build time: <code>RUN --mount=type=secret,id=npmrc …</code> with <code>docker build --secret</code>.',
        'Run time: mount secret files (Compose/Swarm secrets, Kubernetes Secrets) or use a vault.',
        'Env vars at run time are common but leak via <code>docker inspect</code> and crash dumps.',
      ],
      tip: 'Deleting a secret file in a later layer doesn’t help. It is still in the earlier layer for anyone who pulls the image.',
    },
    {
      title: 'Capabilities & Read-only',
      level: 'advanced',
      summary: 'Remove Linux powers the app doesn’t need and make the filesystem read-only.',
      points: [
        '<code>--cap-drop ALL</code>, then add back only what’s needed.',
        '<code>--read-only</code> root filesystem plus a <code>tmpfs</code> for <code>/tmp</code>.',
        '<code>--security-opt no-new-privileges</code> blocks setuid tricks.',
        'Never use <code>--privileged</code> unless you truly understand why.',
        'Seccomp and AppArmor profiles limit which syscalls run (Docker has sane defaults).',
      ],
    },
    {
      title: 'The Docker Socket',
      level: 'advanced',
      summary: 'Access to /var/run/docker.sock is equal to root on the host.',
      points: [
        'Mounting the socket into a container gives it full control of the host.',
        'Being in the <code>docker</code> group is effectively root too.',
        'CI that needs builds can use rootless BuildKit, Kaniko or a remote builder instead.',
      ],
    },
    {
      title: 'Rootless Mode',
      level: 'expert',
      summary: 'Run the Docker daemon and containers as a normal user, using user namespaces.',
      points: [
        'Root inside the container maps to an unprivileged user on the host.',
        'Limits the damage if someone escapes a container.',
        'Some trade-offs: privileged ports, some network and storage drivers.',
        'Podman is rootless and daemonless by default.',
        'Related: <code>userns-remap</code> remaps users while the daemon stays root.',
      ],
    },
  ],
};
