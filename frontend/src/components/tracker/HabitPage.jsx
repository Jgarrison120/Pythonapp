import { useState } from "react";

function HabitPage({ habit }) {
  const GRID_CONFIG = {
    columns: 7,
    cellSize: 22,
    gap: 6,
  };
  const [completionMap, setCompletionMap] = useState(() => {
  const saved = localStorage.getItem(`habit-${habit.id}`);
  return saved ? JSON.parse(saved) : {};
});

  if (!habit) {
    return (
      <div style={styles.empty}>
        No habit selected
      </div>
    );
  }

  // Generate last 30 days
  const days = Array.from({ length: 30 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - i);
    return d.toISOString().split("T")[0];
  });

  const toggleDay = (date) => {
  setCompletionMap((prev) => {
    const current = prev[date] || 0;

    const next =
      current === 0 ? 1 :
      current === 1 ? 0.5 :
      current === 0.5 ? 0.25 :
      0;

    const updated = {
      ...prev,
      [date]: next,
    };

    localStorage.setItem(
      `habit-${habit.id}`,
      JSON.stringify(updated)
    );

    return updated;
  });
};

  const getColor = (value) => {
  if (value === 0) return "#1f2937";
  if (value <= 0.25) return "#bfdbfe";
  if (value <= 0.5) return "#60a5fa";
  if (value <= 0.75) return "#3b82f6";
  return "#1d4ed8";
};

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>{habit.name}</h1>
        <p style={styles.subtitle}>{habit.goal}</p>
      </div>

      {/* STATS */}
      <div style={styles.cardRow}>

        <div style={styles.card}>
          <h3>🔥 Streak</h3>
          <p style={styles.bigText}>{habit.streak}</p>
        </div>

        <div style={styles.card}>
          <h3>📊 Completion</h3>
          <p style={styles.bigText}>{habit.completion}%</p>
        </div>

        <div style={styles.card}>
          <h3>🏅 Badges</h3>
          <p style={styles.badgeText}>
            {habit.badges?.length ? habit.badges.join(", ") : "None yet"}
          </p>
        </div>

      </div>

      {/* GRID SECTION */}
<div style={styles.gridCard}>

  <h3>📅 Habit Grid</h3>

  {/* WEEKDAY LABELS */}
  <div style={styles.weekdays}>
    {["S","M","T","W","T","F","S"].map((d, i) => (
      <div key={i} style={styles.weekday}>
        {d}
      </div>
    ))}
  </div>

  {/* GRID */}
  <div style={styles.grid}>
    {days.map((day) => {
      const value = completionMap[day] || 0;

      return (
        <div
          key={day}
          title={day}
          onClick={() => toggleDay(day)}
          style={{
            ...styles.cell,
            background: getColor(value),
          }}
        />
      );
    })}
  </div>

</div>

    </div>
  );
}

export default HabitPage;

/* =========================
   STYLES
========================= */

const styles = {
  page: {
    flex: 1,
    minWidth: 0,
    height: "100vh",
    overflow: "auto",
    padding: "20px",
    background: "#0f172a",
    color: "white",
  },

  empty: {
    flex: 1,
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    background: "#0f172a",
    fontSize: "18px",
  },

  header: {
    marginBottom: "20px",
  },

  title: {
    fontSize: "32px",
    marginBottom: "5px",
  },

  subtitle: {
    opacity: 0.7,
  },

  cardRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  card: {
    flex: 1,
    minWidth: "180px",
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
  },

  bigText: {
    fontSize: "26px",
    marginTop: "10px",
  },

  badgeText: {
    marginTop: "10px",
    opacity: 0.8,
  },

  gridCard: {
  background: "#1f2937",
  padding: "20px",
  borderRadius: "12px",
  marginTop: "20px",
  display: "inline-block",
},

  grid: {
  display: "grid",
  gridTemplateColumns: "repeat(7, 22px)",
  gap: "6px",
  justifyContent: "start",
  padding: "10px 10px 10px 10px", // keep but we control spacing above instead
  marginTop: "0px", // 🔥 important
},

weekdays: {
  display: "grid",
  gridTemplateColumns: "repeat(7, 22px)",
  gap: "6px",
  marginTop: "10px",
  marginBottom: "2px",
  justifyContent: "start",
  paddingLeft: "10px", // 🔥 IMPORTANT ALIGNMENT FIX
  opacity: 0.6,
  fontSize: "12px",
},

weekday: {
  textAlign: "center",
},

  cell: {
    width: "20px",
    height: "20px",
    borderRadius: "4px",
    cursor: "pointer",
    border: "1px solid #374151",
  },
};