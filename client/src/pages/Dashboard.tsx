import React, { useState } from 'react';
import { type IStudent, type IMoodEntry, type MoodScore, MOOD_EMOJIS } from '../types';
import { BurnoutRiskMeter } from '../components/BurnoutRiskMeter';
import { MoodTimeline } from '../components/MoodTimeline';
import { UserSquare2, RefreshCw, ChevronRight, CheckCircle2, Heart, Calendar, Flame } from 'lucide-react';
import { toolkitMicroActions } from '../data/toolkit';
import confetti from 'canvas-confetti';

interface DashboardProps {
  activeStudent: IStudent;
  students: IStudent[];
  moodEntries: IMoodEntry[];
  onSwitchProfile: (studentId: string) => void;
  onNavigate: (page: string) => void;
  onQuickScan: (moodScore: number, trigger: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({
  activeStudent,
  students,
  moodEntries,
  onSwitchProfile,
  onNavigate,
  onQuickScan,
}) => {
  const [showProfileSwitcher, setShowProfileSwitcher] = useState(false);

  const studentMoodEntries = moodEntries.filter(
    (entry) => entry.studentId === activeStudent._id
  );

  const todayString = new Date().toDateString();
  const todayCheckIn = studentMoodEntries.find(
    (entry) => new Date(entry.createdAt).toDateString() === todayString
  );

  const daysRemaining = Math.max(0, Math.ceil(
    (new Date(activeStudent.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  // Burnout risk calculation
  const calculateOfflineBurnoutRisk = (): { score: number; reason: string } => {
    const recent = studentMoodEntries.slice(0, 7);
    if (recent.length === 0) return { score: 15, reason: 'Log your first mood to calculate risk.' };

    let consecutiveOverwhelmed = 0;
    let maxConsecutive = 0;
    for (let i = 0; i < Math.min(recent.length, 7); i++) {
      if (recent[i].moodScore === 1) {
        consecutiveOverwhelmed++;
        if (consecutiveOverwhelmed > maxConsecutive) maxConsecutive = consecutiveOverwhelmed;
      } else {
        consecutiveOverwhelmed = 0;
      }
    }

    if (maxConsecutive >= 3) {
      return { score: 88, reason: '3+ consecutive days of feeling Overwhelmed. Please take a break.' };
    }

    const avgScore = recent.reduce((sum, e) => sum + e.moodScore, 0) / recent.length;
    const triggers = recent.map((e) => e.trigger);
    const triggerCounts: Record<string, number> = {};
    let dominantTrigger = '';
    let maxTriggerCount = 0;
    triggers.forEach((t) => {
      triggerCounts[t] = (triggerCounts[t] || 0) + 1;
      if (triggerCounts[t] > maxTriggerCount) {
        maxTriggerCount = triggerCounts[t];
        dominantTrigger = t;
      }
    });

    if (avgScore <= 2) return { score: 72, reason: `High stress due to "${dominantTrigger || 'syllabus pressure'}".` };
    if (avgScore <= 3.2) return { score: 48, reason: `Moderate stress: "${dominantTrigger}" is a hotspot.` };
    return { score: 18, reason: 'Low risk. Your routine looks balanced.' };
  };

  const riskData = calculateOfflineBurnoutRisk();

  const getSuggestedAction = () => {
    const latestTrigger = todayCheckIn?.trigger || studentMoodEntries[0]?.trigger || 'Syllabus pressure';
    const matchingActions = toolkitMicroActions.filter((action) => action.trigger === latestTrigger);
    return matchingActions[0] || toolkitMicroActions[0];
  };

  const suggestedAction = getSuggestedAction();

  const handleActionComplete = () => {
    confetti({ particleCount: 100, spread: 70, origin: { y: 0.8 }, colors: ['#4A7AE5', '#1DB8A4', '#E8A838'] });
  };

  return (
    <div className="space-y-8 animate-fade-in pb-16">
      {/* ─── Hero Section ─── */}
      <section className="text-center relative overflow-hidden rounded-3xl bg-white border border-brand-border shadow-sm px-6 pt-8 pb-10">
        <div className="ambient-glow" />
        <img
          src="/hero.png"
          alt="Student meditating peacefully with a lotus mandala"
          className="w-48 h-48 md:w-56 md:h-56 mx-auto object-contain mb-6 animate-float"
        />
        <h1 className="text-3xl md:text-4xl font-heading text-brand-text leading-tight mb-2">
          Find Stillness.<br />See Clearly.
        </h1>
        <p className="text-sm text-brand-text-secondary max-w-md mx-auto mb-6">
          Track your mood, identify stress triggers, and receive<br className="hidden sm:block" /> personalised wellness support through your {activeStudent.exam} journey.
        </p>

        {/* Quick Stats Row */}
        <div className="flex items-center justify-center gap-4 flex-wrap">
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg rounded-full text-xs font-medium text-brand-text-secondary border border-brand-border">
            <Calendar className="w-3.5 h-3.5 text-brand-primary" />
            <span className="font-semibold text-brand-text">{daysRemaining}</span> days to {activeStudent.exam}
          </div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-brand-bg rounded-full text-xs font-medium text-brand-text-secondary border border-brand-border">
            <Flame className="w-3.5 h-3.5 text-brand-amber" />
            <span className="font-semibold text-brand-text">{activeStudent.streak}</span> day streak
          </div>
        </div>

        {/* CTA */}
        <div className="mt-6 flex items-center justify-center gap-3">
          {todayCheckIn ? (
            <button
              onClick={() => onNavigate('mind-scan')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-brand-dark/10"
            >
              Open AI MindScan
              <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => onNavigate('mood-logger')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-dark text-white text-sm font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer shadow-lg shadow-brand-dark/10"
            >
              Log Today's Mood
              <ChevronRight className="w-4 h-4" />
            </button>
          )}
        </div>
      </section>

      {/* ─── Student Card + Profile Switcher ─── */}
      <section className="bg-white border border-brand-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-brand-text-secondary uppercase tracking-wider font-semibold mb-1">Welcome back</p>
            <h2 className="text-xl font-heading text-brand-text">{activeStudent.name}</h2>
            <p className="text-xs text-brand-text-secondary mt-0.5">{activeStudent.background}</p>
          </div>
          <div className="relative">
            <button
              onClick={() => setShowProfileSwitcher(!showProfileSwitcher)}
              className="flex items-center gap-2 px-3 py-2 bg-brand-bg hover:bg-gray-100 border border-brand-border rounded-xl text-xs text-brand-text-secondary hover:text-brand-text transition-all cursor-pointer font-medium"
              aria-label="Switch Student Profile"
            >
              <UserSquare2 className="w-4 h-4 text-brand-primary" />
              Switch
              <RefreshCw className="w-3 h-3 text-gray-400 animate-spin-slow" />
            </button>

            {showProfileSwitcher && (
              <div className="absolute right-0 mt-2 w-64 bg-white border border-brand-border rounded-xl shadow-lg z-50 overflow-hidden divide-y divide-brand-border">
                <div className="p-3 text-[10px] font-bold uppercase tracking-wider text-brand-text-secondary bg-brand-bg">
                  Select Profile
                </div>
                {students.map((student) => (
                  <button
                    key={student._id}
                    onClick={() => {
                      onSwitchProfile(student._id || '');
                      setShowProfileSwitcher(false);
                    }}
                    className={`w-full text-left p-3 flex flex-col hover:bg-brand-bg transition-colors cursor-pointer ${
                      student._id === activeStudent._id ? 'bg-brand-primary/5 border-l-2 border-brand-primary' : ''
                    }`}
                  >
                    <span className="text-xs font-semibold text-brand-text">{student.name}</span>
                    <span className="text-[10px] text-brand-text-secondary mt-0.5">
                      {student.exam} • {student.city} • Streak: {student.streak}d
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ─── Today's Check-in Status ─── */}
      {todayCheckIn && (
        <section className="bg-white border border-brand-teal/20 rounded-2xl p-5 shadow-sm">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle2 className="w-5 h-5 text-brand-teal" />
            <span className="text-xs font-semibold uppercase tracking-wider text-brand-teal">Today's check-in complete</span>
          </div>
          <div className="flex items-center gap-3 p-3 bg-brand-bg rounded-xl border border-brand-border">
            <span className="text-3xl">{MOOD_EMOJIS[todayCheckIn.moodScore]}</span>
            <div>
              <h4 className="text-sm font-semibold text-brand-text">Feeling {todayCheckIn.moodLabel}</h4>
              <p className="text-[10px] text-brand-text-secondary mt-0.5">Trigger: {todayCheckIn.trigger}</p>
            </div>
          </div>
          {todayCheckIn.note && (
            <p className="text-xs italic text-brand-text-secondary mt-3 pl-3 border-l-2 border-brand-border">
              "{todayCheckIn.note}"
            </p>
          )}
        </section>
      )}

      {/* ─── Main Grid: Burnout and Timeline ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1">
          <BurnoutRiskMeter score={riskData.score} subtitle={riskData.reason} />
        </div>
        <div className="lg:col-span-2">
          <MoodTimeline entries={studentMoodEntries} />
        </div>
      </div>

      {/* ─── Suggested Micro-Action ─── */}
      <section className="bg-white border border-brand-border rounded-2xl p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-semibold tracking-wider text-brand-text-secondary uppercase">
            Suggested Micro-Action
          </h3>
          <div className="flex items-center gap-1 text-[10px] text-brand-teal font-medium">
            <Heart className="w-3 h-3 fill-current" />
            <span>30s Quick Reset</span>
          </div>
        </div>
        <h4 className="text-lg font-heading text-brand-text mb-2">
          {suggestedAction.title}
        </h4>
        <p className="text-sm text-brand-text-secondary leading-relaxed mb-4">
          {suggestedAction.instruction}
        </p>
        <div className="flex items-center justify-between pt-4 border-t border-brand-border">
          <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-wide">
            {suggestedAction.trigger}
          </span>
          <button
            onClick={handleActionComplete}
            className="px-4 py-2 bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border border-brand-teal/30 hover:border-brand-teal/50 rounded-full text-xs font-semibold transition-all cursor-pointer active:scale-95"
          >
            Done ✓
          </button>
        </div>
      </section>
    </div>
  );
};
export default Dashboard;
