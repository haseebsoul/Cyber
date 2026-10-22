/**
 * Users.jsx
 * ---------------------------------------------------------
 * User management page with full CRUD (Create, Read, Update, Delete).
 *
 * VALIDATION is handled by 3 packages working together:
 *   1. react-hook-form    → Runs the form and tracks the inputs.
 *   2. zod                → Defines the validation rules.
 *   3. @hookform/resolvers → The bridge that connects Zod rules to RHF.
 *
 * Features:
 *   - Table of users with live search + role filter.
 *   - Add new user (via modal).
 *   - Edit existing user (via modal).
 *   - Delete user (via confirmation modal).
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form"; 
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import "./Users.css";

// ---------- STARTING DATA (Mock Data) ----------
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

// ============================================================
// ZOD SCHEMA — The Validation Rules
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

  // Using z.enum instead of z.string()
  // This acts as a whitelist. It ONLY accepts these 3 exact strings.
  // If the value is "" (empty), it will fail and trigger the errorMap.
  role: z.enum(["Administrator", "SOC Analyst", "Security Researcher"], {
    errorMap: () => ({ message: "Please select a valid role" }),
  }),

  status: z.enum(["Active", "Inactive", "Suspended"], {
    errorMap: () => ({ message: "Please select a valid status" }),
  }),
});

function Users() {
  // ---------- PAGE STATE ----------
  const [users, setUsers] = useState(INITIAL_USERS); // Holds the list of users
  const [modal, setModal] = useState(null);          // null | {type:'add'} | {type:'edit',user} | {type:'delete',user}
  const [search, setSearch] = useState("");          // Search input text
  const [roleFilter, setRoleFilter] = useState("All"); // Role dropdown filter

  // ---------- REACT-HOOK-FORM SETUP ----------
  const {
    register,              // Connects inputs to the form
    handleSubmit,          // Blocks submission if Zod fails
    reset,                 // Clears form data
    formState: { errors }, // Holds Zod error messages
  } = useForm({
    resolver: zodResolver(userSchema), // Connects Zod to React Hook Form
    defaultValues: {
      name: "",
      email: "",
      role: "",   // ✅ Starts empty so they MUST choose
      status: "", // ✅ Starts empty so they MUST choose
    },
  });

  // ---------- FILTERING (Search + Dropdown) ----------
  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.name.toLowerCase().includes(search.toLowerCase()) ||
      user.email.toLowerCase().includes(search.toLowerCase());
    const matchesRole = roleFilter === "All" || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  // ---------- HANDLERS ----------

  // Opens Add Modal and resets the form to empty defaults
  const openAdd = () => {
    reset({ name: "", email: "", role: "", status: "" }); // ✅ Reset to empty
    setModal({ type: "add" });
  };

  // Opens Edit Modal and fills the form with the selected user's data
  const openEdit = (user) => {
    reset({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setModal({ type: "edit", user });
  };

  // Opens Delete confirmation modal
  const openDelete = (user) => {
    setModal({ type: "delete", user });
  };

  // Closes any open modal
  const closeModal = () => setModal(null);

  // ---------- SUBMIT ACTIONS (Only run if validation passes) ----------
  
  // Create new user
  const onAdd = (data) => {
    const newUser = {
      id: Date.now(), // Simple unique ID
      name: data.name.trim(),
      email: data.email.trim(),
      role: data.role,
      status: data.status,
      lastLogin: "just now",
    };
    setUsers([newUser, ...users]);
    closeModal();
  };

  // Update existing user
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

  // Delete user
  const handleDelete = () => {
    setUsers(users.filter((user) => user.id !== modal.user.id));
    closeModal();
  };

  // Cleanup: Reset form errors whenever the modal closes
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
          PAGE HEADER
          ================================================== */}
      <div className="users-head">
        <div>
          <h2 className="users-title">Users</h2>
          <p className="users-sub">Manage platform users and access roles.</p>
        </div>
        <button type="button" className="users-add-btn" onClick={openAdd}>
          <i className="bi bi-plus-lg"></i> Add user
        </button>
      </div>

      {/* ==================================================
          SUMMARY CARDS
          ================================================== */}
      <div className="users-summary">
        <div className="users-summary-card"><div className="users-summary-value">{stats.total}</div><div className="users-summary-label">Total</div></div>
        <div className="users-summary-card"><div className="users-summary-value">{stats.active}</div><div className="users-summary-label">Active</div></div>
        <div className="users-summary-card"><div className="users-summary-value">{stats.inactive}</div><div className="users-summary-label">Inactive</div></div>
        <div className="users-summary-card"><div className="users-summary-value">{stats.suspended}</div><div className="users-summary-label">Suspended</div></div>
      </div>

      {/* ==================================================
          SEARCH + ROLE FILTER
          ================================================== */}
      <div className="users-filters">
        <div className="users-search">
          <i className="bi bi-search"></i>
          <input type="text" placeholder="Search by name or email" value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="users-role-filter" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="All">All roles</option>
          {ROLES.map((role) => <option key={role} value={role}>{role}</option>)}
        </select>
      </div>

      {/* ==================================================
          USER TABLE
          ================================================== */}
      <div className="users-table-card">
        <div className="users-table-head">
          <span>User</span><span>Role</span><span>Status</span><span>Last Login</span><span className="users-cell-actions">Actions</span>
        </div>

        <div className="users-table-body">
          {filteredUsers.length === 0 && <div className="users-empty">No users match your filters.</div>}
          
          {filteredUsers.map((user) => (
            <div className="users-row" key={user.id}>
              <div className="users-cell-user">
                <div className="users-avatar">{user.name.charAt(0).toUpperCase()}</div>
                <div>
                  <div className="users-name">{user.name}</div>
                  <div className="users-email">{user.email}</div>
                </div>
              </div>
              <span className="users-role">{user.role}</span>
              <span><span className={`users-status users-status-${user.status.toLowerCase()}`}>{user.status}</span></span>
              <span className="users-lastlogin">{user.lastLogin}</span>
              <span className="users-cell-actions">
                <button type="button" className="users-icon-btn" onClick={() => openEdit(user)} title="Edit"><i className="bi bi-pencil"></i></button>
                <button type="button" className="users-icon-btn users-icon-btn-danger" onClick={() => openDelete(user)} title="Delete"><i className="bi bi-trash"></i></button>
              </span>
            </div>
          ))}
        </div>

        {filteredUsers.length > 0 && (
          <div className="users-table-foot">Showing {filteredUsers.length} of {users.length} users</div>
        )}
      </div>

      {/* ==================================================
          ADD / EDIT MODAL
          ================================================== */}
      {modal && (modal.type === "add" || modal.type === "edit") && (
        <div className="users-modal-backdrop" onClick={closeModal}>
          <div className="users-modal" onClick={(e) => e.stopPropagation()}>
            
            <div className="users-modal-head">
              <h3 className="users-modal-title">{modal.type === "add" ? "Add new user" : "Edit user"}</h3>
              <button type="button" className="users-modal-close" onClick={closeModal}><i className="bi bi-x-lg"></i></button>
            </div>

            {/* handleSubmit ensures data is valid BEFORE running onAdd/onEdit */}
            <form onSubmit={handleSubmit(modal.type === "add" ? onAdd : onEdit)}>
              <div className="users-modal-body">
                
                {/* Name Input */}
                <label className="users-field">
                  <span>Full name</span>
                  <input 
                    type="text" 
                    className={errors.name ? "users-input-error" : ""} 
                    placeholder="e.g. Sarah Chen" 
                    {...register("name")} // Connects to RHF
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
                    {...register("email")} // Connects to RHF
                  />
                  {errors.email && <span className="users-field-error">{errors.email.message}</span>}
                </label>

                {/* Role Dropdown (Updated with placeholder and error class) */}
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

                {/* Status Dropdown (Updated with placeholder and error class) */}
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
                <button type="button" className="users-btn users-btn-secondary" onClick={closeModal}>Cancel</button>
                <button type="submit" className="users-btn users-btn-primary">{modal.type === "add" ? "Create user" : "Save changes"}</button>
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
              <button type="button" className="users-modal-close" onClick={closeModal}><i className="bi bi-x-lg"></i></button>
            </div>
            <div className="users-modal-body">
              <p className="users-modal-warn">Are you sure you want to delete <strong>{modal.user.name}</strong>? This action cannot be undone.</p>
            </div>
            <div className="users-modal-foot">
              <button type="button" className="users-btn users-btn-secondary" onClick={closeModal}>Cancel</button>
              <button type="button" className="users-btn users-btn-danger" onClick={handleDelete}>Delete user</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}

export default Users;