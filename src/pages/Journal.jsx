import { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import {
  FiBook,
  FiSearch,
  FiCalendar,
  FiSmile,
  FiEdit2,
  FiTrash2,
  FiSave,
  FiX,
} from 'react-icons/fi';
import { formatDate, getMonthName } from '../utils/helpers';
import toast from 'react-hot-toast';

const REFLECTION_PROMPTS = [
  'What went well today?',
  'What challenges did you face?',
  'What are you grateful for?',
  'What could you improve tomorrow?',
  'How do you feel about your progress?',
  'What habit made the biggest impact?',
];

const Journal = () => {
  const { completions, updateCompletion } = useHabits();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedDate, setSelectedDate] = useState(null);
  const [editingEntry, setEditingEntry] = useState(null);
  const [newReflection, setNewReflection] = useState('');
  const [currentPrompt, setCurrentPrompt] = useState(
    REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]
  );

  // Get unique dates with journal entries or mood
  const journalDates = useMemo(() => {
    const dateMap = new Map();

    completions.forEach((completion) => {
      if (completion.note || completion.mood) {
        if (!dateMap.has(completion.date)) {
          dateMap.set(completion.date, {
            date: completion.date,
            entries: [],
            moods: [],
          });
        }
        const dateData = dateMap.get(completion.date);
        if (completion.note) {
          dateData.entries.push({
            id: completion.id,
            habitId: completion.habitId,
            note: completion.note,
            time: completion.completedAt || completion.date,
          });
        }
        if (completion.mood) {
          dateData.moods.push(completion.mood);
        }
      }
    });

    return Array.from(dateMap.values()).sort(
      (a, b) => new Date(b.date) - new Date(a.date)
    );
  }, [completions]);

  // Filter by search
  const filteredDates = useMemo(() => {
    if (!searchQuery) return journalDates;
    return journalDates.filter(
      (dateData) =>
        dateData.entries.some((entry) =>
          entry.note.toLowerCase().includes(searchQuery.toLowerCase())
        ) || dateData.date.includes(searchQuery)
    );
  }, [journalDates, searchQuery]);

  // Calculate mood statistics
  const moodStats = useMemo(() => {
    const moodCounts = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    completions.forEach((c) => {
      if (c.mood) moodCounts[c.mood]++;
    });
    return moodCounts;
  }, [completions]);

  const getMoodEmoji = (mood) => {
    const emojis = { 1: '😢', 2: '😕', 3: '😐', 4: '🙂', 5: '😊' };
    return emojis[mood] || '😐';
  };

  const getAverageMood = (moods) => {
    if (moods.length === 0) return null;
    const avg = moods.reduce((sum, m) => sum + m, 0) / moods.length;
    return Math.round(avg);
  };

  const handleSaveReflection = () => {
    if (!newReflection.trim()) {
      toast.error('Please write something first');
      return;
    }

    // For now, store as a note on today's first completion
    const today = new Date().toISOString().split('T')[0];
    const todayCompletion = completions.find((c) => c.date === today);

    if (todayCompletion) {
      updateCompletion(todayCompletion.id, {
        note: todayCompletion.note
          ? `${todayCompletion.note}\n\n[Reflection]: ${newReflection}`
          : `[Reflection]: ${newReflection}`,
      });
      toast.success('Reflection saved!');
      setNewReflection('');
      setCurrentPrompt(
        REFLECTION_PROMPTS[Math.floor(Math.random() * REFLECTION_PROMPTS.length)]
      );
    } else {
      toast.error('Complete at least one habit today to add a reflection');
    }
  };

  const handleDeleteEntry = (entryId) => {
    updateCompletion(entryId, { note: '' });
    toast.success('Entry deleted');
  };

  const totalEntries = journalDates.reduce(
    (sum, d) => sum + d.entries.length,
    0
  );

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
          <FiBook className="text-indigo-400" />
          Journal & Reflections
        </h1>
        <p className="text-zinc-400 mt-1">Track your thoughts and moods over time</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-800">
          <p className="text-sm text-zinc-400 mb-1">Total Entries</p>
          <p className="text-2xl font-bold text-zinc-100">{totalEntries}</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-800">
          <p className="text-sm text-zinc-400 mb-1">Days Logged</p>
          <p className="text-2xl font-bold text-zinc-100">{journalDates.length}</p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-800">
          <p className="text-sm text-zinc-400 mb-1">Mood Entries</p>
          <p className="text-2xl font-bold text-zinc-100">
            {Object.values(moodStats).reduce((a, b) => a + b, 0)}
          </p>
        </div>
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-4 border border-zinc-800">
          <p className="text-sm text-zinc-400 mb-1">Average Mood</p>
          <div className="flex items-center gap-2">
            <span className="text-2xl">
              {getMoodEmoji(
                Math.round(
                  Object.entries(moodStats).reduce(
                    (sum, [mood, count]) => sum + parseInt(mood) * count,
                    0
                  ) / Math.max(Object.values(moodStats).reduce((a, b) => a + b, 0), 1)
                )
              )}
            </span>
          </div>
        </div>
      </div>

      {/* Daily Reflection Prompt */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
        <div className="flex items-center gap-3 mb-4">
          <FiEdit2 className="text-indigo-400" size={24} />
          <h2 className="text-xl font-semibold text-zinc-100">Daily Reflection</h2>
        </div>
        <p className="text-zinc-300 mb-4 italic">"{currentPrompt}"</p>
        <textarea
          value={newReflection}
          onChange={(e) => setNewReflection(e.target.value)}
          placeholder="Write your thoughts here..."
          className="w-full px-4 py-3 bg-zinc-900/50 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 min-h-[120px] resize-none"
        />
        <div className="flex items-center justify-between mt-4">
          <button
            onClick={() =>
              setCurrentPrompt(
                REFLECTION_PROMPTS[
                Math.floor(Math.random() * REFLECTION_PROMPTS.length)
                ]
              )
            }
            className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Get another prompt
          </button>
          <button
            onClick={handleSaveReflection}
            className="px-6 py-2 bg-indigo-500 hover:bg-indigo-600 text-white font-medium rounded-lg transition-colors flex items-center gap-2"
          >
            <FiSave size={18} />
            Save Reflection
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="relative">
        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search journal entries..."
          className="w-full pl-12 pr-4 py-3 bg-zinc-900/50 border border-zinc-800 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        />
      </div>

      {/* Journal Entries */}
      <div className="space-y-6">
        {filteredDates.length === 0 ? (
          <div className="text-center py-16 bg-zinc-900/50 backdrop-blur-sm rounded-xl border border-zinc-800">
            <FiBook className="mx-auto text-zinc-600 mb-4" size={48} />
            <p className="text-zinc-400">
              {searchQuery ? 'No entries found' : 'No journal entries yet'}
            </p>
            <p className="text-sm text-zinc-600 mt-2">
              Add notes to your habit completions to start journaling
            </p>
          </div>
        ) : (
          filteredDates.map((dateData) => (
            <div
              key={dateData.date}
              className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800"
            >
              {/* Date Header */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FiCalendar className="text-indigo-400" size={20} />
                  <h3 className="text-lg font-semibold text-zinc-100">
                    {formatDate(dateData.date)}
                  </h3>
                </div>
                {dateData.moods.length > 0 && (
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {getMoodEmoji(getAverageMood(dateData.moods))}
                    </span>
                    <span className="text-sm text-zinc-500">
                      Avg. mood
                    </span>
                  </div>
                )}
              </div>

              {/* Entries */}
              <div className="space-y-3">
                {dateData.entries.map((entry) => (
                  <div
                    key={entry.id}
                    className="bg-zinc-800/30 rounded-lg p-4 border border-zinc-700"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <p className="text-zinc-300 text-sm leading-relaxed flex-1 whitespace-pre-wrap">
                        {entry.note}
                      </p>
                      <button
                        onClick={() => handleDeleteEntry(entry.id)}
                        className="text-zinc-500 hover:text-red-400 transition-colors"
                        title="Delete entry"
                      >
                        <FiTrash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Journal;
