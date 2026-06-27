function Sidebar({
  habits,
  selectedHabitId,
  setSelectedHabitId,
  addHabit,
}) {
  return (
    <aside className="sidebar">

      <h1 className="logo">
        🧠 Habit Journal
      </h1>

      <button
        className="newHabitButton"
        onClick={addHabit}
      >
        + New Habit
      </button>

      <div className="habitList">

        {habits.map((habit) => (

          <button
            key={habit.id}
            className={
              selectedHabitId === habit.id
                ? "habitButton active"
                : "habitButton"
            }
            onClick={() => setSelectedHabitId(habit.id)}
          >
            {habit.name}
          </button>

        ))}

      </div>

      <div className="sidebarFooter">
        ⚙️ Settings
      </div>

    </aside>
  );
}

export default Sidebar;