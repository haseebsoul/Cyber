/** 
 * Login.jsx — Verifies credentials, includes role selection, and stores the JWT.
 */
import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSession } from "../../session/SessionManager";
import "./Login.css";

// 1. DEFINE THE ROLES FOR THE UI
// These match the 3 stakeholders in the project.
const ROLES = [
  { value: "admin",      icon: "bi-shield-lock-fill", title: "Administrator" },
  { value: "analyst",    icon: "bi-radar",            title: "SOC Analyst" },
  { value: "researcher", icon: "bi-flask",            title: "Security Researcher" },
];

// 2. ZOD VALIDATION SCHEMA
// Ensures the user enters a valid email and a password of at least 6 characters.
const loginSchema = z.object({
  email: z.string().min(1, "Email is required").email("Enter a valid email address"),
  password: z.string().min(1, "Password is required").min(6, "Password must be at least 6 characters"),
});

function Login() {
  // 3. REACT STATE
  const [role, setRole] = useState("admin"); // Tracks the selected role card
  const [showPassword, setShowPassword] = useState(false); // Toggles password visibility
  const [serverError, setServerError] = useState(""); // Displays backend errors
  const [loading, setLoading] = useState(false); // Disables button while loading
  const navigate = useNavigate();
  
  // 4. REACT HOOK FORM SETUP
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(loginSchema),
    defaultValues: { email: "", password: "" },
  });

  // 5. SUBMIT HANDLER (Runs when "Sign in" is clicked)
  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);
    
    try {
      // Send email, password, and selected role to Express backend
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
          email: data.email, 
          password: data.password,
          selectedRole: role 
        }),
      });
      
      const result = await response.json();
      
      // Handle invalid credentials (401 or 400 status)
      if (!response.ok) {
        setServerError(result.message || "Invalid email or password.");
        return;
      }
      
      // Ensure backend actually returned a token
      if (!result.token) {
        setServerError("The backend did not return a login token.");
        return;
      }

      // Save JWT to localStorage for API requests
      localStorage.setItem("token", result.token); 
      
      // Save user profile (name, role) for the UI
      saveSession(result.user); 
      
      // Redirect to the dashboard
      navigate("/admin");
      
    } catch (error) {
      // Handle network errors (e.g. backend is turned off)
      setServerError("Unable to connect to server. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      
      {/* ================= LEFT SIDE: VISUAL PANEL ================= */}
      <div className="login-visual" style={{
        backgroundImage: "url('/login-visual-v3.jpg')", // Make sure this image exists in your public folder
        backgroundSize: "cover", 
        backgroundPosition: "center", 
        backgroundRepeat: "no-repeat",
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
              <div className="login-visual-stat">
                <div className="login-visual-stat-value">JWT</div>
                <div className="login-visual-stat-label">Signed access token</div>
              </div>
              <div className="login-visual-stat">
                <div className="login-visual-stat-value">RBAC</div>
                <div className="login-visual-stat-label">Role-based access</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================= RIGHT SIDE: FORM PANEL ================= */}
      <div className="login-form-side">
        <div className="login-form-wrap">
          <h1 className="login-title">Welcome back</h1>
          <p className="login-subtitle">
            Choose your role and sign in to your workspace.
          </p>

          <form className="login-form" onSubmit={handleSubmit(onSubmit)} noValidate>
            
            {/* 6. ROLE PICKER BUTTONS */}
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
                    <i className={`bi ${item.icon} login-role-icon`}></i>
                    <span className="login-role-name">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* 7. EMAIL INPUT */}
            <div className="login-field">
              <label className="login-label" htmlFor="login-email">Email</label>
              <input 
                id="login-email" 
                type="email" 
                className={`login-input ${errors.email ? "login-input-error" : ""}`} 
                placeholder="you@example.com" 
                {...register("email")} 
              />
              {errors.email && <span className="login-field-error">{errors.email.message}</span>}
            </div>

            {/* 8. PASSWORD INPUT */}
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
                  onClick={() => setShowPassword((value) => !value)}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
              {errors.password && <span className="login-field-error">{errors.password.message}</span>}
            </div>

            {/* 9. SERVER ERROR MESSAGE */}
            {serverError && <div className="login-error" role="alert">{serverError}</div>}
            
            {/* 10. SUBMIT BUTTON */}
            <button type="submit" className="login-submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign in"}
            </button>
          </form>

          {/* 11. FOOTER LINKS */}
          <p className="login-footer">
            Don't have an account? <Link to="/registration" className="login-link">Create one</Link>
          </p>
          
          <Link to="/" className="login-back">&larr; Back to homepage</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;