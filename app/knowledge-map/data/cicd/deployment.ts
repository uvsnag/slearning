import type { KmNode } from '../../types';

export const deployment: KmNode = {
  title: 'Deployment Strategies',
  level: 'intermediate',
  summary:
    'Ways to release a new version with little or no downtime, and to undo it fast if it goes wrong.',
  simple:
    'Swapping the engine of a moving car. The strategies are different tricks to do it without stopping the car, and to put the old engine back quickly.',
  points: [
    'Deploy (put code on servers) and release (let users see it) can be separate steps.',
    'Every strategy needs health checks to know if the new version is OK.',
    'Plan the rollback before you deploy.',
  ],
  children: [
    {
      title: 'Health Checks',
      level: 'beginner',
      summary:
        'Endpoints that tell the platform whether an instance is alive and ready for traffic.',
      simple:
        'Like asking "are you awake?" and "are you ready to work?" before giving someone a task.',
      points: [
        'Liveness: is the process stuck? If not alive, restart it.',
        'Readiness: can it serve traffic now (DB connected, warmed up)? If not, send no traffic.',
        'Spring Boot Actuator gives <code>/actuator/health/liveness</code> and <code>/readiness</code>.',
        'Keep liveness simple; don’t fail it because a downstream service is down.',
      ],
      detail: `<pre><code>app.get('/health/ready', async (req, res) =&gt; {
  try {
    await db.query('SELECT 1');
    res.status(200).json({ status: 'UP' });
  } catch {
    res.status(503).json({ status: 'DOWN' });
  }
});</code></pre>`,
    },
    {
      title: 'Rolling Deployment',
      level: 'intermediate',
      summary: 'Replace old instances with new ones a few at a time.',
      simple: 'Changing the tires of a bus one at a time while it keeps driving slowly.',
      points: [
        'Default in Kubernetes Deployments (<code>maxSurge</code>, <code>maxUnavailable</code>).',
        'No extra full environment needed.',
        'For a while, old and new versions run together, so they must be compatible.',
        'Rollback = roll forward to the old version again, which takes time.',
      ],
    },
    {
      title: 'Blue-Green',
      level: 'intermediate',
      summary:
        'Run two full environments; deploy to the idle one, then switch all traffic at once.',
      simple:
        'Two identical stages. The show runs on blue while you set up green. When green is ready, you swing the spotlight over.',
      points: [
        'Switch is instant (load balancer or DNS change).',
        'Rollback is instant too: switch back to the old color.',
        'Costs double the capacity during the switch.',
        'Shared database must work with both versions.',
      ],
    },
    {
      title: 'Canary Releases',
      level: 'advanced',
      summary:
        'Send a small share of traffic to the new version, watch metrics, then increase step by step.',
      points: [
        'Example: 1% → 10% → 50% → 100%, pausing to check error rate and latency.',
        'Bad canary? Route traffic back; only a few users were affected.',
        'Tools: Argo Rollouts, Flagger, service meshes, cloud load balancers.',
        'Works best with automatic analysis of metrics, not someone staring at graphs.',
      ],
      tip: 'Named after canaries in coal mines: a small early warning before everyone is exposed.',
    },
    {
      title: 'Feature Flags',
      level: 'intermediate',
      summary: 'Turn features on or off at runtime with a config switch, without redeploying.',
      simple:
        'A light switch built into your feature. The wiring is installed (deployed), but you decide when to flip it on.',
      points: [
        'Lets you merge unfinished work to main safely (trunk-based development).',
        'Roll out to staff first, then 5% of users, then everyone.',
        'Kill switch: turn off a broken feature in seconds.',
        'Tools: LaunchDarkly, Unleash, Flagsmith, OpenFeature (a vendor-neutral API).',
        'Remove old flags; forgotten flags become hidden complexity.',
      ],
      detail: `<pre><code>if (flags.isEnabled('new-checkout', { userId: user.id })) {
  return renderNewCheckout(cart);
}
return renderOldCheckout(cart);</code></pre>`,
    },
    {
      title: 'Dark Launches',
      level: 'advanced',
      summary: 'Run new code in production without users seeing it, to test it with real load.',
      points: [
        'Example: call the new search engine in the background, compare results, show the old ones.',
        'Traffic shadowing (mirroring) sends a copy of real requests to the new version.',
        'Make sure shadow calls don’t cause side effects like double payments or emails.',
      ],
    },
    {
      title: 'Rollback vs Roll Forward',
      level: 'intermediate',
      summary:
        'When a release breaks, either go back to the last good version or quickly ship a fix.',
      simple:
        'Reverse out of the wrong turn, or take the next exit. Both work; pick the faster safe one.',
      points: [
        'Rollback: redeploy the previous artifact. Fast if you kept it and it’s compatible.',
        'Roll forward: ship a fix through the normal pipeline. Needs a fast pipeline.',
        'Database changes often make rollback hard; plan migrations for it.',
        'Practice rollbacks before you need one in an emergency.',
      ],
    },
  ],
};
