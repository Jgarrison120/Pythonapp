function Sidebar({
  habits,
  selectedHabitId,
  setSelectedHabitId,
  addHabit,
}) {
  return (
    <div style={styles.sidebar}>

      {/* TITLE */}
      <h2 style={styles.title}>🧠 Habit Journal</h2>

      {/* ADD BUTTON */}
      <button style={styles.addButton} onClick={addHabit}>
        + New Habit
      </button>

      {/* LIST */}
      <div style={styles.list}>
        {habits.map((habit) => (
          <div
            key={habit.id}
            onClick={() => setSelectedHabitId(habit.id)}
            style={{
              ...styles.item,
              background:
                habit.id === selectedHabitId
                  ? "#2563eb"
                  : "transparent",
            }}
          >
            {habit.name}
          </div>
        ))}
      </div>

      {/* FOOTER */}
      <div style={styles.footer}>
        ⚙️ Settings
      </div>

    </div>
  );
}

export default Sidebar;

const styles = {
  sidebar: {
    width: "260px",
    height: "100vh",
    background: "#111827",
    color: "white",
    padding: "20px",
    display: "flex",
    flexDirection: "column",
    borderRight: "1px solid #1f2937",
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
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
  },

  item: {
    padding: "10px",
    borderRadius: "8px",
    cursor: "pointer",
    transition: "0.2s",
  },

  footer: {
    marginTop: "auto",
    opacity: 0.6,
    fontSize: "12px",
  },
};