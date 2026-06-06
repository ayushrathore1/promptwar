import React, { useRef } from 'react';
import type { MoodScore } from '../types';
import { MOOD_EMOJIS, MOOD_LABELS } from '../types';

interface MoodRingProps {
  selectedScore: MoodScore | null;
  onChange: (score: MoodScore) => void;
  disabled?: boolean;
}

export const MoodRing: React.FC<MoodRingProps> = ({
  selectedScore,
  onChange,
  disabled = false,
}) => {
  const scores: MoodScore[] = [1, 2, 3, 4, 5];
  const containerRef = useRef<HTMLDivElement>(null);

  // Mapping scores to colors and labels
  const scoreThemes: Record<MoodScore, { borderGlow: string; label: string }> = {
    1: { borderGlow: 'shadow-[0_0_15px_rgba(232,89,60,0.5)] border-brand-coral text-brand-coral', label: 'Overwhelmed' },
    2: { borderGlow: 'shadow-[0_0_15px_rgba(245,166,35,0.5)] border-brand-amber text-brand-amber', label: 'Anxious' },
    3: { borderGlow: 'shadow-[0_0_15px_rgba(156,163,175,0.5)] border-gray-400 text-gray-400', label: 'Okay' },
    4: { borderGlow: 'shadow-[0_0_15px_rgba(29,184,164,0.5)] border-brand-teal text-brand-teal', label: 'Good' },
    5: { borderGlow: 'shadow-[0_0_15px_rgba(66,133,244,0.5)] border-brand-primary text-brand-primary', label: 'Calm' },
  };

  const handleKeyDown = (e: React.KeyboardEvent, currentScore: MoodScore) => {
    if (disabled) return;
    const currentIndex = scores.indexOf(currentScore);
    let nextIndex = currentIndex;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (currentIndex + 1) % scores.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (currentIndex - 1 + scores.length) % scores.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = scores.length - 1;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(currentScore);
      return;
    } else {
      return;
    }

    e.preventDefault();
    const nextScore = scores[nextIndex];
    onChange(nextScore);
    
    // Focus the next element
    const buttons = containerRef.current?.querySelectorAll('button');
    if (buttons && buttons[nextIndex]) {
      (buttons[nextIndex] as HTMLButtonElement).focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-brand-surface border border-brand-border rounded-2xl w-full max-w-md mx-auto shadow-xl">
      <h3 className="text-lg font-heading font-semibold text-brand-text mb-2" id="mood-ring-label">
        How are you feeling right now?
      </h3>
      <p className="text-xs text-brand-text-secondary font-sans mb-6 text-center">
        Select the emoji that best reflects your current mood state
      </p>
      
      <div 
        ref={containerRef}
        role="radiogroup" 
        aria-labelledby="mood-ring-label"
        className="flex items-center justify-around w-full gap-2 md:gap-4"
      >
        {scores.map((score) => {
          const isSelected = selectedScore === score;
          const theme = scoreThemes[score];
          const emoji = MOOD_EMOJIS[score];
          const label = MOOD_LABELS[score - 1];

          return (
            <button
              key={score}
              role="radio"
              aria-checked={isSelected}
              aria-label={`${score} - ${label}`}
              disabled={disabled}
              onClick={() => onChange(score)}
              onKeyDown={(e) => handleKeyDown(e, score)}
              tabIndex={isSelected ? 0 : !selectedScore && score === 3 ? 0 : -1}
              className={`
                relative flex flex-col items-center justify-center 
                w-14 h-14 md:w-16 md:h-16 rounded-full 
                bg-brand-bg border transition-all duration-200 ease-out outline-none
                ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected 
                  ? `${theme.borderGlow} scale-110 border-2` 
                  : 'border-brand-border hover:border-gray-500 hover:scale-105 active:scale-95'
                }
              `}
            >
              {/* Micro-animating glow rings around selected */}
              {isSelected && (
                <span className="absolute inset-0 rounded-full animate-ping opacity-25 border border-current pointer-events-none" />
              )}
              <span className="text-2xl md:text-3xl select-none" role="img" aria-hidden="true">
                {emoji}
              </span>
              
              {/* Text label underneath */}
              <span className={`
                absolute -bottom-7 text-[10px] font-medium tracking-wide uppercase font-sans whitespace-nowrap transition-opacity duration-300
                ${isSelected ? 'opacity-100 text-brand-text font-semibold' : 'opacity-0 text-brand-text-secondary'}
              `}>
                {label}
              </span>
            </button>
          );
        })}
      </div>
      <div className="h-8" />
    </div>
  );
};

export default MoodRing;
