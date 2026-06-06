import React from 'react';
import { Calendar, AlertTriangle } from 'lucide-react';
import type { ExamType } from '../types';
import StreakBadge from './StreakBadge';

interface ExamContextBannerProps {
  studentName: string;
  examType: ExamType;
  examDate: string; // ISO Date String
  streakCount: number;
  lastCheckIn?: string | null;
}

export const ExamContextBanner: React.FC<ExamContextBannerProps> = ({
  studentName,
  examType,
  examDate,
  streakCount,
  lastCheckIn,
}) => {
  // Calculate days remaining
  const getDaysRemaining = (targetDateStr: string): number => {
    const target = new Date(targetDateStr);
    const today = new Date();
    
    // Clear time components for pure day comparison
    target.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);
    
    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysRemaining = getDaysRemaining(examDate);
  const isUrgent = daysRemaining >= 0 && daysRemaining < 7;
  const isToday = daysRemaining === 0;
  const isPast = daysRemaining < 0;

  // Render a badge or label for the exam type
  const getExamFullLabel = (type: ExamType) => {
    switch (type) {
      case 'NEET': return 'NEET (Medical Entrance)';
      case 'JEE': return 'JEE Advanced (Engineering)';
      case 'CUET': return 'CUET (Common University Entrance)';
      case 'CAT': return 'CAT (Management Entrance)';
      case 'GATE': return 'GATE (Graduate Aptitude Test in Engineering)';
      case 'UPSC': return 'UPSC Civil Services Examination';
      default: return type;
    }
  };

  return (
    <div 
      className={`
        relative w-full overflow-hidden p-5 rounded-2xl border transition-all duration-300
        bg-brand-surface
        ${isUrgent 
          ? 'border-brand-amber/80 shadow-[0_0_20px_rgba(245,166,35,0.25)] animate-pulse' 
          : 'border-brand-border shadow-lg hover:border-gray-700'
        }
      `}
      role="banner"
      aria-label="Exam Preparation context details"
    >
      {/* Background visual graphics */}
      <div className="absolute right-0 top-0 translate-x-1/4 -translate-y-1/4 w-48 h-48 rounded-full bg-brand-primary/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 z-10 relative">
        {/* Left Side: Student greeting & Exam Info */}
        <div className="flex items-start gap-4">
          <div className={`
            flex items-center justify-center w-12 h-12 rounded-xl flex-shrink-0 text-white font-heading font-extrabold text-lg
            ${isUrgent ? 'bg-brand-amber text-black' : 'bg-brand-primary'}
          `}>
            {examType}
          </div>
          <div>
            <h1 className="text-xl font-heading font-bold text-brand-text tracking-tight leading-snug">
              Welcome back, {studentName}
            </h1>
            <p className="text-xs text-brand-text-secondary font-sans mt-0.5">
              Preparing for <span className="text-brand-text font-medium">{getExamFullLabel(examType)}</span>
            </p>
          </div>
        </div>

        {/* Right Side: Countdown and Streak */}
        <div className="flex flex-wrap items-center gap-3 md:self-center">
          {/* Countdown Badge */}
          <div 
            className={`
              flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs font-semibold font-sans
              ${isUrgent 
                ? 'bg-brand-amber/15 border-brand-amber/40 text-brand-amber' 
                : 'bg-brand-bg border-brand-border text-brand-text-secondary'
              }
            `}
            aria-live="polite"
          >
            {isUrgent ? (
              <AlertTriangle className="w-4 h-4 text-brand-amber animate-bounce" />
            ) : (
              <Calendar className="w-4 h-4 text-brand-primary" />
            )}
            
            <span>
              {isToday && 'Exam is TODAY! Best of luck! 🚀'}
              {isPast && `Exam completed ${Math.abs(daysRemaining)} days ago`}
              {!isToday && !isPast && `${daysRemaining} ${daysRemaining === 1 ? 'day' : 'days'} remaining`}
            </span>
          </div>

          {/* Streak Indicator */}
          <StreakBadge streak={streakCount} lastCheckIn={lastCheckIn} />
        </div>
      </div>
    </div>
  );
};

export default ExamContextBanner;
