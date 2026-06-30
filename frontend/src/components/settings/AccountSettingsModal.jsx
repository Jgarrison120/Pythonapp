import { useState } from "react";

const API = "http://127.0.0.1:8000";

function AccountSettingsModal({
  currentUser,
  setCurrentUser,
  close,
}) {
  const [username, setUsername] = useState(currentUser.username);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");

  const updateUsername = async () => {
    setSettingsError("");
    setSettingsSuccess("");

    const res = await fetch(`${API}/users/${currentUser.id}/username`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSettingsError(data.detail || "Could not update username");
      return;
    }

    setCurrentUser(data);
    setSettingsSuccess("Username updated.");
  };

  const updatePassword = async () => {
    setSettingsError("");
    setSettingsSuccess("");

    const res = await fetch(`${API}/users/${currentUser.id}/password`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        current_password: currentPassword,
        new_password: newPassword,
      }),
    });

    const data = await res.json();

    if (!res.ok) {
      setSettingsError(data.detail || "Could not update password");
      return;
    }

    setCurrentPassword("");
    setNewPassword("");
    setSettingsSuccess("Password updated.");
  };

  return (
    <div style={styles.modalOverlay}>
      <div style={styles.modal}>
        <div style={styles.modalHeader}>
          <h2>Account Settings</h2>
          <button style={styles.closeButton} onClick={close}>
            ×
          </button>
        </div>

        {settingsError && <div style={styles.errorBox}>{settingsError}</div>}
        {settingsSuccess && <div style={styles.successBox}>{settingsSuccess}</div>}

        <label style={styles.label}>Username</label>
        <input
          style={styles.input}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        />

        <button style={styles.saveButton} onClick={updateUsername}>
          Save Username
        </button>

        <hr style={styles.divider} />

        <label style={styles.label}>Current Password</label>
        <input
          style={styles.input}
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
        />

        <label style={styles.label}>New Password</label>
        <input
          style={styles.input}
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
        />

        <button style={styles.saveButton} onClick={updatePassword}>
          Save Password
        </button>
      </div>
    </div>
  );
}

export default AccountSettingsModal;

const styles = {
  modalOverlay: {
    position: "fixed",
    inset: 0,
    background: "rgba(0,0,0,.6)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2000,
  },

  modal: {
    width: "420px",
    background: "#111827",
    color: "white",
    border: "1px solid #374151",
    borderRadius: "16px",
    padding: "24px",
  },

  modalHeader: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "16px",
  },

  closeButton: {
    background: "transparent",
    color: "white",
    border: "none",
    fontSize: "28px",
    cursor: "pointer",
  },

  label: {
    display: "block",
    marginTop: "12px",
    marginBottom: "6px",
    color: "#cbd5e1",
    fontSize: "13px",
  },

  input: {
    width: "100%",
    padding: "12px",
    borderRadius: "10px",
    border: "1px solid #374151",
    background: "#020617",
    color: "white",
  },

  saveButton: {
    width: "100%",
    marginTop: "14px",
    background: "#22c55e",
    color: "white",
    border: "none",
    padding: "10px 18px",
    borderRadius: "10px",
    fontWeight: 600,
    cursor: "pointer",
  },

  divider: {
    border: "none",
    borderTop: "1px solid #374151",
    margin: "22px 0",
  },

  errorBox: {
    background: "#7f1d1d",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "12px",
  },

  successBox: {
    background: "#14532d",
    padding: "10px",
    borderRadius: "8px",
    marginBottom: "12px",
  },
};