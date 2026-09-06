"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowDownUp, Loader2, Check } from "lucide-react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";

export function SwapForm() {
  const router = useRouter();
  const [status, setStatus] = useState<"idle" | "loading" | "success">("idle");
  const [fromAmount, setFromAmount] = useState("");
  const [toAmount, setToAmount] = useState("");
  
  const [rates, setRates] = useState<{ compra: number; venta: number } | null>(null);
  const [wallet, setWallet] = useState<any>(null);
  const [isBuyUsd, setIsBuyUsd] = useState(true); // true = ARS -> USD, false = USD -> ARS

  useEffect(() => {
    async function loadData() {
      try {
        // Fetch real-time crypto dollar rates
        const rateRes = await api.get<any>("/Dolares/cripto");
        if (rateRes) {
          setRates({ compra: rateRes.compra, venta: rateRes.venta });
        }

        // Fetch wallet balance
        const userId = getUserIdFromToken();
        if (userId) {
          const res = await api.get<any>(`/Wallet/by-user/${userId}`);
          const w = Array.isArray(res) ? res[0] : res;
          if (w) setWallet(w);
        }
      } catch (err) {
        console.error("Failed to load swap data", err);
      }
    }
    loadData();
  }, []);

  const [completedTxId, setCompletedTxId] = useState<string | null>(null);

  const exchangeRate = isBuyUsd ? rates?.venta : rates?.compra;

  const handleFromChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setFromAmount(val);
    
    if (val && !isNaN(Number(val)) && exchangeRate) {
      if (isBuyUsd) {
        // ARS -> USD (divide by exchange rate)
        setToAmount((Number(val) / exchangeRate).toFixed(2));
      } else {
        // USD -> ARS (multiply by exchange rate)
        setToAmount((Number(val) * exchangeRate).toFixed(2));
      }
    } else {
      setToAmount("");
    }
  };

  const handleToChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    setToAmount(val);
    
    if (val && !isNaN(Number(val)) && exchangeRate) {
      if (isBuyUsd) {
        // If I want X USD, I need X * rate ARS
        setFromAmount((Number(val) * exchangeRate).toFixed(2));
      } else {
        // If I want X ARS, I need X / rate USD
        setFromAmount((Number(val) / exchangeRate).toFixed(2));
      }
    } else {
      setFromAmount("");
    }
  };

  const handleToggleDirection = () => {
    setIsBuyUsd(!isBuyUsd);
    setFromAmount("");
    setToAmount("");
  };
  const handleSwap = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!wallet || !exchangeRate) return;
    
    setStatus("loading");

    try {
      let txId = "";
      if (isBuyUsd) {
        // Mock swap logic: Withdraw ARS
        const res = await api.post<any>("/Transactions/withdrawals", {
          walletId: wallet.id,
          amount: Number(fromAmount),
          currencyCode: "ARS"
        });
        txId = res.id;
      } else {
        // Mock swap logic: Deposit ARS
        const res = await api.post<any>("/Transactions/deposits", {
          walletId: wallet.id,
          amount: Number(toAmount),
          currencyCode: "ARS"
        });
        txId = res.id;
      }

      if (txId) {
        setCompletedTxId(txId);
        // Store metadata in local storage to enrich the receipt view
        localStorage.setItem(`swapTx_${txId}`, JSON.stringify({
          isBuyUsd,
          exchangeRate,
          fromAmount: Number(fromAmount),
          toAmount: Number(toAmount),
          fromCurrency,
          toCurrency,
        }));
      }

      setStatus("success");
    } catch (err) {
      console.error(err);
      setStatus("idle");
      alert("Insufficient funds or error processing swap");
    }
  };

  if (status === "success") {
    return (
      <div className="w-full max-w-lg mx-auto bg-black border border-white/10 rounded-2xl p-10 flex flex-col items-center justify-center text-center animate-fade-up shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-full flex items-center justify-center mb-6">
          <Check className="w-10 h-10 text-white" />
        </div>
        <h2 className="font-syne font-bold text-3xl text-white mb-2">Swap Complete</h2>
        <p className="text-medium-zinc font-sora text-sm mb-8">
          You successfully swapped {fromAmount} {isBuyUsd ? "ARS" : "USD"} to {toAmount} {isBuyUsd ? "USD" : "ARS"}.
        </p>
        <div className="w-full flex flex-col gap-3">
          <button
            onClick={() => router.push(`/dashboard/transactions/${completedTxId}`)}
            className="w-full relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-4 transition-all duration-300 font-sora font-bold text-sm hover:opacity-90"
          >
            View Receipt
          </button>
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

  const fromCurrency = isBuyUsd ? "ARS" : "USD";
  const toCurrency = isBuyUsd ? "USD" : "ARS";
  
  // Mock USD balance since wallet only supports ARS right now
  const fromBalance = isBuyUsd ? wallet?.balance || 0 : 50.00;

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-medium-zinc hover:text-white font-sora text-sm font-semibold mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
      
      <div className="bg-[#09090b] border border-white/10 rounded-3xl p-6 sm:p-7 shadow-[0_30px_60px_rgba(0,0,0,0.6),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute -top-24 -right-24 w-48 h-48 bg-white/5 rounded-full blur-3xl pointer-events-none"></div>

        <div className="flex justify-between items-center mb-6 relative z-10">
          <h2 className="font-syne font-bold text-2xl text-white">Swap</h2>
          {rates && (
            <div className="text-right flex flex-col items-end">
              <p className="font-mono text-[10px] text-medium-zinc uppercase tracking-wider mb-1">Live Rate</p>
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-2 py-1 rounded-md">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                <p className="font-sora text-[11px] text-white font-semibold">
                  1 USD = ${exchangeRate?.toFixed(2)}
                </p>
              </div>
            </div>
          )}
        </div>
        
        <form onSubmit={handleSwap} className="space-y-2 relative z-10">
          {/* Pay Block */}
          <div className="bg-[#121214] border border-white/5 hover:border-white/10 rounded-2xl p-4 transition-all focus-within:bg-[#18181b] focus-within:border-white/20">
            <div className="flex justify-between items-center mb-2">
              <label className="font-sora text-xs font-semibold text-medium-zinc">You Pay</label>
              <div className="flex items-center gap-2">
                <p className="font-mono text-[10px] text-medium-zinc">
                  Balance: ${fromBalance.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </p>
                <button 
                  type="button" 
                  onClick={() => handleFromChange({ target: { value: fromBalance.toString() } } as any)}
                  className="font-sora text-[9px] font-bold text-black bg-white/80 hover:bg-white px-1.5 py-0.5 rounded transition-colors uppercase"
                >
                  Max
                </button>
              </div>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <input 
                type="number"
                required
                value={fromAmount}
                onChange={handleFromChange}
                placeholder="0.00"
                max={fromBalance}
                step="any"
                className="w-full bg-transparent border-none font-syne font-bold text-3xl sm:text-4xl text-white focus:outline-none placeholder:text-white/20"
              />
              <div className="shrink-0 bg-[#27272a] border border-white/10 hover:bg-[#3f3f46] transition-colors rounded-full px-3 py-1.5 font-sora font-semibold text-sm text-white flex items-center gap-2 cursor-pointer shadow-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-inner ${fromCurrency === 'USD' ? 'bg-green-500 text-black' : 'bg-blue-400 text-black'}`}>
                  {fromCurrency === 'USD' ? '$' : 'Ar$'}
                </div>
                {fromCurrency}
              </div>
            </div>
          </div>

          {/* Swap Icon Button */}
          <div className="flex justify-center -my-4 relative z-20">
            <button 
              type="button" 
              onClick={handleToggleDirection} 
              className="bg-[#18181b] border-4 border-[#09090b] p-2 rounded-xl cursor-pointer hover:bg-[#27272a] transition-all group shadow-md"
            >
              <ArrowDownUp className="w-5 h-5 text-white group-hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>

          {/* Receive Block */}
          <div className="bg-[#121214] border border-white/5 rounded-2xl p-4 transition-all">
            <div className="flex justify-between items-center mb-2">
              <label className="font-sora text-xs font-semibold text-medium-zinc">You Receive</label>
            </div>
            
            <div className="flex items-center justify-between gap-4">
              <input 
                type="number"
                value={toAmount}
                onChange={handleToChange}
                step="any"
                placeholder="0.00"
                className="w-full bg-transparent border-none font-syne font-bold text-3xl sm:text-4xl text-white focus:outline-none placeholder:text-white/20"
              />
              <div className="shrink-0 bg-[#27272a] border border-white/10 hover:bg-[#3f3f46] transition-colors rounded-full px-3 py-1.5 font-sora font-semibold text-sm text-white flex items-center gap-2 cursor-pointer shadow-sm">
                <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold shadow-inner ${toCurrency === 'USD' ? 'bg-green-500 text-black' : 'bg-blue-400 text-black'}`}>
                  {toCurrency === 'USD' ? '$' : 'Ar$'}
                </div>
                {toCurrency}
              </div>
            </div>
          </div>

          {/* Details */}
          <div className="pt-4 pb-2 px-1 space-y-2">
            <div className="flex justify-between items-center font-sora text-[11px] text-medium-zinc">
              <span>Network Fee</span>
              <span className="text-white font-medium bg-white/10 px-1.5 py-0.5 rounded">Free</span>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={status === "loading" || !fromAmount || !exchangeRate || Number(fromAmount) > fromBalance}
            className="w-full relative overflow-hidden inline-flex items-center justify-center rounded-2xl bg-white text-black px-6 py-4 transition-all duration-300 font-sora font-bold text-base hover:opacity-90 disabled:opacity-50 disabled:bg-medium-zinc disabled:text-white/50 disabled:cursor-not-allowed mt-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]"
          >
            {status === "loading" ? (
              <Loader2 className="w-5 h-5 animate-spin" />
            ) : !fromAmount ? (
              "Enter an amount"
            ) : Number(fromAmount) > fromBalance ? (
              "Insufficient Balance"
            ) : (
              "Review Swap"
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
