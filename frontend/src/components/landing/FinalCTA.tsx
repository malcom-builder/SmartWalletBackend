import { Button } from "@/components/ui/Button";
import Link from "next/link";

export function FinalCTA() {
  return (
    <section className="w-full py-32 relative z-10 flex flex-col justify-center overflow-hidden">
      {/* Pinpoint Ambient Aura (Offset further to the side) */}
      <div className="absolute top-[5%] md:top-[10%] right-[5%] md:right-[10%] w-40 h-40 md:w-[220px] md:h-[220px] bg-white/15 blur-[70px] md:blur-[80px] rounded-full pointer-events-none" />
      
      <div className="container mx-auto px-6 text-center relative z-10">
        <div className="max-w-3xl mx-auto flex flex-col items-center">
          <h2 className="font-syne font-extrabold text-4xl md:text-5xl text-white mb-8 tracking-tight">
            Ready to upgrade <br/> your finances?
          </h2>
          <p className="font-sora text-medium-zinc text-lg md:text-xl mb-12 max-w-xl leading-relaxed">
            Join thousands of users who have already switched to the most intelligent digital wallet.
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <Link href="/auth/register" style={{ textDecoration: 'none' }}>
              <Button variant="primary" className="w-full sm:w-auto px-8 py-4 text-base">
                Create account
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
