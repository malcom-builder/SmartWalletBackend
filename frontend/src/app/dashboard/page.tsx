import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TransactionList } from "@/components/dashboard/TransactionList";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      {/* Top Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <BalanceCard />
        </div>
        <div className="lg:col-span-1 flex items-end">
          {/* We can put a minimal chart or summary here, for now a placeholder glass card */}
          <div className="w-full h-full min-h-[140px] rounded-2xl bg-black border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] p-6 flex flex-col justify-between">
            <p className="text-medium-zinc font-semibold text-xs tracking-wider uppercase">Active Cards</p>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-syne font-bold text-2xl text-white">2</p>
                <p className="font-mono text-[10px] text-medium-zinc mt-1">Physical & Virtual</p>
              </div>
              <div className="w-12 h-8 rounded bg-white/20 border border-white/30 backdrop-blur-sm"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Middle Section: Quick Actions */}
      <section>
        <QuickActions />
      </section>

      {/* Bottom Section: Transactions */}
      <section>
        <TransactionList />
      </section>
    </div>
  );
}
