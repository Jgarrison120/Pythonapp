import { useMemo } from "react";

function HabitCalendar({ completionMap = {}, toggleDay }) {
  const months = [
    "Jan","Feb","Mar","Apr","May","Jun",
    "Jul","Aug","Sep","Oct","Nov","Dec"
  ];

  const days = useMemo(() => {
    return Array.from({ length: 31 }, (_, i) => i + 1);
  }, []);

  const getColor = (value) => {
    switch (value) {
      case 0:
        return "#1f2937";
      case 0.25:
        return "#93c5fd";
      case 0.5:
        return "#60a5fa";
      case 0.75:
        return "#3b82f6";
      case 1:
        return "#1d4ed8";
      default:
        return "#1f2937";
    }
  };

  return (
    <div>

      {/* MONTH HEADER */}
      <div style={styles.calendarGrid}>
  <div></div>

  {months.map((m) => (
    <div key={m} style={styles.monthCell}>
      {m}
    </div>
  ))}
</div>

      {/* GRID */}
      <div>
  {days.map((day) => (
    <div
      key={day}
      style={styles.calendarGrid}
    >
      {/* Day label */}
      <div style={styles.dayLabel}>
        {day}
      </div>

      {/* Month cells */}
      {months.map((month, monthIndex) => {
  const date = new Date(2026, monthIndex, day); // 🔥 FIXED

  const key = date.toISOString().split("T")[0];
  const value = completionMap?.[key] || 0;

  return (
    <div
      key={key}
      style={{
        ...styles.cell,
        background: getColor?.(value) || "#1f2937",
      }}
      onClick={() => toggleDay?.(key)}
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
  gridTemplateColumns: "40px repeat(12, 1fr)",
  justifyItems: "center",
  alignItems: "center",
  marginBottom: "8px",
},

  calendarGrid: {
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

  row: {
  display: "grid",
  gridTemplateColumns: "40px repeat(12, 1fr)",
  alignItems: "center",
  justifyItems: "center",
  marginBottom: "4px",
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

  background: "#1f2937",   // IMPORTANT (default visible state)
  border: "1px solid #374151", // 🔥 restores outline
  transition: "0.15s ease",
},
};