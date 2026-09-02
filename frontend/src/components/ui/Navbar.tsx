"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";

export function Navbar() {
  const [scrolled, setScrolled] = React.useState(false);
  const pathname = usePathname();
  const isDashboard = pathname?.startsWith("/dashboard");

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 16);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <style>{`
        .navbar {
          position: sticky;
          top: 0;
          z-index: 100;
          background: transparent;
          border-bottom: 1px solid transparent;
          transition: background-color 0.3s, border-color 0.3s, box-shadow 0.3s;
        }
        .navbar.scrolled {
          border-bottom: 1px solid rgba(255, 255, 255, 0.08);
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5), 0 1px 0px rgba(255, 255, 255, 0.08);
          background: #000000;
          backdrop-filter: blur(16px);
          -webkit-backdrop-filter: blur(16px);
        }
        .navbar-cta {
          position: relative;
          z-index: 1;
        }
        .navbar-cta::before {
          content: "";
          position: absolute;
          inset: -2px;
          background: rgba(255, 255, 255, 0.35);
          filter: blur(16px);
          border-radius: 8px;
          opacity: 0;
          transition: opacity 0.3s ease;
          z-index: -1;
          pointer-events: none;
        }
        .navbar-cta:hover::before {
          opacity: 1 !important;
        }
        .navbar-cta:hover {
          border-color: rgba(255, 255, 255, 0.6) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.25), 0 0 32px rgba(255, 255, 255, 0.08), inset 0 0 12px rgba(255, 255, 255, 0.06) !important;
          color: #FFFFFF !important;
          transform: scale(1.02) !important;
        }
        .navbar-cta:active {
          transform: scale(0.98) !important;
          box-shadow: inset 0 2px 8px rgba(255, 255, 255, 0.25) !important;
        }
      `}</style>
      <header className={`navbar ${scrolled ? "scrolled" : ""} print:hidden`}>
        <div className="container mx-auto">
          <nav
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              height: "3.75rem",
            }}
            aria-label="Main navigation"
          >
            {/* Logo */}
            <div className="flex items-center gap-8">
              <Link
                href="/"
                className="flex items-center hover:opacity-80 transition-opacity select-none"
                style={{ textDecoration: "none" }}
                aria-label="SMARTWALLET"
              >
                <span style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 700, fontSize: "0.875rem", letterSpacing: "0.05em", color: "#FFFFFF" }}>
                  SMARTWALLET
                </span>
              </Link>
            </div>

            {/* Controls */}
            <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <Link href="/auth/login" style={{ textDecoration: "none" }}>
                <span
                  className="navbar-cta"
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "0.45rem 1.25rem",
                    borderRadius: "8px",
                    border: "1px solid rgba(255,255,255,0.25)",
                    background: "transparent",
                    fontFamily: "var(--font-sora), var(--font-body), sans-serif",
                    fontSize: "0.875rem",
                    fontWeight: 500,
                    color: "#FFFFFF",
                    letterSpacing: "0.01em",
                    transition:
                      "border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, transform 0.15s ease",
                    cursor: "pointer",
                    whiteSpace: "nowrap",
                  }}
                >
                  Open App
                </span>
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
