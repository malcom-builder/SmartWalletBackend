import { Button } from "@/components/ui/Button";
import { Headline } from "@/components/ui/Headline";
import { Starfield } from "@/components/ui/Starfield";
import { Navbar } from "@/components/ui/Navbar";
import { Footer } from "@/components/ui/Footer";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden bg-black relative">
      <Starfield />
      
      <Navbar />

      <main className="container mx-auto flex-1 flex flex-col justify-center items-center text-center relative z-10">
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
            <Button variant="primary">Create account</Button>
            <Button variant="secondary">View documentation</Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
