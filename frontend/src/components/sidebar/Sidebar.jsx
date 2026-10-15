import SidebarStats from "./SidebarStats";
import SidebarHabitList from "./SidebarHabitList";
import SidebarFooter from "./SidebarFooter";

function Sidebar({ habits, selectedHabitId, setSelectedHabitId, openSettings, addHabit, editHabit, saveHabit, deleteHabit, saving }) {
  return (
    <aside className="habit-sidebar" aria-label="Your habits">
      <div className="sidebar-heading">
        <div>
          <h2>Your habits</h2>
          <p>Pick one to see your progress</p>
        </div>
        <span className="sidebar-count">{habits.length}</span>
      </div>

      <button className="button button-primary button-wide" onClick={addHabit}>
        + Add a habit
      </button>

      <SidebarHabitList
        habits={habits}
        selectedHabitId={selectedHabitId}
        setSelectedHabitId={setSelectedHabitId}
        editHabit={editHabit}
        saveHabit={saveHabit}
        deleteHabit={deleteHabit}
        saving={saving}
      />
      <SidebarStats habits={habits} />
      <SidebarFooter openSettings={openSettings} />
    </aside>
  );
}

export default Sidebar;
