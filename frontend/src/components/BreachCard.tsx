"use client";

import React, { useState } from "react";
import type { BreachInfo } from "@/lib/api";

interface BreachCardProps {
  breach: BreachInfo;
  index: number;
  showRegionTag?: boolean;
}

const SEV_CONFIG: Record<string, { label: string; cls: string; accent: string }> = {
  critical: { label: "Critical", cls: "badge-critical", accent: "#ef4444" },
  high:     { label: "High",     cls: "badge-high",     accent: "#f97316" },
  medium:   { label: "Medium",   cls: "badge-medium",   accent: "#f59e0b" },
  low:      { label: "Low",      cls: "badge-low",      accent: "#10b981" },
};

function formatCount(count?: number): string {
  if (!count || count === 0) return "Undisclosed";
  if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
  if (count >= 1_000_000)     return `${(count / 1_000_000).toFixed(0)}M`;
  if (count >= 1_000)         return `${(count / 1_000).toFixed(0)}K`;
  return count.toLocaleString();
}

export default function BreachCard({ breach, showRegionTag = false }: BreachCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  const sev = SEV_CONFIG[breach.severity] || SEV_CONFIG.medium;

  return (
    <div
      className="card card-interactive"
      onClick={() => setIsExpanded(!isExpanded)}
      style={{
        borderLeft: `3px solid ${sev.accent}`,
        padding: "20px 20px 16px",
        transition: "border-color 0.2s ease, box-shadow 0.2s ease, background 0.2s ease",
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 14 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap", minWidth: 0 }}>
          <h3 style={{
            fontSize: 15,
            fontWeight: 700,
            color: "var(--text-primary)",
            fontFamily: "'Space Grotesk', sans-serif",
            whiteSpace: "nowrap",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
            {breach.title || breach.name}
          </h3>
          {showRegionTag && (
            <span style={{
              fontSize: 10, fontWeight: 700,
              color: "#fb923c",
              background: "rgba(249,115,22,0.12)",
              border: "1px solid rgba(249,115,22,0.25)",
              padding: "2px 8px", borderRadius: 999,
              textTransform: "uppercase", letterSpacing: "0.5px",
              flexShrink: 0,
            }}>🇮🇳 India</span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span className={`badge ${sev.cls}`}>{sev.label}</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap" }}>{breach.breach_date}</span>
        </div>
      </div>

      {/* Stats row */}
      <div style={{ display: "flex", gap: 28, marginBottom: 14 }}>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: sev.accent, lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
            {formatCount(breach.pwn_count)}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>Records</div>
        </div>
        <div>
          <div style={{ fontSize: 18, fontWeight: 800, color: "var(--text-primary)", lineHeight: 1, fontFamily: "'Space Grotesk', sans-serif" }}>
            {breach.data_classes.length}
          </div>
          <div style={{ fontSize: 10, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginTop: 2 }}>Data types</div>
        </div>
      </div>

      {/* Data class chips */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
        {breach.data_classes.map((dc) => (
          <span key={dc} className="chip">{dc}</span>
        ))}
      </div>

      {/* Expandable explanation */}
      {breach.explanation && (
        <div style={{
          maxHeight: isExpanded ? 300 : 0,
          overflow: "hidden",
          transition: "max-height 0.35s ease, margin-top 0.35s ease, opacity 0.25s ease",
          marginTop: isExpanded ? 14 : 0,
          opacity: isExpanded ? 1 : 0,
        }}>
          <div style={{
            paddingTop: 14,
            borderTop: "1px solid var(--border)",
          }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.75 }}>
              {breach.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 10, alignItems: "center", gap: 4 }}>
        <span style={{ fontSize: 11, color: "var(--text-muted)" }}>{isExpanded ? "Collapse" : "Details"}</span>
        <svg
          width="13" height="13" viewBox="0 0 24 24" fill="none"
          stroke="var(--text-muted)" strokeWidth="2.5"
          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.25s ease" }}
        >
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
