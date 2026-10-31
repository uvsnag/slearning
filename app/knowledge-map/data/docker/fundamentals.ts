import type { KmNode } from '../../types';

export const fundamentals: KmNode = {
  title: 'Docker Fundamentals',
  level: 'beginner',
  summary: 'What Docker is, how containers differ from VMs, and the main pieces you work with.',
  simple:
    'Docker puts your app and everything it needs into a box that runs the same on every machine. No more "but it works on my laptop".',
  points: [
    'An image is the packed box; a container is that box running.',
    'Containers share the host’s Linux kernel, so they start fast and stay small.',
    'Learn images, containers and the Dockerfile first. Everything else builds on them.',
  ],
  children: [
    {
      title: 'What is Docker?',
      level: 'beginner',
      summary: 'A tool to build, ship and run apps inside containers.',
      simple:
        'Think of shipping containers. Whatever is inside (furniture, fruit, cars), the crane and the ship handle every box the same way. Docker does that for software.',
      points: [
        'Packs code, runtime, libraries and config into one image.',
        'The same image runs on your laptop, the CI server and production.',
        'Started in 2013; it made Linux containers easy enough for everyone.',
        'Docker is a product; the container format itself is an open standard (OCI).',
      ],
      tip: 'Interview one-liner: "Docker packages an app with its dependencies into an image, and runs it as an isolated process called a container."',
    },
    {
      title: 'Containers vs VMs',
      level: 'beginner',
      summary:
        'A VM runs a whole guest OS; a container is just an isolated process sharing the host kernel.',
      simple:
        'A VM is a whole house with its own plumbing. A container is an apartment: its own locked door and rooms, but shared pipes (the kernel).',
      points: [
        'VM: hypervisor + full guest OS per VM. Heavy (GBs), boots in minutes.',
        'Container: no guest OS, shares the host kernel. Light (MBs), starts in seconds or less.',
        'VMs give stronger isolation; containers give speed and density.',
        'A Linux container needs a Linux kernel. On Mac and Windows, Docker runs a small Linux VM for you.',
        'In the cloud you usually run containers inside VMs, so you get both.',
      ],
      tip: 'Containers are not "lightweight VMs". They are normal processes with walls around them. Saying this in an interview shows you get it.',
    },
    {
      title: 'Image vs Container',
      level: 'beginner',
      summary:
        'An image is a read-only template; a container is a running (or stopped) instance of it.',
      simple:
        'An image is a recipe or a class. A container is the cooked meal or an object. You can make many meals from one recipe.',
      points: [
        'Images never change once built; you build a new one instead.',
        'Each container adds a thin writable layer on top of the image.',
        'Delete the container and that writable layer is gone too.',
        'Many containers can run from the same image at once.',
      ],
    },
    {
      title: 'Docker Architecture',
      level: 'beginner',
      summary:
        'The docker CLI talks to the Docker daemon, which builds images, runs containers and talks to registries.',
      simple:
        'The CLI is the remote control, the daemon is the TV doing the work, and the registry is the video store where images live.',
      points: [
        'Client: the <code>docker</code> command you type.',
        'Daemon (<code>dockerd</code>): a background service that does the real work.',
        'They talk over a REST API, usually through the socket <code>/var/run/docker.sock</code>.',
        'Registry: a server that stores images, like Docker Hub.',
        'Under the daemon, containerd and runc actually start the containers.',
      ],
    },
    {
      title: 'Docker Desktop vs Engine',
      level: 'beginner',
      summary:
        'Docker Engine is the Linux server software; Docker Desktop is the app for Mac, Windows and Linux desktops.',
      simple:
        'Engine is the motor. Desktop is the whole car around it: a GUI, a hidden Linux VM, Compose and extra tools.',
      points: [
        'Servers usually run Docker Engine directly on Linux.',
        'Desktop on Windows uses WSL 2; on Mac it uses a lightweight VM.',
        'Desktop is free for personal use and small companies; bigger companies need a paid plan.',
        'Alternatives: Podman, Rancher Desktop, Colima, OrbStack.',
      ],
    },
    {
      title: 'Your First Container',
      level: 'beginner',
      summary: 'Run a ready-made image with one command and see it working.',
      simple:
        'Like downloading an app and pressing play: Docker fetches the image if you don’t have it, then starts it.',
      points: [
        '<code>docker run hello-world</code> checks that everything is installed.',
        '<code>docker run -d -p 8080:80 nginx</code> starts a web server on <code>localhost:8080</code>.',
        '<code>docker ps</code> lists running containers.',
        '<code>docker stop &lt;id&gt;</code> stops it; <code>docker rm &lt;id&gt;</code> deletes it.',
        '<code>docker init</code> creates a starter Dockerfile and compose file for your project.',
      ],
    },
  ],
};
