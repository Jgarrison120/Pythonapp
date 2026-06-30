import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import HabitPage from "./components/tracker/HabitPage";

function App() {

  const [habits, setHabits] = useState([]);

  const [selectedHabitId, setSelectedHabitId] = useState(1);
  useEffect(() => {
  fetch("http://127.0.0.1:8000/habits")
    .then((response) => response.json())
    .then((data) => {
      setHabits(data);

      if (data.length > 0) {
        setSelectedHabitId(data[0].id);
      }
    })
    .catch(console.error);
}, []);

  const selectedHabit =
    habits.find((h) => h.id === selectedHabitId) || habits[0];

  const addHabit = () => {
  const name = prompt("Habit name?");
  if (!name || !name.trim()) return;

  const goal = prompt("Goal for this habit?");
  
  const newHabit = {
    id: Date.now(),
    name: name.trim(),
    goal: goal && goal.trim() ? goal.trim() : "No goal set",
    streak: 0,
    completion: 0,
    badges: []
  };

  setHabits([...habits, newHabit]);
  setSelectedHabitId(newHabit.id);
};

const updateHabit = (habitId, updates) => {
  setHabits(
    habits.map((h) =>
      h.id === habitId ? { ...h, ...updates } : h
    )
  );
};

const deleteHabit = (habitId) => {
  if (habits.length === 1) {
    alert("You must have at least one habit.");
    return;
  }

  if (!window.confirm("Delete this habit?")) return;

  localStorage.removeItem(`habit-tracker-${habitId}`);

  const updated = habits.filter((h) => h.id !== habitId);
  setHabits(updated);
  setSelectedHabitId(updated[0].id);
};

  return (
    <div className="app">
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
  />
) : (
  <div style={{ color: "white", padding: 20 }}>
    Loading habits...
  </div>
)}
    </div>
  );
}

export default App;