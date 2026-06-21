"use client";

import React from "react";
import type { ActionItem } from "@/lib/api";

interface ActionPlanProps {
  actions: ActionItem[];
}

const CATEGORY_META: Record<string, { label: string; color: string; icon: string }> = {
  password: { label: "Password", color: "#ef4444", icon: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4" },
  "2fa": { label: "2FA", color: "#eab308", icon: "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" },
  privacy: { label: "Privacy", color: "#8b5cf6", icon: "M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8zM12 9a3 3 0 100 6 3 3 0 000-6z" },
  monitoring: { label: "Monitoring", color: "#6366f1", icon: "M22 12h-4l-3 9L9 3l-3 9H2" },
};

export default function ActionPlan({ actions }: ActionPlanProps) {
  if (!actions.length) return null;

  return (
    <div style={{ display: "flex", flexDirection: "column", gap: 8 }} className="stagger">
      {actions.map((action, index) => {
        const cat = CATEGORY_META[action.category] || CATEGORY_META.monitoring;
        return (
          <div key={index} className="card" style={{ padding: "18px 20px", borderLeft: `3px solid ${cat.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={cat.color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d={cat.icon} />
                </svg>
                <span style={{ fontSize: 11, fontWeight: 600, color: cat.color, textTransform: "uppercase", letterSpacing: 0.5 }}>
                  #{action.priority} {cat.label}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 14, fontWeight: 600, color: "var(--text-primary)", lineHeight: 1.5, marginBottom: 4 }}>
              {action.action}
            </p>
            <p style={{ fontSize: 13, color: "var(--text-muted)", lineHeight: 1.5 }}>
              {action.reason}
            </p>
          </div>
        );
      })}
    </div>
  );
}
