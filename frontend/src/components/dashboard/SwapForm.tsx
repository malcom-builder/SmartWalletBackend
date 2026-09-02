"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDownUp, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export function SwapForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFromAmount(val);
    if (val && !isNaN(Number(val))) {
      setToAmount((Number(val) * 1250.00).toFixed(2));
    } else {
      setToAmount("");
    }
  };

  const handleSwap = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setTimeout(() => {
      setStatus("success");
    }, 2000);
  };

  if (status === "success") {
    return (
      <div className="w-full max-w-lg mx-auto bg-black border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center animate-fade-up shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
          <ArrowDownUp className="w-10 h-10 text-white" />
        </div>
        <h2 className="font-syne font-bold text-3xl text-white mb-2">Swap Complete</h2>
        <p className="text-medium-zinc font-sora text-sm mb-8">
          You successfully swapped {fromAmount} USD to {toAmount} ARS.
        </p>
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full relative overflow-hidden inline-flex items-center justify-center rounded-xl border border-white/25 hover:border-white px-6 py-4 text-white hover:bg-white/5 transition-all duration-300 font-sora font-semibold text-sm"
        >
          Return to Dashboard
        </button>
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
        <h2 className="font-syne font-bold text-2xl text-white mb-8">Swap Assets</h2>
        
        <form onSubmit={handleSwap} className="space-y-2">
          {/* Pay */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-colors focus-within:border-white/30">
            <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">You Pay</label>
            <div className="flex items-center justify-between">
              <input 
                type="number"
                required
                value={fromAmount}
                onChange={handleFromChange}
                placeholder="0.00"
                className="w-2/3 bg-transparent border-none font-syne font-bold text-3xl text-white focus:outline-none placeholder:text-white/20"
              />
              <div className="bg-black border border-white/10 rounded-lg px-3 py-1.5 font-sora font-semibold text-sm text-white">
                USD
              </div>
            </div>
            <p className="font-mono text-[10px] text-medium-zinc mt-2">Balance: 1,200.00 USD</p>
          </div>

          {/* Separator / Swap Icon */}
          <div className="flex justify-center -my-3 relative z-10">
            <div className="bg-black border border-white/10 p-2 rounded-full cursor-pointer hover:border-white/30 transition-colors">
              <ArrowDownUp className="w-4 h-4 text-white" />
            </div>
          </div>

          {/* Receive */}
          <div className="bg-white/5 border border-white/10 rounded-xl p-4 transition-colors">
            <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">You Receive</label>
            <div className="flex items-center justify-between">
              <input 
                type="number"
                readOnly
                value={toAmount}
                placeholder="0.00"
                className="w-2/3 bg-transparent border-none font-syne font-bold text-3xl text-medium-zinc focus:outline-none placeholder:text-white/20"
              />
              <div className="bg-black border border-white/10 rounded-lg px-3 py-1.5 font-sora font-semibold text-sm text-white">
                ARS
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="py-4 space-y-2">
            <div className="flex justify-between font-mono text-[11px] text-medium-zinc">
              <span>Exchange Rate</span>
              <span className="text-white">1 USD = 1,250.00 ARS</span>
            </div>
            <div className="flex justify-between font-mono text-[11px] text-medium-zinc">
              <span>Fee</span>
              <span className="text-white">~$0.00</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading" || !fromAmount}
            className="w-full relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-4 transition-all duration-300 font-sora font-bold text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : (
              "Review Swap"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
