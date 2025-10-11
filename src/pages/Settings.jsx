import React from 'react';
import { FiUser, FiMoon, FiBell, FiDatabase, FiInfo } from 'react-icons/fi';

const Settings = () => {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Settings</h1>
        <p className="text-[var(--text-secondary)]">
          Customize your experience
        </p>
      </div>

      {/* Settings Sections */}
      <div className="space-y-4">
        {/* Profile Section */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center mb-4">
            <FiUser className="text-[var(--accent-primary)] mr-3" size={24} />
            <h2 className="text-xl font-semibold">Profile</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-[var(--text-secondary)] mb-2">
                Display Name
              </label>
              <input
                type="text"
                placeholder="Your name"
                className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-[var(--text-primary)] focus:outline-none focus:border-[var(--accent-primary)]"
              />
            </div>
          </div>
        </div>

        {/* Theme Section */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center mb-4">
            <FiMoon className="text-[var(--accent-primary)] mr-3" size={24} />
            <h2 className="text-xl font-semibold">Theme</h2>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[var(--text-secondary)]">Dark Mode</span>
            <div className="relative inline-block w-12 h-6">
              <input type="checkbox" className="sr-only" defaultChecked />
              <div className="w-12 h-6 bg-[var(--accent-primary)] rounded-full shadow-inner"></div>
              <div className="absolute w-5 h-5 bg-white rounded-full shadow top-0.5 right-0.5 transition-transform"></div>
            </div>
          </div>
        </div>

        {/* Notifications Section */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center mb-4">
            <FiBell className="text-[var(--accent-primary)] mr-3" size={24} />
            <h2 className="text-xl font-semibold">Notifications</h2>
          </div>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-[var(--text-secondary)]">Daily Reminders</span>
              <div className="relative inline-block w-12 h-6">
                <input type="checkbox" className="sr-only" />
                <div className="w-12 h-6 bg-[var(--border)] rounded-full shadow-inner"></div>
                <div className="absolute w-5 h-5 bg-white rounded-full shadow top-0.5 left-0.5 transition-transform"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Data Section */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center mb-4">
            <FiDatabase className="text-[var(--accent-primary)] mr-3" size={24} />
            <h2 className="text-xl font-semibold">Data Management</h2>
          </div>
          <div className="space-y-3">
            <button className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors">
              Export Data
            </button>
            <button className="w-full px-4 py-2 bg-[var(--bg-primary)] border border-[var(--border)] rounded-lg text-[var(--text-secondary)] hover:border-[var(--accent-primary)] hover:text-[var(--text-primary)] transition-colors">
              Import Data
            </button>
            <button className="w-full px-4 py-2 bg-[var(--error)] bg-opacity-10 border border-[var(--error)] rounded-lg text-[var(--error)] hover:bg-opacity-20 transition-colors">
              Clear All Data
            </button>
          </div>
        </div>

        {/* About Section */}
        <div className="bg-[var(--bg-secondary)] rounded-xl p-6 border border-[var(--border)]">
          <div className="flex items-center mb-4">
            <FiInfo className="text-[var(--accent-primary)] mr-3" size={24} />
            <h2 className="text-xl font-semibold">About</h2>
          </div>
          <div className="text-[var(--text-secondary)]">
            <p className="mb-2">Perseverance v1.0.0</p>
            <p className="text-sm">
              A personal habit tracker to help you build consistency and achieve your goals.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;
