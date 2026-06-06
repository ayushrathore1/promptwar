import React, { useState, useEffect, useRef } from 'react';
import {
  Brain,
  Activity,
  Sparkles,
  AlertTriangle,
  User,
  Calendar,
  Play,
  RotateCcw,
  CheckCircle
} from 'lucide-react';
import type { IStudent, IMoodEntry, MoodScore, MoodLabel, TriggerType, WeeklyPattern } from '../types';
import { runWellnessOrchestrator } from '../services/orchestrator';
import MindScanPanel from './MindScanPanel';

interface WellnessMissionControlProps {
  student: IStudent;
  moodHistory: IMoodEntry[];
  currentEntry: {
    moodScore: MoodScore;
    moodLabel: MoodLabel;
    trigger: TriggerType;
    note?: string;
  };
  onScanComplete?: (result: {
    patternReport: string;
    weeklyPattern: WeeklyPattern;
    coachReport: string;
  }) => void;
}

export const WellnessMissionControl: React.FC<WellnessMissionControlProps> = ({
  student,
  moodHistory,
  currentEntry,
  onScanComplete
}) => {
  // --- State Management ---
  const [isScanning, setIsScanning] = useState(false);
  const [scanAttempted, setScanAttempted] = useState(false);

  // Agent Statuses
  const [agentStatuses, setAgentStatuses] = useState({
    patternScout: 'pending' as 'pending' | 'running' | 'complete' | 'error',
    burnoutAnalyst: 'pending' as 'pending' | 'running' | 'complete' | 'error',
    microCoach: 'pending' as 'pending' | 'running' | 'complete' | 'error',
  });

  // Agent Results
  const [patternScoutText, setPatternScoutText] = useState('');
  const [microCoachText, setMicroCoachText] = useState('');
  const [burnoutData, setBurnoutData] = useState<WeeklyPattern | null>(null);

  // Breathing Coach Timer States
  const [breathingActive, setBreathingActive] = useState(false);
  const [breathingPhase, setBreathingPhase] = useState<'In' | 'Hold1' | 'Out' | 'Hold2'>('In');
  const [breathSecondsLeft, setBreathSecondsLeft] = useState(30);
  const [breathingDone, setBreathingDone] = useState(false);

  const breathTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const phaseTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const daysRemaining = Math.max(0, Math.ceil(
    (new Date(student.examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24)
  ));

  // --- Trigger Scan ---
  const handleInitiateScan = async () => {
    if (isScanning) return;

    // Reset states
    setIsScanning(true);
    setScanAttempted(true);
    setPatternScoutText('');
    setMicroCoachText('');
    setBurnoutData(null);
    setBreathingActive(false);
    setBreathingDone(false);
    
    setAgentStatuses({
      patternScout: 'pending',
      burnoutAnalyst: 'pending',
      microCoach: 'pending',
    });

    try {
      const orchestratorResult = await runWellnessOrchestrator(
        student,
        moodHistory,
        currentEntry,
        {
          onStatusChange: (agent, status, res) => {
            setAgentStatuses(prev => ({ ...prev, [agent]: status }));
            if (agent === 'burnoutAnalyst' && status === 'complete') {
              setBurnoutData(res as WeeklyPattern);
            }
          },
          onPatternScoutToken: token => {
            setPatternScoutText(prev => prev + token);
          },
          onMicroCoachToken: token => {
            setMicroCoachText(prev => prev + token);
          },
        }
      );

      // Verify overall success
      const patternReport = orchestratorResult.patternScout.result || '';
      const weeklyPattern = orchestratorResult.burnoutAnalyst.result as WeeklyPattern;
      const coachReport = orchestratorResult.microCoach.result || '';

      setIsScanning(false);

      if (onScanComplete) {
        onScanComplete({
          patternReport,
          weeklyPattern,
          coachReport,
        });
      }
    } catch (err) {
      console.error('Orchestrator execution error:', err);
      setIsScanning(false);
      setAgentStatuses({
        patternScout: 'error',
        burnoutAnalyst: 'error',
        microCoach: 'error',
      });
    }
  };

  // --- Interactive Breathing Timer Effect ---
  useEffect(() => {
    if (breathingActive) {
      setBreathSecondsLeft(30);
      setBreathingDone(false);
      setBreathingPhase('In');

      // 30 Seconds Countdown Timer
      breathTimerRef.current = setInterval(() => {
        setBreathSecondsLeft(prev => {
          if (prev <= 1) {
            clearInterval(breathTimerRef.current!);
            setBreathingActive(false);
            setBreathingDone(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // 4-7-8 Breathing Cycle Simulation: In (4s) -> Hold (4s) -> Out (4s) -> Hold (4s)
      let currentPhase: 'In' | 'Hold1' | 'Out' | 'Hold2' = 'In';
      const cycleInterval = () => {
        if (currentPhase === 'In') {
          currentPhase = 'Hold1';
        } else if (currentPhase === 'Hold1') {
          currentPhase = 'Out';
        } else if (currentPhase === 'Out') {
          currentPhase = 'Hold2';
        } else {
          currentPhase = 'In';
        }
        setBreathingPhase(currentPhase);

        // Schedule next phase change depending on timing:
        // Inhale 4s, Hold 4s, Exhale 4s, Hold 4s (using simple 4s intervals for demo loop consistency)
        phaseTimerRef.current = setTimeout(cycleInterval, 4000);
      };

      phaseTimerRef.current = setTimeout(cycleInterval, 4000);
    } else {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    }

    return () => {
      if (breathTimerRef.current) clearInterval(breathTimerRef.current);
      if (phaseTimerRef.current) clearTimeout(phaseTimerRef.current);
    };
  }, [breathingActive]);

  const handleStartBreathing = () => {
    setBreathingActive(true);
  };

  const handleStopBreathing = () => {
    setBreathingActive(false);
  };

  // --- Render Status Dot ---
  const renderStatusDot = (status: 'pending' | 'running' | 'complete' | 'error') => {
    switch (status) {
      case 'running':
        return (
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
        );
      case 'complete':
        return <span className="h-2 w-2 rounded-full bg-brand-teal shadow-[0_0_8px_var(--color-brand-teal)]" />;
      case 'error':
        return <span className="h-2 w-2 rounded-full bg-brand-coral shadow-[0_0_8px_var(--color-brand-coral)] animate-pulse" />;
      case 'pending':
      default:
        return <span className="h-2 w-2 rounded-full bg-gray-600" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-4 md:p-6 space-y-6">
      
      {/* ─── Header Section ─── */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between p-6 bg-brand-surface border border-brand-border rounded-2xl gap-4 shadow-xl">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="flex h-3.5 w-3.5 items-center justify-center rounded-full bg-brand-primary/10 border border-brand-primary/30">
              <span className="h-1.5 w-1.5 rounded-full bg-brand-primary animate-pulse" />
            </span>
            <span className="text-[10px] font-bold tracking-widest uppercase text-brand-primary font-heading">
              System Dashboard
            </span>
          </div>
          <h2 className="text-xl md:text-2xl font-heading font-bold text-brand-text tracking-wide">
            Wellness Mission Control
          </h2>
          <p className="text-xs text-brand-text-secondary font-sans">
            Orchestrating Pattern Scout, Burnout Analyst, and Micro-Coach in parallel.
          </p>
        </div>

        {/* Student Mini Card */}
        <div className="flex items-center gap-4 bg-brand-bg/60 border border-brand-border px-4 py-3 rounded-xl w-full md:w-auto">
          <div className="h-9 w-9 rounded-lg bg-brand-surface border border-brand-border flex items-center justify-center text-brand-primary">
            <User className="w-5 h-5" />
          </div>
          <div className="text-left font-sans">
            <div className="text-xs font-semibold text-brand-text">{student.name}</div>
            <div className="text-[10px] text-brand-text-secondary mt-0.5 flex items-center gap-2">
              <span className="bg-brand-primary/10 text-brand-primary px-1.5 py-0.2 rounded font-medium border border-brand-primary/10">
                {student.exam}
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5">
                <Calendar className="w-2.5 h-2.5" />
                {daysRemaining} Days Left
              </span>
              <span>•</span>
              <span className="flex items-center gap-0.5 text-brand-amber font-semibold">
                🔥 {student.streak} check-in streak
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Control Console & Agent Pulse Statuses ─── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Core Control Button Panel */}
        <div className="lg:col-span-1 bg-brand-surface border border-brand-border p-5 rounded-2xl flex flex-col justify-between shadow-lg h-full min-h-[160px]">
          <div className="space-y-1">
            <h5 className="text-xs font-heading font-semibold tracking-wider text-brand-text-secondary uppercase">
              Orchestrator Control
            </h5>
            <p className="text-xs text-brand-text-secondary">
              Launch three specialized sub-agents in parallel to check status parameters.
            </p>
          </div>
          
          <button
            onClick={handleInitiateScan}
            disabled={isScanning}
            className={`
              w-full py-3 px-4 rounded-xl font-heading font-semibold text-sm transition-all duration-200 cursor-pointer
              flex items-center justify-center gap-2 border shadow-lg mt-4
              ${isScanning 
                ? 'bg-brand-primary/10 border-brand-primary/20 text-brand-primary/70 animate-pulse cursor-not-allowed'
                : 'bg-brand-primary hover:bg-brand-primary/95 text-white border-brand-primary hover:shadow-[0_0_15px_rgba(66,133,244,0.4)] active:scale-95'
              }
            `}
          >
            {isScanning ? (
              <>
                <div className="w-4 h-4 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
                Running Parallel Diagnostics...
              </>
            ) : (
              <>
                <Play className="w-4 h-4 fill-current" />
                Initiate AI Mind Scan
              </>
            )}
          </button>
        </div>

        {/* Live Agent Monitoring Lights */}
        <div className="lg:col-span-2 bg-brand-surface border border-brand-border p-5 rounded-2xl shadow-lg flex flex-col justify-between">
          <h5 className="text-xs font-heading font-semibold tracking-wider text-brand-text-secondary uppercase mb-3">
            Agent Status Monitor
          </h5>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 flex-1">
            {/* Agent 1 */}
            <div className="bg-brand-bg/50 border border-brand-border/60 rounded-xl p-3.5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-heading font-semibold text-brand-text">
                  <Brain className="w-3.5 h-3.5 text-brand-primary" />
                  Pattern Scout
                </div>
                {renderStatusDot(agentStatuses.patternScout)}
              </div>
              <p className="text-[10px] text-brand-text-secondary font-sans leading-relaxed">
                Empathetic analysis of cognitive distortions & trends.
              </p>
              <div className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-wider mt-1">
                State: {agentStatuses.patternScout}
              </div>
            </div>

            {/* Agent 2 */}
            <div className="bg-brand-bg/50 border border-brand-border/60 rounded-xl p-3.5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-heading font-semibold text-brand-text">
                  <Activity className="w-3.5 h-3.5 text-brand-amber" />
                  Burnout Analyst
                </div>
                {renderStatusDot(agentStatuses.burnoutAnalyst)}
              </div>
              <p className="text-[10px] text-brand-text-secondary font-sans leading-relaxed">
                Calculates burnout indices, hotspots & focal areas.
              </p>
              <div className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-wider mt-1">
                State: {agentStatuses.burnoutAnalyst}
              </div>
            </div>

            {/* Agent 3 */}
            <div className="bg-brand-bg/50 border border-brand-border/60 rounded-xl p-3.5 flex flex-col justify-between gap-2">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-heading font-semibold text-brand-text">
                  <Sparkles className="w-3.5 h-3.5 text-brand-teal" />
                  Micro-Coach
                </div>
                {renderStatusDot(agentStatuses.microCoach)}
              </div>
              <p className="text-[10px] text-brand-text-secondary font-sans leading-relaxed">
                Formulates 30-60s focus, breathing & reset exercises.
              </p>
              <div className="text-[9px] font-mono text-brand-text-secondary uppercase tracking-wider mt-1">
                State: {agentStatuses.microCoach}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ─── Active Scanning Outputs ─── */}
      {scanAttempted && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* Column 1: Pattern Scout Stream Panel */}
          <div className="w-full">
            <MindScanPanel
              title="Pattern Scout Analysis"
              icon={<Brain className="w-4 h-4 text-brand-primary" />}
              text={patternScoutText}
              isStreaming={agentStatuses.patternScout === 'running'}
              isComplete={agentStatuses.patternScout === 'complete'}
              status={agentStatuses.patternScout}
              accentClass="border-brand-primary"
              bgGlowClass="shadow-[0_0_15px_rgba(66,133,244,0.08)]"
            >
              <div className="text-[10px] text-gray-400 flex items-center justify-between font-sans">
                <span>Metrics: {patternScoutText.split(/\s+/).filter(Boolean).length} tokens analyzed</span>
                <span className="text-brand-primary">Cognitive Scan Synced</span>
              </div>
            </MindScanPanel>
          </div>

          {/* Column 2: Burnout Metrics & Micro-Coach actions */}
          <div className="space-y-6">
            
            {/* Burnout Risk Card */}
            {agentStatuses.burnoutAnalyst !== 'pending' && (
              <div className="bg-brand-surface border border-brand-border rounded-2xl p-5 shadow-xl space-y-4">
                <div className="flex items-center justify-between border-b border-brand-border border-opacity-30 pb-3">
                  <div className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-brand-amber" />
                    <h4 className="text-sm font-heading font-semibold text-brand-text">
                      Burnout Diagnostic Report
                    </h4>
                  </div>
                  {agentStatuses.burnoutAnalyst === 'running' && (
                    <div className="w-3.5 h-3.5 border-2 border-brand-amber border-t-transparent rounded-full animate-spin" />
                  )}
                </div>

                {burnoutData ? (
                  <div className="space-y-4 font-sans">
                    {/* Metrics Section */}
                    <div className="flex items-center gap-6">
                      
                      {/* Circular Gauge */}
                      <div className="relative flex items-center justify-center w-24 h-24 flex-shrink-0">
                        <svg className="w-full h-full transform -rotate-90">
                          {/* Background Track */}
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            strokeWidth="6"
                            stroke="var(--color-brand-border)"
                            fill="transparent"
                          />
                          {/* Progress Arc */}
                          <circle
                            cx="48"
                            cy="48"
                            r="40"
                            strokeWidth="6"
                            stroke={
                              burnoutData.burnoutRiskScore > 70
                                ? 'var(--color-brand-coral)'
                                : burnoutData.burnoutRiskScore > 35
                                ? 'var(--color-brand-amber)'
                                : 'var(--color-brand-teal)'
                            }
                            fill="transparent"
                            strokeDasharray={2 * Math.PI * 40}
                            strokeDashoffset={
                              2 * Math.PI * 40 * (1 - burnoutData.burnoutRiskScore / 100)
                            }
                            className="transition-all duration-1000 ease-out"
                            strokeLinecap="round"
                          />
                        </svg>
                        
                        {/* Text inside circle */}
                        <div className="absolute flex flex-col items-center justify-center text-center">
                          <span className="text-xl font-heading font-bold text-brand-text leading-none">
                            {burnoutData.burnoutRiskScore}%
                          </span>
                          <span className="text-[8px] text-brand-text-secondary uppercase tracking-widest font-semibold mt-1">
                            Risk
                          </span>
                        </div>
                      </div>

                      {/* Diagnostic details */}
                      <div className="flex-1 space-y-2">
                        <div className="grid grid-cols-2 gap-2 text-xs">
                          <div>
                            <span className="text-brand-text-secondary block text-[9px] uppercase tracking-wider">Dominant Mood</span>
                            <span className="font-semibold text-brand-text">{burnoutData.dominantMood}</span>
                          </div>
                          <div>
                            <span className="text-brand-text-secondary block text-[9px] uppercase tracking-wider">Trigger Hotspot</span>
                            <span className="font-semibold text-brand-text">{burnoutData.triggerHotspot}</span>
                          </div>
                        </div>

                        <div>
                          <span className="text-brand-text-secondary block text-[9px] uppercase tracking-wider mb-0.5">Recommended Focus</span>
                          <span className="text-xs font-semibold text-brand-primary">{burnoutData.recommendedFocus}</span>
                        </div>
                      </div>
                    </div>

                    {/* Brief Summary */}
                    <div className="bg-brand-bg/40 border border-brand-border rounded-xl p-3 text-xs text-brand-text-secondary leading-relaxed">
                      {burnoutData.weekSummary}
                    </div>

                    {/* Counselor Warning Nudge (Strict safety requirement if score > 70) */}
                    {burnoutData.burnoutRiskScore > 70 && (
                      <div className="flex items-start gap-2.5 p-3 rounded-xl border border-brand-coral/30 bg-brand-coral/5 text-brand-coral text-xs">
                        <AlertTriangle className="w-4 h-4 text-brand-coral mt-0.5 flex-shrink-0 animate-bounce" />
                        <div>
                          <span className="font-semibold block mb-0.5">Burnout Threshold Crossed (&gt;70%)</span>
                          Pressure index is elevated. We strongly encourage talking to someone today—whether it's a mentor, counselor, or friend. Talking helps decouple exam anxiety.
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-center py-10 text-xs text-gray-500 font-sans">
                    Awaiting analyst diagnostic parameters...
                  </div>
                )}
              </div>
            )}

            {/* Micro-Coach Actions Stream Panel */}
            <div className="w-full">
              <MindScanPanel
                title="Micro-Coach Actions"
                icon={<Sparkles className="w-4 h-4 text-brand-teal" />}
                text={microCoachText}
                isStreaming={agentStatuses.microCoach === 'running'}
                isComplete={agentStatuses.microCoach === 'complete'}
                status={agentStatuses.microCoach}
                accentClass="border-brand-teal"
                bgGlowClass="shadow-[0_0_15px_rgba(29,184,164,0.08)]"
              >
                {/* Extra contents: Interactive Breath Trainer */}
                <div className="flex flex-col gap-3 font-sans w-full">
                  {!breathingActive && !breathingDone && (
                    <button
                      onClick={handleStartBreathing}
                      className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-xs font-semibold bg-brand-teal/10 hover:bg-brand-teal/20 text-brand-teal border border-brand-teal/20 hover:border-brand-teal/30 cursor-pointer transition-all active:scale-95"
                    >
                      <Play className="w-3.5 h-3.5 fill-current" />
                      Trigger Interactive Breath Reset (30s)
                    </button>
                  )}

                  {/* Active Breathing Coach Interface */}
                  {breathingActive && (
                    <div className="flex items-center gap-4 bg-brand-bg/80 border border-brand-teal/30 p-3 rounded-xl w-full">
                      
                      {/* Pulse Circle Indicator */}
                      <div className="relative flex items-center justify-center w-12 h-12 flex-shrink-0">
                        <div
                          className={`
                            absolute rounded-full border border-brand-teal transition-all duration-[4000ms] ease-in-out
                            ${
                              breathingPhase === 'In'
                                ? 'w-12 h-12 bg-brand-teal/20 scale-125'
                                : breathingPhase === 'Out'
                                ? 'w-6 h-6 bg-brand-teal/5 scale-75'
                                : 'w-10 h-10 bg-brand-teal/10'
                            }
                          `}
                        />
                        <span className="text-[10px] font-bold text-brand-text z-10">
                          {breathSecondsLeft}s
                        </span>
                      </div>

                      {/* Instructions */}
                      <div className="flex-1 text-left">
                        <div className="text-xs font-semibold text-brand-text">
                          {breathingPhase === 'In' && '🌬️ Breathe in slowly...'}
                          {breathingPhase === 'Hold1' && '🛑 Hold your breath...'}
                          {breathingPhase === 'Out' && '💨 Breathe out completely...'}
                          {breathingPhase === 'Hold2' && '🛑 Hold empty...'}
                        </div>
                        <div className="text-[9px] text-brand-text-secondary mt-0.5">
                          Somatic feedback: grounding heart-rate coherence.
                        </div>
                      </div>

                      <button
                        onClick={handleStopBreathing}
                        className="py-1 px-2.5 rounded bg-brand-surface text-brand-text-secondary border border-brand-border text-[9px] font-semibold hover:text-brand-text cursor-pointer active:scale-95"
                      >
                        Cancel
                      </button>
                    </div>
                  )}

                  {/* Breathing Done State */}
                  {breathingDone && (
                    <div className="flex items-center gap-3 bg-brand-teal/5 border border-brand-teal/20 p-3 rounded-xl w-full text-left">
                      <CheckCircle className="w-5 h-5 text-brand-teal flex-shrink-0" />
                      <div className="flex-1">
                        <div className="text-xs font-semibold text-brand-text">Breath Reset Complete!</div>
                        <div className="text-[9px] text-brand-text-secondary mt-0.5">
                          Nervous system anchored. Keep study sessions micro-focused.
                        </div>
                      </div>
                      <button
                        onClick={handleStartBreathing}
                        className="p-1 rounded hover:bg-brand-surface text-brand-text-secondary hover:text-brand-text transition-colors cursor-pointer"
                        title="Restart timer"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}
                </div>
              </MindScanPanel>
            </div>

          </div>

        </div>
      )}

    </div>
  );
};

export default WellnessMissionControl;
