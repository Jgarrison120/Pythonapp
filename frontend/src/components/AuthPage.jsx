import { useState } from "react";

const API = "http://127.0.0.1:8000";

function AuthPage({ onLogin }) {
  const [mode, setMode] = useState("login");
  const [username, setUsername] = useState("demo");
  const [password, setPassword] = useState("demo123");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const submit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      const endpoint = mode === "login" ? "/auth/login" : "/auth/register";
      const response = await fetch(API + endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim(), password }),
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.detail || "Something went wrong. Please try again.");
        return;
      }
      await onLogin(data);
    } catch {
      setError("Could not connect to the app. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-story" aria-label="About Habit Journal">
        <div className="brand">
          <span className="brand-mark" aria-hidden="true" />
          <span><span className="brand-name">Habit Journal</span><span className="brand-subtitle">Make room to grow</span></span>
        </div>
        <div>
          <span className="eyebrow">A little progress, every day</span>
          <h1>Good habits grow one day at a time.</h1>
          <p>A welcoming place to keep your goals, notice the effort you put in, and see how far you have come.</p>
        </div>
        <span className="auth-signoff">Start where you are. Keep going from there.</span>
      </section>
      <section className="auth-form-side">
        <form className="auth-form" onSubmit={submit}>
          <span className="eyebrow">Welcome in</span>
          <h2>{mode === "login" ? "Pick up where you left off." : "Start your journal."}</h2>
          <p>{mode === "login" ? "Sign in to see your habits and progress." : "Create an account and begin with your first journal."}</p>
          {error && <div className="form-error" role="alert">{error}</div>}
          <label className="form-label" htmlFor="auth-username">Username</label>
          <input
            id="auth-username"
            className="form-input"
            autoComplete="username"
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            required
          />
          <label className="form-label" htmlFor="auth-password">Password</label>
          <input
            id="auth-password"
            className="form-input"
            type="password"
            autoComplete={mode === "login" ? "current-password" : "new-password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            required
          />
          <button className="button button-primary button-wide auth-submit" type="submit" disabled={loading}>
            {loading ? "Please wait…" : mode === "login" ? "Log in" : "Create account"}
          </button>
          {mode === "login" && <div className="auth-demo">Want to explore? The demo account is ready in the fields above.</div>}
          <button
            type="button"
            className="auth-mode"
            onClick={() => { setError(""); setMode(mode === "login" ? "register" : "login"); }}
          >
            {mode === "login" ? "New here? Create an account" : "Already have an account? Log in"}
          </button>
        </form>
      </section>
    </main>
  );
}

export default AuthPage;
