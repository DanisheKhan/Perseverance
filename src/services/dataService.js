// Data service functions for habit management

/**
 * Get all habits from localStorage
 */
export const getAllHabits = () => {
  try {
    const habits = localStorage.getItem("habits");
    return habits ? JSON.parse(habits) : [];
  } catch (error) {
    console.error("Error getting habits:", error);
    return [];
  }
};

/**
 * Get active habits only
 */
export const getActiveHabits = () => {
  const habits = getAllHabits();
  return habits.filter((habit) => habit.isActive);
};

/**
 * Get habit by ID
 */
export const getHabitById = (habitId) => {
  const habits = getAllHabits();
  return habits.find((habit) => habit.id === habitId);
};

/**
 * Save habits to localStorage
 */
export const saveHabits = (habits) => {
  try {
    localStorage.setItem("habits", JSON.stringify(habits));
    return true;
  } catch (error) {
    console.error("Error saving habits:", error);
    return false;
  }
};

/**
 * Get all completions from localStorage
 */
export const getAllCompletions = () => {
  try {
    const completions = localStorage.getItem("completions");
    return completions ? JSON.parse(completions) : [];
  } catch (error) {
    console.error("Error getting completions:", error);
    return [];
  }
};

/**
 * Save completions to localStorage
 */
export const saveCompletions = (completions) => {
  try {
    localStorage.setItem("completions", JSON.stringify(completions));
    return true;
  } catch (error) {
    console.error("Error saving completions:", error);
    return false;
  }
};

/**
 * Get settings from localStorage
 */
export const getSettings = () => {
  try {
    const settings = localStorage.getItem("settings");
    return settings
      ? JSON.parse(settings)
      : {
          theme: "dark",
          userName: "Champion",
          motivationalQuotes: true,
          startOfWeek: "monday",
          notifications: true,
        };
  } catch (error) {
    console.error("Error getting settings:", error);
    return {
      theme: "dark",
      userName: "Champion",
      motivationalQuotes: true,
      startOfWeek: "monday",
      notifications: true,
    };
  }
};

/**
 * Save settings to localStorage
 */
export const saveSettings = (settings) => {
  try {
    localStorage.setItem("settings", JSON.stringify(settings));
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
};

/**
 * Check localStorage availability
 */
export const isLocalStorageAvailable = () => {
  try {
    const test = "__localStorage_test__";
    localStorage.setItem(test, test);
    localStorage.removeItem(test);
    return true;
  } catch (e) {
    return false;
  }
};

/**
 * Get storage usage stats
 */
export const getStorageStats = () => {
  try {
    const habits = localStorage.getItem("habits") || "";
    const completions = localStorage.getItem("completions") || "";
    const settings = localStorage.getItem("settings") || "";

    const totalSize = habits.length + completions.length + settings.length;
    const sizeInKB = (totalSize / 1024).toFixed(2);

    return {
      totalSize,
      sizeInKB,
      habitCount: JSON.parse(habits || "[]").length,
      completionCount: JSON.parse(completions || "[]").length,
    };
  } catch (error) {
    console.error("Error getting storage stats:", error);
    return {
      totalSize: 0,
      sizeInKB: "0",
      habitCount: 0,
      completionCount: 0,
    };
  }
};

/**
 * Validate data integrity
 */
export const validateDataIntegrity = () => {
  try {
    const habits = getAllHabits();
    const completions = getAllCompletions();

    // Check for orphaned completions (completions without corresponding habits)
    const habitIds = new Set(habits.map((h) => h.id));
    const orphanedCompletions = completions.filter(
      (comp) => !habitIds.has(comp.habitId)
    );

    return {
      isValid: orphanedCompletions.length === 0,
      orphanedCompletions: orphanedCompletions.length,
      totalHabits: habits.length,
      totalCompletions: completions.length,
    };
  } catch (error) {
    console.error("Error validating data:", error);
    return {
      isValid: false,
      error: error.message,
    };
  }
};

/**
 * Clean orphaned completions
 */
export const cleanOrphanedCompletions = () => {
  try {
    const habits = getAllHabits();
    const completions = getAllCompletions();
    const habitIds = new Set(habits.map((h) => h.id));

    const cleanedCompletions = completions.filter((comp) =>
      habitIds.has(comp.habitId)
    );

    saveCompletions(cleanedCompletions);
    return completions.length - cleanedCompletions.length;
  } catch (error) {
    console.error("Error cleaning completions:", error);
    return 0;
  }
};
