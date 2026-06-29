import { useState, useEffect } from "react";

import Sidebar from "./components/Sidebar";
import HabitPage from "./components/tracker/HabitPage";

function App() {

  const defaultHabits = [
    {
      id: 1,
      name: "Exercise",
      goal: "Run 3 miles every day",
      streak: 0,
      completion: 0,
      badges: []
    },
    {
      id: 2,
      name: "Reading",
      goal: "Read 30 minutes",
      streak: 0,
      completion: 0,
      badges: []
    }
  ];

  const [habits, setHabits] = useState(() => {
    const saved = localStorage.getItem("habits-list");
    return saved ? JSON.parse(saved) : defaultHabits;
  });

  const [selectedHabitId, setSelectedHabitId] = useState(1);
  useEffect(() => {
  localStorage.setItem(
    "habits-list",
    JSON.stringify(habits)
  );
}, [habits]);

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

      <HabitPage
  key={selectedHabit.id}
  habit={selectedHabit}
  updateHabit={updateHabit}
  deleteHabit={deleteHabit}
/>
    </div>
  );
}

export default App;