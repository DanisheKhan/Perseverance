import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';
import {
  FiUser,
  FiEye,
  FiSliders,
  FiBell,
  FiDatabase,
  FiInfo,
  FiDownload,
  FiUpload,
  FiTrash2,
  FiCheck,
  FiX,
  FiSettings,
  FiZap,
  FiCommand,
  FiAlertTriangle,
  FiLogOut,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import toast from 'react-hot-toast';

const AVATAR_EMOJIS = [
  '😊', '😎', '🎯', '🚀', '💪', '🌟', '🔥', '⚡', '🎨', '📚',
  '🧘', '🏃', '🎵', '🌈', '💡', '🦸', '🎭', '🌺', '🦋', '🐉',
];

const THEME_VARIANTS = [
  { id: 'pure-dark', name: 'Pure Dark', bg: '#000000' },
  { id: 'dark-blue', name: 'Dark Blue', bg: '#0A1929' },
  { id: 'dark-purple', name: 'Dark Purple', bg: '#1A0B2E' },
];

const ACCENT_COLORS = [
  { name: 'Indigo', color: '#6366F1' },
  { name: 'Blue', color: '#3B82F6' },
  { name: 'Purple', color: '#8B5CF6' },
  { name: 'Pink', color: '#EC4899' },
  { name: 'Emerald', color: '#10B981' },
  { name: 'Amber', color: '#F59E0B' },
  { name: 'Red', color: '#EF4444' },
  { name: 'Cyan', color: '#06B6D4' },
];

const KEYBOARD_SHORTCUTS = [
  { keys: ['D'], description: 'Go to Dashboard' },
  { keys: ['H'], description: 'Go to Habits' },
  { keys: ['S'], description: 'Go to Statistics' },
  { keys: ['C'], description: 'Go to Calendar' },
  { keys: ['N'], description: 'New Habit (on Habits page)' },
  { keys: ['Esc'], description: 'Close Modal' },
  { keys: ['?'], description: 'Show Shortcuts' },
];

const Settings = () => {
  const {
    settings,
    updateSettings,
    exportData,
    importData,
    clearAllData,
    habits,
    completions,
    user,
    isAuthenticated,
    logout,
  } = useHabits();
  const navigate = useNavigate();
  const fileInputRef = useRef(null);

  const [localSettings, setLocalSettings] = useState({
    userName: settings?.userName || 'Champion',
    avatarEmoji: settings?.avatarEmoji || '🎯',
    theme: settings?.theme || 'pure-dark',
    accentColor: settings?.accentColor || '#6366F1',
    fontSize: settings?.fontSize || 'medium',
    startOfWeek: settings?.startOfWeek || 'monday',
    defaultView: settings?.defaultView || 'dashboard',
    showQuotes: settings?.showQuotes !== false,
    enableSounds: settings?.enableSounds || false,
    timeFormat: settings?.timeFormat || '12',
    notifications: settings?.notifications || false,
    reminderTime: settings?.reminderTime || '09:00',
    emailReminders: settings?.emailReminders || false,
    developerMode: settings?.developerMode || false,
    performanceMode: settings?.performanceMode || false,
    compactView: settings?.compactView || false,
  });

  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showShortcuts, setShowShortcuts] = useState(false);

  // Calculate app usage
  const daysUsing = completions.length > 0
    ? Math.floor(
      (new Date() - new Date(Math.min(...completions.map((c) => new Date(c.date))))) /
      (1000 * 60 * 60 * 24)
    ) + 1
    : 0;

  const handleSettingChange = (key, value) => {
    setLocalSettings((prev) => ({ ...prev, [key]: value }));
    updateSettings({ ...settings, [key]: value });
    toast.success('Setting updated');
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleExport = () => {
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
      toast.success('Data exported successfully!');
    } catch (error) {
      toast.error('Failed to export data');
    }
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        importData(e.target.result);
        toast.success('Data imported successfully!');
        setTimeout(() => window.location.reload(), 1500);
      } catch (error) {
        toast.error('Failed to import data. Invalid file format.');
      }
    };
    reader.readAsText(file);
  };

  const handleClearData = () => {
    clearAllData();
    setShowDeleteConfirm(false);
    toast.success('All data cleared');
    setTimeout(() => window.location.reload(), 1500);
  };

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      toast.error('Browser does not support notifications');
      return;
    }

    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      handleSettingChange('notifications', true);
      toast.success('Notifications enabled!');
    } else {
      toast.error('Notification permission denied');
    }
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <FiSettings className="text-indigo-400" />
          Settings & Customization
        </h1>
        <p className="text-zinc-400 mt-1">
          Personalize your habit tracking experience
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Profile Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <FiUser className="text-indigo-400" size={24} />
            <h2 className="text-xl font-semibold text-zinc-100">Profile</h2>
          </div>

          <div className="space-y-4">
            {/* Authentication Status */}
            {isAuthenticated && user && (
              <div className="p-4 bg-indigo-500/10 border border-indigo-500/20 rounded-xl">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-zinc-400">Logged in as</span>
                  <span className="text-xs px-2 py-1 bg-green-500/20 text-green-400 rounded-full">
                    Synced
                  </span>
                </div>
                <p className="text-sm font-semibold text-zinc-100">{user.email}</p>
                <button
                  onClick={handleLogout}
                  className="mt-3 w-full flex items-center justify-center gap-2 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition-colors"
                >
                  <FiLogOut size={16} />
                  Logout
                </button>
              </div>
            )}

            {!isAuthenticated && (
              <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-sm font-medium text-amber-400">Guest Mode</span>
                  <span className="text-xs px-2 py-1 bg-amber-500/20 text-amber-400 rounded-full">
                    Local Storage
                  </span>
                </div>
                <p className="text-xs text-zinc-400 mb-3">
                  Data stored locally on this device only
                </p>
                <button
                  onClick={() => navigate('/login')}
                  className="w-full px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors text-sm font-medium"
                >
                  Login or Sign Up
                </button>
              </div>
            )}

            {/* Display Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Display Name
              </label>
              <input
                type="text"
                value={localSettings.userName}
                onChange={(e) => handleSettingChange('userName', e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                placeholder="Enter your name"
              />
            </div>

            {/* Avatar Emoji */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Avatar Emoji
              </label>
              <div className="grid grid-cols-10 gap-2">
                {AVATAR_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => handleSettingChange('avatarEmoji', emoji)}
                    className={`
                      w-10 h-10 rounded-lg text-2xl flex items-center justify-center transition-all
                      ${localSettings.avatarEmoji === emoji
                        ? 'bg-indigo-500 ring-2 ring-indigo-400 scale-110'
                        : 'bg-zinc-800 hover:bg-zinc-700'
                      }
                    `}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Appearance Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <FiEye className="text-purple-400" size={24} />
            <h2 className="text-xl font-semibold text-zinc-100">Appearance</h2>
          </div>

          <div className="space-y-4">
            {/* Theme Variant */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Theme Variant
              </label>
              <div className="space-y-2">
                {THEME_VARIANTS.map((theme) => (
                  <button
                    key={theme.id}
                    onClick={() => handleSettingChange('theme', theme.id)}
                    className={`
                      w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all
                      ${localSettings.theme === theme.id
                        ? 'bg-indigo-500/20 border-2 border-indigo-500'
                        : 'bg-zinc-800 border-2 border-transparent hover:border-zinc-700'
                      }
                    `}
                  >
                    <div
                      className="w-8 h-8 rounded-lg border-2 border-zinc-700"
                      style={{ backgroundColor: theme.bg }}
                    />
                    <span className="text-zinc-100 font-medium">{theme.name}</span>
                    {localSettings.theme === theme.id && (
                      <FiCheck className="ml-auto text-indigo-400" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Accent Color */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Accent Color
              </label>
              <div className="grid grid-cols-4 gap-2">
                {ACCENT_COLORS.map((accent) => (
                  <button
                    key={accent.color}
                    onClick={() => handleSettingChange('accentColor', accent.color)}
                    className={`
                      relative p-3 rounded-xl transition-all
                      ${localSettings.accentColor === accent.color
                        ? 'ring-2 ring-offset-2 ring-offset-zinc-900 scale-110'
                        : 'hover:scale-105'
                      }
                    `}
                    style={{
                      backgroundColor: accent.color,
                      ringColor: accent.color,
                    }}
                  >
                    {localSettings.accentColor === accent.color && (
                      <FiCheck className="text-white mx-auto" size={20} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Font Size */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Font Size
              </label>
              <select
                value={localSettings.fontSize}
                onChange={(e) => handleSettingChange('fontSize', e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="small">Small</option>
                <option value="medium">Medium (Default)</option>
                <option value="large">Large</option>
              </select>
            </div>
          </div>
        </div>

        {/* Preferences Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <FiSliders className="text-emerald-400" size={24} />
            <h2 className="text-xl font-semibold text-zinc-100">Preferences</h2>
          </div>

          <div className="space-y-4">
            {/* Start of Week */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Start of Week
              </label>
              <select
                value={localSettings.startOfWeek}
                onChange={(e) => handleSettingChange('startOfWeek', e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="sunday">Sunday</option>
                <option value="monday">Monday</option>
              </select>
            </div>

            {/* Default View */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Default View on Launch
              </label>
              <select
                value={localSettings.defaultView}
                onChange={(e) => handleSettingChange('defaultView', e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="dashboard">Dashboard</option>
                <option value="habits">Habits</option>
                <option value="statistics">Statistics</option>
                <option value="calendar">Calendar</option>
              </select>
            </div>

            {/* Time Format */}
            <div>
              <label className="block text-sm font-medium text-zinc-400 mb-2">
                Time Format
              </label>
              <select
                value={localSettings.timeFormat}
                onChange={(e) => handleSettingChange('timeFormat', e.target.value)}
                className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="12">12-hour (9:00 AM)</option>
                <option value="24">24-hour (09:00)</option>
              </select>
            </div>

            {/* Toggle Switches */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-100">Motivational Quotes</p>
                  <p className="text-xs text-zinc-500">Show daily inspiration</p>
                </div>
                <button
                  onClick={() => handleSettingChange('showQuotes', !localSettings.showQuotes)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${localSettings.showQuotes ? 'bg-indigo-500' : 'bg-zinc-700'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${localSettings.showQuotes ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-zinc-100">Sound Effects</p>
                  <p className="text-xs text-zinc-500">Enable audio feedback</p>
                </div>
                <button
                  onClick={() => handleSettingChange('enableSounds', !localSettings.enableSounds)}
                  className={`
                    relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                    ${localSettings.enableSounds ? 'bg-indigo-500' : 'bg-zinc-700'}
                  `}
                >
                  <span
                    className={`
                      inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                      ${localSettings.enableSounds ? 'translate-x-6' : 'translate-x-1'}
                    `}
                  />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center gap-3 mb-6">
            <FiBell className="text-amber-400" size={24} />
            <h2 className="text-xl font-semibold text-zinc-100">Notifications</h2>
          </div>

          <div className="space-y-4">
            {/* Browser Notifications */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">Browser Notifications</p>
                <p className="text-xs text-zinc-500">Daily habit reminders</p>
              </div>
              <button
                onClick={requestNotificationPermission}
                className={`
                  relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                  ${localSettings.notifications ? 'bg-indigo-500' : 'bg-zinc-700'}
                `}
              >
                <span
                  className={`
                    inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                    ${localSettings.notifications ? 'translate-x-6' : 'translate-x-1'}
                  `}
                />
              </button>
            </div>

            {/* Reminder Time */}
            {localSettings.notifications && (
              <div>
                <label className="block text-sm font-medium text-zinc-400 mb-2">
                  Daily Reminder Time
                </label>
                <input
                  type="time"
                  value={localSettings.reminderTime}
                  onChange={(e) => handleSettingChange('reminderTime', e.target.value)}
                  className="w-full px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            )}

            {/* Email Reminders */}
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-zinc-100">Email Reminders</p>
                <p className="text-xs text-zinc-500">Coming soon</p>
              </div>
              <button
                disabled
                className="relative inline-flex h-6 w-11 items-center rounded-full bg-zinc-700 opacity-50 cursor-not-allowed"
              >
                <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-1" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Data Management Section */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <FiDatabase className="text-cyan-400" size={24} />
          <h2 className="text-xl font-semibold text-zinc-100">Data Management</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Export Data */}
          <button
            onClick={handleExport}
            className="flex flex-col items-center gap-3 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-indigo-500 transition-colors group"
          >
            <FiDownload className="text-indigo-400 group-hover:scale-110 transition-transform" size={32} />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-100">Export Data</p>
              <p className="text-xs text-zinc-500 mt-1">Download as JSON</p>
            </div>
          </button>

          {/* Import Data */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center gap-3 p-6 bg-zinc-800/50 rounded-xl border border-zinc-700 hover:border-emerald-500 transition-colors group"
          >
            <FiUpload className="text-emerald-400 group-hover:scale-110 transition-transform" size={32} />
            <div className="text-center">
              <p className="text-sm font-medium text-zinc-100">Import Data</p>
              <p className="text-xs text-zinc-500 mt-1">Restore from file</p>
            </div>
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".json"
            onChange={handleImport}
            className="hidden"
          />

          {/* Clear Data */}
          <button
            onClick={() => setShowDeleteConfirm(true)}
            className="flex flex-col items-center gap-3 p-6 bg-red-500/10 rounded-xl border border-red-500/50 hover:border-red-500 transition-colors group"
          >
            <FiTrash2 className="text-red-400 group-hover:scale-110 transition-transform" size={32} />
            <div className="text-center">
              <p className="text-sm font-medium text-red-400">Clear All Data</p>
              <p className="text-xs text-red-500/70 mt-1">Permanent deletion</p>
            </div>
          </button>
        </div>

        {/* Data Stats */}
        <div className="mt-6 grid grid-cols-3 gap-4">
          <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-2xl font-bold text-zinc-100">{habits.length}</p>
            <p className="text-xs text-zinc-500 mt-1">Total Habits</p>
          </div>
          <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-2xl font-bold text-zinc-100">{completions.length}</p>
            <p className="text-xs text-zinc-500 mt-1">Completions</p>
          </div>
          <div className="text-center p-4 bg-zinc-800/30 rounded-lg">
            <p className="text-2xl font-bold text-zinc-100">{daysUsing}</p>
            <p className="text-xs text-zinc-500 mt-1">Days Tracking</p>
          </div>
        </div>
      </div>

      {/* Advanced Options */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <FiZap className="text-yellow-400" size={24} />
          <h2 className="text-xl font-semibold text-zinc-100">Advanced</h2>
        </div>

        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-100">Developer Mode</p>
              <p className="text-xs text-zinc-500">Show IDs and raw data</p>
            </div>
            <button
              onClick={() => handleSettingChange('developerMode', !localSettings.developerMode)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${localSettings.developerMode ? 'bg-indigo-500' : 'bg-zinc-700'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${localSettings.developerMode ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-100">Performance Mode</p>
              <p className="text-xs text-zinc-500">Reduce animations</p>
            </div>
            <button
              onClick={() => handleSettingChange('performanceMode', !localSettings.performanceMode)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${localSettings.performanceMode ? 'bg-indigo-500' : 'bg-zinc-700'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${localSettings.performanceMode ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-zinc-100">Compact View</p>
              <p className="text-xs text-zinc-500">Denser layout</p>
            </div>
            <button
              onClick={() => handleSettingChange('compactView', !localSettings.compactView)}
              className={`
                relative inline-flex h-6 w-11 items-center rounded-full transition-colors
                ${localSettings.compactView ? 'bg-indigo-500' : 'bg-zinc-700'}
              `}
            >
              <span
                className={`
                  inline-block h-4 w-4 transform rounded-full bg-white transition-transform
                  ${localSettings.compactView ? 'translate-x-6' : 'translate-x-1'}
                `}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Keyboard Shortcuts */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <FiCommand className="text-pink-400" size={24} />
            <h2 className="text-xl font-semibold text-zinc-100">Keyboard Shortcuts</h2>
          </div>
          <button
            onClick={() => setShowShortcuts(!showShortcuts)}
            className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition-colors text-sm"
          >
            {showShortcuts ? 'Hide' : 'Show'} All
          </button>
        </div>

        {showShortcuts && (
          <div className="space-y-2">
            {KEYBOARD_SHORTCUTS.map((shortcut, index) => (
              <div
                key={index}
                className="flex items-center justify-between p-3 bg-zinc-800/50 rounded-lg"
              >
                <span className="text-sm text-zinc-400">{shortcut.description}</span>
                <div className="flex gap-1">
                  {shortcut.keys.map((key, i) => (
                    <kbd
                      key={i}
                      className="px-2 py-1 text-xs font-mono bg-zinc-700 text-zinc-100 rounded border border-zinc-600"
                    >
                      {key}
                    </kbd>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* About Section */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-6">
          <FiInfo className="text-indigo-400" size={24} />
          <h2 className="text-xl font-semibold text-zinc-100">About Perseverance</h2>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Version</span>
            <span className="text-sm font-mono text-zinc-100">1.0.0</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Total Days Using App</span>
            <span className="text-sm font-bold text-indigo-300">{daysUsing} days</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-zinc-400">Built with</span>
            <span className="text-sm text-zinc-100">React + Vite + Tailwind CSS</span>
          </div>

          <div className="pt-4 border-t border-zinc-700">
            <p className="text-sm text-zinc-400 leading-relaxed">
              A personal habit tracker designed to help you build consistency, track progress, and achieve your goals.
              Built with <HiSparkles className="inline text-amber-400" /> and dedication.
            </p>
          </div>

          <button
            onClick={() => toast.success('Tutorial coming soon!')}
            className="w-full px-4 py-3 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
          >
            Replay Tutorial
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-2xl w-full max-w-md border border-red-500/50 shadow-2xl">
            <div className="p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center">
                  <FiAlertTriangle className="text-red-400" size={24} />
                </div>
                <h3 className="text-xl font-bold text-zinc-100">Clear All Data?</h3>
              </div>
              <p className="text-zinc-400 mb-6">
                This will permanently delete all your habits, completions, and settings. This action cannot be undone.
                Consider exporting your data first.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="flex-1 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleClearData}
                  className="flex-1 px-4 py-2.5 bg-red-500 hover:bg-red-600 text-white font-medium rounded-xl transition-colors"
                >
                  Delete Everything
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Settings;
