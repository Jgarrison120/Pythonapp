import { useEffect, useRef, useState } from "react";

function CreateHabitModal({ onCreate, close }) {
  const [name, setName] = useState("");
  const [goal, setGoal] = useState("");
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
    onCreate({ name: name.trim(), goal: goal.trim() });
  };

  return (
    <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div
        ref={dialogRef}
        className="create-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="create-habit-title"
        aria-describedby="create-habit-description"
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">A fresh start</span>
            <h2 id="create-habit-title">Create a new habit</h2>
          </div>
          <button type="button" className="close-button" aria-label="Close new habit" onClick={close}>×</button>
        </div>
        <p id="create-habit-description" className="create-modal-intro">
          Give your habit a name and a goal. You can edit both later.
        </p>
        <form onSubmit={submit} noValidate>
          <label className="form-label create-field-label" htmlFor="new-habit-name">
            Name <span>Required</span>
          </label>
          <input
            ref={nameRef}
            id="new-habit-name"
            className="form-input"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setErrors((previous) => ({ ...previous, name: "" }));
            }}
            placeholder="e.g. Read before bed"
            required
            aria-invalid={Boolean(errors.name)}
            aria-describedby={errors.name ? "new-habit-name-error" : undefined}
          />
          {errors.name && <p id="new-habit-name-error" className="create-field-error" role="alert">{errors.name}</p>}

          <label className="form-label create-field-label" htmlFor="new-habit-goal">
            Goals <span>Required</span>
          </label>
          <textarea
            id="new-habit-goal"
            className="form-input create-goal-input"
            value={goal}
            onChange={(event) => {
              setGoal(event.target.value);
              setErrors((previous) => ({ ...previous, goal: "" }));
            }}
            placeholder="e.g. Read for 20 minutes each evening"
            required
            aria-invalid={Boolean(errors.goal)}
            aria-describedby={errors.goal ? "new-habit-goal-error" : undefined}
          />
          {errors.goal && <p id="new-habit-goal-error" className="create-field-error" role="alert">{errors.goal}</p>}

          <div className="create-modal-actions">
            <button type="button" className="button button-secondary" onClick={close}>Cancel</button>
            <button type="submit" className="button button-primary">Create habit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateHabitModal;
