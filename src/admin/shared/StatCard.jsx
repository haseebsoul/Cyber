import "./StatCard.css";

function StatCard({
  icon,
  label,
  value,
  trend,
  trendType = "neutral",
  detail,
}) {
  return (
    <div className="stat-card">
      <div className="stat-card-top">
        <div className="stat-card-icon">{icon}</div>

        {trend && (
          <span className={`stat-trend ${trendType}`}>
            {trend}
          </span>
        )}
      </div>

      <div className="stat-card-label">{label}</div>

      <div className="stat-card-value">{value}</div>

      {detail && <div className="stat-card-detail">{detail}</div>}
    </div>
  );
}

export default StatCard;