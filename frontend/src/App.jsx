import { useState } from "react";

import Sidebar from "./components/Sidebar";
import HabitPage from "./components/tracker/HabitPage";

function App() {
  const [habits] = useState([
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
  ]);

  const [selectedHabitId, setSelectedHabitId] = useState(1);

  const selectedHabit =
    habits.find(h => h.id === selectedHabitId) || habits[0];

  return (
    <div className="app">

      <Sidebar
        habits={habits}
        selectedHabitId={selectedHabitId}
        setSelectedHabitId={setSelectedHabitId}
        addHabit={() => {}}
      />

      <HabitPage habit={selectedHabit} />

    </div>
  );
}

export default App;