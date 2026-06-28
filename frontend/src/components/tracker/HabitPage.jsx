import { useState } from "react";
import HabitCalendar from "./HabitCalendar";

function HabitPage({ habit }) {
  if (!habit) {
    return (
      <div style={styles.empty}>
        No habit selected
      </div>
    );
  }

  // =========================
  // STATE
  // =========================
  const [completionMap, setCompletionMap] = useState(() => {
    const saved = localStorage.getItem(`habit-${habit.id}`);
    return saved ? JSON.parse(saved) : {};
  });

  // =========================
  // TOGGLE DAY
  // =========================
  const toggleDay = (key) => {
    setCompletionMap((prev) => {
      const current = prev[key] || 0;

      const next =
        current === 0 ? 0.25 :
        current === 0.25 ? 0.5 :
        current === 0.5 ? 0.75 :
        current === 0.75 ? 1 :
        0;

      const updated = {
        ...prev,
        [key]: next,
      };

      localStorage.setItem(
        `habit-${habit.id}`,
        JSON.stringify(updated)
      );

      return updated;
    });
  };

  // =========================
  // STREAK CALCULATOR
  // =========================
  const calculateStreak = () => {
    const entries = Object.entries(completionMap);

    const sortedDates = entries
      .filter(([_, value]) => value >= 0.75)
      .map(([date]) => new Date(date))
      .sort((a, b) => b - a);

    let streak = 0;
    let current = new Date();

    for (let i = 0; i < sortedDates.length; i++) {
      const d = sortedDates[i];

      const diff = Math.floor(
        (current - d) / (1000 * 60 * 60 * 24)
      );

      if (diff === 0 || diff === 1) {
        streak++;
        current = d;
      } else {
        break;
      }
    }

    return streak;
  };

  // =========================
  // BADGES
  // =========================
  const getBadges = (streak) => {
    const badges = [];

    if (streak >= 3) badges.push("🥉 Starter");
    if (streak >= 7) badges.push("🥈 Consistency");
    if (streak >= 14) badges.push("🥇 Discipline");
    if (streak >= 30) badges.push("🏆 Elite");

    return badges;
  };

  // =========================
  // 📊 ANALYTICS (NEW SAAS LAYER)
  // =========================
  const streak = calculateStreak();
  const badges = getBadges(streak);

  const bestStreak = streak; // placeholder (upgrade later)
  const completionValues = Object.values(completionMap);
  const completionRate =
    completionValues.length === 0
      ? 0
      : Math.round(
          (completionValues.reduce((a, b) => a + b, 0) /
            completionValues.length) *
            100
        );

  const daysTracked = Object.keys(completionMap).length;

  return (
    <div style={styles.page}>

      {/* HEADER */}
      <div style={styles.header}>
        <h1 style={styles.title}>{habit.name}</h1>
        <p style={styles.subtitle}>{habit.goal}</p>

        <div style={{ opacity: 0.7, marginTop: 5 }}>
          🔥 Current Streak: {streak} days
        </div>
      </div>

      {/* =========================
          📊 ANALYTICS DASHBOARD
      ========================= */}
      <div style={styles.analyticsGrid}>

        <div style={styles.analyticsCard}>
          <h4>🔥 Current Streak</h4>
          <p>{streak}</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4>🏆 Best Streak</h4>
          <p>{bestStreak}</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4>📈 Completion Rate</h4>
          <p>{completionRate}%</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4>📅 Days Tracked</h4>
          <p>{daysTracked}</p>
        </div>

      </div>

      {/* STATS */}
      <div style={styles.cardRow}>

        <div style={styles.card}>
          <h3>🔥 Streak</h3>
          <p style={styles.bigText}>{streak}</p>
        </div>

        <div style={styles.card}>
          <h3>📊 Completion</h3>
          <p style={styles.bigText}>{habit.completion}%</p>
        </div>

        <div style={styles.card}>
          <h3>🏅 Badges</h3>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {badges.length > 0 ? (
              badges.map((b, i) => (
                <span
                  key={i}
                  style={{
                    background: "#2563eb",
                    padding: "4px 10px",
                    borderRadius: "999px",
                    fontSize: "12px",
                  }}
                >
                  {b}
                </span>
              ))
            ) : (
              "No badges yet"
            )}
          </div>
        </div>

      </div>

      {/* GRID */}
      <div style={styles.gridCard}>
        <HabitCalendar
          completionMap={completionMap}
          toggleDay={toggleDay}
        />
      </div>

    </div>
  );
}

export default HabitPage;

// =========================
// STYLES
// =========================
const styles = {
  page: {
    flex: 1,
    minWidth: 0,
    height: "100vh",
    overflow: "auto",
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
    marginBottom: "20px",
  },

  title: {
    fontSize: "32px",
    marginBottom: "5px",
  },

  subtitle: {
    opacity: 0.7,
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

  bigText: {
    fontSize: "26px",
    marginTop: "10px",
  },

  gridCard: {
    background: "#1f2937",
    padding: "20px",
    borderRadius: "12px",
    marginTop: "20px",
  },

  analyticsGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(4, 1fr)",
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
};