/**
 * Rules.jsx
 * ---------------------------------------------------------
 * SECURITY RULES page.
 *
 * WHAT THIS PAGE DOES:
 *   - Shows the list of WAF detection rules applied to requests
 *   - User can add a new rule (via a form modal)
 *   - User can edit an existing rule
 *   - User can toggle a rule on/off (enable / disable)
 *   - User can delete a rule (with confirmation)
 *
 * HOW IT WORKS (simple version):
 *   1. All rules are stored in useState (starting from INITIAL_RULES)
 *   2. We show them in a table with .map()
 *   3. Add / Edit / Delete each open a modal with a form
 *   4. Toggle just flips the `enabled` flag on that rule
 */

import { useState } from "react";
import "./Rules.css";

// ---------- THE STARTING LIST OF RULES ----------
// Each rule has:
//   id       → unique number
//   name     → what the rule is called
//   pattern  → the pattern it matches (like a regex)
//   category → which type (Injection, XSS, etc)
//   severity → Low / Medium / High / Critical
//   enabled  → true/false — is this rule active?
const INITIAL_RULES = [
  { id: 1, name: "SQL Injection — UNION SELECT", pattern: "UNION\\s+SELECT",  category: "Injection", severity: "Critical", enabled: true  },
  { id: 2, name: "SQL Injection — OR 1=1",       pattern: "'\\s*OR\\s+1=1",   category: "Injection", severity: "High",     enabled: true  },
  { id: 3, name: "XSS — script tag",             pattern: "<script",           category: "XSS",       severity: "High",     enabled: true  },
  { id: 4, name: "XSS — onerror",                pattern: "onerror\\s*=",       category: "XSS",       severity: "Medium",   enabled: true  },
  { id: 5, name: "Path Traversal",               pattern: "\\.\\./",            category: "Traversal", severity: "High",     enabled: true  },
  { id: 6, name: "Command Injection",            pattern: ";\\s*(ls|cat|wget)", category: "Command",   severity: "Critical", enabled: false },
  { id: 7, name: "Rate Limit Exceeded",          pattern: "reqs > 100 / sec",   category: "Rate",      severity: "Low",      enabled: true  },
];

// Available dropdown values when adding/editing a rule
const CATEGORIES = ["Injection", "XSS", "Traversal", "Command", "Rate"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];

// Empty form — used when opening the "Add rule" modal
const EMPTY_FORM = {
  name: "",
  pattern: "",
  category: "Injection",
  severity: "High",
  enabled: true,
};

function Rules() {
  // ---------- STATE ----------
  const [rules, setRules] = useState(INITIAL_RULES);   // all the rules
  const [form, setForm] = useState(EMPTY_FORM);         // form data for Add/Edit modal
  const [modal, setModal] = useState(null);             // null | {type:'add'} | {type:'edit',rule} | {type:'delete',rule}
  const [search, setSearch] = useState("");             // search box value
  const [category, setCategory] = useState("All");      // category filter value

  // ---------- FILTERING ----------
  // Keep rules matching BOTH the search AND the category filter
  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(search.toLowerCase()) ||
      rule.pattern.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All" || rule.category === category;

    return matchesSearch && matchesCategory;
  });

  // ---------- HANDLERS ----------

  // Open the "Add rule" modal with an empty form
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ type: "add" });
  };

  // Open the "Edit rule" modal, pre-filled with that rule's data
  const openEdit = (rule) => {
    setForm({
      name: rule.name,
      pattern: rule.pattern,
      category: rule.category,
      severity: rule.severity,
      enabled: rule.enabled,
    });
    setModal({ type: "edit", rule });
  };

  // Open the "Delete confirmation" modal
  const openDelete = (rule) => setModal({ type: "delete", rule });

  // Close any open modal
  const closeModal = () => setModal(null);

  // Save the "Add rule" form
  const handleAdd = () => {
    if (!form.name.trim() || !form.pattern.trim()) return;

    const newRule = {
      id: Date.now(),
      name: form.name.trim(),
      pattern: form.pattern.trim(),
      category: form.category,
      severity: form.severity,
      enabled: form.enabled,
    };

    setRules([newRule, ...rules]);
    closeModal();
  };

  // Save the "Edit rule" form
  const handleEdit = () => {
    setRules(
      rules.map((rule) =>
        rule.id === modal.rule.id ? { ...rule, ...form } : rule
      )
    );
    closeModal();
  };

  // Delete the selected rule
  const handleDelete = () => {
    setRules(rules.filter((rule) => rule.id !== modal.rule.id));
    closeModal();
  };

  // Toggle a rule on or off (used by the switch in the table)
  const toggleRule = (id) => {
    setRules(
      rules.map((rule) =>
        rule.id === id ? { ...rule, enabled: !rule.enabled } : rule
      )
    );
  };

  // ---------- SUMMARY COUNTS ----------
  const stats = {
    total:    rules.length,
    enabled:  rules.filter((r) => r.enabled).length,
    disabled: rules.filter((r) => !r.enabled).length,
    critical: rules.filter((r) => r.severity === "Critical").length,
  };

  // ---------- RENDER ----------
  return (
    <div className="rules-page">

      {/* ============ PAGE HEADER ============ */}
      <div className="rules-head">
        <div>
          <h2 className="rules-title">Security Rules</h2>
          <p className="rules-sub">
            WAF detection rules applied to incoming requests. Add, edit, or toggle rules on and off.
          </p>
        </div>
        <button type="button" className="rules-add-btn" onClick={openAdd}>
          <i className="bi bi-plus-lg"></i>
          Add rule
        </button>
      </div>

      {/* ============ SUMMARY CARDS ============ */}
      <div className="rules-summary">
        <div className="rules-summary-card">
          <div className="rules-summary-value">{stats.total}</div>
          <div className="rules-summary-label">Total</div>
        </div>
        <div className="rules-summary-card">
          <div className="rules-summary-value">{stats.enabled}</div>
          <div className="rules-summary-label">Enabled</div>
        </div>
        <div className="rules-summary-card">
          <div className="rules-summary-value">{stats.disabled}</div>
          <div className="rules-summary-label">Disabled</div>
        </div>
        <div className="rules-summary-card">
          <div className="rules-summary-value">{stats.critical}</div>
          <div className="rules-summary-label">Critical</div>
        </div>
      </div>

      {/* ============ SEARCH + FILTER ============ */}
      <div className="rules-filters">
        <div className="rules-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by rule name or pattern"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="rules-category-filter"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="All">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>{cat}</option>
          ))}
        </select>
      </div>

      {/* ============ RULES TABLE ============ */}
      <div className="rules-table-card">

        {/* Table header */}
        <div className="rules-table-head">
          <span>Rule</span>
          <span>Category</span>
          <span>Severity</span>
          <span>Enabled</span>
          <span className="rules-cell-actions">Actions</span>
        </div>

        {/* Table rows */}
        <div className="rules-table-body">

          {filteredRules.length === 0 && (
            <div className="rules-empty">No rules match your filters.</div>
          )}

          {filteredRules.map((rule) => (
            <div className="rules-row" key={rule.id}>

              {/* Rule name + pattern */}
              <div className="rules-cell-name">
                <div className="rules-name">{rule.name}</div>
                <div className="rules-pattern">{rule.pattern}</div>
              </div>

              {/* Category */}
              <span className="rules-category">{rule.category}</span>

              {/* Severity pill */}
              <span>
                <span className={`rules-pill rules-pill-${rule.severity.toLowerCase()}`}>
                  {rule.severity}
                </span>
              </span>

              {/* Toggle switch */}
              <span className="rules-cell-toggle">
                <button
                  type="button"
                  className={`rules-toggle ${rule.enabled ? "rules-toggle-on" : ""}`}
                  onClick={() => toggleRule(rule.id)}
                  aria-label={rule.enabled ? "Disable rule" : "Enable rule"}
                >
                  <span className="rules-toggle-knob" />
                </button>
              </span>

              {/* Edit + Delete buttons */}
              <span className="rules-cell-actions">
                <button
                  type="button"
                  className="rules-icon-btn"
                  onClick={() => openEdit(rule)}
                  title="Edit"
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  type="button"
                  className="rules-icon-btn rules-icon-btn-danger"
                  onClick={() => openDelete(rule)}
                  title="Delete"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </span>

            </div>
          ))}

        </div>

        {/* Row count */}
        {filteredRules.length > 0 && (
          <div className="rules-table-foot">
            Showing {filteredRules.length} of {rules.length} rules
          </div>
        )}

      </div>

      {/* ============ ADD / EDIT RULE MODAL ============ */}
      {modal && (modal.type === "add" || modal.type === "edit") && (
        <div className="rules-modal-backdrop" onClick={closeModal}>
          <div className="rules-modal" onClick={(e) => e.stopPropagation()}>

            <div className="rules-modal-head">
              <h3 className="rules-modal-title">
                {modal.type === "add" ? "Add new rule" : "Edit rule"}
              </h3>
              <button type="button" className="rules-modal-close" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="rules-modal-body">

              {/* Rule name field */}
              <label className="rules-field">
                <span>Rule name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. SQL Injection — UNION SELECT"
                />
              </label>

              {/* Pattern field (regex-style) */}
              <label className="rules-field">
                <span>Pattern (what the rule matches)</span>
                <input
                  type="text"
                  value={form.pattern}
                  onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                  placeholder="e.g. UNION\s+SELECT"
                />
              </label>

              {/* Category dropdown */}
              <label className="rules-field">
                <span>Category</span>
                <select
                  value={form.category}
                  onChange={(e) => setForm({ ...form, category: e.target.value })}
                >
                  {CATEGORIES.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </label>

              {/* Severity dropdown */}
              <label className="rules-field">
                <span>Severity</span>
                <select
                  value={form.severity}
                  onChange={(e) => setForm({ ...form, severity: e.target.value })}
                >
                  {SEVERITIES.map((sev) => (
                    <option key={sev} value={sev}>{sev}</option>
                  ))}
                </select>
              </label>

              {/* Enabled checkbox */}
              <label className="rules-checkbox">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                />
                <span>Enable this rule immediately</span>
              </label>

            </div>

            <div className="rules-modal-foot">
              <button type="button" className="rules-btn rules-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="rules-btn rules-btn-primary"
                onClick={modal.type === "add" ? handleAdd : handleEdit}
              >
                {modal.type === "add" ? "Create rule" : "Save changes"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============ DELETE CONFIRMATION MODAL ============ */}
      {modal && modal.type === "delete" && (
        <div className="rules-modal-backdrop" onClick={closeModal}>
          <div className="rules-modal rules-modal-small" onClick={(e) => e.stopPropagation()}>

            <div className="rules-modal-head">
              <h3 className="rules-modal-title">Delete rule</h3>
              <button type="button" className="rules-modal-close" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="rules-modal-body">
              <p className="rules-modal-warn">
                Are you sure you want to delete <strong>{modal.rule.name}</strong>?
                This action cannot be undone.
              </p>
            </div>

            <div className="rules-modal-foot">
              <button type="button" className="rules-btn rules-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="button" className="rules-btn rules-btn-danger" onClick={handleDelete}>
                Delete rule
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Rules;