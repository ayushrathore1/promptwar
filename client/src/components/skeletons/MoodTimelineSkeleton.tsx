import React from 'react';

export const MoodTimelineSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col p-6 bg-brand-surface border border-brand-border rounded-2xl w-full shadow-xl animate-pulse">
      {/* Header Placerholders */}
      <div className="flex items-center justify-between mb-6">
        <div className="h-5 bg-zinc-800 rounded-md w-1/3" />
        <div className="h-4 bg-zinc-800 rounded-md w-20" />
      </div>

      {/* SVG Skeleton Chart */}
      <div className="relative w-full overflow-hidden mb-4" aria-hidden="true">
        <svg 
          viewBox="0 0 500 150" 
          className="w-full h-auto overflow-visible opacity-20"
        >
          {/* Horizontal dashed track lines */}
          {[0, 1, 2, 3, 4].map((i) => (
            <line
              key={i}
              x1="40"
              y1={25 + i * 25}
              x2="460"
              y2={25 + i * 25}
              stroke="#4b5563"
              strokeWidth="1"
              strokeDasharray="4 4"
            />
          ))}

          {/* Dummy Sparkline Path */}
          <path
            d="M 40 100 L 110 75 L 180 110 L 250 50 L 320 85 L 390 40 L 460 70"
            fill="none"
            stroke="#4b5563"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />

          {/* Dummy Nodes */}
          {[40, 110, 180, 250, 320, 390, 460].map((x, idx) => {
            const y = [100, 75, 110, 50, 85, 40, 70][idx];
            return (
              <circle
                key={idx}
                cx={x}
                cy={y}
                r="5"
                fill="#4b5563"
              />
            );
          })}
        </svg>
      </div>

      {/* Day label placeholders */}
      <div className="flex justify-between px-6 mt-2">
        {[1, 2, 3, 4, 5, 6, 7].map((n) => (
          <div key={n} className="h-3 bg-zinc-800 rounded w-8" />
        ))}
      </div>
    </div>
  );
};

export default MoodTimelineSkeleton;
