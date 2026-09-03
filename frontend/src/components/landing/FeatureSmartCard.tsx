import { CreditCard, Shield, Smartphone } from "lucide-react";

export function FeatureSmartCard() {
  return (
    <section className="h-full w-full relative z-10 flex flex-col justify-center py-6 md:py-12">
      <div className="container mx-auto px-4 md:px-6 h-full flex flex-col justify-center min-h-0">
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-8 h-full">
          
          {/* Text Content */}
          <div className="flex-1 space-y-4 md:space-y-6 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-white/10 bg-white/5 text-[10px] md:text-xs font-sora font-semibold text-white tracking-widest uppercase">
              <CreditCard className="w-3 h-3 md:w-4 md:h-4" />
              Meet your new card
            </div>
            
            <h2 className="font-syne font-extrabold text-3xl md:text-5xl text-white leading-[1.1] tracking-tight">
              The only card <br/> you will ever need.
            </h2>
            
            <p className="font-sora text-medium-zinc text-sm md:text-lg leading-relaxed">
              Instantly generate virtual cards for online shopping or request your physical contactless card. Total control at your fingertips.
            </p>
            
            <div className="space-y-3 md:space-y-6 pt-2">
              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Shield className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-syne font-bold text-base md:text-lg text-white mb-0.5">Dynamic Security</h4>
                  <p className="font-sora text-xs md:text-sm text-medium-zinc leading-relaxed">Freeze your card instantly, regenerate CVVs, or set custom spending limits.</p>
                </div>
              </div>
              <div className="flex gap-3 md:gap-4">
                <div className="w-10 h-10 md:w-12 md:h-12 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center shrink-0">
                  <Smartphone className="w-4 h-4 md:w-5 md:h-5 text-white" />
                </div>
                <div>
                  <h4 className="font-syne font-bold text-base md:text-lg text-white mb-0.5">Apple & Google Pay</h4>
                  <p className="font-sora text-xs md:text-sm text-medium-zinc leading-relaxed">Add to your mobile wallet and pay contact-free anywhere in the world.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Visual Content (Vertical Card Mockup) */}
          <div className="flex-1 w-full flex justify-center md:justify-end relative min-h-0 h-full items-center">
            
            {/* Premium 3D Glassmorphism Card */}
            <div className="relative w-[180px] md:w-full md:max-w-[280px] aspect-[1/1.586] rounded-2xl md:rounded-3xl bg-white/[0.03] border border-white/10 shadow-[0_0_100px_rgba(255,255,255,0.25),inset_0_0_30px_rgba(255,255,255,0.05)] backdrop-blur-2xl overflow-hidden group hover:scale-105 transition-transform duration-700 ease-out flex-shrink-0">
              
              {/* Glossy Diagonal Shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-60" />
              
              {/* Edge Lighting (Top & Left) */}
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/5 via-white/50 to-white/5" />
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-white/50 via-white/10 to-transparent" />
              
              <div className="relative h-full p-4 md:p-6 flex flex-col justify-between z-10">
                <div className="flex flex-col items-start gap-2 md:gap-4">
                  <span className="font-syne font-bold tracking-widest text-white text-sm md:text-lg drop-shadow-md">SMARTWALLET</span>
                  <div className="w-6 h-8 md:w-8 md:h-10 bg-white/30 rounded-md border border-white/20 shadow-inner" /> {/* EMV Chip with depth */}
                </div>
                
                <div>
                  <div className="flex justify-between items-center mb-2 md:mb-4">
                    <div className="flex gap-1">
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]" />
                      <div className="w-6 h-6 md:w-8 md:h-8 rounded-full bg-white/40 -ml-3 md:-ml-4 border border-white/20 backdrop-blur-sm" />
                    </div>
                    <div className="rotate-90 origin-right mr-2 md:mr-4 text-white/80 text-[10px] md:text-xs font-mono tracking-widest">DEBIT</div>
                  </div>
                  <p className="font-mono text-white/70 tracking-[0.1em] mb-1 md:mb-2 text-xs md:text-sm text-center drop-shadow-sm">•••• •••• •••• 4242</p>
                  <p className="font-sora font-semibold text-white tracking-wider uppercase text-center text-xs md:text-sm drop-shadow-sm">JANE DOE</p>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
