/**
 * Sidebar.jsx
 * ---------------------------------------------------------
 * Left navigation menu for the admin workspace.
 *
 * How it works:
 *   - NAV_ITEMS is a simple array of menu items.
 *     Each item has: path (URL), label (name), icon (bootstrap-icon class).
 *   - We loop through the array with .map() and render a <Link>
 *     for each item.
 *   - React Router's <Link> changes the URL without a page reload.
 *   - useLocation() tells us which page we are on, so we can
 *     highlight the matching item.
 */

import { Link, useLocation } from "react-router";
import "./Sidebar.css";

// Each item:
//   path  → where the link goes
//   label → text shown to the user
//   icon  → Bootstrap Icons class name (bi-*)
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
  // Current page path — e.g. "/admin/users"
  const location = useLocation();

  return (
    <aside className="sidebar">

      {/* ---------- Brand (top of sidebar) ---------- */}
      <Link to="/admin" className="sidebar-brand">
        <span className="sidebar-brand-icon">
          <i className="bi bi-shield-lock-fill"></i>
        </span>
        <div className="sidebar-brand-text">
          <div className="sidebar-brand-name">CyberSentinel</div>
          <div className="sidebar-brand-sub">Admin</div>
        </div>
      </Link>

      {/* ---------- Navigation menu ---------- */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          // Highlight this item if we are on its page
          const isActive = location.pathname === item.path;

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`sidebar-item ${isActive ? "sidebar-item-active" : ""}`}
            >
              <i className={`bi ${item.icon} sidebar-item-icon`}></i>
              <span className="sidebar-item-label">{item.label}</span>
            </Link>
          );
        })}
      </nav>

    </aside>
  );
}

export default Sidebar;