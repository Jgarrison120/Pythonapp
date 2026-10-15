import { useEffect, useState } from "react";

const API = "http://127.0.0.1:8000";

function AccountSettingsModal({ currentUser, setCurrentUser, close }) {
  const [username, setUsername] = useState(currentUser.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  useEffect(() => {
    const onKeyDown = (event) => { if (event.key === "Escape") close(); };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [close]);

  const updateUsername = async () => {
    setSettingsError("");
    setSettingsSuccess("");
    try {
      const response = await fetch(API + "/users/" + currentUser.id + "/username", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username: username.trim() }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSettingsError(data.detail || "Could not update username.");
        return;
      }
      setCurrentUser(data);
      setSettingsSuccess("Username updated.");
    } catch {
      setSettingsError("Could not connect to the app. Please try again.");
    }
  };

  const updatePassword = async () => {
    setSettingsError("");
    setSettingsSuccess("");
    try {
      const response = await fetch(API + "/users/" + currentUser.id + "/password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ current_password: currentPassword, new_password: newPassword }),
      });
      const data = await response.json();
      if (!response.ok) {
        setSettingsError(data.detail || "Could not update password.");
        return;
      }
      setCurrentPassword("");
      setNewPassword("");
      setSettingsSuccess("Password updated.");
    } catch {
      setSettingsError("Could not connect to the app. Please try again.");
    }
  };

  return (
    <div className="modal-overlay" onMouseDown={(event) => { if (event.target === event.currentTarget) close(); }}>
      <div className="settings-modal" role="dialog" aria-modal="true" aria-labelledby="settings-title">
        <div className="modal-header">
          <div>
            <span className="eyebrow">Your space</span>
            <h2 id="settings-title">Account settings</h2>
          </div>
          <button type="button" className="close-button" aria-label="Close settings" onClick={close}>×</button>
        </div>
        {settingsError && <div className="form-error" role="alert">{settingsError}</div>}
        {settingsSuccess && <div className="form-success" role="status">{settingsSuccess}</div>}
        <section className="settings-section">
          <h3>Profile name</h3>
          <p>This is the name you see on your journal.</p>
          <label className="form-label" htmlFor="settings-username">Username</label>
          <input id="settings-username" className="form-input" value={username} onChange={(event) => setUsername(event.target.value)} />
          <button className="button button-primary settings-save" onClick={updateUsername} disabled={!username.trim()}>
            Save username
          </button>
        </section>
        <section className="settings-section">
          <h3>Change password</h3>
          <p>Enter your current password to set a new one.</p>
          <label className="form-label" htmlFor="current-password">Current password</label>
          <input id="current-password" className="form-input" type="password" autoComplete="current-password" value={currentPassword} onChange={(event) => setCurrentPassword(event.target.value)} />
          <label className="form-label" htmlFor="new-password">New password</label>
          <input id="new-password" className="form-input" type="password" autoComplete="new-password" value={newPassword} onChange={(event) => setNewPassword(event.target.value)} />
          <button className="button button-primary settings-save" onClick={updatePassword} disabled={!currentPassword || !newPassword}>
            Save password
          </button>
        </section>
      </div>
    </div>
  );
}

export default AccountSettingsModal;
