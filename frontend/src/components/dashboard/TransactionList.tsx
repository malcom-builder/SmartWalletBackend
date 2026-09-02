"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Download, Upload } from "lucide-react";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export function TransactionList() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletId, setWalletId] = useState<string | null>(null);

  useEffect(() => {
    async function fetchTransactions() {
      const userId = getUserIdFromToken();
      if (!userId) {
        setLoading(false);
        return;
      }
      try {
        const res = await api.get<any>(`/Wallet/by-user/${userId}`);
        const wallet = Array.isArray(res) ? res[0] : res;
        
        if (wallet && wallet.id) {
          setWalletId(wallet.id);
          const txs = await api.get<any[]>(`/Transactions/wallet/${wallet.id}`);
          setTransactions(txs || []);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    fetchTransactions();
  }, []);

  if (loading) {
    return <div className="rounded-2xl bg-black border border-white/10 p-6 flex justify-center"><div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div></div>;
  }

  // Sort by date descending
  const sortedTxs = [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  // Keep only the 5 most recent
  const recentTxs = sortedTxs.slice(0, 5);

  const getIcon = (tx: any) => {
    if (tx.type === "Deposit") return <Download className="w-4 h-4 text-white" />;
    if (tx.type === "Withdrawal") return <Upload className="w-4 h-4 text-medium-zinc" />;
    if (tx.type === "Transfer") {
      if (tx.destinationWalletId === walletId) return <ArrowDownLeft className="w-4 h-4 text-white" />;
      return <ArrowUpRight className="w-4 h-4 text-medium-zinc" />;
    }
    return <ArrowLeftRight className="w-4 h-4 text-white" />;
  };

  const getConcept = (tx: any) => {
    if (tx.type === "Deposit") return "Deposit";
    if (tx.type === "Withdrawal") return "Withdrawal";
    if (tx.type === "Transfer") {
      if (tx.destinationWalletId === walletId) return "Received Transfer";
      return "Sent Transfer";
    }
    return "Transaction";
  };

  const getAmountColor = (tx: any) => {
    if (tx.type === "Deposit" || (tx.type === "Transfer" && tx.destinationWalletId === walletId)) {
      return "text-white";
    }
    return "text-medium-zinc";
  };

  const formatAmount = (tx: any) => {
    const isIncoming = tx.type === "Deposit" || (tx.type === "Transfer" && tx.destinationWalletId === walletId);
    return `${isIncoming ? "+" : "-"}$${tx.amount.toFixed(2)}`;
  };

  return (
    <div className="rounded-2xl bg-black border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
      <div className="p-6 border-b border-white/10 flex items-center justify-between">
        <h3 className="font-syne font-bold text-lg text-white">Recent Transactions</h3>
        <button className="text-xs font-mono font-semibold text-medium-zinc hover:text-white transition-colors">
          View All
        </button>
      </div>
      
      <div className="flex flex-col">
        {recentTxs.length === 0 ? (
          <div className="p-10 text-center">
            <p className="font-sora text-sm text-medium-zinc">No transactions yet.</p>
          </div>
        ) : (
          recentTxs.map((tx, i) => (
            <div 
              key={tx.id} 
              onClick={() => router.push(`/dashboard/transactions/${tx.id}`)}
              className={`p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                i !== recentTxs.length - 1 ? "border-b border-white/5" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                  tx.type === 'Deposit' || (tx.type === 'Transfer' && tx.destinationWalletId === walletId)
                    ? "bg-white/10 border-white/20" 
                    : "bg-black/50 border-white/10"
                }`}>
                  {getIcon(tx)}
                </div>
                <div>
                  <p className="font-sora font-semibold text-sm text-white mb-0.5">{getConcept(tx)}</p>
                  <p className="font-mono text-[10px] text-medium-zinc">
                    {new Date(tx.createdAt).toLocaleDateString()} {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
              
              <div className="text-right">
                <p className={`font-mono font-semibold text-sm mb-0.5 ${getAmountColor(tx)}`}>
                  {formatAmount(tx)}
                </p>
                <p className="font-sora text-[10px] text-medium-zinc uppercase tracking-wider">{tx.status}</p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
