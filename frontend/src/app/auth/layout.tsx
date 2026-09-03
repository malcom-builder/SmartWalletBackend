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
      
      {/* Subtle Back Button */}
      <div className="absolute top-0 left-0 w-full p-8 z-20 flex justify-start items-center">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-medium-zinc hover:text-white font-sora text-sm font-semibold transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>
      </div>

      <main className="flex-1 flex flex-col justify-center items-center relative z-10 px-4">
        {children}
      </main>
    </div>
  );
}
