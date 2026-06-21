"use client";

import React, { useState } from "react";
import type { BreachInfo } from "@/lib/api";

interface BreachCardProps {
  breach: BreachInfo;
  index: number;
  showRegionTag?: boolean;
}

export default function BreachCard({ breach, index, showRegionTag = false }: BreachCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const severityConfig: Record<string, { label: string; className: string }> = {
    critical: { label: "Critical", className: "badge-critical" },
    high: { label: "High", className: "badge-high" },
    medium: { label: "Medium", className: "badge-medium" },
    low: { label: "Low", className: "badge-low" },
  };

  const sev = severityConfig[breach.severity] || severityConfig.medium;

  const formatCount = (count?: number): string => {
    if (!count || count === 0) return "Undisclosed";
    if (count >= 1_000_000_000) return `${(count / 1_000_000_000).toFixed(1)}B`;
    if (count >= 1_000_000) return `${(count / 1_000_000).toFixed(0)}M`;
    if (count >= 1_000) return `${(count / 1_000).toFixed(0)}K`;
    return count.toLocaleString();
  };

  return (
    <div
      className="card card-interactive"
      style={{ padding: 20, cursor: "pointer" }}
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 12, marginBottom: 12 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)" }}>{breach.title || breach.name}</h3>
          {showRegionTag && (
            <span style={{ fontSize: 11, fontWeight: 600, color: "var(--risk-high)", background: "var(--severity-high-bg)", padding: "1px 6px", borderRadius: "var(--radius-sm)" }}>
              India
            </span>
          )}
        </div>
        <div style={{ display: "flex", alignItems: "center", gap: 8, flexShrink: 0 }}>
          <span className={`badge ${sev.className}`}>{sev.label}</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)" }}>{breach.breach_date}</span>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: "flex", gap: 24, marginBottom: 12 }}>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{formatCount(breach.pwn_count)}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.3 }}>Records</div>
        </div>
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, color: "var(--text-primary)" }}>{breach.data_classes.length}</div>
          <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.3 }}>Data types</div>
        </div>
      </div>

      {/* Data classes */}
      <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
        {breach.data_classes.map((dc) => <span key={dc} className="chip">{dc}</span>)}
      </div>

      {/* Expandable explanation */}
      {breach.explanation && (
        <div style={{
          maxHeight: isExpanded ? 200 : 0, overflow: "hidden",
          transition: "max-height 0.3s ease, margin-top 0.3s ease",
          marginTop: isExpanded ? 12 : 0,
        }}>
          <div style={{ paddingTop: 12, borderTop: "1px solid var(--border)" }}>
            <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>
              {breach.explanation}
            </p>
          </div>
        </div>
      )}

      {/* Expand indicator */}
      <div style={{ display: "flex", justifyContent: "flex-end", marginTop: 8 }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="2"
          style={{ transform: isExpanded ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s ease" }}>
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </div>
    </div>
  );
}
