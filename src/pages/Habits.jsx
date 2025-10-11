import { useState, useMemo } from 'react';
import { useHabits } from '../context/HabitContext';
import { habitCategories } from '../data/constants';
import {
  FiPlus,
  FiSearch,
  FiFilter,
  FiArchive,
  FiEdit2,
  FiCheck,
  FiLayout,
} from 'react-icons/fi';
import { HiSparkles } from 'react-icons/hi';
import AddHabitModal from '../components/AddHabitModal';
import EditHabitModal from '../components/EditHabitModal';
import HabitTemplateModal from '../components/HabitTemplateModal';
import toast from 'react-hot-toast';

const Habits = () => {
  const {
    habits,
    addHabit,
    updateHabit,
    deleteHabit,
    toggleHabitActive,
    calculateStreak,
    getWeeklyProgress,
  } = useHabits();

  const [activeTab, setActiveTab] = useState('active');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [selectedHabit, setSelectedHabit] = useState(null);
  const [bulkSelectMode, setBulkSelectMode] = useState(false);
  const [selectedHabits, setSelectedHabits] = useState([]);

  // Filter habits
  const filteredHabits = useMemo(() => {
    return habits.filter((habit) => {
      // Tab filter
      if (activeTab === 'active' && !habit.isActive) return false;
      if (activeTab === 'archived' && habit.isActive) return false;

      // Search filter
      if (
        searchQuery &&
        !habit.name.toLowerCase().includes(searchQuery.toLowerCase()) &&
        !habit.description?.toLowerCase().includes(searchQuery.toLowerCase())
      ) {
        return false;
      }

      // Category filter
      if (selectedCategory !== 'all' && habit.category !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [habits, activeTab, searchQuery, selectedCategory]);

  const handleAddHabit = (habitData) => {
    addHabit(habitData);
    setShowAddModal(false);
  };

  const handleEditHabit = (habitId, updates) => {
    updateHabit(habitId, updates);
    setShowEditModal(false);
  };

  const handleArchiveHabit = (habitId) => {
    toggleHabitActive(habitId);
  };

  const handleDeleteHabit = (habitId) => {
    deleteHabit(habitId);
  };

  const handleEditClick = (habit) => {
    setSelectedHabit(habit);
    setShowEditModal(true);
  };

  const handleSelectTemplate = (template) => {
    setShowAddModal(true);
    setTimeout(() => {
      handleAddHabit(template);
    }, 100);
  };

  const handleBulkToggle = (habitId) => {
    setSelectedHabits((prev) =>
      prev.includes(habitId)
        ? prev.filter((id) => id !== habitId)
        : [...prev, habitId]
    );
  };

  const handleBulkArchive = () => {
    selectedHabits.forEach((habitId) => {
      toggleHabitActive(habitId);
    });
    toast.success(`${selectedHabits.length} habits archived`);
    setSelectedHabits([]);
    setBulkSelectMode(false);
  };

  const handleBulkActivate = () => {
    selectedHabits.forEach((habitId) => {
      const habit = habits.find((h) => h.id === habitId);
      if (!habit.isActive) {
        toggleHabitActive(habitId);
      }
    });
    toast.success(`${selectedHabits.length} habits activated`);
    setSelectedHabits([]);
    setBulkSelectMode(false);
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-24 lg:pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 md:gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-zinc-100 flex items-center gap-2 md:gap-3">
            <HiSparkles className="text-amber-400" />
            My Habits
          </h1>
          <p className="text-zinc-400 mt-1 text-sm md:text-base">
            Manage and track all your habits in one place
          </p>
        </div>
        <div className="flex items-center gap-2 md:gap-3 w-full sm:w-auto">
          <button
            onClick={() => setShowTemplateModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg md:rounded-xl transition-colors border border-zinc-700 text-sm md:text-base"
          >
            <FiLayout size={18} />
            <span className="hidden sm:inline">Templates</span>
            <span className="sm:hidden">New</span>
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3 md:px-4 py-2 md:py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg md:rounded-xl transition-all shadow-lg shadow-indigo-500/30 text-sm md:text-base flex-1 sm:flex-initial justify-center"
          >
            <FiPlus size={18} strokeWidth={2.5} />
            <span>New Habit</span>
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 md:gap-4">
        <div className="flex items-center gap-1 md:gap-2 p-1 bg-zinc-900/50 rounded-lg md:rounded-xl border border-zinc-800 overflow-x-auto">
          <button
            onClick={() => setActiveTab('active')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'active'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
              }`}
          >
            Active
            <span className="ml-1 md:ml-2 text-xs">
              ({habits.filter((h) => h.isActive).length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('archived')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'archived'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
              }`}
          >
            Archived
            <span className="ml-1 md:ml-2 text-xs">
              ({habits.filter((h) => !h.isActive).length})
            </span>
          </button>
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3 md:px-4 py-1.5 md:py-2 rounded-md md:rounded-lg transition-all whitespace-nowrap text-sm md:text-base ${activeTab === 'all'
              ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-500/30'
              : 'text-zinc-400 hover:text-zinc-200'
              }`}
          >
            All
            <span className="ml-1 md:ml-2 text-xs">({habits.length})</span>
          </button>
        </div>

        {/* Bulk Actions */}
        {filteredHabits.length > 0 && (
          <button
            onClick={() => {
              setBulkSelectMode(!bulkSelectMode);
              setSelectedHabits([]);
            }}
            className={`flex items-center gap-2 px-3 md:px-4 py-2 rounded-lg md:rounded-xl transition-all text-sm md:text-base ${bulkSelectMode
              ? 'bg-indigo-600 text-white'
              : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-300 border border-zinc-700'
              }`}
          >
            <FiCheck size={18} />
            <span>Select</span>
          </button>
        )}
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
        {/* Search */}
        <div className="flex-1 relative">
          <FiSearch className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={20} />
          <input
            type="text"
            placeholder="Search habits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 md:pl-12 pr-3 md:pr-4 py-2.5 md:py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg md:rounded-xl text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all text-sm md:text-base"
          />
        </div>

        {/* Category Filter */}
        <div className="relative">
          <FiFilter className="absolute left-3 md:left-4 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none" size={20} />
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full sm:w-auto pl-10 md:pl-12 pr-8 py-2.5 md:py-3 bg-zinc-900/50 border border-zinc-800 rounded-lg md:rounded-xl text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all appearance-none cursor-pointer min-w-[180px] text-sm md:text-base"
          >
            <option value="all">All Categories</option>
            {habitCategories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.icon} {cat.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Bulk Actions Bar */}
      {bulkSelectMode && selectedHabits.length > 0 && (
        <div className="bg-indigo-600 rounded-lg md:rounded-xl p-3 md:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 animate-in slide-in-from-top-2 duration-200">
          <span className="text-white font-medium text-sm md:text-base">
            {selectedHabits.length} habit{selectedHabits.length > 1 ? 's' : ''} selected
          </span>
          <div className="flex items-center gap-2 md:gap-3">
            {activeTab === 'active' && (
              <button
                onClick={handleBulkArchive}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm md:text-base flex-1 sm:flex-initial justify-center"
              >
                <FiArchive size={18} />
                <span>Archive</span>
              </button>
            )}
            {activeTab === 'archived' && (
              <button
                onClick={handleBulkActivate}
                className="flex items-center gap-2 px-3 md:px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-colors text-sm md:text-base flex-1 sm:flex-initial justify-center"
              >
                <FiCheck size={18} />
                <span>Activate</span>
              </button>
            )}
            <button
              onClick={() => {
                setSelectedHabits([]);
                setBulkSelectMode(false);
              }}
              className="px-3 md:px-4 py-2 text-white hover:bg-white/10 rounded-lg transition-colors text-sm md:text-base"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Habits Grid */}
      {filteredHabits.length === 0 ? (
        <div className="text-center py-12 md:py-20">
          <div className="inline-flex items-center justify-center w-16 h-16 md:w-20 md:h-20 rounded-full bg-zinc-800/50 mb-4 md:mb-6">
            <HiSparkles className="text-3xl md:text-4xl text-zinc-600" />
          </div>
          <h3 className="text-lg md:text-xl font-semibold text-zinc-300 mb-2">
            No habits found
          </h3>
          <p className="text-sm md:text-base text-zinc-500 mb-4 md:mb-6 px-4">
            {searchQuery || selectedCategory !== 'all'
              ? 'Try adjusting your filters'
              : 'Create your first habit to get started'}
          </p>
          {!searchQuery && selectedCategory === 'all' && (
            <button
              onClick={() => setShowAddModal(true)}
              className="inline-flex items-center gap-2 px-5 md:px-6 py-2.5 md:py-3 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white rounded-lg md:rounded-xl transition-all shadow-lg shadow-indigo-500/30 text-sm md:text-base"
            >
              <FiPlus size={20} />
              <span>Create New Habit</span>
            </button>
          )}
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3 md:gap-4">
          {filteredHabits.map((habit) => {
            const weeklyProgress = getWeeklyProgress(habit.id);
            const streak = calculateStreak(habit.id);
            const isSelected = selectedHabits.includes(habit.id);

            return (
              <div
                key={habit.id}
                className={`group relative bg-zinc-900/50 backdrop-blur-sm rounded-xl p-6 border transition-all ${bulkSelectMode && isSelected
                  ? 'border-indigo-500 bg-indigo-500/10'
                  : 'border-zinc-800 hover:border-zinc-700'
                  } hover:shadow-lg hover:shadow-indigo-500/5`}
              >
                {/* Bulk Select Checkbox */}
                {bulkSelectMode && (
                  <div className="absolute top-4 right-4 z-10">
                    <button
                      onClick={() => handleBulkToggle(habit.id)}
                      className={`w-6 h-6 rounded-md border-2 flex items-center justify-center transition-all ${isSelected
                        ? 'bg-indigo-600 border-indigo-600'
                        : 'border-zinc-600 hover:border-indigo-500'
                        }`}
                    >
                      {isSelected && <FiCheck className="text-white" size={16} />}
                    </button>
                  </div>
                )}

                {/* Edit Button */}
                {!bulkSelectMode && (
                  <button
                    onClick={() => handleEditClick(habit)}
                    className="absolute top-4 right-4 p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-all opacity-0 group-hover:opacity-100"
                  >
                    <FiEdit2 size={18} />
                  </button>
                )}

                {/* Icon */}
                <div
                  className="w-14 h-14 rounded-xl flex items-center justify-center text-3xl mb-4"
                  style={{ backgroundColor: `${habit.color}20` }}
                >
                  {habit.icon}
                </div>

                {/* Content */}
                <h3 className="text-lg font-semibold text-zinc-100 mb-2 pr-8">
                  {habit.name}
                </h3>
                {habit.description && (
                  <p className="text-sm text-zinc-400 mb-4 line-clamp-2">
                    {habit.description}
                  </p>
                )}

                {/* Stats */}
                <div className="space-y-3">
                  {/* Progress Bar */}
                  <div>
                    <div className="flex items-center justify-between text-xs text-zinc-400 mb-1">
                      <span>This Week</span>
                      <span>{weeklyProgress.percentage}%</span>
                    </div>
                    <div className="h-2 bg-zinc-800 rounded-full overflow-hidden">
                      <div
                        className="h-full rounded-full transition-all duration-500"
                        style={{
                          width: `${weeklyProgress.percentage}%`,
                          backgroundColor: habit.color,
                        }}
                      />
                    </div>
                  </div>

                  {/* Bottom Info */}
                  <div className="flex items-center justify-between text-sm">
                    <span
                      className="px-2 py-1 rounded-md text-xs font-medium"
                      style={{
                        backgroundColor: `${habit.color}20`,
                        color: habit.color,
                      }}
                    >
                      {habit.frequency}
                    </span>
                    {streak > 0 && (
                      <div className="flex items-center gap-1.5 text-amber-400">
                        <HiSparkles />
                        <span className="font-semibold">{streak}</span>
                        <span className="text-zinc-400 text-xs">day streak</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Archived Badge */}
                {!habit.isActive && (
                  <div className="absolute top-4 left-4 px-2 py-1 bg-amber-500/10 text-amber-400 text-xs font-medium rounded-md">
                    Archived
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <AddHabitModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddHabit}
      />
      <EditHabitModal
        isOpen={showEditModal}
        onClose={() => setShowEditModal(false)}
        habit={selectedHabit}
        onUpdate={handleEditHabit}
        onArchive={handleArchiveHabit}
        onDelete={handleDeleteHabit}
      />
      <HabitTemplateModal
        isOpen={showTemplateModal}
        onClose={() => setShowTemplateModal(false)}
        onSelectTemplate={handleSelectTemplate}
      />
    </div>
  );
};

export default Habits;
