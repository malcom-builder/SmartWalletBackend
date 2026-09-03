import { ArrowRightLeft, Send, QrCode } from "lucide-react";

export function FeatureCapabilities() {
  return (
    <section className="h-full w-full relative z-10 flex flex-col justify-center py-12 md:py-24">
      <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center min-h-0 max-h-[800px]">
        
        <div className="flex flex-col items-center text-center mb-6 md:mb-10">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-sora font-semibold text-white tracking-widest uppercase mb-4">
            <Send className="w-3 h-3 md:w-4 md:h-4" />
            Global Financial Tools
          </div>
          <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-white tracking-tight">
            Move money <span className="text-white/40">without borders.</span>
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 md:gap-6 max-w-5xl mx-auto w-full">
          
          <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 hover:border-white/20 transition-colors flex flex-col items-center text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 md:mb-5">
              <Send className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h4 className="font-syne font-bold text-base md:text-xl text-white mb-2">Instant Transfers</h4>
            <p className="font-sora text-medium-zinc text-xs md:text-sm leading-relaxed">
              Send and receive money to anyone, anywhere in milliseconds. Free deposits via wire transfer.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 hover:border-white/20 transition-colors flex flex-col items-center text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 md:mb-5">
              <ArrowRightLeft className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h4 className="font-syne font-bold text-base md:text-xl text-white mb-2">Crypto Swaps</h4>
            <p className="font-sora text-medium-zinc text-xs md:text-sm leading-relaxed">
              Protect yourself from inflation. Exchange your local currency for digital dollars (Crypto) 24/7.
            </p>
          </div>

          <div className="bg-white/5 border border-white/10 rounded-2xl md:rounded-3xl p-4 md:p-8 hover:border-white/20 transition-colors flex flex-col items-center text-center">
            <div className="w-10 h-10 md:w-12 md:h-12 rounded-full bg-white/10 flex items-center justify-center mb-3 md:mb-5">
              <QrCode className="w-4 h-4 md:w-5 md:h-5 text-white" />
            </div>
            <h4 className="font-syne font-bold text-base md:text-xl text-white mb-2">Bill Payments</h4>
            <p className="font-sora text-medium-zinc text-xs md:text-sm leading-relaxed">
              Scan any service invoice or utility bill and pay it instantly from your balance in one tap.
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
