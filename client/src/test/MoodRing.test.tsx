import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MoodRing } from '../components/MoodRing';

describe('MoodRing', () => {
  it('renders all 5 mood options', () => {
    render(<MoodRing selectedScore={null} onChange={() => {}} />);
    
    // Should render buttons for all 5 mood levels
    const buttons = screen.getAllByRole('radio');
    expect(buttons).toHaveLength(5);
  });

  it('highlights the selected mood', () => {
    render(<MoodRing selectedScore={3} onChange={() => {}} />);
    
    const selectedButton = screen.getAllByRole('radio')[2]; // index 2 = score 3
    expect(selectedButton).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when a mood is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<MoodRing selectedScore={null} onChange={mockOnChange} />);
    
    const buttons = screen.getAllByRole('radio');
    await user.click(buttons[0]); // Click first mood (score 1)
    
    expect(mockOnChange).toHaveBeenCalledWith(1);
  });

  it('does not call onChange when disabled', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<MoodRing selectedScore={null} onChange={mockOnChange} disabled={true} />);
    
    const buttons = screen.getAllByRole('radio');
    await user.click(buttons[0]);
    
    expect(mockOnChange).not.toHaveBeenCalled();
  });
});
