function SidebarFooter({ openSettings }) {
  return (
    <div className="sidebar-footer">
      <button type="button" className="button button-quiet button-wide" onClick={openSettings}>
        Account settings
      </button>
    </div>
  );
}

export default SidebarFooter;
