import { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { FiX, FiAward, FiTrendingUp, FiZap, FiTarget, FiStar } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const ACHIEVEMENT_BADGES = [
  {
    id: 'first-habit',
    name: 'First Steps',
    description: 'Create your first habit',
    icon: '🎯',
    requirement: (stats) => stats.totalHabits >= 1,
  },
  {
    id: 'five-habits',
    name: 'Building Momentum',
    description: 'Create 5 habits',
    icon: '🚀',
    requirement: (stats) => stats.totalHabits >= 5,
  },
  {
    id: 'first-week',
    name: 'Week Warrior',
    description: 'Track habits for 7 days',
    icon: '📅',
    requirement: (stats) => stats.daysTracking >= 7,
  },
  {
    id: 'first-month',
    name: 'Monthly Master',
    description: 'Track habits for 30 days',
    icon: '🏆',
    requirement: (stats) => stats.daysTracking >= 30,
  },
  {
    id: 'hundred-days',
    name: 'Century Club',
    description: 'Track habits for 100 days',
    icon: '💯',
    requirement: (stats) => stats.daysTracking >= 100,
  },
  {
    id: 'perfect-day',
    name: 'Perfect Day',
    description: 'Complete all habits in a day',
    icon: '⭐',
    requirement: (stats) => stats.perfectDays >= 1,
  },
  {
    id: 'ten-perfect',
    name: 'Perfection Seeker',
    description: 'Achieve 10 perfect days',
    icon: '🌟',
    requirement: (stats) => stats.perfectDays >= 10,
  },
  {
    id: 'week-streak',
    name: 'On Fire',
    description: 'Maintain a 7-day streak',
    icon: '🔥',
    requirement: (stats) => stats.longestStreak >= 7,
  },
  {
    id: 'month-streak',
    name: 'Unstoppable',
    description: 'Maintain a 30-day streak',
    icon: '⚡',
    requirement: (stats) => stats.longestStreak >= 30,
  },
  {
    id: 'fifty-completions',
    name: 'Half Century',
    description: 'Complete 50 habits',
    icon: '🎊',
    requirement: (stats) => stats.totalCompletions >= 50,
  },
  {
    id: 'hundred-completions',
    name: 'Completion Champion',
    description: 'Complete 100 habits',
    icon: '🎉',
    requirement: (stats) => stats.totalCompletions >= 100,
  },
  {
    id: 'five-hundred-completions',
    name: 'Legend',
    description: 'Complete 500 habits',
    icon: '👑',
    requirement: (stats) => stats.totalCompletions >= 500,
  },
  {
    id: 'high-completion-rate',
    name: 'Consistency King',
    description: 'Achieve 80% completion rate',
    icon: '💪',
    requirement: (stats) => stats.completionRate >= 80,
  },
  {
    id: 'early-bird',
    name: 'Early Bird',
    description: 'Complete 10 morning habits',
    icon: '🌅',
    requirement: (stats) => stats.morningCompletions >= 10,
  },
  {
    id: 'night-owl',
    name: 'Night Owl',
    description: 'Complete 10 evening habits',
    icon: '🌙',
    requirement: (stats) => stats.eveningCompletions >= 10,
  },
];

const RewardsModal = ({ isOpen, onClose }) => {
  const { habits, completions } = useHabits();

  const stats = useMemo(() => {
    const allDates = [...new Set(completions.map((c) => c.date))].sort();
    const firstDate = allDates[0] ? new Date(allDates[0]) : new Date();
    const daysTracking = Math.floor(
      (new Date() - firstDate) / (1000 * 60 * 60 * 24)
    ) + 1;

    // Calculate longest streak
    let longestStreak = 0;
    let currentStreak = 0;
    const dateSet = new Set(allDates);
    const today = new Date();

    for (let i = 0; i < 365; i++) {
      const checkDate = new Date(today);
      checkDate.setDate(checkDate.getDate() - i);
      const dateStr = checkDate.toISOString().split('T')[0];

      if (dateSet.has(dateStr)) {
        currentStreak++;
        longestStreak = Math.max(longestStreak, currentStreak);
      } else {
        currentStreak = 0;
      }
    }

    // Calculate perfect days
    const perfectDays = allDates.filter((date) => {
      const dayCompletions = completions.filter((c) => c.date === date);
      const dayHabits = habits.filter((h) => !h.archived);
      return dayCompletions.length === dayHabits.length && dayHabits.length > 0;
    }).length;

    // Time-based completions
    const morningCompletions = completions.filter((c) => {
      if (!c.completedAt) return false;
      const hour = new Date(c.completedAt).getHours();
      return hour >= 5 && hour < 12;
    }).length;

    const eveningCompletions = completions.filter((c) => {
      if (!c.completedAt) return false;
      const hour = new Date(c.completedAt).getHours();
      return hour >= 18 && hour < 24;
    }).length;

    const completionRate = habits.length > 0
      ? (completions.length / (habits.length * daysTracking)) * 100
      : 0;

    return {
      totalHabits: habits.length,
      totalCompletions: completions.length,
      daysTracking,
      longestStreak,
      perfectDays,
      completionRate: Math.round(completionRate),
      morningCompletions,
      eveningCompletions,
    };
  }, [habits, completions]);

  const unlockedBadges = ACHIEVEMENT_BADGES.filter((badge) =>
    badge.requirement(stats)
  );
  const lockedBadges = ACHIEVEMENT_BADGES.filter(
    (badge) => !badge.requirement(stats)
  );

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <div
        className="bg-zinc-900 rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto border border-zinc-800 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="sticky top-0 bg-zinc-900 border-b border-zinc-800 p-6 z-10">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-zinc-100 flex items-center gap-3">
                <FiAward className="text-amber-400" />
                Achievements & Rewards
              </h2>
              <p className="text-zinc-400 mt-1">
                {unlockedBadges.length} of {ACHIEVEMENT_BADGES.length} badges earned
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-zinc-800 text-zinc-400 hover:text-zinc-100 transition-colors"
            >
              <FiX size={24} />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm mb-2">
              <span className="text-zinc-400">Overall Progress</span>
              <span className="text-zinc-300 font-medium">
                {Math.round((unlockedBadges.length / ACHIEVEMENT_BADGES.length) * 100)}%
              </span>
            </div>
            <div className="w-full h-3 bg-zinc-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-amber-500 to-orange-500 transition-all duration-500"
                style={{
                  width: `${(unlockedBadges.length / ACHIEVEMENT_BADGES.length) * 100}%`,
                }}
              />
            </div>
          </div>
        </div>

        <div className="p-6 space-y-8">
          {/* Unlocked Badges */}
          {unlockedBadges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                <HiSparkles className="text-amber-400" />
                Unlocked Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {unlockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-gradient-to-br from-amber-500/20 to-orange-500/20 rounded-xl p-4 border border-amber-500/50 shadow-lg"
                  >
                    <div className="text-4xl mb-3 animate-bounce">{badge.icon}</div>
                    <h4 className="font-semibold text-zinc-100 mb-1">
                      {badge.name}
                    </h4>
                    <p className="text-sm text-zinc-400">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Locked Badges */}
          {lockedBadges.length > 0 && (
            <div>
              <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
                <FiTarget className="text-zinc-500" />
                Locked Achievements
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {lockedBadges.map((badge) => (
                  <div
                    key={badge.id}
                    className="bg-zinc-800/30 rounded-xl p-4 border border-zinc-700 opacity-60"
                  >
                    <div className="text-4xl mb-3 grayscale">{badge.icon}</div>
                    <h4 className="font-semibold text-zinc-300 mb-1">
                      {badge.name}
                    </h4>
                    <p className="text-sm text-zinc-500">{badge.description}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Stats Summary */}
          <div className="bg-zinc-800/30 rounded-xl p-6 border border-zinc-700">
            <h3 className="text-lg font-semibold text-zinc-100 mb-4 flex items-center gap-2">
              <FiTrendingUp className="text-indigo-400" />
              Your Stats
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-100">
                  {stats.totalCompletions}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Total Completions</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-100">
                  {stats.longestStreak}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Longest Streak</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-100">
                  {stats.perfectDays}
                </p>
                <p className="text-xs text-zinc-500 mt-1">Perfect Days</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-zinc-100">
                  {stats.completionRate}%
                </p>
                <p className="text-xs text-zinc-500 mt-1">Completion Rate</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RewardsModal;
