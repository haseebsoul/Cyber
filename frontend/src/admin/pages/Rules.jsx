import { useEffect, useState } from "react";
import { getSession } from "../../session/SessionManager";
import "./Rules.css";

const API_URL = "http://localhost:5000/api/rules";
const tokenHeaders = () => ({ Authorization: "Bearer " + localStorage.getItem("token") });
const normalizeRole = (value) => {
  const role = String(value || "").toLowerCase();
  if (role === "administrator") return "admin";
  if (role === "soc analyst") return "analyst";
  if (role === "security researcher") return "researcher";
  return role;
};

const CATEGORIES = ["Injection", "XSS", "Traversal", "Command", "Rate"];
const SEVERITIES = ["Low", "Medium", "High", "Critical"];

const EMPTY_FORM = {
  name: "",
  pattern: "",
  category: "Injection",
  severity: "High",
  enabled: true,
};

function Rules() {
  const currentRole = normalizeRole(getSession()?.role);
  const canModify = ["admin", "analyst"].includes(currentRole);
  const [rules, setRules] = useState([]);
  const [form, setForm] = useState(EMPTY_FORM);
  const [modal, setModal] = useState(null);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [pageError, setPageError] = useState("");
  const [formError, setFormError] = useState("");
  const [notice, setNotice] = useState("");

  // Load rules saved in MongoDB when the page opens.
  useEffect(() => {
    const loadRules = async () => {
      try {
        const res = await fetch(API_URL, { headers: tokenHeaders() });
        const result = await res.json();

        if (!res.ok) {
          throw new Error(result.message || "Could not load rules.");
        }

        setRules(Array.isArray(result.rules) ? result.rules : []);
        setPageError("");
      } catch (error) {
        setPageError(error.message || "Could not connect to the backend.");
      } finally {
        setLoading(false);
      }
    };

    loadRules();
  }, []);

  const filteredRules = rules.filter((rule) => {
    const matchesSearch =
      rule.name.toLowerCase().includes(search.toLowerCase()) ||
      rule.pattern.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = category === "All" || rule.category === category;
    return matchesSearch && matchesCategory;
  });

  const openAdd = () => {
    if (!canModify) return;
    setForm({ ...EMPTY_FORM });
    setFormError("");
    setNotice("");
    setModal({ type: "add" });
  };

  const openEdit = (rule) => {
    if (!canModify) return;
    setForm({
      name: rule.name,
      pattern: rule.pattern,
      category: rule.category,
      severity: rule.severity,
      enabled: rule.enabled,
    });
    setFormError("");
    setNotice("");
    setModal({ type: "edit", rule });
  };

  const openDelete = (rule) => {
    if (!canModify) return;
    setFormError("");
    setNotice("");
    setModal({ type: "delete", rule });
  };

  const closeModal = () => {
    if (saving) return;
    setModal(null);
    setFormError("");
  };

  // Save a new rule in MongoDB.
  const handleAdd = async () => {
    if (!canModify) return;
    if (!form.name.trim() || !form.pattern.trim()) {
      setFormError("Rule name and pattern are required.");
      return;
    }

    setSaving(true);
    setFormError("");
    setPageError("");
    setNotice("");

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { ...tokenHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          pattern: form.pattern.trim(),
        }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Could not create rule.");

      setRules((current) => [result.rule, ...current]);
      setModal(null);
      setNotice("Rule created and saved.");
    } catch (error) {
      setFormError(error.message || "Could not connect to the backend.");
    } finally {
      setSaving(false);
    }
  };

  // Save changes to an existing MongoDB rule.
  const handleEdit = async () => {
    if (!canModify) return;
    if (!form.name.trim() || !form.pattern.trim()) {
      setFormError("Rule name and pattern are required.");
      return;
    }

    setSaving(true);
    setFormError("");
    setPageError("");
    setNotice("");

    try {
      const res = await fetch(`${API_URL}/${modal.rule._id}`, {
        method: "PUT",
        headers: { ...tokenHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          name: form.name.trim(),
          pattern: form.pattern.trim(),
        }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Could not update rule.");

      setRules((current) =>
        current.map((rule) => rule._id === result.rule._id ? result.rule : rule)
      );
      setModal(null);
      setNotice("Rule changes saved.");
    } catch (error) {
      setFormError(error.message || "Could not connect to the backend.");
    } finally {
      setSaving(false);
    }
  };

  // Delete the selected rule from MongoDB.
  const handleDelete = async () => {
    if (!canModify) return;
    setSaving(true);
    setFormError("");
    setPageError("");
    setNotice("");

    try {
      const res = await fetch(`${API_URL}/${modal.rule._id}`, {
        method: "DELETE",
        headers: tokenHeaders(),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Could not delete rule.");

      setRules((current) => current.filter((rule) => rule._id !== modal.rule._id));
      setModal(null);
      setNotice("Rule deleted.");
    } catch (error) {
      setFormError(error.message || "Could not connect to the backend.");
    } finally {
      setSaving(false);
    }
  };

  // Save the enabled/disabled state in MongoDB.
  const toggleRule = async (rule) => {
    if (!canModify) return;
    setPageError("");
    setNotice("");

    try {
      const res = await fetch(`${API_URL}/${rule._id}`, {
        method: "PUT",
        headers: { ...tokenHeaders(), "Content-Type": "application/json" },
        body: JSON.stringify({ enabled: !rule.enabled }),
      });
      const result = await res.json();

      if (!res.ok) throw new Error(result.message || "Could not update rule status.");

      setRules((current) =>
        current.map((item) => item._id === result.rule._id ? result.rule : item)
      );
      setNotice(`Rule ${result.rule.enabled ? "enabled" : "disabled"}.`);
    } catch (error) {
      setPageError(error.message || "Could not connect to the backend.");
    }
  };

  const stats = {
    total: rules.length,
    enabled: rules.filter((rule) => rule.enabled).length,
    disabled: rules.filter((rule) => !rule.enabled).length,
    critical: rules.filter((rule) => rule.severity === "Critical").length,
  };

  return (
    <div className="rules-page">
      <div className="rules-head">
        <div>
          <h2 className="rules-title">Security Rules</h2>
          <p className="rules-sub">
            WAF detection rules applied to incoming requests. Add, edit, or toggle rules on and off.
          </p>
        </div>
        {canModify && <button type="button" className="rules-add-btn" onClick={openAdd}>
          <i className="bi bi-plus-lg"></i>
          Add rule
        </button>}
      </div>

      {notice && <p role="status" style={{ color: "#15803d", marginBottom: 12 }}>{notice}</p>}
      {pageError && <p role="alert" style={{ color: "#b91c1c", marginBottom: 12 }}>{pageError}</p>}

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
          {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
        </select>
      </div>

      <div className="rules-table-card">
        <div className="rules-table-head">
          <span>Rule</span>
          <span>Category</span>
          <span>Severity</span>
          <span>Enabled</span>
          <span className="rules-cell-actions">Actions</span>
        </div>

        <div className="rules-table-body">
          {loading && <div className="rules-empty">Loading rules...</div>}
          {!loading && !pageError && filteredRules.length === 0 && (
            <div className="rules-empty">No saved rules match your filters. Use “Add rule” to create one.</div>
          )}
          {!loading && filteredRules.map((rule) => (
            <div className="rules-row" key={rule._id}>
              <div className="rules-cell-name">
                <div className="rules-name">{rule.name}</div>
                <div className="rules-pattern">{rule.pattern}</div>
              </div>
              <span className="rules-category">{rule.category}</span>
              <span>
                <span className={`rules-pill rules-pill-${rule.severity.toLowerCase()}`}>
                  {rule.severity}
                </span>
              </span>
              <span className="rules-cell-toggle">
                <button
                  type="button"
                  className={`rules-toggle ${rule.enabled ? "rules-toggle-on" : ""}`}
                  onClick={() => canModify && toggleRule(rule)}
                  disabled={!canModify}
                  aria-label={rule.enabled ? "Disable rule" : "Enable rule"}
                >
                  <span className="rules-toggle-knob" />
                </button>
              </span>
              <span className="rules-cell-actions">
                {canModify && <button type="button" className="rules-icon-btn" onClick={() => openEdit(rule)} title="Edit">
                  <i className="bi bi-pencil"></i>
                </button>}
                {canModify && <button type="button" className="rules-icon-btn rules-icon-btn-danger" onClick={() => openDelete(rule)} title="Delete">
                  <i className="bi bi-trash"></i>
                </button>}
              </span>
            </div>
          ))}
        </div>

        {filteredRules.length > 0 && (
          <div className="rules-table-foot">
            Showing {filteredRules.length} of {rules.length} rules
          </div>
        )}
      </div>

      {modal && (modal.type === "add" || modal.type === "edit") && (
        <div className="rules-modal-backdrop" onClick={closeModal}>
          <div className="rules-modal" onClick={(e) => e.stopPropagation()}>
            <div className="rules-modal-head">
              <h3 className="rules-modal-title">{modal.type === "add" ? "Add new rule" : "Edit rule"}</h3>
              <button type="button" className="rules-modal-close" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="rules-modal-body">
              <label className="rules-field">
                <span>Rule name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. SQL Injection — UNION SELECT"
                />
              </label>
              <label className="rules-field">
                <span>Pattern (what the rule matches)</span>
                <input
                  type="text"
                  value={form.pattern}
                  onChange={(e) => setForm({ ...form, pattern: e.target.value })}
                  placeholder="e.g. UNION\s+SELECT"
                />
              </label>
              <label className="rules-field">
                <span>Category</span>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                  {CATEGORIES.map((cat) => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </label>
              <label className="rules-field">
                <span>Severity</span>
                <select value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
                  {SEVERITIES.map((sev) => <option key={sev} value={sev}>{sev}</option>)}
                </select>
              </label>
              <label className="rules-checkbox">
                <input
                  type="checkbox"
                  checked={form.enabled}
                  onChange={(e) => setForm({ ...form, enabled: e.target.checked })}
                />
                <span>Enable this rule immediately</span>
              </label>
              {formError && <p role="alert" style={{ color: "#b91c1c" }}>{formError}</p>}
            </div>

            <div className="rules-modal-foot">
              <button type="button" className="rules-btn rules-btn-secondary" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button
                type="button"
                className="rules-btn rules-btn-primary"
                onClick={modal.type === "add" ? handleAdd : handleEdit}
                disabled={saving}
              >
                {saving ? "Saving..." : modal.type === "add" ? "Create rule" : "Save changes"}
              </button>
            </div>
          </div>
        </div>
      )}

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
              {formError && <p role="alert" style={{ color: "#b91c1c" }}>{formError}</p>}
            </div>
            <div className="rules-modal-foot">
              <button type="button" className="rules-btn rules-btn-secondary" onClick={closeModal} disabled={saving}>
                Cancel
              </button>
              <button type="button" className="rules-btn rules-btn-danger" onClick={handleDelete} disabled={saving}>
                {saving ? "Deleting..." : "Delete rule"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Rules;
