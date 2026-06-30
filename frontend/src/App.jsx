import { useEffect, useState } from "react";

import Sidebar from "./components/Sidebar";
import HabitPage from "./components/tracker/HabitPage";

const API = "http://127.0.0.1:8000";

function App() {
  const [habits, setHabits] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [deletedHabitIds, setDeletedHabitIds] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);

  useEffect(() => {
    loadHabits();
  }, []);

  const createSnapshot = () => ({
    habits,
    selectedHabitId,
    deletedHabitIds,
    hasUnsavedChanges,
  });

  const restoreSnapshot = (snapshot) => {
    setHabits(snapshot.habits);
    setSelectedHabitId(snapshot.selectedHabitId);
    setDeletedHabitIds(snapshot.deletedHabitIds);
    setHasUnsavedChanges(snapshot.hasUnsavedChanges);
  };

  const pushHistory = () => {
    setUndoStack((prev) => [...prev, createSnapshot()]);
    setRedoStack([]);
  };

  const undo = () => {
    if (undoStack.length === 0) return;

    const previous = undoStack[undoStack.length - 1];

    setRedoStack((prev) => [...prev, createSnapshot()]);
    setUndoStack((prev) => prev.slice(0, -1));

    restoreSnapshot(previous);
  };

  const redo = () => {
    if (redoStack.length === 0) return;

    const next = redoStack[redoStack.length - 1];

    setUndoStack((prev) => [...prev, createSnapshot()]);
    setRedoStack((prev) => prev.slice(0, -1));

    restoreSnapshot(next);
  };

  const loadHabits = async () => {
    const res = await fetch(`${API}/habits`);
    const data = await res.json();

    setHabits(data);

    if (data.length > 0) {
      setSelectedHabitId(data[0].id);
    }

    setDeletedHabitIds([]);
    setHasUnsavedChanges(false);
    setUndoStack([]);
    setRedoStack([]);
  };

  const selectedHabit =
    habits.find((h) => h.id === selectedHabitId) || habits[0];

  const addHabit = () => {
    const name = prompt("Habit name?");
    if (!name || !name.trim()) return;

    const goal = prompt("Goal for this habit?");

    pushHistory();

    const newHabit = {
      id: `temp-${Date.now()}`,
      name: name.trim(),
      goal: goal && goal.trim() ? goal.trim() : "No goal set",
      entries: {},
      isNew: true,
      isDirty: true,
    };

    setHabits((prev) => [...prev, newHabit]);
    setSelectedHabitId(newHabit.id);
    setHasUnsavedChanges(true);
  };

  const updateHabit = (habitId, updates) => {
    pushHistory();

    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              ...updates,
              isDirty: true,
            }
          : habit
      )
    );

    setHasUnsavedChanges(true);
  };

  const updateHabitEntry = (habitId, date, value) => {
    pushHistory();

    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              entries: {
                ...(habit.entries || {}),
                [date]: value,
              },
              dirtyEntries: {
                ...(habit.dirtyEntries || {}),
                [date]: value,
              },
              isDirty: true,
            }
          : habit
      )
    );

    setHasUnsavedChanges(true);
  };

  const deleteHabit = (habitId) => {
    if (habits.length === 1) {
      alert("You must have at least one habit.");
      return;
    }

    if (!window.confirm("Delete this habit?")) return;

    pushHistory();

    const habitToDelete = habits.find((h) => h.id === habitId);

    if (habitToDelete && !habitToDelete.isNew) {
      setDeletedHabitIds((prev) => [...prev, habitId]);
    }

    const updated = habits.filter((h) => h.id !== habitId);

    setHabits(updated);
    setSelectedHabitId(updated[0]?.id ?? null);
    setHasUnsavedChanges(true);
  };

  const saveHabit = async (habitId) => {
  const habit = habits.find((h) => h.id === habitId);
  if (!habit) return;

  let savedHabit = habit;

  if (habit.isNew) {
    const res = await fetch(`${API}/habits`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: habit.name,
        goal: habit.goal,
      }),
    });

    savedHabit = await res.json();
  } else if (habit.isDirty) {
    const res = await fetch(`${API}/habits/${habit.id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: habit.name,
        goal: habit.goal,
      }),
    });

    savedHabit = await res.json();
  }

  const dirtyEntries = habit.dirtyEntries || {};

  for (const [date, value] of Object.entries(dirtyEntries)) {
    const res = await fetch(`${API}/habits/${savedHabit.id}/entries/${date}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ value }),
    });

    savedHabit = await res.json();
  }

  setHabits((prev) =>
    prev.map((h) =>
      h.id === habitId
        ? {
            ...savedHabit,
            isDirty: false,
            isNew: false,
            dirtyEntries: {},
          }
        : h
    )
  );

  if (habit.isNew) {
    setSelectedHabitId(savedHabit.id);
  }

  alert(`${savedHabit.name} saved.`);
};

  const saveAllChanges = async () => {
    for (const habitId of deletedHabitIds) {
      await fetch(`${API}/habits/${habitId}`, {
        method: "DELETE",
      });
    }

    for (const habit of habits) {
      let savedHabit = habit;

      if (habit.isNew) {
        const res = await fetch(`${API}/habits`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: habit.name,
            goal: habit.goal,
          }),
        });

        savedHabit = await res.json();
      } else if (habit.isDirty) {
        const res = await fetch(`${API}/habits/${habit.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name: habit.name,
            goal: habit.goal,
          }),
        });

        savedHabit = await res.json();
      }

      const dirtyEntries = habit.dirtyEntries || {};

      for (const [date, value] of Object.entries(dirtyEntries)) {
        await fetch(`${API}/habits/${savedHabit.id}/entries/${date}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ value }),
        });
      }
    }

    await loadHabits();
    alert("All changes saved.");
  };

  return (
    <div style={styles.shell}>
      <div style={styles.topBar}>
        <div>
          <strong>Habit Tracker</strong>
          {hasUnsavedChanges && (
            <span style={styles.unsavedText}> Unsaved changes</span>
          )}
        </div>

        <div style={styles.actions}>
          <button
            style={{
              ...styles.secondaryButton,
              opacity: undoStack.length > 0 ? 1 : 0.5,
            }}
            onClick={undo}
            disabled={undoStack.length === 0}
          >
            ↩ Undo
          </button>

          <button
            style={{
              ...styles.secondaryButton,
              opacity: redoStack.length > 0 ? 1 : 0.5,
            }}
            onClick={redo}
            disabled={redoStack.length === 0}
          >
            ↪ Redo
          </button>

          <button
            style={{
              ...styles.saveButton,
              opacity: hasUnsavedChanges ? 1 : 0.5,
            }}
            onClick={saveAllChanges}
            disabled={!hasUnsavedChanges}
          >
            💾 Save All Changes
          </button>
        </div>
      </div>

      <div className="app" style={styles.main}>
        <Sidebar
          habits={habits}
          selectedHabitId={selectedHabitId}
          setSelectedHabitId={setSelectedHabitId}
          addHabit={addHabit}
        />

        {selectedHabit ? (
          <HabitPage
          key={selectedHabit.id}
          habit={selectedHabit}
          updateHabit={updateHabit}
          deleteHabit={deleteHabit}
          updateHabitEntry={updateHabitEntry}
          saveHabit={saveHabit}
       />
        ) : (
          <div style={{ color: "white", padding: 20 }}>
            Loading habits...
          </div>
        )}
      </div>
    </div>
  );
}

export default App;

const styles = {
  shell: {
    minHeight: "100vh",
    background: "#0f172a",
  },

  topBar: {
    height: "56px",
    background: "#020617",
    color: "white",
    borderBottom: "1px solid #1f2937",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    padding: "0 20px",
  },

  main: {
    height: "calc(100vh - 56px)",
  },

  actions: {
    display: "flex",
    gap: "8px",
    alignItems: "center",
  },

  unsavedText: {
    color: "#86efac",
    marginLeft: "10px",
    fontSize: "13px",
  },

  secondaryButton: {
    background: "#1f2937",
    color: "white",
    border: "1px solid #374151",
    padding: "9px 12px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },

  saveButton: {
    background: "#16a34a",
    color: "white",
    border: "none",
    padding: "9px 14px",
    borderRadius: "8px",
    cursor: "pointer",
    fontWeight: "600",
  },
};