"use client";

import Link from "next/link";
import { Send, Download, RefreshCcw, Plus } from "lucide-react";

const ACTIONS = [
  { label: "Send", icon: Send, href: "/dashboard/send" },
  { label: "Receive", icon: Download, href: "/dashboard/receive" },
  { label: "Swap", icon: RefreshCcw, href: "/dashboard/swap" },
];

import { useState } from "react";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";

export function QuickActions() {
  const [loading, setLoading] = useState(false);

  const handleTopUp = async () => {
    setLoading(true);
    try {
      const userId = getUserIdFromToken();
      if (!userId) return;
      const res = await api.get<any>(`/Wallet/by-user/${userId}`);
      const wallet = Array.isArray(res) ? res[0] : res;
      
      const tx = await api.post<any>("/Transactions/deposits", {
        walletId: wallet.id,
        amount: 100000,
        currencyCode: "ARS"
      });

      if (tx && tx.id) {
        window.location.href = `/dashboard/transactions/${tx.id}`;
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error(err);
      alert("Error adding funds");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {ACTIONS.map((action) => (
        <Link
          key={action.label}
          href={action.href}
          style={{ textDecoration: "none" }}
          className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:bg-[#1a1a1a] hover:border-white/30 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] active:scale-[0.98]"
        >
          <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#222] group-hover:border-white/30 transition-all duration-300">
            <action.icon className="w-4 h-4 text-white" />
          </div>
          <span className="font-sora font-semibold text-xs text-white/90 group-hover:text-white">{action.label}</span>
        </Link>
      ))}

      <button
        onClick={handleTopUp}
        disabled={loading}
        className="group relative overflow-hidden flex flex-col items-center justify-center gap-3 p-6 rounded-2xl bg-[#0a0a0a] border border-white/10 hover:bg-[#1a1a1a] hover:border-white/30 transition-all duration-300 shadow-[0_4px_12px_rgba(0,0,0,0.15),inset_0_1px_0_rgba(255,255,255,0.05)] active:scale-[0.98] disabled:opacity-50"
      >
        <div className="w-10 h-10 rounded-full bg-[#111] border border-white/10 flex items-center justify-center group-hover:scale-110 group-hover:bg-[#222] group-hover:border-white/30 transition-all duration-300">
          <Plus className="w-4 h-4 text-white" />
        </div>
        <span className="font-sora font-semibold text-xs text-white/90 group-hover:text-white">
          {loading ? "Adding..." : "Add $100k"}
        </span>
      </button>
    </div>
  );
}
