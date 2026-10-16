/**
 * Registration.jsx
 * ---------------------------------------------------------
 * Create account form.
 * On submit → saves session → navigates to /admin.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { saveSession } from "../../session/SessionManager";
import "./Registration.css";

const ROLES = [
  { value: "admin",      icon: "🛡️", title: "Administrator" },
  { value: "analyst",    icon: "📡", title: "SOC Analyst" },
  { value: "researcher", icon: "🧪", title: "Researcher" },
];

function Registration() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [role, setRole] = useState("admin");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    if (!name.trim()) return setError("Please enter your full name.");
    if (!email.trim()) return setError("Please enter your email.");
    if (password.length < 6) return setError("Password must be at least 6 characters.");
    if (password !== confirm) return setError("Passwords do not match.");

    saveSession({ email: email.trim(), name: name.trim(), role });
    navigate("/admin");
  };

  return (
    <div className="register-page">
      <div className="register-card">

        <Link to="/" className="register-brand">
          <span className="register-brand-icon">🛡️</span>
          <span className="register-brand-name">CyberSentinel-AI</span>
        </Link>

        <h1 className="register-title">Create your account</h1>
        <p className="register-subtitle">
          Get started with CyberSentinel-AI in less than a minute.
        </p>

        <form className="register-form" onSubmit={handleSubmit}>

          <div className="register-field">
            <label className="register-label">Full name</label>
            <input
              type="text"
              className="register-input"
              placeholder="Your name"
              value={name}
              onChange={(event) => setName(event.target.value)}
            />
          </div>

          <div className="register-field">
            <label className="register-label">Email</label>
            <input
              type="email"
              className="register-input"
              placeholder="you@example.com"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
            />
          </div>

          <div className="register-field">
            <label className="register-label">Password</label>
            <input
              type="password"
              className="register-input"
              placeholder="At least 6 characters"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
            />
          </div>

          <div className="register-field">
            <label className="register-label">Confirm password</label>
            <input
              type="password"
              className="register-input"
              placeholder="Repeat password"
              value={confirm}
              onChange={(event) => setConfirm(event.target.value)}
            />
          </div>

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

          {error && <div className="register-error">{error}</div>}

          <button type="submit" className="register-submit">Create account</button>
        </form>

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