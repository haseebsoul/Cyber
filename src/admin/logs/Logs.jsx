import { useMemo, useState } from "react";
import SecurityTable from "../shared/SecurityTable";
import "./Logs.css";

const logData = [
  {
    id: "LOG-001",
    timestamp: "2026-09-29 14:32:08",
    type: "WAF",
    event: "SQL Injection request blocked",
    source: "192.168.1.24",
    action: "BLOCK",
    severity: "HIGH",
  },
  {
    id: "LOG-002",
    timestamp: "2026-09-29 14:29:42",
    type: "IDS",
    event: "Abnormal request frequency",
    source: "172.16.4.7",
    action: "FLAG",
    severity: "HIGH",
  },
  {
    id: "LOG-003",
    timestamp: "2026-09-29 14:24:17",
    type: "AUTH",
    event: "Administrator session started",
    source: "localhost",
    action: "LOGIN",
    severity: "LOW",
  },
  {
    id: "LOG-004",
    timestamp: "2026-09-29 14:17:05",
    type: "WAF",
    event: "Path traversal blocked",
    source: "192.168.7.91",
    action: "BLOCK",
    severity: "CRITICAL",
  },
  {
    id: "LOG-005",
    timestamp: "2026-09-29 13:58:29",
    type: "AI",
    event: "Anomaly score exceeded threshold",
    source: "10.8.4.22",
    action: "FLAG",
    severity: "MEDIUM",
  },
];

function Logs() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");

  const filteredLogs = useMemo(() => {
    return logData.filter((log) => {
      const matchesSearch =
        log.event.toLowerCase().includes(search.toLowerCase()) ||
        log.source.toLowerCase().includes(search.toLowerCase());

      const matchesType =
        type === "All" || log.type === type;

      return matchesSearch && matchesType;
    });
  }, [search, type]);

  const rows = filteredLogs.map((log) => ({
    id: log.id,
    timestamp: (
      <div className="log-time">
        <strong>{log.timestamp}</strong>
        <span>{log.id}</span>
      </div>
    ),
    type: (
      <span className="log-type">
        {log.type}
      </span>
    ),
    event: log.event,
    source: log.source,
    action: (
      <span
        className={`log-action ${log.action.toLowerCase()}`}
      >
        {log.action}
      </span>
    ),
    severity: (
      <span
        className={`log-severity ${log.severity.toLowerCase()}`}
      >
        {log.severity}
      </span>
    ),
  }));

  const columns = [
    { key: "timestamp", label: "Timestamp" },
    { key: "type", label: "Source" },
    { key: "event", label: "Event" },
    { key: "source", label: "Origin" },
    { key: "action", label: "Action" },
    { key: "severity", label: "Severity" },
  ];

  return (
    <section className="logs-module">
      <div className="logs-header-panel">
        <div>
          <span className="panel-kicker">SECURITY AUDIT TRAIL</span>
          <h2>Structured Security Logs</h2>
          <p>
            Centralized records for security, authentication and monitoring
            activity.
          </p>
        </div>

        <button type="button" className="btn logs-export">
          Export Logs
        </button>
      </div>

      <div className="logs-filters">
        <div className="logs-search">
          <span>⌕</span>
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search logs..."
          />
        </div>

        <select
          className="form-select"
          value={type}
          onChange={(event) => setType(event.target.value)}
        >
          <option>All</option>
          <option>WAF</option>
          <option>IDS</option>
          <option>AI</option>
          <option>AUTH</option>
        </select>
      </div>

      <div className="logs-table-panel">
        <SecurityTable
          columns={columns}
          rows={rows}
          emptyMessage="No logs match the current filters."
        />
      </div>
    </section>
  );
}

export default Logs;