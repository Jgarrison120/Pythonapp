function HabitPage({ habit }) {
  return (
    <div style={styles.page}>

      <h1>{habit?.name || "No Habit Selected"}</h1>

      <div style={styles.card}>
        <h3>🎯 Goal</h3>
        <p>{habit?.goal || "No goal set"}</p>
      </div>

      <div style={styles.card}>
        <h3>🔥 Streak</h3>
        <p>{habit?.streak || 0} days</p>
      </div>

      <div style={styles.card}>
        <h3>📊 Progress</h3>
        <p>{habit?.completion || 0}%</p>
      </div>

      <div style={styles.card}>
        <h3>🏅 Badges</h3>
        <p>{habit?.badges?.length ? habit.badges.join(", ") : "None"}</p>
      </div>

    </div>
  );
}

export default HabitPage;

const styles = {
  page: {
    padding: "30px",
    color: "white",
    flex: 1, // 🔥 THIS IS CRITICAL FOR SIDEBAR LAYOUT
  },

  card: {
    background: "#1f2937",
    padding: "15px",
    borderRadius: "12px",
    marginTop: "15px",
  },
};