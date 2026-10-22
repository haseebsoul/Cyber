import "./ThreatBadge.css";

function ThreatBadge({ children, variant = "medium" }) {
  return (
    <span className={`threat-badge ${variant}`}>
      <span className="threat-badge-dot" />
      {children}
    </span>
  );
}

export default ThreatBadge;