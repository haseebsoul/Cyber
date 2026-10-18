/**
 * Users.jsx
 * ---------------------------------------------------------
 * User management page with full CRUD.
 *
 * VALIDATION of the Add/Edit modal is handled by:
 *   - react-hook-form  → manages the modal's form state
 *   - zod              → defines the rules (name, email, role, status)
 *   - @hookform/resolvers → connects zod to react-hook-form
 *
 * Features:
 *   - Table of users
 *   - Live search + role filter
 *   - Add / Edit / Delete operations
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Users.css";

// ---------- STARTING DATA ----------
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

// ---------- ZOD SCHEMA ----------
// Rules for the Add/Edit user modal.
const userSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Name must be at least 3 characters"),

  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  role: z.string().min(1, "Role is required"),

  status: z.string().min(1, "Status is required"),
});

function Users() {
  // ---------- MAIN PAGE STATE ----------
  const [users, setUsers] = useState(INITIAL_USERS);
  const [modal, setModal] = useState(null);       // null | {type:'add'} | {type:'edit',user} | {type:'delete',user}
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("All");

  // ---------- REACT-HOOK-FORM for the modal ----------
  // We connect one form instance that powers both Add and Edit.
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(userSchema),
    defaultValues: {
      name: "",
      email: "",
      role: "Administrator",
      status: "Active",
    },
  });

  // ---------- FILTERING ----------
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ---------- HANDLERS ----------

  // Open "Add user" modal — reset form to empty defaults
  const openAdd = () => {
    reset({ name: "", email: "", role: "Administrator", status: "Active" });
    setModal({ type: "add" });
  };

  // Open "Edit user" modal — pre-fill form with that user's data
  const openEdit = (user) => {
    reset({
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

  // Close any modal
  const closeModal = () => setModal(null);

  // ---------- SUBMIT (validation has passed) ----------
  const onAdd = (data) => {
    const newUser = {
      id: Date.now(),
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      status: data.status,
      lastLogin: "just now",
    };
    setUsers([newUser, ...users]);
    closeModal();
  };

  const onEdit = (data) => {
    setUsers(
      users.map((user) =>
        user.id === modal.user.id
          ? { ...user, name: data.name.trim(), email: data.email.trim(), role: data.role, status: data.status }
          : user
      )
    );
    closeModal();
  };

  const handleDelete = () => {
    setUsers(users.filter((user) => user.id !== modal.user.id));
    closeModal();
  };

  // Reset form when modal closes so next open is clean
  useEffect(() => {
    if (!modal) reset();
  }, [modal, reset]);

  // ---------- SUMMARY COUNTS ----------
  const stats = {
    total:     users.length,
    active:    users.filter((u) => u.status === "Active").length,
    inactive:  users.filter((u) => u.status === "Inactive").length,
    suspended: users.filter((u) => u.status === "Suspended").length,
  };

  return (
    <div className="users-page">

      {/* ==================================================
          PAGE HEADER — title + "Add user" button
          ================================================== */}
      <div className="users-head">
        <div>
          <h2 className="users-title">Users</h2>
          <p className="users-sub">Manage platform users and access roles.</p>
        </div>

        <button type="button" className="users-add-btn" onClick={openAdd}>
          <i className="bi bi-plus-lg"></i>
          Add user
        </button>
      </div>

      {/* ==================================================
          SUMMARY CARDS — total / active / inactive / suspended
          ================================================== */}
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

      {/* ==================================================
          SEARCH + ROLE FILTER bar
          ================================================== */}
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

      {/* ==================================================
          USER TABLE — header + rows + row-count footer
          ================================================== */}
      <div className="users-table-card">

        {/* Table header */}
        <div className="users-table-head">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last Login</span>
          <span className="users-cell-actions">Actions</span>
        </div>

        {/* Table body */}
        <div className="users-table-body">

          {filteredUsers.length === 0 && (
            <div className="users-empty">No users match your filters.</div>
          )}

          {filteredUsers.map((user) => (
            <div className="users-row" key={user.id}>

              {/* User cell — avatar + name + email */}
              <div className="users-cell-user">
                <div className="users-avatar">{user.name.charAt(0).toUpperCase()}</div>
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

              {/* Edit + Delete buttons */}
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

        {filteredUsers.length > 0 && (
          <div className="users-table-foot">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}

      </div>

      {/* ==================================================
          ADD / EDIT MODAL — with validation
          ================================================== */}
      {modal && (modal.type === "add" || modal.type === "edit") && (
        <div className="users-modal-backdrop" onClick={closeModal}>
          <div className="users-modal" onClick={(e) => e.stopPropagation()}>

            {/* Modal header */}
            <div className="users-modal-head">
              <h3 className="users-modal-title">
                {modal.type === "add" ? "Add new user" : "Edit user"}
              </h3>
              <button type="button" className="users-modal-close" onClick={closeModal}>
                <i className="bi bi-x-lg"></i>
              </button>
            </div>

            {/* Modal form — validation via handleSubmit */}
            <form onSubmit={handleSubmit(modal.type === "add" ? onAdd : onEdit)}>

              <div className="users-modal-body">

                {/* Name field — zod validates 3+ chars */}
                <label className="users-field">
                  <span>Full name</span>
                  <input
                    type="text"
                    className={errors.name ? "users-input-error" : ""}
                    placeholder="e.g. Sarah Chen"
                    {...register("name")}
                  />
                  {errors.name && (
                    <span className="users-field-error">{errors.name.message}</span>
                  )}
                </label>

                {/* Email field — zod validates email format */}
                <label className="users-field">
                  <span>Email</span>
                  <input
                    type="text"
                    className={errors.email ? "users-input-error" : ""}
                    placeholder="e.g. sarah@meridian.io"
                    {...register("email")}
                  />
                  {errors.email && (
                    <span className="users-field-error">{errors.email.message}</span>
                  )}
                </label>

                {/* Role dropdown */}
                <label className="users-field">
                  <span>Role</span>
                  <select {...register("role")}>
                    {ROLES.map((role) => (
                      <option key={role} value={role}>{role}</option>
                    ))}
                  </select>
                  {errors.role && (
                    <span className="users-field-error">{errors.role.message}</span>
                  )}
                </label>

                {/* Status dropdown */}
                <label className="users-field">
                  <span>Status</span>
                  <select {...register("status")}>
                    {STATUSES.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                  {errors.status && (
                    <span className="users-field-error">{errors.status.message}</span>
                  )}
                </label>

              </div>

              {/* Modal footer — Cancel + Submit */}
              <div className="users-modal-foot">
                <button type="button" className="users-btn users-btn-secondary" onClick={closeModal}>
                  Cancel
                </button>
                <button type="submit" className="users-btn users-btn-primary">
                  {modal.type === "add" ? "Create user" : "Save changes"}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* ==================================================
          DELETE CONFIRMATION MODAL
          ================================================== */}
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