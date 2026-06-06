import React, { useState } from 'react';
import { type IStudent, type ExamType, EXAM_TYPES } from '../types';
import { loginUser, registerUser, quickLogin, storeToken } from '../lib/api';
import { Eye, EyeOff, ArrowRight, Sparkles, LogIn } from 'lucide-react';

interface LoginPageProps {
  onAuthSuccess: (student: IStudent) => void;
}

// ─── Exam profile metadata for quick-login cards ─────────────────
const EXAM_PROFILES: {
  exam: ExamType;
  emoji: string;
  color: string;
  bgColor: string;
  borderColor: string;
  name: string;
  desc: string;
}[] = [
  {
    exam: 'NEET',
    emoji: '🩺',
    color: '#059669',
    bgColor: '#ecfdf5',
    borderColor: '#a7f3d0',
    name: 'Priya V.',
    desc: 'Class 12, Chennai',
  },
  {
    exam: 'JEE',
    emoji: '⚡',
    color: '#4A7AE5',
    bgColor: '#eff6ff',
    borderColor: '#bfdbfe',
    name: 'Arjun S.',
    desc: 'Coaching, Kota',
  },
  {
    exam: 'CUET',
    emoji: '📚',
    color: '#7C3AED',
    bgColor: '#f5f3ff',
    borderColor: '#ddd6fe',
    name: 'Fatima S.',
    desc: 'First-gen, Mumbai',
  },
  {
    exam: 'CAT',
    emoji: '📊',
    color: '#D97706',
    bgColor: '#fffbeb',
    borderColor: '#fde68a',
    name: 'Rohan M.',
    desc: 'MBA aspirant, Delhi',
  },
  {
    exam: 'GATE',
    emoji: '🔧',
    color: '#0891B2',
    bgColor: '#ecfeff',
    borderColor: '#a5f3fc',
    name: 'Gurpreet S.',
    desc: 'Working pro, Chandigarh',
  },
  {
    exam: 'UPSC',
    emoji: '🏛️',
    color: '#DC2626',
    bgColor: '#fef2f2',
    borderColor: '#fecaca',
    name: 'Meenakshi I.',
    desc: '2nd attempt, Bengaluru',
  },
];

const LoginPage: React.FC<LoginPageProps> = ({ onAuthSuccess }) => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [exam, setExam] = useState<ExamType>('JEE');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [quickLoginExam, setQuickLoginExam] = useState<ExamType | null>(null);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      let response;
      if (mode === 'login') {
        response = await loginUser(email, password);
      } else {
        if (!name.trim()) {
          setError('Please enter your name');
          setIsLoading(false);
          return;
        }
        response = await registerUser({ email, password, name, exam });
      }
      storeToken(response.token);
      onAuthSuccess(response.student);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Something went wrong';
      // Try to extract server error message
      if (message.includes('API error: 4')) {
        setError(mode === 'login' ? 'Invalid email or password' : 'Registration failed. Email may already be in use.');
      } else {
        setError(message);
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickLogin = async (examType: ExamType) => {
    setError('');
    setQuickLoginExam(examType);

    try {
      const response = await quickLogin(examType);
      storeToken(response.token);
      onAuthSuccess(response.student);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Quick login failed';
      setError(`Quick login failed for ${examType}: ${message}`);
    } finally {
      setQuickLoginExam(null);
    }
  };

  return (
    <div className="min-h-screen bg-brand-bg flex items-center justify-center p-4 relative overflow-hidden">
      {/* ─── Background Decoration ─── */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute -top-32 -right-32 w-96 h-96 rounded-full opacity-20"
          style={{
            background: 'radial-gradient(circle, rgba(74, 122, 229, 0.3) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute -bottom-48 -left-48 w-[500px] h-[500px] rounded-full opacity-15"
          style={{
            background: 'radial-gradient(circle, rgba(29, 184, 164, 0.3) 0%, transparent 70%)',
          }}
        />
        <div
          className="absolute top-1/3 left-1/4 w-64 h-64 rounded-full opacity-10"
          style={{
            background: 'radial-gradient(circle, rgba(124, 58, 237, 0.3) 0%, transparent 70%)',
          }}
        />
      </div>

      {/* ─── Main Card ─── */}
      <div className="w-full max-w-lg relative z-10 animate-fade-in">
        {/* ─── Brand Header ─── */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-brand-dark mb-4 shadow-lg shadow-brand-dark/10">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h1 className="text-3xl font-heading text-brand-text mb-2">MindSpace</h1>
          <p className="text-sm text-brand-text-secondary">
            AI wellness support for your exam journey
          </p>
        </div>

        {/* ─── Auth Form Card ─── */}
        <div className="bg-white rounded-3xl border border-brand-border shadow-sm p-8 mb-6">
          <h2 className="text-lg font-heading text-brand-text mb-1">
            {mode === 'login' ? 'Welcome back' : 'Create your space'}
          </h2>
          <p className="text-xs text-brand-text-secondary mb-6">
            {mode === 'login'
              ? 'Sign in to continue your wellness journey'
              : 'Set up your profile to get personalised support'}
          </p>

          {/* Error message */}
          {error && (
            <div 
              role="alert"
              aria-live="assertive"
              className="mb-4 p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium animate-scale-in"
            >
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Name field (register only) */}
            {mode === 'register' && (
              <div className="animate-slide-up">
                <label htmlFor="auth-name" className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Full Name
                </label>
                <input
                  id="auth-name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Priya Sharma"
                  autoComplete="name"
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-sm text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div>
              <label htmlFor="auth-email" className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                Email
              </label>
              <input
                id="auth-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                autoComplete="email"
                className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-sm text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                required
              />
            </div>

            {/* Password */}
            <div>
              <label htmlFor="auth-password" className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                Password
              </label>
              <div className="relative">
                <input
                  id="auth-password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={mode === 'register' ? 'Min 6 characters' : '••••••••'}
                  autoComplete={mode === 'register' ? 'new-password' : 'current-password'}
                  className="w-full px-4 py-3 pr-12 rounded-xl border border-brand-border bg-brand-bg text-sm text-brand-text placeholder-gray-400 focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all"
                  required
                  minLength={6}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-brand-text transition-colors cursor-pointer"
                  aria-label={showPassword ? 'Hide password' : 'Show password'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            {/* Exam type (register only) */}
            {mode === 'register' && (
              <div className="animate-slide-up">
                <label htmlFor="auth-exam" className="block text-xs font-semibold text-brand-text-secondary uppercase tracking-wider mb-1.5">
                  Your Exam
                </label>
                <select
                  id="auth-exam"
                  value={exam}
                  onChange={(e) => setExam(e.target.value as ExamType)}
                  className="w-full px-4 py-3 rounded-xl border border-brand-border bg-brand-bg text-sm text-brand-text focus:outline-none focus:border-brand-primary focus:ring-2 focus:ring-brand-primary/10 transition-all cursor-pointer appearance-none"
                >
                  {EXAM_TYPES.map((e) => (
                    <option key={e} value={e}>{e}</option>
                  ))}
                </select>
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-brand-dark text-white text-sm font-semibold rounded-xl hover:opacity-90 transition-all cursor-pointer shadow-lg shadow-brand-dark/10 disabled:opacity-50 disabled:cursor-not-allowed active:scale-[0.98]"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <LogIn className="w-4 h-4" />
                  {mode === 'login' ? 'Sign In' : 'Create Account'}
                </>
              )}
            </button>
          </form>

          {/* Toggle login/register */}
          <div className="mt-5 text-center">
            <button
              onClick={() => {
                setMode(mode === 'login' ? 'register' : 'login');
                setError('');
              }}
              className="text-xs text-brand-text-secondary hover:text-brand-primary transition-colors cursor-pointer"
            >
              {mode === 'login' ? (
                <>Don't have an account? <span className="font-semibold text-brand-primary">Register</span></>
              ) : (
                <>Already have an account? <span className="font-semibold text-brand-primary">Sign In</span></>
              )}
            </button>
          </div>
        </div>

        {/* ─── Quick Login Section ─── */}
        <div className="bg-white rounded-3xl border border-brand-border shadow-sm p-8">
          <div className="flex items-center gap-3 mb-5">
            <div className="flex-1 h-px bg-brand-border" />
            <div className="flex items-center gap-1.5 text-xs font-semibold text-brand-text-secondary uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-brand-amber" />
              Quick Demo Login
            </div>
            <div className="flex-1 h-px bg-brand-border" />
          </div>

          <p className="text-xs text-brand-text-secondary text-center mb-5">
            Try MindSpace instantly as a pre-set student profile
          </p>

          {/* Quick Login Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {EXAM_PROFILES.map((profile) => (
              <button
                key={profile.exam}
                onClick={() => handleQuickLogin(profile.exam)}
                disabled={quickLoginExam !== null}
                className="group relative flex flex-col items-start p-4 rounded-2xl border-2 transition-all duration-200 cursor-pointer hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
                style={{
                  backgroundColor: profile.bgColor,
                  borderColor: quickLoginExam === profile.exam ? profile.color : profile.borderColor,
                  boxShadow: quickLoginExam === profile.exam ? `0 0 0 3px ${profile.color}20` : 'none',
                }}
                aria-label={`Quick login as ${profile.name} (${profile.exam} student)`}
              >
                {/* Loading spinner overlay */}
                {quickLoginExam === profile.exam && (
                  <div className="absolute inset-0 flex items-center justify-center rounded-2xl" style={{ backgroundColor: `${profile.bgColor}dd` }}>
                    <div
                      className="w-5 h-5 border-2 border-t-transparent rounded-full animate-spin"
                      style={{ borderColor: profile.color, borderTopColor: 'transparent' }}
                    />
                  </div>
                )}

                {/* Exam emoji + badge */}
                <div className="flex items-center gap-2 mb-2 w-full">
                  <span className="text-xl">{profile.emoji}</span>
                  <span
                    className="text-xs font-bold px-2 py-0.5 rounded-md"
                    style={{ color: profile.color, backgroundColor: `${profile.color}15` }}
                  >
                    {profile.exam}
                  </span>
                </div>

                {/* Student name + desc */}
                <span className="text-xs font-semibold text-brand-text">{profile.name}</span>
                <span className="text-[10px] text-brand-text-secondary mt-0.5">{profile.desc}</span>

                {/* Arrow icon */}
                <div
                  className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity"
                  style={{ color: profile.color }}
                >
                  <ArrowRight className="w-3.5 h-3.5" />
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Footer */}
        <p className="text-center text-[10px] text-brand-text-secondary mt-6 opacity-60">
          MindSpace is not a replacement for professional mental health support.
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
