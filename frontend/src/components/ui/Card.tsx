import React from "react";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
}

export function Card({ className = "", children, ...props }: CardProps) {
  return (
    <div
      className={`bg-surface-glass border border-fine-border rounded-xl backdrop-blur-md p-4 md:p-6 card-border-glow overflow-hidden relative ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}
