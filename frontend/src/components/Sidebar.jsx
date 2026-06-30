function Sidebar({
  habits,
  selectedHabitId,
  setSelectedHabitId,
  addHabit,
}) {
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
    <div style={styles.sidebar}>
      <div>
        <h2 style={styles.title}>🧠 Habit Journal</h2>
        <p style={styles.subtitle}>Personal habit dashboard</p>
      </div>

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

      <button style={styles.addButton} onClick={addHabit}>
        + New Habit
      </button>

      <div style={styles.sectionLabel}>Habits</div>

      <div style={styles.list}>
        {habits.map((habit) => {
          const isSelected = habit.id === selectedHabitId;
          const isDraft = habit.isDirty || habit.isNew;

          const entries = habit.entries || {};
          const habitCompletedDays = Object.values(entries).filter(
            (value) => value >= 0.75
          ).length;

          const habitRate = Math.round((habitCompletedDays / 365) * 100);

          return (
            <div
              key={habit.id}
              onClick={() => setSelectedHabitId(habit.id)}
              style={{
                ...styles.item,
                ...(isSelected ? styles.activeItem : {}),
              }}
            >
              <div style={styles.itemTopRow}>
                <span style={styles.habitName}>
                  {habit.name || "Untitled Habit"}
                </span>

                {habit.isNew && <span style={styles.newBadge}>New</span>}

                {!habit.isNew && habit.isDirty && (
                  <span style={styles.draftBadge}>Draft</span>
                )}
              </div>

              <div style={styles.habitMeta}>
                {habitCompletedDays} completed days • {habitRate}%
              </div>

              <div style={styles.smallProgressTrack}>
                <div
                  style={{
                    ...styles.smallProgressFill,
                    width: `${Math.min(habitRate, 100)}%`,
                  }}
                />
              </div>

              {isDraft && <span style={styles.dirtyDot} />}
            </div>
          );
        })}
      </div>

      <div style={styles.footer}>⚙️ Settings</div>
    </div>
  );
}

export default Sidebar;

const styles = {
  sidebar: {
    width: "280px",
    height: "100%",
    background: "#111827",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1f2937",
    flexShrink: 0,
  },

  title: {
    fontSize: "20px",
    marginBottom: "4px",
    fontWeight: "800",
  },

  subtitle: {
    fontSize: "12px",
    color: "#94a3b8",
    marginBottom: "18px",
  },

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

  addButton: {
    background: "#2563eb",
    border: "none",
    color: "white",
    padding: "11px",
    borderRadius: "10px",
    cursor: "pointer",
    marginBottom: "18px",
    fontWeight: "700",
  },

  sectionLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
    marginBottom: "10px",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
    overflowY: "auto",
    paddingRight: "4px",
  },

  item: {
    position: "relative",
    padding: "12px",
    borderRadius: "14px",
    cursor: "pointer",
    transition: "0.2s",
    background: "#0f172a",
    border: "1px solid #1f2937",
  },

  activeItem: {
    background: "#1d4ed8",
    border: "1px solid #3b82f6",
  },

  itemTopRow: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    marginBottom: "6px",
  },

  habitName: {
    fontSize: "14px",
    fontWeight: "700",
    overflow: "hidden",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
  },

  habitMeta: {
    fontSize: "12px",
    color: "#cbd5e1",
    marginBottom: "8px",
  },

  smallProgressTrack: {
    height: "5px",
    background: "rgba(15, 23, 42, .8)",
    borderRadius: "999px",
    overflow: "hidden",
  },

  smallProgressFill: {
    height: "100%",
    background: "#93c5fd",
    borderRadius: "999px",
  },

  newBadge: {
    background: "#16a34a",
    color: "white",
    fontSize: "10px",
    padding: "3px 7px",
    borderRadius: "999px",
    fontWeight: "700",
  },

  draftBadge: {
    background: "#f59e0b",
    color: "#111827",
    fontSize: "10px",
    padding: "3px 7px",
    borderRadius: "999px",
    fontWeight: "700",
  },

  dirtyDot: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#86efac",
  },

  footer: {
    marginTop: "auto",
    opacity: 0.6,
    fontSize: "12px",
    paddingTop: "20px",
  },
};