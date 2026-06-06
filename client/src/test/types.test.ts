import { describe, it, expect } from 'vitest';
import {
  TRIGGER_TYPES,
  MOOD_LABELS,
  MOOD_EMOJIS,
  EXAM_TYPES,
} from '../types';

describe('Type Constants', () => {
  it('has exactly 8 trigger types relevant to Indian exam context', () => {
    expect(TRIGGER_TYPES).toHaveLength(8);
    expect(TRIGGER_TYPES).toContain('Syllabus pressure');
    expect(TRIGGER_TYPES).toContain('Mock test scores');
    expect(TRIGGER_TYPES).toContain('Family expectations');
    expect(TRIGGER_TYPES).toContain('Comparison with peers');
    expect(TRIGGER_TYPES).toContain('Sleep issues');
    expect(TRIGGER_TYPES).toContain('Physical health');
    expect(TRIGGER_TYPES).toContain('Time management');
    expect(TRIGGER_TYPES).toContain('Result anxiety');
  });

  it('has 5 mood labels from Overwhelmed to Calm', () => {
    expect(MOOD_LABELS).toHaveLength(5);
    expect(MOOD_LABELS[0]).toBe('Overwhelmed');
    expect(MOOD_LABELS[4]).toBe('Calm');
  });

  it('maps all 5 mood scores to emojis', () => {
    expect(Object.keys(MOOD_EMOJIS)).toHaveLength(5);
    expect(MOOD_EMOJIS[1]).toBe('😰');
    expect(MOOD_EMOJIS[5]).toBe('😌');
  });

  it('supports major Indian competitive exams', () => {
    expect(EXAM_TYPES).toContain('NEET');
    expect(EXAM_TYPES).toContain('JEE');
    expect(EXAM_TYPES).toContain('CUET');
    expect(EXAM_TYPES).toContain('CAT');
    expect(EXAM_TYPES).toContain('GATE');
    expect(EXAM_TYPES).toContain('UPSC');
  });
});
