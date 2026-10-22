/**
 * Topbar.jsx
 * ---------------------------------------------------------
 * Top bar for the admin workspace.
 *
 * Shows:
 *   - Current page name (auto-detected from URL)
 *   - Notification bell (with dot)
 *   - User avatar + role
 *   - Log out button
 *
 * Uses useLocation() to know which page is active.
 * Uses useNavigate() to handle logout redirect.
 */

import { Link, useLocation, useNavigate } from "react-router";
import { clearSession } from "../../session/SessionManager";
import "./Topbar.css";

// Map URL paths to readable page names
const PAGE_NAMES = {
  "/admin":               "Dashboard",
  "/admin/users":         "Users",
  "/admin/threats":       "Threats",
  "/admin/events":        "Events",
  "/admin/ip-reputation": "IP Reputation",
  "/admin/rules":         "Rules",
  "/admin/logs":          "Logs",
  "/admin/settings":      "Settings",
};

function Topbar({ session }) {
  const location = useLocation();
  const navigate = useNavigate();

  // Find the current page name from the URL
  const currentPage = PAGE_NAMES[location.pathname] || "Admin";

  const handleLogout = () => {
    clearSession();
    navigate("/login", { replace: true });
  };

  const initial = session?.email?.charAt(0).toUpperCase() || "U";
  const username = session?.email?.split("@")[0] || "user";

  return (
    <header className="topbar">

      {/* ============ LEFT — breadcrumb ============ */}
      <div className="topbar-left">
        <Link to="/admin" className="topbar-home">
          Admin
        </Link>
        <i className="bi bi-chevron-right topbar-crumb-icon"></i>
        <span className="topbar-page">{currentPage}</span>
      </div>

      {/* ============ RIGHT — actions ============ */}
      <div className="topbar-right">

        <button type="button" className="topbar-icon-btn" aria-label="Notifications">
          <i className="bi bi-bell"></i>
          <span className="topbar-notif-dot"></span>
        </button>

        <div className="topbar-user">
          <div className="topbar-avatar">{initial}</div>
          <div className="topbar-user-info">
            <div className="topbar-user-name">{username}</div>
            <div className="topbar-user-role">{session?.role || "admin"}</div>
          </div>
        </div>

        <button
          type="button"
          className="topbar-logout"
          onClick={handleLogout}
          title="Log out"
        >
          <i className="bi bi-box-arrow-right"></i>
          <span className="topbar-logout-text">Log out</span>
        </button>

      </div>

    </header>
  );
}

export default Topbar;