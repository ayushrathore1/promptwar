import React, { useState, useMemo } from 'react';
import { MoodTimeline } from '../components/MoodTimeline';
import { BurnoutRiskMeter } from '../components/BurnoutRiskMeter';
import { type IStudent, type IMoodEntry, type MoodScore, MOOD_EMOJIS } from '../types';
import { Calendar, TrendingUp, AlertTriangle, Activity } from 'lucide-react';

interface HistoryProps {
  student: IStudent;
  moodEntries: IMoodEntry[];
}

const History: React.FC<HistoryProps> = ({ student, moodEntries }) => {
  const [selectedRange, setSelectedRange] = useState<'7d' | '14d'>('7d');

  const filteredEntries = useMemo(() => {
    const days = selectedRange === '7d' ? 7 : 14;
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return moodEntries.filter((e) => new Date(e.createdAt) >= cutoff);
  }, [moodEntries, selectedRange]);

  const analytics = useMemo(() => {
    if (filteredEntries.length === 0) {
      return { avgMood: 0, dominantTrigger: 'None', overwhelmedDays: 0, calmDays: 0, burnoutRisk: 15, burnoutReason: 'Start logging to see your patterns.', trend: 'neutral' as const };
    }

    const avgMood = filteredEntries.reduce((s, e) => s + e.moodScore, 0) / filteredEntries.length;
    const triggerCounts: Record<string, number> = {};
    filteredEntries.forEach((e) => { triggerCounts[e.trigger] = (triggerCounts[e.trigger] || 0) + 1; });
    const dominantTrigger = Object.entries(triggerCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || 'None';
    const overwhelmedDays = filteredEntries.filter((e) => e.moodScore === 1).length;
    const calmDays = filteredEntries.filter((e) => e.moodScore >= 4).length;

    let burnoutRisk = 15, burnoutReason = 'Low risk. Your routine looks balanced.';
    let consecutiveOverwhelmed = 0, maxConsecutive = 0;
    for (const entry of filteredEntries.slice(0, 7)) {
      if (entry.moodScore === 1) { consecutiveOverwhelmed++; maxConsecutive = Math.max(maxConsecutive, consecutiveOverwhelmed); }
      else { consecutiveOverwhelmed = 0; }
    }
    if (maxConsecutive >= 3) { burnoutRisk = 88; burnoutReason = `Critical: ${maxConsecutive} consecutive Overwhelmed days.`; }
    else if (avgMood <= 2) { burnoutRisk = 72; burnoutReason = `High stress: "${dominantTrigger}" is your pressure point.`; }
    else if (avgMood <= 3.2) { burnoutRisk = 48; burnoutReason = `Moderate: "${dominantTrigger}" needs attention.`; }
    else { burnoutRisk = 18; burnoutReason = 'Your preparation rhythm looks healthy.'; }

    const recent3 = filteredEntries.slice(0, 3);
    const older3 = filteredEntries.slice(3, 6);
    const recentAvg = recent3.length > 0 ? recent3.reduce((s, e) => s + e.moodScore, 0) / recent3.length : 3;
    const olderAvg = older3.length > 0 ? older3.reduce((s, e) => s + e.moodScore, 0) / older3.length : 3;
    const trend = recentAvg > olderAvg + 0.3 ? ('up' as const) : recentAvg < olderAvg - 0.3 ? ('down' as const) : ('neutral' as const);

    return { avgMood, dominantTrigger, overwhelmedDays, calmDays, burnoutRisk, burnoutReason, trend };
  }, [filteredEntries]);

  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-heading text-brand-text">Mood History</h2>
          <p className="text-xs text-brand-text-secondary mt-0.5">{student.name} — {student.exam} preparation</p>
        </div>
        <div className="flex gap-2" aria-label="Time range selector">
          {(['7d', '14d'] as const).map((range) => (
            <button key={range} aria-pressed={selectedRange === range} onClick={() => setSelectedRange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-full transition-all cursor-pointer ${
                selectedRange === range ? 'bg-brand-dark text-white' : 'bg-white border border-brand-border text-brand-text-secondary hover:text-brand-text'
              }`}>
              {range === '7d' ? '7 Days' : '14 Days'}
            </button>
          ))}
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm card-hover">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-4 h-4 text-brand-primary" />
            <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-wider">Avg Mood</span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-heading text-brand-text">{analytics.avgMood > 0 ? analytics.avgMood.toFixed(1) : '—'}</span>
            <span className="text-lg">{analytics.avgMood > 0 ? MOOD_EMOJIS[Math.round(analytics.avgMood) as MoodScore] : ''}</span>
            {analytics.trend !== 'neutral' && (
              <TrendingUp className={`w-4 h-4 ${analytics.trend === 'up' ? 'text-brand-teal' : 'text-brand-coral rotate-180'}`} />
            )}
          </div>
        </div>
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm card-hover">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4 text-brand-amber" />
            <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-wider">Top Trigger</span>
          </div>
          <p className="text-sm font-semibold text-brand-text leading-snug">{analytics.dominantTrigger}</p>
        </div>
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm card-hover">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">😰</span>
            <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-wider">Overwhelmed</span>
          </div>
          <span className="text-2xl font-heading text-brand-coral">{analytics.overwhelmedDays}</span>
          <span className="text-xs text-brand-text-secondary ml-1">days</span>
        </div>
        <div className="bg-white border border-brand-border rounded-2xl p-4 shadow-sm card-hover">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-base">😌</span>
            <span className="text-[10px] font-semibold text-brand-text-secondary uppercase tracking-wider">Calm Days</span>
          </div>
          <span className="text-2xl font-heading text-brand-teal">{analytics.calmDays}</span>
          <span className="text-xs text-brand-text-secondary ml-1">days</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-1"><BurnoutRiskMeter score={analytics.burnoutRisk} subtitle={analytics.burnoutReason} /></div>
        <div className="lg:col-span-2"><MoodTimeline entries={filteredEntries} /></div>
      </div>

      {filteredEntries.length > 0 && (
        <div className="bg-white border border-brand-border rounded-2xl p-5 overflow-x-auto shadow-sm">
          <h3 className="text-base font-heading text-brand-text mb-4">Recent Check-ins</h3>
          <table className="w-full text-xs" role="table">
            <thead>
              <tr className="text-brand-text-secondary border-b border-brand-border">
                <th className="text-left pb-2 font-semibold" scope="col">Date</th>
                <th className="text-left pb-2 font-semibold" scope="col">Mood</th>
                <th className="text-left pb-2 font-semibold" scope="col">Trigger</th>
                <th className="text-left pb-2 font-semibold hidden sm:table-cell" scope="col">Note</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.slice(0, 10).map((entry, idx) => (
                <tr key={entry._id || idx} className="border-b border-brand-border/50 hover:bg-brand-bg/50 transition-colors">
                  <td className="py-2.5 text-brand-text-secondary">
                    <Calendar className="w-3 h-3 inline mr-1 text-gray-400" />
                    {new Date(entry.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'short' })}
                  </td>
                  <td className="py-2.5">
                    <span className="inline-flex items-center gap-1">
                      <span>{MOOD_EMOJIS[entry.moodScore]}</span>
                      <span className="text-brand-text font-medium">{entry.moodLabel}</span>
                    </span>
                  </td>
                  <td className="py-2.5 text-brand-text-secondary">{entry.trigger}</td>
                  <td className="py-2.5 text-brand-text-secondary italic max-w-[200px] truncate hidden sm:table-cell">{entry.note || '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {filteredEntries.length === 0 && (
        <div className="flex flex-col items-center justify-center py-16 text-center space-y-4">
          <img src="/empty-state.png" alt="Peaceful scene" className="w-40 h-40 object-contain opacity-80" />
          <h3 className="text-xl font-heading text-brand-text">Your story starts today</h3>
          <p className="text-xs text-brand-text-secondary max-w-sm">
            Start logging your mood daily to see patterns and track your wellness through {student.exam} preparation.
          </p>
        </div>
      )}
    </div>
  );
};

export default History;
