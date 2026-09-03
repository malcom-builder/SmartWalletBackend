"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import * as React from "react";
import { Button } from "@/components/ui/Button";

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
          position: fixed;
          width: 100%;
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
              <Link href="/auth/login" style={{ textDecoration: "none" }} className="hidden sm:block">
                <Button variant="secondary" className="px-4 py-1.5 text-xs md:text-sm">
                  Log in
                </Button>
              </Link>
              <Link href="/auth/register" style={{ textDecoration: "none" }}>
                <Button variant="primary" className="px-4 py-1.5 text-xs md:text-sm">
                  Create account
                </Button>
              </Link>
            </div>
          </nav>
        </div>
      </header>
    </>
  );
}
