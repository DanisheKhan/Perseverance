import { useState } from 'react';
import { getDayName, isToday } from '../utils/helpers';

const WeekCalendar = ({ dates, completions, onDateSelect }) => {
  const [selectedDate, setSelectedDate] = useState(dates[dates.length - 1]);

  const handleDateClick = (date) => {
    setSelectedDate(date);
    onDateSelect(date);
  };

  const getCompletionCount = (date) => {
    return completions.filter(
      (comp) => comp.date === date && comp.completed
    ).length;
  };

  const getDayNumber = (date) => {
    return new Date(date).getDate();
  };

  return (
    <div className="flex items-center justify-between gap-2">
      {dates.map((date) => {
        const completionCount = getCompletionCount(date);
        const isSelected = date === selectedDate;
        const isTodayDate = isToday(date);

        return (
          <button
            key={date}
            onClick={() => handleDateClick(date)}
            className={`flex-1 flex flex-col items-center gap-2 p-3 rounded-xl transition-all duration-300 ${
              isSelected
                ? 'bg-indigo-600 shadow-lg shadow-indigo-500/30 scale-105'
                : 'bg-zinc-900/50 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700'
            }`}
          >
            {/* Day name */}
            <span
              className={`text-xs font-medium ${
                isSelected ? 'text-indigo-100' : 'text-zinc-400'
              }`}
            >
              {getDayName(date)}
            </span>

            {/* Day number */}
            <span
              className={`text-lg font-bold ${
                isSelected
                  ? 'text-white'
                  : isTodayDate
                  ? 'text-indigo-400'
                  : 'text-zinc-200'
              }`}
            >
              {getDayNumber(date)}
            </span>

            {/* Completion indicator */}
            <div className="flex gap-1">
              {completionCount > 0 ? (
                <>
                  {[...Array(Math.min(completionCount, 5))].map((_, i) => (
                    <div
                      key={i}
                      className={`w-1.5 h-1.5 rounded-full ${
                        isSelected ? 'bg-white' : 'bg-emerald-400'
                      }`}
                    />
                  ))}
                  {completionCount > 5 && (
                    <span
                      className={`text-xs font-medium ${
                        isSelected ? 'text-white' : 'text-emerald-400'
                      }`}
                    >
                      +{completionCount - 5}
                    </span>
                  )}
                </>
              ) : (
                <div
                  className={`w-1.5 h-1.5 rounded-full ${
                    isSelected ? 'bg-indigo-300' : 'bg-zinc-700'
                  }`}
                />
              )}
            </div>
          </button>
        );
      })}
    </div>
  );
};

export default WeekCalendar;
