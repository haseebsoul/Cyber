/**
 * Users.jsx
 * ---------------------------------------------------------
 * User management page with full CRUD.
 *
 * Features:
 *   - Table of users with avatar, role, status, last login
 *   - Live search by name or email
 *   - Filter by role
 *   - Add new user (modal)
 *   - Edit existing user (modal)
 *   - Delete user (confirmation modal)
 *
 * All data lives in useState. Later, it will come from /api/users.
 */

import { useState } from "react";
import "./Users.css";

// ---------- Starting user list ----------
// Each user has: id, name, email, role, status, lastLogin
const INITIAL_USERS = [
  { id: 1, name: "Sarah Chen",    email: "sarah@meridian.io", role: "Administrator",       status: "Active",    lastLogin: "2 min ago" },
  { id: 2, name: "James Liu",     email: "james@prism.io",    role: "SOC Analyst",         status: "Active",    lastLogin: "1 hour ago" },
  { id: 3, name: "Aisha Patel",   email: "aisha@flux.io",     role: "Security Researcher", status: "Active",    lastLogin: "3 hours ago" },
  { id: 4, name: "Marcus Reid",   email: "marcus@quantum.io", role: "SOC Analyst",         status: "Inactive",  lastLogin: "2 days ago" },
  { id: 5, name: "Nina Kowalski", email: "nina@nova.io",      role: "Administrator",       status: "Active",    lastLogin: "5 min ago" },
  { id: 6, name: "Tom Becker",    email: "tom@atlas.io",      role: "Security Researcher", status: "Suspended", lastLogin: "1 week ago" },
];

const ROLES = ["Administrator", "SOC Analyst", "Security Researcher"];
const STATUSES = ["Active", "Inactive", "Suspended"];

// Empty form — used when opening the "Add user" modal
const EMPTY_FORM = {
  name: "",
  email: "",
  role: "Administrator",
  status: "Active",
};

function Users() {
  // ---------- State ----------
  const [users, setUsers] = useState(INITIAL_USERS);
  const [form, setForm] = useState(EMPTY_FORM);
  const [modal, setModal] = useState(null);   // null | {type:'add'} | {type:'edit', user} | {type:'delete', user}
  const [search, setSearch] = useState("");   // search input value
  const [roleFilter, setRoleFilter] = useState("All"); // role dropdown value

  // ---------- Filtering ----------
  // Combines search + role filter into a new array
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());

    const matchesRole =
      roleFilter === "All" || user.role === roleFilter;

    return matchesSearch && matchesRole;
  });

  // ---------- Handlers ----------

  // Open "Add user" modal
  const openAdd = () => {
    setForm(EMPTY_FORM);
    setModal({ type: "add" });
  };

  // Open "Edit user" modal with the selected user's data
  const openEdit = (user) => {
    setForm({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setModal({ type: "edit", user });
  };

  // Open "Delete confirmation" modal
  const openDelete = (user) => {
    setModal({ type: "delete", user });
  };

  // Close any open modal
  const closeModal = () => setModal(null);

  // Handle "Add user" submission
  const handleAdd = () => {
    if (!form.name.trim() || !form.email.trim()) return;

    const newUser = {
      id: Date.now(),
      name: form.name.trim(),
      email: form.email.trim(),
      role: form.role,
      status: form.status,
      lastLogin: "just now",
    };

    setUsers([newUser, ...users]);
    closeModal();
  };

  // Handle "Edit user" submission
  const handleEdit = () => {
    setUsers(
      users.map((user) =>
        user.id === modal.user.id ? { ...user, ...form } : user
      )
    );
    closeModal();
  };

  // Handle "Delete user" confirmation
  const handleDelete = () => {
    setUsers(users.filter((user) => user.id !== modal.user.id));
    closeModal();
  };

  // ---------- Summary counts ----------
  const stats = {
    total:     users.length,
    active:    users.filter((u) => u.status === "Active").length,
    inactive:  users.filter((u) => u.status === "Inactive").length,
    suspended: users.filter((u) => u.status === "Suspended").length,
  };

  return (
    <div className="users-page">

      {/* ============ PAGE HEADER ============ */}
      <div className="users-head">
        <div>
          <h2 className="users-title">Users</h2>
          <p className="users-sub">
            Manage platform users and access roles.
          </p>
        </div>

        <button type="button" className="users-add-btn" onClick={openAdd}>
          <i className="bi bi-plus-lg"></i>
          Add user
        </button>
      </div>

      {/* ============ SUMMARY CARDS ============ */}
      <div className="users-summary">
        <div className="users-summary-card">
          <div className="users-summary-value">{stats.total}</div>
          <div className="users-summary-label">Total</div>
        </div>
        <div className="users-summary-card">
          <div className="users-summary-value">{stats.active}</div>
          <div className="users-summary-label">Active</div>
        </div>
        <div className="users-summary-card">
          <div className="users-summary-value">{stats.inactive}</div>
          <div className="users-summary-label">Inactive</div>
        </div>
        <div className="users-summary-card">
          <div className="users-summary-value">{stats.suspended}</div>
          <div className="users-summary-label">Suspended</div>
        </div>
      </div>

      {/* ============ SEARCH + FILTER BAR ============ */}
      <div className="users-filters">
        <div className="users-search">
          <i className="bi bi-search"></i>
          <input
            type="text"
            placeholder="Search by name or email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <select
          className="users-role-filter"
          value={roleFilter}
          onChange={(e) => setRoleFilter(e.target.value)}
        >
          <option value="All">All roles</option>
          {ROLES.map((role) => (
            <option key={role} value={role}>{role}</option>
          ))}
        </select>
      </div>

      {/* ============ TABLE ============ */}
      <div className="users-table-card">

        {/* Table header */}
        <div className="users-table-head">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last Login</span>
          <span className="users-cell-actions">Actions</span>
        </div>

        {/* Table rows */}
        <div className="users-table-body">

          {filteredUsers.length === 0 && (
            <div className="users-empty">
              No users match your filters.
            </div>
          )}

          {filteredUsers.map((user) => (
            <div className="users-row" key={user.id}>

              {/* User cell — avatar + name + email */}
              <div className="users-cell-user">
                <div className="users-avatar">
                  {user.name.charAt(0).toUpperCase()}
                </div>
                <div>
                  <div className="users-name">{user.name}</div>
                  <div className="users-email">{user.email}</div>
                </div>
              </div>

              {/* Role */}
              <span className="users-role">{user.role}</span>

              {/* Status pill */}
              <span>
                <span className={`users-status users-status-${user.status.toLowerCase()}`}>
                  {user.status}
                </span>
              </span>

              {/* Last login */}
              <span className="users-lastlogin">{user.lastLogin}</span>

              {/* Actions */}
              <span className="users-cell-actions">
                <button
                  type="button"
                  className="users-icon-btn"
                  onClick={() => openEdit(user)}
                  title="Edit"
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  type="button"
                  className="users-icon-btn users-icon-btn-danger"
                  onClick={() => openDelete(user)}
                  title="Delete"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </span>

            </div>
          ))}

        </div>

        {/* Row count footer */}
        {filteredUsers.length > 0 && (
          <div className="users-table-foot">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}

      </div>

      {/* ============ ADD / EDIT MODAL ============ */}
      {modal && (modal.type === "add" || modal.type === "edit") && (
        <div className="users-modal-backdrop" onClick={closeModal}>
          <div className="users-modal" onClick={(e) => e.stopPropagation()}>

            <div className="users-modal-head">
              <h3 className="users-modal-title">
                {modal.type === "add" ? "Add new user" : "Edit user"}
              </h3>
              <button type="button" className="users-modal-close" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="users-modal-body">
              <label className="users-field">
                <span>Full name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Sarah Chen"
                />
              </label>

              <label className="users-field">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => setForm({ ...form, email: e.target.value })}
                  placeholder="e.g. sarah@meridian.io"
                />
              </label>

              <label className="users-field">
                <span>Role</span>
                <select
                  value={form.role}
                  onChange={(e) => setForm({ ...form, role: e.target.value })}
                >
                  {ROLES.map((role) => (
                    <option key={role} value={role}>{role}</option>
                  ))}
                </select>
              </label>

              <label className="users-field">
                <span>Status</span>
                <select
                  value={form.status}
                  onChange={(e) => setForm({ ...form, status: e.target.value })}
                >
                  {STATUSES.map((status) => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </label>
            </div>

            <div className="users-modal-foot">
              <button type="button" className="users-btn users-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button
                type="button"
                className="users-btn users-btn-primary"
                onClick={modal.type === "add" ? handleAdd : handleEdit}
              >
                {modal.type === "add" ? "Create user" : "Save changes"}
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ============ DELETE CONFIRMATION MODAL ============ */}
      {modal && modal.type === "delete" && (
        <div className="users-modal-backdrop" onClick={closeModal}>
          <div className="users-modal users-modal-small" onClick={(e) => e.stopPropagation()}>

            <div className="users-modal-head">
              <h3 className="users-modal-title">Delete user</h3>
              <button type="button" className="users-modal-close" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            <div className="users-modal-body">
              <p className="users-modal-warn">
                Are you sure you want to delete <strong>{modal.user.name}</strong>?
                This action cannot be undone.
              </p>
            </div>

            <div className="users-modal-foot">
              <button type="button" className="users-btn users-btn-secondary" onClick={closeModal}>
                Cancel
              </button>
              <button type="button" className="users-btn users-btn-danger" onClick={handleDelete}>
                Delete user
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}

export default Users;