import { useState, useEffect } from 'react';
import { FiX, FiSave, FiArchive, FiRotateCcw, FiTrash2 } from 'react-icons/fi';
import { habitCategories, HABIT_COLORS, HABIT_ICONS } from '../data/constants';
import toast from 'react-hot-toast';

const EditHabitModal = ({ isOpen, onClose, habit, onUpdate, onArchive, onDelete }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'productivity',
    color: '#6366F1',
    frequency: 'daily',
    icon: '🎯',
    target: 7,
  });

  useEffect(() => {
    if (habit) {
      setFormData({
        name: habit.name,
        description: habit.description || '',
        category: habit.category,
        color: habit.color,
        frequency: habit.frequency,
        icon: habit.icon,
        target: habit.target || 7,
      });
    }
  }, [habit]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.name.trim()) {
      toast.error('Please enter a habit name');
      return;
    }

    setIsLoading(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 500));
      onUpdate(habit.id, formData);
      toast.success('Habit updated successfully! ✨');
      handleClose();
    } catch (error) {
      toast.error('Failed to update habit');
    } finally {
      setIsLoading(false);
    }
  };

  const handleArchive = () => {
    onArchive(habit.id);
    toast.success(habit.isActive ? 'Habit archived' : 'Habit activated');
    handleClose();
  };

  const handleDelete = () => {
    onDelete(habit.id);
    toast.success('Habit deleted');
    handleClose();
  };

  const handleClose = () => {
    setShowDeleteConfirm(false);
    onClose();
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  if (!isOpen || !habit) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-zinc-900 rounded-2xl border border-zinc-800 shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-zinc-800">
          <h2 className="text-2xl font-bold text-zinc-100">Edit Habit</h2>
          <button
            onClick={handleClose}
            className="p-2 rounded-lg text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 transition-colors"
          >
            <FiX size={24} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="space-y-6">
            {/* Name */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Habit Name *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => handleChange('name', e.target.value)}
                placeholder="e.g., Morning Exercise"
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Description */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Description (Optional)
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Add more details about this habit..."
                rows={3}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent resize-none transition-all"
              />
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Category
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {habitCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleChange('category', cat.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.category === cat.id
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600'
                    }`}
                  >
                    <div className="text-2xl mb-2">{cat.icon}</div>
                    <div className="text-sm font-medium text-zinc-200">{cat.name}</div>
                  </button>
                ))}
              </div>
            </div>

            {/* Color Picker */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Color Theme
              </label>
              <div className="flex flex-wrap gap-3">
                {HABIT_COLORS.map((color) => (
                  <button
                    key={color}
                    type="button"
                    onClick={() => handleChange('color', color)}
                    className={`w-12 h-12 rounded-xl transition-all ${
                      formData.color === color
                        ? 'ring-2 ring-white ring-offset-2 ring-offset-zinc-900 scale-110'
                        : 'hover:scale-105'
                    }`}
                    style={{ backgroundColor: color }}
                  />
                ))}
              </div>
            </div>

            {/* Icon Picker */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Icon
              </label>
              <div className="flex flex-wrap gap-2">
                {HABIT_ICONS.map((icon) => (
                  <button
                    key={icon}
                    type="button"
                    onClick={() => handleChange('icon', icon)}
                    className={`w-12 h-12 rounded-xl text-2xl transition-all ${
                      formData.icon === icon
                        ? 'bg-indigo-500/20 ring-2 ring-indigo-500 scale-110'
                        : 'bg-zinc-800/30 hover:bg-zinc-700'
                    }`}
                  >
                    {icon}
                  </button>
                ))}
              </div>
            </div>

            {/* Frequency */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Frequency
              </label>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { value: 'daily', label: 'Daily', target: 7 },
                  { value: 'weekdays', label: 'Weekdays', target: 5 },
                  { value: 'weekends', label: 'Weekends', target: 2 },
                  { value: 'custom', label: 'Custom', target: 3 },
                ].map((freq) => (
                  <button
                    key={freq.value}
                    type="button"
                    onClick={() => {
                      handleChange('frequency', freq.value);
                      handleChange('target', freq.target);
                    }}
                    className={`p-3 rounded-xl border-2 transition-all ${
                      formData.frequency === freq.value
                        ? 'border-indigo-500 bg-indigo-500/10'
                        : 'border-zinc-700 bg-zinc-800/30 hover:border-zinc-600'
                    }`}
                  >
                    <div className="text-sm font-medium text-zinc-200">
                      {freq.label}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Target Days */}
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-2">
                Target (days per week)
              </label>
              <input
                type="number"
                min="1"
                max="7"
                value={formData.target}
                onChange={(e) => handleChange('target', parseInt(e.target.value))}
                className="w-full bg-zinc-800/50 border border-zinc-700 rounded-xl px-4 py-3 text-zinc-100 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
              />
            </div>

            {/* Danger Zone */}
            <div className="pt-6 border-t border-zinc-800">
              <h3 className="text-sm font-medium text-zinc-300 mb-3">Danger Zone</h3>
              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  type="button"
                  onClick={handleArchive}
                  className="flex items-center justify-center gap-2 px-4 py-2.5 bg-amber-500/10 text-amber-400 hover:bg-amber-500/20 rounded-xl transition-colors"
                >
                  <FiArchive size={18} />
                  <span>{habit.isActive ? 'Archive Habit' : 'Activate Habit'}</span>
                </button>
                {!showDeleteConfirm ? (
                  <button
                    type="button"
                    onClick={() => setShowDeleteConfirm(true)}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500/10 text-red-400 hover:bg-red-500/20 rounded-xl transition-colors"
                  >
                    <FiTrash2 size={18} />
                    <span>Delete Habit</span>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={handleDelete}
                    className="flex items-center justify-center gap-2 px-4 py-2.5 bg-red-500 text-white hover:bg-red-600 rounded-xl transition-colors"
                  >
                    <FiTrash2 size={18} />
                    <span>Confirm Delete</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-zinc-800 bg-zinc-900/50">
          <button
            type="button"
            onClick={handleClose}
            className="px-6 py-2.5 text-zinc-300 hover:text-zinc-100 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="flex items-center gap-2 px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 text-white font-medium rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <>
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                <span>Saving...</span>
              </>
            ) : (
              <>
                <FiSave size={18} />
                <span>Save Changes</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditHabitModal;
