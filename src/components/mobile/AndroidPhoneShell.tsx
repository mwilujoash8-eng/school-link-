import React, { useState } from 'react';
import { Smartphone, Maximize2, Minimize2, Sparkles } from 'lucide-react';
import { AndroidStatusBar } from './AndroidStatusBar';
import { AndroidGestureBar } from './AndroidGestureBar';
import { useDevice } from '../../context/DeviceContext';

interface AndroidPhoneShellProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
  footerContent?: React.ReactNode;
  topBarProps?: any;
}

export const AndroidPhoneShell: React.FC<AndroidPhoneShellProps> = ({
  children,
  headerContent,
  footerContent,
}) => {
  const { screenWidth } = useDevice();
  const [useDeviceFrame, setUseDeviceFrame] = useState<boolean>(true);

  // If on actual mobile hardware (< 640px), always render full-bleed native viewport
  const isActualMobile = screenWidth < 640;

  if (isActualMobile || !useDeviceFrame) {
    return (
      <div className="w-full min-h-screen flex flex-col bg-slate-900 text-slate-900 font-sans antialiased app-scroll-container">
        {/* Native Android Status Bar */}
        <AndroidStatusBar theme="dark" showPinholeCamera={false} />

        {/* Top App Bar Header */}
        {headerContent}

        {/* Scrollable App Canvas */}
        <div className="flex-1 w-full app-canvas-texture">{children}</div>

        {/* Docked Mobile Bottom Navigation */}
        {footerContent || <AndroidGestureBar theme="dark" />}
      </div>
    );
  }

  // On larger screens (Preview / Desktop), render the authentic Android Phone Chassis & App Texture
  return (
    <div className="w-full min-h-screen py-4 px-2 sm:px-4 flex flex-col items-center justify-start app-dark-canvas-texture">
      {/* Device Frame Control Pill */}
      <div className="mb-3 flex items-center justify-between gap-3 max-w-[440px] w-full px-2 text-xs text-slate-300">
        <div className="flex items-center gap-1.5 font-medium">
          <Smartphone className="w-4 h-4 text-emerald-400" />
          <span className="font-bold text-white">Android Smartphone App</span>
          <span className="text-[10px] text-slate-400">Flagship Tactile Shell</span>
        </div>
        <button
          type="button"
          onClick={() => setUseDeviceFrame(!useDeviceFrame)}
          className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-slate-800/90 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-[11px] font-semibold transition active:scale-95 cursor-pointer"
          title="Toggle between phone chassis and full-width mobile view"
        >
          {useDeviceFrame ? (
            <>
              <Maximize2 className="w-3 h-3 text-emerald-400" />
              <span>Full Width View</span>
            </>
          ) : (
            <>
              <Minimize2 className="w-3 h-3 text-emerald-400" />
              <span>Phone Frame</span>
            </>
          )}
        </button>
      </div>

      {/* Realistic Android Phone Device Chassis with Tactile Textures */}
      <div className="relative w-full max-w-[430px] rounded-[44px] p-2.5 bg-gradient-to-b from-slate-700 via-slate-800 to-slate-900 shadow-[0_25px_60px_-15px_rgba(0,0,0,0.6),0_0_0_1px_rgba(255,255,255,0.1)] border-2 border-slate-700/80">
        {/* Subtle Hardware Buttons simulation on edges */}
        <div className="absolute -left-[5px] top-28 w-1 h-12 bg-slate-600 rounded-l-md" title="Volume Up" />
        <div className="absolute -left-[5px] top-44 w-1 h-12 bg-slate-600 rounded-l-md" title="Volume Down" />
        <div className="absolute -right-[5px] top-36 w-1 h-16 bg-slate-600 rounded-r-md" title="Power Button" />

        {/* Screen Bezel & Curved Glass Viewport */}
        <div className="relative w-full overflow-hidden rounded-[36px] bg-[#1E293B] border border-slate-950 shadow-inner flex flex-col max-h-[880px] min-h-[760px] transform-gpu">
          {/* Top Speaker Ear-piece */}
          <div className="w-full bg-[#1E293B] pt-1 pb-0.5 flex justify-center items-center">
            <div className="w-12 h-1 bg-slate-800 rounded-full" />
          </div>

          {/* Android Status Bar */}
          <AndroidStatusBar theme="dark" showPinholeCamera={true} />

          {/* Mobile Top App Bar */}
          {headerContent}

          {/* Scrollable Android App Screen Canvas with Momentum Scrolling */}
          <div className="flex-1 w-full overflow-y-auto app-canvas-texture app-scroll-container overscroll-contain">
            {children}
          </div>

          {/* Docked Mobile Bottom Navigation */}
          {footerContent || <AndroidGestureBar theme="dark" />}
        </div>
      </div>
    </div>
  );
};
