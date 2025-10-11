import { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Area,
  AreaChart,
} from 'recharts';
import {
  FiTrendingUp,
  FiAward,
  FiCalendar,
  FiTarget,
  FiDownload,
  FiBarChart2,
} from 'react-icons/fi';
import { HiSparkles, HiFire } from 'react-icons/hi';
import { formatDate, getDateRange, getDayName } from '../utils/helpers';
import { habitCategories, CHART_COLORS } from '../data/constants';
import toast from 'react-hot-toast';

const Statistics = () => {
  const { habits, completions, calculateStreak, getHabitStats } = useHabits();
  const [timeRange, setTimeRange] = useState('30'); // 7, 30, 90, 365

  // Calculate key metrics
  const stats = useMemo(() => {
    const totalDaysTracked = completions.length > 0
      ? Math.floor(
        (new Date() - new Date(Math.min(...completions.map((c) => new Date(c.date))))) /
        (1000 * 60 * 60 * 24)
      ) + 1
      : 0;

    const totalCompletions = completions.filter((c) => c.completed).length;
    const averageDaily = totalDaysTracked > 0 ? (totalCompletions / totalDaysTracked).toFixed(1) : 0;
    const overallRate = habits.length > 0
      ? Math.round((totalCompletions / (totalDaysTracked * habits.length)) * 100)
      : 0;

    return {
      totalDaysTracked,
      totalCompletions,
      averageDaily,
      overallRate,
    };
  }, [habits, completions]);

  // 30-day trend data
  const trendData = useMemo(() => {
    const days = getDateRange(parseInt(timeRange));
    return days.map((date) => {
      const dayCompletions = completions.filter(
        (c) => c.date === date && c.completed
      ).length;
      return {
        date: formatDate(date),
        completions: dayCompletions,
        day: getDayName(date),
      };
    });
  }, [completions, timeRange]);

  // Weekly performance data
  const weeklyData = useMemo(() => {
    const weeks = [];
    for (let i = 3; i >= 0; i--) {
      const startDate = new Date();
      startDate.setDate(startDate.getDate() - (i * 7 + 6));
      const endDate = new Date();
      endDate.setDate(endDate.getDate() - i * 7);

      const weekCompletions = completions.filter((c) => {
        const cDate = new Date(c.date);
        return c.completed && cDate >= startDate && cDate <= endDate;
      }).length;

      weeks.push({
        week: `Week ${4 - i}`,
        completions: weekCompletions,
      });
    }
    return weeks;
  }, [completions]);

  // Category distribution
  const categoryData = useMemo(() => {
    const categoryMap = new Map();

    habits.forEach((habit) => {
      const habitCompletions = completions.filter(
        (c) => c.habitId === habit.id && c.completed
      ).length;

      const current = categoryMap.get(habit.category) || 0;
      categoryMap.set(habit.category, current + habitCompletions);
    });

    return Array.from(categoryMap.entries()).map(([category, value]) => {
      const cat = habitCategories.find((c) => c.id === category);
      return {
        name: cat?.name || category,
        value,
        color: cat?.color || '#6366F1',
      };
    });
  }, [habits, completions]);

  // Habit performance
  const habitPerformance = useMemo(() => {
    return habits
      .map((habit) => {
        const habitStats = getHabitStats(habit.id);
        return {
          ...habit,
          ...habitStats,
        };
      })
      .sort((a, b) => b.completionRate - a.completionRate);
  }, [habits, getHabitStats]);

  // Personal records
  const personalRecords = useMemo(() => {
    const longestStreak = Math.max(
      0,
      ...habits.map((h) => calculateStreak(h.id))
    );

    // Find most productive day
    const dayCompletions = new Map();
    completions.forEach((c) => {
      if (c.completed) {
        const count = dayCompletions.get(c.date) || 0;
        dayCompletions.set(c.date, count + 1);
      }
    });

    const mostProductiveDay = Array.from(dayCompletions.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0] || [null, 0];

    // Perfect weeks (7 days with all habits completed)
    let perfectWeeks = 0;
    for (let i = 0; i < 52; i++) {
      const weekStart = new Date();
      weekStart.setDate(weekStart.getDate() - i * 7 - 6);
      let isPerfect = true;

      for (let j = 0; j < 7; j++) {
        const date = new Date(weekStart);
        date.setDate(weekStart.getDate() + j);
        const dateStr = date.toISOString().split('T')[0];
        const dayCompletions = completions.filter(
          (c) => c.date === dateStr && c.completed
        ).length;

        if (dayCompletions < habits.filter((h) => h.isActive).length) {
          isPerfect = false;
          break;
        }
      }

      if (isPerfect) perfectWeeks++;
    }

    return {
      longestStreak,
      mostProductiveDay: mostProductiveDay[0],
      mostProductiveDayCount: mostProductiveDay[1],
      perfectWeeks,
      totalHabits: habits.length,
    };
  }, [habits, completions, calculateStreak]);

  // Insights
  const insights = useMemo(() => {
    // Best day of week
    const dayOfWeekMap = new Map();
    ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].forEach((day) =>
      dayOfWeekMap.set(day, 0)
    );

    completions.forEach((c) => {
      if (c.completed) {
        const day = getDayName(c.date);
        dayOfWeekMap.set(day, (dayOfWeekMap.get(day) || 0) + 1);
      }
    });

    const bestDay = Array.from(dayOfWeekMap.entries()).sort(
      (a, b) => b[1] - a[1]
    )[0] || ['N/A', 0];

    // Morning vs Evening (based on timestamp if available)
    let morningCount = 0;
    let eveningCount = 0;

    completions.forEach((c) => {
      if (c.completed && c.timestamp) {
        const hour = new Date(c.timestamp).getHours();
        if (hour < 12) morningCount++;
        else eveningCount++;
      }
    });

    return {
      bestDay: bestDay[0],
      bestDayCount: bestDay[1],
      morningCount,
      eveningCount,
      morningPercentage:
        morningCount + eveningCount > 0
          ? Math.round((morningCount / (morningCount + eveningCount)) * 100)
          : 50,
    };
  }, [completions]);

  const handleExportCSV = () => {
    const csvData = [
      ['Habit', 'Category', 'Total Completions', 'Success Rate', 'Current Streak'],
      ...habitPerformance.map((h) => [
        h.name,
        h.category,
        h.totalCompletions,
        `${h.completionRate}%`,
        h.currentStreak,
      ]),
    ];

    const csvContent = csvData.map((row) => row.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `perseverance-stats-${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    toast.success('Statistics exported as CSV!');
  };

  const handleExportPDF = () => {
    toast.success('PDF export coming soon!');
  };

  return (
    <div className="space-y-8 pb-24">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-zinc-100 flex items-center gap-3">
            <FiBarChart2 className="text-indigo-400" />
            Statistics & Analytics
          </h1>
          <p className="text-zinc-400 mt-1">
            Track your progress and gain insights
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-4 py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-xl transition-colors border border-zinc-700"
          >
            <FiDownload size={18} />
            <span>Export CSV</span>
          </button>
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2.5 bg-zinc-800 border border-zinc-700 rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="7">Last 7 Days</option>
            <option value="30">Last 30 Days</option>
            <option value="90">Last 90 Days</option>
            <option value="365">Last Year</option>
          </select>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center">
              <FiCalendar className="text-indigo-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-zinc-100">
              {stats.totalDaysTracked}
            </span>
          </div>
          <h3 className="text-sm text-zinc-400">Days Tracked</h3>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/10 flex items-center justify-center">
              <FiTarget className="text-emerald-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-zinc-100">
              {stats.overallRate}%
            </span>
          </div>
          <h3 className="text-sm text-zinc-400">Completion Rate</h3>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 flex items-center justify-center">
              <HiSparkles className="text-amber-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-zinc-100">
              {stats.totalCompletions}
            </span>
          </div>
          <h3 className="text-sm text-zinc-400">Total Completions</h3>
        </div>

        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <div className="flex items-start justify-between mb-4">
            <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center">
              <FiTrendingUp className="text-purple-400" size={24} />
            </div>
            <span className="text-3xl font-bold text-zinc-100">
              {stats.averageDaily}
            </span>
          </div>
          <h3 className="text-sm text-zinc-400">Avg Daily</h3>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Completion Trend */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">
            Completion Trend
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={trendData}>
              <defs>
                <linearGradient id="colorCompletions" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis
                dataKey="day"
                stroke="#71717A"
                style={{ fontSize: '12px' }}
              />
              <YAxis stroke="#71717A" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181B',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: '#FAFAFA',
                }}
              />
              <Area
                type="monotone"
                dataKey="completions"
                stroke="#6366F1"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorCompletions)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Weekly Performance */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">
            Weekly Comparison
          </h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={weeklyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#27272A" />
              <XAxis dataKey="week" stroke="#71717A" style={{ fontSize: '12px' }} />
              <YAxis stroke="#71717A" style={{ fontSize: '12px' }} />
              <Tooltip
                contentStyle={{
                  backgroundColor: '#18181B',
                  border: '1px solid #27272A',
                  borderRadius: '8px',
                  color: '#FAFAFA',
                }}
              />
              <Bar dataKey="completions" fill="#10B981" radius={[8, 8, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Category Distribution & Personal Records */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Category Pie Chart */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6">
            Completions by Category
          </h2>
          {categoryData.length > 0 ? (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${(percent * 100).toFixed(0)}%`
                  }
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#18181B',
                    border: '1px solid #27272A',
                    borderRadius: '8px',
                    color: '#FAFAFA',
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="flex items-center justify-center h-[300px] text-zinc-500">
              No data available
            </div>
          )}
        </div>

        {/* Personal Records */}
        <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <h2 className="text-xl font-semibold text-zinc-100 mb-6 flex items-center gap-2">
            <FiAward className="text-amber-400" />
            Personal Records
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <HiFire className="text-2xl text-orange-400" />
                <div>
                  <p className="text-sm text-zinc-400">Longest Streak</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {personalRecords.longestStreak} days
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <HiSparkles className="text-2xl text-amber-400" />
                <div>
                  <p className="text-sm text-zinc-400">Most Productive Day</p>
                  <p className="text-lg font-bold text-zinc-100">
                    {personalRecords.mostProductiveDay
                      ? formatDate(personalRecords.mostProductiveDay)
                      : 'N/A'}
                  </p>
                  <p className="text-xs text-zinc-500">
                    {personalRecords.mostProductiveDayCount} completions
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiTarget className="text-2xl text-emerald-400" />
                <div>
                  <p className="text-sm text-zinc-400">Perfect Weeks</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {personalRecords.perfectWeeks}
                  </p>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between p-4 bg-zinc-800/50 rounded-lg">
              <div className="flex items-center gap-3">
                <FiCalendar className="text-2xl text-indigo-400" />
                <div>
                  <p className="text-sm text-zinc-400">Total Habits</p>
                  <p className="text-2xl font-bold text-zinc-100">
                    {personalRecords.totalHabits}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Habit Performance */}
      <div className="bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
        <h2 className="text-xl font-semibold text-zinc-100 mb-6">
          Habit Performance
        </h2>
        <div className="space-y-3">
          {habitPerformance.slice(0, 10).map((habit, index) => (
            <div
              key={habit.id}
              className="flex items-center gap-4 p-4 bg-zinc-800/50 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <div className="flex items-center gap-3 flex-1">
                <span className="text-zinc-500 font-medium w-6">{index + 1}</span>
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center text-xl"
                  style={{ backgroundColor: `${habit.color}20` }}
                >
                  {habit.icon}
                </div>
                <div className="flex-1">
                  <h3 className="text-sm font-medium text-zinc-100">
                    {habit.name}
                  </h3>
                  <p className="text-xs text-zinc-500">
                    {habit.totalCompletions} completions • {habit.currentStreak}{' '}
                    day streak
                  </p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-lg font-bold text-zinc-100">
                  {habit.completionRate}%
                </p>
                <p className="text-xs text-zinc-500">Success Rate</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Insights Panel */}
      <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 backdrop-blur-sm rounded-xl p-6 border border-indigo-500/20">
        <h2 className="text-xl font-semibold text-zinc-100 mb-6 flex items-center gap-2">
          <HiSparkles className="text-amber-400" />
          Insights & Patterns
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h3 className="text-sm text-zinc-400 mb-2">Best Day of Week</h3>
            <p className="text-2xl font-bold text-indigo-300">
              {insights.bestDay}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {insights.bestDayCount} completions
            </p>
          </div>
          <div>
            <h3 className="text-sm text-zinc-400 mb-2">Peak Time</h3>
            <p className="text-2xl font-bold text-purple-300">
              {insights.morningPercentage >= 50 ? 'Morning' : 'Evening'}
            </p>
            <p className="text-xs text-zinc-500 mt-1">
              {insights.morningPercentage}% morning completions
            </p>
          </div>
          <div>
            <h3 className="text-sm text-zinc-400 mb-2">Consistency Score</h3>
            <p className="text-2xl font-bold text-emerald-300">
              {stats.overallRate}%
            </p>
            <p className="text-xs text-zinc-500 mt-1">Overall performance</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Statistics;
