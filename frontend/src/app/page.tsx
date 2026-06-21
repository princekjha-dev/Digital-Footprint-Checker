"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import ScanForm from "@/components/ScanForm";
import Footer from "@/components/Footer";
import { submitScan, type ScanResponse } from "@/lib/api";

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
      {/* Hero */}
      <section style={{ minHeight: "100vh", display: "flex", alignItems: "center", padding: "100px 0 60px" }}>
        <div className="container">
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", gap: 20, maxWidth: 600, margin: "0 auto" }}>

            <div className="animate-in" style={{
              width: 48, height: 48, display: "flex", alignItems: "center", justifyContent: "center",
              background: "var(--accent-muted)", borderRadius: "var(--radius-md)", border: "1px solid var(--border-accent)",
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
              </svg>
            </div>

            <h1 className="animate-in" style={{ fontSize: 40, fontWeight: 800, lineHeight: 1.15, letterSpacing: -1.5, color: "var(--text-primary)" }}>
              Find out what the internet knows about you
            </h1>

            <p className="animate-in" style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.7, maxWidth: 480 }}>
              Check your digital footprint in 60 seconds. Discover data breaches,
              exposed accounts, and get a clear action plan. No sign-up required.
            </p>

            <div className="animate-in" style={{ width: "100%", marginTop: 8 }}>
              <ScanForm onSubmit={handleScan} isLoading={isLoading} />
            </div>

            {error && (
              <div style={{
                display: "flex", alignItems: "center", gap: 8, padding: "10px 16px",
                background: "var(--severity-critical-bg)", border: "1px solid var(--severity-critical-border)",
                borderRadius: "var(--radius-md)", color: "var(--severity-critical-text)", fontSize: 13,
              }}>
                {error}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section style={{ padding: "60px 0" }}>
        <div className="container">
          <h2 className="section-heading" style={{ justifyContent: "center", marginBottom: 24 }}>How it works</h2>
          <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { step: "1", title: "Enter your email", desc: "Type your email address. Optionally add a username to check social platform presence." },
              { step: "2", title: "We scan everything", desc: "We check breach databases, Indian breach reports, and public platform presence in seconds." },
              { step: "3", title: "Get your report", desc: "See your exposure score, breach details in plain language, and a prioritized action plan." },
            ].map((s) => (
              <div key={s.step} className="card" style={{ padding: 24, textAlign: "center" }}>
                <div style={{
                  width: 28, height: 28, margin: "0 auto 12px", display: "flex", alignItems: "center", justifyContent: "center",
                  background: "var(--accent-muted)", color: "var(--accent)", borderRadius: "var(--radius-sm)",
                  fontSize: 12, fontWeight: 700,
                }}>{s.step}</div>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{s.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section style={{ padding: "20px 0 60px" }}>
        <div className="container">
          <div className="stagger" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 12 }}>
            {[
              { icon: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4", title: "Breach detection", desc: "Powered by HaveIBeenPwned and a curated Indian breach dataset covering 15+ incidents." },
              { icon: "M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2M9 7a4 4 0 1 0 0-8 4 4 0 0 0 0 8zM23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75", title: "Social footprint", desc: "Check your username across 10 major platforms. See where you are publicly findable." },
              { icon: "M22 12h-4l-3 9L9 3l-3 9H2", title: "Risk score", desc: "Deterministic 0-100 score calculated from breach severity, data types, and recency." },
              { icon: "M14 9V5a3 3 0 0 0-3-3l-4 9v11h11.28a2 2 0 0 0 2-1.7l1.38-9a2 2 0 0 0-2-2.3zM7 22H4a2 2 0 0 1-2-2v-7a2 2 0 0 1 2-2h3", title: "Plain language", desc: "Every breach explained in simple language. Know exactly what was exposed and what it means." },
              { icon: "M9 11l3 3L22 4M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11", title: "Action plan", desc: "Personalized security checklist prioritized by risk. Fix the most critical issues first." },
              { icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z", title: "Zero storage", desc: "Your email is never stored. We scan, generate your report, and immediately discard it." },
            ].map((f) => (
              <div key={f.title} className="card" style={{ padding: 24 }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: 12 }}>
                  <path d={f.icon} />
                </svg>
                <h3 style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", marginBottom: 6 }}>{f.title}</h3>
                <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          section:first-of-type { min-height: auto !important; padding: 80px 0 40px !important; }
          h1 { font-size: 28px !important; }
        }
        @media (max-width: 640px) {
          div[style*="grid-template-columns: repeat(3"] { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </main>
  );
}
