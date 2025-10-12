import { createContext, useContext, useEffect, useState } from 'react';
import { generateId, getCurrentDate } from '../utils/helpers';
import { initialHabits } from '../data/constants';
import { habitsAPI, completionsAPI, authAPI } from '../services/api';
import toast from 'react-hot-toast';

const HabitContext = createContext();

export const useHabits = () => {
  const context = useContext(HabitContext);
  if (!context) {
    throw new Error('useHabits must be used within HabitProvider');
  }
  return context;
};

export const HabitProvider = ({ children }) => {
  const [habits, setHabits] = useState([]);
  const [completions, setCompletions] = useState([]);
  const [settings, setSettings] = useState({
    theme: 'dark',
    userName: 'Champion',
    motivationalQuotes: true,
    startOfWeek: 'monday',
    notifications: true,
  });
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication and load data
    const initializeApp = async () => {
      const token = localStorage.getItem('token');

      if (token) {
        try {
          // Get user data
          const { data } = await authAPI.getMe();
          setUser(data);
          setSettings(data.settings || settings);
          setIsAuthenticated(true);

          // Load habits and completions
          await loadHabits();
          await loadCompletions();
        } catch (error) {
          console.error('Error loading user data:', error);
          // If token is invalid, clear it
          localStorage.removeItem('token');
          setIsAuthenticated(false);
          // Use local data as fallback
          loadLocalData();
        }
      } else {
        // Not authenticated, use local storage as fallback
        setIsAuthenticated(false);
        loadLocalData();
      }

      setIsLoading(false);
    };

    initializeApp();
  }, []);

  const loadLocalData = () => {
    try {
      const storedHabits = localStorage.getItem('habits');
      const storedCompletions = localStorage.getItem('completions');
      const storedSettings = localStorage.getItem('settings');

      setHabits(storedHabits ? JSON.parse(storedHabits) : initialHabits);
      setCompletions(storedCompletions ? JSON.parse(storedCompletions) : []);
      setSettings(storedSettings ? JSON.parse(storedSettings) : settings);
    } catch (error) {
      console.error('Error loading local data:', error);
      setHabits(initialHabits);
      setCompletions([]);
    }
  };

  const loadHabits = async () => {
    try {
      const { data } = await habitsAPI.getAll();
      // Convert MongoDB _id to id for compatibility
      const formattedHabits = data.map(habit => ({
        ...habit,
        id: habit._id || habit.id,
      }));
      setHabits(formattedHabits);
      // Also save to localStorage as backup
      localStorage.setItem('habits', JSON.stringify(formattedHabits));
    } catch (error) {
      console.error('Error loading habits:', error);
      toast.error('Failed to load habits');
    }
  };

  const loadCompletions = async () => {
    try {
      const { data } = await completionsAPI.getAll();
      // Convert MongoDB _id to id for compatibility
      const formattedCompletions = data.map(comp => ({
        ...comp,
        id: comp._id || comp.id,
      }));
      setCompletions(formattedCompletions);
      // Also save to localStorage as backup
      localStorage.setItem('completions', JSON.stringify(formattedCompletions));
    } catch (error) {
      console.error('Error loading completions:', error);
      toast.error('Failed to load completions');
    }
  };

  // Auth Functions
  const login = async (credentials) => {
    try {
      const { data } = await authAPI.login(credentials);
      localStorage.setItem('token', data.token);
      setUser(data);
      setSettings(data.settings);
      setIsAuthenticated(true);

      // Load user data
      await loadHabits();
      await loadCompletions();

      toast.success('Welcome back!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const { data } = await authAPI.register(userData);
      localStorage.setItem('token', data.token);
      setUser(data);
      setSettings(data.settings);
      setIsAuthenticated(true);

      toast.success('Account created successfully!');
      return data;
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    setIsAuthenticated(false);
    setHabits([]);
    setCompletions([]);
    toast.success('Logged out successfully');
  };

  // Habit Management Functions
  const addHabit = async (habitData) => {
    const newHabitData = {
      name: habitData.name,
      description: habitData.description || '',
      category: habitData.category || 'Personal',
      color: habitData.color || '#6366F1',
      frequency: habitData.frequency || 'daily',
      createdDate: getCurrentDate(),
      isActive: true,
      target: habitData.target || 7,
      icon: habitData.icon || '🎯',
    };

    if (isAuthenticated) {
      try {
        const { data } = await habitsAPI.create(newHabitData);
        const newHabit = { ...data, id: data._id || data.id };
        setHabits((prev) => [...prev, newHabit]);
        localStorage.setItem('habits', JSON.stringify([...habits, newHabit]));
        toast.success('Habit created successfully!');
        return newHabit;
      } catch (error) {
        toast.error('Failed to create habit');
        throw error;
      }
    } else {
      // Fallback to local storage
      const newHabit = { ...newHabitData, id: generateId() };
      const updatedHabits = [...habits, newHabit];
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      return newHabit;
    }
  };

  const updateHabit = async (habitId, updates) => {
    if (isAuthenticated) {
      try {
        const { data } = await habitsAPI.update(habitId, updates);
        const updatedHabit = { ...data, id: data._id || data.id };
        const updatedHabits = habits.map((habit) =>
          habit.id === habitId ? updatedHabit : habit
        );
        setHabits(updatedHabits);
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        toast.success('Habit updated successfully!');
      } catch (error) {
        toast.error('Failed to update habit');
        throw error;
      }
    } else {
      const updatedHabits = habits.map((habit) =>
        habit.id === habitId ? { ...habit, ...updates } : habit
      );
      setHabits(updatedHabits);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
    }
  };

  const deleteHabit = async (habitId) => {
    if (isAuthenticated) {
      try {
        await habitsAPI.delete(habitId);
        const updatedHabits = habits.filter((habit) => habit.id !== habitId);
        const updatedCompletions = completions.filter((comp) => comp.habitId !== habitId);
        setHabits(updatedHabits);
        setCompletions(updatedCompletions);
        localStorage.setItem('habits', JSON.stringify(updatedHabits));
        localStorage.setItem('completions', JSON.stringify(updatedCompletions));
        toast.success('Habit deleted successfully!');
      } catch (error) {
        toast.error('Failed to delete habit');
        throw error;
      }
    } else {
      const updatedHabits = habits.filter((habit) => habit.id !== habitId);
      const updatedCompletions = completions.filter((comp) => comp.habitId !== habitId);
      setHabits(updatedHabits);
      setCompletions(updatedCompletions);
      localStorage.setItem('habits', JSON.stringify(updatedHabits));
      localStorage.setItem('completions', JSON.stringify(updatedCompletions));
    }
  };

  const toggleHabitActive = async (habitId) => {
    const habit = habits.find(h => h.id === habitId);
    if (habit) {
      await updateHabit(habitId, { isActive: !habit.isActive });
    }
  };

  // Completion Management Functions
  const markComplete = async (habitId, date = getCurrentDate(), note = '') => {
    if (isAuthenticated) {
      try {
        const { data } = await completionsAPI.create({ habitId, date, note });
        const newCompletion = {
          ...data,
          id: data._id || data.id,
          habitId: data.habitId || habitId // Ensure habitId is set
        };

        // Check if completion already exists locally
        // Compare both habitId and MongoDB _id
        const existingIndex = completions.findIndex(
          (comp) => {
            const compHabitId = comp.habitId?._id || comp.habitId;
            return (compHabitId === habitId || comp.habitId === habitId) && comp.date === date;
          }
        );

        let updatedCompletions;
        if (existingIndex !== -1) {
          updatedCompletions = completions.map((comp, idx) =>
            idx === existingIndex ? newCompletion : comp
          );
        } else {
          updatedCompletions = [...completions, newCompletion];
        }

        setCompletions(updatedCompletions);
        localStorage.setItem('completions', JSON.stringify(updatedCompletions));
        toast.success('Habit marked!');
      } catch (error) {
        console.error('Completion error:', error);
        toast.error(error.response?.data?.message || 'Failed to mark completion');
        throw error;
      }
    } else {
      // Fallback to local storage
      const existingCompletion = completions.find(
        (comp) => comp.habitId === habitId && comp.date === date
      );

      let updatedCompletions;
      if (existingCompletion) {
        updatedCompletions = completions.map((comp) =>
          comp.id === existingCompletion.id
            ? { ...comp, completed: !comp.completed, note }
            : comp
        );
      } else {
        const newCompletion = {
          id: generateId(),
          habitId,
          date,
          completed: true,
          note,
          timestamp: new Date().toISOString(),
        };
        updatedCompletions = [...completions, newCompletion];
      }

      setCompletions(updatedCompletions);
      localStorage.setItem('completions', JSON.stringify(updatedCompletions));
    }
  };

  const getCompletionsForDate = (date = getCurrentDate()) => {
    return completions.filter((comp) => comp.date === date);
  };

  const getCompletionsForHabit = (habitId) => {
    return completions.filter((comp) => {
      const compHabitId = comp.habitId?._id || comp.habitId;
      return compHabitId === habitId || comp.habitId === habitId;
    });
  };

  const isHabitCompleteForDate = (habitId, date = getCurrentDate()) => {
    const completion = completions.find(
      (comp) => {
        const compHabitId = comp.habitId?._id || comp.habitId;
        return (compHabitId === habitId || comp.habitId === habitId) &&
          comp.date === date &&
          comp.completed;
      }
    );
    return !!completion;
  };

  const updateCompletion = async (completionId, updates) => {
    if (isAuthenticated) {
      try {
        const { data } = await completionsAPI.update(completionId, updates);
        const updatedCompletion = { ...data, id: data._id || data.id };
        const updatedCompletions = completions.map((comp) =>
          comp.id === completionId ? updatedCompletion : comp
        );
        setCompletions(updatedCompletions);
        localStorage.setItem('completions', JSON.stringify(updatedCompletions));
      } catch (error) {
        toast.error('Failed to update completion');
        throw error;
      }
    } else {
      const updatedCompletions = completions.map((comp) =>
        comp.id === completionId ? { ...comp, ...updates } : comp
      );
      setCompletions(updatedCompletions);
      localStorage.setItem('completions', JSON.stringify(updatedCompletions));
    }
  };

  // Statistics Functions
  const calculateStreak = (habitId) => {
    const habitCompletions = completions
      .filter((comp) => {
        const compHabitId = comp.habitId?._id || comp.habitId;
        return (compHabitId === habitId || comp.habitId === habitId) && comp.completed;
      })
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
      const compHabitId = comp.habitId?._id || comp.habitId;
      return (
        (compHabitId === habitId || comp.habitId === habitId) &&
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
      const compHabitId = comp.habitId?._id || comp.habitId;
      return (
        (compHabitId === habitId || comp.habitId === habitId) &&
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
      (comp) => {
        const compHabitId = comp.habitId?._id || comp.habitId;
        return (compHabitId === habitId || comp.habitId === habitId) && comp.completed;
      }
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
    localStorage.setItem('habits', JSON.stringify(initialHabits));
    localStorage.setItem('completions', JSON.stringify([]));
    localStorage.setItem('settings', JSON.stringify(settings));
  };

  const updateSettingsHandler = async (newSettings) => {
    if (isAuthenticated) {
      try {
        await authAPI.updateSettings(newSettings);
        setSettings(newSettings);
        toast.success('Settings updated successfully!');
      } catch (error) {
        toast.error('Failed to update settings');
        throw error;
      }
    } else {
      setSettings(newSettings);
      localStorage.setItem('settings', JSON.stringify(newSettings));
    }
  };

  const value = {
    habits,
    completions,
    settings,
    isLoading,
    user,
    isAuthenticated,
    // Auth functions
    login,
    register,
    logout,
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
    updateSettings: updateSettingsHandler,
  };

  return (
    <HabitContext.Provider value={value}>{children}</HabitContext.Provider>
  );
};
