"use client";

import React from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const isPrimary = variant === "primary";

  return (
    <>
      <style>{`
        .hero-btn {
          position: relative;
          z-index: 1;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 8px;
          border: 1px solid rgba(255,255,255,0.25);
          background: transparent;
          font-family: var(--font-sora), sans-serif;
          color: #FFFFFF;
          letter-spacing: 0.01em;
          transition: border-color 0.25s ease, background 0.25s ease, box-shadow 0.25s ease, color 0.25s ease, transform 0.15s ease;
          cursor: pointer;
          white-space: nowrap;
        }
        .hero-btn::before {
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
        .hero-btn:hover::before {
          opacity: 1 !important;
        }
        .hero-btn:hover {
          border-color: rgba(255, 255, 255, 0.6) !important;
          background: rgba(255, 255, 255, 0.08) !important;
          box-shadow: 0 0 16px rgba(255, 255, 255, 0.25), 0 0 32px rgba(255, 255, 255, 0.08), inset 0 0 12px rgba(255, 255, 255, 0.06) !important;
          color: #FFFFFF !important;
          transform: scale(1.02) !important;
        }
        .hero-btn:active {
          transform: scale(0.98) !important;
          box-shadow: inset 0 2px 8px rgba(255, 255, 255, 0.25) !important;
        }
        .hero-btn.secondary {
          border-color: transparent;
          color: var(--medium-zinc);
        }
        .hero-btn.secondary:hover {
          border-color: rgba(255, 255, 255, 0.2) !important;
          color: #FFFFFF !important;
          box-shadow: none !important;
        }
        .hero-btn.secondary:hover::before {
          opacity: 0 !important;
        }
      `}</style>
      <button
        className={`hero-btn font-medium ${isPrimary ? 'primary' : 'secondary'} ${className} disabled:opacity-40 disabled:cursor-not-allowed`}
        {...props}
      >
        {children}
      </button>
    </>
  );
}
