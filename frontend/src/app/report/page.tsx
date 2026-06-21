"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ExposureGauge from "@/components/ExposureGauge";
import BreachCard from "@/components/BreachCard";
import SocialGrid from "@/components/SocialGrid";
import ActionPlan from "@/components/ActionPlan";
import Footer from "@/components/Footer";
import type { ScanResponse } from "@/lib/api";

export default function ReportPage() {
  const router = useRouter();
  const [report, setReport] = useState<ScanResponse | null>(null);
  const [isDownloading, setIsDownloading] = useState(false);

  useEffect(() => {
    const stored = sessionStorage.getItem("scan_result");
    if (!stored) { router.replace("/"); return; }
    try { setReport(JSON.parse(stored)); }
    catch { router.replace("/"); }
  }, [router]);

  const handleDownloadPdf = async () => {
    if (!report) return;
    setIsDownloading(true);
    try {
      const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const response = await fetch(`${API_BASE}/api/report/pdf`, {
        method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(report),
      });
      if (!response.ok) throw new Error("PDF generation failed");
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url; a.download = "digital-footprint-report.pdf";
      document.body.appendChild(a); a.click(); document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch { alert("PDF generation requires WeasyPrint. See README for setup."); }
    finally { setIsDownloading(false); }
  };

  const handleNewScan = () => { sessionStorage.removeItem("scan_result"); router.push("/"); };

  if (!report) {
    return (
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", minHeight: "100vh", gap: 12 }}>
        <div className="spinner" style={{ width: 24, height: 24 }} />
        <p style={{ color: "var(--text-muted)", fontSize: 13 }}>Loading report...</p>
      </div>
    );
  }

  const totalBreaches = report.breach_count + report.indian_breach_count;

  return (
    <main style={{ paddingTop: 40, minHeight: "100vh" }}>
      <div className="container">

        {/* Header */}
        <header className="animate-in" style={{
          display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 16,
          marginBottom: 24, paddingBottom: 24, borderBottom: "1px solid var(--border)",
        }}>
          <div>
            <h1 style={{ fontSize: 22, fontWeight: 700, color: "var(--text-primary)" }}>Digital Footprint Report</h1>
            <p style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 4 }}>
              Generated on {new Date(report.scan_timestamp).toLocaleString()}
            </p>
          </div>
          <div style={{ display: "flex", gap: 8, flexShrink: 0 }}>
            <button className="btn-secondary" onClick={handleNewScan} style={{ fontSize: 13, padding: "8px 14px" }}>New scan</button>
            <button className="btn-primary" onClick={handleDownloadPdf} disabled={isDownloading} style={{ fontSize: 13, padding: "8px 14px" }}>
              {isDownloading ? <><span className="spinner" /> Generating...</> : "Download PDF"}
            </button>
          </div>
        </header>

        {/* Demo banner */}
        {report.demo_mode && (
          <div className="animate-in" style={{
            display: "flex", alignItems: "center", gap: 8, padding: "10px 16px", marginBottom: 20,
            background: "var(--severity-medium-bg)", border: "1px solid var(--severity-medium-border)",
            borderRadius: "var(--radius-md)", fontSize: 13, color: "var(--severity-medium-text)",
          }}>
            <span style={{ fontWeight: 600 }}>Demo mode</span>
            <span style={{ color: "var(--text-muted)" }}>-- Showing sample data. Configure your HIBP API key for real results.</span>
          </div>
        )}

        {/* Stats */}
        <div className="animate-in" style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 8, marginBottom: 28 }}>
          {[
            { label: "Breaches found", value: totalBreaches, color: totalBreaches > 0 ? "var(--risk-critical)" : "var(--risk-safe)" },
            { label: "Indian breaches", value: report.indian_breach_count, color: "var(--risk-high)" },
            { label: "Platforms found", value: report.platforms_found, color: "var(--text-primary)" },
            { label: "Action items", value: report.action_items.length, color: "var(--text-primary)" },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: "16px 20px", textAlign: "center" }}>
              <div style={{ fontSize: 26, fontWeight: 800, color: s.color }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4, marginTop: 2 }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Exposure Score */}
        <section className="animate-in" style={{ marginBottom: 32 }}>
          <div className="card" style={{ padding: 32, textAlign: "center" }}>
            <h2 className="section-heading" style={{ justifyContent: "center", marginBottom: 20 }}>Exposure Score</h2>
            <ExposureGauge score={report.exposure_score} />
          </div>
        </section>

        {/* Data Breaches */}
        {report.breaches.length > 0 && (
          <section className="animate-in" style={{ marginBottom: 32 }}>
            <h2 className="section-heading">Data Breaches ({report.breach_count})</h2>
            <p className="section-desc">Your email was found in the following known data breaches. Click a card to see the explanation.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }} className="stagger">
              {report.breaches.map((breach, i) => <BreachCard key={breach.name} breach={breach} index={i} />)}
            </div>
          </section>
        )}

        {/* Indian Breaches */}
        {report.indian_breaches.length > 0 && (
          <section className="animate-in" style={{ marginBottom: 32 }}>
            <h2 className="section-heading">Indian Breach Reports ({report.indian_breach_count})</h2>
            <p className="section-desc">Based on publicly reported breach information from major Indian companies and government portals.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 8, marginTop: 12 }} className="stagger">
              {report.indian_breaches.map((breach, i) => <BreachCard key={breach.name} breach={breach} index={i} showRegionTag />)}
            </div>
          </section>
        )}

        {/* Social Presence */}
        {report.platforms.length > 0 && (
          <section className="animate-in" style={{ marginBottom: 32 }}>
            <h2 className="section-heading">Social Platform Presence</h2>
            <p className="section-desc">Where the username is publicly findable. Only public URLs were checked.</p>
            <div style={{ marginTop: 12 }}>
              <SocialGrid platforms={report.platforms} />
            </div>
          </section>
        )}

        {/* Action Plan */}
        {report.action_items.length > 0 && (
          <section className="animate-in" style={{ marginBottom: 32 }}>
            <h2 className="section-heading">Action Plan</h2>
            <p className="section-desc">Prioritized security steps. Start from the top.</p>
            <div style={{ marginTop: 12 }}>
              <ActionPlan actions={report.action_items} />
            </div>
          </section>
        )}

        {/* Disclaimer */}
        <div style={{
          textAlign: "center", padding: 16, background: "var(--bg-secondary)",
          borderRadius: "var(--radius-md)", fontSize: 12, color: "var(--text-muted)", marginTop: 16,
        }}>
          {report.disclaimer}
        </div>
      </div>

      <Footer />

      <style jsx>{`
        @media (max-width: 768px) {
          header { flex-direction: column !important; }
          header > div:last-child { width: 100%; display: flex; }
          header > div:last-child button { flex: 1; }
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
      `}</style>
    </main>
  );
}
