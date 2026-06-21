"use client";

import React, { useEffect, useState } from "react";
import type { ExposureScore } from "@/lib/api";

interface ExposureGaugeProps {
  score: ExposureScore;
  animate?: boolean;
}

export default function ExposureGauge({ score, animate = true }: ExposureGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score.score);

  useEffect(() => {
    if (!animate) { setDisplayScore(score.score); return; }
    let frame: number;
    const duration = 1200;
    const start = performance.now();
    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplayScore(Math.round(eased * score.score));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [score.score, animate]);

  const size = 180;
  const strokeWidth = 10;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - displayScore / 100);

  const colorMap: Record<string, string> = {
    green: "var(--risk-safe)",
    yellow: "var(--risk-moderate)",
    orange: "var(--risk-high)",
    red: "var(--risk-critical)",
  };
  const color = colorMap[score.risk_level] || "var(--risk-safe)";

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 20 }}>
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
          <circle cx={size/2} cy={size/2} r={radius} fill="none" stroke="var(--border)" strokeWidth={strokeWidth} />
          <circle
            cx={size/2} cy={size/2} r={radius} fill="none"
            stroke={color} strokeWidth={strokeWidth} strokeLinecap="round"
            strokeDasharray={circumference} strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${size/2} ${size/2})`}
            style={{ transition: "stroke-dashoffset 0.1s ease-out" }}
          />
        </svg>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
          <span style={{ fontSize: 42, fontWeight: 800, color, lineHeight: 1, letterSpacing: -1 }}>{displayScore}</span>
          <span style={{ fontSize: 12, color: "var(--text-muted)", marginTop: 2 }}>out of 100</span>
          <span style={{ fontSize: 12, fontWeight: 600, color, marginTop: 4, textTransform: "uppercase", letterSpacing: 0.5 }}>{score.risk_label}</span>
        </div>
      </div>

      {score.breakdown && Object.keys(score.breakdown).length > 0 && (
        <div style={{ display: "flex", gap: 20, flexWrap: "wrap", justifyContent: "center" }}>
          {Object.entries(score.breakdown).map(([key, value]) => (
            <div key={key} style={{ textAlign: "center" }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.4 }}>
                {key.replace(/_/g, " ")}
              </div>
              <div style={{ fontSize: 15, fontWeight: 600, color: "var(--text-primary)", marginTop: 2 }}>{value}</div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
