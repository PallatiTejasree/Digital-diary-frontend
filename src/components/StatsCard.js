function StatsCard({ emoji, title, value }) {
  return (
    <div
      style={{
        background: "white",
        borderRadius: "20px",
        padding: "20px",
        boxShadow: "0 5px 15px rgba(0,0,0,.08)",
      }}
    >
      <h2>{emoji}</h2>

      <h4>{title}</h4>

      <h1>{value}</h1>
    </div>
  );
}

export default StatsCard;
