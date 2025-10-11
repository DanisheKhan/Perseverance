# 🌟 Perseverance - Premium Habit Tracker

A beautiful, intelligent personal habit tracker built with React, featuring AI-powered insights, focus modes, journaling, and gamification.

![Version](https://img.shields.io/badge/version-1.0.0-blue.svg)
![React](https://img.shields.io/badge/React-19.1.1-61dafb.svg)
![Vite](https://img.shields.io/badge/Vite-7.1.7-646cff.svg)
![Tailwind](https://img.shields.io/badge/Tailwind-4.1.14-38bdf8.svg)

---

## ✨ Features

### 📊 **Core Tracking**

- ✅ Create and manage unlimited habits
- ✅ Daily completion tracking with streaks
- ✅ Category organization (Health, Productivity, Mindfulness, etc.)
- ✅ Custom icons and colors per habit
- ✅ Habit templates for quick setup
- ✅ Archive/restore functionality

### 📈 **Analytics & Statistics**

- ✅ Interactive charts (Area, Bar, Pie) with Recharts
- ✅ Completion trends over time
- ✅ Category distribution analysis
- ✅ Habit performance rankings
- ✅ Weekly comparison views
- ✅ CSV data export

### 📅 **Calendar & History**

- ✅ Monthly calendar view (42-day grid)
- ✅ Day detail modal with notes and mood tracking
- ✅ Perfect day detection (100% completion)
- ✅ Historical data visualization
- ✅ Month-to-month navigation
- ✅ Habit filtering

### 🎯 **Focus Mode**

- ✅ Distraction-free interface
- ✅ Integrated Pomodoro timer (25/5/15 min)
- ✅ Fullscreen support
- ✅ Minimal UI with today's habits only
- ✅ Real-time completion tracking
- ✅ Audio alerts

### 📝 **Journal & Reflections**

- ✅ Daily reflection prompts (6 rotating)
- ✅ Mood tracking with emoji scale
- ✅ Search through past entries
- ✅ Date-based organization
- ✅ Habit-specific notes integration
- ✅ Mood statistics dashboard

### 🏆 **Rewards & Achievements**

- ✅ 15 unlockable badges
- ✅ Progress tracking
- ✅ Milestone celebrations
- ✅ Performance-based achievements
- ✅ Time-based rewards
- ✅ Streak achievements

### 🧠 **Smart Insights**

- ✅ AI-powered habit analysis
- ✅ Struggling habit detection
- ✅ Peak performance time identification
- ✅ Streak risk alerts
- ✅ Momentum predictions
- ✅ Category strength analysis
- ✅ Growth suggestions

### ⚡ **Command Palette**

- ✅ Quick navigation (Cmd/Ctrl + K)
- ✅ Fuzzy search
- ✅ Keyboard shortcuts
- ✅ Instant habit completion
- ✅ Grouped commands

### ⚙️ **Settings & Customization**

- ✅ Profile with avatar emojis
- ✅ Theme variants (Pure Dark, Dark Blue, Dark Purple)
- ✅ Accent color picker (8 colors)
- ✅ Font size adjustment
- ✅ Week start preference
- ✅ Time format (12/24 hour)
- ✅ Notification settings
- ✅ Data management (export/import/clear)
- ✅ Developer mode
- ✅ Performance mode
- ✅ Compact view

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm/pnpm/yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/perseverance.git

# Navigate to directory
cd perseverance

# Install dependencies
npm install

# Start development server
npm run dev
```

Visit `http://localhost:5173` to see the app.

### Build for Production

```bash
npm run build
npm run preview
```

---

## 🎮 Usage

### Keyboard Shortcuts

| Shortcut       | Action               |
| -------------- | -------------------- |
| `Cmd/Ctrl + K` | Open Command Palette |
| `Esc`          | Close Modal/Palette  |
| `↑` / `↓`      | Navigate Commands    |
| `Enter`        | Execute Command      |

### Command Palette

Press `Cmd+K` (Mac) or `Ctrl+K` (Windows) to open the command palette for quick navigation and actions:

- Go to any page instantly
- Mark habits complete
- Search all commands
- Keyboard-driven workflow

### Focus Mode

1. Click **Focus** button in header
2. Select timer mode (Focus/Short/Long Break)
3. Start timer and work on habits
4. Take breaks when prompted
5. Toggle fullscreen for immersion

### Journal

1. Navigate to Journal page
2. Read daily reflection prompt
3. Write your thoughts
4. Save reflection
5. Search past entries anytime

### Rewards

Click **Rewards** button to view:

- Unlocked achievements
- Progress to next badge
- Overall stats
- Locked badge requirements

---

## 📦 Tech Stack

### Core

- **React 19.1.1** - UI framework
- **Vite 7.1.7** - Build tool & dev server
- **React Router DOM 7.9.4** - Client-side routing

### Styling

- **Tailwind CSS 4.1.14** - Utility-first CSS
- **@tailwindcss/vite** - Vite plugin for Tailwind v4

### Charts & Visualization

- **Recharts 3.2.1** - Chart library for statistics

### Utilities

- **date-fns 4.1.0** - Date manipulation
- **React Hot Toast 2.6.0** - Toast notifications
- **React Icons 5.5.0** - Icon library

### State Management

- React Context API
- Custom hooks (useLocalStorage)
- localStorage for persistence

---

## 🎨 Design System

### Color Palette

- **Background:** #0A0A0B (Rich Black)
- **Secondary:** #111113 (Charcoal)
- **Accent:** #6366F1 (Royal Indigo)
- **Success:** #10B981 (Emerald)
- **Warning:** #F59E0B (Amber)
- **Error:** #EF4444 (Red)

### Theme Variants

- Pure Dark (#000000)
- Dark Blue (#0A1929)
- Dark Purple (#1A0B2E)

### Typography

- **Headings:** Bold, tracking tight
- **Body:** Regular, zinc colors
- **Mono:** Timer display, code elements

---

## 📁 Project Structure

```
perseverance/
├── src/
│   ├── components/
│   │   ├── AddHabitModal.jsx
│   │   ├── CommandPalette.jsx       # ⚡ NEW
│   │   ├── DayDetailModal.jsx
│   │   ├── EditHabitModal.jsx
│   │   ├── EmptyState.jsx
│   │   ├── HabitCard.jsx
│   │   ├── HabitTemplateModal.jsx
│   │   ├── Layout.jsx
│   │   ├── ProgressRing.jsx
│   │   ├── QuickStats.jsx
│   │   ├── RewardsModal.jsx         # 🏆 NEW
│   │   ├── SmartInsights.jsx        # 🧠 NEW
│   │   └── WeekCalendar.jsx
│   ├── context/
│   │   └── HabitContext.jsx
│   ├── data/
│   │   └── constants.js
│   ├── hooks/
│   │   └── useLocalStorage.js
│   ├── pages/
│   │   ├── Calendar.jsx
│   │   ├── Dashboard.jsx
│   │   ├── FocusMode.jsx            # 🎯 NEW
│   │   ├── Habits.jsx
│   │   ├── Journal.jsx              # 📝 NEW
│   │   ├── Settings.jsx
│   │   └── Statistics.jsx
│   ├── services/
│   │   └── dataService.js
│   ├── utils/
│   │   └── helpers.js
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── public/
├── docs/
│   ├── PHASE_8_COMPLETE.md
│   ├── PHASE_8_QUICK_REF.md
│   └── PHASE_8_SUMMARY.md
└── package.json
```

---

## 🏆 Achievement Badges

### 15 Unlockable Achievements

#### Getting Started

- 🎯 **First Steps** - Create your first habit
- 🚀 **Building Momentum** - Create 5 habits

#### Time-Based

- 📅 **Week Warrior** - Track for 7 days
- 🏆 **Monthly Master** - Track for 30 days
- 💯 **Century Club** - Track for 100 days

#### Perfect Days

- ⭐ **Perfect Day** - Complete all habits in one day
- 🌟 **Perfection Seeker** - Achieve 10 perfect days

#### Streaks

- 🔥 **On Fire** - 7-day streak
- ⚡ **Unstoppable** - 30-day streak

#### Completions

- 🎊 **Half Century** - 50 completions
- 🎉 **Completion Champion** - 100 completions
- 👑 **Legend** - 500 completions

#### Performance

- 💪 **Consistency King** - 80% completion rate

#### Time of Day

- 🌅 **Early Bird** - 10 morning completions
- 🌙 **Night Owl** - 10 evening completions

---

## 🧠 Smart Insights

Perseverance analyzes your habits and provides intelligent suggestions:

1. **Struggling Habit Detection** - Identifies habits with low completion rates
2. **Consistency Celebration** - Recognizes excellent performance
3. **Peak Performance Time** - Finds your most productive hours
4. **Streak Alerts** - Warns when streaks are at risk
5. **Momentum Tracking** - Predicts habit success
6. **Category Analysis** - Identifies your strengths
7. **Growth Suggestions** - Recommends when to add habits
8. **Overload Prevention** - Warns about tracking too many habits

---

## 📖 Documentation

- **[PHASE_8_COMPLETE.md](./PHASE_8_COMPLETE.md)** - Full Phase 8 documentation
- **[PHASE_8_QUICK_REF.md](./PHASE_8_QUICK_REF.md)** - Quick reference guide
- **[PHASE_8_SUMMARY.md](./PHASE_8_SUMMARY.md)** - Implementation summary
- **[STATISTICS_GUIDE.md](./STATISTICS_GUIDE.md)** - Statistics page guide
- **[CALENDAR_GUIDE.md](./CALENDAR_GUIDE.md)** - Calendar page guide

---

## 🛣️ Roadmap

### Completed Phases

- ✅ **Phase 1-4:** Core tracking, CRUD, filters, templates
- ✅ **Phase 5:** Statistics & analytics with charts
- ✅ **Phase 6:** Calendar & history view
- ✅ **Phase 7:** Settings & customization
- ✅ **Phase 8:** Enhanced features & polish

### Future Phases (Optional)

- 🔮 **Phase 9:** Advanced analytics & ML predictions
- 🔮 **Phase 10:** Social features & sharing
- 🔮 **Phase 11:** Mobile app (React Native)
- 🔮 **Phase 12:** Desktop app (Electron)

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License.

---

## 🙏 Acknowledgments

- **Recharts** - Beautiful charts made easy
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Comprehensive icon library
- **date-fns** - Modern date utility library

---

## 📞 Support

If you have any questions or need help, please:

- Open an issue on GitHub
- Check the documentation in `/docs`
- Review the quick reference guides

---

## ⭐ Show Your Support

Give a ⭐️ if this project helped you build better habits!

---

**Built with ❤️ and perseverance**

_"Success is the sum of small efforts, repeated day in and day out."_ - Robert Collier

---

**Current Version:** 1.0.0  
**Last Updated:** October 2025  
**Status:** Production Ready ✅
