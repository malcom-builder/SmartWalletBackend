"use client";

import { Bell } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { NotificationsPanel } from "./NotificationsPanel";

export function Header() {
  const pathname = usePathname();
  const router = useRouter();
  const [initial, setInitial] = useState("M");
  const [showNotifications, setShowNotifications] = useState(false);
  const [hasUnread, setHasUnread] = useState(false);

  useEffect(() => {
    async function fetchUserAndNotifications() {
      const userId = getUserIdFromToken();
      if (!userId) return;
      try {
        const res = await api.get<any>(`/Wallet/by-user/${userId}`);
        const wallet = Array.isArray(res) ? res[0] : res;
        
        if (wallet && wallet.userName) {
          setInitial(wallet.userName.charAt(0).toUpperCase());
        }

        if (wallet && wallet.id) {
          const txs = await api.get<any[]>(`/Transactions/wallet/${wallet.id}`);
          const incoming = (txs || []).filter((tx: any) => 
            tx.type === "Deposit" || (tx.type === "Transfer" && tx.destinationWalletId === wallet.id)
          );
          
          if (incoming.length > 0) {
            // sort descending
            incoming.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
            const latestId = incoming[0].id;
            const lastSeenId = localStorage.getItem("lastSeenNotificationId");
            setHasUnread(latestId !== lastSeenId);
          }
        }
      } catch {}
    }
    
    fetchUserAndNotifications();

    const handleUpdate = () => fetchUserAndNotifications();
    window.addEventListener("user-updated", handleUpdate);
    window.addEventListener("notifications-read", () => setHasUnread(false));
    
    return () => {
      window.removeEventListener("user-updated", handleUpdate);
      window.removeEventListener("notifications-read", () => setHasUnread(false));
    };
  }, []);

  const getPageTitle = () => {
    if (pathname?.includes("/transactions")) return "Transactions";
    if (pathname?.includes("/cards")) return "Cards";
    if (pathname?.includes("/settings")) return "Settings";
    if (pathname?.includes("/send")) return "Send Funds";
    if (pathname?.includes("/receive")) return "Receive";
    if (pathname?.includes("/swap")) return "Swap";
    return "Overview";
  };

  const title = getPageTitle();

  return (
    <>
      <header className="shrink-0 h-20 border-b border-white/10 bg-black/50 backdrop-blur-md sticky top-0 z-40 px-8 flex items-center justify-center">
        <div className="w-full max-w-5xl flex items-center justify-between">
          <div>
            <h2 className="font-syne font-bold text-xl tracking-tight text-white">{title}</h2>
          </div>

          <div className="flex items-center gap-4">
            <button 
              onClick={() => setShowNotifications(true)}
              className="relative p-2 rounded-full hover:bg-white/10 transition-colors text-medium-zinc hover:text-white"
            >
              <Bell className="w-5 h-5" />
              {hasUnread && (
                <span className="absolute top-1.5 right-2 w-2 h-2 bg-white rounded-full animate-pulse"></span>
              )}
            </button>
            
            <button 
              onClick={() => router.push("/dashboard/settings")}
              className="h-8 w-8 rounded-full bg-white/10 border border-white/20 hover:border-white/50 transition-colors overflow-hidden flex items-center justify-center cursor-pointer"
            >
              <span className="font-sora font-semibold text-xs text-white">{initial}</span>
            </button>
          </div>
        </div>
      </header>

      <NotificationsPanel 
        isOpen={showNotifications} 
        onClose={() => setShowNotifications(false)} 
      />
    </>
  );
}
