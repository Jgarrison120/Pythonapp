export const calendarStyles = {
  wrapper: {
    width: "100%",
  },

  header: {
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: "16px",
  },

  title: {
    margin: 0,
    fontSize: "18px",
  },

  yearBadge: {
    background: "#111827",
    border: "1px solid #374151",
    padding: "6px 10px",
    borderRadius: "999px",
    fontSize: "12px",
    opacity: 0.85,
  },

  calendar: {
    overflowX: "auto",
    paddingBottom: "8px",
  },

  monthHeaderRow: {
    display: "grid",
    gridTemplateColumns: "50px repeat(12, 44px)",
    gap: "6px",
    marginBottom: "8px",
    alignItems: "center",
  },

  calendarRow: {
    display: "grid",
    gridTemplateColumns: "50px repeat(12, 44px)",
    gap: "6px",
    alignItems: "center",
    marginBottom: "6px",
  },

  dayHeaderCell: {
    fontSize: "12px",
    opacity: 0.55,
  },

  monthHeaderCell: {
    textAlign: "center",
    fontSize: "12px",
    opacity: 0.7,
  },

  dayLabel: {
    fontSize: "12px",
    opacity: 0.6,
  },

  cell: {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    border: "1px solid #374151",
    cursor: "pointer",
    justifySelf: "center",
    transition: "0.15s ease",
  },

  disabledCell: {
    width: "22px",
    height: "22px",
    borderRadius: "6px",
    background: "transparent",
    border: "1px dashed rgba(148, 163, 184, 0.12)",
    justifySelf: "center",
    opacity: 0.35,
  },
};