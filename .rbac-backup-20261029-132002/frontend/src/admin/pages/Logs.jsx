/** Logs.jsx — shows saved Threat and Event records as one chronological log. */
import { useEffect, useState } from "react";
import "./Logs.css";

const tokenHeaders = () => ({ Authorization: "Bearer " + localStorage.getItem("token") });

const LEVELS = ["All", "ok", "info", "warn", "block", "crit"];
const LEVEL_LABELS = { ok: "OK", info: "INFO", warn: "WARN", block: "BLOCKED", crit: "CRITICAL" };

function Logs() {
  const [logs, setLogs] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    // Load the unified history from the backend when the page opens.
    fetch("http://localhost:5000/api/logs", { headers: tokenHeaders() })
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not load logs.");
        setLogs(data.logs || []);
      })
      .catch(() => setError("Unable to load logs. Check that the backend and MongoDB are running."))
      .finally(() => setLoading(false));
  }, []);

  // Apply the search box and selected level to the fetched records.
  const filteredLogs = logs.filter((log) =>
    log.text.toLowerCase().includes(search.toLowerCase()) &&
    (level === "All" || log.level === level)
  );

  const stats = {
    total: logs.length,
    blocked: logs.filter((log) => log.action === "Blocked").length,
    warnings: logs.filter((log) => log.severity === "High" || log.severity === "Medium").length,
    critical: logs.filter((log) => log.severity === "Critical").length,
  };

  return (
    <div className="logs-page">
      <div className="logs-head">
        <div>
          <h2 className="logs-title">Security Logs</h2>
          <p className="logs-sub">Chronological history combined from saved Events and Threats.</p>
        </div>
        <div className="logs-count">
          <i className="bi bi-file-text"></i> MONGODB DATA · {filteredLogs.length} of {logs.length}
        </div>
      </div>

      <div className="logs-summary">
        <div className="logs-summary-card"><div className="logs-summary-value">{stats.total}</div><div className="logs-summary-label">Total logs</div></div>
        <div className="logs-summary-card"><div className="logs-summary-value">{stats.blocked}</div><div className="logs-summary-label">Blocked</div></div>
        <div className="logs-summary-card"><div className="logs-summary-value">{stats.warnings}</div><div className="logs-summary-label">Warnings</div></div>
        <div className="logs-summary-card"><div className="logs-summary-value">{stats.critical}</div><div className="logs-summary-label">Critical</div></div>
      </div>

      <div className="logs-filters">
        <div className="logs-search">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search log messages" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <div className="logs-level-pills">
          {LEVELS.map((item) => (
            <button key={item} type="button" className={`logs-level-pill ${level === item ? "logs-level-pill-active" : ""}`} onClick={() => setLevel(item)}>
              {item === "All" ? "All" : LEVEL_LABELS[item]}
            </button>
          ))}
        </div>
      </div>

      <div className="logs-terminal">
        <div className="logs-terminal-head">
          <div className="logs-terminal-dots"><span></span><span></span><span></span></div>
          <span className="logs-terminal-file">security.log</span>
        </div>
        <div className="logs-terminal-body">
          {loading && <div className="logs-terminal-empty">Loading logs from MongoDB...</div>}
          {!loading && error && <div className="logs-terminal-empty">{error}</div>}
          {!loading && !error && filteredLogs.length === 0 && <div className="logs-terminal-empty">No logs match your filters.</div>}
          {!loading && !error && filteredLogs.map((log) => (
            <div className="logs-line" key={log.id}>
              <span className="logs-line-time">[{new Date(log.timestamp).toLocaleTimeString()}]</span>
              <span className={`logs-line-badge logs-line-badge-${log.level}`}>{LEVEL_LABELS[log.level]}</span>
              <span className="logs-line-text">{log.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Logs;
