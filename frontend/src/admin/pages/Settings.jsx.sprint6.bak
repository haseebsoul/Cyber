/**
 * Settings.jsx
 * ---------------------------------------------------------
 * SETTINGS page — platform configuration.
 *
 * WHAT THIS PAGE DOES:
 *   - Shows 4 cards of configurable settings:
 *       1. DETECTION   — how WAF/IDS behaves
 *       2. LOGS        — retention & data management
 *       3. ALERTS      — notifications & severity
 *       4. SECURITY    — access control for admins
 *   - User changes any field
 *   - Clicks "Save changes" → green toast confirms
 *
 * HOW IT WORKS (simple version):
 *   1. All setting values live in ONE useState object `settings`
 *   2. Each field's onChange updates just that one key
 *   3. The Save button shows a toast for 2.5 seconds
 *
 * No backend yet — settings are stored in memory only.
 */

import { useState } from "react";
import "./Settings.css";

function Settings() {
  // ---------- STATE ----------
  // ONE object holds every setting value on the page
  const [settings, setSettings] = useState({
    // Detection card
    detectionMode: "block-high",
    anomalyThreshold: "0.6",
    autoBlockCritical: true,

    // Logs card
    retentionDays: "90",
    eventBatchSize: "100",
    includeRequestBody: false,

    // Alerts card
    alertSeverity: "High",
    emailAlerts: true,
    notifyEmail: "security@cybersentinel.ai",

    // Security card
    sessionTimeout: "30",
    requireMfa: false,
    allowedIpRange: "10.0.0.0/8",
  });

  // Toast visibility
  const [showToast, setShowToast] = useState(false);

  // ---------- HANDLERS ----------

  // Update one field — spread the old settings, change one key
  const update = (key, value) => {
    setSettings({ ...settings, [key]: value });
  };

  // Show the "saved" toast for 2.5 seconds
  const handleSave = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  // ---------- RENDER ----------
  return (
    <div className="settings-page">

      {/* ============ PAGE HEADER ============ */}
      <div className="settings-head">
        <div>
          <h2 className="settings-title">Settings</h2>
          <p className="settings-sub">
            Configure detection rules, logs, alerts, and access control.
          </p>
        </div>
        <button type="button" className="settings-save-btn" onClick={handleSave}>
          <i className="bi bi-check2"></i>
          Save changes
        </button>
      </div>

      {/* ============ SUCCESS TOAST ============ */}
      {showToast && (
        <div className="settings-toast">
          <i className="bi bi-check-circle-fill"></i>
          Settings saved successfully.
        </div>
      )}

      {/* ============ CARD GRID ============ */}
      <div className="settings-grid">

        {/* ==================== CARD 1 — DETECTION ==================== */}
        <div className="settings-card">
          <div className="settings-card-head">
            <div className="settings-card-icon">
              <i className="bi bi-shield-check"></i>
            </div>
            <div>
              <h3 className="settings-card-title">Detection</h3>
              <p className="settings-card-sub">
                How the WAF and IDS behave on each request
              </p>
            </div>
          </div>

          {/* Detection mode dropdown */}
          <label className="settings-field">
            <span className="settings-field-label">Detection mode</span>
            <select
              value={settings.detectionMode}
              onChange={(e) => update("detectionMode", e.target.value)}
            >
              <option value="alert">Alert only (do not block)</option>
              <option value="block-high">Block on high severity</option>
              <option value="block-all">Block everything suspicious</option>
            </select>
          </label>

          {/* Anomaly threshold */}
          <label className="settings-field">
            <span className="settings-field-label">Anomaly threshold (0.1 – 1.0)</span>
            <input
              type="number"
              step="0.1"
              min="0.1"
              max="1.0"
              value={settings.anomalyThreshold}
              onChange={(e) => update("anomalyThreshold", e.target.value)}
            />
            <span className="settings-field-hint">
              Higher = stricter. Requests above this score are flagged.
            </span>
          </label>

          {/* Auto-block critical toggle */}
          <div className="settings-switch-row">
            <div>
              <div className="settings-switch-label">Auto-block critical threats</div>
              <div className="settings-switch-sub">
                Block critical severity without waiting for review
              </div>
            </div>
            <button
              type="button"
              className={`settings-switch ${settings.autoBlockCritical ? "settings-switch-on" : ""}`}
              onClick={() => update("autoBlockCritical", !settings.autoBlockCritical)}
              aria-label="Auto-block critical threats"
            >
              <span className="settings-switch-knob" />
            </button>
          </div>
        </div>

        {/* ==================== CARD 2 — LOGS ==================== */}
        <div className="settings-card">
          <div className="settings-card-head">
            <div className="settings-card-icon">
              <i className="bi bi-journal-text"></i>
            </div>
            <div>
              <h3 className="settings-card-title">Logs &amp; Retention</h3>
              <p className="settings-card-sub">
                Storage and data retention policies
              </p>
            </div>
          </div>

          {/* Retention days */}
          <label className="settings-field">
            <span className="settings-field-label">Log retention (days)</span>
            <input
              type="number"
              value={settings.retentionDays}
              onChange={(e) => update("retentionDays", e.target.value)}
            />
            <span className="settings-field-hint">
              How long security events are kept before deletion.
            </span>
          </label>

          {/* Batch size */}
          <label className="settings-field">
            <span className="settings-field-label">Event batch size</span>
            <input
              type="number"
              value={settings.eventBatchSize}
              onChange={(e) => update("eventBatchSize", e.target.value)}
            />
            <span className="settings-field-hint">
              How many events are grouped before writing to storage.
            </span>
          </label>

          {/* Log request bodies toggle */}
          <div className="settings-switch-row">
            <div>
              <div className="settings-switch-label">Log full request bodies</div>
              <div className="settings-switch-sub">
                Store complete payloads (uses more storage, more privacy risk)
              </div>
            </div>
            <button
              type="button"
              className={`settings-switch ${settings.includeRequestBody ? "settings-switch-on" : ""}`}
              onClick={() => update("includeRequestBody", !settings.includeRequestBody)}
              aria-label="Log full request bodies"
            >
              <span className="settings-switch-knob" />
            </button>
          </div>
        </div>

        {/* ==================== CARD 3 — ALERTS ==================== */}
        <div className="settings-card">
          <div className="settings-card-head">
            <div className="settings-card-icon">
              <i className="bi bi-bell"></i>
            </div>
            <div>
              <h3 className="settings-card-title">Alerts</h3>
              <p className="settings-card-sub">
                What triggers a notification
              </p>
            </div>
          </div>

          {/* Minimum severity */}
          <label className="settings-field">
            <span className="settings-field-label">Alert minimum severity</span>
            <select
              value={settings.alertSeverity}
              onChange={(e) => update("alertSeverity", e.target.value)}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical only</option>
            </select>
            <span className="settings-field-hint">
              Only threats at or above this level trigger alerts.
            </span>
          </label>

          {/* Email alerts toggle */}
          <div className="settings-switch-row">
            <div>
              <div className="settings-switch-label">Email alerts</div>
              <div className="settings-switch-sub">
                Send notifications to the address below
              </div>
            </div>
            <button
              type="button"
              className={`settings-switch ${settings.emailAlerts ? "settings-switch-on" : ""}`}
              onClick={() => update("emailAlerts", !settings.emailAlerts)}
              aria-label="Email alerts"
            >
              <span className="settings-switch-knob" />
            </button>
          </div>

          {/* Notification email */}
          <label className="settings-field">
            <span className="settings-field-label">Notification email</span>
            <input
              type="email"
              value={settings.notifyEmail}
              onChange={(e) => update("notifyEmail", e.target.value)}
              placeholder="security@yourcompany.com"
              disabled={!settings.emailAlerts}
            />
          </label>
        </div>

        {/* ==================== CARD 4 — SECURITY ==================== */}
        <div className="settings-card">
          <div className="settings-card-head">
            <div className="settings-card-icon">
              <i className="bi bi-lock"></i>
            </div>
            <div>
              <h3 className="settings-card-title">Security &amp; Access</h3>
              <p className="settings-card-sub">
                Access control for the admin panel
              </p>
            </div>
          </div>

          {/* Session timeout */}
          <label className="settings-field">
            <span className="settings-field-label">Session timeout (minutes)</span>
            <input
              type="number"
              value={settings.sessionTimeout}
              onChange={(e) => update("sessionTimeout", e.target.value)}
            />
            <span className="settings-field-hint">
              Auto-logout admins after this much inactivity.
            </span>
          </label>

          {/* Allowed IP range */}
          <label className="settings-field">
            <span className="settings-field-label">Allowed IP range</span>
            <input
              type="text"
              value={settings.allowedIpRange}
              onChange={(e) => update("allowedIpRange", e.target.value)}
              placeholder="e.g. 10.0.0.0/8"
            />
            <span className="settings-field-hint">
              Restrict admin access to this network range.
            </span>
          </label>

          {/* Require MFA toggle */}
          <div className="settings-switch-row">
            <div>
              <div className="settings-switch-label">Require MFA for admins</div>
              <div className="settings-switch-sub">
                Force two-factor authentication on every admin login
              </div>
            </div>
            <button
              type="button"
              className={`settings-switch ${settings.requireMfa ? "settings-switch-on" : ""}`}
              onClick={() => update("requireMfa", !settings.requireMfa)}
              aria-label="Require MFA for admins"
            >
              <span className="settings-switch-knob" />
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}

export default Settings;