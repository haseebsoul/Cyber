/**
 * Login.jsx
 * ---------------------------------------------------------
 * Split-screen login page for CyberSentinel-AI.
 *
 * LEFT:  Image background with dark overlay + brand + tagline
 * RIGHT: Form with 3-role picker + email + password
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { saveSession } from "../../session/SessionManager";
import "./Login.css";

const ROLES = [
  { value: "admin",      icon: "🛡️", title: "Administrator",       description: "Manage users, rules, and platform settings." },
  { value: "analyst",    icon: "📡", title: "SOC Analyst",         description: "Monitor threats and respond to incidents." },
  { value: "researcher", icon: "🧪", title: "Security Researcher", description: "Test detection rules and analyze anomalies." },
];

function Login() {
  const [role, setRole] = useState("admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    setError("");

    const cleanEmail = email.trim();
    if (!cleanEmail || !password) {
      setError("Please enter your email and password.");
      return;
    }

    saveSession({ email: cleanEmail, role });
    navigate("/admin");
  };

  return (
    <div className="login-page">

      {/* ============ LEFT: Image + content overlay ============ */}
      {/* ============ LEFT: Image + content overlay ============ */}
      {/* ============ LEFT: Image + content overlay ============ */}
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

          {/* Brand at top */}
          <Link to="/" className="login-visual-brand">
            <span className="login-visual-brand-icon">🛡️</span>
            <span className="login-visual-brand-name">
              CyberSentinel<span className="login-visual-tm">™</span>
            </span>
          </Link>

          {/* Content at bottom (in dark area) */}
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

      {/* ============ RIGHT: Form ============ */}
      <div className="login-form-side">
        <div className="login-form-wrap">

          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">
            Choose your role and sign in to your workspace.
          </p>

          <form className="login-form" onSubmit={handleSubmit}>

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

            <div className="login-field">
              <label className="login-label" htmlFor="login-email">Email</label>
              <input
                id="login-email"
                type="email"
                className="login-input"
                placeholder="you@example.com"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
              />
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="login-password">Password</label>
              <div className="login-password-wrap">
                <input
                  id="login-password"
                  type={showPassword ? "text" : "password"}
                  className="login-input"
                  placeholder="••••••••"
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword((v) => !v)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            {error && <div className="login-error">{error}</div>}

            <button type="submit" className="login-submit">Sign in</button>
          </form>

          <div className="login-demo">
            <div className="login-demo-label">Demo login</div>
            <div className="login-demo-row">
              <span>admin@cybersentinel.ai</span>
              <span>admin123</span>
            </div>
          </div>

          <p className="login-footer">
            Don't have an account?{" "}
            <Link to="/registration" className="login-link">Create one</Link>
          </p>

          <Link to="/" className="login-back">← Back to homepage</Link>

        </div>
      </div>

    </div>
  );
}

export default Login;