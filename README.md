# 🎯 Perseverance - Personal Habit Tracker

A beautiful, premium dark-themed habit tracking application built with React and Tailwind CSS. Track your habits, build consistency, and achieve your goals with an elegant and intuitive interface.

## ✨ Features

- **Premium Dark Theme**: Sophisticated dark color scheme with royal indigo accents
- **Habit Management**: Create, edit, and track your daily habits
- **Statistics Dashboard**: Visualize your progress with charts and metrics
- **Local Storage**: All data saved securely in your browser
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **Smooth Animations**: Elegant transitions and hover effects

## 🎨 Tech Stack

- **Frontend**: React.js 19 with Vite
- **Styling**: Tailwind CSS 4 with custom dark theme
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: React Icons
- **Notifications**: React Hot Toast
- **Date Handling**: date-fns
- **Storage**: LocalStorage API

## 🚀 Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will be available at `http://localhost:5173`

## 📁 Project Structure

```
perseverance/
├── src/
│   ├── components/     # Reusable UI components
│   │   └── Layout.jsx  # Main layout with navigation
│   ├── pages/          # Page components
│   │   ├── Dashboard.jsx
│   │   ├── Habits.jsx
│   │   ├── Statistics.jsx
│   │   └── Settings.jsx
│   ├── hooks/          # Custom React hooks
│   │   └── useLocalStorage.js
│   ├── utils/          # Utility functions
│   │   └── helpers.js
│   ├── data/           # Data constants and types
│   │   └── constants.js
│   ├── App.jsx         # Main app component
│   ├── main.jsx        # Entry point
│   └── index.css       # Global styles
├── public/             # Static assets
├── package.json
└── vite.config.js
```

## 🎨 Color Theme

- **Background**: `#0A0A0B` (Rich Black)
- **Cards**: `#111113` (Charcoal)
- **Accent**: `#6366F1` (Royal Indigo)
- **Success**: `#10B981` (Emerald)
- **Text Primary**: `#FAFAFA`
- **Text Secondary**: `#A1A1AA`

## 📱 Pages

1. **Dashboard**: Overview of habits, streaks, and today's tasks
2. **Habits**: Manage all your habits
3. **Statistics**: View progress charts and achievements
4. **Settings**: Customize your experience and manage data

## 🔧 Custom Hooks

- `useLocalStorage`: Persistent state management with browser storage

## 🌟 Features Coming Soon

- Habit creation and editing
- Completion tracking with calendar view
- Streak calculation and badges
- Progress charts and analytics
- Data export/import
- Notifications and reminders

## 📄 License

MIT

## 👨‍💻 Author

Built with ❤️ using React and Tailwind CSS


## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.
