import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import "./Dashboard.css";

const EMPTY_CHART = Array.from({ length: 12 }, (_, index) => ({
  label: String(index * 2).padStart(2, "0"),
  value: 0,
}));

function Dashboard() {
  const navigate = useNavigate();

  // These values are replaced by data returned from MongoDB.
  const [stats, setStats] = useState(null);
  const [chart, setChart] = useState(EMPTY_CHART);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Fetch dashboard data once when the page opens.
  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/dashboard/stats");
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load dashboard data.");
        }

        setStats(result.stats);
        setChart(result.hourlyThreats || EMPTY_CHART);
        setEvents(result.recentEvents || []);
      } catch (err) {
        setError(err.message || "Cannot connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    loadDashboard();
  }, []);

  // Use 1 as the minimum to avoid dividing by zero when the chart is empty.
  const maxChartValue = Math.max(...chart.map((item) => item.value), 1);

  // Format MongoDB's creation date for the recent-events table.
  const formatTime = (date) => {
    if (!date) return "—";
    return new Date(date).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    });
  };

  const cards = [
    {
      label: "Threats Detected",
      value: stats?.threatsDetected,
      sub: "All recorded threats",
      icon: "⚠️",
    },
    {
      label: "Requests Blocked",
      value: stats?.requestsBlocked,
      sub: "Threats with Blocked action",
      icon: "🚫",
    },
    {
      label: "High Severity",
      value: stats?.highSeverity,
      sub: "High + Critical threats",
      icon: "🛡️",
    },
    {
      label: "Events Logged",
      value: stats?.eventsLogged,
      sub: "All saved events",
      icon: "📄",
    },
  ];

  return (
    <div className="dashboard">
      {/* Page heading and data status. */}
      <div className="dashboard-head">
        <div>
          <h2 className="dashboard-title">Overview</h2>
          <p className="dashboard-sub">
            Dashboard counts come from saved MongoDB records.
          </p>
        </div>
        <div className="dashboard-live">
          <span className="dashboard-live-dot"></span>
          MongoDB · live data
        </div>
      </div>

      {/* Show loading or connection errors without hiding the page layout. */}
      {loading && <p role="status">Loading dashboard data...</p>}
      {error && (
        <p role="alert" style={{ color: "#b91c1c", marginBottom: 16 }}>
          {error}
        </p>
      )}

      {/* KPI cards use real database counts, not hardcoded demo numbers. */}
      <div className="dashboard-stats">
        {cards.map((item) => (
          <div className="dashboard-stat" key={item.label}>
            <div className="dashboard-stat-top">
              <span className="dashboard-stat-icon">{item.icon}</span>
              <span className="dashboard-stat-trend">DB</span>
            </div>
            <div className="dashboard-stat-value">
              {stats ? item.value : "—"}
            </div>
            <div className="dashboard-stat-label">{item.label}</div>
            <div className="dashboard-stat-sub">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* Chart uses threat records created in the last 24 hours, grouped by 2-hour UTC buckets. */}
      <div className="dashboard-card">
        <div className="dashboard-card-head">
          <div>
            <h3 className="dashboard-card-title">Threat activity</h3>
            <p className="dashboard-card-sub">Last 24 hours · 2-hour UTC buckets</p>
          </div>
          <div className="dashboard-legend">
            <span className="dashboard-legend-dot"></span>
            <span>threats</span>
          </div>
        </div>

        <div className="dashboard-chart">
          {chart.map((bar) => {
            const heightPercent = (bar.value / maxChartValue) * 100;
            const isPeak = bar.value > 0 && bar.value === maxChartValue;

            return (
              <div className="dashboard-bar-wrap" key={bar.label}>
                <div className="dashboard-bar-track">
                  <div
                    className={`dashboard-bar ${isPeak ? "dashboard-bar-peak" : ""}`}
                    style={{ height: `${heightPercent}%` }}
                    title={`${bar.value} threats`}
                  />
                </div>
                <div className="dashboard-bar-label">{bar.label}</div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Show the six newest saved events from MongoDB. */}
      <div className="dashboard-card">
        <div className="dashboard-card-head">
          <div>
            <h3 className="dashboard-card-title">Recent security events</h3>
            <p className="dashboard-card-sub">Newest first</p>
          </div>
          <button
            type="button"
            className="dashboard-viewall"
            onClick={() => navigate("/admin/events")}
          >
            View all →
          </button>
        </div>

        <div className="dashboard-table">
          <div className="dashboard-table-head">
            <span>Time</span>
            <span>Event</span>
            <span>Severity</span>
            <span>Source IP</span>
            <span>Action</span>
          </div>

          <div className="dashboard-table-body">
            {!loading && events.length === 0 && (
              <div style={{ padding: 24, color: "var(--muted)" }}>
                No saved events yet.
              </div>
            )}

            {events.map((event) => {
              const severity = event.level || "Low";
              const action = event.action || "Review";

              return (
                <div className="dashboard-table-row" key={event._id}>
                  <span className="dashboard-time">{formatTime(event.createdAt)}</span>
                  <span className="dashboard-event">{event.name}</span>
                  <span>
                    <span className={`dashboard-pill dashboard-pill-${severity.toLowerCase()}`}>
                      {severity}
                    </span>
                  </span>
                  <span className="dashboard-ip">{event.sourceIp}</span>
                  <span>
                    <span className={`dashboard-pill dashboard-pill-${action.toLowerCase()}`}>
                      {action}
                    </span>
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
