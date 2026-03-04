import { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { api } from "../api/api";
import PageShell from "../components/PageShell";
import styles from "./ReservationPage.module.css";

function pad(n) {
  return String(n).padStart(2, "0");
}

function buildTimeSlots({ startHour = 11, endHour = 23, stepMinutes = 30 }) {
  const slots = [];
  for (let h = startHour; h <= endHour; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      // 23:30 is beyond the requested "…23:00"
      if (h === endHour && m > 0) continue;
      slots.push(`${pad(h)}:${pad(m)}`);
    }
  }
  return slots;
}

function toMinutes(hhmm) {
  if (!hhmm) return null;
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

export default function ReservationPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const restored = location.state?.reservationDraft;

  const timeSlots = useMemo(() => buildTimeSlots({ startHour: 11, endHour: 23, stepMinutes: 30 }), []);

  const [form, setForm] = useState(
    restored || {
      name: "",
      phone: "",
      date: "",
      startTime: "",
      endTime: "",
      guests: "1",
      seatingType: "TABLE",
      note: "",
    }
  );

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // {type:'success'|'error', text:''}

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm((p) => ({ ...p, [name]: value }));
    setErrors((p) => ({ ...p, [name]: undefined }));
    setBanner(null);
  };

  const validate = () => {
    const next = {};

    // Name with initials: allow letters, spaces, dots. Require at least 3 chars.
    if (!form.name.trim()) next.name = "Name is required.";
    else if (!/^[A-Za-z .']{3,}$/.test(form.name.trim())) next.name = "Use letters/spaces (e.g., A B Perera).";

    // Sri Lankan format: 07XXXXXXXX (10 digits)
    if (!form.phone.trim()) next.phone = "Phone number is required.";
    else if (!/^07\d{8}$/.test(form.phone.trim())) next.phone = "Use Sri Lankan format: 07XXXXXXXX.";

    if (!form.date) next.date = "Date is required.";

    if (!form.startTime) next.startTime = "Select a start time.";
    if (!form.endTime) next.endTime = "Select an end time.";

    // start < end (at least 30 min)
    const sm = toMinutes(form.startTime);
    const em = toMinutes(form.endTime);
    if (sm != null && em != null) {
      if (em <= sm) next.endTime = "End time must be after start time.";
      if (em - sm < 30) next.endTime = "Reservation must be at least 30 minutes.";
    }

    const g = Number(form.guests);
    if (!form.guests) next.guests = "Select guests.";
    else if (Number.isNaN(g) || g < 1 || g > 20) next.guests = "Guests must be between 1 and 20.";

    if (!form.seatingType) next.seatingType = "Select seating.";

    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setBanner(null);

    if (!validate()) {
      setBanner({ type: "error", text: "Please fix the highlighted fields and try again." });
      return;
    }

    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login", {
        state: { returnTo: "/", reservationDraft: form },
        replace: true,
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await api.post("/api/reservations", {
        ...form,
        guests: Number(form.guests),
      });

      setBanner({ type: "success", text: res.data?.message || "Reservation request submitted successfully." });
      // Optional: clear form after success
      // setForm((p) => ({ ...p, note: "" }));
    } catch (err) {
      const msg = err.response?.data?.message || "Something went wrong.";
      setBanner({ type: "error", text: msg });

      if (err.response?.status === 401) {
        localStorage.removeItem("token");
        navigate("/login", { state: { returnTo: "/", reservationDraft: form }, replace: true });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const endTimeOptions = useMemo(() => {
    const sm = toMinutes(form.startTime);
    if (sm == null) return timeSlots;
    // End time must be after start time (>= +30)
    return timeSlots.filter((t) => {
      const tm = toMinutes(t);
      return tm != null && tm >= sm + 30;
    });
  }, [form.startTime, timeSlots]);

  return (
    <PageShell>
      <main className={styles.page}>
        <section className={styles.hero}>
          <h1 className={styles.h1}>Reserve Your Table</h1>
          <p className={styles.lead}>
            Experience an evening of exquisite cuisine in an atmosphere of refined elegance.
            Submit your reservation request and our team will confirm availability.
          </p>
        </section>

        <section className={styles.grid}>
          <div className={styles.card}>
            <div className={styles.cardHeader}>
              <h2 className={styles.h2}>Reservation Details</h2>
              <p className={styles.muted}>All fields are required unless marked optional.</p>
            </div>

            {banner && (
              <div className={banner.type === "success" ? styles.bannerSuccess : styles.bannerError} role="status">
                {banner.text}
              </div>
            )}

            <form onSubmit={handleSubmit} className={styles.form} noValidate>
              <div className={styles.field}>
                <label className={styles.label} htmlFor="name">Name with initials</label>
                <input
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={onChange}
                  placeholder="A B Perera"
                  className={errors.name ? `${styles.input} ${styles.inputError}` : styles.input}
                  autoComplete="name"
                />
                {errors.name && <div className={styles.error}>{errors.name}</div>}
              </div>

              <div className={styles.field}>
                <label className={styles.label} htmlFor="phone">Phone Number</label>
                <input
                  id="phone"
                  name="phone"
                  inputMode="numeric"
                  value={form.phone}
                  onChange={onChange}
                  placeholder="07XXXXXXXX"
                  className={errors.phone ? `${styles.input} ${styles.inputError}` : styles.input}
                  autoComplete="tel"
                />
                {errors.phone && <div className={styles.error}>{errors.phone}</div>}
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="date">Date</label>
                  <input
                    id="date"
                    type="date"
                    name="date"
                    value={form.date}
                    onChange={onChange}
                    className={errors.date ? `${styles.input} ${styles.inputError}` : styles.input}
                  />
                  {errors.date && <div className={styles.error}>{errors.date}</div>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="guests">Guests</label>
                  <select
                    id="guests"
                    name="guests"
                    value={form.guests}
                    onChange={onChange}
                    className={errors.guests ? `${styles.select} ${styles.inputError}` : styles.select}
                  >
                    {Array.from({ length: 20 }, (_, i) => i + 1).map((n) => (
                      <option key={n} value={String(n)}>{n}</option>
                    ))}
                  </select>
                  {errors.guests && <div className={styles.error}>{errors.guests}</div>}
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="startTime">Start Time</label>
                  <select
                    id="startTime"
                    name="startTime"
                    value={form.startTime}
                    onChange={onChange}
                    className={errors.startTime ? `${styles.select} ${styles.inputError}` : styles.select}
                  >
                    <option value="">Select</option>
                    {timeSlots.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.startTime && <div className={styles.error}>{errors.startTime}</div>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="endTime">End Time</label>
                  <select
                    id="endTime"
                    name="endTime"
                    value={form.endTime}
                    onChange={onChange}
                    className={errors.endTime ? `${styles.select} ${styles.inputError}` : styles.select}
                    disabled={!form.startTime}
                  >
                    <option value="">Select</option>
                    {endTimeOptions.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                  {errors.endTime && <div className={styles.error}>{errors.endTime}</div>}
                </div>
              </div>

              <div className={styles.row2}>
                <div className={styles.field}>
                  <label className={styles.label} htmlFor="seatingType">Seating</label>
                  <select
                    id="seatingType"
                    name="seatingType"
                    value={form.seatingType}
                    onChange={onChange}
                    className={errors.seatingType ? `${styles.select} ${styles.inputError}` : styles.select}
                  >
                    <option value="TABLE">Table</option>
                    <option value="LOUNGE">Lounge</option>
                  </select>
                  {errors.seatingType && <div className={styles.error}>{errors.seatingType}</div>}
                </div>

                <div className={styles.field}>
                  <label className={styles.label} htmlFor="note">Special Note <span className={styles.optional}>(optional)</span></label>
                  <input
                    id="note"
                    name="note"
                    value={form.note}
                    onChange={onChange}
                    placeholder="Allergies, celebration, seating preference..."
                    className={styles.input}
                  />
                </div>
              </div>

              <button className={styles.submit} type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Submitting..." : "Submit Reservation Request"}
              </button>

              <p className={styles.helper}>
                By submitting, you agree that our team may contact you to confirm availability.
              </p>
            </form>
          </div>

          <aside className={styles.gallery} aria-label="Restaurant gallery">
            <div className={styles.bigImg} aria-hidden="true">
              <div className={styles.imgOverlay}>
                <div className={styles.imgTitle}>Restaurant Photo</div>
                <div className={styles.imgSubtitle}>Image Space</div>
              </div>
            </div>

            <div className={styles.smallRow}>
              <div className={styles.smallImg} aria-hidden="true">
                <div className={styles.imgOverlaySmall}>
                  <div className={styles.imgSubtitle}>Food / Chef</div>
                </div>
              </div>
              <div className={styles.smallImg} aria-hidden="true">
                <div className={styles.imgOverlaySmall}>
                  <div className={styles.imgSubtitle}>Interior / Lounge</div>
                </div>
              </div>
            </div>
          </aside>
        </section>
      </main>
    </PageShell>
  );
}
