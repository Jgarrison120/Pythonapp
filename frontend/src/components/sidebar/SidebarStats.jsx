function SidebarStats({ habits }) {
  const draftCount = habits.filter((habit) => habit.isDirty || habit.isNew).length;
  const completedDays = habits.reduce(
    (total, habit) => total + Object.values(habit.entries || {}).filter((value) => value >= 0.75).length,
    0
  );

  return (
    <section className="sidebar-stats" aria-label="Journal overview">
      <h3 className="sidebar-stats-title">Your progress</h3>
      <div className="sidebar-stat"><span>Habits</span><strong>{habits.length}</strong></div>
      <div className="sidebar-stat"><span>Completed days</span><strong>{completedDays}</strong></div>
      <div className="sidebar-stat"><span>Drafts to save</span><strong>{draftCount}</strong></div>
    </section>
  );
}

export default SidebarStats;
