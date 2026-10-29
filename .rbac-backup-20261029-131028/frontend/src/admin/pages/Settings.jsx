/** Settings.jsx — loads and saves platform preferences through the backend. */
import { useEffect, useState } from "react";
import "./Settings.css";

const DEFAULT_SETTINGS = {
  detectionMode: "block-high", anomalyThreshold: "0.6", autoBlockCritical: true,
  retentionDays: "90", eventBatchSize: "100", includeRequestBody: false,
  alertSeverity: "High", emailAlerts: true, notifyEmail: "security@cybersentinel.ai",
  sessionTimeout: "30", requireMfa: false, allowedIpRange: "10.0.0.0/8",
};

// Convert numeric fields to strings so they work with controlled inputs.
function toFormSettings(data) {
  return {
    ...data,
    anomalyThreshold: String(data.anomalyThreshold),
    retentionDays: String(data.retentionDays),
    eventBatchSize: String(data.eventBatchSize),
    sessionTimeout: String(data.sessionTimeout),
  };
}

function Settings() {
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [loadError, setLoadError] = useState("");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    // Fill the form with settings already saved in MongoDB.
    fetch("http://localhost:5000/api/settings")
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.message || "Could not load settings.");
        setSettings(toFormSettings(data.settings));
      })
      .catch(() => setLoadError("Unable to load saved settings. Check the backend and refresh this page."))
      .finally(() => setLoading(false));
  }, []);

  // Update one setting without replacing the other values.
  const update = (key, value) => setSettings((old) => ({ ...old, [key]: value }));

  const handleSave = async () => {
    setSaving(true);
    setError("");
    setNotice("");
    try {
      const payload = {
        ...settings,
        anomalyThreshold: Number(settings.anomalyThreshold),
        retentionDays: Number(settings.retentionDays),
        eventBatchSize: Number(settings.eventBatchSize),
        sessionTimeout: Number(settings.sessionTimeout),
      };
      const res = await fetch("http://localhost:5000/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Settings could not be saved.");
      setSettings(toFormSettings(data.settings));
      setNotice("Settings saved to MongoDB successfully.");
    } catch (err) {
      setError(err.message || "Unable to save settings. Check the backend.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="settings-page">
      <div className="settings-head">
        <div>
          <h2 className="settings-title">Settings</h2>
          <p className="settings-sub">Configure platform preferences and save them to MongoDB.</p>
        </div>
        <button type="button" className="settings-save-btn" onClick={handleSave} disabled={loading || saving || Boolean(loadError)}>
          <i className="bi bi-check2"></i> {saving ? "Saving..." : "Save changes"}
        </button>
      </div>

      {loading && <div className="settings-toast">Loading saved settings...</div>}
      {loadError && <div className="settings-toast" role="alert" style={{ color: "#b91c1c" }}>{loadError}</div>}
      {error && <div className="settings-toast" role="alert" style={{ color: "#b91c1c" }}>{error}</div>}
      {notice && <div className="settings-toast" role="status"><i className="bi bi-check-circle-fill"></i> {notice}</div>}

      <div className="settings-grid">
        <div className="settings-card">
          <div className="settings-card-head"><div className="settings-card-icon"><i className="bi bi-shield-check"></i></div><div><h3 className="settings-card-title">Detection</h3><p className="settings-card-sub">How the WAF and IDS should behave</p></div></div>
          <label className="settings-field"><span className="settings-field-label">Detection mode</span><select value={settings.detectionMode} onChange={(e) => update("detectionMode", e.target.value)}><option value="alert">Alert only (do not block)</option><option value="block-high">Block on high severity</option><option value="block-all">Block everything suspicious</option></select></label>
          <label className="settings-field"><span className="settings-field-label">Anomaly threshold (0.1 – 1.0)</span><input type="number" step="0.1" min="0.1" max="1" value={settings.anomalyThreshold} onChange={(e) => update("anomalyThreshold", e.target.value)} /><span className="settings-field-hint">Higher values set a stricter threshold.</span></label>
          <div className="settings-switch-row"><div><div className="settings-switch-label">Auto-block critical threats</div><div className="settings-switch-sub">Preference only until connected to enforcement logic.</div></div><button type="button" className={`settings-switch ${settings.autoBlockCritical ? "settings-switch-on" : ""}`} onClick={() => update("autoBlockCritical", !settings.autoBlockCritical)} aria-label="Auto-block critical threats"><span className="settings-switch-knob" /></button></div>
        </div>

        <div className="settings-card">
          <div className="settings-card-head"><div className="settings-card-icon"><i className="bi bi-journal-text"></i></div><div><h3 className="settings-card-title">Logs &amp; Retention</h3><p className="settings-card-sub">Storage and retention preferences</p></div></div>
          <label className="settings-field"><span className="settings-field-label">Log retention (days)</span><input type="number" min="1" max="3650" value={settings.retentionDays} onChange={(e) => update("retentionDays", e.target.value)} /><span className="settings-field-hint">Configured retention period.</span></label>
          <label className="settings-field"><span className="settings-field-label">Event batch size</span><input type="number" min="1" max="10000" value={settings.eventBatchSize} onChange={(e) => update("eventBatchSize", e.target.value)} /></label>
          <div className="settings-switch-row"><div><div className="settings-switch-label">Log full request bodies</div><div className="settings-switch-sub">Full bodies can contain sensitive information.</div></div><button type="button" className={`settings-switch ${settings.includeRequestBody ? "settings-switch-on" : ""}`} onClick={() => update("includeRequestBody", !settings.includeRequestBody)} aria-label="Log full request bodies"><span className="settings-switch-knob" /></button></div>
        </div>

        <div className="settings-card">
          <div className="settings-card-head"><div className="settings-card-icon"><i className="bi bi-bell"></i></div><div><h3 className="settings-card-title">Alerts</h3><p className="settings-card-sub">Notification preferences</p></div></div>
          <label className="settings-field"><span className="settings-field-label">Alert minimum severity</span><select value={settings.alertSeverity} onChange={(e) => update("alertSeverity", e.target.value)}><option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option><option value="Critical">Critical only</option></select></label>
          <div className="settings-switch-row"><div><div className="settings-switch-label">Email alerts</div><div className="settings-switch-sub">Save whether email alerts are preferred.</div></div><button type="button" className={`settings-switch ${settings.emailAlerts ? "settings-switch-on" : ""}`} onClick={() => update("emailAlerts", !settings.emailAlerts)} aria-label="Email alerts"><span className="settings-switch-knob" /></button></div>
          <label className="settings-field"><span className="settings-field-label">Notification email</span><input type="email" value={settings.notifyEmail} onChange={(e) => update("notifyEmail", e.target.value)} placeholder="security@yourcompany.com" disabled={!settings.emailAlerts} /></label>
        </div>

        <div className="settings-card">
          <div className="settings-card-head"><div className="settings-card-icon"><i className="bi bi-lock"></i></div><div><h3 className="settings-card-title">Security &amp; Access</h3><p className="settings-card-sub">Access-control preferences</p></div></div>
          <label className="settings-field"><span className="settings-field-label">Session timeout (minutes)</span><input type="number" min="1" max="1440" value={settings.sessionTimeout} onChange={(e) => update("sessionTimeout", e.target.value)} /></label>
          <label className="settings-field"><span className="settings-field-label">Allowed IP range</span><input type="text" value={settings.allowedIpRange} onChange={(e) => update("allowedIpRange", e.target.value)} placeholder="e.g. 10.0.0.0/8" /></label>
          <div className="settings-switch-row"><div><div className="settings-switch-label">Require MFA for admins</div><div className="settings-switch-sub">Preference only; MFA enforcement is not implemented.</div></div><button type="button" className={`settings-switch ${settings.requireMfa ? "settings-switch-on" : ""}`} onClick={() => update("requireMfa", !settings.requireMfa)} aria-label="Require MFA for admins"><span className="settings-switch-knob" /></button></div>
        </div>
      </div>
    </div>
  );
}

export default Settings;
