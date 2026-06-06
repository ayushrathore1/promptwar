import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { StreakBadge } from '../components/StreakBadge';

describe('StreakBadge', () => {
  it('renders 0 day streak with start check-in prompt', () => {
    render(<StreakBadge streak={0} />);
    expect(screen.getByText('0 Days')).toBeInTheDocument();
  });

  it('renders warm streak for 1-3 days', () => {
    render(<StreakBadge streak={2} />);
    expect(screen.getByText('2 Days')).toBeInTheDocument();
    expect(screen.getByText('Warm streak!')).toBeInTheDocument();
  });

  it('renders on-fire state for 4-7 days', () => {
    render(<StreakBadge streak={5} />);
    expect(screen.getByText('5 Days')).toBeInTheDocument();
    expect(screen.getByText('On Fire!')).toBeInTheDocument();
  });

  it('renders unstoppable state for 8+ days', () => {
    render(<StreakBadge streak={12} />);
    expect(screen.getByText('12 Days')).toBeInTheDocument();
    expect(screen.getByText('Unstoppable!')).toBeInTheDocument();
  });

  it('has correct aria-label for accessibility', () => {
    render(<StreakBadge streak={5} />);
    const element = screen.getByRole('status');
    expect(element).toHaveAttribute('aria-label', expect.stringContaining('5 days'));
  });

  it('renders singular "Day" for streak of 1', () => {
    render(<StreakBadge streak={1} />);
    expect(screen.getByText('1 Day')).toBeInTheDocument();
  });
});
