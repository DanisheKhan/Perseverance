import { FiX } from 'react-icons/fi';

const HABIT_TEMPLATES = [
  {
    name: 'Morning Exercise',
    description: '30 minutes of physical activity to start your day',
    category: 'health',
    color: '#10B981',
    icon: '💪',
    frequency: 'daily',
    target: 5,
  },
  {
    name: 'Read for 20 Minutes',
    description: 'Develop a reading habit and expand your knowledge',
    category: 'learning',
    color: '#F59E0B',
    icon: '📚',
    frequency: 'daily',
    target: 7,
  },
  {
    name: 'Meditation',
    description: '10 minutes of mindfulness and breathing exercises',
    category: 'mindfulness',
    color: '#818CF8',
    icon: '🧘',
    frequency: 'daily',
    target: 7,
  },
  {
    name: 'Drink Water',
    description: 'Stay hydrated throughout the day (8 glasses)',
    category: 'health',
    color: '#06B6D4',
    icon: '💧',
    frequency: 'daily',
    target: 7,
  },
  {
    name: 'Journal',
    description: 'Write down your thoughts, gratitude, and reflections',
    category: 'productivity',
    color: '#8B5CF6',
    icon: '📝',
    frequency: 'daily',
    target: 5,
  },
  {
    name: 'Learn Something New',
    description: 'Dedicate time to learning a new skill or language',
    category: 'learning',
    color: '#3B82F6',
    icon: '🎓',
    frequency: 'daily',
    target: 5,
  },
  {
    name: 'Practice Gratitude',
    description: 'List 3 things you are grateful for',
    category: 'mindfulness',
    color: '#EC4899',
    icon: '🙏',
    frequency: 'daily',
    target: 7,
  },
  {
    name: 'Healthy Meal Prep',
    description: 'Prepare nutritious meals for the day',
    category: 'health',
    color: '#10B981',
    icon: '🥗',
    frequency: 'daily',
    target: 5,
  },
  {
    name: 'Evening Walk',
    description: '15-minute walk to unwind and relax',
    category: 'health',
    color: '#F59E0B',
    icon: '🚶',
    frequency: 'daily',
    target: 5,
  },
  {
    name: 'Digital Detox',
    description: 'No screens 1 hour before bed',
    category: 'mindfulness',
    color: '#6366F1',
    icon: '📵',
    frequency: 'daily',
    target: 7,
  },
  {
    name: 'Creative Time',
    description: 'Engage in creative activities (art, music, writing)',
    category: 'creative',
    color: '#EC4899',
    icon: '🎨',
    frequency: 'weekdays',
    target: 3,
  },
  {
    name: 'Connect with Friends',
    description: 'Reach out and connect with friends or family',
    category: 'social',
    color: '#F59E0B',
    icon: '👥',
    frequency: 'weekly',
    target: 2,
  },
];

const HabitTemplateModal = ({ isOpen, onClose, onSelectTemplate }) => {
  if (!isOpen) return null;

  const handleSelectTemplate = (template) => {
    onSelectTemplate(template);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <div>
            <h2 className="text-2xl font-bold text-zinc-100">Habit Templates</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Choose a template to quickly create a new habit
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Templates Grid */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {HABIT_TEMPLATES.map((template, index) => (
              <button
                key={index}
                onClick={() => handleSelectTemplate(template)}
                className="text-left p-5 bg-zinc-800/50 hover:bg-zinc-800 border border-zinc-700 hover:border-zinc-600 rounded-xl transition-all group"
              >
                <div className="flex items-start gap-3 mb-3">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl shrink-0 transition-transform group-hover:scale-110"
                    style={{ backgroundColor: `${template.color}20` }}
                  >
                    {template.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-zinc-100 mb-1 truncate">
                      {template.name}
                    </h3>
                    <p className="text-xs text-zinc-400 line-clamp-2">
                      {template.description}
                    </p>
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs">
                  <span
                    className="px-2 py-1 rounded-md font-medium"
                    style={{
                      backgroundColor: `${template.color}20`,
                      color: template.color,
                    }}
                  >
                    {template.frequency}
                  </span>
                  <span className="text-zinc-500">{template.target}x/week</span>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HabitTemplateModal;
