"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, CheckCircle2, Loader2, Wallet, ArrowDown } from "lucide-react";
import { useRouter } from "next/navigation";
import { api, ApiError } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";

export function SendForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [error, setError] = useState("");
  const [sourceWallet, setSourceWallet] = useState<any>(null);

  const [txId, setTxId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSourceWallet() {
      const userId = getUserIdFromToken();
      if (!userId) return;
      try {
        const res = await api.get<any>(`/Wallet/by-user/${userId}`);
        const wallet = Array.isArray(res) ? res[0] : res;
        setSourceWallet(wallet);
      } catch (err) {
        console.error("Failed to load wallet", err);
      }
    }
    fetchSourceWallet();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!sourceWallet) {
      setError("Source wallet not loaded. Please try again.");
      return;
    }
    
    setStatus("loading");
    setError("");
    
    try {
      // 1. Resolve alias
      const destWallet = await api.get<any>(`/Wallet/by-alias/${recipient}`);
      
      if (!destWallet || !destWallet.id) {
        throw new Error("Recipient alias not found.");
      }

      // 2. Transfer
      const tx = await api.post<any>("/Transactions/transfers", {
        sourceWalletId: sourceWallet.id,
        destinationWalletId: destWallet.id,
        amount: parseFloat(amount),
        currencyCode: "ARS"
      });

      if (tx && tx.id) {
        setTxId(tx.id);
      }

      setStatus("success");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("An error occurred during transfer");
      }
      setStatus("idle");
    }
  };

  if (status === "success") {
    return (
      <div className="w-full max-w-lg mx-auto bg-black border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center animate-fade-up shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
          <CheckCircle2 className="w-10 h-10 text-white" />
        </div>
        <h2 className="font-syne font-bold text-3xl text-white mb-2">Sent Successfully</h2>
        <p className="text-medium-zinc font-sora text-sm mb-8">
          Your transaction of <span className="text-white font-mono font-semibold">${amount || "0.00"}</span> is on the way.
        </p>
        <div className="flex flex-col gap-3 w-full">
          {txId && (
            <button
              onClick={() => router.push(`/dashboard/transactions/${txId}`)}
              className="w-full relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-4 transition-all duration-300 font-sora font-semibold text-sm hover:opacity-90"
            >
              View Receipt
            </button>
          )}
          <button
            onClick={() => router.push("/dashboard")}
            className="w-full relative overflow-hidden inline-flex items-center justify-center rounded-xl border border-white/25 hover:border-white px-6 py-4 text-white hover:bg-white/5 transition-all duration-300 font-sora font-semibold text-sm"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-up">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-medium-zinc hover:text-white font-sora text-sm font-semibold mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
      
      <div className="bg-black border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <h2 className="font-syne font-bold text-2xl text-white mb-6">Send Funds</h2>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-sora text-xs">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Asset Selection */}
          <div>
            <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Currency</label>
            <div className="flex items-center justify-between p-4 rounded-xl border border-white/10 bg-white/5 cursor-pointer hover:border-white/20 transition-colors">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Wallet className="w-4 h-4 text-white" />
                </div>
                <div>
                  <p className="font-sora font-semibold text-sm text-white">ARS (Pesos)</p>
                  <p className="font-mono text-[10px] text-medium-zinc">
                    Balance: ${sourceWallet?.balance != null ? sourceWallet.balance.toFixed(2) : "---"}
                  </p>
                </div>
              </div>
              <ArrowDown className="w-4 h-4 text-medium-zinc" />
            </div>
          </div>

          {/* Recipient */}
          <div>
            <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Recipient</label>
            <input 
              type="text" 
              required
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="Alias (e.g. malcom.wallet)"
              className="w-full bg-transparent border border-white/10 border-b-white/20 rounded-xl px-4 py-4 text-white font-mono text-sm focus:outline-none focus:border-white/40 transition-colors placeholder:text-white/20"
            />
          </div>

          {/* Amount */}
          <div>
            <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Amount</label>
            <div className="relative">
              <span className="absolute left-0 top-1/2 -translate-y-1/2 font-syne font-bold text-4xl text-white/50">$</span>
              <input 
                type="number" 
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="0.00"
                step="0.01"
                min="0.01"
                className="w-full bg-transparent border-none px-8 py-4 font-syne font-bold text-5xl text-white focus:outline-none placeholder:text-white/20"
              />
            </div>
          </div>

          {/* Network Fee */}
          <div className="pt-4 border-t border-white/5 flex items-center justify-between">
            <span className="font-sora text-xs text-medium-zinc">Network Fee (Est.)</span>
            <span className="font-mono text-xs text-white">~$0.45</span>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading" || !amount || !recipient}
            className="w-full relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-4 transition-all duration-300 font-sora font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Send Transfer"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
