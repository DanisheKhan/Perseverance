import { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import { FiX, FiCheck, FiEdit2, FiTrash2 } from 'react-icons/fi';
import { HiOutlineEmojiHappy, HiOutlineEmojiSad } from 'react-icons/hi';
import { formatDate } from '../utils/helpers';
import toast from 'react-hot-toast';

const MOOD_EMOJIS = [
  { emoji: '😊', label: 'Great', value: 5 },
  { emoji: '🙂', label: 'Good', value: 4 },
  { emoji: '😐', label: 'Okay', value: 3 },
  { emoji: '😕', label: 'Bad', value: 2 },
  { emoji: '😢', label: 'Awful', value: 1 },
];

const DayDetailModal = ({ date, onClose }) => {
  const { habits, completions, markComplete, updateCompletion } = useHabits();
  const [notes, setNotes] = useState({});
  const [mood, setMood] = useState(null);
  const [editingNote, setEditingNote] = useState(null);

  const dateStr = date.toISOString().split('T')[0];
  const isToday = dateStr === new Date().toISOString().split('T')[0];
  const isPastDate = date < new Date(new Date().setHours(0, 0, 0, 0));

  // Get day data
  const dayCompletions = completions.filter((c) => c.date === dateStr);
  const activeHabits = habits.filter((h) => h.isActive);

  // Load existing notes and mood
  useEffect(() => {
    const dayNotes = {};
    dayCompletions.forEach((c) => {
      if (c.note) {
        dayNotes[c.habitId] = c.note;
      }
      if (c.mood && !mood) {
        setMood(c.mood);
      }
    });
    setNotes(dayNotes);
  }, [dayCompletions]);

  const getHabitCompletion = (habitId) => {
    return dayCompletions.find((c) => c.habitId === habitId);
  };

  const handleToggleComplete = async (habitId) => {
    const completion = getHabitCompletion(habitId);
    const isCompleted = completion?.completed || false;

    try {
      await markComplete(habitId, dateStr, !isCompleted);
      toast.success(
        !isCompleted
          ? '✓ Marked as complete'
          : '✗ Marked as incomplete'
      );
    } catch (error) {
      toast.error('Failed to update habit');
    }
  };

  const handleUpdateNote = (habitId, note) => {
    const completion = getHabitCompletion(habitId);
    if (completion) {
      updateCompletion(completion.id, { note });
      setNotes({ ...notes, [habitId]: note });
      setEditingNote(null);
      toast.success('Note updated');
    }
  };

  const handleDeleteNote = (habitId) => {
    const completion = getHabitCompletion(habitId);
    if (completion) {
      updateCompletion(completion.id, { note: '' });
      const newNotes = { ...notes };
      delete newNotes[habitId];
      setNotes(newNotes);
      toast.success('Note deleted');
    }
  };

  const handleUpdateMood = (moodValue) => {
    setMood(moodValue);
    // Update all completions for this day with mood
    dayCompletions.forEach((c) => {
      updateCompletion(c.id, { mood: moodValue });
    });
    toast.success('Mood updated');
  };

  const completedCount = dayCompletions.filter((c) => c.completed).length;
  const completionRate = activeHabits.length > 0
    ? Math.round((completedCount / activeHabits.length) * 100)
    : 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <div className="bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden border border-zinc-800 shadow-2xl">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">
              {formatDate(dateStr)}
            </h2>
            <p className="text-sm text-zinc-400 mt-1">
              {completedCount} of {activeHabits.length} habits completed ({completionRate}%)
            </p>
          </div>
          <button
            onClick={onClose}
            className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-400 hover:text-zinc-100 flex items-center justify-center transition-colors"
          >
            <FiX size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Mood Tracker */}
          <div className="mb-6">
            <h3 className="text-sm font-semibold text-zinc-100 mb-3">
              How was your day?
            </h3>
            <div className="flex gap-2">
              {MOOD_EMOJIS.map((moodOption) => (
                <button
                  key={moodOption.value}
                  onClick={() => handleUpdateMood(moodOption.value)}
                  className={`
                    flex-1 p-3 rounded-xl transition-all
                    ${
                      mood === moodOption.value
                        ? 'bg-indigo-500 ring-2 ring-indigo-400'
                        : 'bg-zinc-800 hover:bg-zinc-700'
                    }
                  `}
                >
                  <div className="text-2xl mb-1">{moodOption.emoji}</div>
                  <div className="text-xs text-zinc-400">{moodOption.label}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Habits List */}
          <div className="space-y-3">
            <h3 className="text-sm font-semibold text-zinc-100 mb-3">
              Habits for this day
            </h3>
            {activeHabits.map((habit) => {
              const completion = getHabitCompletion(habit.id);
              const isCompleted = completion?.completed || false;
              const habitNote = notes[habit.id] || '';

              return (
                <div
                  key={habit.id}
                  className="bg-zinc-800/50 rounded-xl p-4 border border-zinc-700"
                >
                  <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <button
                      onClick={() => handleToggleComplete(habit.id)}
                      className={`
                        w-6 h-6 rounded-lg border-2 flex items-center justify-center flex-shrink-0 transition-all mt-0.5
                        ${
                          isCompleted
                            ? 'bg-emerald-500 border-emerald-500'
                            : 'border-zinc-600 hover:border-zinc-500'
                        }
                      `}
                    >
                      {isCompleted && <FiCheck className="text-white" size={16} />}
                    </button>

                    {/* Habit Info */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <div
                          className="w-8 h-8 rounded-lg flex items-center justify-center text-lg"
                          style={{ backgroundColor: `${habit.color}20` }}
                        >
                          {habit.icon}
                        </div>
                        <div className="flex-1">
                          <h4
                            className={`font-medium ${
                              isCompleted
                                ? 'text-zinc-100'
                                : 'text-zinc-300'
                            }`}
                          >
                            {habit.name}
                          </h4>
                          {habit.description && (
                            <p className="text-xs text-zinc-500">
                              {habit.description}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Note Section */}
                      {editingNote === habit.id ? (
                        <div className="mt-3">
                          <textarea
                            value={habitNote}
                            onChange={(e) =>
                              setNotes({ ...notes, [habit.id]: e.target.value })
                            }
                            placeholder="Add a note..."
                            className="w-full px-3 py-2 bg-zinc-900 border border-zinc-700 rounded-lg text-zinc-100 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none"
                            rows={3}
                          />
                          <div className="flex gap-2 mt-2">
                            <button
                              onClick={() =>
                                handleUpdateNote(habit.id, habitNote)
                              }
                              className="px-3 py-1.5 bg-indigo-500 hover:bg-indigo-600 text-white text-sm rounded-lg transition-colors"
                            >
                              Save
                            </button>
                            <button
                              onClick={() => setEditingNote(null)}
                              className="px-3 py-1.5 bg-zinc-700 hover:bg-zinc-600 text-zinc-200 text-sm rounded-lg transition-colors"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      ) : habitNote ? (
                        <div className="mt-3 p-3 bg-zinc-900/50 rounded-lg border border-zinc-700">
                          <p className="text-sm text-zinc-300 mb-2">
                            {habitNote}
                          </p>
                          <div className="flex gap-2">
                            <button
                              onClick={() => setEditingNote(habit.id)}
                              className="text-xs text-indigo-400 hover:text-indigo-300 flex items-center gap-1"
                            >
                              <FiEdit2 size={12} />
                              Edit
                            </button>
                            <button
                              onClick={() => handleDeleteNote(habit.id)}
                              className="text-xs text-red-400 hover:text-red-300 flex items-center gap-1"
                            >
                              <FiTrash2 size={12} />
                              Delete
                            </button>
                          </div>
                        </div>
                      ) : (
                        isCompleted && (
                          <button
                            onClick={() => setEditingNote(habit.id)}
                            className="mt-3 text-xs text-zinc-500 hover:text-indigo-400 flex items-center gap-1"
                          >
                            <FiEdit2 size={12} />
                            Add note
                          </button>
                        )
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Empty State */}
          {activeHabits.length === 0 && (
            <div className="text-center py-12">
              <p className="text-zinc-500">No active habits for this day</p>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-zinc-800">
          <div className="flex items-center justify-between">
            <div className="text-sm text-zinc-400">
              {isPastDate ? 'Past date' : isToday ? 'Today' : 'Future date'}
            </div>
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DayDetailModal;
