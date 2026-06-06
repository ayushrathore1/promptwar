import React, { useEffect, useState } from 'react';

interface BurnoutRiskMeterProps {
  score: number; // 0 to 100
  title?: string;
  subtitle?: string;
}

export const BurnoutRiskMeter: React.FC<BurnoutRiskMeterProps> = ({
  score,
  title = 'Burnout Risk',
  subtitle,
}) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(Math.max(0, Math.min(score, 100)));
    }, 100);
    return () => clearTimeout(timer);
  }, [score]);

  const radius = 70;
  const strokeWidth = 12;
  const cx = 100;
  const cy = 100;
  const pathLength = Math.PI * radius;
  const strokeDashoffset = pathLength - (progress / 100) * pathLength;

  const getRiskDetails = (val: number) => {
    if (val < 30) {
      return {
        label: 'Low Risk',
        colorClass: 'text-brand-teal',
        strokeColor: '#1DB8A4',
        bgClass: 'bg-brand-teal/8',
        borderClass: 'border-brand-teal/15',
        message: 'Healthy study-life balance. Keep maintaining these habits!',
      };
    } else if (val < 60) {
      return {
        label: 'Moderate Risk',
        colorClass: 'text-brand-primary',
        strokeColor: '#4A7AE5',
        bgClass: 'bg-brand-primary/8',
        borderClass: 'border-brand-primary/15',
        message: 'Some stress signals detected. Consider taking regular breaks.',
      };
    } else if (val < 80) {
      return {
        label: 'High Risk',
        colorClass: 'text-brand-amber',
        strokeColor: '#E8A838',
        bgClass: 'bg-brand-amber/8',
        borderClass: 'border-brand-amber/15',
        message: 'High pressure levels. Prioritize sleep and connect with peers.',
      };
    } else {
      return {
        label: 'Severe Risk',
        colorClass: 'text-brand-coral',
        strokeColor: '#E05A4F',
        bgClass: 'bg-brand-coral/8',
        borderClass: 'border-brand-coral/15',
        message: 'Critical burnout indicators. Seek academic support or counseling.',
      };
    }
  };

  const risk = getRiskDetails(score);

  return (
    <div className="flex flex-col p-6 bg-white border border-brand-border rounded-2xl w-full max-w-sm mx-auto shadow-sm">
      <h3 className="text-base font-heading text-brand-text mb-1">
        {title}
      </h3>
      <p className="text-xs text-brand-text-secondary mb-6">
        {subtitle || 'Based on recent check-ins and trigger indicators.'}
      </p>

      {/* Gauge Visualizer */}
      <div className="relative flex flex-col items-center justify-center h-40 w-full" role="presentation">
        <svg
          viewBox="0 0 200 120"
          className="w-full max-w-[240px]"
          aria-hidden="true"
        >
          <defs>
            <filter id="shadow" x="-10%" y="-10%" width="120%" height="130%">
              <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor={risk.strokeColor} floodOpacity="0.25" />
            </filter>
          </defs>

          {/* Background Track */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke="#E8EBF0"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
          />

          {/* Animated Fill Path */}
          <path
            d={`M ${cx - radius} ${cy} A ${radius} ${radius} 0 0 1 ${cx + radius} ${cy}`}
            fill="none"
            stroke={risk.strokeColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={pathLength}
            strokeDashoffset={strokeDashoffset}
            filter="url(#shadow)"
            style={{
              transition: 'stroke-dashoffset 1.2s cubic-bezier(0.25, 1, 0.5, 1), stroke 0.5s ease',
            }}
          />
        </svg>

        <div className="absolute bottom-2 flex flex-col items-center justify-center text-center">
          <span
            className="text-4xl font-heading text-brand-text tracking-tight"
            aria-live="polite"
            role="progressbar"
            aria-valuenow={score}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={`Burnout risk level score is ${score}%`}
          >
            {score}%
          </span>
          <span className={`text-sm font-semibold ${risk.colorClass} tracking-wide mt-0.5`}>
            {risk.label}
          </span>
        </div>
      </div>

      {/* Contextual Warning Banner */}
      <div
        className={`flex items-start gap-3 p-3 mt-4 rounded-xl border text-left transition-colors duration-300 ${risk.bgClass} ${risk.borderClass}`}
        role="alert"
        aria-live="assertive"
      >
        <div className="flex-grow">
          <p className="text-[11px] text-brand-text-secondary leading-relaxed">
            {risk.message}
          </p>
        </div>
      </div>
    </div>
  );
};

export default BurnoutRiskMeter;
