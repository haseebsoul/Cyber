/**
 * Registration.jsx (Split-Screen Version)
 * ---------------------------------------------------------
 * Uses React Hook Form & Zod for validation.
 * Sends registration data to the Express backend.
 */

import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { saveSession } from "../../session/SessionManager";
import "./Registration.css";

// Using Bootstrap Icons to match your Login Page exactly
const ROLES = [
  { value: "admin",      icon: "bi-shield-lock-fill", title: "Administrator" },
  { value: "analyst",    icon: "bi-radar",            title: "SOC Analyst" },
  { value: "researcher", icon: "bi-flask",            title: "Security Researcher" },
];

// ---------- ZOD SCHEMA ----------
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
    path: ["confirm"], 
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
    defaultValues: { name: "", email: "", password: "", confirm: "" },
  });

  // ---------- SUBMIT HANDLER ----------
  const onSubmit = async (data) => {
    setServerError("");
    setLoading(true);

    try {
      const res = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
          role: role,
        }),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.message || "Registration failed. Please try again.");
        return;
      }

      saveSession(result.user);
      navigate("/admin");

            // We DO NOT save the session here anymore. 
      // We send them to the login page so they can manually sign in.
      // alert("Account created successfully! Please sign in.");
      // navigate("/login");
    } catch (err) {
      setServerError("Unable to connect to server. Please verify the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="register-page">
      
      {/* 1. LEFT SIDE: Background Image */}
      <div className="register-visual"></div>

      {/* 2. RIGHT SIDE: Form Container */}
      <div className="register-card">
        
        {/* This wrapper keeps the form from stretching too wide */}
        <div className="register-content">
          
          {/* Brand */}
          <Link to="/" className="register-brand">
            <i className="bi bi-shield-lock-fill register-brand-icon"></i>
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
                    <i className={`bi ${item.icon} register-role-icon`}></i>
                    <span className="register-role-name">{item.title}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Server Error Message */}
            {serverError && (
              <div className="register-server-error">
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
    </div>
  );
}

export default Registration;