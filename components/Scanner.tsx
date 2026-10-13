"use client";

import { useEffect, useState } from "react";
import type { AnalysisResult, ServiceId } from "@/lib/mock";

type Stage = "input" | "analyzing" | "results" | "confirmed";

const ANALYZE_STEPS = [
  "Resolving target & reading public metadata",
  "Profiling tech stack and surface area",
  "Matching signals against service capabilities",
  "Drafting recommendation",
];

export default function Scanner() {
  const [stage, setStage] = useState<Stage>("input");
  const [target, setTarget] = useState("");
  const [error, setError] = useState("");
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [selected, setSelected] = useState<ServiceId | null>(null);
  const [activeStep, setActiveStep] = useState(0);

  useEffect(() => {
    if (stage !== "analyzing") return;
    setActiveStep(0);
    const t = setInterval(() => {
      setActiveStep((s) => Math.min(s + 1, ANALYZE_STEPS.length - 1));
    }, 420);
    return () => clearInterval(t);
  }, [stage]);

  async function runAnalysis() {
    setError("");
    if (!target.trim()) {
      setError("Masukkan alamat website dulu.");
      return;
    }
    setStage("analyzing");
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ target }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Analysis failed");
      await new Promise((r) => setTimeout(r, 700));
      setResult(data);
      setSelected(data.recommended);
      setStage("results");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Something went wrong");
      setStage("input");
    }
  }

  function reset() {
    setStage("input");
    setResult(null);
    setSelected(null);
    setError("");
  }

  return (
    <>
      <div className="notice">
        <span>ⓘ</span>
        <span>
          This is a UI demo. All analysis is{" "}
          <strong>simulated with dummy data</strong> — no request, scan, or
          traffic is ever sent to the address you enter. Only run real tests
          against systems you own or are explicitly authorized to assess.
        </span>
      </div>

      {stage === "input" && (
        <div className="card">
          <div className="field">
            <label htmlFor="target">Website address</label>
            <div className="row">
              <input
                id="target"
                type="text"
                placeholder="example.com"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && runAnalysis()}
                autoFocus
              />
              <button className="btn" onClick={runAnalysis}>
                Analyze
              </button>
            </div>
            {error && <div className="error">{error}</div>}
          </div>
        </div>
      )}

      {stage === "analyzing" && (
        <div className="card">
          <p className="summary">Analyzing {target}…</p>
          <div className="steps">
            {ANALYZE_STEPS.map((label, i) => (
              <div
                key={i}
                className={
                  "step " +
                  (i < activeStep ? "done" : i === activeStep ? "active" : "")
                }
              >
                <span className="dot" />
                {label}
              </div>
            ))}
          </div>
        </div>
      )}

      {stage === "results" && result && (
        <>
          <div className="card">
            <p className="summary">{result.summary}</p>
            <div className="meta">
              Target: <strong>{result.hostname}</strong>
            </div>
            <div className="signals">
              {result.signals.map((s, i) => (
                <div className="signal" key={i}>
                  <div className="k">{s.label}</div>
                  <div className="v">{s.value}</div>
                </div>
              ))}
            </div>
            <div className="confidence">
              <span className="meta">Confidence</span>
              <div className="bar">
                <span style={{ width: `${result.confidence}%` }} />
              </div>
              <span className="meta">{result.confidence}%</span>
            </div>
          </div>

          <div className="section-title">Why this recommendation</div>
          <div className="card">
            <ul className="reasons">
              {result.reasons.map((r, i) => (
                <li key={i}>{r}</li>
              ))}
            </ul>
          </div>

          <div className="section-title">Choose a service</div>
          <div className="services">
            {(["A", "B"] as ServiceId[]).map((id) => {
              const svc = result.services[id];
              const isRec = result.recommended === id;
              const isSel = selected === id;
              return (
                <button
                  key={id}
                  className={
                    "service" +
                    (isRec ? " recommended" : "") +
                    (isSel ? " selected" : "")
                  }
                  onClick={() => setSelected(id)}
                >
                  <h3>{svc.name}</h3>
                  <div className="tag">{svc.tagline}</div>
                  <p>{svc.description}</p>
                  <div className="chips">
                    {svc.strengths.map((s, i) => (
                      <span className="chip" key={i}>
                        {s}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>

          <div className="actions">
            <button className="btn-ghost" onClick={reset}>
              ← Analyze another
            </button>
            <button
              className="btn"
              disabled={!selected}
              onClick={() => setStage("confirmed")}
            >
              Continue with Service {selected}
            </button>
          </div>
        </>
      )}

      {stage === "confirmed" && result && selected && (
        <div className="card confirm">
          <div className="big">✓</div>
          <h2>{result.services[selected].name} selected</h2>
          <p>
            In a real build, this is where you&apos;d configure scope, rate
            limits, and authorization before any test begins. For this demo,
            nothing is executed.
          </p>
          <button className="btn-ghost" onClick={reset}>
            Start over
          </button>
        </div>
      )}
    </>
  );
}
