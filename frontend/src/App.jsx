import { useState } from "react";

import AuthPage from "./components/AuthPage";
import Sidebar from "./components/sidebar/Sidebar";
import HabitPage from "./components/tracker/HabitPage";
import CreateHabitModal from "./components/tracker/CreateHabitModal";
import CreateJournalModal from "./components/CreateJournalModal";
import AccountSettingsModal from "./components/settings/AccountSettingsModal";

const API = "http://127.0.0.1:8000";

async function request(path, options) {
  const response = await fetch(API + path, options);
  const data = await response.json();
  if (!response.ok) throw new Error(data.detail || "That did not work. Please try again.");
  return data;
}

function App() {
  const [currentUser, setCurrentUser] = useState(null);
  const [journals, setJournals] = useState([]);
  const [selectedJournalId, setSelectedJournalId] = useState(null);
  const [habits, setHabits] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState(null);
  const [deletedHabitIds, setDeletedHabitIds] = useState([]);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [undoStack, setUndoStack] = useState([]);
  const [redoStack, setRedoStack] = useState([]);
  const [showSettings, setShowSettings] = useState(false);
  const [showCreateHabit, setShowCreateHabit] = useState(false);
  const [editingHabitId, setEditingHabitId] = useState(null);
  const [showCreateJournal, setShowCreateJournal] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState("");

  const selectedHabit = habits.find((habit) => habit.id === selectedHabitId) || habits[0];
  const editingHabit = habits.find((habit) => habit.id === editingHabitId);
  const selectedJournal = journals.find((journal) => journal.id === selectedJournalId);

  const snapshot = () => ({ habits, selectedHabitId, deletedHabitIds, hasUnsavedChanges });
  const restoreSnapshot = (state) => {
    setHabits(state.habits);
    setSelectedHabitId(state.selectedHabitId);
    setDeletedHabitIds(state.deletedHabitIds);
    setHasUnsavedChanges(state.hasUnsavedChanges);
  };
  const pushHistory = () => {
    setUndoStack((previous) => [...previous, snapshot()]);
    setRedoStack([]);
  };
  const undo = () => {
    if (!undoStack.length) return;
    setRedoStack((previous) => [...previous, snapshot()]);
    restoreSnapshot(undoStack[undoStack.length - 1]);
    setUndoStack((previous) => previous.slice(0, -1));
  };
  const redo = () => {
    if (!redoStack.length) return;
    setUndoStack((previous) => [...previous, snapshot()]);
    restoreSnapshot(redoStack[redoStack.length - 1]);
    setRedoStack((previous) => previous.slice(0, -1));
  };
  const resetDraftState = () => {
    setDeletedHabitIds([]);
    setHasUnsavedChanges(false);
    setUndoStack([]);
    setRedoStack([]);
  };

  const loadHabits = async (journalId) => {
    const data = await request("/journals/" + journalId + "/habits");
    setHabits(data);
    setSelectedHabitId(data[0]?.id ?? null);
    resetDraftState();
  };

  const handleLogin = async (user) => {
    const userJournals = await request("/users/" + user.id + "/journals");
    const firstJournal = userJournals[0];
    const firstHabits = firstJournal
      ? await request("/journals/" + firstJournal.id + "/habits")
      : [];
    setCurrentUser(user);
    setJournals(userJournals);
    setSelectedJournalId(firstJournal?.id ?? null);
    setHabits(firstHabits);
    setSelectedHabitId(firstHabits[0]?.id ?? null);
    resetDraftState();
  };

  const switchJournal = async (journalId) => {
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Switch journals anyway?")) return;
    try {
      await loadHabits(Number(journalId));
      setSelectedJournalId(Number(journalId));
      setNotice("");
    } catch (error) {
      setNotice(error.message);
    }
  };

  const addJournal = () => setShowCreateJournal(true);

  const createJournal = async (name) => {
    if (!currentUser) return;
    if (hasUnsavedChanges && !window.confirm("You have unsaved changes. Create a new journal anyway?")) return;

    const newJournal = await request("/journals", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ user_id: currentUser.id, name: name.trim() }),
    });
    setJournals((previous) => [...previous, newJournal]);
    setSelectedJournalId(newJournal.id);
    setHabits([]);
    setSelectedHabitId(null);
    resetDraftState();
    setNotice("Your new journal is ready.");
    setShowCreateJournal(false);
  };

  const deleteJournal = async () => {
    if (!selectedJournalId) return;
    if (journals.length <= 1) {
      setNotice("Keep at least one journal so you have a place for your habits.");
      return;
    }
    if (!window.confirm('Delete "' + selectedJournal?.name + '" and all habits inside it?')) return;
    try {
      await request("/journals/" + selectedJournalId, { method: "DELETE" });
      const remaining = journals.filter((journal) => journal.id !== selectedJournalId);
      const nextJournal = remaining[0];
      await loadHabits(nextJournal.id);
      setJournals(remaining);
      setSelectedJournalId(nextJournal.id);
      setNotice("Journal deleted.");
    } catch (error) {
      setNotice(error.message);
    }
  };

  const addHabit = () => {
    setShowCreateHabit(true);
  };

  const createHabit = ({ name, goal }) => {
    pushHistory();
    const newHabit = {
      id: "temp-" + Date.now(),
      journal_id: selectedJournalId,
      name: name.trim(),
      goal: goal.trim(),
      entries: {},
      isNew: true,
      isDirty: true,
    };
    setHabits((previous) => [...previous, newHabit]);
    setSelectedHabitId(newHabit.id);
    setHasUnsavedChanges(true);
    setNotice("");
    setShowCreateHabit(false);
  };

  const updateHabit = (habitId, updates) => {
    pushHistory();
    setHabits((previous) => previous.map((habit) =>
      habit.id === habitId ? { ...habit, ...updates, isDirty: true } : habit
    ));
    setHasUnsavedChanges(true);
  };

  const applyHabitEdits = ({ name, goal }) => {
    if (!editingHabit) return;
    if (name !== editingHabit.name || goal !== editingHabit.goal) {
      updateHabit(editingHabit.id, { name, goal });
    }
    setEditingHabitId(null);
  };

  const updateHabitEntry = (habitId, date, value) => {
    pushHistory();
    setHabits((previous) => previous.map((habit) =>
      habit.id === habitId
        ? {
            ...habit,
            entries: { ...(habit.entries || {}), [date]: value },
            dirtyEntries: { ...(habit.dirtyEntries || {}), [date]: value },
            isDirty: true,
          }
        : habit
    ));
    setHasUnsavedChanges(true);
  };

  const deleteHabit = (habitId) => {
    if (habits.length === 1) {
      setNotice("Keep at least one habit in this journal.");
      return;
    }
    const habit = habits.find((item) => item.id === habitId);
    if (!window.confirm(`Delete "${habit?.name || "this habit"}"?`)) return;
    pushHistory();
    if (habit && !habit.isNew) setDeletedHabitIds((previous) => [...previous, habitId]);
    const remaining = habits.filter((item) => item.id !== habitId);
    setHabits(remaining);
    setSelectedHabitId((current) => current === habitId ? remaining[0]?.id ?? null : current);
    setHasUnsavedChanges(true);
    setNotice("");
  };

  const persistHabit = async (habit) => {
    let savedHabit = habit;
    if (habit.isNew) {
      savedHabit = await request("/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ journal_id: selectedJournalId, name: habit.name, goal: habit.goal }),
      });
    } else if (habit.isDirty) {
      savedHabit = await request("/habits/" + habit.id, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: habit.name, goal: habit.goal }),
      });
    }
    for (const [date, value] of Object.entries(habit.dirtyEntries || {})) {
      savedHabit = await request("/habits/" + savedHabit.id + "/entries/" + date, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ value }),
      });
    }
    return savedHabit;
  };

  const saveHabit = async (habitId) => {
    const habit = habits.find((item) => item.id === habitId);
    if (!habit || isSaving) return;
    setIsSaving(true);
    try {
      const savedHabit = await persistHabit(habit);
      setHabits((previous) => previous.map((item) => item.id === habitId ? savedHabit : item));
      setSelectedHabitId((current) => current === habitId ? savedHabit.id : current);
      setHasUnsavedChanges(
        deletedHabitIds.length > 0 || habits.some((item) => item.id !== habitId && (item.isDirty || item.isNew))
      );
      setUndoStack([]);
      setRedoStack([]);
      setNotice(savedHabit.name + " saved.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const saveAllChanges = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      for (const habitId of deletedHabitIds) {
        await request("/habits/" + habitId, { method: "DELETE" });
      }
      for (const habit of habits) {
        if (habit.isDirty || habit.isNew) await persistHabit(habit);
      }
      await loadHabits(selectedJournalId);
      setNotice("All changes saved. Nice work.");
    } catch (error) {
      setNotice(error.message);
    } finally {
      setIsSaving(false);
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setJournals([]);
    setSelectedJournalId(null);
    setHabits([]);
    setSelectedHabitId(null);
    setShowSettings(false);
    setShowCreateHabit(false);
    setEditingHabitId(null);
    setShowCreateJournal(false);
    setNotice("");
    resetDraftState();
  };

  if (!currentUser) return <AuthPage onLogin={handleLogin} />;

  const now = new Date();
  const todayKey = now.getFullYear() + "-" + String(now.getMonth() + 1).padStart(2, "0") + "-" + String(now.getDate()).padStart(2, "0");
  const completedToday = habits.filter((habit) => (habit.entries?.[todayKey] || 0) >= 0.75).length;
  const todayRate = habits.length ? Math.round((completedToday / habits.length) * 100) : 0;
  const hour = now.getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const todayLabel = new Intl.DateTimeFormat("en", { weekday: "long", month: "long", day: "numeric" }).format(now);

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Skip to content</a>
      <header className="topbar">
        <div className="topbar-inner">
          <div className="brand">
            <img className="brand-mark" src="/favicon.svg" alt="" />
            <span><span className="brand-name">hamster wheel</span><span className="brand-subtitle">Keep your momentum</span></span>
          </div>
          <div className="topbar-actions">
            <span className="avatar" aria-hidden="true">{currentUser.username?.charAt(0).toUpperCase()}</span>
            <span className="account-name">{currentUser.username}</span>
            <span className="topbar-separator" aria-hidden="true" />
            <button className="button button-quiet" onClick={() => setShowSettings(true)}>Settings</button>
            <button className="button button-secondary" onClick={logout}>Log out</button>
          </div>
        </div>
      </header>

      <main id="main-content" className="dashboard-wrap">
        <section className="hero-band" aria-label="Today's overview">
          <div className="hero-copy">
            <span className="eyebrow">Your daily space</span>
            <h1 data-testid="habit-tracker-title">{greeting}, {currentUser.username}.</h1>
            <p>Small steps count. Take a look at where you are, then choose what you want to do today.</p>
          </div>
          <div className="today-card">
            <div>
              <span className="eyebrow">Today's check-ins</span>
              <div className="today-number">{completedToday}<small> / {habits.length}</small></div>
              <p>{habits.length ? "habits completed today" : "Add a habit to get started"}</p>
            </div>
            <div>
              <div className="today-track" aria-label={todayRate + "% of habits completed today"}>
                <span style={{ width: todayRate + "%" }} />
              </div>
              <div className="today-date">{todayLabel}</div>
            </div>
          </div>
        </section>

        <div className="workspace-toolbar">
          <div className="journal-group">
            <div className="journal-field">
              <label className="field-label" htmlFor="journal-select">Current journal</label>
              <select
                id="journal-select"
                className="journal-select"
                value={selectedJournalId || ""}
                onChange={(event) => switchJournal(event.target.value)}
              >
                {journals.map((journal) => <option key={journal.id} value={journal.id}>{journal.name}</option>)}
              </select>
            </div>
            {habits.length > 0 && (
              <div className="mobile-habit-field">
                <label className="field-label" htmlFor="mobile-habit-select">Focus habit</label>
                <select
                  id="mobile-habit-select"
                  className="journal-select"
                  value={selectedHabit?.id ?? ""}
                  onChange={(event) => setSelectedHabitId(habits.find((habit) => String(habit.id) === event.target.value)?.id ?? null)}
                >
                  {habits.map((habit) => <option key={habit.id} value={habit.id}>{habit.name}</option>)}
                </select>
              </div>
            )}
            <button className="button button-secondary" onClick={addJournal}>+ New journal</button>
            <button className="button button-quiet" onClick={deleteJournal} disabled={journals.length <= 1}>Delete journal</button>
          </div>
          <div className="toolbar-actions">
            <span className={"save-status" + (hasUnsavedChanges ? " is-dirty" : "")}>
              {hasUnsavedChanges ? "Changes waiting to be saved" : "Everything is up to date"}
            </span>
            <button className="button button-secondary" onClick={undo} disabled={!undoStack.length || isSaving}>Undo</button>
            <button className="button button-secondary" onClick={redo} disabled={!redoStack.length || isSaving}>Redo</button>
            <button className="button button-primary" onClick={saveAllChanges} disabled={!hasUnsavedChanges || isSaving}>
              {isSaving ? "Saving…" : "Save all changes"}
            </button>
          </div>
        </div>

        {notice && <div className="app-notice" role="status">{notice}<button onClick={() => setNotice("")} aria-label="Dismiss message">×</button></div>}

        <div className="workspace-grid">
          <Sidebar
            habits={habits}
            selectedHabitId={selectedHabitId}
            setSelectedHabitId={setSelectedHabitId}
            openSettings={() => setShowSettings(true)}
            addHabit={addHabit}
            editHabit={setEditingHabitId}
            saveHabit={saveHabit}
            deleteHabit={deleteHabit}
            saving={isSaving}
          />
          {selectedHabit ? (
            <HabitPage
              key={selectedHabit.id}
              habit={selectedHabit}
              updateHabitEntry={updateHabitEntry}
            />
          ) : (
            <section className="empty-detail">
              <span className="empty-orbit" aria-hidden="true" />
              <span className="eyebrow">A fresh start</span>
              <h2>Your first habit starts here.</h2>
              <p>Give it a name, choose a goal, and come back each day to mark your progress.</p>
              <button className="button button-primary empty-add" onClick={addHabit}>Add a habit</button>
            </section>
          )}
        </div>
      </main>
      {showSettings && (
        <AccountSettingsModal
          currentUser={currentUser}
          setCurrentUser={setCurrentUser}
          close={() => setShowSettings(false)}
        />
      )}
      {showCreateHabit && (
        <CreateHabitModal
          onSubmit={createHabit}
          close={() => setShowCreateHabit(false)}
        />
      )}
      {editingHabit && (
        <CreateHabitModal
          key={editingHabit.id}
          habit={editingHabit}
          onSubmit={applyHabitEdits}
          close={() => setEditingHabitId(null)}
        />
      )}
      {showCreateJournal && (
        <CreateJournalModal
          onCreate={createJournal}
          close={() => setShowCreateJournal(false)}
        />
      )}
    </div>
  );
}

export default App;
