import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { TriggerWheel } from '../components/TriggerWheel';

describe('TriggerWheel', () => {
  it('renders both desktop and mobile trigger options (16 total)', () => {
    render(<TriggerWheel selectedTrigger={null} onChange={() => {}} />);
    
    const buttons = screen.getAllByRole('radio');
    expect(buttons).toHaveLength(16);
  });

  it('marks both desktop and mobile selected triggers as checked', () => {
    render(<TriggerWheel selectedTrigger="Sleep issues" onChange={() => {}} />);
    
    const elements = screen.getAllByRole('radio', { name: /sleep issues/i });
    expect(elements).toHaveLength(2);
    expect(elements[0]).toHaveAttribute('aria-checked', 'true');
    expect(elements[1]).toHaveAttribute('aria-checked', 'true');
  });

  it('calls onChange when a trigger is clicked', async () => {
    const user = userEvent.setup();
    const mockOnChange = vi.fn();
    
    render(<TriggerWheel selectedTrigger={null} onChange={mockOnChange} />);
    
    // Click the desktop version
    const buttons = screen.getAllByRole('radio', { name: /syllabus pressure/i });
    await user.click(buttons[0]);
    
    expect(mockOnChange).toHaveBeenCalledWith('Syllabus pressure');
  });
});
