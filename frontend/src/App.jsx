import { useEffect, useState } from "react";

function App() {
  const [habits, setHabits] = useState([]);
  const [input, setInput] = useState("");

  const API = "http://127.0.0.1:8000";

  // Load habits
  useEffect(() => {
    fetch(`${API}/habits`)
      .then(res => res.json())
      .then(data => setHabits(data));
  }, []);

  // Add habit
  const addHabit = async () => {
    if (!input) return;

    const res = await fetch(`${API}/habits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name: input })
    });

    const newHabit = await res.json();
    setHabits([...habits, newHabit]);
    setInput("");
  };

  // Toggle habit
  const toggleHabit = async (id) => {
    const res = await fetch(`${API}/habits/${id}`, {
      method: "PUT"
    });

    const updated = await res.json();

    setHabits(habits.map(h => h.id === id ? updated : h));
  };

  // Delete habit
  const deleteHabit = async (id) => {
    await fetch(`${API}/habits/${id}`, {
      method: "DELETE"
    });

    setHabits(habits.filter(h => h.id !== id));
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>Habit Tracker</h1>

      {/* ADD INPUT */}
      <input
        id="habit-input"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        onKeyDown={(e) => {
    if (e.key === "Enter") {
      addHabit();
    }
  }}
  placeholder="Enter a habit"
/>

      <button id="add-btn" onClick={addHabit}>
        Add Habit
      </button>

      {/* HABIT LIST */}
      <ul>
        {habits.map((habit) => (
          <li key={habit.id} data-testid="habit-item">

            <span
              onClick={() => toggleHabit(habit.id)}
              style={{
                cursor: "pointer",
                textDecoration: habit.completed ? "line-through" : "none"
              }}
              data-testid={`habit-${habit.id}`}
            >
              {habit.name}
            </span>

            <button
              onClick={() => deleteHabit(habit.id)}
              data-testid={`delete-${habit.id}`}
            >
              Delete
            </button>

          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;