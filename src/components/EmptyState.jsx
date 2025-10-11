import { HiSparkles } from 'react-icons/hi';
import { FiPlus } from 'react-icons/fi';

const EmptyState = ({ onCreateHabit }) => {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <div className="text-center max-w-md mx-auto px-4">
        {/* Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-indigo-500/20 to-purple-500/20 mb-6">
          <HiSparkles className="text-4xl text-indigo-400" />
        </div>

        {/* Heading */}
        <h3 className="text-2xl font-bold text-zinc-100 mb-3">
          Start Your Journey
        </h3>

        {/* Description */}
        <p className="text-zinc-400 mb-8 leading-relaxed">
          No habits yet! Create your first habit to start building consistency
          and tracking your progress. Small steps lead to big changes.
        </p>

        {/* CTA Button */}
        <button
          onClick={onCreateHabit}
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl transition-all duration-300 shadow-lg shadow-indigo-500/30 hover:shadow-xl hover:shadow-indigo-500/40 hover:scale-105"
        >
          <FiPlus size={20} strokeWidth={2.5} />
          <span>Create Your First Habit</span>
        </button>

        {/* Tips */}
        <div className="mt-12 text-left bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border border-zinc-800">
          <h4 className="text-sm font-semibold text-zinc-300 mb-3">
            💡 Tips to get started:
          </h4>
          <ul className="space-y-2 text-sm text-zinc-400">
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span>Start with 1-3 habits you want to build</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span>Make them specific and achievable</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-indigo-400 mt-0.5">•</span>
              <span>Track daily for best results</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default EmptyState;
