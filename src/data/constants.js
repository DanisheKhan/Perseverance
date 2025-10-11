/**
 * Initial habits data structure
 */
export const initialHabitsData = {
  habits: [],
  completions: {},
  settings: {
    userName: "",
    darkMode: true,
    notifications: false,
  },
};

/**
 * Sample habit categories
 */
export const habitCategories = [
  { id: "health", name: "Health & Fitness", icon: "💪", color: "#10B981" },
  { id: "productivity", name: "Productivity", icon: "⚡", color: "#6366F1" },
  { id: "learning", name: "Learning", icon: "📚", color: "#F59E0B" },
  { id: "mindfulness", name: "Mindfulness", icon: "🧘", color: "#818CF8" },
  { id: "social", name: "Social", icon: "👥", color: "#EC4899" },
  { id: "creative", name: "Creative", icon: "🎨", color: "#8B5CF6" },
  { id: "other", name: "Other", icon: "✨", color: "#A1A1AA" },
];

/**
 * Frequency options for habits
 */
export const frequencyOptions = [
  { value: "daily", label: "Daily" },
  { value: "weekly", label: "Weekly" },
  { value: "custom", label: "Custom" },
];

/**
 * Motivational quotes
 */
export const MOTIVATIONAL_QUOTES = [
  "Success is the sum of small efforts repeated day in and day out.",
  "The secret of getting ahead is getting started.",
  "Don't watch the clock; do what it does. Keep going.",
  "The only way to do great work is to love what you do.",
  "Believe you can and you're halfway there.",
  "Your limitation—it's only your imagination.",
  "Great things never come from comfort zones.",
  "Dream it. Wish it. Do it.",
  "Success doesn't just find you. You have to go out and get it.",
  "The harder you work for something, the greater you'll feel when you achieve it.",
];

/**
 * Initial sample habits for new users
 */
export const initialHabits = [
  {
    id: `habit-1-${Date.now()}`,
    name: "Morning Routine",
    description:
      "Complete your morning routine: wake up early, make bed, breakfast",
    category: "productivity",
    color: "#6366F1",
    frequency: "daily",
    createdDate: new Date().toISOString().split("T")[0],
    isActive: true,
    target: 7,
    icon: "🌅",
  },
  {
    id: `habit-2-${Date.now()}`,
    name: "Exercise",
    description: "30 minutes of physical activity",
    category: "health",
    color: "#10B981",
    frequency: "daily",
    createdDate: new Date().toISOString().split("T")[0],
    isActive: true,
    target: 5,
    icon: "💪",
  },
  {
    id: `habit-3-${Date.now()}`,
    name: "Reading",
    description: "Read for at least 20 minutes",
    category: "learning",
    color: "#F59E0B",
    frequency: "daily",
    createdDate: new Date().toISOString().split("T")[0],
    isActive: true,
    target: 7,
    icon: "📚",
  },
  {
    id: `habit-4-${Date.now()}`,
    name: "Meditation",
    description: "10 minutes of mindfulness meditation",
    category: "mindfulness",
    color: "#818CF8",
    frequency: "daily",
    createdDate: new Date().toISOString().split("T")[0],
    isActive: true,
    target: 7,
    icon: "🧘",
  },
  {
    id: `habit-5-${Date.now()}`,
    name: "Journaling",
    description: "Write down thoughts, gratitude, and reflections",
    category: "productivity",
    color: "#8B5CF6",
    frequency: "daily",
    createdDate: new Date().toISOString().split("T")[0],
    isActive: true,
    target: 5,
    icon: "📝",
  },
];

/**
 * Available habit colors
 */
export const HABIT_COLORS = [
  "#6366F1", // Indigo
  "#10B981", // Emerald
  "#F59E0B", // Amber
  "#818CF8", // Light Indigo
  "#8B5CF6", // Purple
  "#EC4899", // Pink
  "#EF4444", // Red
  "#14B8A6", // Teal
  "#F97316", // Orange
  "#06B6D4", // Cyan
];

/**
 * Available habit icons
 */
export const HABIT_ICONS = [
  "🎯",
  "💪",
  "📚",
  "🧘",
  "📝",
  "🏃",
  "🎨",
  "🎵",
  "🍎",
  "💤",
  "🌅",
  "🌙",
  "⚡",
  "🔥",
  "💎",
  "🌟",
  "🚀",
  "🎓",
  "💡",
  "🏆",
];

/**
 * Chart color palette
 */
export const CHART_COLORS = {
  primary: "#6366F1",
  success: "#10B981",
  warning: "#F59E0B",
  danger: "#EF4444",
  info: "#818CF8",
  purple: "#8B5CF6",
};

/**
 * Renamed exports for compatibility
 */
export const CATEGORIES = habitCategories;
export const FREQUENCIES = frequencyOptions;

/**
 * Pre-built habit templates for quick habit creation
 */
export const HABIT_TEMPLATES = [
  {
    id: "exercise",
    name: "Daily Exercise",
    description: "30 minutes of physical activity",
    category: "health",
    color: "#10B981",
    icon: "💪",
    frequency: "daily",
    target: 5,
  },
  {
    id: "reading",
    name: "Read for 20 Minutes",
    description: "Read books, articles, or educational content",
    category: "learning",
    color: "#F59E0B",
    icon: "📚",
    frequency: "daily",
    target: 7,
  },
  {
    id: "meditation",
    name: "Meditate",
    description: "10 minutes of mindfulness or breathing exercises",
    category: "mindfulness",
    color: "#818CF8",
    icon: "🧘",
    frequency: "daily",
    target: 7,
  },
  {
    id: "water",
    name: "Drink Water",
    description: "Drink 8 glasses of water throughout the day",
    category: "health",
    color: "#06B6D4",
    icon: "💧",
    frequency: "daily",
    target: 7,
  },
  {
    id: "journal",
    name: "Journaling",
    description: "Write down thoughts, gratitude, and reflections",
    category: "productivity",
    color: "#8B5CF6",
    icon: "📝",
    frequency: "daily",
    target: 5,
  },
  {
    id: "learning",
    name: "Learn Something New",
    description: "Spend time learning a new skill or language",
    category: "learning",
    color: "#6366F1",
    icon: "🎓",
    frequency: "daily",
    target: 5,
  },
  {
    id: "gratitude",
    name: "Practice Gratitude",
    description: "List 3 things you are grateful for",
    category: "mindfulness",
    color: "#EC4899",
    icon: "💖",
    frequency: "daily",
    target: 7,
  },
  {
    id: "mealprep",
    name: "Meal Preparation",
    description: "Prepare healthy meals in advance",
    category: "health",
    color: "#10B981",
    icon: "🥗",
    frequency: "weekly",
    target: 3,
  },
  {
    id: "walk",
    name: "Take a Walk",
    description: "Go for a 15-30 minute walk outdoors",
    category: "health",
    color: "#14B8A6",
    icon: "🚶",
    frequency: "daily",
    target: 5,
  },
  {
    id: "digital-detox",
    name: "Digital Detox",
    description: "No screens for 1 hour before bed",
    category: "mindfulness",
    color: "#8B5CF6",
    icon: "📵",
    frequency: "daily",
    target: 7,
  },
  {
    id: "creative",
    name: "Creative Time",
    description: "Work on a creative project or hobby",
    category: "creative",
    color: "#F97316",
    icon: "🎨",
    frequency: "weekly",
    target: 3,
  },
  {
    id: "social",
    name: "Connect with Others",
    description: "Reach out to friends or family",
    category: "social",
    color: "#EC4899",
    icon: "👥",
    frequency: "weekly",
    target: 3,
  },
];
