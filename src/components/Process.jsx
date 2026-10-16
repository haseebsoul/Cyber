/**
 * Process.jsx
 * ---------------------------------------------------------
 * "How CyberSentinel Works" — 3 steps.
 * Simple data-driven list. Easy to modify.
 */

import "./Process.css";

const STEPS = [
  {
    number: "01",
    title: "Inspect",
    text: "Incoming requests are examined for suspicious patterns, payloads, and security indicators.",
  },
  {
    number: "02",
    title: "Detect",
    text: "Security rules and anomaly analysis help identify potentially malicious behavior.",
  },
  {
    number: "03",
    title: "Respond",
    text: "Threats can be blocked or flagged while security events are recorded for monitoring.",
  },
];

function Process() {
  return (
    <section id="how-it-works" className="process-section">
      <div className="container">

        <div className="process-head">
          <span className="section-eyebrow">How CyberSentinel Works</span>
          <h2 className="section-title">
            From Suspicious Request<br />to Security Response
          </h2>
          <p className="section-sub">
            CyberSentinel-AI inspects web requests, analyzes behavior, detects
            threats, and records security events to protect modern web applications.
          </p>
        </div>

        <div className="process-grid">
          {STEPS.map((step) => (
            <div className="process-card" key={step.number}>
              <div className="process-number">{step.number}</div>
              <h3 className="process-title">{step.title}</h3>
              <p className="process-text">{step.text}</p>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

export default Process;