import React from "react";
import ChiliIcon from "./ChiliIcon";
import { Link, useLocation } from "react-router-dom";
import "./auth.css";

export default function AuthLayout({
  title,
  subtitle,
  activeTab, // "login" | "signup"
  children,
}) {
  const location = useLocation();

  // If route changes but tab prop isn't passed correctly, fallback:
  const inferredTab = location.pathname.includes("signup") ? "signup" : "login";
  const tab = activeTab || inferredTab;

  return (
    <div className="auth-shell">
      <div className="auth-card">
        {/* Left panel */}
        <div className="auth-left">
          <div className="auth-left-inner">
            <h1 className="auth-left-title">Taste the Passion.</h1>
            <p className="auth-left-subtitle">
              Experience flavors that ignite your senses. Fresh ingredients, bold
              recipes, unforgettable dining.
            </p>
          </div>
        </div>

        {/* Right panel */}
        <div className="auth-right">
          <div className="auth-brand">
            <ChiliIcon size={30} />
            <span className="auth-brand-text">Savory Bites</span>
          </div>

          <div className="auth-tabs">
            <Link
              to="/signin"
              className={`auth-tab ${tab === "login" ? "active" : ""}`}
            >
              Login
            </Link>
            <Link
              to="/signup"
              className={`auth-tab ${tab === "signup" ? "active" : ""}`}
            >
              Sign Up
            </Link>
          </div>

          <div className="auth-divider" />

          <h2 className="auth-title">{title}</h2>
          {subtitle ? <p className="auth-subtitle">{subtitle}</p> : null}

          {children}
        </div>
      </div>
    </div>
  );
}