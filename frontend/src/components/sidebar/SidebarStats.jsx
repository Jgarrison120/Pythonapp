function SidebarStats({ habits }) {
  const totalHabits = habits.length;

  const draftCount = habits.filter(
    (habit) => habit.isDirty || habit.isNew
  ).length;

  const completedDays = habits.reduce((total, habit) => {
    const entries = habit.entries || {};

    return (
      total +
      Object.values(entries).filter((value) => value >= 0.75).length
    );
  }, 0);

  const yearlyGoal = Math.max(totalHabits * 365, 1);
  const completionRate = Math.round((completedDays / yearlyGoal) * 100);

  return (
    <div style={styles.statsPanel}>
      <div style={styles.statRow}>
        <span>Total Habits</span>
        <strong>{totalHabits}</strong>
      </div>

      <div style={styles.statRow}>
        <span>Drafts</span>
        <strong>{draftCount}</strong>
      </div>

      <div style={styles.statRow}>
        <span>Completed Days</span>
        <strong>{completedDays}</strong>
      </div>

      <div style={styles.progressBlock}>
        <div style={styles.statRow}>
          <span>Year Progress</span>
          <strong>{completionRate}%</strong>
        </div>

        <div style={styles.progressTrack}>
          <div
            style={{
              ...styles.progressFill,
              width: `${Math.min(completionRate, 100)}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}

export default SidebarStats;

const styles = {
  statsPanel: {
    background: "#020617",
    border: "1px solid #1f2937",
    borderRadius: "16px",
    padding: "14px",
    marginBottom: "18px",
    boxShadow: "0 12px 30px rgba(0,0,0,.22)",
  },

  statRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    fontSize: "13px",
    color: "#cbd5e1",
    marginBottom: "10px",
  },

  progressBlock: {
    marginTop: "6px",
  },

  progressTrack: {
    height: "8px",
    background: "#1f2937",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#2563eb",
    borderRadius: "999px",
  },
};