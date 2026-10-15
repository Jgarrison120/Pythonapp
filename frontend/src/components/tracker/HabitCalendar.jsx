import { useMemo } from "react";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DAYS = Array.from({ length: 31 }, (_, index) => index + 1);

function HabitCalendar({ completionMap = {}, toggleDay, year = new Date().getFullYear(), setYear }) {
  const rows = useMemo(
    () => DAYS.map((day) => MONTHS.map((month, monthIndex) => {
      const valid = day <= new Date(year, monthIndex + 1, 0).getDate();
      const date = valid ? new Date(year, monthIndex, day) : null;
      const key = valid
        ? year + "-" + String(monthIndex + 1).padStart(2, "0") + "-" + String(day).padStart(2, "0")
        : month + "-" + day + "-empty";
      return { key, valid, date, day, month };
    })),
    [year]
  );

  return (
    <section className="calendar-panel" aria-label="Yearly habit calendar">
      <div className="calendar-heading">
        <div>
          <h3>Every day adds up</h3>
          <p>Tap a day to move through 25%, 50%, 75%, complete, and reset.</p>
        </div>
        <div className="calendar-year-controls">
          <button type="button" className="calendar-year-nav" aria-label="Previous year" onClick={() => setYear(year - 1)}>‹</button>
          <span className="calendar-year">{year}</span>
          <button type="button" className="calendar-year-nav" aria-label="Next year" onClick={() => setYear(year + 1)}>›</button>
        </div>
      </div>
      <p className="calendar-swipe-hint">Swipe sideways to see all months.</p>
      <div className="calendar-scroll">
        <div className="calendar-grid">
          <div className="calendar-row calendar-head">
            <span className="calendar-day-heading">Day</span>
            {MONTHS.map((month) => <span key={month} className="calendar-month">{month}</span>)}
          </div>
          {rows.map((row, rowIndex) => (
            <div className="calendar-row" key={DAYS[rowIndex]}>
              <span className="calendar-day">{DAYS[rowIndex]}</span>
              {row.map((cell) => {
                if (!cell.valid) return <span key={cell.key} className="calendar-cell-empty" aria-hidden="true" />;
                const value = completionMap[cell.key] || 0;
                const level = Math.min(4, Math.max(0, Math.round(value * 4)));
                const label = cell.month + " " + cell.day + ", " + year + ": " + Math.round(value * 100) + "% complete";
                return (
                  <button
                    key={cell.key}
                    type="button"
                    className="calendar-cell"
                    data-level={level}
                    aria-label={label}
                    title={label}
                    onClick={() => toggleDay(cell.date)}
                  />
                );
              })}
            </div>
          ))}
        </div>
      </div>
      <div className="calendar-legend" aria-label="Completion scale">
        <span>Less</span>
        {[0, 1, 2, 3, 4].map((level) => <span key={level} className="legend-box" data-level={level} />)}
        <span>More</span>
      </div>
    </section>
  );
}

export default HabitCalendar;
