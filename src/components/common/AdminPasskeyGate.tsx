import React, { useState } from 'react';
import {
  Shield,
  KeyRound,
  Lock,
  Unlock,
  AlertCircle,
  Eye,
  EyeOff,
  Sparkles,
  ArrowRight,
  UserCheck
} from 'lucide-react';
import { useSchool } from '../../context/SchoolContext';
import { isValidAdminPasskey } from '../../utils/adminSecurity';

interface AdminPasskeyGateProps {
  onOpenRoleSwitcher?: () => void;
}

export const AdminPasskeyGate: React.FC<AdminPasskeyGateProps> = ({
  onOpenRoleSwitcher,
}) => {
  const { unlockAdminWithCode, currentUser } = useSchool();
  const [passkeyInput, setPasskeyInput] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!passkeyInput.trim()) {
      setError('Please enter the admin passkey ("Carla" or "joash").');
      return;
    }

    if (isValidAdminPasskey(passkeyInput)) {
      setIsSuccess(true);
      setTimeout(() => {
        unlockAdminWithCode(passkeyInput);
      }, 500);
    } else {
      setError('Access Denied: Invalid Admin Passkey. Authorized passkeys: "Carla" or "joash".');
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-[#0F172A] border border-indigo-500/40 rounded-3xl p-6 sm:p-8 text-white shadow-2xl shadow-indigo-950/50 relative overflow-hidden backdrop-blur-xl">
        {/* Subtle Futuristic Glow Orbs */}
        <div className="absolute -top-24 -right-24 w-56 h-56 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-24 w-56 h-56 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Top Badges */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-indigo-400 animate-pulse" />
            <span className="text-[11px] font-mono tracking-widest text-indigo-300 uppercase">
              Security Protocol L-5
            </span>
          </div>
          <span className="bg-indigo-950 text-indigo-300 font-mono text-[10px] font-bold px-2.5 py-1 rounded-full border border-indigo-800">
            Passkey Protected
          </span>
        </div>

        {/* Center Shield Icon */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-indigo-600/30 to-purple-600/30 border border-indigo-500/50 flex items-center justify-center text-indigo-400 mb-5 shadow-lg shadow-indigo-900/30">
          <Shield className="w-8 h-8 text-indigo-400" />
        </div>

        {/* Title & Description */}
        <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight">
          Platform Admin Dashboard Locked
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
          National Central Administration requires passkey authorization. Please enter the master password or passkey (<strong className="text-indigo-300 font-mono">Carla</strong> or <strong className="text-indigo-300 font-mono">joash</strong>) to access multi-school licensing, security telemetry, and core settings.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-xs font-bold text-indigo-200 uppercase tracking-wider flex items-center gap-1.5">
                <KeyRound className="w-3.5 h-3.5 text-indigo-400" />
                <span>Admin Passkey / Password</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="text-[11px] text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
              >
                {showPassword ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                <span>{showPassword ? 'Hide' : 'Show'}</span>
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                autoFocus
                placeholder="Enter passkey (Carla or joash)..."
                value={passkeyInput}
                onChange={(e) => {
                  setPasskeyInput(e.target.value);
                  setError(null);
                }}
                className="w-full bg-slate-950 border border-indigo-500/40 focus:border-indigo-400 focus:ring-2 focus:ring-indigo-500/30 rounded-2xl px-4 py-3.5 text-white placeholder-slate-500 font-mono text-sm outline-hidden transition tracking-wide"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1.5 flex items-center gap-1.5">
              <Sparkles className="w-3 h-3 text-indigo-400 shrink-0" />
              <span>Accepted Passkeys: <strong className="text-white font-mono">Carla</strong> or <strong className="text-white font-mono">joash</strong></span>
            </p>
          </div>

          {error && (
            <div className="p-3.5 rounded-2xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
              <span>{error}</span>
            </div>
          )}

          {isSuccess && (
            <div className="p-3.5 rounded-2xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-200 text-xs flex items-center gap-2.5 animate-in fade-in">
              <div className="w-3.5 h-3.5 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin shrink-0" />
              <span className="font-bold">Passkey verified! Unlocking central console...</span>
            </div>
          )}

          <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
            <button
              type="submit"
              disabled={isSuccess}
              className="w-full py-3.5 bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white rounded-2xl text-xs sm:text-sm font-bold transition shadow-lg shadow-indigo-600/30 flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
            >
              <Unlock className="w-4 h-4" />
              <span>Unlock Admin Console</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </form>

        {/* Footer Quick Switch */}
        {onOpenRoleSwitcher && (
          <div className="mt-6 pt-5 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <span>Not the Platform Administrator?</span>
            <button
              type="button"
              onClick={onOpenRoleSwitcher}
              className="text-emerald-400 hover:text-emerald-300 font-bold hover:underline cursor-pointer flex items-center gap-1"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>Switch to School Role</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
