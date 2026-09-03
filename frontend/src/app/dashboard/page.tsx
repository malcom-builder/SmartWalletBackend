import { BalanceCard } from "@/components/dashboard/BalanceCard";
import { QuickActions } from "@/components/dashboard/QuickActions";
import { TransactionList } from "@/components/dashboard/TransactionList";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-up">
      {/* Top Section */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 h-full">
          <BalanceCard />
        </div>
        <div className="lg:col-span-1 h-full min-h-[140px] md:min-h-[220px]">
          <div className="relative w-full h-full rounded-2xl bg-[#0a0a0a] border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] p-6 overflow-hidden flex flex-col justify-between group cursor-pointer hover:border-white/20 transition-colors">
            
            {/* Background Glow */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full pointer-events-none" />

            {/* Content */}
            <div className="relative z-10">
              <p className="text-medium-zinc font-sora font-semibold text-xs tracking-wider uppercase mb-1">Active Cards</p>
              <div className="flex items-baseline gap-2">
                <p className="font-syne font-bold text-3xl text-white">2</p>
                <p className="font-mono text-[10px] text-medium-zinc">Physical & Virtual</p>
              </div>
            </div>

            {/* Mini Glass Card Decoration */}
            <div className="absolute -bottom-6 -right-4 w-40 h-24 rounded-xl bg-white/[0.03] border border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.1),inset_0_0_15px_rgba(255,255,255,0.05)] backdrop-blur-xl rotate-[-15deg] group-hover:rotate-[-10deg] group-hover:-translate-y-1 group-hover:-translate-x-1 transition-all duration-500 flex flex-col justify-between p-3">
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-60 rounded-xl" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/5 via-white/50 to-white/5" />
              <div className="relative z-10 h-full flex flex-col justify-between">
                <div className="w-5 h-4 bg-white/30 rounded-[3px] border border-white/20 shadow-inner" />
                <div className="flex justify-between items-center">
                  <p className="font-mono text-white/50 text-[8px]">•••• 4242</p>
                  <div className="flex gap-[2px]">
                    <div className="w-4 h-4 rounded-full bg-white/80" />
                    <div className="w-4 h-4 rounded-full bg-white/40 -ml-2" />
                  </div>
                </div>
              </div>
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
