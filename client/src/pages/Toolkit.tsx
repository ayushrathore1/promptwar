import React, { useState, useMemo } from 'react';
import { toolkitMicroActions } from '../data/toolkit';
import { TRIGGER_TYPES, type TriggerType } from '../types';
import { Sparkles, Clock, CheckCircle, Filter } from 'lucide-react';
import confetti from 'canvas-confetti';

const Toolkit: React.FC = () => {
  const [selectedTrigger, setSelectedTrigger] = useState<TriggerType | 'all'>('all');
  const [completedActions, setCompletedActions] = useState<Set<string>>(new Set());

  const filteredActions = useMemo(() => {
    if (selectedTrigger === 'all') return toolkitMicroActions;
    return toolkitMicroActions.filter((a) => a.trigger === selectedTrigger);
  }, [selectedTrigger]);

  const handleComplete = (actionId: string) => {
    setCompletedActions((prev) => {
      const next = new Set(prev);
      next.add(actionId);
      return next;
    });
    confetti({ particleCount: 80, spread: 60, origin: { y: 0.7 }, colors: ['#4A7AE5', '#1DB8A4', '#E8A838'] });
  };

  return (
    <div className="animate-fade-in space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-brand-teal/8 border border-brand-teal/15 rounded-full">
          <Sparkles className="w-4 h-4 text-brand-teal" />
          <span className="text-xs font-semibold text-brand-teal">Wellness Toolkit</span>
        </div>
        <h2 className="text-2xl font-heading text-brand-text">30-Second Micro-Actions</h2>
        <p className="text-xs text-brand-text-secondary max-w-md mx-auto">
          Quick, evidence-based wellness actions tailored to your stress triggers.
        </p>
      </div>

      {/* Filter Bar */}
      <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <Filter className="w-4 h-4 text-brand-text-secondary" />
          <span className="text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">Filter by trigger</span>
        </div>
        <div className="flex flex-wrap gap-2" aria-label="Filter by stress trigger">
          <button aria-pressed={selectedTrigger === 'all'} onClick={() => setSelectedTrigger('all')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
              selectedTrigger === 'all' ? 'bg-brand-dark text-white' : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:text-brand-text'
            }`}>
            All ({toolkitMicroActions.length})
          </button>
          {TRIGGER_TYPES.map((trigger) => {
            const count = toolkitMicroActions.filter((a) => a.trigger === trigger).length;
            return (
              <button key={trigger} aria-pressed={selectedTrigger === trigger} onClick={() => setSelectedTrigger(trigger)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                  selectedTrigger === trigger ? 'bg-brand-dark text-white' : 'bg-brand-bg border border-brand-border text-brand-text-secondary hover:text-brand-text'
                }`}>
                {trigger} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* Actions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredActions.map((action, index) => {
          const actionId = `${action.trigger}-${index}`;
          const isCompleted = completedActions.has(actionId);
          return (
            <article key={actionId}
              className={`bg-white border rounded-2xl p-5 flex flex-col justify-between card-hover shadow-sm transition-all ${
                isCompleted ? 'border-brand-teal/30 bg-brand-teal/3' : 'border-brand-border'
              }`}
              aria-label={`Micro-action: ${action.title}`}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-semibold text-brand-primary uppercase tracking-wider bg-brand-primary/8 px-2 py-0.5 rounded-full">
                    {action.trigger}
                  </span>
                  <div className="flex items-center gap-1 text-[10px] text-brand-text-secondary">
                    <Clock className="w-3 h-3" /><span>{action.durationSeconds}s</span>
                  </div>
                </div>
                <h3 className="text-sm font-heading text-brand-text mb-2 leading-snug">{action.title}</h3>
                <p className="text-xs text-brand-text-secondary leading-relaxed">{action.instruction}</p>
              </div>
              <div className="mt-4 pt-3 border-t border-brand-border/50">
                {isCompleted ? (
                  <div className="flex items-center gap-2 text-brand-teal text-xs font-semibold confetti-pop">
                    <CheckCircle className="w-4 h-4" /> Completed! Well done 🎉
                  </div>
                ) : (
                  <button onClick={() => handleComplete(actionId)}
                    className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-brand-teal/8 hover:bg-brand-teal/15 text-brand-teal border border-brand-teal/20 hover:border-brand-teal/40 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95"
                    aria-label={`Mark "${action.title}" as completed`}>
                    Done ✓
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {completedActions.size > 0 && (
        <div className="text-center py-4" role="status" aria-live="polite">
          <p className="text-xs text-brand-teal font-semibold">
            🎯 {completedActions.size} action{completedActions.size > 1 ? 's' : ''} completed today. You're building resilience!
          </p>
        </div>
      )}
    </div>
  );
};

export default Toolkit;
