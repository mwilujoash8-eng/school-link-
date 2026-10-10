import React from 'react';

interface AndroidGestureBarProps {
  theme?: 'dark' | 'light';
}

export const AndroidGestureBar: React.FC<AndroidGestureBarProps> = ({ theme = 'dark' }) => {
  const isDark = theme === 'dark';

  return (
    <div
      aria-hidden="true"
      className={`w-full py-1.5 flex items-center justify-center select-none ${
        isDark ? 'bg-[#1E293B]' : 'bg-white'
      }`}
    >
      {/* Android Center Gesture Navigation Pill */}
      <div
        className={`w-36 h-1 rounded-full transition-all duration-200 cursor-pointer ${
          isDark
            ? 'bg-slate-500/50 hover:bg-slate-400 active:scale-95'
            : 'bg-slate-400/60 hover:bg-slate-600 active:scale-95'
        }`}
        title="Android System Gesture Pill"
      />
    </div>
  );
};
