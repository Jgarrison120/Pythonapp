import SidebarHabitItem from "./SidebarHabitItem";

function SidebarHabitList({
  habits,
  selectedHabitId,
  setSelectedHabitId,
}) {
  return (
    <div style={styles.list}>
      {habits.map((habit) => (
        <SidebarHabitItem
          key={habit.id}
          habit={habit}
          isSelected={habit.id === selectedHabitId}
          onSelect={() => setSelectedHabitId(habit.id)}
        />
      ))}
    </div>
  );
}

export default SidebarHabitList;

const styles = {
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
    flex: 1,
    overflowY: "auto",
    paddingRight: "4px",
  },
};