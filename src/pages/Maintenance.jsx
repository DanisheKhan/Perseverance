import { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import {
  FiTool,
  FiTrash2,
  FiDownload,
  FiUpload,
  FiCheck,
  FiAlertCircle,
  FiRefreshCw,
  FiDatabase,
  FiZap,
  FiActivity,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const Maintenance = () => {
  const { habits, completions, exportData, importData, clearAllData } = useHabits();
  const [stats, setStats] = useState({
    totalStorage: 0,
    habitsSize: 0,
    completionsSize: 0,
    settingsSize: 0,
    cacheSize: 0,
  });
  const [lastBackup, setLastBackup] = useState(null);
  const [diagnostics, setDiagnostics] = useState(null);

  useEffect(() => {
    calculateStorageStats();
    checkLastBackup();
    runDiagnostics();
  }, []);

  const calculateStorageStats = () => {
    try {
      let totalSize = 0;
      const sizes = {};

      for (const key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          const size = new Blob([localStorage.getItem(key)]).size;
          totalSize += size;

          if (key.includes('habits')) sizes.habitsSize = (sizes.habitsSize || 0) + size;
          else if (key.includes('completions')) sizes.completionsSize = (sizes.completionsSize || 0) + size;
          else if (key.includes('settings')) sizes.settingsSize = (sizes.settingsSize || 0) + size;
          else sizes.cacheSize = (sizes.cacheSize || 0) + size;
        }
      }

      setStats({
        totalStorage: totalSize,
        habitsSize: sizes.habitsSize || 0,
        completionsSize: sizes.completionsSize || 0,
        settingsSize: sizes.settingsSize || 0,
        cacheSize: sizes.cacheSize || 0,
      });
    } catch (error) {
      console.error('Failed to calculate storage:', error);
    }
  };

  const checkLastBackup = () => {
    const backup = localStorage.getItem('last_backup_date');
    if (backup) {
      setLastBackup(new Date(backup));
    }
  };

  const runDiagnostics = () => {
    const results = {
      dataIntegrity: checkDataIntegrity(),
      duplicates: findDuplicates(),
      orphanedCompletions: findOrphanedCompletions(),
      performance: checkPerformance(),
    };
    setDiagnostics(results);
  };

  const checkDataIntegrity = () => {
    try {
      const issues = [];

      // Check for habits without required fields
      habits.forEach((habit) => {
        if (!habit.id || !habit.name) {
          issues.push(`Habit missing required fields: ${habit.id || 'unknown'}`);
        }
      });

      // Check for completions without dates
      completions.forEach((comp) => {
        if (!comp.date || !comp.habitId) {
          issues.push(`Completion missing required fields: ${comp.id || 'unknown'}`);
        }
      });

      return {
        status: issues.length === 0 ? 'healthy' : 'issues',
        issues,
        count: issues.length,
      };
    } catch (error) {
      return { status: 'error', issues: [error.message], count: 1 };
    }
  };

  const findDuplicates = () => {
    const duplicates = [];
    const seen = new Set();

    completions.forEach((comp) => {
      const key = `${comp.habitId}-${comp.date}`;
      if (seen.has(key)) {
        duplicates.push(key);
      }
      seen.add(key);
    });

    return {
      status: duplicates.length === 0 ? 'clean' : 'found',
      count: duplicates.length,
      items: duplicates,
    };
  };

  const findOrphanedCompletions = () => {
    const habitIds = new Set(habits.map((h) => h.id));
    const orphaned = completions.filter((c) => !habitIds.has(c.habitId));

    return {
      status: orphaned.length === 0 ? 'clean' : 'found',
      count: orphaned.length,
      items: orphaned.map((c) => c.id),
    };
  };

  const checkPerformance = () => {
    const start = performance.now();
    // Simulate data processing
    habits.forEach((h) => JSON.stringify(h));
    completions.forEach((c) => JSON.stringify(c));
    const duration = performance.now() - start;

    return {
      status: duration < 100 ? 'optimal' : duration < 500 ? 'good' : 'slow',
      duration: Math.round(duration),
    };
  };

  const handleAutoBackup = () => {
    try {
      const data = exportData();
      const blob = new Blob([data], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `perseverance-backup-${new Date().toISOString().split('T')[0]}.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);

      localStorage.setItem('last_backup_date', new Date().toISOString());
      setLastBackup(new Date());
      toast.success('Backup created successfully!');
    } catch (error) {
      toast.error('Backup failed: ' + error.message);
    }
  };

  const handleClearCache = () => {
    try {
      // Clear non-essential data
      const keysToKeep = ['habits', 'completions', 'settings'];
      const keysToRemove = [];

      for (const key in localStorage) {
        if (!keysToKeep.some((k) => key.includes(k))) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach((key) => localStorage.removeItem(key));

      calculateStorageStats();
      toast.success(`Cleared ${keysToRemove.length} cache items`);
    } catch (error) {
      toast.error('Failed to clear cache');
    }
  };

  const handleFixIssues = () => {
    if (!diagnostics) return;

    try {
      let fixed = 0;

      // Remove orphaned completions
      if (diagnostics.orphanedCompletions.count > 0) {
        // This would require updating the context to remove specific completions
        toast.info('Please manually review orphaned completions in developer mode');
      }

      // Remove duplicates
      if (diagnostics.duplicates.count > 0) {
        toast.info('Please export data, remove duplicates manually, and reimport');
      }

      runDiagnostics();
      toast.success(`Diagnostics refreshed`);
    } catch (error) {
      toast.error('Failed to fix issues');
    }
  };

  const formatBytes = (bytes) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
  };

  const getDaysSinceBackup = () => {
    if (!lastBackup) return null;
    const days = Math.floor((new Date() - lastBackup) / (1000 * 60 * 60 * 24));
    return days;
  };

  const getStatusColor = (status) => {
    const colors = {
      healthy: 'text-emerald-400',
      clean: 'text-emerald-400',
      optimal: 'text-emerald-400',
      good: 'text-blue-400',
      issues: 'text-amber-400',
      found: 'text-amber-400',
      slow: 'text-red-400',
      error: 'text-red-400',
    };
    return colors[status] || 'text-zinc-400';
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <FiTool className="text-indigo-400" />
          Maintenance & Diagnostics
        </h1>
        <p className="text-zinc-400 mt-1">
          Monitor app health and optimize performance
        </p>
      </div>

      {/* Storage Stats */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <FiDatabase className="text-cyan-400" size={24} />
          <h2 className="text-xl font-semibold text-zinc-100">Storage Usage</h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-zinc-800/30 rounded-lg p-4">
            <p className="text-xs text-zinc-500 mb-1">Total</p>
            <p className="text-lg font-bold text-zinc-100">{formatBytes(stats.totalStorage)}</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4">
            <p className="text-xs text-zinc-500 mb-1">Habits</p>
            <p className="text-lg font-bold text-zinc-100">{formatBytes(stats.habitsSize)}</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4">
            <p className="text-xs text-zinc-500 mb-1">Completions</p>
            <p className="text-lg font-bold text-zinc-100">{formatBytes(stats.completionsSize)}</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4">
            <p className="text-xs text-zinc-500 mb-1">Settings</p>
            <p className="text-lg font-bold text-zinc-100">{formatBytes(stats.settingsSize)}</p>
          </div>
          <div className="bg-zinc-800/30 rounded-lg p-4">
            <p className="text-xs text-zinc-500 mb-1">Cache</p>
            <p className="text-lg font-bold text-zinc-100">{formatBytes(stats.cacheSize)}</p>
          </div>
        </div>

        <button
          onClick={handleClearCache}
          className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors text-sm flex items-center gap-2"
        >
          <FiTrash2 size={16} />
          Clear Cache
        </button>
      </div>

      {/* Backup Status */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiDownload className="text-emerald-400" size={24} />
            <h2 className="text-xl font-semibold text-zinc-100">Backup Status</h2>
          </div>
          <button
            onClick={handleAutoBackup}
            className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg transition-colors text-sm flex items-center gap-2"
          >
            <FiDownload size={16} />
            Create Backup
          </button>
        </div>

        <div className="flex items-center gap-4">
          {lastBackup ? (
            <>
              <div className="flex-1">
                <p className="text-sm text-zinc-400">Last Backup</p>
                <p className="text-lg font-semibold text-zinc-100">
                  {lastBackup.toLocaleDateString()} at {lastBackup.toLocaleTimeString()}
                </p>
                <p className="text-xs text-zinc-500 mt-1">
                  {getDaysSinceBackup() === 0
                    ? 'Today'
                    : `${getDaysSinceBackup()} days ago`}
                </p>
              </div>
              {getDaysSinceBackup() > 7 && (
                <div className="flex items-center gap-2 text-amber-400">
                  <FiAlertCircle size={20} />
                  <span className="text-sm">Backup recommended</span>
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center gap-2 text-amber-400">
              <FiAlertCircle size={20} />
              <span>No backup found - Create your first backup</span>
            </div>
          )}
        </div>
      </div>

      {/* Diagnostics */}
      {diagnostics && (
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <FiActivity className="text-purple-400" size={24} />
              <h2 className="text-xl font-semibold text-zinc-100">Health Diagnostics</h2>
            </div>
            <button
              onClick={runDiagnostics}
              className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors text-sm flex items-center gap-2"
            >
              <FiRefreshCw size={16} />
              Refresh
            </button>
          </div>

          <div className="space-y-4">
            {/* Data Integrity */}
            <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg">
              <div>
                <p className="font-medium text-zinc-100">Data Integrity</p>
                <p className="text-sm text-zinc-500">
                  {diagnostics.dataIntegrity.count === 0
                    ? 'All data is valid'
                    : `${diagnostics.dataIntegrity.count} issues found`}
                </p>
              </div>
              <span className={`font-bold capitalize ${getStatusColor(diagnostics.dataIntegrity.status)}`}>
                {diagnostics.dataIntegrity.status}
              </span>
            </div>

            {/* Duplicates */}
            <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg">
              <div>
                <p className="font-medium text-zinc-100">Duplicate Entries</p>
                <p className="text-sm text-zinc-500">
                  {diagnostics.duplicates.count === 0
                    ? 'No duplicates found'
                    : `${diagnostics.duplicates.count} duplicates detected`}
                </p>
              </div>
              <span className={`font-bold capitalize ${getStatusColor(diagnostics.duplicates.status)}`}>
                {diagnostics.duplicates.status}
              </span>
            </div>

            {/* Orphaned Completions */}
            <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg">
              <div>
                <p className="font-medium text-zinc-100">Orphaned Data</p>
                <p className="text-sm text-zinc-500">
                  {diagnostics.orphanedCompletions.count === 0
                    ? 'No orphaned completions'
                    : `${diagnostics.orphanedCompletions.count} orphaned entries`}
                </p>
              </div>
              <span className={`font-bold capitalize ${getStatusColor(diagnostics.orphanedCompletions.status)}`}>
                {diagnostics.orphanedCompletions.status}
              </span>
            </div>

            {/* Performance */}
            <div className="flex items-center justify-between p-4 bg-zinc-800/30 rounded-lg">
              <div>
                <p className="font-medium text-zinc-100">Performance</p>
                <p className="text-sm text-zinc-500">
                  Data processing: {diagnostics.performance.duration}ms
                </p>
              </div>
              <span className={`font-bold capitalize ${getStatusColor(diagnostics.performance.status)}`}>
                {diagnostics.performance.status}
              </span>
            </div>
          </div>

          {(diagnostics.dataIntegrity.count > 0 ||
            diagnostics.duplicates.count > 0 ||
            diagnostics.orphanedCompletions.count > 0) && (
              <button
                onClick={handleFixIssues}
                className="mt-6 w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
              >
                <FiZap size={18} />
                View Fix Recommendations
              </button>
            )}
        </div>
      )}

      {/* Quick Actions */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <FiZap className="text-yellow-400" size={24} />
          <h2 className="text-xl font-semibold text-zinc-100">Quick Actions</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <button
            onClick={() => calculateStorageStats()}
            className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700 transition-colors text-left"
          >
            <p className="font-medium text-zinc-100 mb-1">Recalculate Storage</p>
            <p className="text-sm text-zinc-500">Update storage statistics</p>
          </button>

          <button
            onClick={() => runDiagnostics()}
            className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700 transition-colors text-left"
          >
            <p className="font-medium text-zinc-100 mb-1">Run Full Diagnostics</p>
            <p className="text-sm text-zinc-500">Check app health</p>
          </button>

          <button
            onClick={() => {
              localStorage.removeItem('error_log');
              toast.success('Error logs cleared');
            }}
            className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700 transition-colors text-left"
          >
            <p className="font-medium text-zinc-100 mb-1">Clear Error Logs</p>
            <p className="text-sm text-zinc-500">Remove debug information</p>
          </button>

          <button
            onClick={() => window.location.reload()}
            className="p-4 bg-zinc-800/50 hover:bg-zinc-800 rounded-lg border border-zinc-700 transition-colors text-left"
          >
            <p className="font-medium text-zinc-100 mb-1">Force Reload</p>
            <p className="text-sm text-zinc-500">Restart the application</p>
          </button>
        </div>
      </div>

      {/* Version Info */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-zinc-400">Application Version</p>
            <p className="text-2xl font-bold text-zinc-100">1.0.0</p>
            <p className="text-xs text-zinc-500 mt-1">Last updated: October 2025</p>
          </div>
          <FiCheck className="text-indigo-400" size={32} />
        </div>
      </div>
    </div>
  );
};

export default Maintenance;
