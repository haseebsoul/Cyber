/**
 * IPReputation.jsx
 * ---------------------------------------------------------
 * IP reputation lookup page.
 *
 * Simple flow:
 *   1. User types an IP (or clicks a sample chip)
 *   2. We look it up in a local database
 *   3. If found → show result card with risk score
 *   4. If not found → show a default response
 *
 * No giant empty state — just a small hint line.
 */

import { useState } from "react";
import "./IPReputation.css";

// ---------- Local IP database ----------
const IP_DATABASE = {
  "185.220.101.4": { country: "Russia",   isp: "Unknown", risk: 94, status: "Malicious",  category: "Botnet",     events: 47 },
  "45.142.212.61": { country: "Bulgaria", isp: "Unknown", risk: 76, status: "Suspicious", category: "Scanner",    events: 23 },
  "103.75.11.201": { country: "China",    isp: "Aliyun",  risk: 68, status: "Suspicious", category: "Scanner",    events: 15 },
  "192.168.1.45":  { country: "Local",    isp: "LAN",     risk: 12, status: "Safe",       category: "Internal",   events: 3  },
  "10.0.0.12":     { country: "Local",    isp: "LAN",     risk: 5,  status: "Safe",       category: "Internal",   events: 0  },
};

const SAMPLE_IPS = [
  "185.220.101.4",
  "45.142.212.61",
  "103.75.11.201",
  "192.168.1.45",
  "10.0.0.12",
];

// Returns a color name based on risk score
function riskColor(risk) {
  if (risk >= 80) return "critical";
  if (risk >= 60) return "high";
  if (risk >= 30) return "medium";
  return "low";
}

function IPReputation() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const handleLookup = (ip) => {
    setError("");
    setResult(null);

    const clean = ip.trim();
    if (!clean) {
      setError("Please enter an IP address.");
      return;
    }

    const data = IP_DATABASE[clean] || {
      country: "Unknown",
      isp: "Unknown",
      risk: 50,
      status: "Unknown",
      category: "Unclassified",
      events: 0,
    };

    setResult({ ip: clean, ...data });
  };

  return (
    <div className="iprep-page">

      {/* ============ HEADER ============ */}
      <div className="iprep-head">
        <h2 className="iprep-title">IP Reputation</h2>
        <p className="iprep-sub">
          Look up any source IP to see its risk score and history. Use this to
          decide whether to allow, monitor, or block a request source.
        </p>
      </div>

      {/* ============ SEARCH CARD ============ */}
      <div className="iprep-search-card">
        <div className="iprep-label">LOOKUP IP</div>
        <p className="iprep-hint">
          Type an IP address below and press <strong>Check reputation</strong> to
          see its threat score, origin, and history.
        </p>

        <div className="iprep-search-row">
          <div className="iprep-search">
            <i className="bi bi-globe2"></i>
            <input
              type="text"
              placeholder="e.g. 185.220.101.4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleLookup(query)}
            />
          </div>

          <button
            type="button"
            className="iprep-btn"
            onClick={() => handleLookup(query)}
          >
            Check reputation
          </button>
        </div>

        {error && <div className="iprep-error">{error}</div>}

        <div className="iprep-samples">
          <span className="iprep-samples-label">Try one:</span>
          {SAMPLE_IPS.map((ip) => (
            <button
              key={ip}
              type="button"
              className="iprep-sample-chip"
              onClick={() => {
                setQuery(ip);
                handleLookup(ip);
              }}
            >
              {ip}
            </button>
          ))}
        </div>
      </div>

      {/* ============ RESULT CARD ============ */}
      {result && (
        <div className="iprep-result">
          <div className="iprep-result-top">
            <div>
              <div className="iprep-result-label">SOURCE IP</div>
              <div className="iprep-result-ip">{result.ip}</div>
              <div className="iprep-result-status">
                <span className={`iprep-status-dot iprep-status-${riskColor(result.risk)}`}></span>
                {result.status}
              </div>
            </div>

            <div className={`iprep-risk-badge iprep-risk-${riskColor(result.risk)}`}>
              <div className="iprep-risk-value">{result.risk}</div>
              <div className="iprep-risk-label">RISK SCORE</div>
            </div>
          </div>

          <div className="iprep-risk-bar-wrap">
            <div className="iprep-risk-bar-track">
              <div
                className={`iprep-risk-bar iprep-risk-fill-${riskColor(result.risk)}`}
                style={{ width: `${result.risk}%` }}
              />
            </div>
            <div className="iprep-risk-scale">
              <span>0 — Safe</span>
              <span>50 — Monitor</span>
              <span>100 — Dangerous</span>
            </div>
          </div>

          <div className="iprep-meta">
            <div className="iprep-meta-item">
              <div className="iprep-meta-label">Country</div>
              <div className="iprep-meta-value">{result.country}</div>
            </div>
            <div className="iprep-meta-item">
              <div className="iprep-meta-label">ISP</div>
              <div className="iprep-meta-value">{result.isp}</div>
            </div>
            <div className="iprep-meta-item">
              <div className="iprep-meta-label">Category</div>
              <div className="iprep-meta-value">{result.category}</div>
            </div>
            <div className="iprep-meta-item">
              <div className="iprep-meta-label">Events</div>
              <div className="iprep-meta-value">{result.events}</div>
            </div>
            <div className="iprep-meta-item">
              <div className="iprep-meta-label">Status</div>
              <div className="iprep-meta-value">{result.status}</div>
            </div>
          </div>
        </div>
      )}

      {/* ============ SMALL HINT (only when no result) ============ */}
      {!result && (
        <div className="iprep-hint-line">
          <i className="bi bi-info-circle"></i>
          <span>Enter an IP above — or click a sample — to see its reputation.</span>
        </div>
      )}

    </div>
  );
}

export default IPReputation;