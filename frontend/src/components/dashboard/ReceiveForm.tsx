"use client";

import Link from "next/link";
import { ArrowLeft, Copy, QrCode, Check } from "lucide-react";
import { useState, useEffect } from "react";
import { QRCodeSVG } from "qrcode.react";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";

export function ReceiveForm() {
  const [copied, setCopied] = useState(false);
  const [wallet, setWallet] = useState<{ alias: string; cvu: string } | null>(null);

  useEffect(() => {
    async function loadWallet() {
      const userId = getUserIdFromToken();
      if (!userId) return;
      try {
        const res = await api.get<any>(`/Wallet/by-user/${userId}`);
        const wallet = Array.isArray(res) ? res[0] : res;
        
        if (wallet) {
          // CVU doesn't exist in the backend schema, we mock it using the ID for now
          const mockCvu = "000" + wallet.id.replace(/-/g, "").substring(0, 19);
          setWallet({ alias: wallet.alias || "No Alias", cvu: mockCvu });
        }
      } catch {
        // Fallback or leave empty
        setWallet({ alias: "malcom.wallet", cvu: "0000003100012345678901" });
      }
    }
    loadWallet();
  }, []);

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up">
      <Link href="/dashboard" className="inline-flex items-center gap-2 text-medium-zinc hover:text-white font-sora text-sm font-semibold mb-6 transition-colors">
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </Link>
      
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-5 sm:p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] text-center flex flex-col items-center">
        <h2 className="font-syne font-bold text-xl text-white mb-1">Receive Funds</h2>
        <p className="text-medium-zinc font-sora text-[10px] mb-6">
          Only send ARS (Pesos) to this CVU or Alias.
        </p>

        {/* Real QR Code */}
        <div className="w-32 h-32 bg-white p-2 rounded-xl flex items-center justify-center mb-6 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
          {wallet ? (
            <QRCodeSVG 
              value={`smartwallet://pay?alias=${wallet.alias}&cvu=${wallet.cvu}`} 
              size={110}
              bgColor="#ffffff"
              fgColor="#000000"
              level="M"
              includeMargin={false}
            />
          ) : (
            <div className="w-full h-full border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center animate-pulse">
              <QrCode className="w-8 h-8 text-gray-300" />
            </div>
          )}
        </div>

        {/* Address Display */}
        <div className="w-full space-y-3">
          <div>
            <label className="block text-left font-sora text-[10px] font-semibold text-medium-zinc uppercase tracking-wider mb-1.5">Your Alias</label>
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
              <span className="font-mono text-white text-sm truncate mr-4">{wallet?.alias || "---"}</span>
            </div>
          </div>
          <div>
            <label className="block text-left font-sora text-[10px] font-semibold text-medium-zinc uppercase tracking-wider mb-1.5">Your CVU</label>
            <div className="flex items-center justify-between p-3 rounded-xl border border-white/10 bg-white/5">
              <span className="font-mono text-white text-sm truncate mr-4">{wallet?.cvu || "---"}</span>
              <button 
                onClick={() => handleCopy(wallet?.cvu || "")}
                className="p-1.5 hover:bg-white/10 rounded-md transition-colors text-medium-zinc hover:text-white flex-shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
