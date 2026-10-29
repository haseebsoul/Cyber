/** Login.jsx — verifies credentials and stores the JWT returned by Express. */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSession } from "../../session/SessionManager";
import "./Login.css";

const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: data.email, password: data.password }),
      });
      const result = await response.json();
      if (!response.ok) {
        setServerError(result.message || "Invalid email or password.");
        return;
      }
      if (!result.token) {
        setServerError("The backend did not return a login token.");
        return;
      }

      localStorage.setItem("token", result.token); // Store the signed JWT for protected API calls.
      saveSession(result.user); // Store the safe profile so the UI can show the user's real role.
      navigate("/admin");
    } catch (error) {
      setServerError("Unable to connect to server. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-visual" style={{
        backgroundImage: "url('/login-visual-v3.jpg')",
        backgroundSize: "cover", backgroundPosition: "center", backgroundRepeat: "no-repeat",
      }}>
        <div className="login-visual-inner">
          <Link to="/" className="login-visual-brand">
            <span className="login-visual-brand-icon">🛡️</span>
            <span className="login-visual-brand-name">CyberSentinel<span className="login-visual-tm">™</span></span>
          </Link>
          <div className="login-visual-copy">
            <h2 className="login-visual-title">Security that<br /><span className="login-visual-title-muted">watches everything.</span></h2>
            <p className="login-visual-text">Sign in to inspect requests, monitor threats, and analyze security activity.</p>
            <div className="login-visual-stats">
              <div className="login-visual-stat"><div className="login-visual-stat-value">JWT</div><div className="login-visual-stat-label">Signed access token</div></div>
              <div className="login-visual-stat"><div className="login-visual-stat-value">RBAC</div><div className="login-visual-stat-label">Role-based access</div></div>
            </div>
          </div>
        </div>
      </div>

      <div className="login-form-side">
        <div className="login-form-wrap">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">Sign in to your assigned workspace. Your saved account role determines permissions.</p>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">Email</label>
              <input id="login-email" type="email" className={`login-input ${errors.email ? "login-input-error" : ""}`} placeholder="you@example.com" {...register("email")} />
              {errors.email && <span className="login-field-error">{errors.email.message}</span>}
            </div>

            <div className="login-field">
              <label className="login-label" htmlFor="login-password">Password</label>
              <div className="login-password-wrap">
                <input id="login-password" type={showPassword ? "text" : "password"} className={`login-input ${errors.password ? "login-input-error" : ""}`} placeholder="••••••••" {...register("password")} />
                <button type="button" className="login-password-toggle" onClick={() => setShowPassword((value) => !value)}>{showPassword ? "Hide" : "Show"}</button>
              </div>
              {errors.password && <span className="login-field-error">{errors.password.message}</span>}
            </div>

            {serverError && <div className="login-error" role="alert">{serverError}</div>}
            <button type="submit" className="login-submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
          </form>

          <p className="login-footer">Don't have an account? <Link to="/registration" className="login-link">Create one</Link></p>
          <Link to="/" className="login-back">← Back to homepage</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
