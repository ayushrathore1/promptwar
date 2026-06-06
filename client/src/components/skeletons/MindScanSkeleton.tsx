import React from 'react';

interface MindScanSkeletonProps {
  examName?: string;
}

export const MindScanSkeleton: React.FC<MindScanSkeletonProps> = () => {
  return (
    <div className="flex flex-col p-6 bg-brand-surface border border-brand-border rounded-2xl w-full shadow-xl animate-pulse">
      {/* Title Header */}
      <div className="h-5 bg-zinc-800 rounded-md w-1/3 mb-1" />
      <div className="h-3 bg-zinc-800 rounded-md w-2/3 mb-8" />

      {/* Main scanning animation placeholder */}
      <div className="flex flex-col items-center justify-center py-6 mb-6">
        <div className="relative w-20 h-20 rounded-full border-4 border-zinc-800 flex items-center justify-center">
          <div className="absolute inset-1 rounded-full border-4 border-t-zinc-700 border-r-transparent border-b-transparent border-l-transparent animate-spin" />
          <div className="w-10 h-10 rounded-full bg-zinc-800" />
        </div>
        <div className="h-4 bg-zinc-800 rounded-md w-24 mt-4" />
      </div>

      {/* Agent Workflow Status Rows (Pattern Scout, Burnout Analyst, Micro Coach) */}
      <div className="space-y-4 mb-6">
        {[1, 2, 3].map((index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-brand-bg/50 border border-brand-border/60 rounded-xl">
            <div className="flex items-center gap-3">
              {/* Agent avatar */}
              <div className="w-9 h-9 rounded-lg bg-zinc-800 flex-shrink-0" />
              {/* Agent info */}
              <div className="space-y-1.5">
                <div className="h-3 bg-zinc-800 rounded w-24" />
                <div className="h-2.5 bg-zinc-800 rounded w-16" />
              </div>
            </div>
            {/* Status pill */}
            <div className="h-5 bg-zinc-800 rounded-full w-16" />
          </div>
        ))}
      </div>

      {/* Text block for scan recommendation results */}
      <div className="space-y-2">
        <div className="h-3 bg-zinc-800 rounded w-full" />
        <div className="h-3 bg-zinc-800 rounded w-11/12" />
        <div className="h-3 bg-zinc-800 rounded w-4/5" />
      </div>
    </div>
  );
};

export default MindScanSkeleton;
