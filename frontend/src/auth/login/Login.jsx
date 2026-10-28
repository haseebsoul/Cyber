/**
 * Login.jsx
 * ---------------------------------------------------------
 * Split-screen login page for CyberSentinel-AI.
 *
 * VALIDATION is handled by:
 *   - react-hook-form     → manages form state
 *   - zod                 → defines validation rules (email, password)
 *   - @hookform/resolvers  → connects zod to react-hook-form
 *
 * FLOW:
 *   1. User enters email and password.
 *   2. React Hook Form & Zod validate inputs on the client.
 *   3. fetch() sends credentials to Express backend (POST /api/auth/login).
 *   4. Backend verifies credentials against MongoDB Atlas using bcryptjs.
 *   5. On success → saves returned user profile to session → navigates to /admin.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSession } from "../../session/SessionManager";
import "./Login.css";

// ---------- ROLE PICKER DATA ----------
// Visual role selection for the UI workspace
const ROLES = [
  { value: "admin",      icon: "🛡️", title: "Administrator",       description: "Manage users, rules, and platform settings." },
  { value: "analyst",    icon: "📡", title: "SOC Analyst",         description: "Monitor threats and respond to incidents." },
  { value: "researcher", icon: "🧪", title: "Security Researcher", description: "Test detection rules and analyze anomalies." },
];

// ---------- ZOD SCHEMA ----------
// Defines validation rules on the client before sending network requests
const loginSchema = z.object({
  email: z
    .string()
    .min(1, "Email is required")
    .email("Please enter a valid email address"),

  password: z
    .string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters"),
});

function Login() {
  // ---------- Non-form state (role picker, password toggle, server feedback, loading) ----------
  const [role, setRole] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  // ---------- REACT-HOOK-FORM SETUP ----------
  const {
    register,                         
    handleSubmit,                    
    formState: { errors },           
  } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  // ---------- SUBMIT HANDLER ----------
  // "async" allows the function to run asynchronously and use "await"
  // without freezing or blocking the user interface.
  const onSubmit = async (data) => {
    // Reset previous errors and lock the button to prevent duplicate clicks
    setServerError("");
    setLoading(true);

    // "try...catch...finally":
    // "try" attempts the network communication.
    // "catch" handles network drops or when the server is offline.
    // "finally" runs regardless of outcome to re-enable the submit button.
    try {
      // "fetch()" sends an HTTP POST request to the backend authentication endpoint.
      // - method: "POST" securely transmits login credentials in the request body.
      // - headers: indicates that the payload format is JSON.
      // - body: "JSON.stringify()" turns the JavaScript data object into a JSON string.
      const res = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: data.email,
          password: data.password,
        }),
      });

      // "res.json()" asynchronously reads and parses the JSON response from Express.
      const result = await res.json();

      // "res.ok" verifies whether the HTTP response code is between 200 and 299.
      // If the backend returns 401 Unauthorized (wrong password) or 400 Bad Request,
      // res.ok is false, so we show the server error message to the user.
      if (!res.ok) {
        setServerError(result.message || "Invalid email or password.");
        return;
      }

      // SECURITY & ROLE NOTE:
      // We save "result.user" which contains the verified role from MongoDB.
      // We deliberately do NOT override the role with the frontend's local role state,
      // ensuring that user permissions are strictly governed by the backend.
      saveSession(result.user);

      // "navigate()" redirects the user to the admin workspace after successful login.
      navigate("/admin");
    } catch (err) {
      // Handles network failure when backend is not reachable
      setServerError("Unable to connect to server. Please verify the backend is running.");
    } finally {
      // Re-enable the submit button
      setLoading(false);
    }
  };

  return (
    <div className="login-page">

      {/* ==================================================
          LEFT PANEL — image background + brand + tagline
          ================================================== */}
      <div
        className="login-visual"
        style={{
          backgroundImage: "url('/login-visual-v3.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      >
        <div className="login-visual-inner">

          {/* Brand — top of left panel */}
          <Link to="/" className="login-visual-brand">
            <span className="login-visual-brand-icon">🛡️</span>
            <span className="login-visual-brand-name">
              CyberSentinel<span className="login-visual-tm">™</span>
            </span>
          </Link>

          {/* Tagline + stats — bottom of left panel */}
          <div className="login-visual-copy">
            <h2 className="login-visual-title">
              Security that<br />
              <span className="login-visual-title-muted">watches everything.</span>
            </h2>
            <p className="login-visual-text">
              Sign in to inspect requests, monitor threats, and analyze anomalies
              across your entire platform.
            </p>

            <div className="login-visual-stats">
              <div className="login-visual-stat">
                <div className="login-visual-stat-value">99.8%</div>
                <div className="login-visual-stat-label">Firewall uptime</div>
              </div>
              <div className="login-visual-stat">
                <div className="login-visual-stat-value">2,340</div>
                <div className="login-visual-stat-label">Threats blocked</div>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* ==================================================
          RIGHT PANEL — the form
          ================================================== */}
      <div className="login-form-side">
        <div className="login-form-wrap">

          {/* Heading */}
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">
            Choose your role and sign in to your workspace.
          </p>

          {/* FORM — handleSubmit(onSubmit) prevents submission if validation fails */}
          <form className="login-form" onSubmit={handleSubmit(onSubmit)}>

            {/* ---- ROLE PICKER (visual role indicator) ---- */}
            <div className="login-field"> 
              <label className="login-label">Choose your role</label>
              <div className="login-roles">
                {ROLES.map((item) => (
                  <button
                    key={item.value}
                    type="button"
                    className={`login-role ${role === item.value ? "login-role-active" : ""}`}
                    onClick={() => setRole(item.value)}
                  >
                    <span className="login-role-icon">{item.icon}</span>
                    <span className="login-role-name">{item.title}</span>
                  </button>
                ))}
              </div>
              <p className="login-role-description">
                {ROLES.find((item) => item.value === role)?.description}
              </p>
            </div>

            {/* ---- EMAIL FIELD (validated by zod) ---- */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="text"
                className={`login-input ${errors.email ? "login-input-error" : ""}`}
                placeholder="you@example.com"
                {...register("email")}
              />
              {/* Show zod error under the field */}
              {errors.email && (
                <span className="login-field-error">{errors.email.message}</span>
              )}
            </div>

            {/* ---- PASSWORD FIELD (validated by zod) ---- */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-password">Password</label>
              <div className="login-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className={`login-input ${errors.password ? "login-input-error" : ""}`}
                  placeholder="••••••••"
                  {...register("password")}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {/* Show zod error under the field */}
              {errors.password && (
                <span className="login-field-error">{errors.password.message}</span>
              )}
            </div>

            {/* Server Error Message */}
            {serverError && <div className="login-error">{serverError}</div>}

            {/* ---- SUBMIT BUTTON ---- */}
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* Demo credentials box */}
          <div className="login-demo">
            <div className="login-demo-label">Demo login</div>
            <div className="login-demo-row">
              <span>admin@cybersentinel.ai</span>
              <span>admin123</span>
            </div>
          </div>

          {/* Link to registration */}
          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/registration" className="login-link">Create one</Link>
          </p>

          {/* Back to homepage */}
          <Link to="/" className="login-back">← Back to homepage</Link>

        </div>
      </div>

    </div>
  );
}

export default Login;
