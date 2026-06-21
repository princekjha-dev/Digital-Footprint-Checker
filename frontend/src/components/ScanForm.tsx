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
    <form onSubmit={handleSubmit} id="scan-form">
      {/* Honeypot */}
      <div style={{ position: "absolute", left: "-9999px", opacity: 0, height: 0 }} aria-hidden="true">
        <input type="text" name="website" tabIndex={-1} autoComplete="off" value={honeypot} onChange={(e) => setHoneypot(e.target.value)} />
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 12, width: "100%", maxWidth: 480, margin: "0 auto" }}>
        {/* Email */}
        <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
          <label htmlFor="email-input" style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
            Email address
          </label>
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
          />
          {emailError && <p style={{ fontSize: 13, color: "var(--risk-critical)", marginTop: 2 }}>{emailError}</p>}
        </div>

        {/* Username toggle */}
        {!showUsername ? (
          <button
            type="button"
            onClick={() => setShowUsername(true)}
            style={{
              background: "none", border: "1px dashed var(--border)", color: "var(--text-muted)",
              padding: "8px 14px", borderRadius: "var(--radius-md)", cursor: "pointer",
              fontSize: 13, fontFamily: "inherit", textAlign: "left",
              transition: "all var(--transition)",
            }}
            onMouseEnter={(e) => { e.currentTarget.style.borderColor = "var(--border-hover)"; e.currentTarget.style.color = "var(--text-secondary)"; }}
            onMouseLeave={(e) => { e.currentTarget.style.borderColor = "var(--border)"; e.currentTarget.style.color = "var(--text-muted)"; }}
          >
            + Also check social media presence (optional)
          </button>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 4, animation: "slideUp 0.3s ease" }}>
            <label htmlFor="username-input" style={{ fontSize: 13, fontWeight: 500, color: "var(--text-secondary)" }}>
              Username <span style={{ fontWeight: 400, color: "var(--text-muted)" }}>(optional)</span>
            </label>
            <input
              type="text"
              id="username-input"
              className="input-field"
              placeholder="your_username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              disabled={isLoading}
              maxLength={30}
            />
          </div>
        )}

        {/* Submit */}
        <button type="submit" className="btn-primary" disabled={isLoading || !email.trim()} id="scan-submit"
          style={{ marginTop: 4, padding: "12px 24px", fontSize: 15 }}>
          {isLoading ? (
            <><span className="spinner" /> Scanning...</>
          ) : (
            "Scan my footprint"
          )}
        </button>

        {/* Privacy */}
        <p style={{ fontSize: 12, color: "var(--text-muted)", textAlign: "center", lineHeight: 1.5 }}>
          Your email is never stored. Data is checked and immediately discarded.
        </p>
      </div>
    </form>
  );
}
