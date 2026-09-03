"use client";

import { useState, useEffect } from "react";
import { Eye, EyeOff, Snowflake, Settings, RefreshCcw, CreditCard } from "lucide-react";
import { getUserIdFromToken } from "@/lib/auth";
import { api } from "@/lib/api";

export default function CardsPage() {
  const [showNumbers, setShowNumbers] = useState(false);
  const [isFrozen, setIsFrozen] = useState(false);
  const [userName, setUserName] = useState("Loading...");
  
  // Fake card data
  const expiry = "12/28";
  const cvv = "321";

  useEffect(() => {
    const fetchUser = async () => {
      const id = getUserIdFromToken();
      if (!id) return;
      try {
        const u = await api.get<any>(`/User/${id}`);
        setUserName(u.name || "Smart User");
      } catch (e) {
        console.error(e);
      }
    };
    fetchUser();
  }, []);

  return (
    <div className="w-full animate-fade-up pb-10">
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        
        {/* Left Column: Vertical Card & Actions */}
        <div className="flex flex-col items-center gap-8">
          
          <div className="relative w-full max-w-[280px] perspective-1000">
            {/* Ambient Backlight */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-64 bg-white/10 blur-[80px] rounded-full pointer-events-none" />
            
            {/* The Vertical Card */}
            <div 
              className={`relative w-full aspect-[1/1.586] rounded-3xl bg-[#0a0a0a] border border-white/20 shadow-[0_0_50px_rgba(255,255,255,0.15),inset_0_0_30px_rgba(255,255,255,0.05)] overflow-hidden transition-all duration-500 hover:scale-105`}
            >
              {/* Glossy Diagonal Shine */}
              <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/10 to-white/20 opacity-60" />
              <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-white/10 via-white/50 to-white/10" />
              <div className="absolute top-0 left-0 w-[1px] h-full bg-gradient-to-b from-white/50 via-white/10 to-transparent" />
              
              <div className="relative z-10 p-6 h-full flex flex-col justify-between">
                <div className="flex justify-between items-start">
                  <p className="font-syne font-bold text-lg text-white drop-shadow-md">SMARTWALLET</p>
                  <div className="w-8 h-10 bg-white/20 rounded-md border border-white/30 shadow-inner" />
                </div>
                
                <div className="mt-auto mb-8">
                  <div className="flex justify-between w-full mb-4">
                    <p className="font-mono text-sm sm:text-base text-white tracking-widest drop-shadow-md">
                      {showNumbers ? "4242" : "••••"}
                    </p>
                    <p className="font-mono text-sm sm:text-base text-white tracking-widest drop-shadow-md">
                      {showNumbers ? "8492" : "••••"}
                    </p>
                    <p className="font-mono text-sm sm:text-base text-white tracking-widest drop-shadow-md">
                      {showNumbers ? "1032" : "••••"}
                    </p>
                    <p className="font-mono text-sm sm:text-base text-white tracking-widest drop-shadow-md">
                      {showNumbers ? "4019" : "4019"}
                    </p>
                  </div>
                  <p className="font-sora text-xs text-white/80 uppercase tracking-widest drop-shadow-md truncate">
                    {userName}
                  </p>
                </div>

                <div className="flex gap-8 items-end">
                  <div>
                    <p className="font-sora text-[8px] text-white/50 uppercase tracking-widest mb-1">Valid Thru</p>
                    <p className="font-mono text-sm text-white drop-shadow-md">{expiry}</p>
                  </div>
                  <div>
                    <p className="font-sora text-[8px] text-white/50 uppercase tracking-widest mb-1">CVV</p>
                    <p className="font-mono text-sm text-white tracking-[0.2em] drop-shadow-md">
                      {showNumbers ? cvv : "***"}
                    </p>
                  </div>
                </div>
              </div>
              
              {/* Fake Logo */}
              <div className="absolute bottom-6 right-6 opacity-80">
                <div className="flex items-center">
                  <div className="w-6 h-6 rounded-full bg-red-500/80 mix-blend-screen"></div>
                  <div className="w-6 h-6 rounded-full bg-yellow-500/80 -ml-3 mix-blend-screen"></div>
                </div>
              </div>
              
            </div>
            
            {/* Frozen Overlay */}
            {isFrozen && (
              <div className="absolute inset-0 z-30 bg-black/60 backdrop-blur-[2px] flex flex-col items-center justify-center rounded-3xl">
                <Snowflake className="w-12 h-12 text-blue-400 mb-2" />
                <p className="font-syne font-bold text-white tracking-widest uppercase">Card Frozen</p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div className="w-full max-w-[280px] grid grid-cols-4 gap-3">
            <button 
              onClick={() => setShowNumbers(!showNumbers)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-black border border-white/10 hover:bg-[#1a1a1a] transition-colors group"
            >
              {showNumbers ? <EyeOff className="w-5 h-5 text-medium-zinc group-hover:text-white" /> : <Eye className="w-5 h-5 text-medium-zinc group-hover:text-white" />}
              <span className="font-sora text-[10px] font-semibold text-white">{showNumbers ? "Hide" : "Show"}</span>
            </button>
            <button 
              onClick={() => setIsFrozen(!isFrozen)}
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-black border border-white/10 hover:bg-[#1a1a1a] transition-colors group"
            >
              <Snowflake className={`w-5 h-5 ${isFrozen ? "text-blue-400" : "text-medium-zinc group-hover:text-white"}`} />
              <span className="font-sora text-[10px] font-semibold text-white">{isFrozen ? "Unfreeze" : "Freeze"}</span>
            </button>
            <button 
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-black border border-white/10 hover:bg-[#1a1a1a] transition-colors group"
            >
              <Settings className="w-5 h-5 text-medium-zinc group-hover:text-white" />
              <span className="font-sora text-[10px] font-semibold text-white">Limits</span>
            </button>
            <button 
              className="flex flex-col items-center justify-center gap-2 p-3 rounded-xl bg-black border border-white/10 hover:bg-[#1a1a1a] transition-colors group"
            >
              <RefreshCcw className="w-5 h-5 text-medium-zinc group-hover:text-white" />
              <span className="font-sora text-[10px] font-semibold text-white">Replace</span>
            </button>
          </div>
        </div>

        {/* Right Column: Details & Fake Transactions */}
        <div className="flex flex-col gap-6">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 sm:p-8 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
            <h3 className="font-syne font-bold text-lg text-white mb-6">Card Details</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-4 border-b border-white/5">
                <div>
                  <p className="font-sora text-sm text-white font-semibold">Virtual Card</p>
                  <p className="font-mono text-[10px] text-medium-zinc mt-1">Ready to use online</p>
                </div>
                <div className="px-3 py-1 rounded-full bg-green-500/10 border border-green-500/20 text-green-400 font-sora text-xs font-bold">
                  Active
                </div>
              </div>
              <div className="flex items-center justify-between pt-2">
                <div>
                  <p className="font-sora text-sm text-white font-semibold opacity-50">Physical Card</p>
                  <p className="font-mono text-[10px] text-medium-zinc mt-1">Not requested</p>
                </div>
                <button className="text-white font-sora text-xs font-semibold hover:underline">
                  Request
                </button>
              </div>
            </div>
          </div>

          <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] flex-1 flex flex-col justify-between">
            <div>
              <h3 className="font-syne font-bold text-lg text-white mb-6">Recent Card Activity</h3>
              
              <div className="space-y-4">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-sora font-semibold text-sm text-white">Netflix Subscription</p>
                      <p className="font-syne font-bold text-white">-$11.99</p>
                    </div>
                    <p className="font-mono text-[10px] text-medium-zinc mt-1">Yesterday, 14:23</p>
                  </div>
                </div>
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-4 h-4 text-white" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-sora font-semibold text-sm text-white">Uber Eats</p>
                      <p className="font-syne font-bold text-white">-$24.50</p>
                    </div>
                    <p className="font-mono text-[10px] text-medium-zinc mt-1">Aug 30, 20:15</p>
                  </div>
                </div>
              </div>
            </div>
            
            <button className="w-full mt-6 py-3 text-medium-zinc font-sora text-xs font-semibold uppercase tracking-widest border border-white/5 rounded-xl hover:bg-white/5 hover:text-white transition-colors">
              View All Card Activity
            </button>
          </div>
        </div>
        
      </div>
    </div>
  );
}
