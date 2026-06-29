import { useState, useEffect } from "react";
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
  // 🔑 STORAGE ISOLATION FIX
  // =========================
  const STORAGE_KEY = `habit-tracker-${habit.id}`;

  // =========================
  // STATE
  // =========================
  const [completionMap, setCompletionMap] = useState({});
useEffect(() => {
  const saved = localStorage.getItem(STORAGE_KEY);

  if (saved) {
    setCompletionMap(JSON.parse(saved));
  } else {
    setCompletionMap({});
  }
}, [STORAGE_KEY]);
  // =========================
  // TOGGLE DAY
  // =========================
  const toggleDay = (date) => {
    const key = new Date(date.getFullYear(), date.getMonth(), date.getDate())
      .toISOString()
      .split("T")[0];

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

      // 🔥 FIXED: now isolated per habit
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));

      return updated;
    });
  };

  // =========================
  // STREAK CALCULATOR (STABLE)
  // =========================
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

  const calculateBestStreak = () => {
  const completedDates = Object.entries(completionMap)
    .filter(([_, value]) => value >= 0.75)
    .map(([date]) => date)
    .sort();

  if (completedDates.length === 0) return 0;

  let best = 1;
  let current = 1;

  for (let i = 1; i < completedDates.length; i++) {
    const prev = new Date(completedDates[i - 1]);
    const curr = new Date(completedDates[i]);

    const diff = Math.round(
      (curr - prev) / (1000 * 60 * 60 * 24)
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

const getCompletedDays = () => {
  return Object.values(completionMap).filter((value) => value >= 0.75).length;
};

const getYearCompletionRate = () => {
  const completed = getCompletedDays();
  return Math.round((completed / 365) * 100);
};

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
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];

  return monthTotals[bestIndex] > 0
    ? `${monthNames[bestIndex]} (${monthTotals[bestIndex]} days)`
    : "None yet";
};

  // =========================
  // ANALYTICS
  // =========================
  const streak = calculateStreak();
  const badges = getBadges(streak);
  const bestStreak = calculateBestStreak();
  const completedDays = getCompletedDays();
  const yearCompletionRate = getYearCompletionRate();
  const bestMonth = getBestMonth();

  const values = Object.values(completionMap);

 
   
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

      {/* ANALYTICS */}
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
          <p>{yearCompletionRate}%</p>
        </div>

        <div style={styles.analyticsCard}>
          <h4>📅 Days Tracked</h4>
          <p>{completedDays}</p>
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
};

