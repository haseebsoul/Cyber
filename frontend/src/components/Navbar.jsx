/**
 * Navbar.jsx
 * ---------------------------------------------------------
 * Floating pill navigation bar for CyberSentinel-AI.
 *
 * Two kinds of links:
 *   1. Section links (<a href="#...">) — scroll to sections on home page
 *   2. Route links (<Link to="/...">) — change URL via React Router
 *
 * The section links only appear on the home page.
 * On other pages (login, admin) they hide automatically.
 */

import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router";
import "./Navbar.css";

function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  // Which page are we on? Needed to show/hide section links
  const location = useLocation();
  const isHomePage = location.pathname === "/";

  // Shrink navbar when user scrolls down
  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 40);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close mobile menu when a link is clicked
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="navbar-wrap">
      <nav
        className={`navbar ${isScrolled ? "navbar-scrolled" : ""} ${
          isOpen ? "navbar-open" : ""
        }`}
      >
        {/* ---------- Brand ---------- */}
        <Link to="/" className="navbar-brand" onClick={closeMenu}>
          <span className="navbar-logo" aria-hidden="true">
            <svg viewBox="0 0 32 32" width="22" height="22" fill="none">
              <path
                d="M16 3 L27 7 V15 C27 22 22 27 16 29 C10 27 5 22 5 15 V7 L16 3 Z"
                fill="#0a0a0a"
              />
              <path
                d="M11 15.5 L14.5 19 L21 12"
                stroke="#ffffff"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
          <span className="navbar-brand-text">
            CyberSentinel<span className="navbar-tm">™</span>
          </span>
        </Link>

        {/* ---------- Hamburger (mobile) ---------- */}
        <button
          className="navbar-toggle"
          onClick={() => setIsOpen((v) => !v)}
          aria-label="Toggle navigation"
        >
          <span></span>
          <span></span>
        </button>

        {/* ---------- Section links (home page only) ---------- */}
        {isHomePage && (
          <div className="navbar-links">
            <a href="#home" onClick={closeMenu}>Home</a>
            <a href="#features" onClick={closeMenu}>Features</a>
            <a href="#how-it-works" onClick={closeMenu}>How it works</a>
            <a href="#showcase" onClick={closeMenu}>Showcase</a>
          </div>
        )}

        {/* ---------- Back link (other pages) ---------- */}
        {!isHomePage && (
          <div className="navbar-links">
            <Link to="/" onClick={closeMenu}>← Back to home</Link>
          </div>
        )}

        {/* ---------- Right-side actions ---------- */}
        <div className="navbar-actions">
          <Link to="/login" className="navbar-signin" onClick={closeMenu}>
            Sign in
          </Link>
          <Link
            to="/registration"
            className="btn btn-primary navbar-cta"
            onClick={closeMenu}
          >
            Start creating
          </Link>
        </div>

      </nav>
    </div>
  );
}

export default Navbar;