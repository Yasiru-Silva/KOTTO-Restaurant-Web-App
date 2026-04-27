import React, { useMemo, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { registerUser } from "../services/authService";
import { validateRegister } from "../services/validators";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { login } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [touched, setTouched] = useState({ name: false, email: false, password: false });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => validateRegister(form), [form]);
  const canSubmit = Object.keys(errors).length === 0 && !loading;

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

    // mark all touched to show errors
    setTouched({ name: true, email: true, password: true });

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      const data = await registerUser(form);

      // Store token (simple approach for now)
      localStorage.setItem("token", data.token);
      login(data);

      // Redirect after signup
      navigate("/");
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 409) setServerError(msg || "Email is already registered");
      else if (status === 400) setServerError(msg || "Validation failed");
      else setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Create Account" activeTab="signup">
      {serverError ? <div className="auth-error">{serverError}</div> : null}

      <form className="auth-form" onSubmit={onSubmit} noValidate>
        <input
          className="auth-input"
          placeholder="Full Name"
          name="name"
          value={form.name}
          onChange={onChange}
          onBlur={onBlur}
        />
        {touched.name && errors.name ? <div className="auth-error">{errors.name}</div> : null}

        <input
          className="auth-input"
          placeholder="Email Address"
          name="email"
          value={form.email}
          onChange={onChange}
          onBlur={onBlur}
        />
        {touched.email && errors.email ? <div className="auth-error">{errors.email}</div> : null}

        <input
          className="auth-input"
          placeholder="Create Password"
          type="password"
          name="password"
          value={form.password}
          onChange={onChange}
          onBlur={onBlur}
        />
        {touched.password && errors.password ? (
          <div className="auth-error">{errors.password}</div>
        ) : null}

        <button className="auth-btn" type="submit" disabled={!canSubmit}>
          {loading ? "Signing up..." : "Sign Up"}
        </button>
      </form>
    </AuthLayout>
  );
}