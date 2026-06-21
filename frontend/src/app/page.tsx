"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ScanForm from "@/components/ScanForm";
import Footer from "@/components/Footer";
import { submitScan, type ScanResponse } from "@/lib/api";

const FEATURES = [
  {
    icon: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
    title: "Breach Detection",
    desc: "Powered by HaveIBeenPwned and a curated Indian breach dataset covering 15+ major incidents.",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
  },
  {
    icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75",
    title: "Social Footprint",
    desc: "Check your username across 10 major platforms. See exactly where you are publicly findable.",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
  },
  {
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
    title: "Risk Score",
    desc: "A deterministic 0–100 score based on breach severity, data types exposed, and recency.",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
  },
  {
    icon: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3",
    title: "Plain Language",
    desc: "Every breach explained in simple English. Know exactly what was exposed and what it means for you.",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
  },
  {
    icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11",
    title: "Action Plan",
    desc: "Personalized security checklist, prioritized by risk. Fix the most critical issues first.",
    color: "#10b981",
    bg: "rgba(16,185,129,0.1)",
  },
  {
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
    title: "Zero Storage",
    desc: "Your email is never stored. We scan, generate your report, and immediately discard all data.",
    color: "#7c3aed",
    bg: "rgba(124,58,237,0.1)",
  },
];

const STEPS = [
  {
    step: "01",
    title: "Enter your email",
    desc: "Type your email address. Optionally add a username to check social platform presence.",
    icon: "M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z",
  },
  {
    step: "02",
    title: "We scan everything",
    desc: "We check breach databases, Indian breach reports, and public platform presence in real time.",
    icon: "M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v11m0 0h10M9 14H5a2 2 0 00-2 2v4a2 2 0 002 2h4m0-6h10m0 0a2 2 0 012 2v4a2 2 0 01-2 2h-4",
  },
  {
    step: "03",
    title: "Get your report",
    desc: "See your exposure score, breach details in plain language, and a prioritized action plan.",
    icon: "M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z",
  },
];

export default function HomePage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleScan = async (email: string, username?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const result: ScanResponse = await submitScan(email, username);
      sessionStorage.setItem("scan_result", JSON.stringify(result));
      router.push("/report");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      {/* ── Hero ── */}
      <section
        id="scan-form"
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          padding: "120px 0 80px",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Ambient glow orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />

        {/* Subtle grid overlay */}
        <div style={{
          position: "absolute",
          inset: 0,
          backgroundImage: `linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
                            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
          maskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 20%, transparent 80%)",
          pointerEvents: "none",
        }} />

        <div className="container">
          <div style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
            gap: 24,
            maxWidth: 640,
            margin: "0 auto",
            position: "relative",
            zIndex: 1,
          }}>
            {/* Label */}
            <div className="section-label animate-in">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
              Privacy-first security scanner
            </div>

            {/* Headline */}
            <h1
              className="animate-in animate-in-delay-1"
              style={{
                fontFamily: "'Space Grotesk', sans-serif",
                fontSize: "clamp(36px, 6vw, 58px)",
                fontWeight: 800,
                lineHeight: 1.1,
                letterSpacing: "-2px",
                color: "var(--text-primary)",
              }}
            >
              Find out what the internet{" "}
              <span className="gradient-text">knows about you</span>
            </h1>

            {/* Subhead */}
            <p
              className="animate-in animate-in-delay-2"
              style={{
                fontSize: "clamp(15px, 2.5vw, 17px)",
                color: "var(--text-secondary)",
                lineHeight: 1.7,
                maxWidth: 500,
              }}
            >
              Check your digital footprint in 60 seconds. Discover data breaches,
              exposed accounts, and get a clear action plan.{" "}
              <strong style={{ color: "var(--text-primary)", fontWeight: 600 }}>No sign-up required.</strong>
            </p>

            {/* Scan form */}
            <div className="animate-in animate-in-delay-3" style={{ width: "100%", marginTop: 8 }}>
              <ScanForm onSubmit={handleScan} isLoading={isLoading} />
            </div>

            {/* Error */}
            {error && (
              <div style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "12px 18px",
                background: "var(--severity-critical-bg)",
                border: "1px solid var(--severity-critical-border)",
                borderRadius: "var(--radius-md)",
                color: "var(--severity-critical-text)",
                fontSize: 13,
                width: "100%",
                maxWidth: 480,
              }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
                </svg>
                {error}
              </div>
            )}

            {/* Trust badges */}
            <div
              className="animate-in animate-in-delay-4"
              style={{ display: "flex", flexWrap: "wrap", gap: 8, justifyContent: "center", marginTop: 4 }}
            >
              {[
                { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", text: "Zero data storage" },
                { icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z", text: "HIBP powered" },
                { icon: "M18 9v3m0 0v3m0-3h3m-3 0h-3M6 12a6 6 0 1112 0 6 6 0 01-12 0z", text: "No sign-up needed" },
              ].map((b) => (
                <span key={b.text} className="trust-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={b.icon} />
                  </svg>
                  {b.text}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── Stats bar ── */}
      <section style={{ padding: "36px 0" }}>
        <div className="container">
          <div className="stagger" style={{
            display: "grid",
            gridTemplateColumns: "repeat(4, 1fr)",
            gap: 1,
          }}>
            {[
              { value: "15+", label: "Breach sources" },
              { value: "10", label: "Social platforms" },
              { value: "0", label: "Data stored" },
              { value: "60s", label: "Scan time" },
            ].map((s, i) => (
              <div key={i} style={{
                textAlign: "center",
                padding: "16px 8px",
                borderRight: i < 3 ? "1px solid var(--border)" : "none",
              }}>
                <div style={{
                  fontFamily: "'Space Grotesk', sans-serif",
                  fontSize: 30,
                  fontWeight: 800,
                  letterSpacing: "-1px",
                  lineHeight: 1,
                  marginBottom: 4,
                }} className="gradient-text">{s.value}</div>
                <div style={{ fontSize: 12, color: "var(--text-muted)", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── How it works ── */}
      <section id="how-it-works" style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label" style={{ justifyContent: "center", display: "inline-flex" }}>
              How it works
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(24px, 4vw, 34px)",
              fontWeight: 700,
              letterSpacing: "-1px",
              color: "var(--text-primary)",
            }}>
              Three steps to total clarity
            </h2>
          </div>

          <div className="stagger" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 16,
          }}>
            {STEPS.map((s) => (
              <div key={s.step} className="card" style={{ padding: 28, position: "relative", overflow: "hidden" }}>
                {/* Background step number watermark */}
                <div style={{
                  position: "absolute",
                  top: -8,
                  right: 16,
                  fontSize: 80,
                  fontWeight: 900,
                  color: "rgba(124,58,237,0.05)",
                  fontFamily: "'Space Grotesk', sans-serif",
                  lineHeight: 1,
                  userSelect: "none",
                }}>{s.step}</div>

                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: "var(--accent-muted)",
                  border: "1px solid var(--border-accent)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 16,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#a78bfa" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </div>

                <div style={{
                  fontSize: 11,
                  fontWeight: 700,
                  color: "#7c3aed",
                  letterSpacing: "1px",
                  textTransform: "uppercase",
                  marginBottom: 8,
                }}>Step {s.step}</div>
                <h3 style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)", marginBottom: 8, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {s.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <hr className="divider" />

      {/* ── Features ── */}
      <section id="features" style={{ padding: "80px 0" }}>
        <div className="container">
          <div style={{ textAlign: "center", marginBottom: 48 }}>
            <div className="section-label" style={{ justifyContent: "center", display: "inline-flex" }}>
              Features
            </div>
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(24px, 4vw, 34px)",
              fontWeight: 700,
              letterSpacing: "-1px",
              color: "var(--text-primary)",
            }}>
              Everything you need to protect yourself
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginTop: 10 }}>
              A complete privacy scanner built with your security in mind.
            </p>
          </div>

          <div className="stagger" style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            gap: 12,
          }}>
            {FEATURES.map((f) => (
              <div key={f.title} className="card" style={{ padding: 24 }}>
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: "var(--radius-md)",
                  background: f.bg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  marginBottom: 14,
                }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke={f.color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                    <path d={f.icon} />
                  </svg>
                </div>
                <h3 style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", marginBottom: 6, fontFamily: "'Space Grotesk', sans-serif" }}>
                  {f.title}
                </h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.7 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA bottom ── */}
      <section style={{ padding: "60px 0 80px" }}>
        <div className="container">
          <div style={{
            padding: "48px 40px",
            borderRadius: "var(--radius-xl)",
            border: "1px solid var(--border-accent)",
            background: "linear-gradient(135deg, rgba(124,58,237,0.07) 0%, rgba(79,70,229,0.07) 100%)",
            textAlign: "center",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400, height: 200,
              background: "radial-gradient(ellipse, rgba(124,58,237,0.15) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <h2 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: "clamp(22px, 3vw, 30px)",
              fontWeight: 700,
              letterSpacing: "-0.8px",
              color: "var(--text-primary)",
              marginBottom: 10,
              position: "relative",
            }}>
              Start your free scan now
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-muted)", marginBottom: 24, position: "relative" }}>
              No account needed. Takes 60 seconds. 100% private.
            </p>
            <a href="#scan-form" className="btn-primary" style={{ fontSize: 15, padding: "13px 32px", display: "inline-flex" }}>
              Scan my footprint →
            </a>
          </div>
        </div>
      </section>

      <Footer />

      <style>{`
        @media (max-width: 768px) {
          section:first-of-type { padding: 100px 0 60px !important; }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  );
}
