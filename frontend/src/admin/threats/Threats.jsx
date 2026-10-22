import { useMemo, useState } from "react";
import ThreatBadge from "../shared/ThreatBadge";
import SecurityTable from "../shared/SecurityTable";
import "./Threats.css";

const threatData = [
  {
    id: "TH-001",
    time: "14:32:08",
    source: "192.168.1.24",
    threat: "SQL Injection",
    category: "WAF Rule",
    severity: "High",
    risk: 91,
    action: "Blocked",
  },
  {
    id: "TH-002",
    time: "14:29:42",
    source: "10.24.8.19",
    threat: "Cross-Site Scripting",
    category: "WAF Rule",
    severity: "Medium",
    risk: 68,
    action: "Blocked",
  },
  {
    id: "TH-003",
    time: "14:24:17",
    source: "172.16.4.7",
    threat: "Abnormal Request Burst",
    category: "IDS",
    severity: "High",
    risk: 83,
    action: "Flagged",
  },
  {
    id: "TH-004",
    time: "14:17:05",
    source: "192.168.7.91",
    threat: "Path Traversal",
    category: "WAF Rule",
    severity: "Critical",
    risk: 97,
    action: "Blocked",
  },
  {
    id: "TH-005",
    time: "13:58:29",
    source: "10.8.4.22",
    threat: "Anomalous Behavior",
    category: "AI",
    severity: "Medium",
    risk: 72,
    action: "Flagged",
  },
];

function Threats() {
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");

  const filteredThreats = useMemo(() => {
    return threatData.filter((item) => {
      const matchesSearch =
        item.source.toLowerCase().includes(search.toLowerCase()) ||
        item.threat.toLowerCase().includes(search.toLowerCase());

      const matchesSeverity =
        severity === "All" || item.severity === severity;

      return matchesSearch && matchesSeverity;
    });
  }, [search, severity]);

  const rows = filteredThreats.map((item) => ({
    id: item.id,
    time: item.time,
    source: item.source,
    threat: (
      <div className="table-primary-text">
        <strong>{item.threat}</strong>
        <span>{item.category}</span>
      </div>
    ),
    severity: (
      <ThreatBadge variant={item.severity.toLowerCase()}>
        {item.severity}
      </ThreatBadge>
    ),
    risk: (
      <div className="risk-cell">
        <strong>{item.risk}</strong>
        <div className="risk-mini-track">
          <span
            style={{
              width: `${item.risk}%`,
            }}
          />
        </div>
      </div>
    ),
    action: (
      <span
        className={`action-label ${
          item.action === "Blocked" ? "blocked" : "flagged"
        }`}
      >
        {item.action}
      </span>
    ),
  }));

  const columns = [
    { key: "time", label: "Time" },
    { key: "source", label: "Source IP" },
    { key: "threat", label: "Threat" },
    { key: "severity", label: "Severity" },
    { key: "risk", label: "Risk" },
    { key: "action", label: "Action" },
  ];

  return (
    <section className="threats-module">
      <div className="module-stat-row">
        <div className="module-stat">
          <span>Detected</span>
          <strong>128</strong>
        </div>

        <div className="module-stat">
          <span>Blocked</span>
          <strong>96</strong>
        </div>

        <div className="module-stat">
          <span>Flagged</span>
          <strong>24</strong>
        </div>

        <div className="module-stat">
          <span>Critical</span>
          <strong>8</strong>
        </div>
      </div>

      <div className="filter-panel">
        <div className="filter-input-wrap">
          <span>⌕</span>
          <input
            type="text"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search threat or source IP..."
          />
        </div>

        <select
          className="form-select filter-select"
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
        >
          <option>All</option>
          <option>Critical</option>
          <option>High</option>
          <option>Medium</option>
          <option>Low</option>
        </select>

        <button type="button" className="btn filter-button">
          Export
        </button>
      </div>

      <div className="threats-table-panel">
        <div className="table-panel-header">
          <div>
            <span className="panel-kicker">DETECTION OUTPUT</span>
            <h2>Detected Threats</h2>
          </div>

          <span className="table-record-count">
            {filteredThreats.length} records
          </span>
        </div>

        <SecurityTable
          columns={columns}
          rows={rows}
          emptyMessage="No threats match your filters."
        />
      </div>
    </section>
  );
}

export default Threats;