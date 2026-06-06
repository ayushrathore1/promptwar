import React from 'react';

export const BurnoutRiskSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col p-6 bg-brand-surface border border-brand-border rounded-2xl w-full max-w-sm mx-auto shadow-xl animate-pulse">
      {/* Header Placeholders */}
      <div className="h-4 bg-zinc-800 rounded w-1/2 mb-1.5" />
      <div className="h-3 bg-zinc-800 rounded w-5/6 mb-6" />

      {/* SVG Arc Gauge Loader */}
      <div className="relative flex flex-col items-center justify-center h-40 w-full mb-4" aria-hidden="true">
        <svg viewBox="0 0 200 120" className="w-full max-w-[240px] opacity-15">
          {/* Background Track Arc */}
          <path
            d="M 30 100 A 70 70 0 0 1 170 100"
            fill="none"
            stroke="#4b5563"
            strokeWidth="12"
            strokeLinecap="round"
          />
        </svg>

        {/* Center label placeholder */}
        <div className="absolute bottom-2 flex flex-col items-center justify-center text-center space-y-1.5">
          <div className="h-8 bg-zinc-800 rounded w-14" />
          <div className="h-3 bg-zinc-800 rounded w-16" />
        </div>
      </div>

      {/* Warning Alert Banner Placeholder */}
      <div className="h-14 bg-zinc-800/40 border border-zinc-800/60 rounded-xl w-full" />
    </div>
  );
};

export default BurnoutRiskSkeleton;
