import HabitCalendar from "./HabitCalendar";
import DailyTracker from "./DailyTracker";

import { useState } from "react";

function localDateKey(date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

function streaks(entries) {
  const dates = Object.entries(entries)
    .filter((entry) => entry[1] >= 0.75)
    .map((entry) => entry[0])
    .sort();

  if (dates.length === 0) return { current: 0, best: 0 };

  let run = 1;
  let best = 1;
  for (let i = 1; i < dates.length; i++) {
    const previous = new Date(dates[i - 1] + "T12:00:00");
    const next = new Date(dates[i] + "T12:00:00");
    const difference = Math.round((next - previous) / 86400000);
    run = difference === 1 ? run + 1 : 1;
    best = Math.max(best, run);
  }

  const yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);
  const latest = dates[dates.length - 1];
  const isActive = latest === localDateKey(new Date()) || latest === localDateKey(yesterday);
  return { current: isActive ? run : 0, best };
}

function HabitPage({ habit, updateHabitEntry }) {
  const [year, setYear] = useState(new Date().getFullYear());
  const completionMap = habit.entries || {};
  const completedDays = Object.values(completionMap).filter((value) => value >= 0.75).length;
  const yearEntries = Object.entries(completionMap).filter((entry) => entry[0].startsWith(String(year) + "-"));
  const completedThisYear = yearEntries.filter((entry) => entry[1] >= 0.75).length;
  const daysInYear = Math.round((new Date(year + 1, 0, 1) - new Date(year, 0, 1)) / 86400000);
  const yearCompletionRate = Math.round((completedThisYear / daysInYear) * 100);
  const { current: streak, best: bestStreak } = streaks(completionMap);

  const monthTotals = Array(12).fill(0);
  yearEntries.forEach(([date, value]) => {
    if (value >= 0.75) monthTotals[Number(date.slice(5, 7)) - 1]++;
  });
  const bestMonthIndex = monthTotals.indexOf(Math.max(...monthTotals));
  const bestMonth = monthTotals[bestMonthIndex] > 0
    ? new Intl.DateTimeFormat("en", { month: "short" }).format(new Date(year, bestMonthIndex, 1))
    : "Not yet";

  const toggleDay = (date) => {
    const key = localDateKey(date);
    const current = completionMap[key] || 0;
    const next = current >= 1 ? 0 : Math.round((current + 0.25) * 100) / 100;
    updateHabitEntry(habit.id, key, next);
  };

  return (
    <article className="habit-detail" aria-label="Habit details">
      <DailyTracker habit={habit} completionMap={completionMap} updateHabitEntry={updateHabitEntry} />

      <section className="detail-section" aria-label="Habit progress">
        <div className="section-heading">
          <h3>Look how far you have come</h3>
          <p>Every check-in matters, even the small ones.</p>
        </div>
        <div className="metrics-grid">
          <div className="metric"><strong className="metric-number">{streak}</strong><span className="metric-label">Current streak · days</span></div>
          <div className="metric"><strong className="metric-number">{bestStreak}</strong><span className="metric-label">Best streak · days</span></div>
          <div className="metric"><strong className="metric-number">{completedDays}</strong><span className="metric-label">Completed days</span></div>
          <div className="metric"><strong className="metric-number">{yearCompletionRate}%</strong><span className="metric-label">Year progress</span></div>
          <div className="metric"><strong className="metric-number">{bestMonth}</strong><span className="metric-label">Best month in {year}</span></div>
        </div>
      </section>

      <HabitCalendar completionMap={completionMap} toggleDay={toggleDay} year={year} setYear={setYear} />
    </article>
  );
}

export default HabitPage;
