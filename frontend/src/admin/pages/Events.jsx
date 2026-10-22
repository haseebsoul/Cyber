/**
 * Events.jsx
 * ---------------------------------------------------------
 * Security events stream page.
 *
 * Shows:
 *   - Descriptive header explaining the page
 *   - 4 summary cards (Total, Critical, High, Blocked)
 *   - Search box + Level filter
 *   - A list of security events
 *
 * All data is local. Later, /api/events will provide it.
 */

import { useState } from "react";
import "./Events.css";

// ---------- Event list ----------
// Each event has: id, time, name, level, sourceIp, action
const EVENTS = [
  { id: 1, time: "14:32:08", name: "SQL Injection",       level: "Critical", sourceIp: "185.220.101.4", action: "Blocked"   },
  { id: 2, time: "14:28:41", name: "XSS Attempt",         level: "High",     sourceIp: "45.142.212.61", action: "Blocked"   },
  { id: 3, time: "14:22:19", name: "Path Traversal",      level: "High",     sourceIp: "103.75.11.201", action: "Blocked"   },
  { id: 4, time: "14:15:07", name: "Rate Limit Exceeded", level: "Low",      sourceIp: "192.168.1.45",  action: "Throttled" },
  { id: 5, time: "14:08:52", name: "Anomaly Detected",    level: "Critical", sourceIp: "45.142.212.61", action: "Review"    },
  { id: 6, time: "14:02:11", name: "Normal Request",      level: "Low",      sourceIp: "10.0.0.12",     action: "Allowed"   },
  { id: 7, time: "13:55:33", name: "Brute Force",         level: "Medium",   sourceIp: "45.142.212.61", action: "Blocked"   },
  { id: 8, time: "13:47:12", name: "Command Injection",   level: "High",     sourceIp: "185.220.101.4", action: "Blocked"   },
  { id: 9, time: "13:40:01", name: "Normal Request",      level: "Low",      sourceIp: "10.0.0.45",     action: "Allowed"   },
  { id:10, time: "13:32:28", name: "Suspicious Header",   level: "Medium",   sourceIp: "103.75.11.201", action: "Blocked"   },
];

// Levels available in the filter dropdown
const LEVELS = ["All", "Low", "Medium", "High", "Critical"];

function Events() {
  // ---------- State ----------
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");

  // ---------- Filtering ----------
  const filteredEvents = EVENTS.filter((event) => {
    const matchesSearch =
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.sourceIp.toLowerCase().includes(search.toLowerCase());

    const matchesLevel =
      level === "All" || event.level === level;

    return matchesSearch && matchesLevel;
  });

  // ---------- Summary counts ----------
  const stats = {
    total:    EVENTS.length,
    critical: EVENTS.filter((e) => e.level === "Critical").length,
    high:     EVENTS.filter((e) => e.level === "High").length,
    blocked:  EVENTS.filter((e) => e.action === "Blocked").length,
  };

  return (
    <div className="events-page">

      {/* ============ PAGE HEADER ============ */}
      <div className="events-head">
        <div>
          <h2 className="events-title">Security Events</h2>
          <p className="events-sub">
            Stream of detection events across WAF, IDS, and AI layers.
          </p>
        </div>
        <div className="events-live">
          <span className="events-live-dot"></span>
          Streaming
        </div>
      </div>

      {/* ============ SUMMARY CARDS ============ */}
      <div className="events-summary">
        <div className="events-summary-card">
          <div className="events-summary-value">{stats.total}</div>
          <div className="events-summary-label">Total</div>
        </div>
        <div className="events-summary-card">
          <div className="events-summary-value">{stats.critical}</div>
          <div className="events-summary-label">Critical</div>
        </div>
        <div className="events-summary-card">
          <div className="events-summary-value">{stats.high}</div>
          <div className="events-summary-label">High</div>
        </div>
        <div className="events-summary-card">
          <div className="events-summary-value">{stats.blocked}</div>
          <div className="events-summary-label">Blocked</div>
        </div>
      </div>

      {/* ============ SEARCH + FILTER ============ */}
      <div className="events-filters">
        <div className="events-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by event name or IP"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="events-level-filter"
          value={level}
          onChange={(e) => setLevel(e.target.value)}
        >
          {LEVELS.map((lvl) => (
            <option key={lvl} value={lvl}>
              {lvl === "All" ? "All levels" : lvl}
            </option>
          ))}
        </select>
      </div>

      {/* ============ EVENT STREAM ============ */}
      <div className="events-stream-card">

        <div className="events-stream-head">
          <span>Time</span>
          <span>Event</span>
          <span>Level</span>
          <span>Source IP</span>
          <span>Action</span>
        </div>

        <div className="events-stream-body">

          {filteredEvents.length === 0 && (
            <div className="events-empty">
              No events match your filters.
            </div>
          )}

          {filteredEvents.map((event) => (
            <div className="events-row" key={event.id}>
              <span className="events-time">{event.time}</span>
              <span className="events-name">{event.name}</span>
              <span>
                <span className={`events-pill events-pill-${event.level.toLowerCase()}`}>
                  {event.level}
                </span>
              </span>
              <span className="events-ip">{event.sourceIp}</span>
              <span>
                <span className={`events-pill events-pill-${event.action.toLowerCase()}`}>
                  {event.action}
                </span>
              </span>
            </div>
          ))}

        </div>

        {filteredEvents.length > 0 && (
          <div className="events-stream-foot">
            Showing {filteredEvents.length} of {EVENTS.length} events
          </div>
        )}

      </div>

    </div>
  );
}

export default Events;