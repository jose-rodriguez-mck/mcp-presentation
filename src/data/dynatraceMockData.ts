// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface MCPToolCall {
  tool: string;
  description: string;
  parameters: Record<string, unknown>;
}

export interface Problem {
  id: string;
  title: string;
  severity: "CRITICAL" | "ERROR" | "WARNING" | "INFO";
  status: "ACTIVE" | "CLOSED";
  affectedEntity: string;
  startTime: string;
  endTime?: string;
  rootCause?: string;
}

export interface Vulnerability {
  id: string;
  title: string;
  riskLevel: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  riskScore: number;
  affectedEntity: string;
  cveId: string;
  exposure: "PUBLIC_NETWORK" | "INTERNAL" | "NOT_DETECTED";
  stack: "CODE_LIBRARY" | "RUNTIME" | "CONTAINER";
}

export interface ExceptionEntry {
  id: string;
  type: string;
  message: string;
  service: string;
  count: number;
  firstSeen: string;
  lastSeen: string;
  application: string;
}

export interface KubernetesEvent {
  id: string;
  eventType: string;
  reason: string;
  namespace: string;
  involvedObject: string;
  message: string;
  timestamp: string;
  clusterName: string;
}

export interface DavisAnalyzerResult {
  analyzerName: string;
  status: "COMPLETED";
  timeframe: { start: string; end: string };
  result: {
    prediction: string;
    confidence: number;
    details: string[];
  };
}

export interface EnvironmentInfo {
  tenantId: string;
  tenantName: string;
  clusterVersion: string;
  activeGateVersions: string[];
  monitoredHosts: number;
  monitoredServices: number;
  monitoredApplications: number;
}

export interface MockResponse {
  toolCall: MCPToolCall;
  data:
    | Problem[]
    | Vulnerability[]
    | ExceptionEntry[]
    | KubernetesEvent[]
    | DavisAnalyzerResult
    | EnvironmentInfo;
  analysis: string;
}

// ---------------------------------------------------------------------------
// Mock data
// ---------------------------------------------------------------------------

const MOCK_PROBLEMS: Problem[] = [
  {
    id: "P-2403171042",
    title: "Response time degradation on payment-service",
    severity: "CRITICAL",
    status: "ACTIVE",
    affectedEntity: "payment-service (production)",
    startTime: "2026-03-17T08:15:00Z",
    rootCause: "Thread pool exhaustion caused by connection leak in JDBC pool",
  },
  {
    id: "P-2403170923",
    title: "High CPU saturation on host k8s-worker-03",
    severity: "ERROR",
    status: "ACTIVE",
    affectedEntity: "k8s-worker-03.internal",
    startTime: "2026-03-17T06:42:00Z",
    rootCause: "Container cpu-limits exceeded by order-processing pod",
  },
  {
    id: "P-2403170815",
    title: "Failure rate increase on /api/v2/checkout",
    severity: "ERROR",
    status: "ACTIVE",
    affectedEntity: "checkout-api (production)",
    startTime: "2026-03-17T05:30:00Z",
    rootCause: "Upstream inventory-service returning 503 errors",
  },
  {
    id: "P-2403170701",
    title: "Memory leak detected in recommendation-engine",
    severity: "WARNING",
    status: "CLOSED",
    affectedEntity: "recommendation-engine (staging)",
    startTime: "2026-03-16T22:10:00Z",
    endTime: "2026-03-17T01:45:00Z",
    rootCause: "Unbounded cache growth in ML model loader",
  },
  {
    id: "P-2403170544",
    title: "SSL certificate expiring within 7 days",
    severity: "WARNING",
    status: "ACTIVE",
    affectedEntity: "api.acme-corp.com",
    startTime: "2026-03-17T03:00:00Z",
  },
];

const MOCK_VULNERABILITIES: Vulnerability[] = [
  {
    id: "SNYK-JAVA-ORGAPACHELOGGINGLOG4J-2314720",
    title: "Remote Code Execution in Log4j (Log4Shell)",
    riskLevel: "CRITICAL",
    riskScore: 10.0,
    affectedEntity: "payment-service",
    cveId: "CVE-2021-44228",
    exposure: "PUBLIC_NETWORK",
    stack: "CODE_LIBRARY",
  },
  {
    id: "SNYK-JS-JSONWEBTOKEN-3180022",
    title: "Improper JWT signature validation in jsonwebtoken",
    riskLevel: "CRITICAL",
    riskScore: 9.8,
    affectedEntity: "auth-gateway",
    cveId: "CVE-2022-23529",
    exposure: "PUBLIC_NETWORK",
    stack: "CODE_LIBRARY",
  },
  {
    id: "SNYK-JAVA-COMFABORXML-6229700",
    title: "Denial of Service via XML parsing in jackson-databind",
    riskLevel: "HIGH",
    riskScore: 8.6,
    affectedEntity: "order-processing",
    cveId: "CVE-2023-35116",
    exposure: "INTERNAL",
    stack: "CODE_LIBRARY",
  },
  {
    id: "SNYK-PYTHON-REQUESTS-6728084",
    title: "SSRF vulnerability in Python requests library",
    riskLevel: "HIGH",
    riskScore: 8.2,
    affectedEntity: "recommendation-engine",
    cveId: "CVE-2024-35195",
    exposure: "INTERNAL",
    stack: "CODE_LIBRARY",
  },
  {
    id: "SNYK-CONTAINER-DEBIAN-6056183",
    title: "Privilege escalation in container base image",
    riskLevel: "MEDIUM",
    riskScore: 7.1,
    affectedEntity: "nginx-ingress",
    cveId: "CVE-2024-32002",
    exposure: "NOT_DETECTED",
    stack: "CONTAINER",
  },
];

const MOCK_EXCEPTIONS: ExceptionEntry[] = [
  {
    id: "EX-001",
    type: "java.sql.SQLTransientConnectionException",
    message: "HikariPool-1 - Connection is not available, request timed out after 30000ms",
    service: "payment-service",
    count: 1847,
    firstSeen: "2026-03-17T05:12:00Z",
    lastSeen: "2026-03-17T09:35:00Z",
    application: "eCommerce Platform",
  },
  {
    id: "EX-002",
    type: "io.grpc.StatusRuntimeException",
    message: "UNAVAILABLE: upstream connect error or disconnect/reset before headers",
    service: "checkout-api",
    count: 523,
    firstSeen: "2026-03-17T06:00:00Z",
    lastSeen: "2026-03-17T09:33:00Z",
    application: "eCommerce Platform",
  },
  {
    id: "EX-003",
    type: "OutOfMemoryError",
    message: "Java heap space: GC overhead limit exceeded",
    service: "recommendation-engine",
    count: 89,
    firstSeen: "2026-03-16T22:15:00Z",
    lastSeen: "2026-03-17T01:40:00Z",
    application: "ML Pipeline",
  },
  {
    id: "EX-004",
    type: "TypeError",
    message: "Cannot read properties of undefined (reading 'userId')",
    service: "frontend-bff",
    count: 312,
    firstSeen: "2026-03-17T07:20:00Z",
    lastSeen: "2026-03-17T09:30:00Z",
    application: "Web Storefront",
  },
  {
    id: "EX-005",
    type: "redis.exceptions.ConnectionError",
    message: "Error 110 connecting to redis-cluster:6379. Connection timed out.",
    service: "session-manager",
    count: 156,
    firstSeen: "2026-03-17T08:45:00Z",
    lastSeen: "2026-03-17T09:34:00Z",
    application: "eCommerce Platform",
  },
];

const MOCK_K8S_EVENTS: KubernetesEvent[] = [
  {
    id: "EVT-001",
    eventType: "RESOURCE_CONTENTION_EVENT",
    reason: "CPUThrottling",
    namespace: "production",
    involvedObject: "pod/order-processing-7d9f8b6c4-x2k9m",
    message: "Container cpu-limit reached, throttled for 45s in the last 5m window",
    timestamp: "2026-03-17T08:52:00Z",
    clusterName: "acme-prod-us-east-1",
  },
  {
    id: "EVT-002",
    eventType: "PROCESS_RESTART",
    reason: "OOMKilled",
    namespace: "production",
    involvedObject: "pod/recommendation-engine-5c8d7f9-lk4n2",
    message: "Container killed by OOM killer, memory limit 2Gi exceeded — restarting (3rd restart)",
    timestamp: "2026-03-17T07:30:00Z",
    clusterName: "acme-prod-us-east-1",
  },
  {
    id: "EVT-003",
    eventType: "SERVICE_ERROR_RATE_INCREASED",
    reason: "BackendError",
    namespace: "production",
    involvedObject: "service/checkout-api",
    message: "Error rate increased from 0.2% to 14.7% over the last 30 minutes",
    timestamp: "2026-03-17T06:15:00Z",
    clusterName: "acme-prod-us-east-1",
  },
  {
    id: "EVT-004",
    eventType: "SERVICE_SLOWDOWN",
    reason: "LatencySpike",
    namespace: "production",
    involvedObject: "service/payment-service",
    message: "P95 response time increased from 120ms to 3400ms",
    timestamp: "2026-03-17T08:20:00Z",
    clusterName: "acme-prod-us-east-1",
  },
  {
    id: "EVT-005",
    eventType: "DETECTION_FINDING",
    reason: "ImagePullBackOff",
    namespace: "staging",
    involvedObject: "pod/canary-deploy-v2.4.1-ab8f3",
    message: "Failed to pull image 'registry.acme.io/canary:v2.4.1' — unauthorized",
    timestamp: "2026-03-17T09:10:00Z",
    clusterName: "acme-staging-us-east-1",
  },
];

const MOCK_DAVIS_RESULT: DavisAnalyzerResult = {
  analyzerName: "dt.statistics.GenericForecastAnalyzer",
  status: "COMPLETED",
  timeframe: { start: "2026-03-10T00:00:00Z", end: "2026-03-17T09:30:00Z" },
  result: {
    prediction:
      "CPU utilization on k8s-worker-03 is projected to exceed 95% within the next 48 hours under current workload trends.",
    confidence: 0.87,
    details: [
      "Current 7-day average CPU: 72% (up from 58% last week)",
      "Linear trend shows +2.1% daily increase since Mar 10",
      "Correlated with 34% growth in order-processing request volume",
      "Projected breach of 95% threshold: Mar 19 between 14:00–18:00 UTC",
      "Recommendation: scale horizontally or increase CPU limits before Mar 19",
    ],
  },
};

const MOCK_ENV_INFO: EnvironmentInfo = {
  tenantId: "abc12345",
  tenantName: "Acme Corp Production",
  clusterVersion: "1.291.134.20260312-073521",
  activeGateVersions: ["1.291.134", "1.291.130"],
  monitoredHosts: 47,
  monitoredServices: 183,
  monitoredApplications: 12,
};

// ---------------------------------------------------------------------------
// Analysis text
// ---------------------------------------------------------------------------

const ANALYSIS_PROBLEMS = `**Summary:** 5 problems detected in the last 24 hours — 2 critical/error issues are currently active and impacting production services.

**Key finding:** The response-time degradation on \`payment-service\` (P-2403171042) and the failure-rate spike on \`/api/v2/checkout\` (P-2403170815) share a common dependency on the \`inventory-service\`. The JDBC connection-pool exhaustion is likely cascading downstream.

**Recommended actions:**
1. **Immediate** — Restart \`payment-service\` pods and increase HikariCP max-pool-size from 10 → 25
2. **Short-term** — Investigate the connection leak in the JDBC driver; review recent deployments to \`inventory-service\`
3. **Preventive** — Add connection-pool health metrics to the SLO dashboard and set an early-warning alert at 80% pool utilization`;

const ANALYSIS_VULNERABILITIES = `**Summary:** 5 active vulnerabilities found — 2 are rated **CRITICAL** with public network exposure, requiring urgent remediation.

**Key finding:** The Log4Shell vulnerability (CVE-2021-44228) is still present in \`payment-service\`, a PCI-scope service exposed to the internet. The JWT validation flaw in \`auth-gateway\` (CVE-2022-23529) could allow token forgery.

**Recommended actions:**
1. **Immediate** — Patch \`log4j-core\` to ≥ 2.17.1 in payment-service and redeploy
2. **Immediate** — Upgrade \`jsonwebtoken\` to ≥ 9.0.0 in auth-gateway
3. **This sprint** — Update jackson-databind and requests library in affected services
4. **Governance** — Enable automated CVE scanning in CI/CD pipeline to prevent regressions`;

const ANALYSIS_EXCEPTIONS = `**Summary:** 5 distinct exception types detected across 4 services, totaling ~2,927 occurrences in the last 24 hours.

**Key finding:** The \`SQLTransientConnectionException\` in \`payment-service\` (1,847 hits) is the highest-volume issue and correlates with the active problem P-2403171042. The gRPC errors in \`checkout-api\` are a downstream consequence.

**Recommended actions:**
1. **Immediate** — Increase HikariCP pool size and add connection-timeout retry logic
2. **Short-term** — Fix the null-reference bug in \`frontend-bff\` (userId undefined) — likely a missing auth-context check
3. **Short-term** — Investigate Redis connectivity issues in \`session-manager\` — check network policies and Redis cluster health`;

const ANALYSIS_K8S_EVENTS = `**Summary:** 5 Kubernetes events detected across the \`acme-prod-us-east-1\` cluster — multiple resource-contention and service-degradation signals.

**Key finding:** The OOMKilled restart of \`recommendation-engine\` and CPU throttling of \`order-processing\` indicate the worker node \`k8s-worker-03\` is under severe resource pressure. This correlates with the active problem P-2403170923.

**Recommended actions:**
1. **Immediate** — Increase memory limit for \`recommendation-engine\` from 2Gi → 4Gi (or fix the memory leak)
2. **Immediate** — Adjust CPU limits for \`order-processing\` or add HPA with target utilization of 70%
3. **Short-term** — Fix the image-pull auth for the canary deployment in staging
4. **Architecture** — Consider node auto-scaling or dedicated node pools for memory-intensive workloads`;

const ANALYSIS_DAVIS = `**Summary:** The Davis Forecast Analyzer predicts that CPU utilization on \`k8s-worker-03\` will exceed 95% within the next 48 hours (by March 19, 14:00–18:00 UTC) with 87% confidence.

**Key finding:** A sustained +2.1% daily increase in CPU usage, driven by a 34% growth in order-processing request volume, is on a collision course with capacity limits.

**Recommended actions:**
1. **Before Mar 19** — Add an additional worker node or increase CPU allocation for the node pool
2. **Immediate** — Set up an HPA (Horizontal Pod Autoscaler) for \`order-processing\` if not already configured
3. **Long-term** — Implement predictive auto-scaling based on Davis forecasts to proactively adjust capacity`;

const ANALYSIS_ENVIRONMENT = `**Summary:** Successfully connected to the **Acme Corp Production** Dynatrace environment (tenant \`abc12345\`), running cluster version 1.291.134.

**Environment overview:**
- **47 hosts** monitored (2 ActiveGate versions deployed)
- **183 services** instrumented across the environment
- **12 applications** tracked with Real User Monitoring

The environment is healthy and all monitoring agents are reporting. ActiveGate version 1.291.130 on 3 nodes is one patch behind — consider upgrading to 1.291.134 for consistency.`;

// ---------------------------------------------------------------------------
// Intent-matching & response routing
// ---------------------------------------------------------------------------

interface IntentPattern {
  keywords: string[];
  buildResponse: () => MockResponse;
}

const INTENT_PATTERNS: IntentPattern[] = [
  {
    keywords: ["problem", "problems", "incident", "incidents", "issue", "issues", "outage", "alert", "alerts"],
    buildResponse: () => ({
      toolCall: {
        tool: "list_problems",
        description: "List all problems known on Dynatrace, sorted by recency",
        parameters: { timeframe: "24h", status: "ALL", maxProblemsToDisplay: 10 },
      },
      data: MOCK_PROBLEMS,
      analysis: ANALYSIS_PROBLEMS,
    }),
  },
  {
    keywords: ["vulnerability", "vulnerabilities", "cve", "security", "risk", "patch", "snyk"],
    buildResponse: () => ({
      toolCall: {
        tool: "list_vulnerabilities",
        description: "Retrieve all active vulnerabilities from Dynatrace",
        parameters: { timeframe: "30d", riskScore: 8, maxVulnerabilitiesToDisplay: 25 },
      },
      data: MOCK_VULNERABILITIES,
      analysis: ANALYSIS_VULNERABILITIES,
    }),
  },
  {
    keywords: ["exception", "exceptions", "error", "errors", "stack trace", "stacktrace", "crash", "bug"],
    buildResponse: () => ({
      toolCall: {
        tool: "list_exceptions",
        description: "List all exceptions known on Dynatrace starting with the most recent",
        parameters: { timeframe: "24h", maxExceptionsToDisplay: 10 },
      },
      data: MOCK_EXCEPTIONS,
      analysis: ANALYSIS_EXCEPTIONS,
    }),
  },
  {
    keywords: ["kubernetes", "k8s", "cluster", "pod", "node", "container", "namespace", "kubectl", "event"],
    buildResponse: () => ({
      toolCall: {
        tool: "get_kubernetes_events",
        description: "Get all events from a specific Kubernetes cluster",
        parameters: { timeframe: "24h", maxEventsToDisplay: 10 },
      },
      data: MOCK_K8S_EVENTS,
      analysis: ANALYSIS_K8S_EVENTS,
    }),
  },
  {
    keywords: ["forecast", "predict", "davis", "analyzer", "trend", "capacity", "projection", "analyze"],
    buildResponse: () => ({
      toolCall: {
        tool: "execute_davis_analyzer",
        description: "Execute a Davis Analyzer with custom input parameters",
        parameters: {
          analyzerName: "dt.statistics.GenericForecastAnalyzer",
          timeframeStart: "now-7d",
          timeframeEnd: "now",
          input: { metricKey: "builtin:host.cpu.usage", entityId: "HOST-3A7B9C2D1E" },
        },
      },
      data: MOCK_DAVIS_RESULT,
      analysis: ANALYSIS_DAVIS,
    }),
  },
  {
    keywords: ["environment", "tenant", "connection", "connected", "status", "setup", "version", "info"],
    buildResponse: () => ({
      toolCall: {
        tool: "get_environment_info",
        description: "Get information about the connected Dynatrace Environment",
        parameters: {},
      },
      data: MOCK_ENV_INFO,
      analysis: ANALYSIS_ENVIRONMENT,
    }),
  },
];

const FALLBACK_RESPONSE: MockResponse = {
  toolCall: {
    tool: "list_problems",
    description: "List all problems known on Dynatrace, sorted by recency",
    parameters: { timeframe: "24h", status: "ALL", maxProblemsToDisplay: 10 },
  },
  data: MOCK_PROBLEMS,
  analysis:
    "I wasn't sure exactly what you were looking for, so I pulled the latest problems from Dynatrace. " +
    ANALYSIS_PROBLEMS,
};

/**
 * Match user input to a Dynatrace MCP tool and return a simulated response
 * containing the tool call metadata, mock data, and an AI analysis.
 */
export function matchIntent(userMessage: string): MockResponse {
  const lower = userMessage.toLowerCase();
  for (const pattern of INTENT_PATTERNS) {
    if (pattern.keywords.some((kw) => lower.includes(kw))) {
      return pattern.buildResponse();
    }
  }
  return FALLBACK_RESPONSE;
}

// ---------------------------------------------------------------------------
// Suggested prompts (displayed as clickable chips in the UI)
// ---------------------------------------------------------------------------

export const SUGGESTED_PROMPTS = [
  "What problems were detected in the last 24 hours?",
  "Show me critical vulnerabilities",
  "Any recent exceptions?",
  "Kubernetes cluster events",
  "Run a forecast analysis",
  "Show environment info",
];
