import { Button } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { Starfield } from "@/components/ui/Starfield";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";
import { FeatureSmartCard } from "@/components/landing/FeatureSmartCard";
import { FeatureCapabilities } from "@/components/landing/FeatureCapabilities";
import { FeatureBusiness } from "@/components/landing/FeatureBusiness";
import { FinalCTA } from "@/components/landing/FinalCTA";
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-black relative selection:bg-white/20">
      {/* Background stays fixed */}
      <Starfield />
      
      <Navbar />

      {/* Wrapper for the curtain effect */}
      <div className="relative w-full">
        
        {/* Hero Section */}
        <section className="sticky top-0 h-screen w-full flex flex-col justify-center items-center text-center px-6 z-10 bg-transparent pt-[60px]">
          <div className="max-w-4xl w-full flex flex-col items-center">
            <Headline level={1} className="mb-6">
              Intelligent digital wallet.
            </Headline>
            
            <p 
              className="text-medium-zinc max-w-2xl font-sora mb-10" 
              style={{ fontSize: "clamp(0.95rem, 1.35vw, 1.05rem)", lineHeight: 1.5, fontWeight: 400 }}
            >
              Automated and secure financial management. Robust and scalable infrastructure designed for real-time operations without friction.
            </p>

            <div className="flex items-center gap-4">
              <Link href="/auth/register" style={{ textDecoration: 'none' }}>
                <Button variant="primary" className="px-8 py-3.5 text-sm md:text-base">Create account</Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Sections */}
        <div className="sticky top-[60px] z-20 w-full h-[calc(100vh-60px)] overflow-hidden border-t border-white/10 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] bg-black/80 backdrop-blur-3xl">
          <FeatureSmartCard />
        </div>
        
        <div className="sticky top-[60px] z-30 w-full h-[calc(100vh-60px)] overflow-hidden border-t border-white/10 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] bg-[#050505]">
          <FeatureCapabilities />
        </div>
        
        <div className="sticky top-[60px] z-40 w-full h-[calc(100vh-60px)] overflow-hidden border-t border-white/10 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] bg-[#0a0a0a]">
          <FeatureBusiness />
        </div>

        {/* Final CTA Section */}
        <div className="relative z-50 w-full border-t border-white/10 rounded-t-[2.5rem] shadow-[0_-20px_50px_rgba(0,0,0,0.8)] bg-black min-h-[calc(100vh-60px)] flex flex-col">
          <FinalCTA />
          <div className="mt-auto">
            <Footer />
          </div>
        </div>

      </div>
    </div>
  );
}
