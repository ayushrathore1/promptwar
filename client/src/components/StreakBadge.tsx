import React from 'react';
import { Flame } from 'lucide-react';

interface StreakBadgeProps {
  streak: number;
  lastCheckIn?: string | null;
  className?: string;
}

export const StreakBadge: React.FC<StreakBadgeProps> = ({
  streak,
  lastCheckIn,
  className = '',
}) => {
  // Determine fire intensity styling based on streak days
  const getStreakIntensity = (count: number) => {
    if (count === 0) {
      return {
        bg: 'bg-brand-bg border-brand-border text-brand-text-secondary',
        flameClass: 'text-brand-text-secondary',
        label: 'Start Check-in',
        glow: '',
        animation: '',
      };
    } else if (count <= 3) {
      return {
        bg: 'bg-brand-amber/10 border-brand-amber/20 text-brand-amber',
        flameClass: 'text-brand-amber',
        label: 'Warm streak!',
        glow: 'shadow-[0_0_10px_rgba(245,166,35,0.2)]',
        animation: 'animate-pulse',
      };
    } else if (count <= 7) {
      return {
        bg: 'bg-brand-coral/10 border-brand-coral/30 text-brand-coral',
        flameClass: 'text-brand-coral',
        label: 'On Fire!',
        glow: 'shadow-[0_0_15px_rgba(232,89,60,0.35)]',
        animation: 'animate-bounce [animation-duration:1.5s]',
      };
    } else {
      // Supercharged streak
      return {
        bg: 'bg-gradient-to-r from-brand-coral/10 to-brand-amber/10 border-brand-coral/40 text-brand-coral',
        flameClass: 'text-brand-coral fill-brand-amber animate-pulse',
        label: 'Unstoppable!',
        glow: 'shadow-[0_0_20px_rgba(232,89,60,0.5)] border-brand-coral/60',
        animation: 'animate-bounce [animation-duration:1s]',
      };
    }
  };

  const status = getStreakIntensity(streak);

  // Check if check-in has been completed today
  const hasCheckedInToday = () => {
    if (!lastCheckIn) return false;
    const today = new Date().toDateString();
    const lastDate = new Date(lastCheckIn).toDateString();
    return today === lastDate;
  };

  const checkedInToday = hasCheckedInToday();

  return (
    <div 
      className={`
        inline-flex items-center gap-2 px-3 py-1.5 rounded-full border transition-all duration-300 hover:scale-102
        ${status.bg} ${status.glow} ${className}
      `}
      role="status"
      aria-label={`Current check-in streak: ${streak} days. ${status.label}`}
      title={`${streak} days streak. Last check-in: ${lastCheckIn ? new Date(lastCheckIn).toLocaleDateString() : 'Never'}`}
    >
      {/* Flame Icon Container with micro-animations */}
      <div className={`relative flex items-center justify-center ${status.animation}`}>
        <Flame className={`w-4 h-4 md:w-5 md:h-5 ${status.flameClass}`} />
        
        {/* Glow indicator if checked in today */}
        {checkedInToday && streak > 0 && (
          <span className="absolute -top-0.5 -right-0.5 w-2 h-2 rounded-full bg-brand-teal animate-ping" />
        )}
      </div>

      {/* Streak Number */}
      <div className="flex flex-col items-start leading-none">
        <span className="text-sm font-heading font-extrabold tracking-tight">
          {streak} {streak === 1 ? 'Day' : 'Days'}
        </span>
        {streak > 0 && (
          <span className="text-[8px] font-sans text-brand-text-secondary font-medium tracking-wide uppercase mt-0.5">
            {status.label}
          </span>
        )}
      </div>
    </div>
  );
};

export default StreakBadge;
