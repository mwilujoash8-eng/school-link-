import React, { useState, useEffect } from 'react';
import { Wifi, BatteryMedium, Sparkles } from 'lucide-react';

interface AndroidStatusBarProps {
  theme?: 'dark' | 'light';
  showPinholeCamera?: boolean;
}

export const AndroidStatusBar: React.FC<AndroidStatusBarProps> = ({
  theme = 'dark',
  showPinholeCamera = true,
}) => {
  const [timeStr, setTimeStr] = useState<string>(() => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
  });

  useEffect(() => {
    const update = () => {
      const d = new Date();
      setTimeStr(d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }));
    };
    const timer = setInterval(update, 10000);
    return () => clearInterval(timer);
  }, []);

  const isDark = theme === 'dark';

  return (
    <div
      aria-label="Android System Status Bar"
      className={`w-full h-7 px-4 flex items-center justify-between text-[11px] font-semibold tracking-tight select-none border-b transition-colors z-50 ${
        isDark
          ? 'bg-[#1E293B] text-slate-300 border-slate-800/80'
          : 'bg-slate-100 text-slate-700 border-slate-200/80'
      }`}
    >
      {/* Left: Real-time Android System Clock & Subtle App Badge */}
      <div className="flex items-center gap-2">
        <span className={`font-mono text-xs ${isDark ? 'text-white font-bold' : 'text-slate-900 font-bold'}`}>
          {timeStr}
        </span>
        <div className="flex items-center gap-0.5 text-[9px] text-emerald-400 font-bold px-1 py-0.2 rounded bg-emerald-950/60 border border-emerald-500/30">
          <span>SchoolLink</span>
        </div>
      </div>

      {/* Center: Subtle Android Front Camera Punch-hole cutout affordance */}
      {showPinholeCamera && (
        <div className="hidden sm:flex items-center justify-center">
          <div className="w-3.5 h-3.5 rounded-full bg-black/90 ring-1 ring-slate-700/50 shadow-inner flex items-center justify-center">
            <div className="w-1 h-1 rounded-full bg-slate-800" />
          </div>
        </div>
      )}

      {/* Right: Cellular Network (5G), Wi-Fi & Battery Status */}
      <div className="flex items-center gap-2 text-xs">
        {/* VoLTE / 5G Tag */}
        <span className="text-[10px] font-mono tracking-tighter opacity-80 font-bold">5G</span>

        {/* 4 Signal Strength Bars */}
        <div className="flex items-end gap-0.5 h-2.5" title="Signal Strength: Excellent">
          <div className="w-0.5 h-1 bg-current rounded-xs opacity-90" />
          <div className="w-0.5 h-1.5 bg-current rounded-xs opacity-90" />
          <div className="w-0.5 h-2 bg-current rounded-xs opacity-90" />
          <div className="w-0.5 h-2.5 bg-emerald-400 rounded-xs" />
        </div>

        {/* Wi-Fi Icon */}
        <span title="Wi-Fi: Connected (Ultra Fast)">
          <Wifi className="w-3 h-3 text-current stroke-[2.5]" />
        </span>

        {/* Battery with percentage & level */}
        <div className="flex items-center gap-1">
          <span className="text-[10px] font-mono font-bold">98%</span>
          <div className="relative w-5 h-2.5 rounded-xs border border-current p-0.5 flex items-center">
            <div className="h-full bg-emerald-400 rounded-2xs w-[94%]" />
            <div className="absolute -right-0.5 top-0.5 w-0.5 h-1 bg-current rounded-r-xs" />
          </div>
        </div>
      </div>
    </div>
  );
};
