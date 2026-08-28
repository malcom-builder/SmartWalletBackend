import type { Metadata } from "next";
import { Sora, Syne, JetBrains_Mono } from "next/font/google";
import "./globals.css";

const sora = Sora({
  variable: "--font-sora",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["700", "800"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "600"],
});

export const metadata: Metadata = {
  title: "SmartWallet | malcom.builder",
  description: "Sistemas digitales end-to-end.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className={`${sora.variable} ${syne.variable} ${jetbrainsMono.variable} dark`}>
      <body className="antialiased min-h-screen bg-deep-obsidian text-pure-white selection:bg-white/30 font-sora relative">
        <div className="fixed inset-0 pointer-events-none bg-noise opacity-[0.05] z-50 mix-blend-overlay"></div>
        {children}
      </body>
    </html>
  );
}
