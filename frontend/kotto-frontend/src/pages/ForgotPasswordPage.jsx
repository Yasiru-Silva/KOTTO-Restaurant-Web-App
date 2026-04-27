import React, { useMemo, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { forgotPassword } from "../services/authService";
import { useNavigate } from "react-router-dom";
import { isValidEmail } from "../services/validators";

export default function ForgotPasswordPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [touched, setTouched] = useState(false);
  const [serverMessage, setServerMessage] = useState("");
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const emailError = useMemo(() => {
    if (!touched) return null;
    if (!email.trim()) return "Email is required";
    if (!isValidEmail(email.trim())) {
      return "Please enter a valid email";
    }
    return null;
  }, [email, touched]);

  const canSubmit = !emailError && email.trim() && !loading;

  function onChange(e) {
    setEmail(e.target.value);
  }

  function onBlur() {
    setTouched(true);
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError("");
    setServerMessage("");
    setTouched(true);

    if (emailError) return;

    try {
      setLoading(true);
      await forgotPassword({ email: email.trim().toLowerCase() });

      setServerMessage(
        "If an account exists with this email, you will receive a password reset link shortly."
      );
      setSubmitted(true);
      
      // Clear form
      setEmail("");
      
      // Redirect to login after 3 seconds
      setTimeout(() => {
        navigate("/login");
      }, 3000);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 400) setServerError(msg || "Validation failed");
      else setServerError("Something went wrong. Try again.");
      setSubmitted(false);
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Forgot Password?" activeTab="forgot">
      {submitted ? (
        <div className="auth-success">
          ✓ {serverMessage}
          <p style={{ fontSize: "0.9rem", marginTop: "0.5rem" }}>
            Redirecting to login...
          </p>
        </div>
      ) : (
        <>
          {serverError ? <div className="auth-error">{serverError}</div> : null}

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <p style={{ fontSize: "0.95rem", marginBottom: "1.5rem", color: "#666" }}>
              Enter your email address and we'll send you a link to reset your password.
            </p>

            <input
              className="auth-input"
              placeholder="Email Address"
              type="email"
              name="email"
              value={email}
              onChange={onChange}
              onBlur={onBlur}
              disabled={loading}
            />
            {touched && emailError ? (
              <div className="auth-error">{emailError}</div>
            ) : null}

            <button
              className="auth-btn"
              type="submit"
              disabled={!canSubmit}
            >
              {loading ? "Sending..." : "Send Reset Link"}
            </button>

            <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.95rem" }}>
              Remember your password?{" "}
              <a
                href="/login"
                style={{
                  color: "#d97706",
                  textDecoration: "none",
                  fontWeight: "500",
                }}
              >
                Back to Login
              </a>
            </p>
          </form>
        </>
      )}
    </AuthLayout>
  );
}
