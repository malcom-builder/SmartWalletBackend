"use client";

import React, { useRef, useState } from "react";

interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Headline({ level = 1, className = "", children, ...props }: HeadlineProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000, pctX: 50, pctY: 50 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (!headlineRef.current) return;
    const rect = headlineRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pctX: ((e.clientX - rect.left) / rect.width) * 100,
      pctY: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLHeadingElement>) => {
    setIsHovered(true);
    if (!headlineRef.current) return;
    const rect = headlineRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
      pctX: ((e.clientX - rect.left) / rect.width) * 100,
      pctY: ((e.clientY - rect.top) / rect.height) * 100,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const Tag = `h${level}` as React.ElementType;

  // Base font size based on level
  const sizeClasses = {
    1: "text-[clamp(2rem,5.2vw,3.8rem)] tracking-[-0.04em] leading-[1.1] font-extrabold",
    2: "text-4xl md:text-5xl lg:text-6xl tracking-[-0.04em] font-bold",
    3: "text-3xl md:text-4xl font-bold",
    4: "text-2xl md:text-3xl font-bold",
    5: "text-xl md:text-2xl font-bold",
    6: "text-lg md:text-xl font-bold"
  };

  return (
    <Tag
      ref={headlineRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={`font-syne relative inline-block cursor-default ${sizeClasses[level]} ${className}`}
      {...props}
    >
      <span 
        className="relative z-10 block transition-all duration-500 ease-out"
        style={{
          color: "#FFFFFF",
          textShadow: isHovered 
            ? "0 0 12px rgba(255, 255, 255, 0.5), 0 0 24px rgba(255, 255, 255, 0.3)"
            : "0 0 10px rgba(255, 255, 255, 0.4), 0 0 20px rgba(255, 255, 255, 0.2)",
        }}
      >
        {children}
      </span>

      {/* Dynamic Mouse Spotlight Overlay */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 transition-opacity duration-500 ease-out z-20 block"
        style={{
          opacity: isHovered ? 1 : 0,
          color: "transparent",
          backgroundClip: "text",
          WebkitBackgroundClip: "text",
          backgroundImage: `radial-gradient(circle at ${mousePosition.pctX}% ${mousePosition.pctY}%, rgb(255,255,255) 0%, rgb(255,255,255) 10%, transparent 50%)`,
          filter: "drop-shadow(0 0 8px rgba(255,255,255,0.3)) drop-shadow(0 0 20px rgba(255,255,255,0.15))",
        }}
      >
        {children}
      </span>
    </Tag>
  );
}
