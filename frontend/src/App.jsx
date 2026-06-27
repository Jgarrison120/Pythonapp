import { useState } from "react";

import Sidebar from "./components/Sidebar";
import HabitPage from "./components/tracker/HabitPage";

function App() {
  // Example habits for now
  const [habits, setHabits] = useState([
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
    },
    {
      id: 3,
      name: "Drink Water",
      goal: "Drink 96 oz",
      streak: 0,
      completion: 0,
      badges: []
    }
  ]);

  // Currently selected habit
  const [selectedHabitId, setSelectedHabitId] = useState(1);

  const selectedHabit =
    habits.find((habit) => habit.id === selectedHabitId) || habits[0];

  // Temporary add habit function
  const addHabit = () => {
    const name = prompt("Habit name?");

    if (!name) return;

    const newHabit = {
      id: Date.now(),
      name,
      goal: "No goal set",
      streak: 0,
      completion: 0,
      badges: []
    };

    setHabits([...habits, newHabit]);
    setSelectedHabitId(newHabit.id);
  };

  return (
    <div className="app">

      <Sidebar
        habits={habits}
        selectedHabitId={selectedHabitId}
        setSelectedHabitId={setSelectedHabitId}
        addHabit={addHabit}
      />

      <HabitPage habit={selectedHabit} />

    </div>
  );
}

export default App;