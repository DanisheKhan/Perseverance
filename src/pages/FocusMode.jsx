import { useState, useEffect } from 'react';
import { useHabits } from '../context/HabitContext';
import { useNavigate } from 'react-router-dom';
import {
  FiX,
  FiMaximize2,
  FiMinimize2,
  FiPlay,
  FiPause,
  FiRefreshCw,
  FiCheck,
} from 'react-icons/fi';
import toast from 'react-hot-toast';

const FocusMode = () => {
  const { habits, markComplete, completions } = useHabits();
  const navigate = useNavigate();
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pomodoroTime, setPomodoroTime] = useState(25 * 60); // 25 minutes in seconds
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [timerMode, setTimerMode] = useState('focus'); // focus, shortBreak, longBreak
  const [completedToday, setCompletedToday] = useState(new Set());

  const today = new Date().toISOString().split('T')[0];
  const todayHabits = habits.filter((habit) => !habit.archived);

  useEffect(() => {
    const todayCompletions = completions.filter((c) => c.date === today);
    setCompletedToday(new Set(todayCompletions.map((c) => c.habitId)));
  }, [completions, today]);

  // Timer countdown
  useEffect(() => {
    let interval;
    if (isTimerRunning && pomodoroTime > 0) {
      interval = setInterval(() => {
        setPomodoroTime((prev) => prev - 1);
      }, 1000);
    } else if (pomodoroTime === 0) {
      setIsTimerRunning(false);
      handleTimerComplete();
    }
    return () => clearInterval(interval);
  }, [isTimerRunning, pomodoroTime]);

  const handleTimerComplete = () => {
    const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBTGH0fPTgjMGHm7A7+OZURE=');
    audio.play().catch(() => { });

    if (timerMode === 'focus') {
      toast.success('🎉 Focus session complete! Time for a break.');
    } else {
      toast.success('Break over! Ready for another focus session?');
    }
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const startTimer = () => setIsTimerRunning(true);
  const pauseTimer = () => setIsTimerRunning(false);
  const resetTimer = () => {
    setIsTimerRunning(false);
    if (timerMode === 'focus') setPomodoroTime(25 * 60);
    else if (timerMode === 'shortBreak') setPomodoroTime(5 * 60);
    else setPomodoroTime(15 * 60);
  };

  const changeTimerMode = (mode) => {
    setTimerMode(mode);
    setIsTimerRunning(false);
    if (mode === 'focus') setPomodoroTime(25 * 60);
    else if (mode === 'shortBreak') setPomodoroTime(5 * 60);
    else setPomodoroTime(15 * 60);
  };

  const handleComplete = (habitId) => {
    markComplete(habitId);
    setCompletedToday((prev) => new Set([...prev, habitId]));
    toast.success('Habit completed!');
  };

  const completedCount = todayHabits.filter((h) => completedToday.has(h.id)).length;
  const progress = todayHabits.length > 0 ? (completedCount / todayHabits.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-zinc-900 via-zinc-950 to-black flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-zinc-800">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Focus Mode</h1>
          <p className="text-sm text-zinc-400">
            {completedCount} of {todayHabits.length} habits completed
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleFullscreen}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
          >
            {isFullscreen ? <FiMinimize2 size={20} /> : <FiMaximize2 size={20} />}
          </button>
          <button
            onClick={() => navigate('/')}
            className="p-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-colors"
            title="Exit focus mode"
          >
            <FiX size={20} />
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col lg:flex-row">
        {/* Pomodoro Timer Section */}
        <div className="lg:w-1/2 flex flex-col items-center justify-center p-8 border-r border-zinc-800">
          <div className="space-y-8 w-full max-w-md">
            {/* Timer Mode Selector */}
            <div className="flex gap-2">
              <button
                onClick={() => changeTimerMode('focus')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${timerMode === 'focus'
                    ? 'bg-indigo-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
              >
                Focus (25m)
              </button>
              <button
                onClick={() => changeTimerMode('shortBreak')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${timerMode === 'shortBreak'
                    ? 'bg-emerald-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
              >
                Short (5m)
              </button>
              <button
                onClick={() => changeTimerMode('longBreak')}
                className={`flex-1 px-4 py-2 rounded-lg font-medium transition-all ${timerMode === 'longBreak'
                    ? 'bg-amber-500 text-white'
                    : 'bg-zinc-800 text-zinc-400 hover:bg-zinc-700'
                  }`}
              >
                Long (15m)
              </button>
            </div>

            {/* Timer Display */}
            <div className="relative">
              <svg className="w-full h-auto" viewBox="0 0 200 200">
                {/* Background circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke="#27272a"
                  strokeWidth="8"
                />
                {/* Progress circle */}
                <circle
                  cx="100"
                  cy="100"
                  r="90"
                  fill="none"
                  stroke={
                    timerMode === 'focus'
                      ? '#6366f1'
                      : timerMode === 'shortBreak'
                        ? '#10b981'
                        : '#f59e0b'
                  }
                  strokeWidth="8"
                  strokeDasharray={`${2 * Math.PI * 90}`}
                  strokeDashoffset={`${2 *
                    Math.PI *
                    90 *
                    (1 -
                      pomodoroTime /
                      (timerMode === 'focus'
                        ? 25 * 60
                        : timerMode === 'shortBreak'
                          ? 5 * 60
                          : 15 * 60))
                    }`}
                  strokeLinecap="round"
                  transform="rotate(-90 100 100)"
                  className="transition-all duration-1000"
                />
              </svg>
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-6xl font-bold text-zinc-100 font-mono">
                  {formatTime(pomodoroTime)}
                </span>
              </div>
            </div>

            {/* Timer Controls */}
            <div className="flex items-center justify-center gap-4">
              <button
                onClick={isTimerRunning ? pauseTimer : startTimer}
                className={`p-6 rounded-full transition-all ${timerMode === 'focus'
                    ? 'bg-indigo-500 hover:bg-indigo-600'
                    : timerMode === 'shortBreak'
                      ? 'bg-emerald-500 hover:bg-emerald-600'
                      : 'bg-amber-500 hover:bg-amber-600'
                  } text-white shadow-lg hover:scale-110`}
              >
                {isTimerRunning ? <FiPause size={28} /> : <FiPlay size={28} />}
              </button>
              <button
                onClick={resetTimer}
                className="p-6 rounded-full bg-zinc-800 hover:bg-zinc-700 text-zinc-300 transition-all hover:scale-110"
              >
                <FiRefreshCw size={28} />
              </button>
            </div>
          </div>
        </div>

        {/* Habits Section */}
        <div className="lg:w-1/2 flex flex-col p-8">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-zinc-100 mb-2">Today's Habits</h2>
            <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="space-y-3 overflow-y-auto flex-1 pr-2">
            {todayHabits.length === 0 ? (
              <div className="text-center py-12 text-zinc-500">
                <p>No habits for today.</p>
                <p className="text-sm mt-2">Create habits to get started.</p>
              </div>
            ) : (
              todayHabits.map((habit) => {
                const isCompleted = completedToday.has(habit.id);
                return (
                  <button
                    key={habit.id}
                    onClick={() => !isCompleted && handleComplete(habit.id)}
                    disabled={isCompleted}
                    className={`w-full flex items-center gap-4 p-4 rounded-xl transition-all ${isCompleted
                        ? 'bg-emerald-500/10 border-2 border-emerald-500/50'
                        : 'bg-zinc-800/50 border-2 border-zinc-700 hover:border-indigo-500 hover:bg-zinc-800'
                      }`}
                  >
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center text-2xl ${isCompleted ? 'bg-emerald-500' : 'bg-zinc-700'
                        }`}
                    >
                      {isCompleted ? (
                        <FiCheck className="text-white" size={24} />
                      ) : (
                        habit.icon
                      )}
                    </div>
                    <div className="flex-1 text-left">
                      <h3
                        className={`font-medium ${isCompleted
                            ? 'text-emerald-300 line-through'
                            : 'text-zinc-100'
                          }`}
                      >
                        {habit.name}
                      </h3>
                      <p className="text-sm text-zinc-500">{habit.category}</p>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusMode;
