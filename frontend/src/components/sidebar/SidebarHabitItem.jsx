function SidebarHabitItem({
  habit,
  isSelected,
  onSelect,
}) {
  const isDraft = habit.isDirty || habit.isNew;

  const entries = habit.entries || {};

  const completedDays = Object.values(entries).filter(
    (value) => value >= 0.75
  ).length;

  const completionRate = Math.round(
    (completedDays / 365) * 100
  );

  return (
    <div
      onClick={onSelect}
      style={{
        ...styles.item,
        ...(isSelected ? styles.activeItem : {}),
      }}
    >
      <div style={styles.itemTopRow}>
        <span style={styles.habitName}>
          {habit.name || "Untitled Habit"}
        </span>

        {habit.isNew && (
          <span style={styles.newBadge}>
            New
          </span>
        )}

        {!habit.isNew && habit.isDirty && (
          <span style={styles.draftBadge}>
            Draft
          </span>
        )}
      </div>

      <div style={styles.habitMeta}>
        {completedDays} completed days • {completionRate}%
      </div>

      <div style={styles.progressTrack}>
        <div
          style={{
            ...styles.progressFill,
            width: `${Math.min(completionRate, 100)}%`,
          }}
        />
      </div>

      {isDraft && (
        <span style={styles.dirtyDot} />
      )}
    </div>
  );
}

export default SidebarHabitItem;

const styles = {
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
    boxShadow: "0 6px 18px rgba(37,99,235,.35)",
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
    flex: 1,
  },

  habitMeta: {
    fontSize: "12px",
    color: "#cbd5e1",
    marginBottom: "8px",
  },

  progressTrack: {
    height: "5px",
    background: "#1f2937",
    borderRadius: "999px",
    overflow: "hidden",
  },

  progressFill: {
    height: "100%",
    background: "#60a5fa",
    borderRadius: "999px",
    transition: "width .25s ease",
  },

  newBadge: {
    background: "#16a34a",
    color: "white",
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "999px",
  },

  draftBadge: {
    background: "#f59e0b",
    color: "#111827",
    fontSize: "10px",
    fontWeight: "700",
    padding: "3px 8px",
    borderRadius: "999px",
  },

  dirtyDot: {
    position: "absolute",
    top: "8px",
    right: "8px",
    width: "7px",
    height: "7px",
    borderRadius: "50%",
    background: "#86efac",
    boxShadow: "0 0 8px rgba(134,239,172,.8)",
  },
};