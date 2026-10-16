/**
 * HowItWorks.jsx
 * ---------------------------------------------------------
 * Numbered capabilities list — 01 to 05.
 * Each row has a number, title, description, and a small icon.
 * All data comes from a simple array — easy to modify.
 */

import "./HowItWorks.css";

// The 5 capabilities — data-driven, so we just loop over them
const CAPABILITIES = [
  {
    number: "01",
    title: "Web Application Firewall",
    description:
      "Inspects incoming web requests and identifies suspicious traffic patterns before they reach the application.",
  },
  {
    number: "02",
    title: "Real-Time Threat Detection",
    description:
      "Streams every request through the detection layer, surfacing suspicious activity as it happens.",
  },
  {
    number: "03",
    title: "AI Anomaly Analysis",
    description:
      "Evaluates behavior against expected patterns and flags deviations that may indicate an attack.",
  },
  {
    number: "04",
    title: "SOC Security Dashboard",
    description:
      "Centralizes alerts, blocked requests, and monitored events into one analyst-friendly view.",
  },
  {
    number: "05",
    title: "IP Risk & Reputation",
    description:
      "Scores source IPs by risk and reputation to support faster triage and response decisions.",
  },
];

function HowItWorks() {
  return (
    <section id="features" className="capabilities-section">
      <div className="container">

        {/* Section header */}
        <div className="capabilities-head">
          <span className="section-eyebrow">Capabilities</span>
          <h2 className="section-title">
            Everything you need.<br />
            <span className="section-title-muted">Nothing you don't.</span>
          </h2>
        </div>

        {/* List of capabilities */}
        <div className="capabilities-list">
          {CAPABILITIES.map((item) => (
            <div className="capabilities-item" key={item.number}>

              <div className="capabilities-number">{item.number}</div>

              <div className="capabilities-body">
                <h3 className="capabilities-title">{item.title}</h3>
                <p className="capabilities-text">{item.description}</p>
              </div>

            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default HowItWorks;