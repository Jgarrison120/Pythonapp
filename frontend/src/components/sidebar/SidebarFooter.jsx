function SidebarFooter({ openSettings }) {
  return (
    <button style={styles.settingsButton} onClick={openSettings}>
      ⚙️ Settings
    </button>
  );
}

export default SidebarFooter;

const styles = {
  settingsButton: {
    marginTop: "16px",
    background: "#020617",
    color: "#cbd5e1",
    border: "1px solid #1f2937",
    padding: "10px",
    borderRadius: "10px",
    cursor: "pointer",
    fontWeight: "600",
  },
};