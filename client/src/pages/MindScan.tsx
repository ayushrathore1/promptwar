import React, { useState } from 'react';
import { WellnessMissionControl } from '../components/WellnessMissionControl';
import { MoodRing } from '../components/MoodRing';
import { TriggerWheel } from '../components/TriggerWheel';
import { type IStudent, type IMoodEntry, type MoodScore, type MoodLabel, type TriggerType, MOOD_LABELS } from '../types';
import { ArrowLeft, Sparkles } from 'lucide-react';

interface MindScanProps {
  student: IStudent;
  moodHistory: IMoodEntry[];
  scanDraft: {
    moodScore: MoodScore;
    moodLabel: MoodLabel;
    trigger: TriggerType;
    note?: string;
  } | null;
  onNavigate: (page: string) => void;
}

const MindScan: React.FC<MindScanProps> = ({ student, moodHistory, scanDraft, onNavigate }) => {
  const [moodScore, setMoodScore] = useState<MoodScore | null>(scanDraft?.moodScore || null);
  const [trigger, setTrigger] = useState<TriggerType | null>(scanDraft?.trigger || null);
  const [isReady, setIsReady] = useState(!!scanDraft);

  const handleMoodSelect = (score: MoodScore) => {
    setMoodScore(score);
    if (trigger) setIsReady(true);
  };

  const handleTriggerSelect = (t: TriggerType) => {
    setTrigger(t);
    if (moodScore) setIsReady(true);
  };

  const currentEntry = isReady && moodScore && trigger
    ? {
        moodScore,
        moodLabel: MOOD_LABELS[moodScore - 1] as MoodLabel,
        trigger,
        note: scanDraft?.note,
      }
    : null;

  return (
    <div className="animate-fade-in space-y-6">
      {/* Back Button */}
      <button
        onClick={() => onNavigate('dashboard')}
        className="flex items-center gap-1.5 text-xs text-brand-text-secondary hover:text-brand-text transition-colors cursor-pointer"
        aria-label="Go back to dashboard"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Dashboard
      </button>

      {/* If no scan draft, show quick mood+trigger picker */}
      {!currentEntry && (
        <div className="space-y-6">
          <div className="text-center space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-primary/10 border border-brand-primary/20 rounded-full">
              <Sparkles className="w-4 h-4 text-brand-primary" />
              <span className="text-xs font-semibold text-brand-primary">AI MindScan</span>
            </div>
            <h2 className="text-2xl font-heading text-brand-text">
              Quick Setup
            </h2>
            <p className="text-xs text-brand-text-secondary max-w-md mx-auto">
              Select your current mood and stress trigger to run an AI-powered wellness analysis.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-heading text-brand-text mb-4">How are you feeling?</h3>
              <MoodRing selectedScore={moodScore} onChange={handleMoodSelect} />
            </div>
            <div className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
              <h3 className="text-sm font-heading text-brand-text mb-4">What is stressing you?</h3>
              <TriggerWheel selectedTrigger={trigger} onChange={handleTriggerSelect} />
            </div>
          </div>
        </div>
      )}

      {/* When ready, show Mission Control */}
      {currentEntry && (
        <WellnessMissionControl
          student={student}
          moodHistory={moodHistory}
          currentEntry={currentEntry}
        />
      )}
    </div>
  );
};

export default MindScan;
