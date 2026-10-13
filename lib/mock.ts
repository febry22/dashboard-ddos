// ---------------------------------------------------------------------------
// DEMO ONLY — everything here is dummy data.
// No real network request, scan, or traffic is ever sent to the target URL.
// The "AI analysis" is a deterministic simulation used to drive the UI.
// ---------------------------------------------------------------------------

export type ServiceId = "A" | "B";

export interface ServiceInfo {
  id: ServiceId;
  name: string;
  tagline: string;
  description: string;
  strengths: string[];
}

export interface Signal {
  label: string;
  value: string;
  // which service this signal tends to favor
  favors: ServiceId;
}

export interface AnalysisResult {
  target: string;
  hostname: string;
  summary: string;
  signals: Signal[];
  recommended: ServiceId;
  confidence: number; // 0..100
  reasons: string[];
  services: Record<ServiceId, ServiceInfo>;
}

export const SERVICES: Record<ServiceId, ServiceInfo> = {
  A: {
    id: "A",
    name: "Service A — WebVuln Scanner",
    tagline: "Application-layer security assessment",
    description:
      "Authorized web-application vulnerability assessment: crawls the app surface, inspects forms, auth flows and headers, and reports misconfigurations.",
    strengths: [
      "Rich dynamic / form-heavy apps",
      "Authentication & session review",
      "OWASP-style findings report",
    ],
  },
  B: {
    id: "B",
    name: "Service B — LoadGuard Resilience",
    tagline: "Infrastructure resilience & load profiling",
    description:
      "Authorized resilience testing: profiles how the target's infrastructure handles concurrency and sustained traffic, with rate limits you configure.",
    strengths: [
      "Static / CDN-heavy sites",
      "Capacity & resilience profiling",
      "Latency & throughput baselines",
    ],
  },
};

// Tiny deterministic hash so the same URL always yields the same demo result.
function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return Math.abs(h);
}

function safeHostname(raw: string): string {
  try {
    const url = new URL(raw.includes("://") ? raw : `https://${raw}`);
    return url.hostname;
  } catch {
    return raw.replace(/^https?:\/\//, "").split("/")[0] || raw;
  }
}

export function analyze(rawTarget: string): AnalysisResult {
  const target = rawTarget.trim();
  const hostname = safeHostname(target);
  const h = hash(hostname.toLowerCase());

  // Derive a few pseudo "signals" from the hash — all synthetic.
  const pages = 20 + (h % 480);
  const forms = h % 14;
  const hasLogin = (h >> 3) % 2 === 0;
  const cdn = ["Cloudflare", "Fastly", "Akamai", "None detected"][h % 4];
  const techStack = ["Next.js", "WordPress", "Laravel", "Django", "Static HTML"][
    (h >> 5) % 5
  ];
  const tls = ["TLS 1.3", "TLS 1.2", "TLS 1.2 (legacy ciphers)"][(h >> 7) % 3];

  const signals: Signal[] = [
    {
      label: "Detected tech stack",
      value: techStack,
      favors: techStack === "Static HTML" ? "B" : "A",
    },
    {
      label: "Estimated crawlable pages",
      value: String(pages),
      favors: pages > 250 ? "B" : "A",
    },
    {
      label: "Input forms found",
      value: String(forms),
      favors: forms >= 3 ? "A" : "B",
    },
    {
      label: "Authentication flow",
      value: hasLogin ? "Login detected" : "None detected",
      favors: hasLogin ? "A" : "B",
    },
    { label: "Edge / CDN", value: cdn, favors: cdn === "None detected" ? "A" : "B" },
    { label: "TLS", value: tls, favors: "A" },
  ];

  const scoreA = signals.filter((s) => s.favors === "A").length;
  const scoreB = signals.length - scoreA;
  const recommended: ServiceId = scoreA >= scoreB ? "A" : "B";
  const confidence =
    50 + Math.round((Math.abs(scoreA - scoreB) / signals.length) * 45);

  const reasons: string[] =
    recommended === "A"
      ? [
          `The target exposes an application-heavy surface (${forms} form${
            forms === 1 ? "" : "s"
          }${hasLogin ? ", with a login flow" : ""}), which is best covered by an application-layer assessment.`,
          `A ${techStack} stack typically carries app-level misconfigurations worth reviewing before anything else.`,
          `Service A's crawl + auth review maps directly onto these signals.`,
        ]
      : [
          `The surface looks infrastructure-oriented (${cdn} edge, ~${pages} pages, few forms), so resilience profiling gives more signal than an app scan.`,
          `A ${techStack} delivery benefits more from capacity baselines than form-level checks.`,
          `Service B's concurrency profiling (with your configured rate limits) fits this target.`,
        ];

  const summary = `${hostname} looks like a ${
    recommended === "A" ? "dynamic web application" : "static / edge-served site"
  }. Based on ${signals.length} synthetic signals, the assistant leans toward ${
    SERVICES[recommended].name
  }.`;

  return {
    target,
    hostname,
    summary,
    signals,
    recommended,
    confidence,
    reasons,
    services: SERVICES,
  };
}
