"use client";

import React, { useState } from "react";

interface ScanFormProps {
  onSubmit: (email: string, username?: string) => void;
  isLoading: boolean;
}

export default function ScanForm({ onSubmit, isLoading }: ScanFormProps) {
  const [email, setEmail] = useState("");
  const [username, setUsername] = useState("");
  const [showUsername, setShowUsername] = useState(false);
  const [honeypot, setHoneypot] = useState("");
  const [emailError, setEmailError] = useState("");

  const validateEmail = (value: string): boolean => {
    if (!value.trim()) { setEmailError("Email address is required"); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) { setEmailError("Enter a valid email address"); return false; }
    setEmailError("");
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (honeypot) return;
    if (!validateEmail(email)) return;
    onSubmit(email.trim().toLowerCase(), username.trim() || undefined);
  };

  return (
    <form onSubmit={handleSubmit} id="scan-form" style={{ width: "100%" }}>
      {/* Honeypot */}
      <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      {/* Glass card wrapper */}
      <div style={{
        background: "rgba(255,255,255,0.03)",
        border: "1px solid rgba(255,255,255,0.08)",
        borderRadius: "var(--radius-xl)",
        padding: "28px",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        maxWidth: 480,
        margin: "0 auto",
        boxShadow: "0 8px 40px rgba(0,0,0,0.3), 0 0 0 1px rgba(124,58,237,0.08) inset",
      }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 14 }}>

          {/* Email field */}
          <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
            <label htmlFor="email-input" style={{
              fontSize: 12,
              fontWeight: 600,
              color: "var(--text-secondary)",
              textTransform: "uppercase",
              letterSpacing: "0.6px",
            }}>
              Email address
            </label>
            <div style={{ position: "relative" }}>
              <div style={{
                position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                pointerEvents: "none",
              }}>
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="var(--text-muted)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <input
                type="email"
                id="email-input"
                className="input-field"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => { setEmail(e.target.value); if (emailError) validateEmail(e.target.value); }}
                required
                autoComplete="email"
                disabled={isLoading}
                style={{ paddingLeft: "40px" }}
              />
            </div>
            {emailError && (
              <p style={{ fontSize: 12, color: "var(--risk-critical)", marginTop: -2 }}>
                ⚠ {emailError}
              </p>
            )}
          </div>

          {/* Username toggle */}
          {!showUsername ? (
            <button
              type="button"
              onClick={() => setShowUsername(true)}
              style={{
                background: "transparent",
                border: "1px dashed rgba(255,255,255,0.1)",
                color: "var(--text-muted)",
                padding: "10px 16px",
                borderRadius: "var(--radius-md)",
                cursor: "pointer",
                fontSize: 13,
                fontFamily: "inherit",
                textAlign: "center",
                transition: "all 0.2s ease",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = "rgba(124,58,237,0.4)";
                e.currentTarget.style.color = "var(--text-secondary)";
                e.currentTarget.style.background = "rgba(124,58,237,0.04)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
                e.currentTarget.style.color = "var(--text-muted)";
                e.currentTarget.style.background = "transparent";
              }}
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
              </svg>
              Check social media presence (optional)
            </button>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6, animation: "slideUp 0.3s ease" }}>
              <label htmlFor="username-input" style={{
                fontSize: 12, fontWeight: 600, color: "var(--text-secondary)",
                textTransform: "uppercase", letterSpacing: "0.6px",
              }}>
                Username <span style={{ fontWeight: 400, color: "var(--text-muted)", textTransform: "none", letterSpacing: 0 }}>(optional)</span>
              </label>
              <div style={{ position: "relative" }}>
                <div style={{
                  position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)",
                  fontSize: 14, color: "var(--text-muted)", pointerEvents: "none", fontWeight: 500,
                }}>@</div>
                <input
                  type="text"
                  id="username-input"
                  className="input-field"
                  placeholder="your_username"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  disabled={isLoading}
                  maxLength={30}
                  style={{ paddingLeft: "30px" }}
                />
              </div>
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            className="btn-primary"
            disabled={isLoading || !email.trim()}
            id="scan-submit"
            style={{ marginTop: 4, padding: "13px 24px", fontSize: 15, width: "100%" }}
          >
            {isLoading ? (
              <><span className="spinner" /> Scanning your footprint...</>
            ) : (
              <>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="11" cy="11" r="8" /><line x1="21" y1="21" x2="16.65" y2="16.65" />
                </svg>
                Scan my footprint
              </>
            )}
          </button>

          {/* Privacy note */}
          <p style={{ fontSize: 11, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.6 }}>
            🔒 Your email is never stored. Data is scanned and immediately discarded.
          </p>
        </div>
      </div>
    </form>
  );
}
