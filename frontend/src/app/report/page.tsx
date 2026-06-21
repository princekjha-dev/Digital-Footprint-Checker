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
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(report),
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
      <div style={{
        display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        minHeight: "100vh", gap: 16,
      }}>
        <div style={{
          width: 48, height: 48,
          border: "2px solid rgba(124,58,237,0.2)",
          borderTopColor: "#7c3aed",
          borderRadius: "50%",
          animation: "spin 0.7s linear infinite",
        }} />
        <p style={{ color: "var(--text-muted)", fontSize: 14 }}>Loading your report...</p>
      </div>
    );
  }

  const totalBreaches = report.breach_count + report.indian_breach_count;

  return (
    <main style={{ paddingTop: 60, minHeight: "100vh" }}>

      {/* ── Sticky report header ── */}
      <div style={{
        position: "sticky",
        top: 60,
        zIndex: 50,
        background: "rgba(4,4,10,0.88)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        borderBottom: "1px solid var(--border)",
      }}>
        <div className="container">
          <div style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 16,
            padding: "12px 0",
            flexWrap: "wrap",
          }}>
            <div style={{ display: "flex", align: "center", gap: 12, alignItems: "center" }}>
              <div style={{
                width: 8, height: 8, borderRadius: "50%",
                background: totalBreaches > 0 ? "#ef4444" : "#10b981",
                boxShadow: `0 0 8px ${totalBreaches > 0 ? "#ef4444" : "#10b981"}`,
                animation: totalBreaches > 0 ? "pulse 2s ease infinite" : undefined,
              }} />
              <div>
                <span style={{ fontSize: 14, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                  Digital Footprint Report
                </span>
                <span style={{ fontSize: 12, color: "var(--text-muted)", marginLeft: 10 }}>
                  {new Date(report.scan_timestamp).toLocaleString()}
                </span>
              </div>
            </div>
            <div style={{ display: "flex", gap: 8 }}>
              <button className="btn-ghost" onClick={handleNewScan} style={{ fontSize: 13 }}>
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="15 18 9 12 15 6" />
                </svg>
                New scan
              </button>
              <button className="btn-primary" onClick={handleDownloadPdf} disabled={isDownloading} style={{ fontSize: 13, padding: "8px 16px" }}>
                {isDownloading ? (
                  <><span className="spinner" style={{ width: 13, height: 13 }} /> Generating...</>
                ) : (
                  <>
                    <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    Download PDF
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="container" style={{ paddingTop: 28, paddingBottom: 60 }}>

        {/* Demo banner */}
        {report.demo_mode && (
          <div className="animate-in" style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            padding: "12px 18px",
            marginBottom: 24,
            background: "rgba(245,158,11,0.07)",
            border: "1px solid rgba(245,158,11,0.22)",
            borderRadius: "var(--radius-md)",
            fontSize: 13,
            color: "#fcd34d",
          }}>
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
            <span style={{ fontWeight: 600 }}>Demo mode active</span>
            <span style={{ color: "var(--text-muted)" }}>— Showing sample data. Configure your HIBP API key for real results.</span>
          </div>
        )}

        {/* ── Stats row ── */}
        <div className="animate-in stagger" style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 10,
          marginBottom: 28,
        }}>
          {[
            {
              label: "Total Breaches",
              value: totalBreaches,
              color: totalBreaches > 0 ? "#ef4444" : "#10b981",
              icon: "M12 9v2m0 4h.01M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z",
            },
            {
              label: "Indian Breaches",
              value: report.indian_breach_count,
              color: report.indian_breach_count > 0 ? "#f97316" : "var(--text-muted)",
              icon: "M3 21l1.9-5.7a8.5 8.5 0 113.8 3.8z",
            },
            {
              label: "Platforms Found",
              value: report.platforms_found,
              color: report.platforms_found > 5 ? "#f59e0b" : "var(--text-primary)",
              icon: "M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8z",
            },
            {
              label: "Action Items",
              value: report.action_items.length,
              color: "#7c3aed",
              icon: "M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11",
            },
          ].map((s) => (
            <div key={s.label} className="card-stat">
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 10 }}>
                <div style={{
                  width: 34, height: 34,
                  background: `${s.color}15`,
                  borderRadius: "var(--radius-sm)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={s.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d={s.icon} />
                  </svg>
                </div>
              </div>
              <div style={{
                fontSize: 28,
                fontWeight: 900,
                color: s.color,
                lineHeight: 1,
                fontFamily: "'Space Grotesk', sans-serif",
                marginBottom: 4,
              }}>{s.value}</div>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "0.5px", fontWeight: 500 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>

        {/* ── Exposure Score ── */}
        <section className="animate-in" style={{ marginBottom: 28 }}>
          <div className="card" style={{
            padding: "36px 32px",
            textAlign: "center",
            background: "linear-gradient(135deg, rgba(124,58,237,0.06) 0%, rgba(79,70,229,0.04) 100%)",
            borderColor: "rgba(124,58,237,0.2)",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute",
              top: "50%", left: "50%",
              transform: "translate(-50%, -50%)",
              width: 400, height: 200,
              background: "radial-gradient(ellipse, rgba(124,58,237,0.08) 0%, transparent 70%)",
              pointerEvents: "none",
            }} />
            <div className="section-label" style={{ justifyContent: "center", display: "inline-flex", marginBottom: 20 }}>
              Exposure Score
            </div>
            <ExposureGauge score={report.exposure_score} />
          </div>
        </section>

        {/* ── Data Breaches ── */}
        {report.breaches.length > 0 && (
          <section className="animate-in" style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 className="section-heading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" />
                  <line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                Data Breaches
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "2px 10px",
                  background: "rgba(239,68,68,0.1)", color: "#fca5a5",
                  border: "1px solid rgba(239,68,68,0.2)", borderRadius: 999,
                }}>{report.breach_count}</span>
              </h2>
              <p className="section-desc">Your email was found in the following data breaches. Click any card to see details.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }} className="stagger">
              {report.breaches.map((breach, i) => (
                <BreachCard key={breach.name} breach={breach} index={i} />
              ))}
            </div>
          </section>
        )}

        {/* ── Indian Breaches ── */}
        {report.indian_breaches.length > 0 && (
          <section className="animate-in" style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 className="section-heading">
                <span style={{ fontSize: 16 }}>🇮🇳</span>
                Indian Breach Reports
                <span style={{
                  fontSize: 12, fontWeight: 600, padding: "2px 10px",
                  background: "rgba(249,115,22,0.1)", color: "#fdba74",
                  border: "1px solid rgba(249,115,22,0.2)", borderRadius: 999,
                }}>{report.indian_breach_count}</span>
              </h2>
              <p className="section-desc">Based on publicly reported breach information from major Indian companies and portals.</p>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }} className="stagger">
              {report.indian_breaches.map((breach, i) => (
                <BreachCard key={breach.name} breach={breach} index={i} showRegionTag />
              ))}
            </div>
          </section>
        )}

        {/* ── No breaches found ── */}
        {totalBreaches === 0 && (
          <div className="animate-in" style={{
            padding: "40px 32px",
            textAlign: "center",
            background: "rgba(16,185,129,0.05)",
            border: "1px solid rgba(16,185,129,0.2)",
            borderRadius: "var(--radius-lg)",
            marginBottom: 28,
          }}>
            <div style={{ fontSize: 32, marginBottom: 12 }}>🎉</div>
            <h3 style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 18, fontWeight: 700,
              color: "#10b981", marginBottom: 8,
            }}>No breaches found!</h3>
            <p style={{ fontSize: 14, color: "var(--text-muted)" }}>
              Your email was not found in any known data breaches. Keep it that way by following the action plan below.
            </p>
          </div>
        )}

        {/* ── Social Presence ── */}
        {report.platforms.length > 0 && (
          <section className="animate-in" style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 className="section-heading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#3b82f6" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2M9 7a4 4 0 100 8 4 4 0 000-8zM23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75" />
                </svg>
                Social Platform Presence
                {report.platforms_found > 0 && (
                  <span style={{
                    fontSize: 12, fontWeight: 600, padding: "2px 10px",
                    background: "rgba(16,185,129,0.1)", color: "#6ee7b7",
                    border: "1px solid rgba(16,185,129,0.2)", borderRadius: 999,
                  }}>{report.platforms_found} found</span>
                )}
              </h2>
              <p className="section-desc">Where your username is publicly discoverable. Only public profile URLs were checked.</p>
            </div>
            <SocialGrid platforms={report.platforms} />
          </section>
        )}

        {/* ── Action Plan ── */}
        {report.action_items.length > 0 && (
          <section className="animate-in" style={{ marginBottom: 28 }}>
            <div style={{ marginBottom: 14 }}>
              <h2 className="section-heading">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#7c3aed" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M9 11l3 3L22 4M21 12v7a2 2 0 01-2 2H5a2 2 0 01-2-2V5a2 2 0 012-2h11" />
                </svg>
                Action Plan
              </h2>
              <p className="section-desc">Prioritized security steps. Start from the top and work your way down.</p>
            </div>
            <ActionPlan actions={report.action_items} />
          </section>
        )}

        {/* ── Disclaimer ── */}
        <div style={{
          textAlign: "center",
          padding: "16px 20px",
          background: "rgba(255,255,255,0.02)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-md)",
          fontSize: 12,
          color: "var(--text-muted)",
          lineHeight: 1.7,
          marginTop: 16,
        }}>
          {report.disclaimer}
        </div>
      </div>

      <Footer />

      <style>{`
        @keyframes pulse {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(4"] { grid-template-columns: repeat(2, 1fr) !important; }
        }
        @media (max-width: 640px) {
          div[style*="position: sticky"] > div > div > div:first-child > span:last-child { display: none; }
        }
      `}</style>
    </main>
  );
}
