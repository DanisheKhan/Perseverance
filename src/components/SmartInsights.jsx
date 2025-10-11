import { useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { FiBrain, FiTrendingUp, FiTrendingDown, FiAlertCircle, FiZap, FiClock } from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';

const SmartInsights = () => {
  const { habits, completions } = useHabits();

  const insights = useMemo(() => {
    const results = [];
    const today = new Date().toISOString().split('T')[0];

    // 1. Habit Performance Analysis
    habits.forEach((habit) => {
      const habitCompletions = completions.filter((c) => c.habitId === habit.id);
      const last7Days = habitCompletions.filter((c) => {
        const date = new Date(c.date);
        const daysAgo = Math.floor((new Date() - date) / (1000 * 60 * 60 * 24));
        return daysAgo <= 7;
      });

      const successRate = last7Days.length / 7;

      if (successRate < 0.4 && habitCompletions.length > 3) {
        results.push({
          type: 'warning',
          icon: FiAlertCircle,
          color: 'amber',
          title: 'Struggling Habit Detected',
          description: `"${habit.name}" has only ${Math.round(successRate * 100)}% completion this week. Consider adjusting the difficulty or time.`,
          priority: 3,
        });
      }

      if (successRate >= 0.8 && habitCompletions.length >= 5) {
        results.push({
          type: 'success',
          icon: FiTrendingUp,
          color: 'emerald',
          title: 'Excellent Consistency',
          description: `"${habit.name}" is going strong with ${Math.round(successRate * 100)}% completion!`,
          priority: 1,
        });
      }
    });

    // 2. Best Performance Time Detection
    const completionsWithTime = completions.filter((c) => c.completedAt);
    if (completionsWithTime.length >= 10) {
      const hourCounts = {};
      completionsWithTime.forEach((c) => {
        const hour = new Date(c.completedAt).getHours();
        hourCounts[hour] = (hourCounts[hour] || 0) + 1;
      });

      const bestHour = Object.entries(hourCounts).sort((a, b) => b[1] - a[1])[0];
      if (bestHour) {
        const hour = parseInt(bestHour[0]);
        const timeStr = hour < 12 ? `${hour}:00 AM` : hour === 12 ? '12:00 PM' : `${hour - 12}:00 PM`;
        results.push({
          type: 'insight',
          icon: FiClock,
          color: 'indigo',
          title: 'Peak Performance Time',
          description: `You're most productive around ${timeStr}. Schedule important habits at this time.`,
          priority: 2,
        });
      }
    }

    // 3. Streak Prediction
    habits.forEach((habit) => {
      const habitCompletions = completions
        .filter((c) => c.habitId === habit.id)
        .map((c) => c.date)
        .sort();

      if (habitCompletions.length < 3) return;

      const lastCompletion = habitCompletions[habitCompletions.length - 1];
      const daysSinceCompletion = Math.floor(
        (new Date(today) - new Date(lastCompletion)) / (1000 * 60 * 60 * 24)
      );

      if (daysSinceCompletion === 1) {
        results.push({
          type: 'urgent',
          icon: FiZap,
          color: 'red',
          title: 'Streak at Risk!',
          description: `Complete "${habit.name}" today to maintain your streak!`,
          priority: 5,
        });
      }

      // Calculate recent consistency
      const last14Days = [];
      for (let i = 0; i < 14; i++) {
        const checkDate = new Date();
        checkDate.setDate(checkDate.getDate() - i);
        const dateStr = checkDate.toISOString().split('T')[0];
        last14Days.push(habitCompletions.includes(dateStr));
      }

      const recentSuccess = last14Days.filter(Boolean).length / 14;
      if (recentSuccess >= 0.7 && daysSinceCompletion === 0) {
        results.push({
          type: 'prediction',
          icon: HiSparkles,
          color: 'purple',
          title: 'Building Strong Momentum',
          description: `"${habit.name}" has ${Math.round(recentSuccess * 100)}% completion rate. Keep going!`,
          priority: 2,
        });
      }
    });

    // 4. Category Correlation
    const categoryPerformance = {};
    completions.forEach((c) => {
      const habit = habits.find((h) => h.id === c.habitId);
      if (habit) {
        categoryPerformance[habit.category] = (categoryPerformance[habit.category] || 0) + 1;
      }
    });

    const sortedCategories = Object.entries(categoryPerformance).sort((a, b) => b[1] - a[1]);
    if (sortedCategories.length > 0) {
      const [bestCategory, count] = sortedCategories[0];
      if (count >= 10) {
        results.push({
          type: 'insight',
          icon: FiBrain,
          color: 'cyan',
          title: 'Category Strength',
          description: `You excel at "${bestCategory}" habits. Consider adding more in this area!`,
          priority: 1,
        });
      }
    }

    // 5. Suggested Habits Based on Patterns
    const activeHabits = habits.filter((h) => !h.archived);
    if (activeHabits.length < 3 && completions.length >= 10) {
      results.push({
        type: 'suggestion',
        icon: FiTrendingUp,
        color: 'indigo',
        title: 'Ready for More?',
        description: `You're doing great! Consider adding 1-2 more habits to expand your routine.`,
        priority: 2,
      });
    }

    // 6. Check for habit overload
    if (activeHabits.length > 10) {
      const todayCompletions = completions.filter((c) => c.date === today).length;
      const completionRate = todayCompletions / activeHabits.length;

      if (completionRate < 0.5) {
        results.push({
          type: 'warning',
          icon: FiTrendingDown,
          color: 'orange',
          title: 'Possible Overload',
          description: `Tracking ${activeHabits.length} habits might be too many. Consider focusing on your top priorities.`,
          priority: 4,
        });
      }
    }

    // Sort by priority (higher first)
    return results.sort((a, b) => b.priority - a.priority).slice(0, 5);
  }, [habits, completions]);

  if (insights.length === 0) {
    return null;
  }

  const colorClasses = {
    indigo: 'from-indigo-500/20 to-purple-500/20 border-indigo-500/30',
    emerald: 'from-emerald-500/20 to-teal-500/20 border-emerald-500/30',
    amber: 'from-amber-500/20 to-orange-500/20 border-amber-500/30',
    red: 'from-red-500/20 to-pink-500/20 border-red-500/30',
    purple: 'from-purple-500/20 to-pink-500/20 border-purple-500/30',
    cyan: 'from-cyan-500/20 to-blue-500/20 border-cyan-500/30',
    orange: 'from-orange-500/20 to-red-500/20 border-orange-500/30',
  };

  const iconColorClasses = {
    indigo: 'text-indigo-400',
    emerald: 'text-emerald-400',
    amber: 'text-amber-400',
    red: 'text-red-400',
    purple: 'text-purple-400',
    cyan: 'text-cyan-400',
    orange: 'text-orange-400',
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3 mb-4">
        <FiBrain className="text-indigo-400" size={24} />
        <h2 className="text-xl font-semibold text-zinc-100">Smart Insights</h2>
      </div>

      <div className="space-y-3">
        {insights.map((insight, index) => {
          const Icon = insight.icon;
          return (
            <div
              key={index}
              className={`bg-gradient-to-br backdrop-blur-sm rounded-xl p-4 border ${colorClasses[insight.color]
                }`}
            >
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  <Icon className={iconColorClasses[insight.color]} size={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-zinc-100 mb-1">{insight.title}</h3>
                  <p className="text-sm text-zinc-400">{insight.description}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default SmartInsights;
