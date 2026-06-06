import React, { useState } from 'react';
import { MoodRing } from '../components/MoodRing';
import { TriggerWheel } from '../components/TriggerWheel';
import { type MoodScore, type TriggerType, type MoodLabel, MOOD_LABELS } from '../types';
import { ChevronRight, ChevronLeft, Save, Sparkles, AlertCircle } from 'lucide-react';
import confetti from 'canvas-confetti';

interface MoodLoggerProps {
  onAddEntry: (score: MoodScore, label: MoodLabel, trigger: TriggerType, note: string) => void;
  onNavigate: (page: string) => void;
  onPrepareScan: (score: MoodScore, label: MoodLabel, trigger: TriggerType, note: string) => void;
}

export const MoodLogger: React.FC<MoodLoggerProps> = ({
  onAddEntry,
  onNavigate,
  onPrepareScan,
}) => {
  const [step, setStep] = useState(1);
  const [selectedScore, setSelectedScore] = useState<MoodScore | null>(null);
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | null>(null);
  const [note, setNote] = useState('');

  const handleMoodChange = (score: MoodScore) => {
    setSelectedScore(score);
    // Auto-advance to trigger selection after mood is chosen for smoother UX
    setTimeout(() => {
      setStep(2);
    }, 350);
  };

  const handleTriggerChange = (trigger: TriggerType) => {
    setSelectedTrigger(trigger);
    // Auto-advance to notes step after trigger is chosen
    setTimeout(() => {
      setStep(3);
    }, 350);
  };

  const handleSave = (runAI: boolean) => {
    if (!selectedScore || !selectedTrigger) return;

    const label = MOOD_LABELS[selectedScore - 1];
    onAddEntry(selectedScore, label, selectedTrigger, note);

    // Fire Confetti explosion to celebrate completing the check-in!
    confetti({
      particleCount: 150,
      spread: 90,
      origin: { y: 0.6 },
      colors: ['#4285F4', '#1DB8A4', '#F5A623', '#E8593C'],
    });

    if (runAI) {
      // Setup draft and jump directly to MindScan page
      onPrepareScan(selectedScore, label, selectedTrigger, note);
      onNavigate('mind-scan');
    } else {
      onNavigate('dashboard');
    }
  };

  return (
    <div className="max-w-xl mx-auto bg-brand-surface border border-brand-border rounded-2xl p-6 sm:p-8 shadow-xl animate-fade-in pb-12">
      {/* Step Progress Header */}
      <div className="flex justify-between items-center mb-8 border-b border-brand-border/60 pb-4 select-none">
        <div>
          <h2 className="text-lg font-heading font-extrabold text-brand-text">Daily Mood Log</h2>
          <p className="text-[10px] text-brand-text-secondary">Step {step} of 3</p>
        </div>
        <div className="flex gap-1.5">
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 1 ? 'bg-brand-primary' : 'bg-brand-border'}`}></span>
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 2 ? 'bg-brand-primary' : 'bg-brand-border'}`}></span>
          <span className={`w-2.5 h-2.5 rounded-full ${step >= 3 ? 'bg-brand-primary' : 'bg-brand-border'}`}></span>
        </div>
      </div>

      {/* Step Panels */}
      <div className="min-h-[300px] flex flex-col justify-between">
        {step === 1 && (
          <div className="space-y-6 animate-fade-in">
            <div className="text-center">
              <h3 className="text-base font-heading font-bold text-brand-text">How are you feeling right now?</h3>
              <p className="text-xs text-brand-text-secondary mt-1">Select an emoji that matches your mood today.</p>
            </div>
            <MoodRing selectedScore={selectedScore} onChange={handleMoodChange} />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4 animate-fade-in">
            <div className="text-center">
              <h3 className="text-base font-heading font-bold text-brand-text">What is your primary stress trigger?</h3>
              <p className="text-xs text-brand-text-secondary mt-1">Identify the core area that is draining your energy today.</p>
            </div>
            <TriggerWheel selectedTrigger={selectedTrigger} onChange={handleTriggerChange} />
          </div>
        )}

        {step === 3 && (
          <div className="space-y-5 animate-fade-in">
            <div className="text-center">
              <h3 className="text-base font-heading font-bold text-brand-text">Write down your thoughts (Optional)</h3>
              <p className="text-xs text-brand-text-secondary mt-1">
                Jot down what is causing this stress. Hinglish or short notes work perfectly.
              </p>
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="journal-note" className="text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary">
                Journal Entry
              </label>
              <textarea
                id="journal-note"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="e.g. Chemical bonding mock questions were too tough. Time block spent worrying instead of revising..."
                className="w-full bg-brand-bg border border-brand-border rounded-xl p-3.5 text-sm text-brand-text focus:outline-none focus:border-brand-primary placeholder:text-gray-400 transition-colors font-sans resize-none"
              />
            </div>

            {selectedScore === 1 && (
              <div className="flex items-start gap-2 p-3 bg-brand-coral/10 border border-brand-coral/30 rounded-xl text-xs text-brand-coral">
                <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
                <p className="leading-relaxed">
                  You logged feeling Overwhelmed. Please remember that you don't have to carry this alone. Taking a short break is a valid step.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Wizard Controls */}
        <div className="flex items-center justify-between mt-8 pt-4 border-t border-brand-border/60 select-none">
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              className="flex items-center gap-1 px-4 py-2 border border-brand-border hover:bg-brand-border/30 rounded-xl text-xs text-brand-text-secondary hover:text-brand-text transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" /> Back
            </button>
          ) : (
            <div />
          )}

          {step < 3 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={step === 1 ? !selectedScore : !selectedTrigger}
              className={`flex items-center gap-1 px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                (step === 1 && !selectedScore) || (step === 2 && !selectedTrigger)
                  ? 'bg-brand-border text-gray-600 cursor-not-allowed'
                  : 'bg-brand-primary text-white hover:bg-brand-primary/90'
              }`}
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <div className="flex gap-2 w-full sm:w-auto">
              <button
                onClick={() => handleSave(false)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-surface border border-brand-border hover:bg-brand-border/30 text-xs font-bold text-brand-text-secondary hover:text-brand-text rounded-xl cursor-pointer"
              >
                <Save className="w-4 h-4" /> Save Only
              </button>
              <button
                onClick={() => handleSave(true)}
                className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-4 py-2 bg-brand-primary text-white hover:bg-brand-primary/95 text-xs font-bold rounded-xl shadow-lg shadow-brand-primary/10 cursor-pointer"
              >
                <Sparkles className="w-4 h-4" /> Run MindScan
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
export default MoodLogger;
