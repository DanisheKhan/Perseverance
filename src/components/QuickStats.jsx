import { FiTarget, FiTrendingUp, FiAward, FiActivity } from 'react-icons/fi';

const StatCard = ({ icon: Icon, label, value, subtext, color }) => (
  <div className="bg-zinc-900/50 backdrop-blur-sm rounded-lg md:rounded-xl p-4 md:p-5 border border-zinc-800 hover:border-zinc-700 transition-all duration-300 hover:shadow-lg hover:shadow-indigo-500/5">
    <div className="flex items-start justify-between">
      <div className="flex-1 min-w-0">
        <p className="text-xs md:text-sm text-zinc-400 mb-1">{label}</p>
        <p className="text-2xl md:text-3xl font-bold text-zinc-100 mb-1 truncate">{value}</p>
        {subtext && <p className="text-xs text-zinc-500 truncate">{subtext}</p>}
      </div>
      <div
        className={`w-10 h-10 md:w-12 md:h-12 rounded-lg md:rounded-xl flex items-center justify-center shrink-0 ${color}`}
      >
        <Icon size={20} className="md:w-6 md:h-6" />
      </div>
    </div>
  </div>
);

const QuickStats = ({ stats }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4">
      <StatCard
        icon={FiTarget}
        label="Active Habits"
        value={stats.activeHabits}
        subtext={`${stats.totalHabits} total`}
        color="bg-indigo-500/10 text-indigo-400"
      />
      <StatCard
        icon={FiActivity}
        label="Today's Progress"
        value={`${stats.completedToday}/${stats.activeHabits}`}
        subtext={`${stats.todayProgress}% complete`}
        color="bg-emerald-500/10 text-emerald-400"
      />
      <StatCard
        icon={FiAward}
        label="Best Streak"
        value={`${stats.bestStreak || 0}`}
        subtext="days in a row"
        color="bg-amber-500/10 text-amber-400"
      />
      <StatCard
        icon={FiTrendingUp}
        label="This Week"
        value={`${stats.weeklyScore || 0}%`}
        subtext="consistency score"
        color="bg-purple-500/10 text-purple-400"
      />
    </div>
  );
};

export default QuickStats;
