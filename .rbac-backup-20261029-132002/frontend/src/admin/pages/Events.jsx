import { useEffect, useState } from "react";
import "./Events.css";

const API_URL = "http://localhost:5000/api/events";
const LEVELS = ["All", "Low", "Medium", "High", "Critical"];
const tokenHeaders = () => ({ Authorization: "Bearer " + localStorage.getItem("token") });

function formatTime(event) {
  const value = event.createdAt || event.updatedAt;
  if (!value) return "—";

  const date = new Date(value);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: false,
      });
}

function Events() {
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState("");
  const [level, setLevel] = useState("All");
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  // Load saved events from MongoDB when this page opens.
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const response = await fetch(API_URL, { headers: tokenHeaders() });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load events.");
        }

        setEvents(Array.isArray(result.events) ? result.events : []);
        setPageError("");
      } catch (error) {
        setPageError(error.message || "Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    loadEvents();
  }, []);

  // Search by event name or IP and optionally filter by level.
  const filteredEvents = events.filter((event) => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      (event.name || "").toLowerCase().includes(searchValue) ||
      (event.sourceIp || "").toLowerCase().includes(searchValue);
    const matchesLevel = level === "All" || event.level === level;
    return matchesSearch && matchesLevel;
  });

  const stats = {
    total: events.length,
    critical: events.filter((event) => event.level === "Critical").length,
    high: events.filter((event) => event.level === "High").length,
    blocked: events.filter((event) => event.action === "Blocked").length,
  };

  return (
    <div className="events-page">
      <div className="events-head">
        <div>
          <h2 className="events-title">Security Events</h2>
          <p className="events-sub">
            Security event records loaded from MongoDB. Search by name or IP, or filter by level.
          </p>
        </div>
        <div className="events-live">
          <span className="events-live-dot"></span>
          MongoDB data
        </div>
      </div>

      {pageError && (
        <p role="alert" style={{ color: "#b91c1c", marginBottom: 12 }}>{pageError}</p>
      )}

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

      <div className="events-filters">
        <div className="events-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by event name or IP"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="events-level-filter"
          value={level}
          onChange={(event) => setLevel(event.target.value)}
        >
          {LEVELS.map((item) => (
            <option key={item} value={item}>
              {item === "All" ? "All levels" : item}
            </option>
          ))}
        </select>
      </div>

      <div className="events-stream-card">
        <div className="events-stream-head">
          <span>Time</span>
          <span>Event</span>
          <span>Level</span>
          <span>Source IP</span>
          <span>Action</span>
        </div>

        <div className="events-stream-body">
          {loading && <div className="events-empty">Loading events from MongoDB...</div>}

          {!loading && !pageError && filteredEvents.length === 0 && (
            <div className="events-empty">
              No saved events match your filters. Events will appear here when created by the backend.
            </div>
          )}

          {!loading && filteredEvents.map((event) => (
            <div className="events-row" key={event._id}>
              <span className="events-time">{formatTime(event)}</span>
              <span className="events-name">{event.name}</span>
              <span>
                <span className={`events-pill events-pill-${(event.level || "low").toLowerCase()}`}>
                  {event.level}
                </span>
              </span>
              <span className="events-ip">{event.sourceIp}</span>
              <span>
                <span className={`events-pill events-pill-${(event.action || "review").toLowerCase()}`}>
                  {event.action || "Review"}
                </span>
              </span>
            </div>
          ))}
        </div>

        {!loading && filteredEvents.length > 0 && (
          <div className="events-stream-foot">
            Showing {filteredEvents.length} of {events.length} events
          </div>
        )}
      </div>
    </div>
  );
}

export default Events;
