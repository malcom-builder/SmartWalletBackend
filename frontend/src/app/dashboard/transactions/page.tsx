"use client";

import { useState, useEffect } from "react";
import { ArrowUpRight, ArrowDownLeft, ArrowLeftRight, Download, Upload, Filter, Search } from "lucide-react";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function TransactionsPage() {
  const router = useRouter();
  const [transactions, setTransactions] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [filter, setFilter] = useState<"All" | "Incoming" | "Outgoing">("All");

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

  const isIncomingTx = (tx: any) => {
    return tx.type === "Deposit" || (tx.type === "Transfer" && tx.destinationWalletId === walletId);
  };

  const getAmountColor = (tx: any) => {
    return isIncomingTx(tx) ? "text-white" : "text-medium-zinc";
  };

  const formatAmount = (tx: any) => {
    return `${isIncomingTx(tx) ? "+" : "-"}$${tx.amount.toFixed(2)}`;
  };

  const sortedTxs = [...transactions].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  
  const filteredTxs = sortedTxs.filter(tx => {
    if (filter === "All") return true;
    if (filter === "Incoming") return isIncomingTx(tx);
    if (filter === "Outgoing") return !isIncomingTx(tx);
    return true;
  });

  return (
    <div className="w-full max-w-4xl animate-fade-up">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="font-syne font-bold text-3xl text-white mb-2">Transactions</h1>
          <p className="font-sora text-sm text-medium-zinc">View and manage your transaction history.</p>
        </div>
        
        <div className="flex items-center gap-2 bg-black border border-white/10 rounded-xl p-1">
          {["All", "Incoming", "Outgoing"].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f as any)}
              className={`px-4 py-2 text-xs font-sora font-semibold rounded-lg transition-all ${
                filter === f 
                  ? "bg-white/10 text-white shadow-sm" 
                  : "text-medium-zinc hover:text-white"
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="rounded-2xl bg-black border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
        <div className="p-4 sm:p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="relative w-full max-w-xs">
            <Search className="w-4 h-4 text-medium-zinc absolute left-3 top-1/2 -translate-y-1/2" />
            <input 
              type="text" 
              placeholder="Search transactions..."
              className="w-full bg-black/50 border border-white/10 rounded-lg pl-9 pr-4 py-2 text-xs font-mono text-white focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
            />
          </div>
          <button className="flex items-center gap-2 px-3 py-2 border border-white/10 rounded-lg text-xs font-sora font-semibold text-medium-zinc hover:text-white hover:bg-white/5 transition-colors">
            <Filter className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Filter</span>
          </button>
        </div>

        <div className="flex flex-col min-h-[400px]">
          {loading ? (
            <div className="flex-1 flex items-center justify-center">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : filteredTxs.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center p-10 text-center">
              <ArrowLeftRight className="w-10 h-10 text-white/10 mb-4" />
              <p className="font-sora font-semibold text-white mb-1">No transactions found</p>
              <p className="font-sora text-xs text-medium-zinc">You haven't made any {filter !== 'All' ? filter.toLowerCase() : ''} transactions yet.</p>
            </div>
          ) : (
            filteredTxs.map((tx, i) => (
              <div 
                key={tx.id} 
                onClick={() => router.push(`/dashboard/transactions/${tx.id}`)}
                className={`p-4 sm:p-6 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer ${
                  i !== filteredTxs.length - 1 ? "border-b border-white/5" : ""
                }`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center border ${
                    isIncomingTx(tx)
                      ? "bg-white/10 border-white/20" 
                      : "bg-black/50 border-white/10"
                  }`}>
                    {getIcon(tx)}
                  </div>
                  <div>
                    <p className="font-sora font-semibold text-sm text-white mb-0.5">{getConcept(tx)}</p>
                    <p className="font-mono text-[10px] text-medium-zinc">
                      {new Date(tx.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })} at {new Date(tx.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
                
                <div className="text-right">
                  <p className={`font-mono font-semibold text-sm sm:text-base mb-0.5 ${getAmountColor(tx)}`}>
                    {formatAmount(tx)}
                  </p>
                  <p className="font-sora text-[10px] text-medium-zinc uppercase tracking-wider">{tx.status}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
