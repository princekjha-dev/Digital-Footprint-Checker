"use client";

import React from "react";

export default function Footer() {
  return (
    <footer style={{
      marginTop: 60, padding: "32px 0",
      borderTop: "1px solid var(--border)",
    }}>
      <div className="container" style={{
        display: "flex", flexDirection: "column", alignItems: "center", gap: 12, textAlign: "center",
      }}>
        <p style={{ fontSize: 13, fontWeight: 600, color: "var(--text-secondary)" }}>
          Digital Footprint Checker
        </p>

        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 12 }}>
          <a href="#privacy" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Privacy</a>
          <a href="mailto:abuse@example.com" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Report Misuse</a>
          <a href="https://github.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--text-muted)", textDecoration: "none" }}>Source</a>
        </div>

        <p style={{ fontSize: 11, color: "var(--text-muted)", maxWidth: 500, lineHeight: 1.6 }}>
          Designed for checking your own digital footprint only. Do not use to look up others without consent.
          Breach data sourced from <a href="https://haveibeenpwned.com" target="_blank" rel="noopener noreferrer" style={{ color: "var(--accent)", textDecoration: "none" }}>HaveIBeenPwned</a>.
        </p>

        <p style={{ fontSize: 11, color: "var(--text-muted)", opacity: 0.6 }}>
          {new Date().getFullYear()} Digital Footprint Checker
        </p>
      </div>
    </footer>
  );
}
