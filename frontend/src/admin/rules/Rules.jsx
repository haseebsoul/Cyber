import { useState } from "react";
import "./Rules.css";

const initialRules = [
  {
    id: "R-001",
    name: "SQL Injection Protection",
    category: "Injection",
    severity: "High",
    action: "Block",
    enabled: true,
  },
  {
    id: "R-002",
    name: "Cross-Site Scripting",
    category: "XSS",
    severity: "High",
    action: "Block",
    enabled: true,
  },
  {
    id: "R-003",
    name: "Path Traversal",
    category: "File Access",
    severity: "Critical",
    action: "Block",
    enabled: true,
  },
  {
    id: "R-004",
    name: "Request Burst Detection",
    category: "Traffic",
    severity: "Medium",
    action: "Flag",
    enabled: true,
  },
  {
    id: "R-005",
    name: "Suspicious User-Agent",
    category: "HTTP",
    severity: "Low",
    action: "Flag",
    enabled: false,
  },
];

function Rules() {
  const [rules, setRules] = useState(initialRules);

  const toggleRule = (id) => {
    setRules((current) =>
      current.map((rule) =>
        rule.id === id
          ? { ...rule, enabled: !rule.enabled }
          : rule
      )
    );
  };

  return (
    <section className="rules-module">
      <div className="rules-toolbar">
        <div>
          <span className="panel-kicker">DETECTION POLICY</span>
          <h2>Security Detection Rules</h2>
          <p>
            Configure the rules used by the future WAF and IDS engines.
          </p>
        </div>

        <button type="button" className="btn add-rule-button">
          + Add Rule
        </button>
      </div>

      <div className="rules-summary">
        <div>
          <span>Total Rules</span>
          <strong>{rules.length}</strong>
        </div>

        <div>
          <span>Enabled</span>
          <strong>{rules.filter((rule) => rule.enabled).length}</strong>
        </div>

        <div>
          <span>Blocked Actions</span>
          <strong>
            {rules.filter((rule) => rule.action === "Block").length}
          </strong>
        </div>

        <div>
          <span>Flag Actions</span>
          <strong>
            {rules.filter((rule) => rule.action === "Flag").length}
          </strong>
        </div>
      </div>

      <div className="rules-list-panel">
        {rules.map((rule) => (
          <div className="rule-row" key={rule.id}>
            <div className="rule-status">
              <span
                className={`rule-status-dot ${
                  rule.enabled ? "enabled" : "disabled"
                }`}
              />
            </div>

            <div className="rule-main">
              <strong>{rule.name}</strong>
              <span>
                {rule.id} · {rule.category}
              </span>
            </div>

            <div className="rule-severity">
              {rule.severity}
            </div>

            <div className="rule-action">
              {rule.action}
            </div>

            <button
              type="button"
              className={`rule-toggle ${
                rule.enabled ? "on" : ""
              }`}
              onClick={() => toggleRule(rule.id)}
              aria-label={`Toggle ${rule.name}`}
            >
              <span />
            </button>
          </div>
        ))}
      </div>
    </section>
  );
}

export default Rules;