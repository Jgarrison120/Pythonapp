import { useLayoutEffect, useRef, useState } from "react";
import HamsterProgressMarker from "./HamsterProgressMarker";

const levels = [
  { value: 0, label: "Not started" },
  { value: 0.25, label: "A little" },
  { value: 0.5, label: "Halfway" },
  { value: 0.75, label: "Almost there" },
  { value: 1, label: "Complete" },
];

function dateKey(date) {
  return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, "0") + "-" + String(date.getDate()).padStart(2, "0");
}

function dayAt(date, offset) {
  const next = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 12);
  next.setDate(next.getDate() + offset);
  return next;
}

function DailyTracker({ habit, completionMap, updateHabitEntry }) {
  const [selectedDate, setSelectedDate] = useState(() => dayAt(new Date(), 0));
  const stageRef = useRef(null);
  const [stageGeometry, setStageGeometry] = useState({ width: 0, stopSize: 74, markerSize: 104 });

  useLayoutEffect(() => {
    const stage = stageRef.current;
    if (!stage) return;
    const measure = () => {
      const styles = getComputedStyle(stage);
      setStageGeometry({
        width: stage.clientWidth,
        stopSize: Number.parseFloat(styles.getPropertyValue("--stop-size")),
        markerSize: Number.parseFloat(styles.getPropertyValue("--marker-size")),
      });
    };
    measure();
    const observer = new ResizeObserver(measure);
    observer.observe(stage);
    return () => observer.disconnect();
  }, []);

  const today = dayAt(new Date(), 0);
  const selectedKey = dateKey(selectedDate);
  const todayKey = dateKey(today);
  const progress = completionMap[selectedKey] || 0;
  const percent = Math.round(progress * 100);
  const markerX = (stageGeometry.stopSize - stageGeometry.markerSize) / 2
    + progress * (stageGeometry.width - stageGeometry.stopSize);
  const monday = dayAt(selectedDate, -((selectedDate.getDay() + 6) % 7));
  const week = Array.from({ length: 7 }, (_, index) => dayAt(monday, index));
  const selectedLabel = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(selectedDate);
  const encouragement = progress === 1
    ? "You showed up for yourself. That counts."
    : progress >= 0.75
      ? "So close. Keep your momentum going."
      : progress > 0
        ? "A small step is still a step forward."
        : selectedKey === todayKey
          ? "Start wherever you are today."
          : "Every day is a fresh chance to begin.";

  return (
    <section className="daily-tracker" aria-label="Daily habit tracker" data-testid="daily-tracker">
      <div className="daily-tracker-main">
        <div className="daily-tracker-copy">
          <span className="daily-tracker-kicker">Daily check-in · {habit.name}</span>
          <h2>{selectedKey === todayKey ? "How’s today going?" : "How did it go?"}</h2>
          <p>{encouragement}</p>
          <span className="daily-tracker-date">{selectedLabel}</span>
        </div>
        <div className="daily-progress" role="img" aria-label={`${percent}% complete for ${selectedLabel}`} style={{ "--daily-progress": `${percent}%` }}>
          <div className="daily-progress-inner">
            <strong>{percent}%</strong>
            <span>of your goal</span>
          </div>
        </div>
      </div>

      <div className="daily-tracker-controls">
        <div>
          <h3>Mark your progress</h3>
          <p>Choose a milestone. Your hamster will meet you there.</p>
        </div>
        <div className="hamster-progress">
          <div className="hamster-progress-stage" ref={stageRef}>
            <div className="hamster-progress-rail" role="progressbar" aria-label={`Progress for ${selectedLabel}`} aria-valuemin="0" aria-valuemax="100" aria-valuenow={percent}>
              <span className="hamster-progress-fill" style={{ transform: `scaleX(${progress})` }} />
            </div>
            <div className="hamster-progress-marker" style={{ transform: `translateX(${markerX}px)`, visibility: stageGeometry.width ? "visible" : "hidden" }}>
              <HamsterProgressMarker progress={progress} />
            </div>
          </div>
          <div className="hamster-milestones" role="group" aria-label={`Set progress for ${selectedLabel}`}>
            {levels.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                className={`hamster-milestone${progress === value ? " is-selected" : ""}`}
                aria-pressed={progress === value}
                aria-label={`${Math.round(value * 100)}% — ${label}`}
                onClick={() => {
                  if (progress !== value) updateHabitEntry(habit.id, selectedKey, value);
                }}
              >
                <span className="hamster-milestone-dot" aria-hidden="true" />
                <strong>{Math.round(value * 100)}%</strong>
                <span>{label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="daily-week">
        <div className="daily-week-heading">
          <div>
            <h3>Your week</h3>
            <p>Pick a day to review or update.</p>
          </div>
          <div className="daily-week-actions">
            {selectedKey !== todayKey && <button type="button" className="daily-today-button" onClick={() => setSelectedDate(today)}>Today</button>}
            <button type="button" className="daily-week-nav" aria-label="Previous week" onClick={() => setSelectedDate(dayAt(selectedDate, -7))}>‹</button>
            <button type="button" className="daily-week-nav" aria-label="Next week" onClick={() => setSelectedDate(dayAt(selectedDate, 7))}>›</button>
          </div>
        </div>
        <div className="daily-week-days" role="group" aria-label="Days of the selected week">
          {week.map((day) => {
            const key = dateKey(day);
            const value = completionMap[key] || 0;
            const dayLabel = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(day);
            return (
              <button
                key={key}
                type="button"
                className={`daily-week-day${key === selectedKey ? " is-selected" : ""}${key === todayKey ? " is-today" : ""}`}
                aria-label={`${dayLabel}: ${Math.round(value * 100)}% complete`}
                aria-pressed={key === selectedKey}
                onClick={() => setSelectedDate(day)}
              >
                <span className="daily-week-name">{new Intl.DateTimeFormat("en", { weekday: "short" }).format(day)}</span>
                <strong>{day.getDate()}</strong>
                <span className="daily-week-indicator" style={{ "--day-progress": `${Math.round(value * 100)}%` }} aria-hidden="true" />
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default DailyTracker;
