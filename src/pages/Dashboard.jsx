import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useHabits } from '../context/HabitContext';
import { formatDate, getWeekDates, getCurrentDate } from '../utils/helpers';
import { MOTIVATIONAL_QUOTES } from '../data/constants';
import toast from 'react-hot-toast';
import ProgressRing from '../components/ProgressRing';
import HabitCard from '../components/HabitCard';
import QuickStats from '../components/QuickStats';
import WeekCalendar from '../components/WeekCalendar';
import EmptyState from '../components/EmptyState';
import SmartInsights from '../components/SmartInsights';
import { FiPlus, FiCalendar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const Dashboard = () => {
  const navigate = useNavigate();
  const {
    habits,
    completions,
    settings,
    markComplete,
    isHabitCompleteForDate,
    calculateStreak,
    getOverallStats,
    getCompletionsForDate,
  } = useHabits();

  const [selectedDate, setSelectedDate] = useState(getCurrentDate());
  const [quote, setQuote] = useState('');
  const weekDates = getWeekDates();
  const activeHabits = habits.filter((h) => h.isActive);
  const todayStats = getOverallStats();

  // Set random motivational quote on mount
  useEffect(() => {
    if (settings.motivationalQuotes) {
      const randomQuote =
        MOTIVATIONAL_QUOTES[Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)];
      setQuote(randomQuote);
    }
  }, [settings.motivationalQuotes]);

  // Calculate enhanced stats
  const enhancedStats = {
    ...todayStats,
    bestStreak: Math.max(
      0,
      ...habits.map((h) => calculateStreak(h.id))
    ),
    weeklyScore: (() => {
      if (activeHabits.length === 0) return 0;
      const weekCompletions = completions.filter((comp) => {
        const compDate = new Date(comp.date);
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return comp.completed && compDate >= weekAgo;
      }).length;
      const possibleCompletions = activeHabits.length * 7;
      return Math.round((weekCompletions / possibleCompletions) * 100);
    })(),
  };

  const handleToggleHabit = (habitId) => {
    const isComplete = isHabitCompleteForDate(habitId, selectedDate);
    markComplete(habitId, selectedDate);

    const habit = habits.find((h) => h.id === habitId);
    if (!isComplete) {
      toast.success(`Great job! ${habit.name} completed! 🎉`, {
        icon: '✅',
      });
    } else {
      toast(`${habit.name} marked as incomplete`, {
        icon: '↩️',
      });
    }
  };

  const handleAddNote = (habitId, note) => {
    markComplete(habitId, selectedDate, note);
    toast.success('Note added successfully!');
  };

  const handleDateSelect = (date) => {
    setSelectedDate(date);
  };

  const handleCreateHabit = () => {
    navigate('/habits');
  };

  const isViewingToday = selectedDate === getCurrentDate();
  const selectedDateHabits = isViewingToday ? activeHabits : habits;
  const selectedDateCompletions = getCompletionsForDate(selectedDate);

  return (
    <div className="space-y-8 pb-24">
      {/* Header Section */}
      <div className="bg-gradient-to-br from-zinc-900/80 to-zinc-900/40 backdrop-blur-sm rounded-2xl p-8 border border-zinc-800 shadow-xl">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          {/* Left: Greeting & Quote */}
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-3xl md:text-4xl font-bold text-zinc-100">
                Welcome back, {settings.userName || 'Champion'}! 👋
              </h1>
            </div>
            <div className="flex items-center gap-2 text-zinc-400 mb-4">
              <FiCalendar size={16} />
              <p className="text-sm">{formatDate(new Date())}</p>
            </div>
            {settings.motivationalQuotes && quote && (
              <p className="text-indigo-300 italic text-lg max-w-2xl leading-relaxed">
                "{quote}"
              </p>
            )}
          </div>

          {/* Right: Progress Ring */}
          <div className="shrink-0">
            <ProgressRing progress={todayStats.todayProgress} />
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStats stats={enhancedStats} />

      {/* Smart Insights */}
      <SmartInsights />

      {/* Week Calendar */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-2xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold text-zinc-100 flex items-center gap-2">
            <HiSparkles className="text-amber-400" />
            This Week's Activity
          </h2>
          {!isViewingToday && (
            <button
              onClick={() => setSelectedDate(getCurrentDate())}
              className="text-sm text-indigo-400 hover:text-indigo-300 transition-colors"
            >
              Back to Today
            </button>
          )}
        </div>
        <WeekCalendar
          dates={weekDates}
          completions={completions}
          onDateSelect={handleDateSelect}
        />
      </div>

      {/* Today's Habits Section */}
      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-zinc-100">
            {isViewingToday ? "Today's Habits" : `Habits for ${formatDate(selectedDate)}`}
          </h2>
          {selectedDateHabits.length > 0 && (
            <span className="text-sm text-zinc-400">
              {selectedDateCompletions.filter((c) => c.completed).length} /{' '}
              {selectedDateHabits.length} completed
            </span>
          )}
        </div>

        {selectedDateHabits.length === 0 ? (
          <EmptyState onCreateHabit={handleCreateHabit} />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            {selectedDateHabits.map((habit) => (
              <HabitCard
                key={habit.id}
                habit={habit}
                isCompleted={isHabitCompleteForDate(habit.id, selectedDate)}
                onToggle={() => handleToggleHabit(habit.id)}
                streak={calculateStreak(habit.id)}
                onAddNote={(note) => handleAddNote(habit.id, note)}
              />
            ))}
          </div>
        )}
      </div>

      {/* Floating Action Button */}
      {activeHabits.length > 0 && (
        <button
          onClick={handleCreateHabit}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-full shadow-2xl shadow-indigo-500/40 hover:shadow-indigo-500/60 hover:scale-110 transition-all duration-300 flex items-center justify-center z-50 group"
          title="Create new habit"
        >
          <FiPlus size={28} strokeWidth={2.5} className="group-hover:rotate-90 transition-transform duration-300" />
        </button>
      )}
    </div>
  );
};

export default Dashboard;
