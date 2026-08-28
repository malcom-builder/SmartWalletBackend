"use client";

import React, { useRef, useState, useEffect } from "react";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
}

export function Button({ variant = "primary", className = "", children, ...props }: ButtonProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLButtonElement>) => {
    setIsHovered(true);
    if (!buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const baseStyles = "relative overflow-hidden inline-flex items-center justify-center font-sora font-semibold transition-all duration-300";
  
  const variants = {
    primary: "rounded-full border border-pure-white/25 hover:border-pure-white px-6 py-3 text-pure-white hover:bg-pure-white/5 shadow-[inset_0_0_0_rgba(255,255,255,0)] hover:shadow-[inset_0_0_20px_rgba(255,255,255,0.2)]",
    secondary: "rounded-full px-6 py-3 text-medium-zinc hover:text-pure-white"
  };

  return (
    <button
      ref={buttonRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`${baseStyles} ${variants[variant]} ${className} disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:border-pure-white/25 disabled:hover:bg-transparent disabled:hover:shadow-none`}
      {...props}
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(100px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.1), transparent 100%)`,
        }}
      />
      <span className="relative z-10">{children}</span>
    </button>
  );
}
