/**
 * Admin.jsx
 * ---------------------------------------------------------
 * Entry point for the admin workspace.
 *
 * Responsibilities:
 *   1. Check if the user is logged in (session check)
 *   2. Redirect to /login if not logged in
 *   3. Render AdminLayout with nested routes for each page
 *
 * Nested routes (inside /admin/*):
 *   /admin                → Dashboard
 *   /admin/users          → Users
 *   /admin/threats        → Threats
 *   /admin/events         → Events
 *   /admin/ip-reputation  → IP Reputation
 *   /admin/rules          → Rules
 *   /admin/logs           → Logs
 *   /admin/settings       → Settings
 */

import { useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router";

import { getSession } from "../session/SessionManager";
import AdminLayout from "./layout/AdminLayout";

// Admin pages
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Threats from "./pages/Threats";
import Events from "./pages/Events";
import IPReputation from "./pages/IPReputation";
import Rules from "./pages/Rules";
import Logs from "./pages/Logs";
import Settings from "./pages/Settings";

import "./Admin.css";

function Admin() {
  const navigate = useNavigate();
  const session = getSession();

  // If not logged in, redirect to /login
  useEffect(() => {
    if (!session) {
      navigate("/login", { replace: true });
    }
  }, [session, navigate]);

  // Don't render anything while redirecting
  if (!session) {
    return null;
  }

  return (
    <div className="admin-app">
      <AdminLayout session={session}>
        {/* Nested routes — URL decides which page shows */}
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="users" element={<Users />} />
          <Route path="threats" element={<Threats />} />
          <Route path="events" element={<Events />} />
          <Route path="ip-reputation" element={<IPReputation />} />
          <Route path="rules" element={<Rules />} />
          <Route path="logs" element={<Logs />} />
          <Route path="settings" element={<Settings />} />
        </Routes>
      </AdminLayout>
    </div>
  );
}

export default Admin;