import { useMemo } from "react";
import { calendarStyles as styles } from "./HabitCalendarStyles";

const MONTHS = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
];

const DAYS = Array.from({ length: 31 }, (_, index) => index + 1);

function HabitCalendar({ completionMap = {}, toggleDay, year = 2026 }) {
  const calendarRows = useMemo(() => {
    return DAYS.map((day) => {
      return MONTHS.map((month, monthIndex) => {
        const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

        if (day > daysInMonth) {
          return {
            key: `${year}-${monthIndex}-${day}-empty`,
            isValid: false,
            day,
            month,
          };
        }

        const date = new Date(year, monthIndex, day);

        return {
          key: formatDate(date),
          isValid: true,
          date,
          day,
          month,
        };
      });
    });
  }, [year]);

  const getColor = (value) => {
    if (value === 0) return "#1f2937";
    if (value <= 0.25) return "#93c5fd";
    if (value <= 0.5) return "#60a5fa";
    if (value <= 0.75) return "#3b82f6";
    return "#1d4ed8";
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.header}>
        <h3 style={styles.title}>📅 Yearly Habit Calendar</h3>
        <span style={styles.yearBadge}>{year}</span>
      </div>

      <div style={styles.calendar}>
        <div style={styles.monthHeaderRow}>
          <div style={styles.dayHeaderCell}>Day</div>

          {MONTHS.map((month) => (
            <div key={month} style={styles.monthHeaderCell}>
              {month}
            </div>
          ))}
        </div>

        {calendarRows.map((row, rowIndex) => (
          <div key={DAYS[rowIndex]} style={styles.calendarRow}>
            <div style={styles.dayLabel}>{DAYS[rowIndex]}</div>

            {row.map((cell) => {
              if (!cell.isValid) {
                return (
                  <div
                    key={cell.key}
                    style={styles.disabledCell}
                    title={`${cell.month} ${cell.day} does not exist`}
                  />
                );
              }

              const value = completionMap[cell.key] || 0;

              return (
                <button
                  key={cell.key}
                  type="button"
                  title={`${cell.month} ${cell.day}, ${year}`}
                  style={{
                    ...styles.cell,
                    background: getColor(value),
                  }}
                  onClick={() => toggleDay(cell.date)}
                />
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );
}

function formatDate(date) {
  const d = new Date(date);
  return new Date(d.getFullYear(), d.getMonth(), d.getDate())
    .toISOString()
    .split("T")[0];
}

export default HabitCalendar;