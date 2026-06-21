"use client";

import React from "react";

export default function Footer() {
  return (
    <footer style={{
      marginTop: 60,
      borderTop: "1px solid var(--border)",
      background: "rgba(255,255,255,0.01)",
    }}>
      <div className="container">
        {/* Top row */}
        <div style={{
          display: "grid",
          gridTemplateColumns: "1fr auto auto",
          gap: 40,
          padding: "40px 0 32px",
          alignItems: "start",
        }}>
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
              <div style={{
                width: 30, height: 30,
                background: "linear-gradient(135deg, #7c3aed, #4f46e5)",
                borderRadius: 8,
                display: "flex", alignItems: "center", justifyContent: "center",
                boxShadow: "0 0 12px rgba(124,58,237,0.35)",
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                </svg>
              </div>
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: "var(--text-primary)" }}>
                Footprint<span className="gradient-text">Check</span>
              </span>
            </div>
            <p style={{ fontSize: 12, color: "var(--text-muted)", lineHeight: 1.7, maxWidth: 280 }}>
              Privacy-first digital exposure scanner. Check your footprint in 60 seconds. Breach data sourced from{" "}
              <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer"
                style={{ color: "#a78bfa", textDecoration: "none" }}>HaveIBeenPwned</a>.
            </p>
          </div>

          {/* Links */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
              Product
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "How it works", href: "/#how-it-works" },
                { label: "Features", href: "/#features" },
                { label: "Scan free", href: "/#scan-form" },
              ].map((l) => (
                <a key={l.label} href={l.href} style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.15s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >{l.label}</a>
              ))}
            </div>
          </div>

          {/* Legal */}
          <div>
            <div style={{ fontSize: 11, fontWeight: 700, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>
              Legal
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {[
                { label: "Privacy Policy", href: "#privacy" },
                { label: "Report Misuse", href: "mailto:abuse@example.com" },
                { label: "GitHub", href: "https://github.com/princekjha-dev/Digital-Footprint-Checker", external: true },
              ].map((l) => (
                <a key={l.label} href={l.href}
                  target={l.external ? "_blank" : undefined}
                  rel={l.external ? "noopener noreferrer" : undefined}
                  style={{ fontSize: 13, color: "var(--text-muted)", textDecoration: "none", transition: "color 0.15s ease" }}
                  onMouseEnter={(e) => e.currentTarget.style.color = "var(--text-primary)"}
                  onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                >{l.label}</a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          borderTop: "1px solid var(--border)",
          padding: "16px 0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          gap: 12,
          flexWrap: "wrap",
        }}>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            © {new Date().getFullYear()} FootprintCheck. For checking your own footprint only.
          </p>
          <p style={{ fontSize: 11, color: "var(--text-muted)" }}>
            Do not use to look up others without consent.
          </p>
        </div>
      </div>

      <style>{`
        @media (max-width: 640px) {
          footer div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
            gap: 24px !important;
          }
        }
      `}</style>
    </footer>
  );
}
