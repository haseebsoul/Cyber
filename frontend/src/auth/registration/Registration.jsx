/**
 * Registration.jsx
 * ---------------------------------------------------------
 * Create account form for CyberSentinel-AI.
 *
 * VALIDATION uses:
 *   - react-hook-form    → manages form state
 *   - zod                → defines validation rules (name, email, password, confirm)
 *   - @hookform/resolvers → connects zod to react-hook-form
 *
 * FLOW:
 *   1. User inputs name, email, password, confirm password, and role.
 *   2. React Hook Form & Zod validate inputs on the client.
 *   3. fetch() sends data to Express backend (POST /api/auth/register).
 *   4. Backend verifies uniqueness and hashes password with bcryptjs.
 *   5. On success → saves user to session (no password) → navigates to /admin.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSession } from "../../session/SessionManager";
import "./Registration.css";

const ROLES = [
  { value: "admin",      icon: "🛡️", title: "Administrator" },
  { value: "analyst",    icon: "📡", title: "SOC Analyst" },
  { value: "researcher", icon: "🧪", title: "Researcher" },
];

// ---------- ZOD SCHEMA ----------
// Note: "confirm" must match "password" — .refine() handles cross-field validation.
const registerSchema = z
  .object({
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
      .min(1, "Password is required")
      .min(6, "Password must be at least 6 characters"),

    confirm: z
      .string()
      .min(1, "Please confirm your password"),
  })
  .refine((data) => data.password === data.confirm, {
    message: "Ewww Passwords do not match",
    path: ["confirm YOU enter sweetheart :)"], // show this error on the "confirm" field
  });

function Registration() {
  const [role, setRole] = useState("admin");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirm: "",
    },
  });

  // ---------- SUBMIT HANDLER ----------
  // "async" allows us to pause execution using "await" while waiting for the network response.
  const onSubmit = async (data) => {
    // Clear any previous error and set loading to true to prevent multiple clicks
    setServerError("");
    setLoading(true);

    // "try...catch...finally":
    // "try" runs the network request.
    // "catch" intercepts any connection errors (e.g. backend server is offline).
    // "finally" always runs at the end to re-enable the button.
    try {
      // "fetch()" sends an HTTP request to our Express backend.
      // - method: "POST" tells the server we are sending new data.
      // - headers: informs the server the payload format is JSON.
      // - body: "JSON.stringify()" converts our JavaScript object into a JSON string.
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: role,
        }),
      });

      // "res.json()" parses the incoming JSON response body from the server.
      const result = await res.json();

      // "res.ok" is true for successful HTTP status codes (200-299).
      // If the server returned an error (e.g. 400 or 409 for duplicate email),
      // res.ok is false, so we display the server's error message.
      if (!res.ok) {
        setServerError(result.message || "Registration failed. Please try again.");
        return;
      }

      // "saveSession()" stores the sanitized user profile (id, name, email, role)
      // in browser localStorage. Notice: passwords are NEVER saved.
      saveSession(result.user);

      // "navigate()" redirects the user to the protected admin dashboard.
      navigate("/admin");
    } catch (err) {
      // Catches network/server connection failures (e.g. server not running)
      setServerError("Unable to connect to server. Please verify the backend is running.");
    } finally {
      // Re-enable the submit button regardless of success or error
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      <div className="register-card">

        {/* Brand */}
        <Link to="/" className="register-brand">
          <span className="register-brand-icon">🛡️</span>
          <span className="register-brand-name">CyberSentinel-AI</span>
        </Link>

        {/* Heading */}
        <h1 className="register-title">Create your account</h1>
        <p className="register-subtitle">
          Get started with CyberSentinel-AI in less than a minute.
        </p>

        {/* Form */}
        <form className="register-form" onSubmit={handleSubmit(onSubmit)} noValidate>

          {/* Full name */}
          <div className="register-field">
            <label className="register-label">Full name</label>
            <input
              type="text"
              className={`register-input ${errors.name ? "register-input-error" : ""}`}
              placeholder="Your name"
              {...register("name")}
            />
            {errors.name && (
              <span className="register-field-error">{errors.name.message}</span>
            )}
          </div>

          {/* Email */}
          <div className="register-field">
            <label className="register-label">Email</label>
            <input
              type="email"
              className={`register-input ${errors.email ? "register-input-error" : ""}`}
              placeholder="you@example.com"
              {...register("email")}
            />
            {errors.email && (
              <span className="register-field-error">{errors.email.message}</span>
            )}
          </div>

          {/* Password */}
          <div className="register-field">
            <label className="register-label">Password</label>
            <input
              type="password"
              className={`register-input ${errors.password ? "register-input-error" : ""}`}
              placeholder="At least 6 characters"
              {...register("password")}
            />
            {errors.password && (
              <span className="register-field-error">{errors.password.message}</span>
            )}
          </div>

          {/* Confirm password */}
          <div className="register-field">
            <label className="register-label">Confirm password</label>
            <input
              type="password"
              className={`register-input ${errors.confirm ? "register-input-error" : ""}`}
              placeholder="Repeat password"
              {...register("confirm")}
            />
            {errors.confirm && (
              <span className="register-field-error">{errors.confirm.message}</span>
            )}
          </div>

          {/* Role picker */}
          <div className="register-field">
            <label className="register-label">Security role</label>
            <div className="register-roles">
              {ROLES.map((item) => (
                <button
                  key={item.value}
                  type="button"
                  className={`register-role ${role === item.value ? "register-role-active" : ""}`}
                  onClick={() => setRole(item.value)}
                >
                  <span className="register-role-icon">{item.icon}</span>
                  <span className="register-role-name">{item.title}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Server Error Message */}
          {serverError && (
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
              {serverError}
            </div>
          )}

          {/* Submit */}
          <button type="submit" className="register-submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

        {/* Footer */}
        <p className="register-footer">
          Already have an account?{" "}
          <Link to="/login" className="register-link">Sign in</Link>
        </p>

        <Link to="/" className="register-back">← Back to homepage</Link>

      </div>
    </div>
  );
}

export default Registration;
