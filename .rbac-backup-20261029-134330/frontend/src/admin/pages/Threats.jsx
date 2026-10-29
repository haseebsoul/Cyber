import { useEffect, useState } from "react";
import { getSession } from "../../session/SessionManager";
import "./Threats.css";

const API_URL = "http://localhost:5000/api/threats";
const SEVERITIES = ["All", "Low", "Medium", "High", "Critical"];
const tokenHeaders = () => ({ Authorization: "Bearer " + localStorage.getItem("token") });
const normalizeRole = (value) => {
  const role = String(value || "").toLowerCase();
  if (role === "administrator") return "admin";
  if (role === "soc analyst") return "analyst";
  if (role === "security researcher") return "researcher";
  return role;
};

function formatTime(threat) {
  const dateValue = threat.createdAt || threat.updatedAt;
  if (!dateValue) return "—";

  const date = new Date(dateValue);
  return Number.isNaN(date.getTime())
    ? "—"
    : date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false });
}

function Threats() {
  const [threats, setThreats] = useState([]);
  const [search, setSearch] = useState("");
  const [severity, setSeverity] = useState("All");
  const [selectedThreat, setSelectedThreat] = useState(null);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState("");
  const [pageError, setPageError] = useState("");
  const [notice, setNotice] = useState("");

  const session = getSession();
  const role = normalizeRole(session?.role);
  const isResearcher = role === "researcher";
  const canModify = ["admin", "analyst"].includes(role);

  // Load saved threats from MongoDB when the page opens.
  useEffect(() => {
    const loadThreats = async () => {
      try {
        const response = await fetch(API_URL, { headers: tokenHeaders() });
        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.message || "Could not load threats.");
        }

        setThreats(Array.isArray(result.threats) ? result.threats : []);
        setPageError("");
      } catch (error) {
        setPageError(error.message || "Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    loadThreats();
  }, []);

  const filteredThreats = threats.filter((threat) => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      (threat.name || "").toLowerCase().includes(searchValue) ||
      (threat.sourceIp || "").toLowerCase().includes(searchValue);
    const matchesSeverity = severity === "All" || threat.severity === severity;
    return matchesSearch && matchesSeverity;
  });

  // This saves the decision to the threat record; it does not block network traffic.
  const markBlocked = async (threat) => {
    setUpdatingId(threat._id);
    setPageError("");
    setNotice("");

    try {
      const response = await fetch(`${API_URL}/${threat._id}`, {
        method: "PUT",
        headers: { ...tokenHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ action: "Blocked" })
      });
      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.message || "Could not update the threat.");
      }

      setThreats((current) =>
        current.map((item) => item._id === result.threat._id ? result.threat : item)
      );
      setSelectedThreat((current) =>
        current?._id === result.threat._id ? result.threat : current
      );
      setNotice(`Recorded blocked decision for ${result.threat.sourceIp}. This does not enforce a network firewall rule.`);
    } catch (error) {
      setPageError(error.message || "Could not connect to the backend.");
    } finally {
      setUpdatingId("");
    }
  };

  const stats = {
    total: threats.length,
    blocked: threats.filter((threat) => threat.action === "Blocked").length,
    review: threats.filter((threat) => threat.action === "Review").length,
    critical: threats.filter((threat) => threat.severity === "Critical").length,
  };

  return (
    <div className="threats-page">
      <div className="threats-head" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h2 className="threats-title">Threats</h2>
          <p className="threats-sub">
            Review threat records saved in MongoDB. Filter by severity, search by name or IP, or select Review for details.
          </p>
        </div>

        {isResearcher && (
          <span style={{
            padding: "6px 12px",
            backgroundColor: "#f3f4f6",
            border: "1px solid #d1d5db",
            color: "#4b5563",
            borderRadius: "999px",
            fontSize: "0.8rem",
            fontWeight: "600"
          }}>
            <i className="bi bi-eye me-2"></i> Read-Only Mode
          </span>
        )}
      </div>

      {notice && <p role="status" style={{ color: "#15803d", marginBottom: 12 }}>{notice}</p>}
      {pageError && <p role="alert" style={{ color: "#b91c1c", marginBottom: 12 }}>{pageError}</p>}

      <div className="threats-summary">
        <div className="threats-summary-card">
          <div className="threats-summary-value">{stats.total}</div>
          <div className="threats-summary-label">Total Threats</div>
        </div>
        <div className="threats-summary-card">
          <div className="threats-summary-value">{stats.blocked}</div>
          <div className="threats-summary-label">Blocked</div>
        </div>
        <div className="threats-summary-card">
          <div className="threats-summary-value">{stats.review}</div>
          <div className="threats-summary-label">In Review</div>
        </div>
        <div className="threats-summary-card">
          <div className="threats-summary-value">{stats.critical}</div>
          <div className="threats-summary-label">Critical</div>
        </div>
      </div>

      <div className="threats-filters">
        <div className="threats-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by threat name or source IP"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>

        <select
          className="threats-severity-filter"
          value={severity}
          onChange={(event) => setSeverity(event.target.value)}
        >
          {SEVERITIES.map((level) => (
            <option key={level} value={level}>
              {level === "All" ? "All severities" : level}
            </option>
          ))}
        </select>
      </div>

      <div className="threats-table-card">
        <div className="threats-table-head">
          <span>Time</span>
          <span>Threat</span>
          <span>Severity</span>
          <span>Source IP</span>
          <span>Action</span>
          <span>Controls</span>
        </div>

        <div className="threats-table-body">
          {loading && <div className="threats-empty">Loading threats from MongoDB...</div>}

          {!loading && !pageError && filteredThreats.length === 0 && (
            <div className="threats-empty">
              No saved threats match your filters. New records will appear here when they are created by the backend.
            </div>
          )}

          {!loading && filteredThreats.map((threat) => (
            <div className="threats-row" key={threat._id}>
              <span className="threats-time">{formatTime(threat)}</span>
              <span className="threats-name">{threat.name}</span>
              <span>
                <span className={`threats-pill threats-pill-${(threat.severity || "low").toLowerCase()}`}>
                  {threat.severity}
                </span>
              </span>
              <span className="threats-ip">{threat.sourceIp}</span>
              <span>
                <span className={`threats-pill threats-pill-${(threat.action || "review").toLowerCase()}`}>
                  {threat.action || "Review"}
                </span>
              </span>
              <span style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                {canModify && threat.action !== "Blocked" && (
                  <button
                    type="button"
                    className="threats-review-btn"
                    style={{ backgroundColor: "#fee2e2", color: "#dc2626", border: "none" }}
                    onClick={() => markBlocked(threat)}
                    disabled={updatingId === threat._id}
                    title="Record the blocked decision for this threat"
                  >
                    {updatingId === threat._id ? "Saving..." : "Mark blocked"}
                  </button>
                )}
                <button
                  type="button"
                  className="threats-review-btn"
                  onClick={() => setSelectedThreat(threat)}
                >
                  Review
                </button>
              </span>
            </div>
          ))}
        </div>

        {!loading && filteredThreats.length > 0 && (
          <div className="threats-table-foot">
            Showing {filteredThreats.length} of {threats.length} threats
          </div>
        )}
      </div>

      {selectedThreat && (
        <div className="threats-modal-backdrop" onClick={() => setSelectedThreat(null)}>
          <div className="threats-modal" onClick={(event) => event.stopPropagation()}>
            <div className="threats-modal-head">
              <h3 className="threats-modal-title">Threat Details</h3>
              <button
                type="button"
                className="threats-modal-close"
                onClick={() => setSelectedThreat(null)}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="threats-modal-body">
              <div className="threats-detail-row">
                <span className="threats-detail-label">Threat name</span>
                <span className="threats-detail-value">{selectedThreat.name}</span>
              </div>
              <div className="threats-detail-row">
                <span className="threats-detail-label">Severity level</span>
                <span className={`threats-pill threats-pill-${(selectedThreat.severity || "low").toLowerCase()}`}>
                  {selectedThreat.severity}
                </span>
              </div>
              <div className="threats-detail-row">
                <span className="threats-detail-label">Detected at</span>
                <span className="threats-detail-value mono">
                  {selectedThreat.createdAt ? new Date(selectedThreat.createdAt).toLocaleString() : "—"}
                </span>
              </div>
              <div className="threats-detail-row">
                <span className="threats-detail-label">Source IP</span>
                <span className="threats-detail-value mono">{selectedThreat.sourceIp}</span>
              </div>
              <div className="threats-detail-row">
                <span className="threats-detail-label">Action taken</span>
                <span className={`threats-pill threats-pill-${(selectedThreat.action || "review").toLowerCase()}`}>
                  {selectedThreat.action || "Review"}
                </span>
              </div>
              {selectedThreat.method && (
                <div className="threats-detail-row">
                  <span className="threats-detail-label">HTTP method</span>
                  <span className="threats-detail-value mono">{selectedThreat.method}</span>
                </div>
              )}
              {selectedThreat.path && (
                <div className="threats-detail-row">
                  <span className="threats-detail-label">Request path</span>
                  <span className="threats-detail-value mono">{selectedThreat.path}</span>
                </div>
              )}
              {selectedThreat.details && (
                <div className="threats-detail-row">
                  <span className="threats-detail-label">Details</span>
                  <span className="threats-detail-value">{selectedThreat.details}</span>
                </div>
              )}
              <div className="threats-modal-note">
                <i className="bi bi-info-circle"></i>
                <span>
                  This record is stored in MongoDB. The “Mark blocked” action updates its recorded action; actual request blocking needs to be connected to the inspection logic.
                </span>
              </div>
            </div>

            <div className="threats-modal-foot">
              <button
                type="button"
                className="threats-modal-btn-secondary"
                onClick={() => setSelectedThreat(null)}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Threats;
