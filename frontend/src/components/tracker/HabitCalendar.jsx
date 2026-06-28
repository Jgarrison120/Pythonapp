import { useMemo } from "react";

function HabitCalendar({ completionMap = {}, toggleDay }) {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  // =========================
  // DATE HELPERS (CRITICAL FIX)
  // =========================
  const formatDate = (date) => {
    const d = new Date(date);
    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toISOString()
      .split("T")[0];
  };

  const getColor = (value) => {
    if (value === 0) return "#1f2937";
    if (value <= 0.25) return "#93c5fd";
    if (value <= 0.5) return "#60a5fa";
    if (value <= 0.75) return "#3b82f6";
    return "#1d4ed8";
  };

  // =========================
  // GRID DATA
  // =========================
  const days = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  }, []);

  return (
    <div>

      {/* =========================
          MONTH HEADER ROW
      ========================= */}
      <div style={styles.monthRow}>
        <div style={styles.cornerCell} />

        {months.map((m) => (
          <div key={m} style={styles.monthCell}>
            {m}
          </div>
        ))}
      </div>

      {/* =========================
          GRID BODY
      ========================= */}
      <div>
        {days.map((day) => (
          <div key={day} style={styles.row}>

            {/* Day label */}
            <div style={styles.dayLabel}>
              {day}
            </div>

            {/* Month cells */}
            {months.map((_, monthIndex) => {
              const date = new Date(2026, monthIndex, day);

              const key = formatDate(date);
              const value = completionMap[key] || 0;

              return (
                <div
                  key={key}
                  style={{
                    ...styles.cell,
                    background: getColor(value),
                  }}
                  onClick={() => toggleDay(date)}
                />
              );
            })}
          </div>
        ))}
      </div>

    </div>
  );
}

export default HabitCalendar;

const styles = {
  monthRow: {
    display: "grid",
    gridTemplateColumns: "40px repeat(12, 22px)",
    gap: "4px",
    marginBottom: "6px",
    alignItems: "center",
  },

  row: {
    display: "grid",
    gridTemplateColumns: "40px repeat(12, 22px)",
    gap: "4px",
    alignItems: "center",
  },

  cornerCell: {
    width: "40px",
  },

  monthCell: {
    textAlign: "center",
    fontSize: "12px",
    opacity: 0.7,
  },

  dayLabel: {
    width: "40px",
    fontSize: "12px",
    opacity: 0.6,
  },

  cell: {
    width: "18px",
    height: "18px",
    borderRadius: "4px",
    cursor: "pointer",
    justifySelf: "center",
    background: "#1f2937",
    border: "1px solid #374151",
    transition: "0.15s ease",
  },
};