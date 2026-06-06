import React, { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import BottomNav from './components/BottomNav';
import { mockStudents } from './data/mockStudents';
import { mockMoodHistory } from './data/mockMoodHistory';
import { type IStudent, type IMoodEntry, type MoodScore, type MoodLabel, type TriggerType } from './types';
import { fetchStudents, fetchMoodHistory, logMood, verifyToken, getStoredToken, clearToken, quickLogin, storeToken } from './lib/api';
import { LogOut } from 'lucide-react';
import './App.css';

// ─── Lazy-loaded pages (Efficiency — code splitting) ─────────────
const LoginPage = lazy(() => import('./pages/LoginPage'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const MoodLogger = lazy(() => import('./pages/MoodLogger'));
const MindScan = lazy(() => import('./pages/MindScan'));
const History = lazy(() => import('./pages/History'));
const Toolkit = lazy(() => import('./pages/Toolkit'));

// ─── Page Loading Fallback ───────────────────────────────────────
function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[300px]" role="status" aria-label="Loading page">
      <div className="flex flex-col items-center gap-3">
        <div className="w-8 h-8 border-3 border-brand-primary border-t-transparent rounded-full animate-spin" />
        <p className="text-xs text-brand-text-secondary">Loading...</p>
      </div>
    </div>
  );
}

// ─── Error Boundary ──────────────────────────────────────────────
class ErrorBoundary extends React.Component<
  { children: React.ReactNode; fallback?: React.ReactNode },
  { hasError: boolean; error?: Error }
> {
  constructor(props: { children: React.ReactNode; fallback?: React.ReactNode }) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('MindSpace Error:', error, info);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex items-center justify-center min-h-[200px] p-6">
            <div className="text-center space-y-3 bg-white border border-brand-coral/30 rounded-2xl p-6 max-w-md shadow-sm">
              <p className="text-brand-coral font-heading text-base">Something went wrong</p>
              <p className="text-xs text-brand-text-secondary">{this.state.error?.message}</p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="px-4 py-2 bg-brand-dark text-white text-xs font-semibold rounded-full hover:opacity-90 transition-opacity cursor-pointer"
              >
                Try Again
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}

// ─── Main App ────────────────────────────────────────────────────
export default function App() {
  // ─── Auth State ──────────────────────────────────────────────────
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authChecked, setAuthChecked] = useState(false);

  const [currentPage, setCurrentPage] = useState('dashboard');
  const [students, setStudents] = useState<IStudent[]>(mockStudents);
  const [activeStudentId, setActiveStudentId] = useState<string>(mockStudents[0]._id || '');
  const [moodEntries, setMoodEntries] = useState<IMoodEntry[]>(mockMoodHistory);
  const [isLoading, setIsLoading] = useState(true);

  // MindScan draft — carries mood+trigger from MoodLogger to MindScan
  const [scanDraft, setScanDraft] = useState<{
    moodScore: MoodScore;
    moodLabel: MoodLabel;
    trigger: TriggerType;
    note?: string;
  } | null>(null);

  const activeStudent = students.find((s) => s._id === activeStudentId) || students[0];

  // ─── Check existing auth token on mount ─────────────────────────
  useEffect(() => {
    async function checkAuth() {
      const token = getStoredToken();
      if (!token) {
        setAuthChecked(true);
        setIsLoading(false);
        return;
      }

      try {
        const { student } = await verifyToken();
        setIsAuthenticated(true);
        setActiveStudentId(student._id || '');
        // Load all students for profile switcher
        try {
          const serverStudents = await fetchStudents();
          if (serverStudents.length > 0) {
            setStudents(serverStudents);
          }
        } catch {
          // Keep mock students
        }
      } catch {
        clearToken();
      } finally {
        setAuthChecked(true);
        setIsLoading(false);
      }
    }
    checkAuth();
  }, []);

  // ─── Auth Handlers ──────────────────────────────────────────────
  const handleAuthSuccess = useCallback(async (student: IStudent) => {
    setIsAuthenticated(true);
    setActiveStudentId(student._id || '');
    setIsLoading(true);

    // Load all students and mood history
    try {
      const serverStudents = await fetchStudents();
      if (serverStudents.length > 0) {
        setStudents(serverStudents);
      }
      const serverMoods = await fetchMoodHistory(student._id || '');
      if (serverMoods.length > 0) {
        setMoodEntries(serverMoods);
      }
    } catch {
      console.info('Backend data load failed, using mock data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleLogout = useCallback(() => {
    clearToken();
    setIsAuthenticated(false);
    setCurrentPage('dashboard');
    setStudents(mockStudents);
    setActiveStudentId(mockStudents[0]._id || '');
    setMoodEntries(mockMoodHistory);
    setScanDraft(null);
  }, []);

  // ─── Load mood history when student changes ────────────────────
  useEffect(() => {
    async function loadMoods() {
      if (!activeStudentId) return;
      try {
        const serverMoods = await fetchMoodHistory(activeStudentId);
        if (serverMoods.length > 0) {
          setMoodEntries(serverMoods);
        } else {
          setMoodEntries(mockMoodHistory.filter((m) => m.studentId === activeStudentId));
        }
      } catch {
        setMoodEntries(mockMoodHistory.filter((m) => m.studentId === activeStudentId));
      }
    }
    loadMoods();
  }, [activeStudentId]);

  // ─── Handlers ──────────────────────────────────────────────────
  const handleNavigate = useCallback((page: string) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

  const handleSwitchProfile = useCallback(async (studentId: string) => {
    const student = students.find((s) => s._id === studentId);
    if (!student) return;

    setIsLoading(true);
    try {
      // Securely log in as the demo profile, retrieving a new valid JWT token
      const response = await quickLogin(student.exam);
      storeToken(response.token);
      setActiveStudentId(response.student._id || '');
      setIsAuthenticated(true);

      // Fetch the authenticated mood history for this student
      const serverMoods = await fetchMoodHistory(response.student._id || '');
      setMoodEntries(serverMoods);
    } catch (err) {
      console.error('Failed to securely switch profile:', err);
    } finally {
      setIsLoading(false);
    }
  }, [students]);

  const handleAddEntry = useCallback(
    async (score: MoodScore, label: MoodLabel, trigger: TriggerType, note: string) => {
      const newEntry: IMoodEntry = {
        _id: `local_${Date.now()}`,
        studentId: activeStudentId,
        moodScore: score,
        moodLabel: label,
        trigger,
        note,
        createdAt: new Date().toISOString(),
      };

      setMoodEntries((prev) => [newEntry, ...prev]);

      try {
        const saved = await logMood({
          studentId: activeStudentId,
          moodScore: score,
          moodLabel: label,
          trigger,
          note,
        });
        setMoodEntries((prev) =>
          prev.map((e) => (e._id === newEntry._id ? saved : e))
        );
      } catch {
        // Offline resilience — keep local entry
      }
    },
    [activeStudentId]
  );

  const handlePrepareScan = useCallback(
    (score: MoodScore, label: MoodLabel, trigger: TriggerType, note: string) => {
      setScanDraft({ moodScore: score, moodLabel: label, trigger, note });
    },
    []
  );

  const handleQuickScan = useCallback(
    (score: number, trigger: TriggerType) => {
      const labels: MoodLabel[] = ['Overwhelmed', 'Anxious', 'Okay', 'Good', 'Calm'];
      setScanDraft({
        moodScore: score as MoodScore,
        moodLabel: labels[(score as number) - 1],
        trigger,
      });
      setCurrentPage('mind-scan');
    },
    []
  );

  // ─── Render ────────────────────────────────────────────────────
  // Auth check splash
  if (!authChecked) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg" role="status" aria-label="Loading MindSpace">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <div className="w-16 h-16 rounded-2xl bg-brand-dark flex items-center justify-center shadow-lg">
            <span className="text-white text-2xl font-bold">M</span>
          </div>
          <h1 className="text-2xl font-heading text-brand-text">MindSpace</h1>
          <div className="w-5 h-5 border-2 border-brand-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </div>
    );
  }

  // Show Login Page if not authenticated
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<PageLoader />}>
        <LoginPage onAuthSuccess={handleAuthSuccess} />
      </Suspense>
    );
  }

  // Main app loading (after auth, loading data)
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-bg" role="status" aria-label="Loading MindSpace">
        <div className="flex flex-col items-center gap-4 animate-fade-in">
          <img src="/hero.png" alt="" className="w-24 h-24 object-contain opacity-60" />
          <h1 className="text-2xl font-heading text-brand-text">MindSpace</h1>
          <p className="text-xs text-brand-text-secondary">Loading your wellness data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-bg">
      {/* Skip to content — Accessibility */}
      <a href="#main-content" className="skip-link">
        Skip to main content
      </a>

      {/* ─── Header — Pill Navigation + Logout ─── */}
      <header className="sticky top-0 z-40 bg-brand-bg/85 backdrop-blur-xl">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-center gap-3">
          <nav
            className="inline-flex items-center gap-1 bg-white border border-brand-border rounded-full px-1.5 py-1 shadow-sm"
            role="navigation"
            aria-label="Page navigation"
          >
            {[
              { id: 'dashboard', label: 'Home' },
              { id: 'mood-logger', label: 'Log Mood' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-brand-dark text-white'
                    : 'text-brand-text-secondary hover:text-brand-text hover:bg-gray-50'
                }`}
                aria-current={currentPage === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}

            {/* Center Logo */}
            <button
              onClick={() => handleNavigate('dashboard')}
              className="mx-2 w-8 h-8 rounded-full bg-brand-dark flex items-center justify-center cursor-pointer hover:opacity-90 transition-opacity"
              aria-label="MindSpace Home"
            >
              <span className="text-white text-xs font-bold">M</span>
            </button>

            {[
              { id: 'history', label: 'History' },
              { id: 'toolkit', label: 'Toolkit' },
            ].map((item) => (
              <button
                key={item.id}
                onClick={() => handleNavigate(item.id)}
                className={`px-4 py-1.5 text-sm font-medium rounded-full transition-all duration-200 cursor-pointer ${
                  currentPage === item.id
                    ? 'bg-brand-dark text-white'
                    : 'text-brand-text-secondary hover:text-brand-text hover:bg-gray-50'
                }`}
                aria-current={currentPage === item.id ? 'page' : undefined}
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-2 bg-white border border-brand-border rounded-full text-xs text-brand-text-secondary hover:text-brand-coral hover:border-brand-coral/30 transition-all cursor-pointer shadow-sm"
            aria-label="Sign out"
            title="Sign out"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline font-medium">Sign out</span>
          </button>
        </div>
      </header>

      {/* ─── Main Content ─── */}
      <main
        id="main-content"
        className="max-w-5xl mx-auto px-4 py-6 pb-24 relative z-10"
        role="main"
        aria-label="MindSpace main content"
      >
        <ErrorBoundary>
          <Suspense fallback={<PageLoader />}>
            {currentPage === 'dashboard' && (
              <Dashboard
                activeStudent={activeStudent}
                students={students}
                moodEntries={moodEntries}
                onSwitchProfile={handleSwitchProfile}
                onNavigate={handleNavigate}
                onQuickScan={handleQuickScan}
              />
            )}

            {currentPage === 'mood-logger' && (
              <MoodLogger
                onAddEntry={handleAddEntry}
                onNavigate={handleNavigate}
                onPrepareScan={handlePrepareScan}
              />
            )}

            {currentPage === 'mind-scan' && (
              <MindScan
                student={activeStudent}
                moodHistory={moodEntries}
                scanDraft={scanDraft}
                onNavigate={handleNavigate}
              />
            )}

            {currentPage === 'history' && (
              <History
                student={activeStudent}
                moodEntries={moodEntries}
              />
            )}

            {currentPage === 'toolkit' && (
              <Toolkit />
            )}
          </Suspense>
        </ErrorBoundary>
      </main>

      {/* ─── Bottom Navigation (Mobile) ─── */}
      <BottomNav currentPage={currentPage} onNavigate={handleNavigate} />
    </div>
  );
}
