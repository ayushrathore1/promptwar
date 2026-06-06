import React, { useEffect, useRef } from 'react';

interface StreamingTextProps {
  text: string;
  isStreaming: boolean;
}

export const StreamingText: React.FC<StreamingTextProps> = ({ text, isStreaming }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isStreaming) {
      bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [text, isStreaming]);

  // Split text by newlines to render paragraph blocks correctly
  const lines = text.split('\n');

  return (
    <div className="space-y-3 font-sans leading-relaxed text-sm sm:text-base text-brand-text select-text transition-opacity duration-200 opacity-100">
      {lines.map((line, idx) => {
        const isLastLine = idx === lines.length - 1;
        const hasContent = line.trim().length > 0;

        // Apply a glowing border on the active line while streaming
        const activeLineStyle =
          isStreaming && isLastLine && hasContent
            ? 'border-l-2 border-brand-primary/60 pl-3.5 animate-pulse-glow transition-all duration-300'
            : hasContent
            ? 'pl-3.5 border-l-2 border-transparent'
            : '';

        return (
          <div key={idx} className={`${activeLineStyle} min-h-[1.5rem]`}>
            {line}
            {/* Show pulsing cursor at the very end of the text while streaming */}
            {isStreaming && isLastLine && (
              <span
                className="inline-block w-2.5 h-4.5 ml-1 bg-brand-primary animate-cursor-blink align-middle"
                style={{ verticalAlign: 'middle' }}
              />
            )}
          </div>
        );
      })}

      {/* Completion Indicator */}
      {!isStreaming && text.length > 0 && (
        <div className="pt-3 flex items-center justify-between text-xs text-brand-teal font-medium animate-fade-in">
          <span>✦ MindScan complete</span>
        </div>
      )}

      <div ref={bottomRef} />
    </div>
  );
};
export default StreamingText;
