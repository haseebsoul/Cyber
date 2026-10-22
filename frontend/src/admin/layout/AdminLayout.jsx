/**
 * AdminLayout.jsx
 * ---------------------------------------------------------
 * The shell for the admin workspace.
 * Contains:
 *   - Sidebar (left navigation)
 *   - Topbar (top bar with user info)
 *   - Content area (children — the current page)
 */

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import "./AdminLayout.css";

function AdminLayout({ session, children }) {
  return (
    <div className="admin-layout">
      {/* Left navigation */}
      <Sidebar />

      {/* Right side: topbar + page content */}
      <div className="admin-main">
        <Topbar session={session} />
        <main className="admin-content">{children}</main>
      </div>
    </div>
  );
}

export default AdminLayout;