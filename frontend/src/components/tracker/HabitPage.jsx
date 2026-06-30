import HabitCalendar from "./HabitCalendar";

function HabitPage({
  habit,
  updateHabit,
  deleteHabit,
  updateHabitEntry,
  saveHabit,
}) {
  if (!habit) {
    return <div style={styles.empty}>No habit selected</div>;
  }

  const completionMap = habit.entries || {};

  const formatDate = (date) => {
    const d = new Date(date);

    return new Date(d.getFullYear(), d.getMonth(), d.getDate())
      .toISOString()
      .split("T")[0];
  };

  const toggleDay = (date) => {
    const key = formatDate(date);
    const current = completionMap[key] || 0;

    const next =
      current === 0
        ? 0.25
        : current === 0.25
        ? 0.5
        : current === 0.5
        ? 0.75
        : current === 0.75
        ? 1
        : 0;

    updateHabitEntry(habit.id, key, next);
  };

  const calculateStreak = () => {
    const completedKeys = Object.entries(completionMap)
      .filter(([_, value]) => value >= 0.75)
      .map(([date]) => date)
      .sort()
      .reverse();

    if (completedKeys.length === 0) return 0;

    let streak = 1;
    let currentDate = new Date(completedKeys[0]);

    for (let i = 1; i < completedKeys.length; i++) {
      const previousDate = new Date(completedKeys[i]);

      const diff = Math.round(
        (currentDate - previousDate) / (1000 * 60 * 60 * 24)
      );

      if (diff === 1) {
        streak++;
        currentDate = previousDate;
      } else {
        break;
      }
    }

    return streak;
  };

  const calculateBestStreak = () => {
    const completedDates = Object.entries(completionMap)
      .filter(([_, value]) => value >= 0.75)
      .map(([date]) => date)
      .sort();

    if (completedDates.length === 0) return 0;

    let best = 1;
    let current = 1;

    for (let i = 1; i < completedDates.length; i++) {
      const previous = new Date(completedDates[i - 1]);
      const currentDay = new Date(completedDates[i]);

      const diff = Math.round(
        (currentDay - previous) / (1000 * 60 * 60 * 24)
      );

      if (diff === 1) {
        current++;
        best = Math.max(best, current);
      } else {
        current = 1;
      }
    }

    return best;
  };

  const getCompletedDays = () =>
    Object.values(completionMap).filter((value) => value >= 0.75).length;

  const getYearCompletionRate = () =>
    Math.round((getCompletedDays() / 365) * 100);

  const getBestMonth = () => {
    const monthTotals = Array(12).fill(0);

    Object.entries(completionMap).forEach(([date, value]) => {
      if (value >= 0.75) {
        const month = new Date(date).getMonth();
        monthTotals[month]++;
      }
    });

    const bestIndex = monthTotals.indexOf(Math.max(...monthTotals));

    const monthNames = [
      "Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
    ];

    return monthTotals[bestIndex] > 0
      ? `${monthNames[bestIndex]} (${monthTotals[bestIndex]} days)`
      : "None yet";
  };

  const getBadges = (streak) => {
    const badges = [];

    if (streak >= 3) badges.push("🥉 Starter");
    if (streak >= 7) badges.push("🥈 Consistency");
    if (streak >= 14) badges.push("🥇 Discipline");
    if (streak >= 30) badges.push("🏆 Elite");

    return badges;
  };

  const streak = calculateStreak();
  const bestStreak = calculateBestStreak();
  const completedDays = getCompletedDays();
  const yearCompletionRate = getYearCompletionRate();
  const bestMonth = getBestMonth();
  const badges = getBadges(streak);

  return (
    <div style={styles.page}>
      <div style={styles.header}>
  <div style={styles.habitInfo}>
    <label style={styles.label}>Habit Name</label>
    <input
      style={styles.input}
      value={habit.name}
      onChange={(e) =>
        updateHabit(habit.id, { name: e.target.value })
      }
    />

    <label style={styles.label}>Goal</label>
    <textarea
      style={styles.textarea}
      value={habit.goal}
      onChange={(e) =>
        updateHabit(habit.id, { goal: e.target.value })
      }
    />

    {habit.isDirty && (
      <div style={styles.unsavedText}>
        Unsaved changes for this habit
      </div>
    )}
  </div>

  <div style={styles.toolbar}>
    <button
      style={styles.deleteButton}
      onClick={() => deleteHabit(habit.id)}
    >
      🗑 Delete
    </button>
    <button
  style={{
    ...styles.saveHabitButton,
    opacity: habit.isDirty || habit.isNew ? 1 : 0.5,
  }}
  disabled={!habit.isDirty && !habit.isNew}
  onClick={() => saveHabit(habit.id)}
>
  💾 Save Habit
</button>
  </div>
</div>

      <div style={styles.analyticsGrid}>
        <div style={styles.analyticsCard}>
          <h4>🔥 Current Streak</h4>
          <p>{streak} days</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4>🏆 Best Streak</h4>
          <p>{bestStreak} days</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4>✅ Completed Days</h4>
          <p>{completedDays}</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4>📈 Year Progress</h4>
          <p>{yearCompletionRate}%</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4>📅 Best Month</h4>
          <p>{bestMonth}</p>
        </div>
      </div>

      <div style={styles.cardRow}>
        <div style={styles.card}>
          <h3>🏅 Badges</h3>

          <div style={styles.badgeRow}>
            {badges.length > 0 ? (
              badges.map((badge, index) => (
                <span key={index} style={styles.badge}>
                  {badge}
                </span>
              ))
            ) : (
              "No badges yet"
            )}
          </div>
        </div>
      </div>

      <div style={styles.gridCard}>
        <HabitCalendar
          completionMap={completionMap}
          toggleDay={toggleDay}
          year={2026}
        />
      </div>
    </div>
  );
}

export default HabitPage;

const styles = {
  page: {
    flex: 1,
    minWidth: 0,
    height: "100%",
    overflowY: "auto",
    overflowX: "hidden",
    padding: "20px",
    background: "#0f172a",
    color: "white",
},

  empty: {
    flex: 1,
    height: "100vh",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    color: "white",
    background: "#0f172a",
    fontSize: "18px",
  },

  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "flex-start",
    gap: "16px",
    marginBottom: "20px",
  },

  title: {
    fontSize: "32px",
    marginBottom: "5px",
  },

  subtitle: {
    opacity: 0.7,
  },

  unsavedText: {
    marginTop: "8px",
    color: "#86efac",
    fontSize: "13px",
  },

  toolbar: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  toolbarButton: {
    background: "#1f2937",
    color: "white",
    border: "1px solid #374151",
    padding: "9px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  deleteButton: {
    background: "#dc2626",
    color: "white",
    border: "none",
    padding: "9px 12px",
    borderRadius: "8px",
    cursor: "pointer",
  },

  saveHabitButton: {
  background: "#16a34a",
  color: "white",
  border: "none",
  padding: "9px 12px",
  borderRadius: "8px",
  cursor: "pointer",
},

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(5, 1fr)",
    gap: "12px",
    marginBottom: "20px",
  },

  analyticsCard: {
    background: "#111827",
    padding: "15px",
    borderRadius: "12px",
    border: "1px solid #1f2937",
    textAlign: "center",
  },

  cardRow: {
    display: "flex",
    gap: "15px",
    marginBottom: "20px",
    flexWrap: "wrap",
  },

  card: {
    flex: 1,
    minWidth: "180px",
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
  },

  badgeRow: {
    display: "flex",
    gap: "8px",
    flexWrap: "wrap",
  },

  badge: {
    background: "#2563eb",
    padding: "4px 10px",
    borderRadius: "999px",
    fontSize: "12px",
  },

  gridCard: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
  },

  habitInfo: {
  flex: 1,
  maxWidth: "700px",
},

label: {
  display: "block",
  fontSize: "12px",
  opacity: 0.65,
  marginBottom: "6px",
  marginTop: "10px",
},

input: {
  width: "100%",
  background: "#111827",
  color: "white",
  border: "1px solid #374151",
  borderRadius: "10px",
  padding: "12px",
  fontSize: "28px",
  fontWeight: "700",
  outline: "none",
},

textarea: {
  width: "100%",
  minHeight: "70px",
  background: "#111827",
  color: "white",
  border: "1px solid #374151",
  borderRadius: "10px",
  padding: "12px",
  fontSize: "15px",
  resize: "vertical",
  outline: "none",
},
};