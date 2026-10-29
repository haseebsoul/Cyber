/**
 * Admin.jsx
 * ---------------------------------------------------------
 * Entry point for the admin workspace.
 * Handles RBAC (Role-Based Access Control) for routes.
 */

import { useEffect } from "react";
import { Routes, Route, useNavigate, Navigate } from "react-router"; // Added Navigate

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

  // 1. CHECK IF THE USER IS AN ADMIN
  const isAdmin = session?.role === "admin";

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
          
          {/* 2. PROTECTED ROUTES: Only show if isAdmin is true */}
          {isAdmin && <Route path="users" element={<Users />} />}
          
          <Route path="threats" element={<Threats />} />
          <Route path="events" element={<Events />} />
          <Route path="ip-reputation" element={<IPReputation />} />
          <Route path="rules" element={<Rules />} />
          <Route path="logs" element={<Logs />} />
          
          {/* Protected Route for Settings */}
          {isAdmin && <Route path="settings" element={<Settings />} />}

          {/* 3. CATCH-ALL: If an Analyst types /admin/users, redirect to Dashboard */}
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </AdminLayout>
    </div>
  );
}

export default Admin;