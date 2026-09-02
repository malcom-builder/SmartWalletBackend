"use client";

import Link from "next/link";
import { ArrowRight, Loader2 } from "lucide-react";
import { useState } from "react";
import { api, ApiError } from "@/lib/api";
import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await api.post("/User/register", { name, email, password });
      
      // Auto-login after register (or just redirect to login)
      // Since login returns a token, we should probably login automatically, 
      // but for now, we'll login and get the token.
      const loginRes = await api.post<any>("/Auth/login", { email, password });
      
      if (loginRes && loginRes.token) {
        localStorage.setItem("token", loginRes.token);
      }
      
      router.push("/dashboard");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto animate-fade-up">
      <div className="bg-black border border-white/10 rounded-2xl p-8 sm:p-10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)]">
        <div className="text-center mb-10">
          <h1 className="font-syne font-bold text-3xl text-white mb-2">Create Account</h1>
          <p className="font-sora text-sm text-medium-zinc">
            Join the smart digital wallet ecosystem.
          </p>
        </div>
        
        {error && (
          <div className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-sora text-xs">
            {error}
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div>
            <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Full Name</label>
            <input 
              type="text" 
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="John Doe"
              className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-white font-sora text-sm focus:outline-none focus:border-white/30 transition-colors placeholder:text-white/20"
            />
          </div>

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
            <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Password</label>
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
                Create Wallet
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        <p className="font-sora text-sm text-center text-medium-zinc mt-8">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-white hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
