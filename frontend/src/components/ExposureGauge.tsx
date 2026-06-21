"use client";

import React, { useEffect, useState } from "react";
import type { ExposureScore } from "@/lib/api";

interface ExposureGaugeProps {
  score: ExposureScore;
  animate?: boolean;
}

const RISK_COLORS: Record<string, string> = {
  green:  "#10b981",
  yellow: "#f59e0b",
  orange: "#f97316",
  red:    "#ef4444",
};

const RISK_GRADIENTS: Record<string, [string, string]> = {
  green:  ["#10b981", "#34d399"],
  yellow: ["#f59e0b", "#fcd34d"],
  orange: ["#f97316", "#fb923c"],
  red:    ["#ef4444", "#f87171"],
};

export default function ExposureGauge({ score, animate = true }: ExposureGaugeProps) {
  const [displayScore, setDisplayScore] = useState(animate ? 0 : score.score);

  useEffect(() => {
    if (!animate) { setDisplayScore(score.score); return; }
    let frame: number;
    const duration = 1400;
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

  const size = 200;
  const strokeWidth = 12;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference * (1 - displayScore / 100);
  const color = RISK_COLORS[score.risk_level] || RISK_COLORS.green;
  const [gradStart, gradEnd] = RISK_GRADIENTS[score.risk_level] || RISK_GRADIENTS.green;
  const gradientId = `gauge-gradient-${score.risk_level}`;

  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 24 }}>
      {/* Ring */}
      <div style={{ position: "relative", width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ overflow: "visible" }}>
          <defs>
            <linearGradient id={gradientId} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradStart} />
              <stop offset="100%" stopColor={gradEnd} />
            </linearGradient>
            <filter id="gauge-glow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Track */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth={strokeWidth}
          />
          {/* Glow ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth + 4}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.08s ease-out", opacity: 0.15 }}
          />
          {/* Main ring */}
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={`url(#${gradientId})`}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            transform={`rotate(-90 ${size / 2} ${size / 2})`}
            style={{ transition: "stroke-dashoffset 0.08s ease-out" }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: "absolute", inset: 0,
          display: "flex", flexDirection: "column",
          alignItems: "center", justifyContent: "center",
          gap: 2,
        }}>
          <span style={{
            fontSize: 48,
            fontWeight: 900,
            color,
            lineHeight: 1,
            letterSpacing: "-2px",
            fontFamily: "'Space Grotesk', sans-serif",
          }}>
            {displayScore}
          </span>
          <span style={{ fontSize: 11, color: "var(--text-muted)", fontWeight: 500 }}>out of 100</span>
          <span style={{
            fontSize: 12,
            fontWeight: 700,
            color,
            marginTop: 4,
            textTransform: "uppercase",
            letterSpacing: "1px",
            padding: "3px 10px",
            background: `${color}18`,
            borderRadius: 999,
            border: `1px solid ${color}35`,
          }}>
            {score.risk_label}
          </span>
        </div>
      </div>

      {/* Score breakdown */}
      {score.breakdown && Object.keys(score.breakdown).length > 0 && (
        <div style={{
          display: "flex",
          gap: 0,
          background: "rgba(255,255,255,0.03)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius-lg)",
          overflow: "hidden",
          width: "100%",
          maxWidth: 360,
        }}>
          {Object.entries(score.breakdown).map(([key, value], i, arr) => (
            <div key={key} style={{
              flex: 1,
              textAlign: "center",
              padding: "14px 8px",
              borderRight: i < arr.length - 1 ? "1px solid var(--border)" : "none",
            }}>
              <div style={{ fontSize: 11, color: "var(--text-muted)", textTransform: "uppercase", letterSpacing: 0.5, marginBottom: 4 }}>
                {key.replace(/_/g, " ")}
              </div>
              <div style={{ fontSize: 17, fontWeight: 700, color: "var(--text-primary)", fontFamily: "'Space Grotesk', sans-serif" }}>
                {value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
