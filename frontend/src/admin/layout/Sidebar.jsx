/**
 * Sidebar.jsx
 * ---------------------------------------------------------
 * Left navigation menu for the admin workspace.
 * Now includes RBAC (Role-Based Access Control) to hide links
 * based on the user's role.
 */

import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { clearSession, getSession } from "../../session/SessionManager"; // Added getSession
import "./Sidebar.css";

// Menu items — easy to add or remove
const NAV_ITEMS = [
  { path: "/admin",               label: "Dashboard",     icon: "bi-grid-1x2" },
  { path: "/admin/users",         label: "Users",         icon: "bi-people" },
  { path: "/admin/threats",       label: "Threats",       icon: "bi-exclamation-triangle" },
  { path: "/admin/events",        label: "Events",        icon: "bi-activity" },
  { path: "/admin/ip-reputation", label: "IP Reputation", icon: "bi-globe2" },
  { path: "/admin/rules",         label: "Rules",         icon: "bi-shield-check" },
  { path: "/admin/logs",          label: "Logs",          icon: "bi-journal-text" },
  { path: "/admin/settings",      label: "Settings",      icon: "bi-gear" },
];

function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  // 1. GET THE USER ROLE
  const session = getSession();
  const userRole = session?.role || "analyst"; // Defaults to analyst if no session

  // Log out — clear session, go back to login
  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  return (
    <aside className={`sidebar ${collapsed ? "sidebar-collapsed" : ""}`}>

      {/* ============ BRAND ============ */}
      <Link to="/admin" className="sidebar-brand">
        <span className="sidebar-brand-icon">
          <i className="bi bi-shield-lock-fill"></i>
        </span>
        {!collapsed && (
          <div className="sidebar-brand-text">
            <div className="sidebar-brand-name">CyberSentinel</div>
            {/* Dynamic subtitle based on role */}
            <div className="sidebar-brand-sub" style={{ textTransform: 'capitalize' }}>
              {userRole}
            </div>
          </div>
        )}
      </Link>

      {/* ============ NAVIGATION ============ */}
      <nav className="sidebar-nav">
        {/* 2. FILTER THE LINKS BASED ON ROLE */}
        {NAV_ITEMS.filter((item) => {
          // If the user is NOT an admin, hide Users and Settings
          if (userRole !== "admin" && (item.label === "Users" || item.label === "Settings")) {
            return false; 
          }
          return true;
        }).map((item) => {
          const isActive = location.pathname === item.path;
          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
              title={collapsed ? item.label : undefined}
            >
              <i className={`bi ${item.icon} sidebar-item-icon`}></i>
              {!collapsed && <span className="sidebar-item-label">{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* ============ BOTTOM: Collapse + Log out ============ */}
      <div className="sidebar-bottom">

        <button
          type="button"
          className="sidebar-bottom-btn"
          onClick={() => setCollapsed((v) => !v)}
          title={collapsed ? "Expand" : "Collapse"}
        >
          <i className={`bi ${collapsed ? "bi-chevron-double-right" : "bi-chevron-double-left"} sidebar-item-icon`}></i>
          {!collapsed && <span className="sidebar-item-label">Collapse</span>}
        </button>

        <button
          type="button"
          className="sidebar-bottom-btn sidebar-bottom-logout"
          onClick={handleLogout}
          title="Log out"
        >
          <i className="bi bi-box-arrow-right sidebar-item-icon"></i>
          {!collapsed && <span className="sidebar-item-label">Log out</span>}
        </button>

      </div>

    </aside>
  );
}

export default Sidebar;