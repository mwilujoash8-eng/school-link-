import React from 'react';
import { Smartphone, Laptop, Monitor, Sparkles, RefreshCw, Layers } from 'lucide-react';
import { useDevice } from '../../context/DeviceContext';

export const DeviceSwitcherBanner: React.FC = () => {
  const {
    deviceType,
    effectiveDevice,
    deviceMode,
    setDeviceMode,
    screenWidth,
    detectedName,
    isSmartphone,
  } = useDevice();

  return (
    <aside aria-label="Device layout and responsive viewport controls" className="bg-[#0B1329] text-slate-300 text-[11px] px-3 sm:px-6 py-1.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-2 z-50">
      {/* Left: Detected Hardware Device Status */}
      <div className="flex items-center gap-2">
        <span className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-950/80 text-emerald-400 border border-emerald-500/40">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          <span>{detectedName}</span>
          <span className="text-emerald-300/70 font-mono">({screenWidth}px)</span>
        </span>
        <span className="hidden md:inline text-slate-400">
          {isSmartphone
            ? 'Android App design active • Tactile surfaces, OS status bar, momentum scrolling, and non-overlapping controls.'
            : 'Adaptive responsive layout for widescreen workstations.'}
        </span>
      </div>

      {/* Right: Interactive Device Switcher Controls */}
      <div className="flex items-center gap-1 bg-slate-900/90 p-0.5 rounded-xl border border-slate-700/80">
        <button
          onClick={() => setDeviceMode('smartphone')}
          className={`px-2.5 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1.5 transition ${
            effectiveDevice === 'smartphone'
              ? 'bg-emerald-600 text-white font-bold shadow-xs ring-1 ring-emerald-400/50'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Android Phone layout (thumb-friendly, bottom nav, mobile cards, anti-overlap)"
        >
          <Smartphone className="w-3.5 h-3.5 text-emerald-200" />
          <span>Android Phone</span>
          {effectiveDevice === 'smartphone' && (
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-300 animate-pulse" />
          )}
        </button>

        <button
          onClick={() => setDeviceMode('auto')}
          className={`px-2 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1 transition ${
            deviceMode === 'auto'
              ? 'bg-slate-700 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Auto-detect based on screen width and touch capability"
        >
          <Sparkles className="w-3 h-3 text-emerald-300" />
          <span>Auto</span>
        </button>

        <button
          onClick={() => setDeviceMode('desktop')}
          className={`px-2 py-1 rounded-lg font-medium text-[11px] flex items-center gap-1 transition ${
            effectiveDevice === 'desktop' && deviceMode === 'desktop'
              ? 'bg-slate-700 text-white font-bold shadow-xs'
              : 'text-slate-400 hover:text-white hover:bg-slate-800'
          }`}
          title="Widescreen Desktop layout (multi-column bento, wide charts)"
        >
          <Laptop className="w-3 h-3" />
          <span className="hidden sm:inline">Desktop</span>
        </button>
      </div>
    </aside>
  );
};
