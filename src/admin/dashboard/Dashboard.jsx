import StatCard from "../shared/StatCard";
import ThreatBadge from "../shared/ThreatBadge";
import SecurityTable from "../shared/SecurityTable";
import "./Dashboard.css";

const threatActivity = [
  { day: "Mon", value: 42 },
  { day: "Tue", value: 61 },
  { day: "Wed", value: 48 },
  { day: "Thu", value: 75 },
  { day: "Fri", value: 57 },
  { day: "Sat", value: 88 },
  { day: "Sun", value: 69 },
];

const recentEvents = [
  {
    id: "evt-001",
    time: "14:32:08",
    source: "192.168.1.24",
    threat: "SQL Injection",
    severity: <ThreatBadge variant="high">High</ThreatBadge>,
    action: "Blocked",
  },
  {
    id: "evt-002",
    time: "14:29:42",
    source: "10.24.8.19",
    threat: "XSS Attempt",
    severity: <ThreatBadge variant="medium">Medium</ThreatBadge>,
    action: "Blocked",
  },
  {
    id: "evt-003",
    time: "14:24:17",
    source: "172.16.4.7",
    threat: "Abnormal Traffic",
    severity: <ThreatBadge variant="high">High</ThreatBadge>,
    action: "Flagged",
  },
  {
    id: "evt-004",
    time: "14:20:53",
    source: "192.168.4.11",
    threat: "Normal Request",
    severity: <ThreatBadge variant="low">Low</ThreatBadge>,
    action: "Allowed",
  },
];

const columns = [
  { key: "time", label: "Time" },
  { key: "source", label: "Source IP" },
  { key: "threat", label: "Event" },
  { key: "severity", label: "Severity" },
  { key: "action", label: "Action" },
];

function Dashboard() {
  return (
    <section className="dashboard-module">
      <div className="dashboard-alert">
        <div className="dashboard-alert-icon">🛡️</div>

        <div>
          <strong>Security control plane operational</strong>
          <p>
            WAF, IDS, anomaly analysis and monitoring interfaces are ready
            for backend integration.
          </p>
        </div>

        <span className="dashboard-alert-status">
          Operational
        </span>
      </div>

      <div className="row g-3">
        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="🚨"
            label="Total Threats"
            value="128"
            trend="+12%"
            trendType="up"
            detail="Compared with previous period"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="🛡️"
            label="Blocked Requests"
            value="96"
            trend="+8%"
            trendType="up"
            detail="Requests stopped by WAF rules"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="⚠️"
            label="High-Risk Events"
            value="17"
            trend="5 active"
            trendType="neutral"
            detail="Requires analyst attention"
          />
        </div>

        <div className="col-12 col-sm-6 col-xl-3">
          <StatCard
            icon="🤖"
            label="Anomaly Score"
            value="84%"
            trend="Stable"
            trendType="neutral"
            detail="Current demo telemetry"
          />
        </div>
      </div>

      <div className="row g-3 mt-1">
        <div className="col-12 col-xl-8">
          <div className="dashboard-panel h-100">
            <div className="dashboard-panel-header">
              <div>
                <span className="panel-kicker">SECURITY TELEMETRY</span>
                <h2>Threat Activity</h2>
              </div>

              <span className="panel-period">Last 7 days</span>
            </div>

            <div className="activity-chart">
              {threatActivity.map((item) => (
                <div className="chart-column" key={item.day}>
                  <div className="chart-value">{item.value}</div>

                  <div className="chart-track">
                    <div
                      className="chart-bar"
                      style={{ height: `${item.value}%` }}
                    />
                  </div>

                  <span>{item.day}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="dashboard-panel h-100">
            <div className="dashboard-panel-header">
              <div>
                <span className="panel-kicker">RISK DISTRIBUTION</span>
                <h2>Threat Severity</h2>
              </div>
            </div>

            <div className="severity-list">
              <div className="severity-row">
                <div>
                  <span>Critical</span>
                  <strong>8%</strong>
                </div>
                <div className="severity-track">
                  <span className="severity-fill critical" style={{ width: "8%" }} />
                </div>
              </div>

              <div className="severity-row">
                <div>
                  <span>High</span>
                  <strong>24%</strong>
                </div>
                <div className="severity-track">
                  <span className="severity-fill high" style={{ width: "24%" }} />
                </div>
              </div>

              <div className="severity-row">
                <div>
                  <span>Medium</span>
                  <strong>38%</strong>
                </div>
                <div className="severity-track">
                  <span className="severity-fill medium" style={{ width: "38%" }} />
                </div>
              </div>

              <div className="severity-row">
                <div>
                  <span>Low</span>
                  <strong>30%</strong>
                </div>
                <div className="severity-track">
                  <span className="severity-fill low" style={{ width: "30%" }} />
                </div>
              </div>
            </div>

            <div className="risk-summary">
              <span>Current security posture</span>
              <strong>Elevated</strong>
            </div>
          </div>
        </div>
      </div>

      <div className="dashboard-panel dashboard-events-panel mt-3">
        <div className="dashboard-panel-header">
          <div>
            <span className="panel-kicker">SECURITY OPERATIONS</span>
            <h2>Recent Security Events</h2>
          </div>

          <span className="event-count">4 recent events</span>
        </div>

        <SecurityTable columns={columns} rows={recentEvents} />
      </div>
    </section>
  );
}

export default Dashboard;