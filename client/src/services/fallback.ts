import { type IMicroAction, type TriggerType, type WeeklyPattern, type MoodScore, type MoodLabel, type IStudent, type IMoodEntry } from '../types';
import { toolkitMicroActions } from '../data/toolkit';

// Retrieve static micro-actions matching the trigger from toolkit.ts
export function getFallbackMicroActions(trigger: TriggerType): IMicroAction[] {
  const actions = toolkitMicroActions.filter(action => action.trigger === trigger);
  // Return at least 2 actions if possible, otherwise return a default action
  if (actions.length > 0) {
    return actions;
  }
  return [
    {
      trigger,
      title: 'Deep Breath Reset',
      instruction: 'Inhale deeply for 4 seconds, hold for 4 seconds, and exhale for 4 seconds. Focus on the sensation of breathing.',
      durationSeconds: 30
    }
  ];
}

// Generate a plausible WeeklyPattern structure for fallback
export function getFallbackPattern(
  moodScore: MoodScore,
  moodLabel: MoodLabel,
  trigger: TriggerType,
  note?: string
): WeeklyPattern {
  let riskScore = 50;
  if (moodScore === 1) riskScore = 85;
  else if (moodScore === 2) riskScore = 70;
  else if (moodScore === 3) riskScore = 45;
  else if (moodScore === 4) riskScore = 25;
  else if (moodScore === 5) riskScore = 10;

  let summary = `Currently experiencing ${moodLabel} mood states primarily triggered by ${trigger}.`;
  if (note) {
    summary += ` Note mentions: "${note}".`;
  } else {
    summary += ` Academic and exam scheduling pressures are primary drivers.`;
  }

  return {
    dominantMood: moodLabel,
    triggerHotspot: trigger,
    burnoutRiskScore: riskScore,
    weekSummary: summary,
    recommendedFocus: getFallbackFocus(trigger)
  };
}

// Helper: Focus guidance depending on the specific trigger
export function getFallbackFocus(trigger: TriggerType): string {
  switch (trigger) {
    case 'Syllabus pressure':
      return 'Micro-segmenting study targets to 25-minute Pomodoro sprints and closing secondary tabs.';
    case 'Mock test scores':
      return 'Mock analysis separation: categorizing errors conceptually rather than focusing on the score itself.';
    case 'Family expectations':
      return 'Creating psychological distance: reminding oneself that exam grades do not define family relationships.';
    case 'Comparison with peers':
      return 'Muting study discussion boards and focusing strictly on personal incremental daily improvements.';
    case 'Sleep issues':
      return 'Screen-free bedtime buffers and dumping tomorrow\'s anxieties onto a notepad before sleeping.';
    case 'Physical health':
      return 'Ergonomic intervals: stretching upper back and rotating neck/joints at the end of every study hour.';
    case 'Time management':
      return 'Single-tasking prioritization: selecting exactly one high-yield topic and setting a hard buffer zone.';
    case 'Result anxiety':
      return 'Cognitive decoupling: grounding thoughts in the present actions rather than catastrophic future thoughts.';
    default:
      return 'Resting the nervous system, deep breathing, and focusing on small inputs instead of outcomes.';
  }
}

// Generate a structured, comforting markdown report for Pattern Scout fallback
export function getFallbackPatternScoutReport(
  student: IStudent,
  moodHistory: IMoodEntry[],
  currentMood: MoodScore,
  currentLabel: MoodLabel,
  trigger: TriggerType,
  note?: string
): string {
  const examDate = new Date(student.examDate);
  const now = new Date();
  const diffTime = examDate.getTime() - now.getTime();
  const daysRemaining = Math.max(0, Math.ceil(diffTime / (1000 * 60 * 60 * 24)));

  let report = `### Fallback Pattern Analysis for ${student.name}\n\n`;
  report += `*Note: Running in offline / fallback mode due to connection timeout or key absence.*\n\n`;
  report += `Preparing for **${student.exam}** with **${daysRemaining} days** remaining is a high-pressure scenario. `;

  if (currentLabel === 'Overwhelmed' || currentLabel === 'Anxious') {
    report += `It is completely natural to experience **${currentLabel}** sensations. Competitive exam systems demand intense endurance, and your current reaction to **${trigger}** is fully valid.\n\n`;
  } else {
    report += `You are reporting a mood of **${currentLabel}** today, which is encouraging. Let's make sure we manage the subtle friction points around **${trigger}**.\n\n`;
  }

  report += `#### Cognitive Stress Pattern Observations:\n`;
  switch (trigger) {
    case 'Syllabus pressure':
      report += `- **The Complete-Syllabus Illusion**: Expecting yourself to master 100% of the chapters perfectly. This causes cognitive paralysis.\n`;
      report += `- **Task Hoarding**: Reading multiple chapters or looking at full study plans at once, causing a mental freeze.\n`;
      break;
    case 'Mock test scores':
      report += `- **Evaluation Distortion**: Equating mock scores with your actual capability or final outcome rather than treating them as diagnostic checklists.\n`;
      report += `- **Social Benchmark Filter**: Over-indexing on your peers' claimed test marks and overlooking your own baseline path.\n`;
      break;
    case 'Result anxiety':
      report += `- **Anticipatory Catastrophizing**: Spending study hours visualizing result sheets, which reduces focus on active recall exercises today.\n`;
      if (daysRemaining < 3) {
        report += `- **Pre-Exam Nerve Activation**: With only ${daysRemaining} days left, your nervous system is in flight mode. Physical calming is highly recommended.\n`;
      }
      break;
    default:
      report += `- **Cognitive Strain**: The pressure from ${trigger} is creating continuous background noise, leading to fatigue and reduced memory retention.\n`;
  }

  report += `\nRemember, your worth is not tied to a test score or rank. Protect your mental stamina.\n`;

  // Check safety/consecutive overwhelm
  const sorted = [...moodHistory].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
  const isOverwhelmed3Days =
    currentLabel === 'Overwhelmed' &&
    sorted.length >= 2 &&
    sorted.slice(0, 2).every(entry => entry.moodLabel === 'Overwhelmed');

  if (isOverwhelmed3Days) {
    report += `\n***\n\n**Counselor's Gentle Note:**\n`;
    report += `Hey ${student.name}, I see that you have checked in as Overwhelmed for 3 days in a row now. Preparing for ${student.exam} is a major journey, and this pressure is a heavy weight. Please talk to a trusted friend, family member, or a professional counselor. Getting these feelings out can lift a huge burden. We care about you beyond your scores. ❤️`;
  }

  return report;
}
