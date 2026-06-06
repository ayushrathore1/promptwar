import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { BurnoutRiskMeter } from '../components/BurnoutRiskMeter';

describe('BurnoutRiskMeter', () => {
  it('renders the score as percentage', () => {
    render(<BurnoutRiskMeter score={72} />);
    expect(screen.getByText('72%')).toBeInTheDocument();
  });

  it('shows Low Risk label for scores below 30', () => {
    render(<BurnoutRiskMeter score={18} />);
    expect(screen.getByText('Low Risk')).toBeInTheDocument();
  });

  it('shows Moderate Risk label for scores 30-59', () => {
    render(<BurnoutRiskMeter score={45} />);
    expect(screen.getByText('Moderate Risk')).toBeInTheDocument();
  });

  it('shows High Risk label for scores 60-79', () => {
    render(<BurnoutRiskMeter score={72} />);
    expect(screen.getByText('High Risk')).toBeInTheDocument();
  });

  it('shows Severe Risk label for scores 80+', () => {
    render(<BurnoutRiskMeter score={88} />);
    expect(screen.getByText('Severe Risk')).toBeInTheDocument();
  });

  it('has accessible progressbar with aria attributes', () => {
    render(<BurnoutRiskMeter score={50} />);
    const progressbar = screen.getByRole('progressbar');
    expect(progressbar).toHaveAttribute('aria-valuenow', '50');
    expect(progressbar).toHaveAttribute('aria-valuemin', '0');
    expect(progressbar).toHaveAttribute('aria-valuemax', '100');
  });

  it('renders custom subtitle when provided', () => {
    render(<BurnoutRiskMeter score={70} subtitle="Custom burnout reason" />);
    expect(screen.getByText('Custom burnout reason')).toBeInTheDocument();
  });

  it('includes counselor nudge for severe scores (Safety requirement)', () => {
    render(<BurnoutRiskMeter score={85} />);
    const alertEl = screen.getByRole('alert');
    expect(alertEl).toBeInTheDocument();
    expect(alertEl).toHaveTextContent(/counseling/i);
  });
});
