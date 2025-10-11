/**
 * Theme color constants
 */
export const colors = {
  bg: {
    primary: "#0A0A0B",
    secondary: "#111113",
    tertiary: "#1A1A1D",
  },
  accent: {
    primary: "#6366F1",
    secondary: "#818CF8",
  },
  status: {
    success: "#10B981",
    warning: "#F59E0B",
    error: "#EF4444",
  },
  text: {
    primary: "#FAFAFA",
    secondary: "#A1A1AA",
    tertiary: "#71717A",
  },
  border: "#27272A",
};

/**
 * Format date to readable string
 */
export const formatDate = (date) => {
  return new Date(date).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

/**
 * Calculate streak from habit completion data
 */
export const calculateStreak = (completions) => {
  if (!completions || completions.length === 0) return 0;

  let streak = 0;
  const today = new Date().setHours(0, 0, 0, 0);
  const sortedDates = completions
    .map((d) => new Date(d).setHours(0, 0, 0, 0))
    .sort((a, b) => b - a);

  for (let i = 0; i < sortedDates.length; i++) {
    const expectedDate = today - i * 24 * 60 * 60 * 1000;
    if (sortedDates[i] === expectedDate) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
};

/**
 * Calculate success rate percentage
 */
export const calculateSuccessRate = (completions, totalDays) => {
  if (!totalDays || totalDays === 0) return 0;
  return Math.round((completions / totalDays) * 100);
};

/**
 * Get current date in YYYY-MM-DD format
 */
export const getCurrentDate = () => {
  return new Date().toISOString().split("T")[0];
};

/**
 * Get day name from date
 */
export const getDayName = (date) => {
  return new Date(date).toLocaleDateString("en-US", { weekday: "short" });
};

/**
 * Get last 7 days dates
 */
export const getWeekDates = () => {
  const dates = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

/**
 * Calculate percentage
 */
export const calculatePercentage = (completed, total) => {
  if (total === 0) return 0;
  return Math.round((completed / total) * 100);
};

/**
 * Generate unique ID
 */
export const generateId = () => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

/**
 * Get date range for given number of days
 */
export const getDateRange = (days) => {
  const dates = [];
  const today = new Date();

  for (let i = days - 1; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(today.getDate() - i);
    dates.push(date.toISOString().split("T")[0]);
  }

  return dates;
};

/**
 * Check if date is today
 */
export const isToday = (date) => {
  const today = new Date();
  const checkDate = new Date(date);
  return (
    today.getDate() === checkDate.getDate() &&
    today.getMonth() === checkDate.getMonth() &&
    today.getFullYear() === checkDate.getFullYear()
  );
};

/**
 * Get relative time string
 */
export const getRelativeTime = (date) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now - past) / 1000);

  if (diffInSeconds < 60) return "just now";
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  if (diffInSeconds < 604800)
    return `${Math.floor(diffInSeconds / 86400)}d ago`;

  return formatDate(date);
};

/**
 * Get month name from date
 */
export const getMonthName = (date) => {
  return new Date(date).toLocaleDateString("en-US", { month: "long" });
};

/**
 * Get days in month
 */
export const getDaysInMonth = (year, month) => {
  return new Date(year, month + 1, 0).getDate();
};
