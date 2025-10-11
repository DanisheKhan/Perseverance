import { useState, useEffect, lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Habits from './pages/Habits';
import ErrorBoundary from './components/ErrorBoundary';
import { FiWifiOff, FiDownload } from 'react-icons/fi';
import toast from 'react-hot-toast';
import { shouldShowBackupReminder, snoozeBackupReminder, exportBackup } from './services/backupService';

// Lazy load heavy components for better performance
const Statistics = lazy(() => import('./pages/Statistics'));
const Calendar = lazy(() => import('./pages/Calendar'));
const Settings = lazy(() => import('./pages/Settings'));
const Journal = lazy(() => import('./pages/Journal'));
const FocusMode = lazy(() => import('./pages/FocusMode'));
const Maintenance = lazy(() => import('./pages/Maintenance'));
const CommandPalette = lazy(() => import('./components/CommandPalette'));

// Loading fallback
const PageLoader = () => (
  <div className="flex items-center justify-center min-h-[400px]">
    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
  </div>
);

function App() {
  const [commandPaletteOpen, setCommandPaletteOpen] = useState(false);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEffect(() => {
    const handleKeyDown = (e) => {
      // Cmd+K or Ctrl+K to open command palette
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Offline detection
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      toast.success('Back online!', { icon: '🌐' });
    };

    const handleOffline = () => {
      setIsOnline(false);
      toast.error('You are offline. Changes will be saved locally.', {
        icon: '📡',
        duration: 5000,
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Check for updates (simple version check)
  useEffect(() => {
    const lastVersion = localStorage.getItem('app_version');
    const currentVersion = '1.0.0';

    if (lastVersion && lastVersion !== currentVersion) {
      toast.success(`Updated to version ${currentVersion}!`, {
        duration: 4000,
        icon: '🎉',
      });
    }

    localStorage.setItem('app_version', currentVersion);
  }, []);

  // Backup reminder system
  useEffect(() => {
    // Check on mount and show reminder if needed
    const checkBackup = () => {
      if (shouldShowBackupReminder()) {
        // Show toast with action buttons
        toast((t) => (
          <div className="flex flex-col gap-3">
            <div className="flex items-start gap-3">
              <FiDownload className="text-amber-500 mt-1 shrink-0" size={20} />
              <div>
                <p className="font-semibold text-gray-900">Backup Reminder</p>
                <p className="text-sm text-gray-600 mt-1">
                  It's been a while since your last backup. Keep your data safe!
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => {
                  const result = exportBackup();
                  if (result.success) {
                    toast.success('Backup created successfully! 💾', { id: t.id });
                  } else {
                    toast.error('Failed to create backup', { id: t.id });
                  }
                }}
                className="flex-1 bg-indigo-600 text-white px-3 py-2 rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors"
              >
                Backup Now
              </button>
              <button
                onClick={() => {
                  snoozeBackupReminder();
                  toast.success('Reminder snoozed for 3 days', { id: t.id });
                }}
                className="flex-1 bg-gray-100 text-gray-700 px-3 py-2 rounded-lg text-sm font-medium hover:bg-gray-200 transition-colors"
              >
                Remind Later
              </button>
            </div>
          </div>
        ), {
          duration: 10000,
          position: 'top-center',
          style: {
            minWidth: '320px',
            maxWidth: '500px',
            width: '90vw',
          },
        });
      }
    };

    // Check after a short delay to avoid blocking initial render
    const timer = setTimeout(checkBackup, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <ErrorBoundary>
      {/* Offline Indicator */}
      {!isOnline && (
        <div className="fixed top-0 left-0 right-0 bg-amber-500 text-white py-2 px-4 text-center text-sm font-medium z-[100] flex items-center justify-center gap-2">
          <FiWifiOff size={16} />
          <span>You're offline - Changes will be saved locally</span>
        </div>
      )}

      <Suspense fallback={<PageLoader />}>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Dashboard />} />
            <Route path="habits" element={<Habits />} />
            <Route path="statistics" element={<Statistics />} />
            <Route path="calendar" element={<Calendar />} />
            <Route path="journal" element={<Journal />} />
            <Route path="settings" element={<Settings />} />
            <Route path="maintenance" element={<Maintenance />} />
          </Route>
          <Route path="/focus" element={<FocusMode />} />
        </Routes>

        <CommandPalette
          isOpen={commandPaletteOpen}
          onClose={() => setCommandPaletteOpen(false)}
        />
      </Suspense>
    </ErrorBoundary>
  );
}

export default App;
