function HabitPage({ habit }) {
  if (!habit) {
    return (
      <div style={styles.empty}>
        No habit selected
      </div>
    );
  }

  return (
    <div style={styles.page}>
      
      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>{habit.name}</h1>
        <p style={styles.subtitle}>{habit.goal}</p>
      </div>

      {/* STATS ROW */}
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

      {/* GRID PLACEHOLDER (Phase 2) */}
      <div style={styles.gridCard}>
        <h3>📅 Habit Grid</h3>
        <div style={styles.gridBox}>
          Coming soon: clickable habit tracker grid
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
  },

  gridBox: {
    marginTop: "10px",
    height: "200px",
    border: "1px dashed #374151",
    borderRadius: "10px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    opacity: 0.6,
  },
};