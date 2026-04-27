import React, { useMemo, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { resetPassword } from "../services/authService";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function ResetPasswordPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");

  const [form, setForm] = useState({ password: "", confirmPassword: "" });
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });
  const [serverError, setServerError] = useState("");
  const [serverSuccess, setServerSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  // Validate password
  const passwordError = useMemo(() => {
    if (!touched.password) return null;
    if (!form.password) return "Password is required";
    if (form.password.length < 6) return "Password must be at least 6 characters";
    return null;
  }, [form.password, touched.password]);

  // Validate confirm password
  const confirmPasswordError = useMemo(() => {
    if (!touched.confirmPassword) return null;
    if (!form.confirmPassword) return "Please confirm your password";
    if (form.password !== form.confirmPassword) return "Passwords do not match";
    return null;
  }, [form.password, form.confirmPassword, touched.confirmPassword]);

  const canSubmit =
    !passwordError &&
    !confirmPasswordError &&
    form.password &&
    form.confirmPassword &&
    !loading &&
    !!token;

  function onChange(e) {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
  }

  function onBlur(e) {
    const { name } = e.target;
    setTouched((p) => ({ ...p, [name]: true }));
  }

  async function onSubmit(e) {
    e.preventDefault();
    setServerError("");
    setServerSuccess("");
    setTouched({ password: true, confirmPassword: true });

    if (passwordError || confirmPasswordError || !token) return;

    try {
      setLoading(true);
      await resetPassword({
        token: token,
        newPassword: form.password,
      });

      setServerSuccess("✓ Password reset successful! Redirecting to login...");
      setForm({ password: "", confirmPassword: "" });

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 400) {
        setServerError(msg || "Invalid or expired reset token. Please try again.");
      } else {
        setServerError("Something went wrong. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  // If no token, show error
  if (!token) {
    return (
      <AuthLayout title="Reset Password" activeTab="reset">
        <div className="auth-error">
          Invalid reset link. Please request a new password reset.
        </div>
        <div style={{ textAlign: "center", marginTop: "1.5rem" }}>
          <a
            href="/forgot-password"
            style={{
              color: "#d97706",
              textDecoration: "none",
              fontWeight: "500",
            }}
          >
            Request Password Reset
          </a>
        </div>
      </AuthLayout>
    );
  }

  return (
    <AuthLayout title="Reset Password" activeTab="reset">
      {serverSuccess ? (
        <div className="auth-success">{serverSuccess}</div>
      ) : (
        <>
          {serverError ? <div className="auth-error">{serverError}</div> : null}

          <form className="auth-form" onSubmit={onSubmit} noValidate>
            <input
              className="auth-input"
              placeholder="New Password"
              type="password"
              name="password"
              value={form.password}
              onChange={onChange}
              onBlur={onBlur}
              disabled={loading}
            />
            {touched.password && passwordError ? (
              <div className="auth-error">{passwordError}</div>
            ) : null}

            <input
              className="auth-input"
              placeholder="Confirm Password"
              type="password"
              name="confirmPassword"
              value={form.confirmPassword}
              onChange={onChange}
              onBlur={onBlur}
              disabled={loading}
            />
            {touched.confirmPassword && confirmPasswordError ? (
              <div className="auth-error">{confirmPasswordError}</div>
            ) : null}

            <button
              className="auth-btn"
              type="submit"
              disabled={!canSubmit}
            >
              {loading ? "Resetting..." : "Reset Password"}
            </button>

            <p style={{ textAlign: "center", marginTop: "1rem", fontSize: "0.95rem" }}>
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
