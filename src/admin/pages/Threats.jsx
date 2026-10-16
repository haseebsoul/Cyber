/**
 * Threats.jsx
 * ---------------------------------------------------------
 * Security threats page.
 *
 * What you can do here:
 *   1. See all detected threats in a table
 *   2. Search threats by name or IP address
 *   3. Filter threats by severity (Low, Medium, High, Critical)
 *   4. Click "Review" on any threat to see its full details
 *      in a popup window (modal)
 *
 * All data is local for now. Later, /api/threats will provide it.
 */

import { useState } from "react";
import "./Threats.css";

// ---------- Threat list ----------
// Each threat has: id, time, name, severity, sourceIp, action
const THREATS = [
  { id: 1, time: "14:32:08", name: "SQL Injection",       severity: "Critical", sourceIp: "185.220.101.4", action: "Blocked"   },
  { id: 2, time: "14:28:41", name: "XSS Attempt",         severity: "High",     sourceIp: "45.142.212.61", action: "Blocked"   },
  { id: 3, time: "14:22:19", name: "Path Traversal",      severity: "High",     sourceIp: "103.75.11.201", action: "Blocked"   },
  { id: 4, time: "14:15:07", name: "Rate Limit Exceeded", severity: "Low",      sourceIp: "192.168.1.45",  action: "Throttled" },
  { id: 5, time: "14:08:52", name: "Anomaly Detected",    severity: "Critical", sourceIp: "45.142.212.61", action: "Review"    },
  { id: 6, time: "14:02:11", name: "Command Injection",   severity: "High",     sourceIp: "185.220.101.4", action: "Blocked"   },
  { id: 7, time: "13:55:33", name: "Malformed Request",   severity: "Low",      sourceIp: "10.0.0.12",     action: "Allowed"   },
  { id: 8, time: "13:47:12", name: "Brute Force",         severity: "Medium",   sourceIp: "45.142.212.61", action: "Blocked"   },
];

const SEVERITIES = ["All", "Low", "Medium", "High", "Critical"];

function Threats() {
  // ---------- State ----------
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [selectedThreat, setSelectedThreat] = useState(null); // for Review modal

  // ---------- Filtering ----------
  const filteredThreats = THREATS.filter((threat) => {
    const matchesSearch =
      threat.name.toLowerCase().includes(search.toLowerCase()) ||
      threat.sourceIp.toLowerCase().includes(search.toLowerCase());

    const matchesSeverity =
      severity === "All" || threat.severity === severity;

    return matchesSearch && matchesSeverity;
  });

  // ---------- Summary counts ----------
  const stats = {
    total:    THREATS.length,
    blocked:  THREATS.filter((t) => t.action === "Blocked").length,
    review:   THREATS.filter((t) => t.action === "Review").length,
    critical: THREATS.filter((t) => t.severity === "Critical").length,
  };

  return (
    <div className="threats-page">

      {/* ============ PAGE HEADER ============ */}
      <div className="threats-head">
        <div>
          <h2 className="threats-title">Threats</h2>
          <p className="threats-sub">
            Review detected threats across the platform. Filter by severity,
            search by name or IP, or click <strong>Review</strong> on any
            threat to see full details.
          </p>
        </div>
      </div>

      {/* ============ SUMMARY CARDS ============ */}
      <div className="threats-summary">
        <div className="threats-summary-card">
          <div className="threats-summary-value">{stats.total}</div>
          <div className="threats-summary-label">Total Threats</div>
        </div>
        <div className="threats-summary-card">
          <div className="threats-summary-value">{stats.blocked}</div>
          <div className="threats-summary-label">Blocked</div>
        </div>
        <div className="threats-summary-card">
          <div className="threats-summary-value">{stats.review}</div>
          <div className="threats-summary-label">In Review</div>
        </div>
        <div className="threats-summary-card">
          <div className="threats-summary-value">{stats.critical}</div>
          <div className="threats-summary-label">Critical</div>
        </div>
      </div>

      {/* ============ SEARCH + FILTER ============ */}
      <div className="threats-filters">
        <div className="threats-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by threat name or source IP"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="threats-severity-filter"
          value={severity}
          onChange={(e) => setSeverity(e.target.value)}
        >
          {SEVERITIES.map((level) => (
            <option key={level} value={level}>
              {level === "All" ? "All severities" : level}
            </option>
          ))}
        </select>
      </div>

      {/* ============ TABLE ============ */}
      <div className="threats-table-card">

        <div className="threats-table-head">
          <span>Time</span>
          <span>Threat</span>
          <span>Severity</span>
          <span>Source IP</span>
          <span>Action</span>
          <span></span>
        </div>

        <div className="threats-table-body">

          {filteredThreats.length === 0 && (
            <div className="threats-empty">
              No threats match your filters. Try clearing the search or
              changing the severity.
            </div>
          )}

          {filteredThreats.map((threat) => (
            <div className="threats-row" key={threat.id}>
              <span className="threats-time">{threat.time}</span>
              <span className="threats-name">{threat.name}</span>
              <span>
                <span className={`threats-pill threats-pill-${threat.severity.toLowerCase()}`}>
                  {threat.severity}
                </span>
              </span>
              <span className="threats-ip">{threat.sourceIp}</span>
              <span>
                <span className={`threats-pill threats-pill-${threat.action.toLowerCase()}`}>
                  {threat.action}
                </span>
              </span>
              <button
                type="button"
                className="threats-review-btn"
                onClick={() => setSelectedThreat(threat)}
              >
                Review
              </button>
            </div>
          ))}

        </div>

        {filteredThreats.length > 0 && (
          <div className="threats-table-foot">
            Showing {filteredThreats.length} of {THREATS.length} threats
          </div>
        )}

      </div>

      {/* ============ REVIEW MODAL ============ */}
      {selectedThreat && (
        <div className="threats-modal-backdrop" onClick={() => setSelectedThreat(null)}>
          <div className="threats-modal" onClick={(e) => e.stopPropagation()}>

            <div className="threats-modal-head">
              <h3 className="threats-modal-title">Threat Details</h3>
              <button
                type="button"
                className="threats-modal-close"
                onClick={() => setSelectedThreat(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="threats-modal-body">

              <div className="threats-detail-row">
                <span className="threats-detail-label">Threat name</span>
                <span className="threats-detail-value">{selectedThreat.name}</span>
              </div>

              <div className="threats-detail-row">
                <span className="threats-detail-label">Severity level</span>
                <span className={`threats-pill threats-pill-${selectedThreat.severity.toLowerCase()}`}>
                  {selectedThreat.severity}
                </span>
              </div>

              <div className="threats-detail-row">
                <span className="threats-detail-label">Detected at</span>
                <span className="threats-detail-value mono">{selectedThreat.time}</span>
              </div>

              <div className="threats-detail-row">
                <span className="threats-detail-label">Source IP</span>
                <span className="threats-detail-value mono">{selectedThreat.sourceIp}</span>
              </div>

              <div className="threats-detail-row">
                <span className="threats-detail-label">Action taken</span>
                <span className={`threats-pill threats-pill-${selectedThreat.action.toLowerCase()}`}>
                  {selectedThreat.action}
                </span>
              </div>

              <div className="threats-modal-note">
                <i className="bi bi-info-circle"></i>
                <span>
                  This is a demonstration record. Real threat details will
                  come from the backend API once connected.
                </span>
              </div>

            </div>

            <div className="threats-modal-foot">
              <button
                type="button"
                className="threats-modal-btn-secondary"
                onClick={() => setSelectedThreat(null)}
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Threats;