"use client";

import React from "react";
import type { ActionItem } from "@/lib/api";

interface ActionPlanProps {
  actions: ActionItem[];
}

const CATEGORY_META: Record<string, { label: string; color: string; bg: string; icon: string }> = {
  password: {
    label: "Password",
    color: "#ef4444",
    bg: "rgba(239,68,68,0.1)",
    icon: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4",
  },
  "2fa": {
    label: "2-Factor Auth",
    color: "#f59e0b",
    bg: "rgba(245,158,11,0.1)",
    icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z",
  },
  privacy: {
    label: "Privacy",
    color: "#8b5cf6",
    bg: "rgba(139,92,246,0.1)",
    icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z",
  },
  monitoring: {
    label: "Monitoring",
    color: "#3b82f6",
    bg: "rgba(59,130,246,0.1)",
    icon: "M22 12h-4l-3 9L9 3l-3 9H2",
  },
};

export default function ActionPlan({ actions }: ActionPlanProps) {
  if (!actions.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 10 }} className="stagger">
      {actions.map((action, index) => {
        const cat = CATEGORY_META[action.category] || CATEGORY_META.monitoring;
        return (
          <div
            key={index}
            className="card"
            style={{
              padding: "18px 20px",
              display: "flex",
              gap: 16,
              alignItems: "flex-start",
              borderLeft: `3px solid ${cat.color}`,
            }}
          >
            {/* Priority badge */}
            <div style={{
              width: 32,
              height: 32,
              borderRadius: "50%",
              background: cat.bg,
              border: `1px solid ${cat.color}35`,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexShrink: 0,
              marginTop: 1,
            }}>
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d={cat.icon} />
              </svg>
            </div>

            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Category + priority */}
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                <span style={{
                  fontSize: 10,
                  fontWeight: 700,
                  color: cat.color,
                  background: cat.bg,
                  padding: "2px 8px",
                  borderRadius: 999,
                  textTransform: "uppercase",
                  letterSpacing: "0.6px",
                }}>
                  #{action.priority} {cat.label}
                </span>
              </div>

              {/* Action title */}
              <p style={{
                fontSize: 14,
                fontWeight: 600,
                color: "var(--text-primary)",
                lineHeight: 1.5,
                marginBottom: 5,
                fontFamily: "'Space Grotesk', sans-serif",
              }}>
                {action.action}
              </p>

              {/* Reason */}
              <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.6 }}>
                {action.reason}
              </p>
            </div>
          </div>
        );
      })}
    </div>
  );
}
