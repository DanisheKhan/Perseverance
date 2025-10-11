import { createContext, useContext, useEffect, useState } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { generateId, getCurrentDate } from '../utils/helpers';
import { initialHabits } from '../data/constants';

const HabitContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useLocalStorage('habits', initialHabits);
  const [completions, setCompletions] = useLocalStorage('completions', []);
  const [settings, setSettings] = useLocalStorage('settings', {
    theme: 'dark',
    userName: 'Champion',
    motivationalQuotes: true,
    startOfWeek: 'monday',
    notifications: true,
  });

  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check data persistence on load
    const checkDataPersistence = () => {
      try {
        const storedHabits = localStorage.getItem('habits');
        const storedCompletions = localStorage.getItem('completions');
        const storedSettings = localStorage.getItem('settings');

        if (!storedHabits) {
          setHabits(initialHabits);
        }
        if (!storedCompletions) {
          setCompletions([]);
        }
        if (!storedSettings) {
          setSettings({
            theme: 'dark',
            userName: 'Champion',
            motivationalQuotes: true,
            startOfWeek: 'monday',
            notifications: true,
          });
        }

        setIsLoading(false);
      } catch (error) {
        console.error('Error loading data:', error);
        setIsLoading(false);
      }
    };

    checkDataPersistence();
  }, []);

  // Habit Management Functions
  const addHabit = (habitData) => {
    const newHabit = {
      id: generateId(),
      name: habitData.name,
      description: habitData.description || '',
      category: habitData.category || 'Personal',
      color: habitData.color || '#6366F1',
      frequency: habitData.frequency || 'daily', // daily, weekly, custom
      createdDate: getCurrentDate(),
      isActive: true,
      target: habitData.target || 7, // days per week
      icon: habitData.icon || '🎯',
    };

    setHabits((prev) => [...prev, newHabit]);
    return newHabit;
  };

  const updateHabit = (habitId, updates) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, ...updates } : habit
      )
    );
  };

  const deleteHabit = (habitId) => {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
    // Also remove completions for this habit
    setCompletions((prev) => prev.filter((comp) => comp.habitId !== habitId));
  };

  const toggleHabitActive = (habitId) => {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId ? { ...habit, isActive: !habit.isActive } : habit
      )
    );
  };

  // Completion Management Functions
  const markComplete = (habitId, date = getCurrentDate(), note = '') => {
    const existingCompletion = completions.find(
      (comp) => comp.habitId === habitId && comp.date === date
    );

    if (existingCompletion) {
      // Toggle completion
      setCompletions((prev) =>
        prev.map((comp) =>
          comp.id === existingCompletion.id
            ? { ...comp, completed: !comp.completed, note }
            : comp
        )
      );
    } else {
      // Create new completion
      const newCompletion = {
        id: generateId(),
        habitId,
        date,
        completed: true,
        note,
        timestamp: new Date().toISOString(),
      };
      setCompletions((prev) => [...prev, newCompletion]);
    }
  };

  const getCompletionsForDate = (date = getCurrentDate()) => {
    return completions.filter((comp) => comp.date === date);
  };

  const getCompletionsForHabit = (habitId) => {
    return completions.filter((comp) => comp.habitId === habitId);
  };

  const isHabitCompleteForDate = (habitId, date = getCurrentDate()) => {
    const completion = completions.find(
      (comp) => comp.habitId === habitId && comp.date === date && comp.completed
    );
    return !!completion;
  };

  const updateCompletion = (completionId, updates) => {
    setCompletions((prev) =>
      prev.map((comp) =>
        comp.id === completionId ? { ...comp, ...updates } : comp
      )
    );
  };

  // Statistics Functions
  const calculateStreak = (habitId) => {
    const habitCompletions = completions
      .filter((comp) => comp.habitId === habitId && comp.completed)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (habitCompletions.length === 0) return 0;

    let streak = 0;
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    for (let i = 0; i < habitCompletions.length; i++) {
      const compDate = new Date(habitCompletions[i].date);
      compDate.setHours(0, 0, 0, 0);

      const expectedDate = new Date(today);
      expectedDate.setDate(today.getDate() - i);
      expectedDate.setHours(0, 0, 0, 0);

      if (compDate.getTime() === expectedDate.getTime()) {
        streak++;
      } else {
        break;
      }
    }

    return streak;
  };

  const getWeeklyProgress = (habitId) => {
    const today = new Date();
    const weekAgo = new Date(today);
    weekAgo.setDate(today.getDate() - 7);

    const weekCompletions = completions.filter((comp) => {
      const compDate = new Date(comp.date);
      return (
        comp.habitId === habitId &&
        comp.completed &&
        compDate >= weekAgo &&
        compDate <= today
      );
    });

    return {
      completed: weekCompletions.length,
      total: 7,
      percentage: Math.round((weekCompletions.length / 7) * 100),
    };
  };

  const getMonthlyStats = (habitId) => {
    const today = new Date();
    const monthAgo = new Date(today);
    monthAgo.setDate(today.getDate() - 30);

    const monthCompletions = completions.filter((comp) => {
      const compDate = new Date(comp.date);
      return (
        comp.habitId === habitId &&
        comp.completed &&
        compDate >= monthAgo &&
        compDate <= today
      );
    });

    return {
      completed: monthCompletions.length,
      total: 30,
      percentage: Math.round((monthCompletions.length / 30) * 100),
    };
  };

  const getHabitStats = (habitId) => {
    const habitCompletions = completions.filter(
      (comp) => comp.habitId === habitId && comp.completed
    );

    const habit = habits.find((h) => h.id === habitId);
    const daysSinceCreated = Math.floor(
      (new Date() - new Date(habit?.createdDate || new Date())) /
      (1000 * 60 * 60 * 24)
    );

    return {
      totalCompletions: habitCompletions.length,
      currentStreak: calculateStreak(habitId),
      weeklyProgress: getWeeklyProgress(habitId),
      monthlyProgress: getMonthlyStats(habitId),
      completionRate:
        daysSinceCreated > 0
          ? Math.round((habitCompletions.length / daysSinceCreated) * 100)
          : 0,
    };
  };

  const getOverallStats = () => {
    const activeHabits = habits.filter((h) => h.isActive);
    const todayCompletions = getCompletionsForDate();
    const completedToday = todayCompletions.filter((c) => c.completed).length;

    return {
      totalHabits: habits.length,
      activeHabits: activeHabits.length,
      completedToday,
      todayProgress:
        activeHabits.length > 0
          ? Math.round((completedToday / activeHabits.length) * 100)
          : 0,
    };
  };

  // Data Export/Import Functions
  const exportData = () => {
    const data = {
      habits,
      completions,
      settings,
      exportDate: new Date().toISOString(),
      version: '1.0',
    };

    const dataStr = JSON.stringify(data, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);

    const link = document.createElement('a');
    link.href = url;
    link.download = `perseverance-backup-${getCurrentDate()}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const importData = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target.result);

          if (data.habits && data.completions && data.settings) {
            setHabits(data.habits);
            setCompletions(data.completions);
            setSettings(data.settings);
            resolve('Data imported successfully!');
          } else {
            reject('Invalid backup file format');
          }
        } catch (error) {
          reject('Error parsing backup file');
        }
      };

      reader.onerror = () => reject('Error reading file');
      reader.readAsText(file);
    });
  };

  const clearAllData = () => {
    setHabits(initialHabits);
    setCompletions([]);
    setSettings({
      theme: 'dark',
      userName: 'Champion',
      motivationalQuotes: true,
      startOfWeek: 'monday',
      notifications: true,
    });
  };

  const value = {
    habits,
    completions,
    settings,
    isLoading,
    // Habit functions
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitActive,
    // Completion functions
    markComplete,
    getCompletionsForDate,
    getCompletionsForHabit,
    isHabitCompleteForDate,
    updateCompletion,
    // Statistics functions
    calculateStreak,
    getWeeklyProgress,
    getMonthlyStats,
    getHabitStats,
    getOverallStats,
    // Data management
    exportData,
    importData,
    clearAllData,
    updateSettings: setSettings,
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};
