"use client";

import { useEffect, useState } from "react";
import { Bell, X, ArrowDownLeft, Download } from "lucide-react";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

interface NotificationsPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsPanel({ isOpen, onClose }: NotificationsPanelProps) {
  const router = useRouter();
  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [walletId, setWalletId] = useState<string | null>(null);

  useEffect(() => {
    async function loadNotifications() {
      if (!isOpen) return;
      setLoading(true);
      
      const userId = getUserIdFromToken();
      if (!userId) return;

      try {
        const res = await api.get<any>(`/Wallet/by-user/${userId}`);
        const wallet = Array.isArray(res) ? res[0] : res;
        
        if (wallet && wallet.id) {
          setWalletId(wallet.id);
          const txs = await api.get<any[]>(`/Transactions/wallet/${wallet.id}`);
          
          // Derive notifications from incoming transactions
          const incoming = (txs || []).filter((tx: any) => 
            tx.type === "Deposit" || (tx.type === "Transfer" && tx.destinationWalletId === wallet.id)
          );
          
          // Sort descending by date
          incoming.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
          
          setNotifications(incoming);
          
          // Update last seen in localStorage
          if (incoming.length > 0) {
            localStorage.setItem("lastSeenNotificationId", incoming[0].id);
            window.dispatchEvent(new Event("notifications-read"));
          }
        }
      } catch (err) {
        console.error("Failed to load notifications", err);
      } finally {
        setLoading(false);
      }
    }
    
    loadNotifications();
  }, [isOpen]);

  if (!isOpen && notifications.length === 0) return null; // Only fully unmount if closed AND empty initially to avoid flashing

  return (
    <>
      <div 
        className={`fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity duration-300 ${isOpen ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={onClose}
      />
      
      <div 
        className={`fixed top-0 right-0 h-full w-full max-w-sm bg-black border-l border-white/10 z-50 shadow-2xl flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="p-6 border-b border-white/10 flex items-center justify-between bg-white/5">
          <div className="flex items-center gap-3">
            <Bell className="w-5 h-5 text-white" />
            <h2 className="font-syne font-bold text-lg text-white">Notifications</h2>
          </div>
          <button 
            onClick={onClose}
            className="p-2 text-medium-zinc hover:text-white rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          {loading ? (
            <div className="flex justify-center p-10">
              <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-10 text-center flex flex-col items-center">
              <Bell className="w-10 h-10 text-white/10 mb-4" />
              <p className="font-sora font-semibold text-white mb-1">All caught up!</p>
              <p className="text-xs text-medium-zinc font-sora">You have no new notifications.</p>
            </div>
          ) : (
            <div className="flex flex-col">
              {notifications.map((notif, i) => (
                <div 
                  key={notif.id}
                  onClick={() => {
                    onClose();
                    router.push(`/dashboard/transactions/${notif.id}`);
                  }}
                  className={`p-6 flex items-start gap-4 hover:bg-white/5 transition-colors cursor-pointer ${
                    i !== notifications.length - 1 ? "border-b border-white/5" : ""
                  }`}
                >
                  <div className="w-10 h-10 rounded-full flex-shrink-0 flex items-center justify-center border bg-white/10 border-white/20">
                    {notif.type === "Deposit" ? (
                      <Download className="w-4 h-4 text-white" />
                    ) : (
                      <ArrowDownLeft className="w-4 h-4 text-white" />
                    )}
                  </div>
                  <div>
                    <p className="font-sora text-sm text-white mb-1 leading-snug">
                      {notif.type === "Deposit" ? (
                        <>You made a deposit of <span className="font-bold">${notif.amount.toFixed(2)}</span></>
                      ) : (
                        <>You received <span className="font-bold">${notif.amount.toFixed(2)}</span> from {notif.walletAlias || "External Wallet"}</>
                      )}
                    </p>
                    <p className="font-mono text-[10px] text-medium-zinc">
                      {new Date(notif.createdAt).toLocaleDateString()} at {new Date(notif.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
