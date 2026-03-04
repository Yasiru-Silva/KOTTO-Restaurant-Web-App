import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import PageShell from "../components/PageShell";
import styles from "./LoginPage.module.css";

export default function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const returnTo = location.state?.returnTo || "/";
  const reservationDraft = location.state?.reservationDraft;

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [banner, setBanner] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const login = async (e) => {
    e.preventDefault();
    setBanner(null);
    setIsSubmitting(true);

    try {
      const res = await api.post("/api/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      navigate(returnTo, { state: { reservationDraft }, replace: true });
    } catch (err) {
      setBanner({ type: "error", text: err.response?.data?.message || "Login failed" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <PageShell>
      <main className={styles.page}>
        <div className={styles.card}>
          <h1 className={styles.h1}>Admin Login</h1>
          <p className={styles.lead}>Sign in to submit reservation requests.</p>

          {banner && <div className={styles.bannerError}>{banner.text}</div>}

          <form onSubmit={login} className={styles.form}>
            <label className={styles.label}>
              Email
              <input className={styles.input} value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" />
            </label>

            <label className={styles.label}>
              Password
              <input
                className={styles.input}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Password"
                type="password"
              />
            </label>

            <button className={styles.submit} type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Signing in..." : "Login"}
            </button>
          </form>
        </div>
      </main>
    </PageShell>
  );
}
