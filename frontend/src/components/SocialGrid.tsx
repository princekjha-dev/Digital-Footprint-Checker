"use client";

import React from "react";
import type { PlatformResult } from "@/lib/api";

interface SocialGridProps {
  platforms: PlatformResult[];
}

export default function SocialGrid({ platforms }: SocialGridProps) {
  const statusConfig: Record<string, { label: string; color: string; icon: string }> = {
    found: { label: "Found", color: "var(--risk-safe)", icon: "M20 6L9 17l-5-5" },
    not_found: { label: "Not found", color: "var(--text-muted)", icon: "M18 6L6 18M6 6l12 12" },
    error: { label: "Unavailable", color: "var(--risk-moderate)", icon: "M12 9v4M12 17h.01" },
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: 8 }}>
      {platforms.map((platform) => {
        const status = statusConfig[platform.status] || statusConfig.error;
        return (
          <div key={platform.platform} className="card"
            style={{
              padding: "14px 16px",
              display: "flex", alignItems: "center", justifyContent: "space-between",
              borderColor: platform.status === "found" ? "var(--severity-low-border)" : undefined,
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)" }}>{platform.platform}</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={status.color} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d={status.icon} />
              </svg>
              <span style={{ fontSize: 12, fontWeight: 500, color: status.color }}>{status.label}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
