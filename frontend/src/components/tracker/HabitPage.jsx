function ProgressBar({ value }) {
  return (
    <div style={pb.container}>
      <div style={{ ...pb.bar, width: `${value}%` }} />
    </div>
  );
}

const pb = {
  container: {
    width: "100%",
    height: "10px",
    background: "#374151",
    borderRadius: "999px",
    overflow: "hidden",
    marginTop: "10px",
  },
  bar: {
    height: "100%",
    background: "#3b82f6",
    borderRadius: "999px",
  },
};

function HabitPage({ habit }) {
  if (!habit) return <div style={{ padding: 20 }}>No habit selected</div>;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>{habit.name}</h1>
        <div style={styles.subtitle}>Habit Dashboard</div>
      </div>

      {/* TOP CARDS */}
      <div style={styles.cardRow}>

        {/* GOAL */}
        <div style={styles.card}>
          <h3>🎯 Goal</h3>
          <p>{habit.goal}</p>
        </div>

        {/* STREAK */}
        <div style={styles.card}>
          <h3>🔥 Streak</h3>
          <p style={{ fontSize: 24 }}>
            {habit.streak || 0} days
          </p>
        </div>

        {/* COMPLETION */}
        <div style={styles.card}>
          <h3>📊 Completion</h3>
          <ProgressBar value={habit.completion || 0} />
        </div>

      </div>

      {/* BADGES */}
      <div style={styles.card}>
        <h3>🏅 Badges</h3>

        {habit.badges?.length > 0 ? (
          <div style={styles.badgeRow}>
            {habit.badges.map((b, i) => (
              <div key={i} style={styles.badge}>
                {b}
              </div>
            ))}
          </div>
        ) : (
          <p style={{ opacity: 0.5 }}>No badges yet</p>
        )}
      </div>

      {/* GRID PLACEHOLDER (Phase 2) */}
      <div style={styles.card}>
        <h3>📅 Yearly Tracker</h3>
        <div style={styles.gridPlaceholder}>
          Grid will go here in Phase 2
        </div>
      </div>

    </div>
  );
}

export default HabitPage;
const styles = {
  page: {
    padding: "30px",
     color: "white",
     flex: 1,          // 🔥 THIS IS CRITICAL
},

  header: {
    marginBottom: "20px",
  },

  title: {
    fontSize: "28px",
    marginBottom: "5px",
  },

  subtitle: {
    opacity: 0.6,
    fontSize: "14px",
  },

  cardRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "15px",
  },

  card: {
    background: "#1f2937",
    padding: "15px",
    borderRadius: "12px",
    flex: 1,
  },

  badgeRow: {
    display: "flex",
    gap: "10px",
    marginTop: "10px",
    flexWrap: "wrap",
  },

  badge: {
    background: "#3b82f6",
    padding: "5px 10px",
    borderRadius: "999px",
    fontSize: "12px",
  },

  gridPlaceholder: {
    marginTop: "10px",
    opacity: 0.5,
    padding: "20px",
    border: "1px dashed #374151",
    borderRadius: "10px",
  },
};