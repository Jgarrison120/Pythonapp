import SidebarHabitItem from "./SidebarHabitItem";

function SidebarHabitList({ habits, selectedHabitId, setSelectedHabitId, editHabit, saveHabit, deleteHabit, saving }) {
  return (
    <nav className="habit-list" aria-label="Habits">
      {habits.length === 0 ? (
        <div className="sidebar-empty">Your first habit starts here. Add one whenever you are ready.</div>
      ) : (
        habits.map((habit) => (
          <SidebarHabitItem
            key={habit.id}
            habit={habit}
            isSelected={habit.id === selectedHabitId}
            onSelect={() => setSelectedHabitId(habit.id)}
            onEdit={() => editHabit(habit.id)}
            onSave={() => saveHabit(habit.id)}
            onDelete={() => deleteHabit(habit.id)}
            saving={saving}
          />
        ))
      )}
    </nav>
  );
}

export default SidebarHabitList;
