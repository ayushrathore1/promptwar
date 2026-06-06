import React, { useState } from 'react';
import type { IMoodEntry } from '../types';
import { MOOD_EMOJIS } from '../types';

interface MoodTimelineProps {
  entries: IMoodEntry[];
  title?: string;
}

export const MoodTimeline: React.FC<MoodTimelineProps> = ({
  entries,
  title = 'Weekly Mood Timeline',
}) => {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Take the last 7 entries and sort by date ascending (oldest first)
  const last7Entries = [...entries]
    .sort((a, b) => new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime())
    .slice(-7);

  if (last7Entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center p-6 h-48 bg-brand-surface border border-brand-border rounded-2xl w-full text-center">
        <span className="text-2xl mb-2">🤷</span>
        <p className="text-sm font-heading font-medium text-brand-text">No mood records yet</p>
        <p className="text-xs text-brand-text-secondary font-sans mt-1">Check in daily to build your timeline.</p>
      </div>
    );
  }

  // Chart dimensions
  const width = 500;
  const height = 150;
  const paddingX = 40;
  const paddingY = 25;

  // Generate points
  const points = last7Entries.map((entry, index) => {
    // Space X coordinates evenly
    const x = paddingX + (index * (width - 2 * paddingX)) / Math.max(1, last7Entries.length - 1);
    
    // Y coordinates: score 5 is high (near paddingY), score 1 is low (near height - paddingY)
    const normalizedScore = (entry.moodScore - 1) / 4; // 0 to 1
    const y = height - paddingY - normalizedScore * (height - 2 * paddingY);
    
    return { x, y, entry };
  });

  // Create SVG path string
  const linePath = points.length > 0
    ? `M ${points[0].x} ${points[0].y} ` + points.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ')
    : '';

  // Create SVG area path string (extends to bottom of chart)
  const areaPath = points.length > 0
    ? `${linePath} L ${points[points.length - 1].x} ${height - paddingY} L ${points[0].x} ${height - paddingY} Z`
    : '';

  const getDayName = (dateStr: string) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getScoreTheme = (score: number) => {
    switch (score) {
      case 1: return { text: 'text-brand-coral', stroke: '#E8593C' };
      case 2: return { text: 'text-brand-amber', stroke: '#F5A623' };
      case 3: return { text: 'text-gray-400', stroke: '#9CA3AF' };
      case 4: return { text: 'text-brand-teal', stroke: '#1DB8A4' };
      case 5: return { text: 'text-brand-primary', stroke: '#4285F4' };
      default: return { text: 'text-brand-text', stroke: '#1A1A2E' };
    }
  };

  return (
    <div className="flex flex-col p-6 bg-brand-surface border border-brand-border rounded-2xl w-full shadow-xl">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-heading font-semibold text-brand-text">
          {title}
        </h3>
        <span className="text-[10px] bg-brand-border text-brand-text-secondary px-2 py-0.5 rounded font-sans uppercase tracking-wider">
          Last 7 Check-ins
        </span>
      </div>

      {/* Interactive Line Chart */}
      <div className="relative w-full overflow-hidden animate-fade-in" role="presentation">
        <svg 
          viewBox={`0 0 ${width} ${height}`} 
          className="w-full h-auto overflow-visible select-none"
          aria-hidden="true"
        >
          <defs>
            <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#4285F4" stopOpacity="0.25" />
              <stop offset="100%" stopColor="#4285F4" stopOpacity="0.0" />
            </linearGradient>
            <filter id="nodeGlow" x="-20%" y="-20%" width="140%" height="140%">
              <feDropShadow dx="0" dy="0" stdDeviation="4" floodColor="#4285F4" floodOpacity="0.6" />
            </filter>
          </defs>

          {/* Grid lines (horizontal for score markers 1 to 5) */}
          {[1, 2, 3, 4, 5].map((score) => {
            const normalizedY = (score - 1) / 4;
            const y = height - paddingY - normalizedY * (height - 2 * paddingY);
            return (
              <line
                key={score}
                x1={paddingX}
                y1={y}
                x2={width - paddingX}
                y2={y}
                stroke="#2a2a35"
                strokeWidth="1"
                strokeDasharray="4 4"
              />
            );
          })}

          {/* Sparkline Area Fill */}
          {areaPath && (
            <path
              d={areaPath}
              fill="url(#chartGradient)"
              className="transition-all duration-300"
            />
          )}

          {/* Sparkline Stroke Line */}
          {linePath && (
            <path
              d={linePath}
              fill="none"
              stroke="#4285F4"
              strokeWidth="2.5"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="transition-all duration-300"
            />
          )}

          {/* Nodes (Interactive Points) */}
          {points.map((pt, index) => {
            const isHovered = hoveredIndex === index;
            const theme = getScoreTheme(pt.entry.moodScore);

            return (
              <g 
                key={pt.entry._id || index}
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
                className="cursor-pointer"
              >
                {/* Invisible larger hover trigger area */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r="16"
                  fill="transparent"
                />

                {/* Outer pulsing ring on hover */}
                {isHovered && (
                  <circle
                    cx={pt.x}
                    cy={pt.y}
                    r="9"
                    fill="none"
                    stroke={theme.stroke}
                    strokeWidth="2.5"
                    className="animate-ping opacity-45"
                  />
                )}

                {/* Node Center Bubble */}
                <circle
                  cx={pt.x}
                  cy={pt.y}
                  r={isHovered ? '7' : '5'}
                  fill={isHovered ? '#0f0f13' : theme.stroke}
                  stroke={isHovered ? theme.stroke : 'none'}
                  strokeWidth={isHovered ? '3' : '0'}
                  className="transition-all duration-200"
                />

                {/* Text overlay for emojis above nodes */}
                <text
                  x={pt.x}
                  y={pt.y - 12}
                  textAnchor="middle"
                  className={`text-xs select-none transition-all duration-200 pointer-events-none ${
                    isHovered ? 'scale-125 opacity-100' : 'opacity-40'
                  }`}
                >
                  {MOOD_EMOJIS[pt.entry.moodScore]}
                </text>

                {/* Date Label under nodes */}
                <text
                  x={pt.x}
                  y={height - 8}
                  textAnchor="middle"
                  fill={isHovered ? '#ffffff' : '#6b7280'}
                  className="text-[9px] font-sans font-medium select-none transition-colors duration-200"
                >
                  {getDayName(pt.entry.createdAt)}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Dynamic Tooltip Overlay */}
        {hoveredIndex !== null && points[hoveredIndex] && (
          <div 
            className="absolute z-30 p-3 bg-brand-surface border border-brand-border rounded-xl shadow-2xl max-w-[200px] pointer-events-none"
            style={{
              left: `${(points[hoveredIndex].x / width) * 100}%`,
              top: `${Math.max(5, (points[hoveredIndex].y / height) * 100 - 65)}%`,
              transform: 'translateX(-50%)',
            }}
          >
            <div className="flex items-center gap-1.5 mb-1">
              <span className="text-base select-none">
                {MOOD_EMOJIS[points[hoveredIndex].entry.moodScore]}
              </span>
              <span className="text-xs font-heading font-bold text-brand-text leading-none">
                {points[hoveredIndex].entry.moodLabel}
              </span>
            </div>
            <p className="text-[10px] text-brand-teal font-sans mb-1 uppercase tracking-wide">
              Stressor: {points[hoveredIndex].entry.trigger}
            </p>
            {points[hoveredIndex].entry.note && (
              <p className="text-[10px] text-brand-text-secondary font-sans leading-normal italic line-clamp-2">
                "{points[hoveredIndex].entry.note}"
              </p>
            )}
          </div>
        )}
      </div>

      {/* Screen Reader Table for high accessibility */}
      <div className="sr-only">
        <h4>Weekly Mood Breakdown Table</h4>
        <table>
          <thead>
            <tr>
              <th scope="col">Day</th>
              <th scope="col">Mood Score</th>
              <th scope="col">State</th>
              <th scope="col">Trigger</th>
              <th scope="col">Notes</th>
            </tr>
          </thead>
          <tbody>
            {last7Entries.map((entry, index) => (
              <tr key={index}>
                <td>{new Date(entry.createdAt).toLocaleDateString()}</td>
                <td>{entry.moodScore} out of 5</td>
                <td>{entry.moodLabel}</td>
                <td>{entry.trigger}</td>
                <td>{entry.note || 'None'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default MoodTimeline;
