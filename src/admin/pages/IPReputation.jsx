import { useState } from 'react';
import './IPReputation.css';

const IP_DATABASE = {
  '185.220.101.4': {
    country: 'Russia', isp: 'Unknown', risk: 94, status: 'Malicious', events: 47, category: 'Botnet',
    description: 'This IP has been linked to coordinated botnet activity. It has made repeated automated requests to login endpoints.',
  },
  '45.142.212.61': {
    country: 'Bulgaria', isp: 'Unknown', risk: 76, status: 'Suspicious', events: 23, category: 'Scanner',
    description: 'This IP performs automated scans across multiple paths, likely looking for vulnerabilities.',
  },
  '103.75.11.201': {
    country: 'China', isp: 'Aliyun', risk: 68, status: 'Suspicious', events: 15, category: 'Scanner',
    description: 'This IP sends rapid requests to admin paths. Typical scanning behaviour.',
  },
  '192.168.1.45': {
    country: 'Local', isp: 'LAN', risk: 12, status: 'Safe', events: 3, category: 'Internal',
    description: 'Internal network address. Normal traffic pattern, no threat activity detected.',
  },
  '10.0.0.12': {
    country: 'Local', isp: 'LAN', risk: 5, status: 'Safe', events: 0, category: 'Internal',
    description: 'Internal network address. No suspicious behaviour recorded.',
  },
};

const RECENT_IPS = [
  '185.220.101.4', '45.142.212.61', '103.75.11.201', '192.168.1.45', '10.0.0.12',
];

function IPReputation() {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const [toast, setToast] = useState('');
  const [blocked, setBlocked] = useState([]);
  const [watchlist, setWatchlist] = useState([]);
  const [showReportModal, setShowReportModal] = useState(false);
  const [report, setReport] = useState({ title: '', severity: 'High', notes: '' });

  const handleLookup = (ip) => {
    setError('');
    setResult(null);
    const clean = ip.trim();

    if (!clean) {
      setError('Please enter an IP address to begin.');
      return;
    }

    const data = IP_DATABASE[clean] || {
      country: 'Unknown', isp: 'Unknown', risk: 50, status: 'Unknown', events: 0, category: 'Unclassified',
      description: 'No historical data available for this IP address.',
    };
    setResult({ ip: clean, ...data });
  };

  const riskColor = (risk) => {
    if (risk >= 80) return 'critical';
    if (risk >= 60) return 'high';
    if (risk >= 30) return 'medium';
    return 'low';
  };

  const riskLabel = (risk) => {
    if (risk >= 80) return 'Dangerous — block recommended';
    if (risk >= 60) return 'Suspicious — review advised';
    if (risk >= 30) return 'Monitor — unusual activity';
    return 'Safe — no action needed';
  };

  // Flash a message for 2.5 seconds
  const flash = (msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2500);
  };

  // ACTION 1 — Block the IP
  const handleBlock = () => {
    if (!result) return;
    if (blocked.includes(result.ip)) {
      flash(`${result.ip} is already blocked`);
      return;
    }
    setBlocked([result.ip, ...blocked]);
    flash(`${result.ip} has been blocked`);
  };

  // ACTION 2 — Add to watchlist
  const handleWatch = () => {
    if (!result) return;
    if (watchlist.includes(result.ip)) {
      flash(`${result.ip} is already on watchlist`);
      return;
    }
    setWatchlist([result.ip, ...watchlist]);
    flash(`${result.ip} added to watchlist`);
  };

  // ACTION 3 — Report modal
  const openReport = () => {
    if (!result) return;
    setReport({
      title: `Threat report — ${result.ip}`,
      severity: result.risk >= 80 ? 'Critical' : result.risk >= 60 ? 'High' : 'Medium',
      notes: `Suspicious activity from ${result.ip} (${result.country}). ${result.description}`,
    });
    setShowReportModal(true);
  };

  const saveReport = () => {
    flash('Report saved successfully');
    setShowReportModal(false);
  };

  return (
    <div className="cs-iprep">

      {/* Toast notification */}
      {toast && (
        <div className="cs-iprep-toast">
          <i className="bi bi-check-circle-fill"></i>
          {toast}
        </div>
      )}

      {/* Header */}
      <div className="cs-iprep-head">
        <h2 className="cs-iprep-title">IP reputation</h2>
        <p className="cs-iprep-sub">
          Look up any source IP to see its risk score and history. Use this to
          decide whether to allow, monitor, or block a request source.
        </p>
      </div>

      {/* Search card */}
      <div className="cs-iprep-search-card">
        <div className="cs-iprep-label">LOOKUP IP</div>
        <p className="cs-iprep-hint">
          Type an IP address below and press <strong>Check reputation</strong> to see its threat score,
          origin, and history.
        </p>

        <div className="cs-iprep-search-row">
          <div className="cs-iprep-search">
            <i className="bi bi-globe2"></i>
            <input
              type="text"
              placeholder="e.g. 185.220.101.4"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleLookup(query)}
            />
          </div>
          <button type="button" className="cs-btn cs-btn-dark" onClick={() => handleLookup(query)}>
            Check reputation
          </button>
        </div>

        {error && <div className="cs-iprep-error">{error}</div>}

        <div className="cs-iprep-recent">
          <span className="cs-iprep-recent-label">Try one:</span>
          {RECENT_IPS.map((ip) => (
            <button
              key={ip}
              type="button"
              className="cs-iprep-recent-chip"
              onClick={() => { setQuery(ip); handleLookup(ip); }}
            >
              {ip}
            </button>
          ))}
        </div>
      </div>

      {/* Result */}
      {result && (
        <div className="cs-iprep-result">
          <div className="cs-iprep-result-top">
            <div>
              <div className="cs-iprep-result-label">SOURCE IP</div>
              <div className="cs-iprep-result-ip">{result.ip}</div>
              <div className="cs-iprep-result-status">
                <span className={`cs-iprep-status-dot cs-status-dot-${riskColor(result.risk)}`}></span>
                <span className="cs-iprep-status-text">{result.status}</span>
              </div>
            </div>
            <div className={`cs-iprep-risk-badge cs-risk-${riskColor(result.risk)}`}>
              <div className="cs-iprep-risk-value">{result.risk}</div>
              <div className="cs-iprep-risk-label">RISK SCORE</div>
            </div>
          </div>

          <div className={`cs-iprep-recommendation cs-rec-${riskColor(result.risk)}`}>
            <i className="bi bi-info-circle"></i>
            <span>{riskLabel(result.risk)}</span>
          </div>

          <div className="cs-iprep-description">
            <div className="cs-iprep-description-label">WHAT THIS MEANS</div>
            <p>{result.description}</p>
          </div>

          <div className="cs-iprep-risk-bar-wrap">
            <div className="cs-iprep-risk-bar-track">
              <div
                className={`cs-iprep-risk-bar cs-risk-fill-${riskColor(result.risk)}`}
                style={{ width: `${result.risk}%` }}
              />
            </div>
            <div className="cs-iprep-risk-scale">
              <span>0 — Safe</span>
              <span>50 — Monitor</span>
              <span>100 — Dangerous</span>
            </div>
          </div>

          <div className="cs-iprep-meta">
            <Meta label="Country"  value={result.country} />
            <Meta label="ISP"      value={result.isp} />
            <Meta label="Category" value={result.category} />
            <Meta label="Events"   value={result.events} />
            <Meta label="Status"   value={result.status} />
          </div>

          {/* WORKING action buttons */}
          <div className="cs-iprep-actions">
            <button type="button" className="cs-btn cs-btn-dark" onClick={handleBlock}>
              <i className="bi bi-slash-circle"></i>
              {blocked.includes(result.ip) ? 'Blocked' : 'Block this IP'}
            </button>
            <button type="button" className="cs-btn cs-btn-light" onClick={handleWatch}>
              <i className="bi bi-eye"></i>
              {watchlist.includes(result.ip) ? 'Watching' : 'Add to watchlist'}
            </button>
            <button type="button" className="cs-btn cs-btn-light" onClick={openReport}>
              <i className="bi bi-file-earmark-text"></i>
              Create report
            </button>
          </div>
        </div>
      )}

      {/* Empty state */}
      {!result && (
        <div className="cs-iprep-empty">
          <i className="bi bi-globe2"></i>
          <h3>Look up an IP address</h3>
          <p>
            Enter any IPv4 address above — or click one of the sample IPs — to
            see its reputation, risk score, and threat history.
          </p>
        </div>
      )}

      {/* Blocked + Watchlist lists */}
      {(blocked.length > 0 || watchlist.length > 0) && (
        <div className="cs-iprep-lists">

          {blocked.length > 0 && (
            <div className="cs-iprep-list-card">
              <div className="cs-iprep-list-head">
                <span className="cs-iprep-list-title">
                  <i className="bi bi-slash-circle"></i>
                  Blocked IPs ({blocked.length})
                </span>
                <button
                  type="button"
                  className="cs-iprep-list-clear"
                  onClick={() => setBlocked([])}
                >
                  Clear all
                </button>
              </div>
              <div className="cs-iprep-list-body">
                {blocked.map((ip) => (
                  <div className="cs-iprep-list-row" key={ip}>
                    <span className="mono">{ip}</span>
                    <button
                      type="button"
                      className="cs-iprep-list-remove"
                      onClick={() => setBlocked(blocked.filter((x) => x !== ip))}
                    >
                      Unblock
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {watchlist.length > 0 && (
            <div className="cs-iprep-list-card">
              <div className="cs-iprep-list-head">
                <span className="cs-iprep-list-title">
                  <i className="bi bi-eye"></i>
                  Watchlist ({watchlist.length})
                </span>
                <button
                  type="button"
                  className="cs-iprep-list-clear"
                  onClick={() => setWatchlist([])}
                >
                  Clear all
                </button>
              </div>
              <div className="cs-iprep-list-body">
                {watchlist.map((ip) => (
                  <div className="cs-iprep-list-row" key={ip}>
                    <span className="mono">{ip}</span>
                    <button
                      type="button"
                      className="cs-iprep-list-remove"
                      onClick={() => setWatchlist(watchlist.filter((x) => x !== ip))}
                    >
                      Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Report modal */}
      {showReportModal && (
        <div className="cs-iprep-modal-backdrop" onClick={() => setShowReportModal(false)}>
          <div className="cs-iprep-modal" onClick={(e) => e.stopPropagation()}>
            <div className="cs-iprep-modal-head">
              <h3>Create threat report</h3>
              <button type="button" onClick={() => setShowReportModal(false)}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="cs-iprep-modal-body">
              <label className="cs-iprep-modal-field">
                <span>Title</span>
                <input
                  type="text"
                  value={report.title}
                  onChange={(e) => setReport({ ...report, title: e.target.value })}
                />
              </label>

              <label className="cs-iprep-modal-field">
                <span>Severity</span>
                <select
                  value={report.severity}
                  onChange={(e) => setReport({ ...report, severity: e.target.value })}
                >
                  <option>Low</option>
                  <option>Medium</option>
                  <option>High</option>
                  <option>Critical</option>
                </select>
              </label>

              <label className="cs-iprep-modal-field">
                <span>Notes</span>
                <textarea
                  rows={4}
                  value={report.notes}
                  onChange={(e) => setReport({ ...report, notes: e.target.value })}
                />
              </label>
            </div>

            <div className="cs-iprep-modal-foot">
              <button
                type="button"
                className="cs-btn cs-btn-light"
                onClick={() => setShowReportModal(false)}
              >
                Cancel
              </button>
              <button
                type="button"
                className="cs-btn cs-btn-dark"
                onClick={saveReport}
              >
                Save report
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

function Meta({ label, value }) {
  return (
    <div className="cs-iprep-meta-item">
      <div className="cs-iprep-meta-label">{label}</div>
      <div className="cs-iprep-meta-value">{value}</div>
    </div>
  );
}

export default IPReputation;