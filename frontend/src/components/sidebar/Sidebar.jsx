import SidebarStats from "./SidebarStats";
import SidebarHabitList from "./SidebarHabitList";
import SidebarFooter from "./SidebarFooter";

function Sidebar({
  habits,
  selectedHabitId,
  setSelectedHabitId,
  openSettings,
}) {
  return (
    <div style={styles.sidebar}>
      <div>
        <h2 style={styles.title}>🧠 Habit Journal</h2>
        <p style={styles.subtitle}>Personal habit dashboard</p>
      </div>

      <SidebarStats habits={habits} />

      <div style={styles.sectionLabel}>Habits</div>

      <SidebarHabitList
        habits={habits}
        selectedHabitId={selectedHabitId}
        setSelectedHabitId={setSelectedHabitId}
      />

      <SidebarFooter openSettings={openSettings} />
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

  sectionLabel: {
    fontSize: "11px",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    color: "#64748b",
    marginBottom: "10px",
  },
};