import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, X, Send, Sparkles, AlertCircle } from 'lucide-react';
import { startChatStream, type ChatMessage } from '../lib/api';

interface ChatWidgetProps {
  studentId: string;
}

export const ChatWidget: React.FC<ChatWidgetProps> = ({ studentId }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [streamingContent, setStreamingContent] = useState('');
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Suggestions for the user
  const suggestionChips = [
    { label: '😰 Overwhelmed', text: 'I am feeling extremely overwhelmed by my syllabus right now.' },
    { label: '📉 Bad Mock Test', text: 'I just scored really poorly on a mock test and feel like giving up.' },
    { label: '😴 Sleep Issues', text: 'I can\'t sleep at night because of exam anxiety.' },
    { label: '🧘 Quick Reset', text: 'Can you guide me through a 1-minute breathing exercise?' },
  ];

  // Load chat history from localStorage on studentId change / mount
  useEffect(() => {
    if (!studentId) return;
    const key = `mindspace_saathi_chat_history_${studentId}`;
    const stored = localStorage.getItem(key);
    if (stored) {
      try {
        setMessages(JSON.parse(stored));
      } catch {
        setMessages(getDefaultMessages());
      }
    } else {
      setMessages(getDefaultMessages());
    }
    setError(null);
    setStreamingContent('');
    setIsTyping(false);
  }, [studentId]);

  // Save chat history to localStorage
  const saveHistory = (updatedMessages: ChatMessage[]) => {
    const key = `mindspace_saathi_chat_history_${studentId}`;
    localStorage.setItem(key, JSON.stringify(updatedMessages));
  };

  const getDefaultMessages = (): ChatMessage[] => [
    {
      role: 'assistant',
      content: "Hello! I'm **Saathi**, your wellness companion. 🌸\n\nPreparing for competitive exams is a tough journey, and it's completely normal to feel stressed, anxious, or tired. I am here to listen, support, and help you breathe through it. How are you holding up today?",
    },
  ];

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, streamingContent, isTyping]);

  // Auto focus input when opened
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 300);
    }
  }, [isOpen]);

  const handleSend = async (text: string) => {
    if (!text.trim() || isTyping) return;

    setError(null);
    const userMsg: ChatMessage = { role: 'user', content: text };
    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    saveHistory(newMessages);
    setInputValue('');
    setIsTyping(true);
    setStreamingContent('');

    // Call API
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = startChatStream(
      studentId,
      text,
      messages.filter(m => m.content !== getDefaultMessages()[0].content), // Exclude welcome message from Groq context
      {
        onToken: (token) => {
          setIsTyping(false);
          setStreamingContent((prev) => prev + token);
        },
        onComplete: () => {
          setMessages((prev) => {
            const assistantMsg: ChatMessage = { role: 'assistant', content: streamingContent || "I'm here for you." };
            const updated = [...prev, assistantMsg];
            saveHistory(updated);
            return updated;
          });
          setStreamingContent('');
          setIsTyping(false);
        },
        onError: (err) => {
          console.error(err);
          setError('Saathi is temporarily unavailable. Please try again.');
          setIsTyping(false);
        },
      }
    );

    abortControllerRef.current = abortController;
  };

  const handleClearHistory = () => {
    if (window.confirm('Clear your chat history with Saathi?')) {
      const cleared = getDefaultMessages();
      setMessages(cleared);
      saveHistory(cleared);
      setError(null);
    }
  };

  // Close widget and cancel pending requests
  const handleClose = () => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    setIsOpen(false);
  };

  // Helper to format text (bold markdown and newlines)
  const formatMessageContent = (text: string) => {
    return text.split('\n').map((line, i) => {
      // Simple Bold parser
      const parts = line.split(/\*\*(.*?)\*\*/g);
      const elements = parts.map((part, index) => {
        if (index % 2 === 1) {
          return <strong key={index} className="font-bold text-brand-dark">{part}</strong>;
        }
        return part;
      });

      return (
        <span key={i} className="block mt-1 first:mt-0">
          {elements}
        </span>
      );
    });
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end">
      {/* ─── Chat Window ─── */}
      {isOpen && (
        <div
          className="w-[90vw] sm:w-[400px] h-[550px] max-h-[80vh] bg-white/90 backdrop-blur-xl border border-brand-border/60 shadow-2xl rounded-3xl flex flex-col overflow-hidden mb-4 animate-scale-in relative"
          role="dialog"
          aria-modal="true"
          aria-labelledby="chat-title"
        >
          {/* Ambient Glow Effects */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-brand-primary/10 rounded-full blur-2xl pointer-events-none" />
          <div className="absolute bottom-0 left-0 w-28 h-28 bg-brand-teal/10 rounded-full blur-2xl pointer-events-none" />

          {/* Header */}
          <header className="px-5 py-4 border-b border-brand-border/60 bg-white/50 flex items-center justify-between z-10">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-full bg-brand-dark flex items-center justify-center shadow-md relative">
                <Sparkles className="w-4 h-4 text-white animate-pulse" />
                <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-brand-teal border border-white" />
              </div>
              <div>
                <h3 id="chat-title" className="text-sm font-bold text-brand-text flex items-center gap-1">
                  Saathi
                </h3>
                <span className="text-[10px] text-brand-text-secondary font-medium">Your Wellness Companion</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={handleClearHistory}
                className="text-[10px] text-brand-text-secondary hover:text-brand-coral font-semibold transition-colors px-2 py-1 hover:bg-gray-100/60 rounded-lg cursor-pointer"
                title="Clear conversation history"
              >
                Clear History
              </button>
              <button
                onClick={handleClose}
                className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 text-brand-text-secondary hover:text-brand-text transition-all cursor-pointer"
                aria-label="Close chatbot"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </header>

          {/* Messages List */}
          <div 
            className="flex-1 overflow-y-auto p-5 space-y-4 z-10"
            role="log"
            aria-live="polite"
          >
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'} animate-fade-in`}
              >
                <div
                  className={`
                    ${
                      msg.role === 'user'
                        ? 'bg-brand-dark text-white rounded-2xl rounded-tr-none shadow-md shadow-brand-dark/5'
                        : 'bg-brand-bg/60 border border-brand-border/80 text-brand-text rounded-2xl rounded-tl-none shadow-xs'
                    }
                    px-4 py-2.5 max-w-[85%] text-xs leading-relaxed font-medium
                  `}
                >
                  {formatMessageContent(msg.content)}
                </div>
              </div>
            ))}

            {/* Streaming Message Response */}
            {streamingContent && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-brand-bg/60 border border-brand-border/80 text-brand-text rounded-2xl rounded-tl-none px-4 py-2.5 max-w-[85%] text-xs leading-relaxed font-medium shadow-xs">
                  {formatMessageContent(streamingContent)}
                </div>
              </div>
            )}

            {/* Bouncing Typing Indicator */}
            {isTyping && (
              <div className="flex justify-start animate-fade-in">
                <div className="bg-brand-bg/60 border border-brand-border/80 rounded-2xl rounded-tl-none px-4 py-3 shadow-xs">
                  <div className="flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-text-secondary animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-text-secondary animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-brand-text-secondary animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </div>
            )}

            {/* Error Message */}
            {error && (
              <div className="flex items-center gap-2 p-3 bg-brand-coral/10 border border-brand-coral/20 rounded-xl text-brand-coral text-xs font-semibold animate-fade-in">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick replies */}
          {messages.length <= 1 && !isTyping && !streamingContent && (
            <div className="px-5 py-2 z-10">
              <p className="text-[10px] uppercase tracking-wider font-bold text-brand-text-secondary mb-2">Tap to start talking:</p>
              <div className="flex flex-col gap-1.5">
                {suggestionChips.map((chip, i) => (
                  <button
                    key={i}
                    onClick={() => handleSend(chip.text)}
                    className="text-left w-full px-3 py-1.5 bg-brand-bg/80 hover:bg-brand-primary/10 border border-brand-border hover:border-brand-primary/30 text-[11px] font-semibold text-brand-text-secondary hover:text-brand-primary rounded-xl transition-all cursor-pointer active:scale-[0.99]"
                  >
                    {chip.label}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Footer Input Area */}
          <footer className="p-4 border-t border-brand-border/60 bg-white/50 z-10">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSend(inputValue);
              }}
              className="flex items-center gap-2"
            >
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                placeholder="Talk to Saathi..."
                className="flex-1 bg-brand-bg/70 hover:bg-brand-bg/90 focus:bg-white border border-brand-border focus:border-brand-primary/50 outline-none rounded-xl px-4 py-2.5 text-xs font-medium text-brand-text placeholder-brand-text-secondary transition-all"
                disabled={isTyping || !!streamingContent}
                aria-label="Message to Saathi"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isTyping || !!streamingContent}
                className="w-9 h-9 rounded-xl bg-brand-dark hover:bg-brand-dark/90 text-white flex items-center justify-center transition-all cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed shadow-md shadow-brand-dark/10 hover:shadow-brand-dark/20"
                aria-label="Send message"
              >
                <Send className="w-3.5 h-3.5" />
              </button>
            </form>
          </footer>
        </div>
      )}

      {/* ─── Floating Button (FAB) ─── */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-14 h-14 rounded-full bg-brand-dark text-white flex items-center justify-center shadow-xl shadow-brand-dark/25 hover:shadow-brand-dark/45 transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer relative group"
        aria-label={isOpen ? "Close chatbot widget" : "Open chatbot widget"}
        aria-expanded={isOpen}
      >
        {/* Glow pulsing ring around the button */}
        <span className="absolute inset-0 rounded-full bg-brand-dark opacity-10 animate-ping group-hover:opacity-20" />
        {isOpen ? (
          <X className="w-6 h-6 animate-scale-in" />
        ) : (
          <div className="relative">
            <MessageCircle className="w-6 h-6 animate-scale-in" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-brand-teal animate-pulse" />
          </div>
        )}
      </button>
    </div>
  );
};
