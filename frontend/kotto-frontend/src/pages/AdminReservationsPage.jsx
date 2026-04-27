import { useEffect, useState } from "react";
import api from "../services/api";
import PageShell from "../components/PageShell";
import styles from "./AdminReservationsPage.module.css";

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [actionLoadingId, setActionLoadingId] = useState(null);

  const loadReservations = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await api.get("/api/admin/reservations");
      setReservations(res.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load reservations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoadingId(id);
      await api.put(`/api/admin/reservations/${id}/approve`);
      await loadReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to approve reservation");
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoadingId(id);
      await api.put(`/api/admin/reservations/${id}/reject`);
      await loadReservations();
    } catch (err) {
      alert(err.response?.data?.message || "Failed to reject reservation");
    } finally {
      setActionLoadingId(null);
    }
  };

  return (
    <PageShell>
      <main className={styles.container}>
        <h1 className={styles.title}>Admin Reservation Management</h1>

        {loading && <p className={styles.loading}>Loading reservations...</p>}

        {!loading && error && (
          <p className={styles.error}>{error}</p>
        )}

        {!loading && !error && reservations.length === 0 && (
          <p>No reservations found.</p>
        )}

        {!loading && !error && reservations.length > 0 && (
          <div className={styles.tableWrapper}>
            <div className={styles.tableScroll}>
            <table
              className={styles.table}
            >
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Start</th>
                  <th>End</th>
                  <th>Guests</th>
                  <th>Seating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {reservations.map((r) => (
                  <tr key={r.id}>
                    <td>{r.id}</td>
                    <td>{r.name}</td>
                    <td>{r.phone}</td>
                    <td>{r.date}</td>
                    <td>{r.startTime}</td>
                    <td>{r.endTime}</td>
                    <td>{r.guests}</td>
                    <td>{r.seatingType}</td>
                    <td className={styles.status}>{r.status}</td>
                    <td>
                      <button
                        onClick={() => handleApprove(r.id)}
                        disabled={actionLoadingId === r.id || r.status !== "PENDING"}
                        className={`${styles.actionButton} ${styles.approve}`}
                      >
                        {actionLoadingId === r.id ? "Working..." : "Approve"}
                      </button>

                      <button
                        onClick={() => handleReject(r.id)}
                        disabled={actionLoadingId === r.id || r.status !== "PENDING"}
                        className={`${styles.actionButton} ${styles.reject}`}
                      >
                        {actionLoadingId === r.id ? "Working..." : "Reject"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            </div>
          </div>
        )}
      </main>
    </PageShell>
  );
}