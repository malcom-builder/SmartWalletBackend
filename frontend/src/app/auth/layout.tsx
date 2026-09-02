import { Starfield } from "@/components/ui/Starfield";
import Link from "next/link";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col h-screen overflow-hidden bg-black relative">
      <Starfield />
      
      {/* Minimal Logo Top Left */}
      <div className="absolute top-0 left-0 w-full p-8 z-20 flex justify-between items-center">
        <Link
          href="/"
          className="flex items-center hover:opacity-80 transition-opacity select-none"
          style={{ textDecoration: "none" }}
        >
          <span style={{ fontFamily: "var(--font-syne), sans-serif", fontWeight: 800, fontSize: "1.125rem", letterSpacing: "-0.02em", color: "#FFFFFF" }}>
            SMARTWALLET
          </span>
        </Link>
      </div>

      <main className="flex-1 flex flex-col justify-center items-center relative z-10 px-4">
        {children}
      </main>
    </div>
  );
}
