"use client";

import Link from "next/link";
import * as React from "react";

export function Footer() {
  return (
    <footer className="border-t border-white/5 bg-black mt-auto py-6 relative z-10 w-full">
      <div className="container mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Link
            href="https://malcombuilder.com"
            target="_blank"
            rel="noreferrer"
            className="group inline-flex items-center tracking-tight select-none cursor-pointer opacity-70 hover:opacity-100 transition-opacity"
            style={{ textDecoration: "none", fontSize: "1.125rem" }}
          >
            <span className="font-sora font-bold text-white transition-colors duration-500 ease-in-out group-hover:text-zinc-400">
              malcom
            </span>
            <span className="font-mono font-semibold text-white/90 transition-colors duration-500 ease-in-out group-hover:text-zinc-500">
              .
            </span>
            <span className="font-sora font-bold text-white transition-colors duration-500 ease-in-out group-hover:text-white">
              builder
            </span>
          </Link>
        </div>
        <div className="flex items-center gap-3 text-[10px] text-zinc-500 font-mono">
          <span>© {new Date().getFullYear()}</span>
          <span className="text-zinc-700">·</span>
          <span className="tracking-widest uppercase opacity-75 text-zinc-400">Production Ready</span>
        </div>
      </div>
    </footer>
  );
}
