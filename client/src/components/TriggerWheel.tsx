import React, { useRef } from 'react';
import { 
  BookOpen, 
  FileSpreadsheet, 
  Users, 
  Users2, 
  Moon, 
  Heart, 
  Clock, 
  Award
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import type { TriggerType } from '../types';

interface TriggerWheelProps {
  selectedTrigger: TriggerType | null;
  onChange: (trigger: TriggerType) => void;
  disabled?: boolean;
}

interface TriggerOption {
  type: TriggerType;
  icon: LucideIcon;
}

const triggerOptions: TriggerOption[] = [
  { type: 'Syllabus pressure', icon: BookOpen },
  { type: 'Mock test scores', icon: FileSpreadsheet },
  { type: 'Family expectations', icon: Users },
  { type: 'Comparison with peers', icon: Users2 },
  { type: 'Sleep issues', icon: Moon },
  { type: 'Physical health', icon: Heart },
  { type: 'Time management', icon: Clock },
  { type: 'Result anxiety', icon: Award },
];

export const TriggerWheel: React.FC<TriggerWheelProps> = ({
  selectedTrigger,
  onChange,
  disabled = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const radius = 120; // Radius in pixels for desktop layout

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (disabled) return;
    let nextIndex = index;

    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      nextIndex = (index + 1) % triggerOptions.length;
    } else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      nextIndex = (index - 1 + triggerOptions.length) % triggerOptions.length;
    } else if (e.key === 'Home') {
      nextIndex = 0;
    } else if (e.key === 'End') {
      nextIndex = triggerOptions.length - 1;
    } else if (e.key === ' ' || e.key === 'Enter') {
      e.preventDefault();
      onChange(triggerOptions[index].type);
      return;
    } else {
      return;
    }

    e.preventDefault();
    onChange(triggerOptions[nextIndex].type);

    // Focus the next button (either in grid or radial depending on visibility)
    const buttons = containerRef.current?.querySelectorAll('button');
    if (buttons && buttons[nextIndex]) {
      (buttons[nextIndex] as HTMLButtonElement).focus();
    }
  };

  return (
    <div 
      ref={containerRef}
      className="flex flex-col items-center justify-center p-6 bg-brand-surface border border-brand-border rounded-2xl w-full max-w-lg mx-auto shadow-xl"
    >
      <h3 className="text-lg font-heading font-semibold text-brand-text mb-2" id="trigger-wheel-label">
        Identify Your Stress Trigger
      </h3>
      <p className="text-xs text-brand-text-secondary font-sans mb-8 text-center max-w-xs">
        Select the main factor impacting your academic stress level today
      </p>

      {/* Accessible selected state announcer */}
      <div className="sr-only" aria-live="polite">
        {selectedTrigger ? `Selected trigger: ${selectedTrigger}` : 'No trigger selected'}
      </div>

      {/* Desktop Radial Wheel: shown above 480px screen width */}
      <div 
        className="hidden min-[480px]:block relative w-80 h-80 mb-6 animate-fade-in"
        role="radiogroup"
        aria-labelledby="trigger-wheel-label"
      >
        {/* Central Hub */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-28 h-28 rounded-full bg-brand-bg border border-brand-border flex flex-col items-center justify-center text-center p-3 z-10 shadow-inner">
          {selectedTrigger ? (
            <>
              {React.createElement(
                triggerOptions.find(o => o.type === selectedTrigger)?.icon || BookOpen,
                { className: 'w-6 h-6 text-brand-primary mb-1 animate-pulse' }
              )}
              <span className="text-[10px] font-semibold text-brand-text leading-tight font-heading line-clamp-2">
                {selectedTrigger}
              </span>
            </>
          ) : (
            <>
              <span className="text-xl font-bold text-brand-primary">?</span>
              <span className="text-[10px] text-brand-text-secondary font-sans mt-0.5">Select a core stressor</span>
            </>
          )}
        </div>

        {/* Radial Buttons */}
        {triggerOptions.map((opt, i) => {
          const isSelected = selectedTrigger === opt.type;
          
          // Calculate angle so that 0 is at the top, rotating clockwise
          const angle = (i * 2 * Math.PI) / triggerOptions.length - Math.PI / 2;
          const x = Math.cos(angle) * radius;
          const y = Math.sin(angle) * radius;

          const IconComponent = opt.icon;

          return (
            <button
              key={opt.type}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.type}
              disabled={disabled}
              onClick={() => onChange(opt.type)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              tabIndex={isSelected ? 0 : selectedTrigger === null && i === 0 ? 0 : -1}
              style={{
                position: 'absolute',
                left: '50%',
                top: '50%',
                transform: `translate(calc(-50% + ${x}px), calc(-50% + ${y}px))`,
              }}
              className={`
                flex items-center justify-center w-12 h-12 rounded-full bg-brand-bg border transition-all duration-200 ease-out outline-none
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected 
                  ? 'border-brand-primary text-brand-primary scale-110 shadow-[0_0_15px_rgba(66,133,244,0.4)] z-20' 
                  : `border-brand-border text-gray-400 hover:scale-105 active:scale-95`
                }
              `}
              title={opt.type}
            >
              <IconComponent className="w-5 h-5" />
            </button>
          );
        })}
      </div>

      {/* Mobile Grid Layout: shown on screens below 480px */}
      <div 
        className="block min-[480px]:hidden w-full grid grid-cols-2 gap-3 mb-2"
        role="radiogroup"
        aria-labelledby="trigger-wheel-label"
      >
        {triggerOptions.map((opt, i) => {
          const isSelected = selectedTrigger === opt.type;
          const IconComponent = opt.icon;

          return (
            <button
              key={`mobile-${opt.type}`}
              type="button"
              role="radio"
              aria-checked={isSelected}
              aria-label={opt.type}
              disabled={disabled}
              onClick={() => onChange(opt.type)}
              onKeyDown={(e) => handleKeyDown(e, i)}
              tabIndex={isSelected ? 0 : selectedTrigger === null && i === 0 ? 0 : -1}
              className={`
                flex items-center gap-3 p-3 rounded-xl bg-brand-bg border transition-all duration-200 text-left outline-none
                ${disabled ? 'opacity-40 cursor-not-allowed' : 'cursor-pointer'}
                ${isSelected 
                  ? 'border-brand-primary text-brand-primary shadow-[0_0_10px_rgba(66,133,244,0.3)] bg-brand-primary/5' 
                  : 'border-brand-border text-gray-400 hover:border-gray-500 active:scale-98'
                }
              `}
            >
              <IconComponent className={`w-5 h-5 flex-shrink-0 ${isSelected ? 'text-brand-primary' : 'text-gray-500'}`} />
              <span className="text-xs font-medium font-sans leading-tight text-brand-text">
                {opt.type}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default TriggerWheel;
