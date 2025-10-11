import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';
import { FiCommand, FiSearch, FiHome, FiCheckCircle, FiBarChart2, FiCalendar, FiSettings, FiBook, FiTarget } from 'react-icons/fi';

const CommandPalette = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef(null);
  const navigate = useNavigate();
  const { habits, markComplete } = useHabits();

  const commands = [
    // Navigation
    { id: 'nav-dashboard', label: 'Go to Dashboard', icon: FiHome, action: () => navigate('/'), category: 'Navigation' },
    { id: 'nav-habits', label: 'Go to Habits', icon: FiCheckCircle, action: () => navigate('/habits'), category: 'Navigation' },
    { id: 'nav-statistics', label: 'Go to Statistics', icon: FiBarChart2, action: () => navigate('/statistics'), category: 'Navigation' },
    { id: 'nav-calendar', label: 'Go to Calendar', icon: FiCalendar, action: () => navigate('/calendar'), category: 'Navigation' },
    { id: 'nav-journal', label: 'Go to Journal', icon: FiBook, action: () => navigate('/journal'), category: 'Navigation' },
    { id: 'nav-focus', label: 'Enter Focus Mode', icon: FiTarget, action: () => navigate('/focus'), category: 'Navigation' },
    { id: 'nav-settings', label: 'Go to Settings', icon: FiSettings, action: () => navigate('/settings'), category: 'Navigation' },

    // Habits - mark complete
    ...habits
      .filter((h) => !h.archived)
      .map((habit) => ({
        id: `complete-${habit.id}`,
        label: `Complete: ${habit.name}`,
        icon: () => <span className="text-xl">{habit.icon}</span>,
        action: () => {
          markComplete(habit.id);
          onClose();
        },
        category: 'Complete Habit',
      })),
  ];

  const filteredCommands = query
    ? commands.filter((cmd) =>
      cmd.label.toLowerCase().includes(query.toLowerCase())
    )
    : commands;

  // Group by category
  const groupedCommands = filteredCommands.reduce((acc, cmd) => {
    if (!acc[cmd.category]) acc[cmd.category] = [];
    acc[cmd.category].push(cmd);
    return acc;
  }, {});

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
      setQuery('');
      setSelectedIndex(0);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!isOpen) return;

      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex((prev) => (prev + 1) % filteredCommands.length);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev === 0 ? filteredCommands.length - 1 : prev - 1
        );
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredCommands[selectedIndex]) {
          filteredCommands[selectedIndex].action();
          onClose();
        }
      } else if (e.key === 'Escape') {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, selectedIndex, filteredCommands, onClose]);

  if (!isOpen) return null;

  let commandIndex = 0;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-start justify-center z-50 p-4 pt-24"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl w-full max-w-2xl border border-zinc-700 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Search Input */}
        <div className="flex items-center gap-3 p-4 border-b border-zinc-800">
          <FiSearch className="text-zinc-500" size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setSelectedIndex(0);
            }}
            placeholder="Type a command or search..."
            className="flex-1 bg-transparent text-zinc-100 text-lg focus:outline-none placeholder:text-zinc-600"
          />
          <kbd className="px-2 py-1 text-xs font-mono bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
            Esc
          </kbd>
        </div>

        {/* Commands List */}
        <div className="max-h-[400px] overflow-y-auto p-2">
          {Object.keys(groupedCommands).length === 0 ? (
            <div className="text-center py-8 text-zinc-500">
              <p>No commands found</p>
            </div>
          ) : (
            Object.entries(groupedCommands).map(([category, cmds]) => (
              <div key={category} className="mb-4">
                <p className="text-xs font-medium text-zinc-500 uppercase tracking-wider px-3 mb-2">
                  {category}
                </p>
                <div className="space-y-1">
                  {cmds.map((cmd) => {
                    const currentIndex = commandIndex++;
                    const Icon = cmd.icon;
                    return (
                      <button
                        key={cmd.id}
                        onClick={() => {
                          cmd.action();
                          onClose();
                        }}
                        onMouseEnter={() => setSelectedIndex(currentIndex)}
                        className={`w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-all ${selectedIndex === currentIndex
                            ? 'bg-indigo-500 text-white'
                            : 'text-zinc-300 hover:bg-zinc-800'
                          }`}
                      >
                        <Icon size={18} />
                        <span className="text-sm font-medium">{cmd.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between px-4 py-3 border-t border-zinc-800 text-xs text-zinc-500">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-zinc-800 rounded border border-zinc-700">↑</kbd>
              <kbd className="px-2 py-1 bg-zinc-800 rounded border border-zinc-700">↓</kbd>
              Navigate
            </span>
            <span className="flex items-center gap-1">
              <kbd className="px-2 py-1 bg-zinc-800 rounded border border-zinc-700">Enter</kbd>
              Select
            </span>
          </div>
          <div className="flex items-center gap-1">
            <FiCommand size={12} />
            <span>Command Palette</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CommandPalette;
