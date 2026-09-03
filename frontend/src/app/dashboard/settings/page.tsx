"use client";

import { useState, useEffect } from "react";
import { User, Lock, Mail, Shield, CheckCircle2, Loader2, Key } from "lucide-react";
import { api } from "@/lib/api";
import { getUserIdFromToken } from "@/lib/auth";
import { useRouter } from "next/navigation";

export default function SettingsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const [userId, setUserId] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [alias, setAlias] = useState("");
  
  const [password, setPassword] = useState("");

  useEffect(() => {
    async function loadData() {
      const id = getUserIdFromToken();
      if (!id) {
        router.push("/auth/login");
        return;
      }
      setUserId(id);
      
      try {
        const res = await api.get<any>(`/Wallet/by-user/${id}`);
        const wallet = Array.isArray(res) ? res[0] : res;
        
        if (wallet) {
          setName(wallet.userName || "");
          setEmail(wallet.userEmail || "");
          setAlias(wallet.alias || "");
        }
      } catch (err) {
        console.error("Failed to load user data", err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState("");
  const [pwdSuccess, setPwdSuccess] = useState("");

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setPwdError("");
    setPwdSuccess("");

    if (!currentPassword || !newPassword || !confirmPassword) {
      setPwdError("All fields are required.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setPwdError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setPwdError("Password must be at least 6 characters.");
      return;
    }

    setPwdLoading(true);
    try {
      // Step 1: Validate current password by attempting a login
      try {
        await api.post<{ token: string }>("/Auth/login", {
          email,
          password: currentPassword
        });
      } catch {
        setPwdError("Current password is incorrect.");
        setPwdLoading(false);
        return;
      }

      // Step 2: If valid, update the password
      await api.put(`/User/${userId}`, { password: newPassword });
      
      setPwdSuccess("Password changed successfully!");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
      
      // Auto close after 2 seconds
      setTimeout(() => {
        setPwdSuccess("");
        setShowPasswordModal(false);
      }, 2000);

    } catch (err: any) {
      setPwdError(err.message || "Failed to update password");
    } finally {
      setPwdLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="w-full h-64 flex items-center justify-center animate-fade-up">
        <div className="w-6 h-6 border-2 border-white/20 border-t-white rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="w-full animate-fade-up relative">
      <div className="mb-8">
        <h1 className="font-syne font-bold text-3xl text-white mb-2">Account Settings</h1>
        <p className="font-sora text-sm text-medium-zinc">Manage your personal information and security preferences.</p>
      </div>

      <div className="space-y-6">
        {/* Profile Section */}
        <div className="rounded-2xl bg-black border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
            <User className="w-5 h-5 text-white" />
            <h2 className="font-syne font-bold text-lg text-white">Personal Information</h2>
          </div>
          
          <div className="p-6 space-y-6">
            <div>
              <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Legal Full Name</label>
              <input 
                type="text"
                readOnly
                value={name}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-medium-zinc font-sora text-sm opacity-50 cursor-not-allowed"
              />
              <p className="font-mono text-[10px] text-medium-zinc mt-2">Verified via KYC. Please contact support to change your legal name.</p>
            </div>
            
            <div>
              <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Email Address</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-medium-zinc absolute left-4 top-1/2 -translate-y-1/2" />
                <input 
                  type="email"
                  readOnly
                  value={email}
                  disabled
                  className="w-full bg-white/5 border border-white/10 rounded-xl pl-11 pr-4 py-3.5 text-medium-zinc font-sora text-sm opacity-50 cursor-not-allowed"
                />
              </div>
              <p className="font-mono text-[10px] text-medium-zinc mt-2">Email cannot be changed.</p>
            </div>
            
            <div>
              <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Wallet Alias</label>
              <input 
                type="text"
                readOnly
                value={alias}
                disabled
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3.5 text-medium-zinc font-mono text-sm opacity-50 cursor-not-allowed"
              />
              <p className="font-mono text-[10px] text-medium-zinc mt-2">Your alias is permanently linked to your wallet.</p>
            </div>
          </div>
        </div>

        {/* Security Section */}
        <div className="rounded-2xl bg-black border border-white/10 shadow-[0_20px_40px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.05)] overflow-hidden">
          <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
            <Lock className="w-5 h-5 text-white" />
            <h2 className="font-syne font-bold text-lg text-white">Security</h2>
          </div>
          
          <div className="p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <p className="font-sora text-sm text-white font-semibold">Account Password</p>
              <p className="font-mono text-[10px] text-medium-zinc mt-1">Change your password regularly to keep your account secure.</p>
            </div>
            <button
              onClick={() => setShowPasswordModal(true)}
              className="relative overflow-hidden inline-flex items-center justify-center rounded-xl border border-white/25 hover:border-white px-6 py-3 text-white hover:bg-white/5 transition-all duration-300 font-sora font-semibold text-sm flex-shrink-0"
            >
              Update Password
            </button>
          </div>
        </div>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fade-up">
          <div className="w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl shadow-2xl overflow-hidden relative">
            <div className="p-6 border-b border-white/10 bg-white/5 flex items-center gap-3">
              <Key className="w-5 h-5 text-white" />
              <h2 className="font-syne font-bold text-lg text-white">Change Password</h2>
            </div>
            
            <form onSubmit={handleChangePassword} className="p-6 space-y-4">
              {pwdSuccess && (
                <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/20 text-green-500 font-sora text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4" />
                  {pwdSuccess}
                </div>
              )}
              {pwdError && (
                <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/20 text-red-500 font-sora text-xs flex items-center gap-2">
                  <Shield className="w-4 h-4" />
                  {pwdError}
                </div>
              )}

              <div>
                <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Current Password</label>
                <input 
                  type="password"
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-sora text-sm focus:outline-none focus:border-white/30 transition-colors tracking-widest"
                />
              </div>
              
              <div>
                <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">New Password</label>
                <input 
                  type="password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-sora text-sm focus:outline-none focus:border-white/30 transition-colors tracking-widest"
                />
              </div>

              <div>
                <label className="block font-sora text-xs font-semibold text-medium-zinc uppercase tracking-wider mb-2">Confirm New Password</label>
                <input 
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white font-sora text-sm focus:outline-none focus:border-white/30 transition-colors tracking-widest"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  onClick={() => setShowPasswordModal(false)}
                  className="px-6 py-3 rounded-xl border border-white/10 text-white font-sora font-semibold text-sm hover:bg-white/5 transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={pwdLoading}
                  className="relative overflow-hidden inline-flex items-center justify-center rounded-xl bg-white text-black px-6 py-3 transition-all duration-300 font-sora font-bold text-sm hover:opacity-90 disabled:opacity-50"
                >
                  {pwdLoading ? <Loader2 className="w-5 h-5 animate-spin" /> : "Update Password"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
