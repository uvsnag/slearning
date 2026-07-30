// Tools & Technologies — Kubernetes, Helm/ArgoCD, Nginx, Terraform
import type { PvQuestion } from '../../types';

export const questions: PvQuestion[] = [
  {
    q: 'What problem does Kubernetes solve, and what are its core objects?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Kubernetes is a declarative orchestrator: you submit the desired state and controllers work continuously to make reality match — that reconciliation loop is the whole idea, and it is why a deleted pod comes back and a crashed node's workloads move elsewhere. The objects you need fluently: a <strong>Pod</strong> is the smallest unit (one or more containers sharing a network namespace, and it is disposable); a <strong>Deployment</strong> manages a ReplicaSet to keep N identical stateless pods running and performs rolling updates; a <strong>Service</strong> gives a stable virtual IP and DNS name that load-balances to whichever pods currently match its selector; <strong>Ingress</strong> (or Gateway API) exposes HTTP from outside with routing and TLS; <strong>ConfigMap</strong> and <strong>Secret</strong> inject configuration; <strong>StatefulSet</strong> plus <strong>PersistentVolumeClaim</strong> handle workloads that need stable identity and storage; and <strong>Job</strong>/<strong>CronJob</strong> cover batch work.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Kubernetes là một hệ điều phối theo kiểu khai báo: bạn khai báo trạng thái mong muốn, còn các controller liên tục làm việc để đưa thực tế về khớp với khai báo đó — vòng lặp reconcile chính là toàn bộ ý tưởng, và cũng vì thế mà pod bị xoá sẽ tự mọc lại, workload của node chết sẽ tự chuyển sang node khác. Những object cần nắm thật chắc: <strong>Pod</strong> là đơn vị nhỏ nhất (một hoặc vài container dùng chung network namespace, và pod là thứ dùng xong bỏ được); <strong>Deployment</strong> quản lý ReplicaSet để luôn duy trì N pod stateless giống nhau và thực hiện rolling update; <strong>Service</strong> cấp một IP ảo và tên DNS ổn định, cân bằng tải tới những pod đang khớp selector; <strong>Ingress</strong> (hoặc Gateway API) mở HTTP ra ngoài kèm routing và TLS; <strong>ConfigMap</strong> và <strong>Secret</strong> để đưa cấu hình vào; <strong>StatefulSet</strong> cộng <strong>PersistentVolumeClaim</strong> dành cho workload cần danh tính và ổ đĩa ổn định; còn <strong>Job</strong>/<strong>CronJob</strong> lo phần chạy theo lô.</p></details>
<pre>// The mental model
kubectl apply -f deploy.yaml → API server → etcd (desired state)
                                     ↓
   controllers (Deployment → ReplicaSet → Pod) + scheduler (pick a node)
                                     ↓
   kubelet on the node starts containers, reports status, restarts on failure
// Everything is a control loop: "observe → diff → act", forever.

apiVersion: apps/v1
kind: Deployment
metadata: { name: orders-api }
spec:
  replicas: 3
  strategy:
    rollingUpdate: { maxSurge: 1, maxUnavailable: 0 }   # zero-downtime
  selector: { matchLabels: { app: orders-api } }
  template:
    metadata: { labels: { app: orders-api } }
    spec:
      containers:
        - name: app
          image: registry/orders-api:1.4.2      # a real tag, never :latest
          ports: [{ containerPort: 8080 }]
          envFrom: [{ configMapRef: { name: orders-config } }]
          resources:
            requests: { cpu: 200m, memory: 512Mi }   # scheduling + QoS
            limits:   { cpu: "1",  memory: 1Gi }     # throttle / OOMKill
          readinessProbe:  { httpGet: { path: /readyz, port: 8080 } }
          livenessProbe:   { httpGet: { path: /livez,  port: 8080 } }
          startupProbe:    { httpGet: { path: /livez,  port: 8080 },
                             failureThreshold: 30, periodSeconds: 2 }</pre>
<pre>// The details that separate "I deployed once" from "I operate this"
probes      : readiness = "send me traffic" (removed from Service endpoints
              when failing); liveness = "restart me" (a wrong liveness probe
              creates restart loops under load); startup = slow JVM boot
requests    : the scheduler places by REQUESTS, not usage. No requests →
              BestEffort QoS → first to be evicted under pressure.
limits      : memory limit exceeded = OOMKilled (exit 137); CPU limit =
              throttling, which looks like mysterious latency
graceful    : SIGTERM → your app must stop accepting and drain in
shutdown      terminationGracePeriodSeconds; add a preStop sleep so the
              load balancer deregisters before the process exits
PDB         : PodDisruptionBudget keeps N pods up during node drains
stateless   : Deployment. Stable identity/storage (Kafka, Postgres)?
              StatefulSet + PVC — and consider a managed service instead.</pre>
<div class="key-point">Kubernetes is a reconciliation engine over declarative objects: Deployment for stateless pods, Service for stable in-cluster addressing, Ingress for external HTTP, ConfigMap/Secret for configuration, StatefulSet+PVC for stateful workloads. Getting probes, resource requests/limits, and graceful shutdown right is what makes deployments actually zero-downtime.</div>`,
  },
  {
    q: 'How does networking work in Kubernetes — Service types, DNS and Ingress?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Every pod gets its own routable IP, but pod IPs change constantly, so you never talk to them directly. A <strong>Service</strong> is the stable abstraction: <code>ClusterIP</code> (default) gives an internal virtual IP plus a DNS name <code>svc.namespace.svc.cluster.local</code> and load-balances across the pods matching its selector; <code>NodePort</code> opens a port on every node; <code>LoadBalancer</code> asks the cloud for an external L4 balancer; and a <em>headless</em> Service (<code>clusterIP: None</code>) returns pod IPs directly, which is what StatefulSets use for per-pod addressing. For HTTP you almost always want a single <strong>Ingress</strong> (nginx-ingress, Traefik, or the newer Gateway API) that terminates TLS and routes by host and path to many Services, so you pay for one cloud load balancer rather than one per service.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Mỗi pod đều có IP riêng có thể định tuyến, nhưng IP của pod thay đổi liên tục nên không ai gọi trực tiếp vào đó. <strong>Service</strong> chính là lớp trừu tượng ổn định: <code>ClusterIP</code> (mặc định) cấp một IP ảo nội bộ kèm tên DNS <code>svc.namespace.svc.cluster.local</code> và cân bằng tải tới các pod khớp selector; <code>NodePort</code> mở một port trên mọi node; <code>LoadBalancer</code> yêu cầu cloud cấp một load balancer L4 ra ngoài; còn Service kiểu <em>headless</em> (<code>clusterIP: None</code>) thì trả về thẳng IP của từng pod — đây là thứ StatefulSet dùng để mỗi pod có địa chỉ riêng. Với HTTP thì gần như luôn nên dùng một <strong>Ingress</strong> duy nhất (nginx-ingress, Traefik, hoặc Gateway API mới hơn) để terminate TLS và route theo host/path tới nhiều Service — nhờ vậy bạn chỉ phải trả tiền cho một load balancer của cloud thay vì mỗi service một cái.</p></details>
<pre># Service: selector-based, port-mapped
apiVersion: v1
kind: Service
metadata: { name: orders-api, namespace: shop }
spec:
  selector: { app: orders-api }      # ← matches POD labels, nothing else
  ports: [{ port: 80, targetPort: 8080 }]   # service port → container port
  type: ClusterIP

# In-cluster DNS (CoreDNS)
http://orders-api               # same namespace
http://orders-api.shop          # cross-namespace
http://orders-api.shop.svc.cluster.local   # fully qualified
# StatefulSet + headless service → stable per-pod names:
#   kafka-0.kafka-headless.shop.svc.cluster.local</pre>
<pre># Ingress: one entry point, HTTP routing + TLS
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: shop
  annotations:
    cert-manager.io/cluster-issuer: letsencrypt          # automatic TLS
    nginx.ingress.kubernetes.io/proxy-body-size: 10m
spec:
  ingressClassName: nginx
  tls: [{ hosts: [shop.example.com], secretName: shop-tls }]
  rules:
    - host: shop.example.com
      http:
        paths:
          - { path: /api,  pathType: Prefix,
              backend: { service: { name: orders-api, port: { number: 80 } } } }
          - { path: /,     pathType: Prefix,
              backend: { service: { name: web, port: { number: 80 } } } }
# Ingress covers HTTP(S) only. For TCP/gRPC streaming or advanced routing,
# use Gateway API or a service mesh.</pre>
<pre>// Debugging checklist when "the service is unreachable"
kubectl get endpoints orders-api      # EMPTY → selector/labels mismatch, or
                                      # every pod is failing readiness
kubectl describe svc orders-api       # port/targetPort wrong?
kubectl exec -it pod -- curl -sv http://orders-api/healthz    # from inside
kubectl logs deploy/orders-api --tail=100
kubectl get netpol                    # a default-deny NetworkPolicy blocking
kubectl run tmp --rm -it --image=nicolaka/netshoot -- dig orders-api.shop
// 90% of cases: label selector mismatch, readiness failing, wrong
// targetPort, or a NetworkPolicy nobody remembered.

// Also know:
// - kube-proxy/iptables (or eBPF/Cilium) implements ClusterIP; it is L4
//   round-robin, NOT HTTP-aware → long-lived gRPC connections do not
//   rebalance (use a mesh or client-side LB)
// - NetworkPolicy is namespace-scoped and default-allow until you add one
// - ExternalName services and headless services for external dependencies</pre>
<div class="key-point">Pods are ephemeral, Services are stable: ClusterIP + CoreDNS for internal calls, one Ingress terminating TLS and routing by host/path for external HTTP. When traffic does not flow, check <code>kubectl get endpoints</code> first — empty endpoints means labels or readiness, not networking.</div>`,
  },
  {
    q: 'How do you scale and roll out workloads on Kubernetes without downtime?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Scaling has three layers: <strong>HPA</strong> adds pod replicas based on CPU, memory, or custom metrics (requests per second, Kafka consumer lag through KEDA); the <strong>Cluster Autoscaler</strong>/Karpenter adds nodes when pods cannot be scheduled; and <strong>VPA</strong> tunes the requests of a single pod. Rollouts are just as mechanical: a Deployment with <code>maxUnavailable: 0</code> starts new pods, waits for readiness, then removes old ones — which only achieves zero downtime if readiness probes are honest, the app handles SIGTERM by draining in-flight requests, and a PodDisruptionBudget prevents voluntary evictions from taking too many pods at once. Beyond that, canary or blue-green with Argo Rollouts or a service mesh lets you shift a percentage of traffic and roll back automatically on error-rate regressions.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Việc scale có ba tầng: <strong>HPA</strong> tăng số pod replica dựa trên CPU, RAM hoặc metric tuỳ chỉnh (số request mỗi giây, độ trễ consumer Kafka thông qua KEDA); <strong>Cluster Autoscaler</strong>/Karpenter thêm node khi pod không xếp được vào đâu; còn <strong>VPA</strong> thì điều chỉnh mức request của từng pod. Rollout cũng rất máy móc: một Deployment với <code>maxUnavailable: 0</code> sẽ khởi động pod mới, chờ readiness pass, rồi mới xoá pod cũ — nhưng chỉ thật sự không downtime nếu readiness probe phản ánh đúng, ứng dụng xử lý SIGTERM để chạy nốt các request đang dở, và có PodDisruptionBudget để những lần evict tự nguyện không hạ quá nhiều pod cùng lúc. Ngoài ra, canary hoặc blue-green bằng Argo Rollouts hay service mesh cho phép dịch dần một phần traffic và tự rollback khi tỉ lệ lỗi tăng.</p></details>
<pre>apiVersion: autoscaling/v2
kind: HorizontalPodAutoscaler
spec:
  scaleTargetRef: { apiVersion: apps/v1, kind: Deployment, name: orders-api }
  minReplicas: 3            # never 1 for production: no headroom, no HA
  maxReplicas: 20
  metrics:
    - type: Resource
      resource: { name: cpu, target: { type: Utilization,
                                       averageUtilization: 65 } }
  behavior:
    scaleDown: { stabilizationWindowSeconds: 300 }   # avoid flapping
# HPA math: desired = ceil(current * currentMetric / targetMetric)
# ⚠ HPA needs resource REQUESTS to compute utilisation — without them it
#   does nothing. And CPU is a poor proxy for I/O-bound services; scale on
#   RPS, latency, or queue lag (KEDA) instead.</pre>
<pre>// Zero-downtime rollout: the four things that must all be true
1. strategy: rollingUpdate { maxSurge: 1, maxUnavailable: 0 }
2. readinessProbe only passes when the app can really serve
   (DB pool warm, caches loaded, migrations done)
3. graceful shutdown:
   lifecycle: { preStop: { exec: { command: ["sleep","5"] } } }
   terminationGracePeriodSeconds: 30
   // app: stop accepting new work on SIGTERM, finish in-flight, then exit
   // (Spring Boot: server.shutdown=graceful; Node: server.close())
4. PodDisruptionBudget: { minAvailable: 2 }   // protects node drains

kubectl rollout status deploy/orders-api        # watch it
kubectl rollout undo deploy/orders-api          # instant rollback
kubectl rollout history deploy/orders-api

// Progressive delivery when the change is risky
Argo Rollouts / Flagger: 5% → 25% → 50% → 100%, each step gated on
  Prometheus queries (error rate, p95). Automatic rollback on breach.
// Remember the database: schema changes must be backward compatible
// (expand → migrate → contract) because old and new pods run together.</pre>
<pre>// Sizing and cost, briefly
- requests ≈ steady-state usage, limits ≈ burst ceiling; huge gaps cause
  noisy-neighbour problems, equal values give Guaranteed QoS
- JVM/Node need container-aware flags: -XX:MaxRAMPercentage=75 (JDK 11+
  is container-aware by default), UV_THREADPOOL_SIZE for Node
- topologySpreadConstraints + anti-affinity so replicas are not all on
  one node/AZ (otherwise "3 replicas" is still a single point of failure)
- KEDA scales to zero for event-driven workers; CronJobs for batch</pre>
<div class="key-point">HPA scales pods (needs resource requests, and prefer RPS/lag over CPU), the cluster autoscaler scales nodes. Zero-downtime rollouts require all four of: maxUnavailable 0, honest readiness probes, graceful SIGTERM draining, and a PodDisruptionBudget — plus backward-compatible database migrations because both versions run at once.</div>`,
  },
  {
    q: 'How do you manage Kubernetes manifests across environments — Helm, Kustomize and ArgoCD?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Raw YAML duplicated per environment rots immediately, so you need either templating or overlays. <strong>Helm</strong> packages a chart with <code>values.yaml</code>, giving versioned releases, dependencies, and rollback — ideal for distributing something installable and for wiring third-party components. <strong>Kustomize</strong> takes a plain base and applies declarative patches per overlay, with no templating language at all — usually the cleaner choice for your own applications, and it is built into <code>kubectl</code>. Both are then delivered by <strong>ArgoCD</strong> (or Flux) under GitOps: git holds the desired state, the controller continuously reconciles the cluster to match, and any manual <code>kubectl edit</code> shows up as drift and gets reverted. That combination gives you an auditable history, trivial rollback (revert the commit), and no long-lived cluster credentials in CI.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>YAML thuần copy ra cho từng môi trường thì rất nhanh mục, nên bạn cần hoặc templating, hoặc overlay. <strong>Helm</strong> đóng gói thành chart kèm <code>values.yaml</code>, cho bạn release có version, quản lý dependency và rollback — rất hợp để phát hành một thứ "cài được" và để dựng các thành phần bên thứ ba. <strong>Kustomize</strong> lấy một base YAML thuần rồi áp các patch khai báo cho từng overlay, không có ngôn ngữ template nào cả — thường là lựa chọn gọn hơn cho ứng dụng của chính bạn, và nó có sẵn trong <code>kubectl</code>. Sau đó cả hai đều được giao hàng bởi <strong>ArgoCD</strong> (hoặc Flux) theo mô hình GitOps: git giữ trạng thái mong muốn, controller liên tục đưa cluster về khớp với git, và mọi lần <code>kubectl edit</code> bằng tay sẽ hiện lên như drift rồi bị hoàn nguyên. Bộ đôi này cho bạn lịch sử có thể audit, rollback cực dễ (revert commit), và không phải để credential dài hạn của cluster trong CI.</p></details>
<pre># Helm — templating + release lifecycle
chart/
  Chart.yaml            # name, version, dependencies (postgres, redis)
  values.yaml           # defaults
  values-prod.yaml      # overrides
  templates/deployment.yaml   # {{ .Values.image.tag }}, {{ include ... }}
helm upgrade --install orders ./chart -f values-prod.yaml --atomic --wait
helm rollback orders 3        # versioned releases stored in-cluster
helm template ... | kubectl diff -f -   # ALWAYS diff before prod
# Strengths: distribution, dependencies, one command install.
# Pain: Go templating over YAML is whitespace-sensitive and hard to debug;
#       heavy charts hide what is actually applied.

# Kustomize — no templates, just patches
base/{deployment,service,kustomization}.yaml
overlays/prod/kustomization.yaml:
  resources: [../../base]
  images: [{ name: orders-api, newTag: 1.4.2 }]
  replicas: [{ name: orders-api, count: 6 }]
  patches: [{ path: resources-patch.yaml }]      # bigger limits in prod
kubectl kustomize overlays/prod | kubectl apply -f -
# Strengths: transparent, diffable, no DSL. Weakness: no packaging or
# dependency management → many teams use Helm for vendors + Kustomize for
# their own apps (ArgoCD supports both, and can kustomize a Helm output).</pre>
<pre># ArgoCD — GitOps reconciliation
apiVersion: argoproj.io/v1alpha1
kind: Application
metadata: { name: orders-prod }
spec:
  project: shop
  source:
    repoURL: https://github.com/acme/deploy.git
    targetRevision: main
    path: overlays/prod
  destination: { server: https://kubernetes.default.svc, namespace: shop }
  syncPolicy:
    automated: { prune: true, selfHeal: true }   # drift is reverted
    syncOptions: [CreateNamespace=true]
# Flow: CI builds + pushes image → CI bumps the tag in the deploy repo
#       (or Argo Image Updater does) → ArgoCD syncs → cluster converges.
# Benefits: git is the audit log, rollback = git revert, CI never needs
# cluster admin credentials, and every environment is inspectable as code.

# Secrets in a git-based world (never commit them plainly):
#   Sealed Secrets (encrypt to the cluster's key), SOPS+age, or the
#   External Secrets Operator pulling from Vault/AWS Secrets Manager.</pre>
<div class="key-point">Use Kustomize overlays for your own apps and Helm for packaged/third-party components, then let ArgoCD reconcile git → cluster with self-heal and prune. Git becomes the audit trail and the rollback mechanism, and secrets stay out of git via Sealed Secrets/SOPS/External Secrets.</div>`,
  },
  {
    q: 'What do you use Nginx for, and what are the settings that actually matter?',
    difficulty: 'medium',
    a: `<div class="interview-answer"><p>Nginx sits in front of applications as a reverse proxy and does the things an application server should not: TLS termination, HTTP/2, static file serving, gzip/brotli compression, load balancing across upstreams, connection limits and rate limiting, request buffering, and caching. In Kubernetes the same engine usually runs as the ingress controller. The settings that actually bite in production are timeouts (<code>proxy_read_timeout</code> for slow endpoints, and matching keepalive to the upstream), <code>proxy_set_header</code> for <code>X-Forwarded-For</code>/<code>Proto</code> so the app sees the real client and scheme, <code>client_max_body_size</code> for uploads, WebSocket upgrade headers, and buffer sizes — the misconfiguration that produces "works locally, 502 in production" is nearly always one of those.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Nginx đứng trước ứng dụng như một reverse proxy và làm những việc mà application server không nên làm: terminate TLS, hỗ trợ HTTP/2, phục vụ file tĩnh, nén gzip/brotli, cân bằng tải giữa các upstream, giới hạn kết nối và rate limit, buffer request, và caching. Trong Kubernetes thì cũng chính engine đó thường chạy dưới dạng ingress controller. Những thiết lập hay gây đau ở production là: các timeout (<code>proxy_read_timeout</code> cho endpoint chạy lâu, và keepalive phải khớp với upstream), <code>proxy_set_header</code> để truyền <code>X-Forwarded-For</code>/<code>Proto</code> cho ứng dụng biết client thật và scheme thật, <code>client_max_body_size</code> cho phần upload, các header upgrade cho WebSocket, và kích thước buffer — cái lỗi kinh điển "ở máy thì chạy, lên production thì 502" gần như luôn nằm ở một trong những chỗ đó.</p></details>
<pre>upstream app {
  least_conn;                       # or ip_hash for sticky sessions
  server app1:8080 max_fails=3 fail_timeout=10s;
  server app2:8080;
  keepalive 32;                     # reuse upstream connections (big win)
}

server {
  listen 443 ssl http2;
  server_name shop.example.com;
  ssl_certificate     /etc/ssl/fullchain.pem;
  ssl_certificate_key /etc/ssl/privkey.pem;
  ssl_protocols TLSv1.2 TLSv1.3;

  client_max_body_size 20m;         # 413 errors on upload live here
  gzip on; gzip_types application/json text/css application/javascript;

  # Static assets: let nginx do what it is best at
  location /_next/static/ { root /var/www; expires 1y; add_header Cache-Control "public, immutable"; }

  location /api/ {
    proxy_pass http://app;
    proxy_http_version 1.1;                     # required for keepalive
    proxy_set_header Host              \$host;
    proxy_set_header X-Real-IP         \$remote_addr;
    proxy_set_header X-Forwarded-For   \$proxy_add_x_forwarded_for;
    proxy_set_header X-Forwarded-Proto \$scheme;   # or the app builds http:// links
    proxy_connect_timeout 5s;
    proxy_read_timeout   60s;                   # long reports need more
    proxy_next_upstream error timeout http_502; # retry another upstream
  }

  location /ws/ {                               # WebSocket needs these two
    proxy_pass http://app;
    proxy_http_version 1.1;
    proxy_set_header Upgrade    \$http_upgrade;
    proxy_set_header Connection "upgrade";
    proxy_read_timeout 3600s;
  }
}</pre>
<pre># Rate limiting and protection (cheap, effective, done at the edge)
limit_req_zone \$binary_remote_addr zone=api:10m rate=10r/s;
limit_conn_zone \$binary_remote_addr zone=conn:10m;
location /api/login { limit_req zone=api burst=20 nodelay; limit_conn conn 10; }

# Debugging the classics
502 Bad Gateway     → upstream down / wrong port / upstream killed the
                      keepalive connection (set proxy_http_version 1.1)
504 Gateway Timeout → proxy_read_timeout shorter than the endpoint's work
413 Too Large       → client_max_body_size
"redirects to http" → missing X-Forwarded-Proto (and app not trusting it)
wrong client IP     → real_ip_header / set_real_ip_from behind a CDN
nginx -t && nginx -s reload   # validate before reloading, always</pre>
<p><strong>In Kubernetes</strong> these same knobs appear as ingress annotations (<code>proxy-body-size</code>, <code>proxy-read-timeout</code>, <code>enable-cors</code>, <code>rate-limit</code>), so the knowledge transfers directly; the alternatives are Traefik, Envoy (the data plane behind Istio and Gateway API implementations), and cloud L7 balancers like ALB, which trade configurability for managed simplicity.</p>
<div class="key-point">Let Nginx handle TLS, static files, compression, load balancing, and rate limits, and let the app handle business logic. Get forwarded headers, timeouts, body size, keepalive, and WebSocket upgrade right — those five explain almost every 502/504/413 you will ever debug.</div>`,
  },
  {
    q: 'What is Terraform and why does state management matter?',
    difficulty: 'hard',
    a: `<div class="interview-answer"><p>Terraform is declarative infrastructure as code: you describe the desired cloud resources in HCL, and <code>plan</code> shows the diff between your code, the recorded <strong>state</strong>, and reality before <code>apply</code> changes anything. State is the crux — it is the mapping from your resource names to real cloud ids, so if it is lost Terraform will try to recreate everything, and if two people apply at once it can be corrupted. Hence the non-negotiables: a <strong>remote backend</strong> (S3 with DynamoDB locking, GCS, Terraform Cloud) with versioning and locking, one state per environment, and never editing state by hand. Beyond that, the practices that keep it maintainable are modules with pinned provider versions, no secrets in state or variables, and CI that runs <code>plan</code> on the pull request and <code>apply</code> only after review.</p></div>
<details class="viet-answer"><summary>🇻🇳 Đáp án (Tiếng Việt)</summary><p>Terraform là infrastructure as code theo kiểu khai báo: bạn mô tả các tài nguyên cloud mong muốn bằng HCL, rồi <code>plan</code> sẽ cho thấy khác biệt giữa code, <strong>state</strong> đã ghi nhận và thực tế — trước khi <code>apply</code> thay đổi bất cứ thứ gì. State là mấu chốt: nó là ánh xạ giữa tên tài nguyên trong code và id thật trên cloud, nên nếu mất state thì Terraform sẽ tưởng phải tạo lại tất cả, còn nếu hai người apply cùng lúc thì state có thể hỏng. Vì thế có những thứ không được phép bỏ qua: dùng <strong>remote backend</strong> (S3 kèm DynamoDB để lock, GCS, hay Terraform Cloud) có bật versioning và locking, mỗi môi trường một state riêng, và không bao giờ sửa state bằng tay. Ngoài ra, để dễ bảo trì thì nên chia module, ghim version của provider, không để secret trong state hay trong biến, và cấu hình CI chạy <code>plan</code> ở pull request rồi chỉ <code>apply</code> sau khi đã review.</p></details>
<pre># Remote state with locking — the first thing you set up
terraform {
  required_version = "~> 1.9"
  required_providers { aws = { source = "hashicorp/aws", version = "~> 5.0" } }
  backend "s3" {
    bucket         = "acme-tfstate"
    key            = "prod/network.tfstate"   # one state per env + component
    region         = "eu-west-1"
    dynamodb_table = "tf-locks"               # prevents concurrent applies
    encrypt        = true
  }
}

# Workflow
terraform init      # download providers, configure backend
terraform plan -out=tf.plan     # the diff — review this, always
terraform apply tf.plan         # apply exactly what was reviewed
terraform destroy               # (never in prod without a very good reason)</pre>
<pre># Why state discipline matters — the failure stories
- state file on a laptop → person leaves → nobody can change the infra
- no locking → two CI jobs apply concurrently → corrupted state,
  duplicated resources, an orphaned load balancer nobody can find
- one giant state for everything → a 20-minute plan, and one typo can
  destroy prod networking → split by environment AND blast radius
- someone changed a security group in the console → drift; the next plan
  wants to revert it. Either import it or stop using the console.

terraform state list / show               # inspect
terraform import aws_s3_bucket.logs my-bucket   # adopt existing resources
terraform state mv / rm                   # refactor carefully (last resort)
terraform plan -refresh-only              # detect drift without changing</pre>
<pre># Structure that scales
modules/
  vpc/  eks/  rds/            # reusable, versioned, with inputs/outputs
envs/
  dev/main.tf   staging/main.tf   prod/main.tf   # thin: call modules
# Practices
- pin module and provider versions (a provider minor bump can rewrite a
  resource); run terraform validate + tfsec/Checkov in CI
- never put secrets in variables/outputs: state is PLAINTEXT JSON —
  pull secrets from Vault/Secrets Manager at runtime instead
- prefer create_before_destroy and lifecycle rules for stateful resources
- tag everything (owner, env, cost-centre) so the bill is attributable
- Terraform for cloud infrastructure; Helm/ArgoCD for what runs INSIDE
  the cluster — mixing them (Terraform managing app deployments) makes
  every app release an infrastructure change</pre>
<div class="key-point">Terraform's power is <code>plan</code>-then-<code>apply</code> against recorded state, so protect the state: remote backend with locking and versioning, one state per environment and blast radius, no manual edits, no secrets inside it. Keep modules versioned and let Kubernetes tooling own in-cluster workloads.</div>`,
  },
];
