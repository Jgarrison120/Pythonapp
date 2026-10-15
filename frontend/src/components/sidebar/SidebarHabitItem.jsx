function SidebarHabitItem({ habit, isSelected, onSelect, onEdit, onSave, onDelete, saving }) {
  const displayName = habit.name || "Untitled habit";
  const completedDays = Object.values(habit.entries || {}).filter((value) => value >= 0.75).length;
  const completionRate = Math.min(Math.round((completedDays / 365) * 100), 100);

  return (
    <div className={"habit-item" + (isSelected ? " is-selected" : "")}>
      <div className="habit-item-actions">
        <button type="button" className="habit-item-action" onClick={onEdit} disabled={saving} aria-label={`Edit ${displayName}`}>Edit</button>
        <button type="button" className="habit-item-action habit-item-save" onClick={onSave} disabled={saving || (!habit.isDirty && !habit.isNew)} aria-label={`Save ${displayName}`}>{saving ? "Saving…" : "Save"}</button>
        <button type="button" className="habit-item-action habit-item-delete" onClick={onDelete} disabled={saving} aria-label={`Delete ${displayName}`}>Delete</button>
      </div>
      <button
        type="button"
        className="habit-item-select"
        onClick={onSelect}
        aria-current={isSelected ? "true" : undefined}
        aria-label={`View ${displayName}`}
      >
        <span className="habit-item-top">
          <span className="habit-item-name">{displayName}</span>
          {(habit.isNew || habit.isDirty) && (
            <span className="draft-label">{habit.isNew ? "New" : "Draft"}</span>
          )}
        </span>
        <span className="habit-item-meta">{completedDays} completed days · {completionRate}% of the year</span>
        <span className="progress-track" aria-hidden="true">
          <span style={{ width: completionRate + "%" }} />
        </span>
      </button>
    </div>
  );
}

export default SidebarHabitItem;
