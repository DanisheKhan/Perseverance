import { useState } from 'react';
import { FiCheck, FiEdit2, FiMessageSquare } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const HabitCard = ({ habit, isCompleted, onToggle, streak, onAddNote }) => {
  const [showNote, setShowNote] = useState(false);
  const [note, setNote] = useState('');
  const [isAnimating, setIsAnimating] = useState(false);

  const handleToggle = () => {
    setIsAnimating(true);
    setTimeout(() => setIsAnimating(false), 600);
    onToggle();
  };

  const handleSaveNote = () => {
    onAddNote(note);
    setNote('');
    setShowNote(false);
  };

  return (
    <div
      className="group relative bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/10"
      style={{
        background: isCompleted
          ? `linear-gradient(135deg, ${habit.color}15 0%, transparent 100%)`
          : undefined,
      }}
    >
      {/* Gradient border effect */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background: `linear-gradient(135deg, ${habit.color}40, transparent)`,
          filter: 'blur(20px)',
          zIndex: -1,
        }}
      />

      <div className="flex items-start justify-between gap-4">
        {/* Left section */}
        <div className="flex items-start gap-4 flex-1">
          {/* Icon */}
          <div
            className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform duration-300 group-hover:scale-110"
            style={{ backgroundColor: `${habit.color}20` }}
          >
            {habit.icon}
          </div>

          {/* Content */}
          <div className="flex-1 min-w-0">
            <h3 className="text-lg font-semibold text-zinc-100 mb-1 truncate">
              {habit.name}
            </h3>
            {habit.description && (
              <p className="text-sm text-zinc-400 mb-3 line-clamp-2">
                {habit.description}
              </p>
            )}

            {/* Stats */}
            <div className="flex items-center gap-4 text-sm">
              {streak > 0 && (
                <div className="flex items-center gap-1.5">
                  <HiSparkles className="text-amber-400" />
                  <span className="text-zinc-300">
                    <span className="font-semibold text-amber-400">{streak}</span> day streak
                  </span>
                </div>
              )}
              <span
                className="px-2 py-1 rounded-md text-xs font-medium"
                style={{
                  backgroundColor: `${habit.color}20`,
                  color: habit.color,
                }}
              >
                {habit.frequency}
              </span>
            </div>
          </div>
        </div>

        {/* Right section - Actions */}
        <div className="flex items-center gap-2">
          {/* Note button */}
          <button
            onClick={() => setShowNote(!showNote)}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
            title="Add note"
          >
            <FiMessageSquare size={18} />
          </button>

          {/* Checkbox */}
          <button
            onClick={handleToggle}
            className={`relative w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-300 ${isCompleted
                ? 'bg-gradient-to-br shadow-lg'
                : 'bg-zinc-800 hover:bg-zinc-700'
              } ${isAnimating ? 'scale-95' : 'scale-100'}`}
            style={
              isCompleted
                ? {
                  backgroundImage: `linear-gradient(135deg, ${habit.color}, ${habit.color}dd)`,
                  boxShadow: `0 8px 16px ${habit.color}40`,
                }
                : {}
            }
          >
            {isCompleted && (
              <FiCheck
                className={`text-white transition-all duration-300 ${isAnimating ? 'scale-0 rotate-180' : 'scale-100 rotate-0'
                  }`}
                size={24}
                strokeWidth={3}
              />
            )}
            {!isCompleted && (
              <div className="w-5 h-5 rounded-md border-2 border-zinc-600" />
            )}
          </button>
        </div>
      </div>

      {/* Note input */}
      {showNote && (
        <div className="mt-4 pt-4 border-t border-zinc-800 animate-in fade-in slide-in-from-top-2 duration-200">
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add a note about this completion..."
            className="w-full bg-zinc-800/50 border border-zinc-700 rounded-lg px-3 py-2 text-sm text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none"
            rows={2}
          />
          <div className="flex justify-end gap-2 mt-2">
            <button
              onClick={() => {
                setShowNote(false);
                setNote('');
              }}
              className="px-3 py-1.5 text-sm text-zinc-400 hover:text-zinc-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSaveNote}
              className="px-3 py-1.5 text-sm bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitCard;
