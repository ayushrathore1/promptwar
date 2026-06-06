import React from 'react';
import {
  LayoutDashboard,
  SmilePlus,
  Brain,
  BarChart3,
  Sparkles,
} from 'lucide-react';

interface BottomNavProps {
  currentPage: string;
  onNavigate: (page: string) => void;
}

const navItems = [
  { id: 'dashboard', label: 'Home', icon: LayoutDashboard },
  { id: 'mood-logger', label: 'Log', icon: SmilePlus },
  { id: 'mind-scan', label: 'Scan', icon: Brain },
  { id: 'history', label: 'History', icon: BarChart3 },
  { id: 'toolkit', label: 'Toolkit', icon: Sparkles },
];

const BottomNav: React.FC<BottomNavProps> = ({ currentPage, onNavigate }) => {
  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-xl border-t border-brand-border md:hidden"
      role="navigation"
      aria-label="Mobile navigation"
    >
      <div className="max-w-lg mx-auto px-2">
        <ul className="flex items-center justify-around py-2" role="tablist">
          {navItems.map((item) => {
            const isActive = currentPage === item.id;
            const Icon = item.icon;
            return (
              <li key={item.id} role="presentation">
                <button
                  role="tab"
                  aria-selected={isActive}
                  aria-label={`Navigate to ${item.label}`}
                  onClick={() => onNavigate(item.id)}
                  className={`
                    flex flex-col items-center gap-0.5 px-3 py-1.5 rounded-xl transition-all duration-200 cursor-pointer min-w-[52px]
                      ? 'text-brand-primary'
                      : 'text-brand-text-secondary hover:text-brand-text'
                    }
                  `}
                >
                  <Icon
                    className={`w-5 h-5 transition-transform duration-200 ${isActive ? 'scale-110' : ''}`}
                    strokeWidth={isActive ? 2.5 : 1.5}
                  />
                  <span className={`text-[9px] font-semibold tracking-wide ${isActive ? 'font-bold text-brand-primary' : ''}`}>
                    {item.label}
                  </span>
                  {isActive && (
                    <span className="w-1 h-1 rounded-full bg-brand-primary mt-0.5 animate-scale-in" />
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
};

export default BottomNav;
