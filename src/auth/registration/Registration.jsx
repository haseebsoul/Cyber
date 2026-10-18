/**
 * Registration.jsx
 * ---------------------------------------------------------
 * Create account form.
 *
 * VALIDATION uses:
 *   - react-hook-form → form state
 *   - zod              → rules (name, email, password, confirm match)
 *   - @hookform/resolvers → connects them
 *
 * On success → saves session → navigates to /admin.
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
    message: "Passwords do not match",
    path: ["confirm"],   // show this error on the "confirm" field
  });

function Registration() {
  const [role, setRole] = useState("admin");
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

  const onSubmit = (data) => {
    saveSession({ email: data.email, name: data.name, role });
    navigate("/admin");
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

          {/* Submit */}
          <button type="submit" className="register-submit">
            Create account
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