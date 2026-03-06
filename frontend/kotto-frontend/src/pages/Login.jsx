import React, { useMemo, useState } from "react";
import AuthLayout from "../components/AuthLayout";
import { loginUser } from "../services/authService";
import { validateLogin } from "../services/validators";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({ email: "", password: "" });
  const [touched, setTouched] = useState({ email: false, password: false });
  const [serverError, setServerError] = useState("");
  const [loading, setLoading] = useState(false);

  const errors = useMemo(() => validateLogin(form), [form]);
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
    setTouched({ email: true, password: true });

    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      const data = await loginUser(form);

      localStorage.setItem("token", data.token);
      navigate("/");
    } catch (err) {
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 401) setServerError(msg || "Invalid email or password");
      else if (status === 400) setServerError(msg || "Validation failed");
      else setServerError("Something went wrong. Try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout title="Welcome Back" activeTab="login">
      {serverError ? <div className="auth-error">{serverError}</div> : null}

      <form className="auth-form" onSubmit={onSubmit} noValidate>
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
          placeholder="Password"
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
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </AuthLayout>
  );
}