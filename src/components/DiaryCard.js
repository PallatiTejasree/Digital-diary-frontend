function DiaryCard({ title, date, preview }) {
  return (
    <div
      style={{
        background: "#fffdf8",
        borderRadius: "18px",
        padding: "20px",
        marginBottom: "20px",
        boxShadow: "0 5px 15px rgba(0,0,0,.05)",
      }}
    >
      <h3>{title}</h3>

      <small>{date}</small>

      <p style={{ marginTop: "12px", color: "#666" }}>{preview}</p>
    </div>
  );
}

export default DiaryCard;
