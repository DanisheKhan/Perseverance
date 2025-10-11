# 📅 PHASE 6: Calendar & History - Quick Reference

## 🚀 Quick Access

**URL:** http://localhost:5173/calendar
**Nav:** Click "Calendar" in navigation bar (4th item)

---

## ⚡ Quick Actions

### View Calendar

```
1. Click "Calendar" in nav
2. See current month grid
3. Colored dots = completed habits
4. ✨ sparkle = perfect day
5. 🔷 ring = today
```

### Open Day Details

```
1. Click any past date
2. Modal opens
3. View/edit habits
4. Add notes
5. Set mood
6. Click "Done"
```

### Navigate Months

```
◀ Previous month
▶ Next month
[Today] Jump to current month
```

### Filter by Habit

```
1. Click dropdown (top-right)
2. Select habit
3. See only that habit
4. Select "All Habits" to reset
```

---

## 🎯 Key Features

### Calendar Grid

- **Size:** 42 days (6 weeks × 7 days)
- **Today:** Indigo ring
- **Perfect Day:** Amber ring + ✨
- **Completed:** Colored dots (max 6 shown)
- **Future:** Grayed out, not clickable

### Day Detail Modal

- **Habits:** All active habits for date
- **Toggle:** ✓ mark complete/incomplete
- **Notes:** Add/edit/delete per habit
- **Mood:** 5 emoji options (😊🙂😐😕😢)
- **Stats:** X of Y habits (Z%)

### Month Statistics

1. **Completion Rate** - % with progress bar
2. **Total Completions** - Count of completed
3. **Streaks Started** - New streaks this month
4. **Perfect Days** - 100% completion days

### Perfect Days

- **Definition:** All habits completed
- **Visual:** Amber ring + sparkle icon
- **Listed:** Below calendar with dates
- **Goal:** Maximize each month!

---

## 📊 Visual Indicators

| Indicator      | Meaning            |
| -------------- | ------------------ |
| 🔷 Indigo Ring | Today              |
| ✨ Amber Ring  | Perfect Day (100%) |
| ●●● Dots       | Completed habits   |
| Dimmed dates   | Other months       |
| +2 more        | Overflow indicator |

---

## 😊 Mood Tracker

| Emoji | Label | Value | When to Use    |
| ----- | ----- | ----- | -------------- |
| 😊    | Great | 5     | Excellent day  |
| 🙂    | Good  | 4     | Above average  |
| 😐    | Okay  | 3     | Normal day     |
| 😕    | Bad   | 2     | Challenging    |
| 😢    | Awful | 1     | Very difficult |

**Tip:** Track consistently to find patterns!

---

## 📝 Notes Guide

### Good Notes:

✅ "Ran 5km in park - felt amazing!"
✅ "Finished chapter 3 of book"
✅ "10-minute meditation, deep breathing"

### Poor Notes:

❌ "Done"
❌ "Yes"
❌ "✓"

**Rule:** Be specific and descriptive!

---

## 🎨 Color Codes

```
Indigo  (#6366F1) - Today, primary actions
Amber   (#F59E0B) - Perfect days, achievements
Emerald (#10B981) - Completions, success
Purple  (#8B5CF6) - Special metrics
Zinc    (#... gray scale) - Backgrounds, text
Habit Colors - Individual habit specific
```

---

## 🔍 Habit Filter Options

```
All Habits (default)
├─ Shows all active habits
├─ All colors visible
└─ Full calendar view

[Specific Habit]
├─ Shows only that habit
├─ One color visible
└─ Focused view
```

---

## 📱 Responsive Sizes

### Mobile (< 640px)

- Compact cells
- Stacked stats
- Full-width modal

### Tablet (640-1024px)

- Medium cells
- 2-col stats
- Medium modal

### Desktop (> 1024px)

- Large cells
- 4-col stats
- Optimal modal

---

## 🎯 Daily Workflow

```
Morning:
1. Open Calendar
2. Click today
3. Preview habits
4. Plan your day

Evening:
1. Open Calendar
2. Click today
3. Mark complete
4. Add notes
5. Set mood
6. Review stats
```

---

## 📊 Month Stats Formulas

```javascript
Completion Rate:
(completed / (days × habits)) × 100

Total Completions:
Sum of all completed habits

Streaks Started:
Count of new streak beginnings

Perfect Days:
Days with 100% completion
```

---

## ⌨️ Keyboard Shortcuts (Future)

```
← → : Navigate months
Home : Jump to today
Esc : Close modal
Enter : Save changes
```

---

## 🐛 Troubleshooting

### Date Won't Open?

- Only past/today clickable
- Future dates disabled
- Try refreshing page

### Stats Look Wrong?

- Check "All Habits" selected
- Refresh the page
- Verify completions

### Dots Not Showing?

- Check habit filter
- Verify completions exist
- Try "All Habits"

---

## 💡 Pro Tips

1. ✅ **Check daily** - Make it routine
2. ✅ **Add notes** - Context helps
3. ✅ **Track mood** - Find patterns
4. ✅ **Edit honestly** - Accuracy wins
5. ✅ **Review weekly** - Spot trends
6. ✅ **Filter habits** - Deep dive
7. ✅ **Celebrate perfects** - Acknowledge wins
8. ✅ **Learn from gaps** - Improve

---

## 🎊 Perfect Day Goals

### Beginner:

- 1-2 perfect days per week
- 5-8 per month

### Intermediate:

- 3-4 perfect days per week
- 12-16 per month

### Advanced:

- 5-6 perfect days per week
- 20-25 per month

### Expert:

- Daily perfect days
- 28-30 per month

---

## 📚 Related Pages

- **Dashboard** - Today's tracking
- **Habits** - Manage habits
- **Statistics** - Long-term trends
- **Calendar** - History view (YOU ARE HERE)
- **Settings** - Preferences (Phase 7)

---

## 🔗 Quick Navigation

```
Dashboard  →  /
Habits     →  /habits
Statistics →  /statistics
Calendar   →  /calendar ← YOU
Settings   →  /settings
```

---

## 📖 Documentation

- **User Guide:** CALENDAR_GUIDE.md (comprehensive)
- **Tech Doc:** PHASE_6_COMPLETE.md (implementation)
- **Summary:** PHASE_6_SUMMARY.md (overview)
- **Quick Ref:** This file (cheat sheet)

---

## 🎯 Common Tasks

### Edit Yesterday:

```
1. Click ◀ if needed
2. Click yesterday's date
3. Mark habits
4. Add notes
5. Done
```

### Find Perfect Days:

```
1. Look for ✨ sparkles
2. Check list below calendar
3. Click to view details
```

### Check Month Progress:

```
1. View 4 stat cards
2. Check completion rate
3. Count perfect days
4. Review streaks
```

### Track Mood Patterns:

```
1. Set mood daily
2. Review over weeks
3. Notice correlations
4. Adjust habits
```

---

## ⚡ Performance Tips

- Calendar loads fast (memoized)
- Modal opens instantly
- Stats calculate efficiently
- Filtering is smooth
- No lag on interactions

---

## 🎨 UI Elements

### Calendar Cell:

```
┌──────┐
│  15  │ ← Day number
│  ●●  │ ← Habit dots
│  ✨  │ ← Perfect marker
└──────┘
```

### Modal Layout:

```
┌─────────────────────┐
│ Date        [X]     │ ← Header
├─────────────────────┤
│ 😊 🙂 😐 😕 😢     │ ← Mood
├─────────────────────┤
│ [✓] Habit 1         │
│     Note...         │ ← Habits
│ [ ] Habit 2         │
│     Add note        │
├─────────────────────┤
│          [Done]     │ ← Footer
└─────────────────────┘
```

---

## 🌟 Feature Highlights

### Most Used:

1. Day detail modal
2. Note-taking
3. Perfect day tracking
4. Month navigation
5. Habit filtering

### Most Loved:

1. Perfect day sparkles ✨
2. Mood tracking 😊
3. Easy editing
4. Visual history
5. Month stats

---

## 📈 Success Indicators

### Good Usage:

- ✅ Daily calendar checks
- ✅ Regular note-adding
- ✅ Consistent mood tracking
- ✅ Monthly reviews
- ✅ Honest editing

### Great Results:

- 📈 Increasing completion rate
- 📈 More perfect days
- 📈 Longer streaks
- 📈 Better mood correlation
- 📈 Valuable insights

---

**🎉 You're ready to track your history! 📅**

Navigate to http://localhost:5173/calendar and start exploring!
