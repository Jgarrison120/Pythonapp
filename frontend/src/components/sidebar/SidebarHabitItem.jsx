function SidebarHabitItem({ habit, isSelected, onSelect }) {
  const completedDays = Object.values(habit.entries || {}).filter((value) => value >= 0.75).length;
  const completionRate = Math.min(Math.round((completedDays / 365) * 100), 100);

  return (
    <button
      type="button"
      className={"habit-item" + (isSelected ? " is-selected" : "")}
      onClick={onSelect}
      aria-current={isSelected ? "true" : undefined}
    >
      <span className="habit-item-top">
        <span className="habit-item-name">{habit.name || "Untitled habit"}</span>
        {(habit.isNew || habit.isDirty) && (
          <span className="draft-label">{habit.isNew ? "New" : "Draft"}</span>
        )}
      </span>
      <span className="habit-item-meta">{completedDays} completed days · {completionRate}% of the year</span>
      <span className="progress-track" aria-hidden="true">
        <span style={{ width: completionRate + "%" }} />
      </span>
    </button>
  );
}

export default SidebarHabitItem;
