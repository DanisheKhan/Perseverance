import { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import {
  FiCalendar,
  FiChevronLeft,
  FiChevronRight,
  FiFilter,
  FiList,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import DayDetailModal from '../components/DayDetailModal';
import { getDaysInMonth, getMonthName } from '../utils/helpers';

const Calendar = () => {
  const { habits, completions } = useHabits();
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [viewMode, setViewMode] = useState('month'); // 'month' or 'week'

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  // Calendar grid data
  const calendarData = useMemo(() => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = getDaysInMonth(year, month);
    const daysInPrevMonth = getDaysInMonth(year, month - 1);

    const days = [];

    // Previous month days
    for (let i = firstDay - 1; i >= 0; i--) {
      days.push({
        date: new Date(year, month - 1, daysInPrevMonth - i),
        isCurrentMonth: false,
      });
    }

    // Current month days
    for (let i = 1; i <= daysInMonth; i++) {
      days.push({
        date: new Date(year, month, i),
        isCurrentMonth: true,
      });
    }

    // Next month days to fill grid
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      days.push({
        date: new Date(year, month + 1, i),
        isCurrentMonth: false,
      });
    }

    return days;
  }, [year, month]);

  // Get completions for a specific date
  const getDateCompletions = (date) => {
    const dateStr = date.toISOString().split('T')[0];
    return completions.filter((c) => c.date === dateStr);
  };

  // Get completed habits for a date
  const getCompletedHabits = (date) => {
    const dateCompletions = getDateCompletions(date);
    return dateCompletions
      .filter((c) => c.completed)
      .map((c) => habits.find((h) => h.id === c.habitId))
      .filter(Boolean);
  };

  // Month statistics
  const monthStats = useMemo(() => {
    const monthStart = new Date(year, month, 1);
    const monthEnd = new Date(year, month + 1, 0);
    const daysInMonth = monthEnd.getDate();

    const monthCompletions = completions.filter((c) => {
      const cDate = new Date(c.date);
      return cDate >= monthStart && cDate <= monthEnd && c.completed;
    });

    const activeHabits = habits.filter((h) => h.isActive);
    const totalPossible = daysInMonth * activeHabits.length;
    const completionRate = totalPossible > 0
      ? Math.round((monthCompletions.length / totalPossible) * 100)
      : 0;

    // Find streaks started/broken
    let streaksStarted = 0;
    let streamsBroken = 0;

    activeHabits.forEach((habit) => {
      const habitCompletions = monthCompletions
        .filter((c) => c.habitId === habit.id)
        .map((c) => new Date(c.date).getDate())
        .sort((a, b) => a - b);

      for (let i = 0; i < habitCompletions.length; i++) {
        if (i === 0 || habitCompletions[i] !== habitCompletions[i - 1] + 1) {
          streaksStarted++;
        }
        if (
          i > 0 &&
          habitCompletions[i] !== habitCompletions[i - 1] + 1
        ) {
          streamsBroken++;
        }
      }
    });

    // Find special days (milestones)
    const specialDays = [];
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(year, month, day);
      const dateStr = date.toISOString().split('T')[0];
      const dayCompletions = completions.filter(
        (c) => c.date === dateStr && c.completed
      );

      if (dayCompletions.length === activeHabits.length && activeHabits.length > 0) {
        specialDays.push({ day, type: 'perfect', label: 'Perfect Day' });
      }
    }

    return {
      completionRate,
      totalCompletions: monthCompletions.length,
      streaksStarted,
      streamsBroken,
      specialDays,
    };
  }, [year, month, completions, habits]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const handleDateClick = (date) => {
    if (date <= new Date()) {
      setSelectedDate(date);
    }
  };

  const isToday = (date) => {
    const today = new Date();
    return (
      date.getDate() === today.getDate() &&
      date.getMonth() === today.getMonth() &&
      date.getFullYear() === today.getFullYear()
    );
  };

  const isFutureDate = (date) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return date > today;
  };

  // Filter habits for calendar
  const filteredHabits = selectedHabit
    ? habits.filter((h) => h.id === selectedHabit)
    : habits.filter((h) => h.isActive);

  return (
    <div className="space-y-6 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <FiCalendar className="text-indigo-400" />
            Calendar & History
          </h1>
          <p className="text-zinc-400 mt-1">
            View your habit completion history
          </p>
        </div>
        <div className="flex items-center gap-3">
          <select
            value={selectedHabit || ''}
            onChange={(e) => setSelectedHabit(e.target.value || null)}
            className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="">All Habits</option>
            {habits
              .filter((h) => h.isActive)
              .map((habit) => (
                <option key={habit.id} value={habit.id}>
                  {habit.icon} {habit.name}
                </option>
              ))}
          </select>
        </div>
      </div>

      {/* Calendar Navigation */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button
              onClick={handlePrevMonth}
              className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 flex items-center justify-center transition-colors"
            >
              <FiChevronLeft size={20} />
            </button>
            <h2 className="text-2xl font-bold text-zinc-100 min-w-[200px] text-center">
              {getMonthName(currentDate)} {year}
            </h2>
            <button
              onClick={handleNextMonth}
              className="w-10 h-10 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-100 flex items-center justify-center transition-colors"
            >
              <FiChevronRight size={20} />
            </button>
          </div>
          <button
            onClick={handleToday}
            className="px-4 py-2 rounded-lg bg-indigo-500 hover:bg-indigo-600 text-white font-medium transition-colors"
          >
            Today
          </button>
        </div>

        {/* Calendar Grid */}
        <div>
          {/* Day labels */}
          <div className="grid grid-cols-7 gap-2 mb-2">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
              <div
                key={day}
                className="text-center text-sm font-medium text-zinc-500 py-2"
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-2">
            {calendarData.map((day, index) => {
              const completedHabits = getCompletedHabits(day.date);
              const isTodayDate = isToday(day.date);
              const isFuture = isFutureDate(day.date);
              const hasSpecialDay = monthStats.specialDays.find(
                (sd) => sd.day === day.date.getDate() && day.isCurrentMonth
              );

              return (
                <button
                  key={index}
                  onClick={() => handleDateClick(day.date)}
                  disabled={isFuture}
                  className={`
                    relative aspect-square p-2 rounded-lg transition-all
                    ${day.isCurrentMonth
                      ? 'bg-zinc-800/50'
                      : 'bg-zinc-900/30 opacity-40'
                    }
                    ${isTodayDate ? 'ring-2 ring-indigo-500' : ''}
                    ${!isFuture && day.isCurrentMonth
                      ? 'hover:bg-zinc-700 cursor-pointer'
                      : ''
                    }
                    ${isFuture ? 'cursor-not-allowed opacity-30' : ''}
                    ${hasSpecialDay ? 'ring-2 ring-amber-500' : ''}
                  `}
                >
                  <div className="flex flex-col h-full">
                    <span
                      className={`
                      text-sm font-medium mb-1
                      ${isTodayDate ? 'text-indigo-400' : 'text-zinc-100'}
                      ${!day.isCurrentMonth ? 'text-zinc-600' : ''}
                    `}
                    >
                      {day.date.getDate()}
                    </span>
                    {hasSpecialDay && (
                      <div className="absolute top-1 right-1">
                        <HiSparkles className="text-amber-400 text-xs" />
                      </div>
                    )}
                    <div className="flex flex-wrap gap-0.5 justify-center mt-auto">
                      {completedHabits.slice(0, 6).map((habit) => (
                        <div
                          key={habit.id}
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ backgroundColor: habit.color }}
                          title={habit.name}
                        />
                      ))}
                      {completedHabits.length > 6 && (
                        <div
                          className="w-1.5 h-1.5 rounded-full bg-zinc-500"
                          title={`+${completedHabits.length - 6} more`}
                        />
                      )}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Month Statistics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm text-zinc-400">Month Completion</h3>
            <span className="text-2xl font-bold text-indigo-300">
              {monthStats.completionRate}%
            </span>
          </div>
          <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all"
              style={{ width: `${monthStats.completionRate}%` }}
            />
          </div>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <h3 className="text-sm text-zinc-400 mb-2">Total Completions</h3>
          <p className="text-2xl font-bold text-emerald-300">
            {monthStats.totalCompletions}
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <h3 className="text-sm text-zinc-400 mb-2">Streaks Started</h3>
          <p className="text-2xl font-bold text-amber-300">
            {monthStats.streaksStarted}
          </p>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <h3 className="text-sm text-zinc-400 mb-2">Perfect Days</h3>
          <p className="text-2xl font-bold text-purple-300 flex items-center gap-2">
            <HiSparkles />
            {monthStats.specialDays.length}
          </p>
        </div>
      </div>

      {/* Special Days List */}
      {monthStats.specialDays.length > 0 && (
        <div className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 backdrop-blur-sm rounded-xl p-6 border border-amber-500/20">
          <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
            <HiSparkles className="text-amber-400" />
            Perfect Days This Month
          </h3>
          <div className="flex flex-wrap gap-2">
            {monthStats.specialDays.map((special, index) => (
              <div
                key={index}
                className="px-4 py-2 bg-zinc-800/50 rounded-lg border border-amber-500/30"
              >
                <span className="text-zinc-100 font-medium">
                  {getMonthName(currentDate)} {special.day}
                </span>
                <span className="text-xs text-amber-400 ml-2">
                  {special.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <h3 className="text-sm font-semibold text-zinc-100 mb-4">Legend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg ring-2 ring-indigo-500 bg-zinc-800" />
            <span className="text-sm text-zinc-400">Today</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg ring-2 ring-amber-500 bg-zinc-800 flex items-center justify-center">
              <HiSparkles className="text-amber-400 text-xs" />
            </div>
            <span className="text-sm text-zinc-400">Perfect Day</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center gap-0.5">
              <div className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            </div>
            <span className="text-sm text-zinc-400">Completed Habits</span>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-zinc-900/30 opacity-40" />
            <span className="text-sm text-zinc-400">Other Month</span>
          </div>
        </div>
      </div>

      {/* Day Detail Modal */}
      {selectedDate && (
        <DayDetailModal
          date={selectedDate}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
};

export default Calendar;
