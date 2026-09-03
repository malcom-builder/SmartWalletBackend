"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ArrowLeftRight, CreditCard, Settings, LogOut } from "lucide-react";

const NAV_ITEMS = [
  { label: "Overview", href: "/dashboard", icon: Home },
  { label: "Transactions", href: "/dashboard/transactions", icon: ArrowLeftRight },
  { label: "Cards", href: "/dashboard/cards", icon: CreditCard },
  { label: "Settings", href: "/dashboard/settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 border-r border-white/10 bg-black h-screen sticky top-0 flex flex-col print:hidden">
      <div className="h-20 flex items-center px-6">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 hover:opacity-80 transition-opacity"
          style={{ textDecoration: "none" }}
        >
          <span className="font-syne font-bold text-[0.875rem] tracking-wider text-white">
            SMARTWALLET
          </span>
        </Link>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {NAV_ITEMS.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] font-medium transition-colors ${
                isActive 
                  ? "bg-white/10 text-white font-semibold" 
                  : "text-medium-zinc hover:text-white hover:bg-white/5"
              }`}
            >
              <item.icon className="w-4 h-4 opacity-70" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/10">
        <button 
          onClick={() => {
            if (typeof window !== "undefined") {
              localStorage.removeItem("token");
              window.location.href = "/auth/login";
            }
          }}
          className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg text-[0.875rem] font-medium text-medium-zinc hover:text-white hover:bg-white/5 transition-colors"
        >
          <LogOut className="w-4 h-4 opacity-70" />
          Logout
        </button>
      </div>
    </aside>
  );
}
