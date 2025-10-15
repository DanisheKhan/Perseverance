import { useState } from 'react';
import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { FiHome, FiCheckCircle, FiBarChart2, FiCalendar, FiSettings, FiBook, FiTarget, FiAward, FiUser, FiLogOut, FiChevronDown } from 'react-icons/fi';
import RewardsModal from './RewardsModal';
import { useHabits } from '../context/HabitContext';

const Layout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [showRewards, setShowRewards] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const { user, isAuthenticated, logout } = useHabits();

  // Debug authentication state
  console.log('Auth State:', { isAuthenticated, user });

  const handleLogout = () => {
    setShowUserMenu(false);
    logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard', icon: FiHome },
    { path: '/calendar', label: 'Calendar', icon: FiCalendar },
    { path: '/statistics', label: 'Statistics', icon: FiBarChart2 },
  ];

  // Secondary menu items (moved to dropdown or side menu)
  const secondaryItems = [
    { path: '/habits', label: 'Habits', icon: FiCheckCircle },
    { path: '/journal', label: 'Journal', icon: FiBook },
    { path: '/focus', label: 'Focus Mode', icon: FiTarget },
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
          <div className="relative backdrop-blur-xl bg-zinc-900/70 border border-zinc-800/50 rounded-3xl md:rounded-[32px] shadow-2xl shadow-black/20 overflow-visible">
            {/* Animated gradient background */}
            <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/5 via-purple-500/5 to-pink-500/5 opacity-50 rounded-3xl md:rounded-[32px]"></div>

            {/* Content */}
            <div className="relative flex items-center justify-between h-14 sm:h-16 md:h-[72px] px-3 sm:px-4 md:px-6">
              {/* Logo - Modern Classic Style */}
              <div className="flex items-center gap-3 shrink-0">
                <div className="flex flex-col">
                  <h1 className="text-xl md:text-2xl font-bold tracking-tight leading-none">
                    <span className="bg-gradient-to-r from-white via-zinc-100 to-zinc-200 bg-clip-text text-transparent">
                      Perseverance
                    </span>
                  </h1>
                  <p className="text-[10px] text-zinc-500 tracking-widest uppercase font-medium">
                    Habit Tracker
                  </p>
                </div>
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

              {/* Action Buttons - Account Only */}
              <div className="hidden md:flex items-center gap-2">
                {/* User Menu */}
                {isAuthenticated ? (
                  <div className="relative z-[60]">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setShowUserMenu(!showUserMenu);
                      }}
                      className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
                    >
                      <div className="flex items-center gap-2">
                        <div className="relative">
                          <FiUser size={18} />
                          <div className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full border border-zinc-900"></div>
                        </div>
                        <span className="hidden xl:inline max-w-[100px] truncate">{user?.name || 'User'}</span>
                        <FiChevronDown size={16} className={`transition-transform duration-200 ${showUserMenu ? 'rotate-180' : ''}`} />
                      </div>
                    </button>

                    {/* Dropdown Menu - Positioned outside navbar */}
                    {showUserMenu && (
                      <>
                        {/* Backdrop overlay */}
                        <div
                          className="fixed inset-0 z-[100]"
                          onClick={() => setShowUserMenu(false)}
                        ></div>
                        {/* Dropdown */}
                        <div className="absolute right-0 top-[calc(100%+0.75rem)] w-64 z-[110] rounded-2xl backdrop-blur-xl bg-zinc-900/98 border border-zinc-700/70 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="p-4 border-b border-zinc-800/50">
                            <p className="text-white font-semibold truncate">{user?.name}</p>
                            <p className="text-zinc-400 text-sm mt-1 truncate">{user?.email}</p>
                          </div>

                          {/* Secondary Menu Items */}
                          <div className="py-2 border-b border-zinc-800/50">
                            <p className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Quick Access</p>
                            {secondaryItems.map((item) => {
                              const Icon = item.icon;
                              return (
                                <Link
                                  key={item.path}
                                  to={item.path}
                                  onClick={() => setShowUserMenu(false)}
                                  className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                                >
                                  <Icon size={18} />
                                  <span>{item.label}</span>
                                </Link>
                              );
                            })}
                            <button
                              onClick={() => {
                                setShowRewards(true);
                                setShowUserMenu(false);
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-all duration-200"
                            >
                              <FiAward size={18} />
                              <span>Rewards</span>
                            </button>
                          </div>

                          {/* Settings & Logout */}
                          <div className="py-2">
                            <Link
                              to="/settings"
                              onClick={() => setShowUserMenu(false)}
                              className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 transition-all duration-200"
                            >
                              <FiSettings size={18} />
                              <span>Settings</span>
                            </Link>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleLogout();
                              }}
                              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all duration-200"
                            >
                              <FiLogOut size={18} />
                              <span>Logout</span>
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                ) : (
                  <Link
                    to="/login"
                    className="relative flex items-center gap-2 px-4 py-2.5 rounded-2xl text-sm font-medium transition-all duration-300 hover:scale-105 bg-white/5 hover:bg-white/10 text-white border border-white/10 hover:border-white/20"
                  >
                    <FiUser size={18} />
                    <span className="hidden lg:inline">Login</span>
                  </Link>
                )}
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

          {/* Nav items - Grid with 4 items: 3 main nav + account */}
          <div className="relative grid grid-cols-4 gap-0 h-[68px] px-1">
            {/* Main Navigation Items */}
            {navItems.map((item) => {
              const Icon = item.icon;
              const active = isActive(item.path);

              return (
                <Link
                  key={item.path}
                  to={item.path}
                  className="group relative flex flex-col items-center justify-center transition-all duration-300"
                >
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
                  {active && (
                    <span className="absolute -bottom-1 text-[9px] font-medium text-indigo-400 animate-in fade-in slide-in-from-bottom-1 duration-200">
                      •
                    </span>
                  )}
                </Link>
              );
            })}

            {/* Account Button */}
            {isAuthenticated ? (
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setShowUserMenu(!showUserMenu);
                }}
                className="group relative flex flex-col items-center justify-center transition-all duration-300 z-50"
              >
                <div className={`relative flex items-center justify-center w-11 h-11 rounded-[18px] transition-all duration-300 ${showUserMenu ? 'bg-white/10 text-white' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}>
                  <FiUser size={22} />
                  <div className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full border-2 border-zinc-900 shadow-lg"></div>
                </div>
              </button>
            ) : (
              <Link
                to="/login"
                className="group relative flex flex-col items-center justify-center transition-all duration-300"
              >
                <div className="relative flex items-center justify-center w-11 h-11 rounded-[18px] text-zinc-500 hover:text-zinc-300 hover:bg-white/5 transition-all duration-300">
                  <FiUser size={22} />
                </div>
              </Link>
            )}
          </div>

          {/* Mobile User Menu Dropdown */}
          {showUserMenu && isAuthenticated && (
            <>
              <div
                className="fixed inset-0 z-[100] bg-black/20 backdrop-blur-sm"
                onClick={() => setShowUserMenu(false)}
              ></div>
              <div className="fixed bottom-24 right-4 left-4 sm:left-auto sm:w-72 z-[110] rounded-2xl backdrop-blur-xl bg-zinc-900/98 border border-zinc-700/70 shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-200">
                <div className="p-4 border-b border-zinc-800/50">
                  <p className="text-white font-semibold truncate">{user?.name}</p>
                  <p className="text-zinc-400 text-sm mt-1 truncate">{user?.email}</p>
                </div>

                {/* Secondary Menu Items */}
                <div className="py-2 border-b border-zinc-800/50">
                  <p className="px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Quick Access</p>
                  {secondaryItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => setShowUserMenu(false)}
                        className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                      >
                        <Icon size={18} />
                        <span>{item.label}</span>
                      </Link>
                    );
                  })}
                  <button
                    onClick={() => {
                      setShowRewards(true);
                      setShowUserMenu(false);
                    }}
                    className="w-full flex items-center gap-3 px-4 py-3 text-amber-400 hover:text-amber-300 hover:bg-amber-500/10 transition-colors"
                  >
                    <FiAward size={18} />
                    <span>Rewards</span>
                  </button>
                </div>

                {/* Settings & Logout */}
                <div className="py-2">
                  <Link
                    to="/settings"
                    onClick={() => setShowUserMenu(false)}
                    className="flex items-center gap-3 px-4 py-3 text-zinc-300 hover:text-white hover:bg-white/5 transition-colors"
                  >
                    <FiSettings size={18} />
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-colors"
                  >
                    <FiLogOut size={18} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </>
          )}
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
