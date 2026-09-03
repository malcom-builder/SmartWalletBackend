"use client";

import React, { useRef, useState, useEffect } from "react";
import { ArrowUpRight, Loader2 } from "lucide-react";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";

export function BalanceCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: -1000, y: -1000 });
  const [isHovered, setIsHovered] = useState(false);
  const [balance, setBalance] = useState<number | null>(null);

  useEffect(() => {
    async function loadWallet() {
      const userId = getUserIdFromToken();
      if (!userId) return;
      try {
        const res = await api.get<any>(`/Wallet/by-user/${userId}`);
        const wallet = Array.isArray(res) ? res[0] : res;
        
        if (wallet && typeof wallet.balance !== "undefined") {
          setBalance(wallet.balance);
        } else {
          // Mock balance if not returned
          setBalance(124590);
        }
      } catch {
        setBalance(124590); // Mock on error
      }
    }
    loadWallet();
  }, []);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseEnter = (e: React.MouseEvent<HTMLDivElement>) => {
    setIsHovered(true);
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    setMousePosition({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const [intPart, decPart] = balance !== null ? balance.toFixed(2).split('.') : ['---', '--'];

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="relative w-full h-full flex flex-col justify-center overflow-hidden rounded-2xl bg-[#0a0a0a] border border-white/10 p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] transition-all duration-300 hover:border-white/30 hover:shadow-[0_24px_48px_rgba(0,0,0,0.5),0_0_32px_rgba(255,255,255,0.04),inset_0_1px_0_rgba(255,255,255,0.1)]"
    >
      {/* Spotlight overlay */}
      <div
        className="pointer-events-none absolute inset-0 transition-opacity duration-300"
        style={{
          opacity: isHovered ? 1 : 0,
          background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255, 255, 255, 0.04), transparent 100%)`,
        }}
      />
      
      <div className="relative z-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <p className="text-medium-zinc font-semibold text-xs tracking-wider uppercase mb-2">Total Balance</p>
          <div className="flex items-baseline gap-2">
            <span className="font-syne font-bold text-5xl tracking-tight text-white">${intPart}</span>
            <span className="font-mono text-medium-zinc text-lg">.{decPart}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10 text-white font-mono text-xs font-semibold">
          <ArrowUpRight className="w-3.5 h-3.5" />
          +2.4%
        </div>
      </div>
    </div>
  );
}
