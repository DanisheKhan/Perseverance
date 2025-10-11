import { useState } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { FiHome, FiCheckCircle, FiBarChart2, FiCalendar, FiSettings, FiBook, FiTarget, FiAward } from 'react-icons/fi';
import RewardsModal from './RewardsModal';

const Layout = () => {
  const location = useLocation();
  const [showRewards, setShowRewards] = useState(false);

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/habits', label: 'Habits', icon: FiCheckCircle },
    { path: '/statistics', label: 'Statistics', icon: FiBarChart2 },
    { path: '/calendar', label: 'Calendar', icon: FiCalendar },
    { path: '/journal', label: 'Journal', icon: FiBook },
    { path: '/settings', label: 'Settings', icon: FiSettings },
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="gradient-bg min-h-screen">
      {/* Header */}
      <header className="glass-effect sticky top-0 z-50 border-b border-[var(--border)]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <h1 className="text-2xl font-bold tracking-tight">
                <span
                  className="font-['Playfair_Display'] bg-gradient-to-r from-[var(--accent-primary)] to-[var(--accent-secondary)] bg-clip-text text-transparent"
                >
                  Perseverance
                </span>
              </h1>
            </div>

            {/* Navigation */}
            <nav className="hidden lg:flex space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const active = isActive(item.path);

                return (
                  <Link
                    key={item.path}
                    to={item.path}
                    className={`
                      flex items-center px-3 py-2 rounded-lg text-sm font-medium
                      transition-all duration-200
                      ${active
                        ? 'bg-[var(--accent-primary)] text-white shadow-[0_10px_30px_var(--shadow)]'
                        : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-secondary)]'
                      }
                    `}
                  >
                    <Icon className="mr-2" size={18} />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            {/* Action Buttons */}
            <div className="hidden md:flex items-center gap-2">
              <Link
                to="/focus"
                className="flex items-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FiTarget size={18} />
                Focus
              </Link>
              <button
                onClick={() => setShowRewards(true)}
                className="flex items-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-colors"
              >
                <FiAward size={18} />
                Rewards
              </button>
            </div>

            {/* Mobile Navigation Toggle (for future implementation) */}
            <button className="lg:hidden text-[var(--text-primary)]">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Navigation */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-effect border-t border-[var(--border)] z-50">
        <div className="flex justify-around items-center h-16">
          {navItems.slice(0, 5).map((item) => {
            const Icon = item.icon;
            const active = isActive(item.path);

            return (
              <Link
                key={item.path}
                to={item.path}
                className={`
                  flex flex-col items-center justify-center flex-1 h-full
                  transition-colors duration-200
                  ${active
                    ? 'text-[var(--accent-primary)]'
                    : 'text-[var(--text-secondary)]'
                  }
                `}
              >
                <Icon size={20} />
                <span className="text-xs mt-1">{item.label}</span>
              </Link>
            );
          })}
          <Link
            to="/settings"
            className={`
              flex flex-col items-center justify-center flex-1 h-full
              transition-colors duration-200
              ${isActive('/settings')
                ? 'text-[var(--accent-primary)]'
                : 'text-[var(--text-secondary)]'
              }
            `}
          >
            <FiSettings size={20} />
            <span className="text-xs mt-1">Settings</span>
          </Link>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-24 lg:pb-8">
        <div className="page-transition">
          <Outlet />
        </div>
      </main>

      {/* Rewards Modal */}
      <RewardsModal isOpen={showRewards} onClose={() => setShowRewards(false)} />
    </div>
  );
};

export default Layout;
