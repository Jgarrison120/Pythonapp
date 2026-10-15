import { useEffect, useRef, useState } from "react";

function CreateJournalModal({ onCreate, close }) {
  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  const [submitError, setSubmitError] = useState("");
  const [saving, setSaving] = useState(false);
  const nameRef = useRef(null);
  const dialogRef = useRef(null);

  useEffect(() => {
    const previousFocus = document.activeElement;
    nameRef.current?.focus();
    return () => previousFocus?.focus();
  }, []);

  const dismiss = () => {
    if (!saving) close();
  };

  const handleKeyDown = (event) => {
    if (event.key === "Escape") {
      dismiss();
      return;
    }
    if (event.key !== "Tab") return;

    const focusable = [...dialogRef.current.querySelectorAll("button:not(:disabled), input:not(:disabled)")];
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

  const submit = async (event) => {
    event.preventDefault();
    const trimmedName = name.trim();
    if (!trimmedName) {
      setNameError("Please add a name for your journal.");
      nameRef.current?.focus();
      return;
    }

    setNameError("");
    setSubmitError("");
    setSaving(true);
    try {
      await onCreate(trimmedName);
    } catch (creationError) {
      setSubmitError(creationError.message || "Could not create journal. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) dismiss(); }}>
      <div
        ref={dialogRef}
        className="create-modal create-journal-modal"
        role="dialog"
        aria-modal="true"
        aria-busy={saving}
        aria-labelledby="create-journal-title"
        aria-describedby="create-journal-description"
        onKeyDown={handleKeyDown}
      >
        <div className="modal-header">
          <div>
            <span className="eyebrow">A new space</span>
            <h2 id="create-journal-title">Create a new journal</h2>
          </div>
          <button type="button" className="close-button" aria-label="Close new journal" onClick={dismiss} disabled={saving}>×</button>
        </div>
        <p id="create-journal-description" className="create-modal-intro">
          Keep related habits together in their own space.
        </p>
        {submitError && <div className="form-error" role="alert">{submitError}</div>}
        <form onSubmit={submit} noValidate>
          <label className="form-label create-field-label" htmlFor="new-journal-name">
            Name <span>Required</span>
          </label>
          <input
            ref={nameRef}
            id="new-journal-name"
            className="form-input"
            value={name}
            onChange={(event) => {
              setName(event.target.value);
              setNameError("");
              setSubmitError("");
            }}
            placeholder="e.g. Morning routine"
            required
            aria-invalid={Boolean(nameError)}
            aria-describedby={nameError ? "new-journal-name-error" : undefined}
            readOnly={saving}
          />
          {nameError && <p id="new-journal-name-error" className="create-field-error" role="alert">{nameError}</p>}
          <div className="create-modal-actions">
            <button type="button" className="button button-secondary" onClick={dismiss} disabled={saving}>Cancel</button>
            <button type="submit" className="button button-primary" disabled={saving}>
              {saving ? "Creating…" : "Create journal"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateJournalModal;
