import React, { useState, useEffect } from 'react';
import { Play, Square, Check, Timer } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MicroActionCardProps {
  title: string;
  instruction: string;
  durationSeconds: number;
  trigger?: string;
  onComplete?: () => void;
}

export const MicroActionCard: React.FC<MicroActionCardProps> = ({
  title,
  instruction,
  durationSeconds,
  trigger,
  onComplete,
}) => {
  const [timeLeft, setTimeLeft] = useState(durationSeconds);
  const [isActive, setIsActive] = useState(false);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    let interval: ReturnType<typeof setInterval> | null = null;

    if (isActive && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && isActive) {
      setIsActive(false);
      triggerConfetti();
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, timeLeft]);

  // Reset timer if instruction/title changes
  useEffect(() => {
    setTimeLeft(durationSeconds);
    setIsActive(false);
    setIsCompleted(false);
  }, [title, instruction, durationSeconds]);

  const toggleTimer = () => {
    setIsActive(!isActive);
  };

  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(durationSeconds);
  };

  const triggerConfetti = () => {
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#1DB8A4', '#F5A623', '#E8593C', '#ffffff'],
    });
  };

  const handleDone = () => {
    setIsCompleted(true);
    setIsActive(false);
    triggerConfetti();
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div
      className={`w-full bg-brand-surface border rounded-2xl p-5 shadow-lg transition-all duration-300 ${
        isCompleted
          ? 'border-brand-teal/40 bg-brand-teal/5'
          : isActive
          ? 'border-brand-primary/40'
          : 'border-brand-border'
      }`}
    >
      <div className="flex justify-between items-start gap-4 mb-3.5">
        <div>
          {trigger && (
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-amber bg-brand-amber/10 px-2.5 py-0.5 rounded-full">
              {trigger}
            </span>
          )}
          <h3 className="text-base font-heading font-extrabold text-brand-text mt-2 leading-tight">
            {title}
          </h3>
        </div>

        {/* 30-Second Timer Display */}
        <div className="flex items-center gap-1.5 px-3 py-1 bg-brand-bg rounded-lg border border-brand-border select-none">
          <Timer className="w-4 h-4 text-brand-primary" />
          <span className="font-heading font-bold text-sm text-brand-text">{timeLeft}s</span>
        </div>
      </div>

      <p className="text-sm text-brand-text-secondary leading-relaxed mb-5 font-sans">
        {instruction}
      </p>

      {/* Action Buttons */}
      <div className="flex items-center justify-between gap-3 pt-3.5 border-t border-brand-border/60">
        <div className="flex gap-2">
          <button
            type="button"
            onClick={toggleTimer}
            disabled={isCompleted}
            className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl text-xs font-semibold tracking-wide transition-all duration-200 cursor-pointer ${
              isActive
                ? 'bg-brand-amber/15 text-brand-amber border border-brand-amber/30'
                : 'bg-brand-primary/10 text-brand-primary border border-brand-primary/30 hover:bg-brand-primary/20'
            } ${isCompleted ? 'opacity-40 cursor-not-allowed' : ''}`}
            aria-label={isActive ? 'Pause timer' : 'Start micro-action timer'}
          >
            {isActive ? (
              <>
                <Square className="w-3.5 h-3.5 fill-current" /> Pause
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5 fill-current" /> Start
              </>
            )}
          </button>

          {(isActive || timeLeft < durationSeconds) && !isCompleted && (
            <button
              type="button"
              onClick={resetTimer}
              className="px-3 py-1.5 bg-brand-surface border border-brand-border hover:bg-brand-border/30 rounded-xl text-xs text-brand-text-secondary hover:text-brand-text font-semibold cursor-pointer"
              aria-label="Reset timer"
            >
              Reset
            </button>
          )}
        </div>

        <button
          type="button"
          onClick={handleDone}
          disabled={isCompleted}
          className={`flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-xs font-bold tracking-wide transition-all duration-200 shadow-md cursor-pointer ${
            isCompleted
              ? 'bg-brand-teal/20 text-brand-teal border border-brand-teal/40 cursor-default'
              : 'bg-brand-teal text-brand-bg hover:bg-brand-teal/90 active:scale-95 shadow-brand-teal/10'
          }`}
          aria-label="Mark micro-action as complete"
        >
          {isCompleted ? (
            <>
              <Check className="w-4 h-4 stroke-[3]" /> Done
            </>
          ) : (
            <>Done ✓</>
          )}
        </button>
      </div>
    </div>
  );
};
export default MicroActionCard;
