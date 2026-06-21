"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <nav className={`navbar${scrolled ? " scrolled" : ""}`}>
      <div className="container navbar-inner">
        {/* Logo */}
        <Link href="/" className="navbar-logo">
          <div className="navbar-logo-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
            </svg>
          </div>
          <span className="navbar-logo-text">Footprint<span className="gradient-text">Check</span></span>
        </Link>

        {/* Nav links */}
        <div className="navbar-nav">
          <a href="/#how-it-works" className="navbar-link">How it works</a>
          <a href="/#features" className="navbar-link">Features</a>
          <a
            href="/#scan-form"
            className="navbar-cta"
          >
            Scan free →
          </a>
        </div>
      </div>
    </nav>
  );
}
