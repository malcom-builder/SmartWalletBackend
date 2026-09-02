"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { ArrowLeft, CheckCircle2, Download, Upload, ArrowUpRight, ArrowDownLeft, Printer } from "lucide-react";
import Link from "next/link";

export default function ReceiptPage() {
  const params = useParams();
  const router = useRouter();
  const txId = params.id as string;

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [tx, setTx] = useState<any>(null);
  const [walletId, setWalletId] = useState<string | null>(null);

  useEffect(() => {
    async function loadReceipt() {
      const userId = getUserIdFromToken();
      if (!userId) return;
      
      try {
        // 1. Get user's wallet to know if they are sender or receiver
        const res = await api.get<any>(`/Wallet/by-user/${userId}`);
        const wallet = Array.isArray(res) ? res[0] : res;
        if (wallet) {
          setWalletId(wallet.id);
        }

        // 2. Get transaction (now includes WalletAlias and DestinationWalletAlias)
        const transaction = await api.get<any>(`/Transactions/${txId}`);
        setTx(transaction);

      } catch (err: any) {
        setError(err.message || "Receipt not found");
      } finally {
        setLoading(false);
      }
    }
    loadReceipt();
  }, [txId]);

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center animate-fade-up">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  if (error || !tx) {
    return (
      <div className="w-full max-w-lg mx-auto text-center p-10 bg-black border border-white/10 rounded-2xl animate-fade-up">
        <h2 className="font-syne font-bold text-2xl text-white mb-2">Receipt Not Found</h2>
        <p className="font-sora text-sm text-medium-zinc mb-6">{error}</p>
        <button
          onClick={() => router.push("/dashboard/transactions")}
          className="px-6 py-3 bg-white text-black font-sora font-semibold text-sm rounded-xl"
        >
          Back to Transactions
        </button>
      </div>
    );
  }

  const isIncomingTx = tx.type === "Deposit" || (tx.type === "Transfer" && tx.destinationWalletId === walletId);

  const getIcon = () => {
    if (tx.type === "Deposit") return <Download className="w-8 h-8 text-white" />;
    if (tx.type === "Withdrawal") return <Upload className="w-8 h-8 text-medium-zinc" />;
    if (tx.type === "Transfer") {
      if (tx.destinationWalletId === walletId) return <ArrowDownLeft className="w-8 h-8 text-white" />;
      return <ArrowUpRight className="w-8 h-8 text-medium-zinc" />;
    }
    return <CheckCircle2 className="w-8 h-8 text-white" />;
  };

  const getConcept = () => {
    if (tx.type === "Deposit") return "Deposit";
    if (tx.type === "Withdrawal") return "Withdrawal";
    if (tx.type === "Transfer") {
      if (tx.destinationWalletId === walletId) return "Received Transfer";
      return "Sent Transfer";
    }
    return "Transaction";
  };

  return (
    <div className="w-full max-w-lg mx-auto animate-fade-up pb-10">
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link href="/dashboard/transactions" className="inline-flex items-center gap-2 text-medium-zinc hover:text-white font-sora text-sm font-semibold transition-colors">
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>
        <button 
          onClick={() => window.print()}
          className="inline-flex items-center gap-2 text-medium-zinc hover:text-white font-sora text-sm font-semibold transition-colors"
        >
          <Printer className="w-4 h-4" />
          Print Receipt
        </button>
      </div>
      
      <div className="bg-black border border-white/10 rounded-2xl p-8 sm:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] relative overflow-hidden">
        {/* Receipt Header */}
        <div className="flex flex-col items-center text-center mb-10">
          <div className={`w-20 h-20 rounded-full flex items-center justify-center border mb-6 ${
            isIncomingTx ? "bg-white/10 border-white/20" : "bg-black/50 border-white/10"
          }`}>
            {getIcon()}
          </div>
          <h2 className="font-syne font-bold text-2xl text-white mb-2">{getConcept()}</h2>
          <p className="font-mono text-xs text-medium-zinc uppercase tracking-widest">{tx.status}</p>
          
          <div className="mt-6">
            <span className={`font-syne font-bold text-5xl ${isIncomingTx ? "text-white" : "text-medium-zinc"}`}>
              {isIncomingTx ? "+" : "-"}${tx.amount.toFixed(2)}
            </span>
            <span className="font-sora font-semibold text-lg text-white/50 ml-2">{tx.currencyCode}</span>
          </div>
        </div>
        
        {/* Divider */}
        <div className="w-full border-t border-dashed border-white/20 my-8"></div>
        
        {/* Receipt Details */}
        <div className="space-y-6">
          <div>
            <p className="font-sora text-[10px] font-semibold text-medium-zinc uppercase tracking-wider mb-1">Transaction ID</p>
            <p className="font-mono text-sm text-white break-all">{tx.id}</p>
          </div>
          
          <div className="grid grid-cols-2 gap-6">
            <div>
              <p className="font-sora text-[10px] font-semibold text-medium-zinc uppercase tracking-wider mb-1">Date</p>
              <p className="font-mono text-sm text-white">{new Date(tx.createdAt).toLocaleDateString()}</p>
            </div>
            <div>
              <p className="font-sora text-[10px] font-semibold text-medium-zinc uppercase tracking-wider mb-1">Time</p>
              <p className="font-mono text-sm text-white">{new Date(tx.createdAt).toLocaleTimeString()}</p>
            </div>
          </div>

          {tx.type === "Transfer" && (
            <div className="grid grid-cols-2 gap-6 p-4 rounded-xl bg-white/5 border border-white/10 mt-4">
              <div>
                <p className="font-sora text-[10px] font-semibold text-medium-zinc uppercase tracking-wider mb-1">From</p>
                <p className="font-mono text-xs text-white truncate" title={tx.walletId}>
                  {!isIncomingTx ? "You" : (tx.walletAlias || "External Wallet")}
                </p>
              </div>
              <div>
                <p className="font-sora text-[10px] font-semibold text-medium-zinc uppercase tracking-wider mb-1">To</p>
                <p className="font-mono text-xs text-white truncate" title={tx.destinationWalletId}>
                  {isIncomingTx ? "You" : (tx.destinationWalletAlias || "External Wallet")}
                </p>
              </div>
            </div>
          )}
        </div>
        
        {/* Footer */}
        <div className="mt-10 text-center">
          <p className="font-syne font-bold text-sm text-white/30 tracking-widest">SMARTWALLET</p>
        </div>
      </div>
    </div>
  );
}
