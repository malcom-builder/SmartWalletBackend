"use client";

import React, { useRef, useState } from "react";

interface HeadlineProps extends React.HTMLAttributes<HTMLHeadingElement> {
  children: React.ReactNode;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
}

export function Headline({ level = 1, className = "", children, ...props }: HeadlineProps) {
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = (e: React.MouseEvent<HTMLHeadingElement>) => {
    if (!headlineRef.current) return;
    const rect = headlineRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLHeadingElement>) => {
    setIsHovered(true);
    if (!headlineRef.current) return;
    const rect = headlineRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
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
      className={`font-syne relative inline-block text-glow ${sizeClasses[level]} ${className}`}
      {...props}
    >
      {/* Spotlight layer over text */}
      <span
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          backgroundImage: `radial-gradient(140px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,1), transparent 100%)`,
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          backgroundClip: "text",
          color: "transparent",
        }}
        aria-hidden="true"
      >
        {children}
      </span>
      {/* Base text layer */}
      <span className="relative z-[-1]">{children}</span>
    </Tag>
  );
}
