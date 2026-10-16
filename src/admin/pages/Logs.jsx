/**
 * Logs.jsx
 * ---------------------------------------------------------
 * SECURITY LOGS page.
 *
 * WHAT THIS PAGE DOES:
 *   - Shows a dark terminal-style log viewer
 *   - Each line has: timestamp, level badge, and message
 *   - User can filter by level (OK / INFO / WARN / BLOCKED / CRITICAL)
 *   - User can search the messages
 *
 * HOW IT WORKS (simple version):
 *   1. All log lines live in a LOGS array (mock data)
 *   2. We keep two pieces of state: search + level filter
 *   3. We filter the logs array based on those two values
 *   4. We render the filtered logs inside a dark terminal card
 */

import { useState } from "react";
import "./Logs.css";

// ---------- MOCK LOG LINES ----------
// Each log has:
//   id    → unique number
//   time  → HH:MM:SS timestamp
//   level → one of: ok, info, warn, block, crit
//   text  → the message being logged
const LOGS = [
  { id:  1, time: "14:32:11", level: "ok",    text: "request allowed · GET /api/products" },
  { id:  2, time: "14:32:08", level: "block", text: "BLOCKED · sqli.pattern matched · src 185.220.101.4" },
  { id:  3, time: "14:31:47", level: "warn",  text: "rate limit near threshold · ip 45.142.212.61" },
  { id:  4, time: "14:30:22", level: "info",  text: "analyst session started · user james" },
  { id:  5, time: "14:28:41", level: "block", text: "BLOCKED · xss.script-tag matched · src 45.142.212.61" },
  { id:  6, time: "14:27:05", level: "ok",    text: "request allowed · POST /api/checkout" },
  { id:  7, time: "14:25:52", level: "warn",  text: "anomaly score 0.71 · ip 45.142.212.61" },
  { id:  8, time: "14:24:11", level: "info",  text: "rule updated · waf.sqli.pattern · by admin" },
  { id:  9, time: "14:22:19", level: "block", text: "BLOCKED · traversal.parent matched · src 103.75.11.201" },
  { id: 10, time: "14:20:03", level: "ok",    text: "request allowed · GET /api/dashboard" },
  { id: 11, time: "14:18:44", level: "info",  text: "scheduled scan completed · 1284 records" },
  { id: 12, time: "14:15:07", level: "warn",  text: "throttled · rate.burst rule · ip 192.168.1.45" },
  { id: 13, time: "14:12:33", level: "ok",    text: "ip reputation updated · 10 new records" },
  { id: 14, time: "14:08:52", level: "crit",  text: "CRITICAL · ai.anomaly · src 45.142.212.61" },
  { id: 15, time: "14:05:19", level: "info",  text: "backup completed · 2.3 GB" },
];

// Levels available in the filter dropdown
const LEVELS = ["All", "ok", "info", "warn", "block", "crit"];

// Human-readable labels for the level badges
const LEVEL_LABELS = {
  ok:    "OK",
  info:  "INFO",
  warn:  "WARN",
  block: "BLOCKED",
  crit:  "CRITICAL",
};

function Logs() {
  // ---------- STATE ----------
  const [search, setSearch] = useState("");   // text typed in the search box
  const [level, setLevel] = useState("All");  // selected level filter

  // ---------- FILTERING ----------
  // Keep logs matching BOTH the search AND the selected level
  const filteredLogs = LOGS.filter((log) => {
    const matchesSearch = log.text.toLowerCase().includes(search.toLowerCase());
    const matchesLevel  = level === "All" || log.level === level;
    return matchesSearch && matchesLevel;
  });

  // ---------- SUMMARY COUNTS ----------
  const stats = {
    total:    LOGS.length,
    blocked:  LOGS.filter((l) => l.level === "block").length,
    warnings: LOGS.filter((l) => l.level === "warn").length,
    critical: LOGS.filter((l) => l.level === "crit").length,
  };

  // ---------- RENDER ----------
  return (
    <div className="logs-page">

      {/* ============ PAGE HEADER ============ */}
      <div className="logs-head">
        <div>
          <h2 className="logs-title">Security Logs</h2>
          <p className="logs-sub">
            Structured security log of every action taken by the platform.
          </p>
        </div>
        <div className="logs-count">
          <i className="bi bi-file-text"></i>
          {filteredLogs.length} of {LOGS.length} entries
        </div>
      </div>

      {/* ============ SUMMARY CARDS ============ */}
      <div className="logs-summary">
        <div className="logs-summary-card">
          <div className="logs-summary-value">{stats.total}</div>
          <div className="logs-summary-label">Total logs</div>
        </div>
        <div className="logs-summary-card">
          <div className="logs-summary-value">{stats.blocked}</div>
          <div className="logs-summary-label">Blocked</div>
        </div>
        <div className="logs-summary-card">
          <div className="logs-summary-value">{stats.warnings}</div>
          <div className="logs-summary-label">Warnings</div>
        </div>
        <div className="logs-summary-card">
          <div className="logs-summary-value">{stats.critical}</div>
          <div className="logs-summary-label">Critical</div>
        </div>
      </div>

      {/* ============ FILTERS ============ */}
      <div className="logs-filters">
        <div className="logs-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search log messages"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="logs-level-pills">
          {LEVELS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              className={`logs-level-pill ${level === lvl ? "logs-level-pill-active" : ""}`}
              onClick={() => setLevel(lvl)}
            >
              {lvl === "All" ? "All" : LEVEL_LABELS[lvl]}
            </button>
          ))}
        </div>
      </div>

      {/* ============ DARK TERMINAL ============ */}
      <div className="logs-terminal">

        {/* Terminal window header */}
        <div className="logs-terminal-head">
          <div className="logs-terminal-dots">
            <span></span><span></span><span></span>
          </div>
          <span className="logs-terminal-file">security.log</span>
        </div>

        {/* Terminal body */}
        <div className="logs-terminal-body">

          {filteredLogs.length === 0 && (
            <div className="logs-terminal-empty">
              No logs match your filters.
            </div>
          )}

          {filteredLogs.map((log) => (
            <div className="logs-line" key={log.id}>
              <span className="logs-line-time">[{log.time}]</span>
              <span className={`logs-line-badge logs-line-badge-${log.level}`}>
                {LEVEL_LABELS[log.level]}
              </span>
              <span className="logs-line-text">{log.text}</span>
            </div>
          ))}

        </div>

      </div>

    </div>
  );
}

export default Logs;