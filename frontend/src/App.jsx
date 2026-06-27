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
    if (!input.trim()) return;

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
    <div style={styles.page}>
      <div style={styles.container}>

        {/* HEADER */}
        <h1 style={styles.title}>🧠 Habit Tracker</h1>
        <p style={styles.subtitle}>Track your daily habits</p>

        {/* INPUT */}
        <div style={styles.inputRow}>
          <input
            id="habit-input"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") addHabit();
            }}
            placeholder="Enter a habit..."
            style={styles.input}
          />

          <button id="add-btn" onClick={addHabit} style={styles.addButton}>
            + Add
          </button>
        </div>

        {/* HABITS */}
        <div style={styles.list}>
          {habits.map((habit) => (
            <div key={habit.id} style={styles.card} data-testid="habit-item">

              <div style={styles.habitRow}>

  {/* LEFT SIDE: NAME */}
  <div
    onClick={() => toggleHabit(habit.id)}
    style={styles.habitText}
    data-testid={`habit-${habit.id}`}
  >
    <div style={{
      textDecoration: habit.completed ? "line-through" : "none",
      opacity: habit.completed ? 0.5 : 1
    }}>
      {habit.name}
    </div>
  </div>

  {/* RIGHT SIDE: BADGE + DELETE */}
  <div style={styles.rightSide}>

    <div style={styles.streakBadge}>
      🔥 {habit.streak || 0}
    </div>

    <button
      onClick={() => deleteHabit(habit.id)}
      style={styles.deleteButton}
      data-testid={`delete-${habit.id}`}
    >
      ✕
    </button>

  </div>

</div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}

export default App;

/* =======================
   STYLES
======================= */
const styles = {
  page: {
    minHeight: "100vh",
    background: "linear-gradient(135deg, #0f172a, #1e293b)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontFamily: "Arial, sans-serif",
  },

  container: {
    width: "420px",
    background: "#111827",
    padding: "24px",
    borderRadius: "16px",
    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
    color: "white",
  },

  title: {
    margin: 0,
    textAlign: "center",
    fontSize: "26px",
  },

  subtitle: {
    textAlign: "center",
    fontSize: "12px",
    opacity: 0.6,
    marginBottom: "20px",
  },

  inputRow: {
    display: "flex",
    gap: "10px",
    marginBottom: "20px",
  },

  input: {
    flex: 1,
    padding: "10px",
    borderRadius: "10px",
    border: "1px solid #374151",
    outline: "none",
    background: "#1f2937",
    color: "white",
  },

  addButton: {
    padding: "10px 14px",
    borderRadius: "10px",
    border: "none",
    background: "#3b82f6",
    color: "white",
    cursor: "pointer",
  },

  list: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  },

  card: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    background: "#1f2937",
    padding: "12px",
    borderRadius: "10px",
    transition: "0.2s",
  },

  habitText: {
    cursor: "pointer",
  },

  rightSide: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  },

  streakBadge: {
  background: "#f97316",
  color: "white",
  fontSize: "12px",
  padding: "4px 8px",
  borderRadius: "999px",
  fontWeight: "bold",
},

  deleteButton: {
    background: "transparent",
    border: "none",
    color: "#ef4444",
    fontSize: "18px",
    cursor: "pointer",
  },

  habitRow: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },
};