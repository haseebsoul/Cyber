/**
 * Dashboard.jsx
 * ---------------------------------------------------------
 * Admin overview page.
 *
 * Shows 3 things:
 *   1. 4 KPI cards (Threats, Blocked, High Severity, Events)
 *   2. A bar chart showing threat activity per hour
 *   3. A table of recent security events
 *
 * All data is mock for now — later it will come from the backend.
 */

import "./Dashboard.css";

// ---------- KPI card data ----------
// Each object represents one summary card at the top
const STATS = [
  {
    label: "Threats Detected",
    value: "128",
    sub: "Last 24h",
    trend: "+12%",
    trendType: "up",
    icon: "⚠️",
  },
  {
    label: "Requests Blocked",
    value: "96",
    sub: "Last 24h",
    trend: "+8%",
    trendType: "up",
    icon: "🚫",
  },
  {
    label: "High Severity",
    value: "17",
    sub: "Last 24h",
    trend: "-4%",
    trendType: "down",
    icon: "🛡️",
  },
  {
    label: "Events Logged",
    value: "2847",
    sub: "Last 24h",
    trend: "+21%",
    trendType: "up",
    icon: "📄",
  },
];

// ---------- Chart data ----------
// value determines the bar height, label is shown below the bar
const CHART = [
  { label: "00", value: 12 },
  { label: "02", value: 8  },
  { label: "04", value: 5  },
  { label: "06", value: 14 },
  { label: "08", value: 28 },
  { label: "10", value: 42 },
  { label: "12", value: 58 },
  { label: "14", value: 71 },  // peak hour
  { label: "16", value: 64 },
  { label: "18", value: 48 },
  { label: "20", value: 33 },
  { label: "22", value: 22 },
];

// ---------- Recent events ----------
// Each row in the events table
const EVENTS = [
  { time: "14:32:08", name: "SQL Injection",       severity: "High",     ip: "185.220.101.4",  action: "Blocked"   },
  { time: "14:28:41", name: "XSS Attempt",         severity: "Medium",   ip: "45.142.212.61",  action: "Blocked"   },
  { time: "14:22:19", name: "Path Traversal",      severity: "High",     ip: "103.75.11.201",  action: "Blocked"   },
  { time: "14:15:07", name: "Rate Limit Exceeded", severity: "Low",      ip: "192.168.1.45",   action: "Throttled" },
  { time: "14:08:52", name: "Anomaly Detected",    severity: "Critical", ip: "45.142.212.61",  action: "Review"    },
  { time: "14:02:11", name: "Normal Request",      severity: "Low",      ip: "10.0.0.12",      action: "Allowed"   },
];

function Dashboard() {
  // Highest value in the chart — used to calculate bar heights
  const maxChartValue = Math.max(...CHART.map((item) => item.value));

  return (
    <div className="dashboard">

      {/* ==================== HEADER ==================== */}
      <div className="dashboard-head">
        <div>
          <h2 className="dashboard-title">Overview</h2>
          <p className="dashboard-sub">
            Security activity across the last 24 hours. Data is mock for now.
          </p>
        </div>
        <div className="dashboard-live">
          <span className="dashboard-live-dot"></span>
          Live · demo data
        </div>
      </div>

      {/* ==================== KPI CARDS ==================== */}
      <div className="dashboard-stats">
        {STATS.map((item) => (
          <div className="dashboard-stat" key={item.label}>
            {/* Top row: icon + trend pill */}
            <div className="dashboard-stat-top">
              <span className="dashboard-stat-icon">{item.icon}</span>
              <span className={`dashboard-stat-trend dashboard-trend-${item.trendType}`}>
                {item.trendType === "up" ? "↑" : "↓"} {item.trend}
              </span>
            </div>

            {/* Big number */}
            <div className="dashboard-stat-value">{item.value}</div>

            {/* Label + sub-label */}
            <div className="dashboard-stat-label">{item.label}</div>
            <div className="dashboard-stat-sub">{item.sub}</div>
          </div>
        ))}
      </div>

      {/* ==================== CHART ==================== */}
      <div className="dashboard-card">
        <div className="dashboard-card-head">
          <div>
            <h3 className="dashboard-card-title">Threat activity</h3>
            <p className="dashboard-card-sub">Last 24 hours · hourly</p>
          </div>
          <div className="dashboard-legend">
            <span className="dashboard-legend-dot"></span>
            <span>threats</span>
          </div>
        </div>

        <div className="dashboard-chart">
          {CHART.map((bar) => {
            // Bar height as a percentage of the tallest bar
            const heightPercent = (bar.value / maxChartValue) * 100;
            const isPeak = bar.value === maxChartValue;

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

      {/* ==================== EVENTS TABLE ==================== */}
      <div className="dashboard-card">
        <div className="dashboard-card-head">
          <div>
            <h3 className="dashboard-card-title">Recent security events</h3>
            <p className="dashboard-card-sub">Newest first</p>
          </div>
          <button type="button" className="dashboard-viewall">
            View all →
          </button>
        </div>

        <div className="dashboard-table">

          {/* Table header */}
          <div className="dashboard-table-head">
            <span>Time</span>
            <span>Event</span>
            <span>Severity</span>
            <span>Source IP</span>
            <span>Action</span>
          </div>

          {/* Table rows */}
          <div className="dashboard-table-body">
            {EVENTS.map((event) => (
              <div className="dashboard-table-row" key={`${event.time}-${event.name}`}>
                <span className="dashboard-time">{event.time}</span>
                <span className="dashboard-event">{event.name}</span>
                <span>
                  <span className={`dashboard-pill dashboard-pill-${event.severity.toLowerCase()}`}>
                    {event.severity}
                  </span>
                </span>
                <span className="dashboard-ip">{event.ip}</span>
                <span>
                  <span className={`dashboard-pill dashboard-pill-${event.action.toLowerCase()}`}>
                    {event.action}
                  </span>
                </span>
              </div>
            ))}
          </div>

        </div>
      </div>

    </div>
  );
}

export default Dashboard;