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
      {/* Header - Desktop Only Floating Translucent Navbar */}
      <header className="hidden lg:block fixed top-0 left-0 right-0 z-50 px-3 sm:px-4 md:px-6 pt-4">
        <div className="max-w-7xl mx-auto">
          {/* Floating navbar container with blur and curve */}
          <div className="relative backdrop-blur-xl bg-zinc-900/70 border border-zinc-800/50 rounded-3xl md:rounded-[32px] shadow-2xl shadow-black/20 overflow-hidden">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-50"></div>

            {/* Content */}
            <div className="relative flex items-center justify-between h-14 sm:h-16 md:h-[72px] px-3 sm:px-4 md:px-6">
              {/* Logo */}
              <div className="flex items-center shrink-0">
                <h1 className="text-lg sm:text-xl md:text-2xl font-bold tracking-tight">
                  <span className="font-['Playfair_Display'] bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                    Perseverance
                  </span>
                </h1>
              </div>

              {/* Desktop Navigation */}
              <nav className="hidden lg:flex items-center space-x-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.path);

                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`
                        group relative flex items-center px-3 xl:px-4 py-2 rounded-2xl text-sm font-medium
                        transition-all duration-300 ease-out
                        ${active
                          ? 'text-white'
                          : 'text-zinc-400 hover:text-white'
                        }
                      `}
                    >
                      {/* Active background with gradient */}
                      {active && (
                        <div className="absolute inset-0 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl shadow-lg shadow-indigo-500/30 animate-in fade-in zoom-in-95 duration-200"></div>
                      )}

                      {/* Hover effect */}
                      {!active && (
                        <div className="absolute inset-0 bg-white/5 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      )}

                      {/* Content */}
                      <span className="relative flex items-center">
                        <Icon className="mr-2" size={18} />
                        {item.label}
                      </span>
                    </Link>
                  );
                })}
              </nav>

              {/* Action Buttons */}
              <div className="hidden md:flex items-center gap-2">
                <Link
                  to="/focus"
                  className="group relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-500 to-indigo-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-indigo-400 to-purple-500 opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                  <span className="relative text-white flex items-center gap-2">
                    <FiTarget size={18} />
                    <span className="hidden lg:inline">Focus</span>
                  </span>
                </Link>
                <button
                  onClick={() => setShowRewards(true)}
                  className="group relative flex items-center gap-2 px-3 md:px-4 py-2 rounded-2xl text-sm font-medium overflow-hidden transition-all duration-300 hover:scale-105"
                >
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-500 to-orange-600 opacity-90 group-hover:opacity-100 transition-opacity"></div>
                  <div className="absolute inset-0 bg-gradient-to-r from-amber-400 to-orange-500 opacity-0 group-hover:opacity-20 blur transition-opacity"></div>
                  <span className="relative text-white flex items-center gap-2">
                    <FiAward size={18} />
                    <span className="hidden lg:inline">Rewards</span>
                  </span>
                </button>
              </div>

              {/* Mobile Menu Button - Removed */}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Navigation - Clean Minimal Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 px-4 pb-4 safe-bottom">
        <div className="relative backdrop-blur-2xl bg-zinc-900/90 border border-zinc-800/60 rounded-[28px] shadow-2xl shadow-black/40 overflow-hidden">
          {/* Subtle gradient background */}
          <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/3 to-transparent"></div>

          {/* Nav items - Simplified Grid */}
          <div className="relative grid grid-cols-6 gap-0 h-[68px] px-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative flex flex-col items-center justify-center transition-all duration-300"
                >
                  {/* Simple icon with active state */}
                  <div className={`
                    relative flex items-center justify-center w-11 h-11 rounded-[18px] 
                    transition-all duration-300
                    ${active
                      ? 'bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/40 scale-105'
                      : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'
                    }
                  `}>
                    <Icon size={22} className={active ? 'text-white' : ''} />
                  </div>

                  {/* Minimal label - only show for active */}
                  {active && (
                    <span className="absolute -bottom-1 text-[9px] font-medium text-indigo-400 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      •
                    </span>
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6 lg:pt-28 pb-24 lg:pb-8">
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
