import ThreatBadge from "../shared/ThreatBadge";
import SecurityTable from "../shared/SecurityTable";
import "./Events.css";

const events = [
  {
    id: "EVT-1042",
    time: "14:32:08",
    source: "192.168.1.24",
    sourceType: "External Request",
    event: "SQL Injection detected",
    severity: "High",
    sourceEngine: "WAF",
    action: "Blocked",
  },
  {
    id: "EVT-1041",
    time: "14:29:42",
    source: "10.24.8.19",
    sourceType: "Application Request",
    event: "XSS pattern identified",
    severity: "Medium",
    sourceEngine: "WAF",
    action: "Blocked",
  },
  {
    id: "EVT-1040",
    time: "14:24:17",
    source: "172.16.4.7",
    sourceType: "Traffic Pattern",
    event: "Request burst detected",
    severity: "High",
    sourceEngine: "IDS",
    action: "Flagged",
  },
  {
    id: "EVT-1039",
    time: "14:17:05",
    source: "192.168.7.91",
    sourceType: "URL Request",
    event: "Path traversal pattern",
    severity: "Critical",
    sourceEngine: "WAF",
    action: "Blocked",
  },
  {
    id: "EVT-1038",
    time: "13:58:29",
    source: "10.8.4.22",
    sourceType: "Behavior Analysis",
    event: "Anomalous activity",
    severity: "Medium",
    sourceEngine: "AI",
    action: "Flagged",
  },
];

function Events() {
  const rows = events.map((event) => ({
    id: event.id,
    time: (
      <div className="event-time">
        <strong>{event.time}</strong>
        <span>{event.id}</span>
      </div>
    ),
    source: (
      <div className="event-source">
        <strong>{event.source}</strong>
        <span>{event.sourceType}</span>
      </div>
    ),
    event: event.event,
    severity: (
      <ThreatBadge variant={event.severity.toLowerCase()}>
        {event.severity}
      </ThreatBadge>
    ),
    sourceEngine: (
      <span className="engine-pill">{event.sourceEngine}</span>
    ),
    action: (
      <span className={`event-action ${event.action.toLowerCase()}`}>
        {event.action}
      </span>
    ),
  }));

  const columns = [
    { key: "time", label: "Time / ID" },
    { key: "source", label: "Source" },
    { key: "event", label: "Security Event" },
    { key: "severity", label: "Severity" },
    { key: "sourceEngine", label: "Detection" },
    { key: "action", label: "Action" },
  ];

  return (
    <section className="events-module">
      <div className="events-overview">
        <div className="events-overview-card">
          <span>Today's Events</span>
          <strong>342</strong>
          <small>All security sources</small>
        </div>

        <div className="events-overview-card">
          <span>WAF Events</span>
          <strong>214</strong>
          <small>Request inspection</small>
        </div>

        <div className="events-overview-card">
          <span>IDS Events</span>
          <strong>83</strong>
          <small>Behavior monitoring</small>
        </div>

        <div className="events-overview-card">
          <span>AI Signals</span>
          <strong>45</strong>
          <small>Anomaly analysis</small>
        </div>
      </div>

      <div className="events-live-panel">
        <div className="live-header">
          <div>
            <span className="panel-kicker">EVENT STREAM</span>
            <h2>Security Event Timeline</h2>
          </div>

          <div className="live-badge">
            <span />
            Live feed
          </div>
        </div>

        <div className="event-timeline">
          <div className="timeline-line" />

          <div className="timeline-item">
            <div className="timeline-dot critical-dot" />
            <div>
              <strong>Critical event blocked</strong>
              <p>
                WAF stopped a path traversal pattern from 192.168.7.91.
              </p>
            </div>
            <span>14:17</span>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot high-dot" />
            <div>
              <strong>High-risk event detected</strong>
              <p>
                IDS observed a request burst above the configured threshold.
              </p>
            </div>
            <span>14:24</span>
          </div>

          <div className="timeline-item">
            <div className="timeline-dot medium-dot" />
            <div>
              <strong>AI anomaly signal generated</strong>
              <p>
                Behavioral features deviated from the expected request pattern.
              </p>
            </div>
            <span>14:29</span>
          </div>
        </div>
      </div>

      <div className="events-table-panel">
        <SecurityTable columns={columns} rows={rows} />
      </div>
    </section>
  );
}

export default Events;