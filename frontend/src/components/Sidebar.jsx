function Sidebar({
  habits,
  selectedHabitId,
  setSelectedHabitId,
  addHabit,
}) {
  return (
    <div style={styles.sidebar}>
      <h2 style={styles.title}>🧠 Habit Journal</h2>

      <button style={styles.addButton} onClick={addHabit}>
        + New Habit
      </button>

      <div style={styles.list}>
        {habits.map((habit) => {
          const isSelected = habit.id === selectedHabitId;
          const isDraft = habit.isDirty || habit.isNew;

          return (
            <div
              key={habit.id}
              onClick={() => setSelectedHabitId(habit.id)}
              style={{
                ...styles.item,
                ...(isSelected ? styles.activeItem : {}),
              }}
            >
              <div style={styles.itemText}>
                <span>{habit.name || "Untitled Habit"}</span>

                {habit.isNew && (
                  <span style={styles.newBadge}>New</span>
                )}

                {!habit.isNew && habit.isDirty && (
                  <span style={styles.draftBadge}>Draft</span>
                )}
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
    width: "260px",
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
    marginBottom: "20px",
    fontWeight: "bold",
  },

  addButton: {
    background: "#2563eb",
    border: "none",
    color: "white",
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    marginBottom: "20px",
    fontWeight: "600",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
    overflowY: "auto",
  },

  item: {
    position: "relative",
    padding: "12px",
    borderRadius: "10px",
    cursor: "pointer",
    transition: "0.2s",
    background: "transparent",
    border: "1px solid transparent",
  },

  activeItem: {
    background: "#2563eb",
    border: "1px solid #3b82f6",
  },

  itemText: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "8px",
    fontSize: "14px",
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