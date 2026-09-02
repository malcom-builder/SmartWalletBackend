"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      // Assuming it returns a token or sets a cookie
      const res = await api.post<any>("/Auth/login", { email, password });
      
      if (res && res.token) {
        localStorage.setItem("token", res.token);
      }
      
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("Invalid credentials");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up">
      <div className="bg-black border border-white/10 rounded-2xl p-8 sm:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="text-center mb-10">
          <h1 className="font-syne font-bold text-3xl text-white mb-2">Welcome Back</h1>
          <p className="font-sora text-sm text-medium-zinc">
            Enter your credentials to access your wallet.
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-sora text-xs">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Email Address</label>
            <input 
              type="email" 
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@company.com"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sora text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider">Password</label>
              <Link href="#" className="font-sora text-xs text-white/60 hover:text-white transition-colors">Forgot?</Link>
            </div>
            <input 
              type="password" 
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sora text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20 tracking-widest"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full relative overflow-hidden flex items-center justify-center gap-2 rounded-xl bg-white text-black px-6 py-4 transition-all duration-300 font-sora font-bold text-sm hover:opacity-90 mt-2 disabled:opacity-50"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : (
              <>
                Sign In
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="font-sora text-sm text-center text-medium-zinc mt-8">
          Don't have an account?{" "}
          <Link href="/auth/register" className="text-white hover:underline underline-offset-4">
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
