import { useState } from "react";
import "./IPReputation.css";

const tokenHeaders = () => ({ Authorization: "Bearer " + localStorage.getItem("token") });

const SAMPLE_IPS = [
  "185.220.101.4",
  "45.142.212.61",
  "103.75.11.201",
  "192.168.1.45",
  "10.0.0.12",
];

// Pick a badge color from the stored risk score; unknown results stay neutral.
function riskColor(risk, status) {
  if (status === "Unknown") return "medium";
  if (risk >= 80) return "critical";
  if (risk >= 60) return "high";
  if (risk >= 30) return "medium";
  return "low";
}

function IPReputation() {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Send the IP to Express; the backend checks local history and saves the score.
  const handleLookup = async (ip) => {
    const clean = ip.trim();
    setQuery(clean);
    setError("");
    setResult(null);

    if (!clean) {
      setError("Please enter an IP address.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/api/ip-reputation/lookup", {
        method: "POST",
        headers: { ...tokenHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ ip: clean }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "IP lookup failed.");
      setResult(data.result);
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  };

  const risk = result?.riskScore ?? 0;
  const color = result ? riskColor(risk, result.status) : "medium";

  return (
    <div className="iprep-page">
      <div className="iprep-head">
        <h2 className="iprep-title">IP Reputation</h2>
        <p className="iprep-sub">
          Check an IP against locally saved threat and event records. This demo does not use live external threat intelligence.
        </p>
      </div>

      <div className="iprep-search-card">
        <div className="iprep-label">LOOKUP IP · MONGODB</div>
        <p className="iprep-hint">
          Enter an IPv4 or IPv6 address. Each lookup saves the calculated local score and lookup count.
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
          <button type="button" className="iprep-btn" disabled={loading} onClick={() => handleLookup(query)}>
            {loading ? "Checking..." : "Check reputation"}
          </button>
        </div>
        {error && <div className="iprep-error">{error}</div>}
        <div className="iprep-samples">
          <span className="iprep-samples-label">Try one:</span>
          {SAMPLE_IPS.map((ip) => (
            <button key={ip} type="button" className="iprep-sample-chip" disabled={loading} onClick={() => handleLookup(ip)}>
              {ip}
            </button>
          ))}
        </div>
      </div>

      {result && (
        <div className="iprep-result">
          <div className="iprep-result-top">
            <div>
              <div className="iprep-result-label">SOURCE IP</div>
              <div className="iprep-result-ip">{result.ip}</div>
              <div className="iprep-result-status">
                <span className={`iprep-status-dot iprep-status-${color}`}></span>
                {result.status}
              </div>
            </div>
            <div className={`iprep-risk-badge iprep-risk-${color}`}>
              <div className="iprep-risk-value">{result.status === "Unknown" ? "N/A" : risk}</div>
              <div className="iprep-risk-label">LOCAL RISK SCORE</div>
            </div>
          </div>

          <div className="iprep-risk-bar-wrap">
            <div className="iprep-risk-bar-track">
              <div className={`iprep-risk-bar iprep-risk-fill-${color}`} style={{ width: `${result.status === "Unknown" ? 0 : risk}%` }} />
            </div>
            <div className="iprep-risk-scale">
              <span>0 — Safe</span><span>50 — Monitor</span><span>100 — Dangerous</span>
            </div>
          </div>

          <div className="iprep-meta">
            <div className="iprep-meta-item"><div className="iprep-meta-label">Country</div><div className="iprep-meta-value">{result.country}</div></div>
            <div className="iprep-meta-item"><div className="iprep-meta-label">ISP</div><div className="iprep-meta-value">{result.isp}</div></div>
            <div className="iprep-meta-item"><div className="iprep-meta-label">Category</div><div className="iprep-meta-value">{result.category}</div></div>
            <div className="iprep-meta-item"><div className="iprep-meta-label">Local records</div><div className="iprep-meta-value">{result.events}</div></div>
            <div className="iprep-meta-item"><div className="iprep-meta-label">Lookups</div><div className="iprep-meta-value">{result.lookupCount}</div></div>
          </div>
          <p className="iprep-hint" style={{ marginTop: "18px", marginBottom: 0 }}>
            {result.status === "Unknown"
              ? "No matching local history was found. Unknown does not mean the IP is safe."
              : "This score is a simple estimate from local threat and event records, not a verified external reputation score."}
          </p>
        </div>
      )}

      {!result && !error && (
        <div className="iprep-hint-line">
          <i className="bi bi-info-circle"></i>
          <span>Enter an IP above—or click a sample—to check and save its local reputation result.</span>
        </div>
      )}
    </div>
  );
}

export default IPReputation;
