/**
 * Users.jsx
 * ---------------------------------------------------------
 * User management page for CyberSentinel-AI (Admin Workspace).
 * Connected to live MongoDB Atlas CRUD APIs via Express.
 *
 * Architecture Flow:
 *   Users.jsx (React)
 *     ---> fetch() HTTP Requests (GET, POST, PUT, DELETE)
 *     ---> Express Server (server.js mounted at /api/users)
 *     ---> userRoutes.js ---> userController.js
 *     ---> Mongoose Model (User.js)
 *     ---> MongoDB Atlas Database
 *
 * VALIDATION:
 *   - react-hook-form     → manages form inputs & state
 *   - zod                 → defines client-side validation rules
 *   - @hookform/resolvers  → connects zod to react-hook-form
 */

import { useState, useEffect, useCallback } from "react";
import { useForm } from "react-hook-form"; 
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Users.css";

// Supported UI roles & statuses
const ROLES = ["Administrator", "SOC Analyst", "Security Researcher"];
const STATUSES = ["Active", "Inactive", "Suspended"];

// Normalization map: converts backend role codes to readable UI labels
const ROLE_DISPLAY_MAP = {
  admin: "Administrator",
  Administrator: "Administrator",
  analyst: "SOC Analyst",
  "SOC Analyst": "SOC Analyst",
  researcher: "Security Researcher",
  "Security Researcher": "Security Researcher",
};

const formatRole = (role) => ROLE_DISPLAY_MAP[role] || role || "SOC Analyst";

// Helper to format creation timestamp into readable display
const formatLastSeen = (user) => {
  if (user.createdAt) {
    const d = new Date(user.createdAt);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }
  return "Recent";
};

// ============================================================
// ZOD SCHEMA — Client Validation Rules
// ============================================================
const userSchema = z.object({
  name: z
    .string()
    .min(1, "Full name is required")
    .min(3, "Name must be at least 3 characters"),

  email: z  
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .optional(),

  role: z.enum(["Administrator", "SOC Analyst", "Security Researcher"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),

  status: z.enum(["Active", "Inactive", "Suspended"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
});

function Users() {
  // ---------- PAGE STATE ----------
  const [users, setUsers] = useState([]);               // Live users from MongoDB
  const [loading, setLoading] = useState(true);          // Loading state for initial fetch
  const [pageError, setPageError] = useState("");        // Error banner for table operations
  const [modal, setModal] = useState(null);              // null | {type:'add'} | {type:'edit',user} | {type:'delete',user}
  const [modalSubmitting, setModalSubmitting] = useState(false); // Submission lock for modals
  const [modalError, setModalError] = useState("");      // Error message inside modals
  const [search, setSearch] = useState("");              // Search text filter
  const [roleFilter, setRoleFilter] = useState("All");   // Role dropdown filter

  // ---------- REACT-HOOK-FORM SETUP ----------
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
      password: "",
      role: "",
      status: "",
    },
  });

  // ---------- 1. FETCH USERS FROM MONGODB API ----------
  // "useCallback" ensures the function reference remains stable across renders
  const fetchUsers = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      // "fetch()" sends an HTTP GET request to our Express endpoint
      const res = await fetch("http://localhost:5000/api/users");
      const data = await res.json();

      // "res.ok" verifies if the status is 200-299
      if (!res.ok) {
        throw new Error(data.message || "Failed to retrieve users from server.");
      }

      setUsers(data.users || []);
    } catch (err) {
      setPageError(err.message || "Could not connect to the backend server.");
    } finally {
      setLoading(false);
    }
  }, []);

  // "useEffect" runs once on component mount to load users from the database
  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  // ---------- 2. FILTERING (Search + Role Filter) ----------
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      (user.name && user.name.toLowerCase().includes(search.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(search.toLowerCase()));
    const displayRole = formatRole(user.role);
    const matchesRole = roleFilter === "All" || displayRole === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ---------- 3. MODAL HANDLERS ----------
  const openAdd = () => {
    setModalError("");
    reset({ name: "", email: "", password: "", role: "", status: "" });
    setModal({ type: "add" });
  };

  const openEdit = (user) => {
    setModalError("");
    reset({
      name: user.name,
      email: user.email,
      password: "",
      role: formatRole(user.role),
      status: user.status || "Active",
    });
    setModal({ type: "edit", user });
  };

  const openDelete = (user) => {
    setModalError("");
    setModal({ type: "delete", user });
  };

  const closeModal = () => {
    setModal(null);
    setModalError("");
    reset();
  };

  // ---------- 4. CRUD OPERATIONS (Native fetch to Express Backend) ----------

  // CREATE USER (POST /api/users)
  const onAdd = async (data) => {
    // Validate password for new user creation
    if (!data.password || data.password.length < 6) {
      setModalError("Password is required and must be at least 6 characters.");
      return;
    }

    setModalSubmitting(true);
    setModalError("");

    try {
      const res = await fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          password: data.password,
          role: data.role,
          status: data.status,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setModalError(result.message || "Failed to create user.");
        return;
      }

      // Refresh data directly from MongoDB and close modal
      await fetchUsers();
      closeModal();
    } catch (err) {
      setModalError("Server connection failure. Please verify the backend is running.");
    } finally {
      setModalSubmitting(false);
    }
  };

  // UPDATE USER (PUT /api/users/:id)
  const onEdit = async (data) => {
    setModalSubmitting(true);
    setModalError("");

    try {
      const res = await fetch(`http://localhost:5000/api/users/${modal.user._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name.trim(),
          email: data.email.trim(),
          role: data.role,
          status: data.status,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setModalError(result.message || "Failed to update user.");
        return;
      }

      // Refresh data directly from MongoDB and close modal
      await fetchUsers();
      closeModal();
    } catch (err) {
      setModalError("Server connection failure. Please verify the backend is running.");
    } finally {
      setModalSubmitting(false);
    }
  };

  // DELETE USER (DELETE /api/users/:id)
  const handleDelete = async () => {
    setModalSubmitting(true);
    setModalError("");

    try {
      const res = await fetch(`http://localhost:5000/api/users/${modal.user._id}`, {
        method: "DELETE",
      });

      const result = await res.json();

      if (!res.ok) {
        setModalError(result.message || "Failed to delete user.");
        return;
      }

      // Refresh data directly from MongoDB and close modal
      await fetchUsers();
      closeModal();
    } catch (err) {
      setModalError("Server connection failure. Please verify the backend is running.");
    } finally {
      setModalSubmitting(false);
    }
  };

  // ---------- 5. SUMMARY STATS (Calculated live from MongoDB data) ----------
  const stats = {
    total:     users.length,
    active:    users.filter((u) => u.status === "Active").length,
    inactive:  users.filter((u) => u.status === "Inactive").length,
    suspended: users.filter((u) => u.status === "Suspended").length,
  };

  return (
    <div className="users-page">

      {/* ==================================================
          PAGE HEADER
          ================================================== */}
      <div className="users-head">
        <div>
          <h2 className="users-title">Users</h2>
          <p className="users-sub">Manage platform users and access roles backed by MongoDB Atlas.</p>
        </div>
        <button type="button" className="users-add-btn" onClick={openAdd}>
          <i className="bi bi-plus-lg"></i> Add user
        </button>
      </div>

      {/* ==================================================
          SUMMARY CARDS
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
          SEARCH + ROLE FILTER
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
          USER TABLE
          ================================================== */}
      <div className="users-table-card">
        <div className="users-table-head">
          <span>User</span>
          <span>Role</span>
          <span>Status</span>
          <span>Last Login</span>
          <span className="users-cell-actions">Actions</span>
        </div>

        <div className="users-table-body">
          {/* Loading Indicator */}
          {loading && (
            <div className="users-empty">
              <i className="bi bi-arrow-repeat me-2"></i> Loading users from MongoDB Atlas...
            </div>
          )}

          {/* Error Message */}
          {!loading && pageError && (
            <div className="users-empty" style={{ color: "#b91c1c" }}>
              <i className="bi bi-exclamation-triangle me-2"></i> {pageError}
            </div>
          )}

          {/* Empty Filter State */}
          {!loading && !pageError && filteredUsers.length === 0 && (
            <div className="users-empty">No users match your filters.</div>
          )}

          {/* Table Rows (using MongoDB _id as key) */}
          {!loading && !pageError && filteredUsers.map((user) => (
            <div className="users-row" key={user._id}>
              <div className="users-cell-user">
                <div className="users-avatar">
                  {user.name ? user.name.charAt(0).toUpperCase() : "U"}
                </div>
                <div>
                  <div className="users-name">{user.name}</div>
                  <div className="users-email">{user.email}</div>
                </div>
              </div>
              <span className="users-role">{formatRole(user.role)}</span>
              <span>
                <span className={`users-status users-status-${(user.status || "active").toLowerCase()}`}>
                  {user.status || "Active"}
                </span>
              </span>
              <span className="users-lastlogin">{formatLastSeen(user)}</span>
              <span className="users-cell-actions">
                <button
                  type="button"
                  className="users-icon-btn"
                  onClick={() => openEdit(user)}
                  title="Edit user"
                >
                  <i className="bi bi-pencil"></i>
                </button>
                <button
                  type="button"
                  className="users-icon-btn users-icon-btn-danger"
                  onClick={() => openDelete(user)}
                  title="Delete user"
                >
                  <i className="bi bi-trash"></i>
                </button>
              </span>
            </div>
          ))}
        </div>

        {/* Table Footer */}
        {!loading && !pageError && filteredUsers.length > 0 && (
          <div className="users-table-foot">
            Showing {filteredUsers.length} of {users.length} users
          </div>
        )}
      </div>

      {/* ==================================================
          ADD / EDIT MODAL
          ================================================== */}
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

            <form onSubmit={handleSubmit(modal.type === "add" ? onAdd : onEdit)}>
              <div className="users-modal-body">
                
                {/* Modal Server Error Feedback */}
                {modalError && (
                  <div
                    style={{
                      padding: "10px 14px",
                      background: "rgba(220, 38, 38, 0.06)",
                      border: "1px solid rgba(220, 38, 38, 0.15)",
                      borderRadius: "8px",
                      fontSize: "0.82rem",
                      color: "#b91c1c",
                    }}
                  >
                    {modalError}
                  </div>
                )}

                {/* Name Input */}
                <label className="users-field">
                  <span>Full name</span>
                  <input 
                    type="text" 
                    className={errors.name ? "users-input-error" : ""} 
                    placeholder="e.g. Sarah Chen" 
                    {...register("name")}
                  />
                  {errors.name && <span className="users-field-error">{errors.name.message}</span>}
                </label>

                {/* Email Input */}
                <label className="users-field">
                  <span>Email</span>
                  <input 
                    type="text" 
                    className={errors.email ? "users-input-error" : ""} 
                    placeholder="e.g. sarah@meridian.io" 
                    {...register("email")}
                  />
                  {errors.email && <span className="users-field-error">{errors.email.message}</span>}
                </label>

                {/* Password Input (ONLY in Add User Modal) */}
                {modal.type === "add" && (
                  <label className="users-field">
                    <span>Password</span>
                    <input 
                      type="password" 
                      placeholder="At least 6 characters" 
                      {...register("password")}
                    />
                  </label>
                )}

                {/* Role Dropdown */}
                <label className="users-field">
                  <span>Role</span>
                  <select 
                    className={errors.role ? "users-input-error" : ""} 
                    {...register("role")}
                  >
                    <option value="" disabled>Select a role</option>
                    {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
                  </select>
                  {errors.role && <span className="users-field-error">{errors.role.message}</span>}
                </label>

                {/* Status Dropdown */}
                <label className="users-field">
                  <span>Status</span>
                  <select 
                    className={errors.status ? "users-input-error" : ""} 
                    {...register("status")}
                  >
                    <option value="" disabled>Select a status</option>
                    {STATUSES.map((status) => <option key={status} value={status}>{status}</option>)}
                  </select>
                  {errors.status && <span className="users-field-error">{errors.status.message}</span>}
                </label>

              </div>

              <div className="users-modal-foot">
                <button
                  type="button"
                  className="users-btn users-btn-secondary"
                  onClick={closeModal}
                  disabled={modalSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="users-btn users-btn-primary"
                  disabled={modalSubmitting}
                >
                  {modalSubmitting
                    ? "Saving..."
                    : modal.type === "add"
                    ? "Create user"
                    : "Save changes"}
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
              <button
                type="button"
                className="users-modal-close"
                onClick={closeModal}
                disabled={modalSubmitting}
              >
                <i className="bi bi-x-lg"></i>
              </button>
            </div>
            <div className="users-modal-body">
              <p className="users-modal-warn">
                Are you sure you want to delete <strong>{modal.user.name}</strong>? This action cannot be undone.
              </p>

              {modalError && (
                <div
                  style={{
                    padding: "10px 14px",
                    background: "rgba(220, 38, 38, 0.06)",
                    border: "1px solid rgba(220, 38, 38, 0.15)",
                    borderRadius: "8px",
                    fontSize: "0.82rem",
                    color: "#b91c1c",
                    marginTop: "12px",
                  }}
                >
                  {modalError}
                </div>
              )}
            </div>
            <div className="users-modal-foot">
              <button
                type="button"
                className="users-btn users-btn-secondary"
                onClick={closeModal}
                disabled={modalSubmitting}
              >
                Cancel
              </button>
              <button
                type="button"
                className="users-btn users-btn-danger"
                onClick={handleDelete}
                disabled={modalSubmitting}
              >
                {modalSubmitting ? "Deleting..." : "Delete user"}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Users;
