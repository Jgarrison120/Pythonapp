import { useEffect, useRef, useState } from "react";

function CreateHabitModal({ habit, onSubmit, close }) {
  const isEditing = Boolean(habit);
  const nameId = isEditing ? "edit-habit-name" : "new-habit-name";
  const goalId = isEditing ? "edit-habit-goal" : "new-habit-goal";
  const [name, setName] = useState(habit?.name ?? "");
  const [goal, setGoal] = useState(habit?.goal ?? "");
  const [errors, setErrors] = useState({});
  const nameRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    nameRef.current?.focus();
    return () => previousFocus?.focus();
  }, []);

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      close();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...dialogRef.current.querySelectorAll("button, input, textarea")];
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  const submit = (event) => {
    event.preventDefault();
    const nextErrors = {};
    if (!name.trim()) nextErrors.name = "Please add a name for your habit.";
    if (!goal.trim()) nextErrors.goal = "Please add a goal for your habit.";
    setErrors(nextErrors);
    if (Object.keys(nextErrors).length) return;
    onSubmit({ name: name.trim(), goal: goal.trim() });
  };

  return (
    <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div
        ref={dialogRef}
        className={"create-modal" + (isEditing ? " edit-habit-modal" : "")}
        role="dialog"
        aria-modal="true"
        aria-labelledby="habit-modal-title"
        aria-describedby="habit-modal-description"
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">{isEditing ? "Your habit" : "A fresh start"}</span>
            <h2 id="habit-modal-title">{isEditing ? "Edit habit" : "Create a new habit"}</h2>
          </div>
          <button type="button" className="close-button" aria-label={isEditing ? "Close edit habit" : "Close new habit"} onClick={close}>×</button>
        </div>
        <p id="habit-modal-description" className="create-modal-intro">
          {isEditing ? "Update your name or goal, then save the habit from its card." : "Give your habit a name and a goal. You can edit both later."}
        </p>
        <form onSubmit={submit} noValidate>
          <label className="form-label create-field-label" htmlFor={nameId}>
            Name <span>Required</span>
          </label>
          <input
            ref={nameRef}
            id={nameId}
            className="form-input"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((previous) => ({ ...previous, name: "" }));
            }}
            placeholder="e.g. Read before bed"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? `${nameId}-error` : undefined}
          />
          {errors.name && <p id={`${nameId}-error`} className="create-field-error" role="alert">{errors.name}</p>}

          <label className="form-label create-field-label" htmlFor={goalId}>
            Goals <span>Required</span>
          </label>
          <textarea
            id={goalId}
            className="form-input create-goal-input"
            value={goal}
            onChange={(event) => {
              setGoal(event.target.value);
              setErrors((previous) => ({ ...previous, goal: "" }));
            }}
            placeholder="e.g. Read for 20 minutes each evening"
            required
            aria-invalid={Boolean(errors.goal)}
            aria-describedby={errors.goal ? `${goalId}-error` : undefined}
          />
          {errors.goal && <p id={`${goalId}-error`} className="create-field-error" role="alert">{errors.goal}</p>}

          <div className="create-modal-actions">
            <button type="button" className="button button-secondary" onClick={close}>Cancel</button>
            <button type="submit" className="button button-primary">{isEditing ? "Apply changes" : "Create habit"}</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateHabitModal;
