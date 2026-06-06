import React from 'react';
import { BrainCircuit } from 'lucide-react';
import { StreamingText } from './StreamingText';
import { MindScanSkeleton } from './skeletons/MindScanSkeleton';

interface MindScanPanelProps {
  text: string;
  isStreaming: boolean;
  isLoading?: boolean;
  examName?: string;
  title?: string;
  icon?: React.ReactNode;
  isComplete?: boolean;
  status?: 'pending' | 'running' | 'complete' | 'error';
  accentClass?: string;
  bgGlowClass?: string;
  children?: React.ReactNode;
}

export const MindScanPanel: React.FC<MindScanPanelProps> = ({
  text,
  isStreaming,
  isLoading = false,
  examName,
  title,
  icon,
  isComplete = false,
  status,
  accentClass = '',
  bgGlowClass = '',
  children,
}) => {
  if (isLoading && text.length === 0) {
    return <MindScanSkeleton examName={examName} />;
  }

  const showSpinner = status === 'running' || isStreaming;

  return (
    <div
      className={`w-full bg-brand-surface border rounded-2xl p-5 sm:p-6 shadow-xl relative overflow-hidden transition-all duration-300 ${accentClass || 'border-brand-border'} ${bgGlowClass}`}
      aria-live="polite"
    >
      {/* Decorative pulse glow in the corner when streaming */}
      {isStreaming && (
        <span className="absolute top-0 right-0 w-24 h-24 bg-brand-primary/5 rounded-full blur-2xl animate-pulse"></span>
      )}

      {/* Header */}
      <div className="flex items-center justify-between border-b border-brand-border/60 pb-3 mb-5">
        <div className="flex items-center gap-2.5">
          <div className="p-1.5 bg-brand-primary/10 rounded-lg text-brand-primary flex items-center justify-center">
            {icon || <BrainCircuit className="w-5 h-5 shrink-0" />}
          </div>
          <div>
            <h3 className="text-sm font-heading font-bold text-brand-text tracking-wide">
              {title || 'MindScan Reflection'}
            </h3>
            <p className="text-[10px] text-brand-text-secondary">Gemini 2.0 Flash AI Analysis</p>
          </div>
        </div>
        
        {showSpinner && (
          <span className="relative flex h-2 w-2 mr-1">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-primary opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-brand-primary"></span>
          </span>
        )}
      </div>

      {/* Streaming Text Body */}
      {text.length > 0 ? (
        <div className="space-y-4">
          <StreamingText text={text} isStreaming={isStreaming} />
          {children && <div className="pt-3 border-t border-brand-border/40 mt-3">{children}</div>}
        </div>
      ) : (
        <div className="text-center py-6 text-gray-400">
          <p className="text-sm">No reflections generated yet.</p>
          <p className="text-xs mt-1 text-gray-500 font-sans">Log your mood and tap "Run MindScan" to begin.</p>
        </div>
      )}
    </div>
  );
};

export default MindScanPanel;
