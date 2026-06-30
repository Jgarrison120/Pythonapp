// src/components/AuthPage.jsx

import { useState } from "react";

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");

  const API = "http://127.0.0.1:8000";

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    const endpoint = mode === "login" ? "/auth/login" : "/auth/register";

    const res = await fetch(`${API}${endpoint}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.detail || "Something went wrong");
      return;
    }

    const user = await res.json();
    onLogin(user);
  };

  return (
    <div style={styles.page}>
      <form style={styles.card} onSubmit={submit}>
        <h1 style={styles.title}>🧠 Habit Journal</h1>
        <p style={styles.subtitle}>
          {mode === "login" ? "Log in to continue" : "Create your account"}
        </p>

        {error && <div style={styles.error}>{error}</div>}

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <label style={styles.label}>Password</label>
        <input
          style={styles.input}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button style={styles.primaryButton} type="submit">
          {mode === "login" ? "Log In" : "Register"}
        </button>

        <button
          type="button"
          style={styles.linkButton}
          onClick={() =>
            setMode((prev) => (prev === "login" ? "register" : "login"))
          }
        >
          {mode === "login"
            ? "Need an account? Register"
            : "Already have an account? Log in"}
        </button>
      </form>
    </div>
  );
}

export default AuthPage;

const styles = {
  page: {
    minHeight: "100vh",
    background: "#0f172a",
    color: "white",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  card: {
    width: "380px",
    background: "#111827",
    border: "1px solid #1f2937",
    borderRadius: "18px",
    padding: "28px",
  },

  title: {
    marginBottom: "8px",
  },

  subtitle: {
    color: "#94a3b8",
    marginBottom: "20px",
  },

  label: {
    display: "block",
    marginTop: "14px",
    marginBottom: "6px",
    fontSize: "13px",
    color: "#cbd5e1",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #374151",
    background: "#020617",
    color: "white",
  },

  primaryButton: {
    width: "100%",
    marginTop: "20px",
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    fontWeight: "700",
    cursor: "pointer",
  },

  linkButton: {
    width: "100%",
    marginTop: "12px",
    background: "transparent",
    border: "none",
    color: "#93c5fd",
    cursor: "pointer",
  },

  error: {
    background: "#7f1d1d",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "12px",
    fontSize: "13px",
  },
};