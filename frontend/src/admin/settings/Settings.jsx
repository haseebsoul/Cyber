/**
 * Settings.jsx
 * ---------------------------------------------------------
 * PLATFORM SETTINGS page.
 *
 * WHAT THIS PAGE DOES:
 *   - Lets the admin configure the platform
 *   - Has 3 sections of settings:
 *       1. General  → org name, log retention
 *       2. Security → auto-block, MFA, session timeout
 *       3. Alerts   → email alerts, alert threshold
 *   - A single "Save changes" button saves all values
 *   - A green toast appears when saved
 *
 * HOW IT WORKS (simple version):
 *   1. All settings live in ONE state object called `form`
 *   2. Every input updates ONE field inside that object
 *   3. Clicking Save just shows a toast message
 *      (Later, this will POST to /api/settings)
 */

import { useState } from "react";
import "./Settings.css";

function Settings() {
  // ---------- STATE — all settings in ONE object ----------
  // Each key is a setting name. Each value is what the admin chose.
  const [form, setForm] = useState({
    orgName:        "CyberSentinel",
    retentionDays:  "90",
    autoBlock:      true,
    mfaRequired:    false,
    sessionTimeout: "30",
    emailAlerts:    true,
    alertThreshold: "high",
  });

  // Whether the "Saved!" toast is currently visible
  const [saved, setSaved] = useState(false);

  // ---------- HANDLER — Save button ----------
  const handleSave = () => {
    setSaved(true);
    // Auto-hide the toast after 2.5 seconds
    setTimeout(() => setSaved(false), 2500);
  };

  // Helper — quickly update one field in the form
  const updateField = (key, value) => {
    setForm({ ...form, [key]: value });
  };

  // ---------- RENDER ----------
  return (
    <div className="settings-page">

      {/* ============ PAGE HEADER ============ */}
      <div className="settings-head">
        <div>
          <h2 className="settings-title">Settings</h2>
          <p className="settings-sub">
            Configure platform behaviour — retention, security, and alerts.
          </p>
        </div>
        <button type="button" className="settings-save-btn" onClick={handleSave}>
          <i className="bi bi-check2"></i>
          Save changes
        </button>
      </div>

      {/* ============ SUCCESS TOAST ============ */}
      {saved && (
        <div className="settings-toast">
          <i className="bi bi-check-circle-fill"></i>
          Settings saved successfully.
        </div>
      )}

      {/* ============ SETTINGS CARDS ============ */}
      <div className="settings-grid">

        {/* ---------- CARD 1 — General ---------- */}
        <div className="settings-card">
          <div className="settings-card-head">
            <h3 className="settings-card-title">General</h3>
            <p className="settings-card-sub">Basic platform information</p>
          </div>

          {/* Org name input */}
          <label className="settings-field">
            <span>Organization name</span>
            <input
              type="text"
              value={form.orgName}
              onChange={(e) => updateField("orgName", e.target.value)}
            />
          </label>

          {/* Retention days input */}
          <label className="settings-field">
            <span>Log retention (days)</span>
            <input
              type="number"
              value={form.retentionDays}
              onChange={(e) => updateField("retentionDays", e.target.value)}
            />
          </label>
        </div>

        {/* ---------- CARD 2 — Security ---------- */}
        <div className="settings-card">
          <div className="settings-card-head">
            <h3 className="settings-card-title">Security</h3>
            <p className="settings-card-sub">Detection and enforcement</p>
          </div>

          {/* Auto-block toggle */}
          <div className="settings-switch-row">
            <div>
              <div className="settings-switch-label">Auto-block high severity</div>
              <div className="settings-switch-sub">Automatically block critical threats</div>
            </div>
            <button
              type="button"
              className={`settings-switch ${form.autoBlock ? "settings-switch-on" : ""}`}
              onClick={() => updateField("autoBlock", !form.autoBlock)}
            >
              <span className="settings-switch-knob" />
            </button>
          </div>

          {/* MFA toggle */}
          <div className="settings-switch-row">
            <div>
              <div className="settings-switch-label">Require MFA for admins</div>
              <div className="settings-switch-sub">Force two-factor on admin accounts</div>
            </div>
            <button
              type="button"
              className={`settings-switch ${form.mfaRequired ? "settings-switch-on" : ""}`}
              onClick={() => updateField("mfaRequired", !form.mfaRequired)}
            >
              <span className="settings-switch-knob" />
            </button>
          </div>

          {/* Session timeout input */}
          <label className="settings-field">
            <span>Session timeout (minutes)</span>
            <input
              type="number"
              value={form.sessionTimeout}
              onChange={(e) => updateField("sessionTimeout", e.target.value)}
            />
          </label>
        </div>

        {/* ---------- CARD 3 — Alerts ---------- */}
        <div className="settings-card">
          <div className="settings-card-head">
            <h3 className="settings-card-title">Alerts</h3>
            <p className="settings-card-sub">Notifications and thresholds</p>
          </div>

          {/* Email alerts toggle */}
          <div className="settings-switch-row">
            <div>
              <div className="settings-switch-label">Email alerts</div>
              <div className="settings-switch-sub">Send alert emails to admins</div>
            </div>
            <button
              type="button"
              className={`settings-switch ${form.emailAlerts ? "settings-switch-on" : ""}`}
              onClick={() => updateField("emailAlerts", !form.emailAlerts)}
            >
              <span className="settings-switch-knob" />
            </button>
          </div>

          {/* Alert threshold dropdown */}
          <label className="settings-field">
            <span>Alert threshold</span>
            <select
              value={form.alertThreshold}
              onChange={(e) => updateField("alertThreshold", e.target.value)}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical only</option>
            </select>
          </label>
        </div>

      </div>

      {/* ============ CURRENT VALUES (debug panel) ============ */}
      <div className="settings-preview">
        <div className="settings-preview-head">
          <i className="bi bi-code-square"></i>
          Current values (proof the form works)
        </div>
        <pre className="settings-preview-body">
          {JSON.stringify(form, null, 2)}
        </pre>
      </div>

    </div>
  );
}

export default Settings;