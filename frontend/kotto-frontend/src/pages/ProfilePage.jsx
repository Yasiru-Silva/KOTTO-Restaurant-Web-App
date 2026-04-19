import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { getUserReservations, getUserOrders, cancelReservation, cancelOrder } from "../services/profileService";
import styles from "./ProfilePage.module.css";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [reservations, setReservations] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If no user is logged in, redirect to login
    if (!user) {
      navigate("/login");
      return;
    }

    const fetchData = async () => {
      setLoading(true);
      try {
        const [resData, ordData] = await Promise.all([
          getUserReservations(),
          getUserOrders(),
        ]);
        setReservations(resData);
        setOrders(ordData);
      } catch (error) {
        console.error("Error loading profile data", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [user, navigate]);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleCancelReservation = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this reservation?")) return;
    
    const res = await cancelReservation(id);
    if (res.success) {
      setReservations(prev => 
        prev.map(r => r.id === id ? { ...r, status: "CANCELLED" } : r)
      );
      alert("Reservation cancelled successfully.");
    } else {
      alert(res.message || "Failed to cancel reservation");
    }
  };

  const handleCancelOrder = async (id) => {
    if (!window.confirm("Are you sure you want to cancel this order?")) return;
    
    const res = await cancelOrder(id);
    if (res.success) {
      setOrders(prev => 
        prev.map(o => o.id === id ? { ...o, status: "CANCELLED" } : o)
      );
      alert("Order cancelled successfully.");
    } else {
      alert(res.message || "Failed to cancel order");
    }
  };

  const getStatusBadgeClass = (status) => {
    switch (status?.toUpperCase()) {
      case "PENDING":
        return styles.badgePending;
      case "APPROVED":
        return styles.badgeApproved;
      case "REJECTED":
        return styles.badgeRejected;
      case "CANCELLED":
        return styles.badgeCancelled || styles.badgeRejected;
      case "CONFIRMED":
        return styles.badgeConfirmed;
      case "COMPLETED":
        return styles.badgeCompleted;
      default:
        return styles.badgePending;
    }
  };

  const canCancel = (date, startTime) => {
    if (!date || !startTime) return false;
    const resDateTime = new Date(`${date}T${startTime}`);
    const now = new Date();
    const diffHours = (resDateTime - now) / (1000 * 60 * 60);
    return diffHours >= 5;
  };

  if (!user) return null; // Prevent flicker before redirect

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>My Profile</h1>
        <p className={styles.subtitle}>Manage your account and view your history</p>
      </header>

      <div className={styles.layout}>
        {/* TOP ROW - USER INFO HORIZONTAL BAR */}
        <div className={`${styles.card} ${styles.userHorizontalBar}`}>
          <div className={styles.userInfoLeft}>
            <div className={styles.avatarSmall}>
              {user.name ? user.name.charAt(0).toUpperCase() : "U"}
            </div>
            <div className={styles.userDetails}>
              <h2 className={styles.userName}>{user.name || "User"}</h2>
              <p className={styles.userEmail}>{user.email}</p>
            </div>
          </div>
          <button className={styles.logoutBtnRow} onClick={handleLogout}>
            Logout
          </button>
        </div>

        {/* BELOW - HISTORY (VERTICAL) */}
        <div className={styles.historyContainer}>
          {loading ? (
            <div className={styles.loader}>Loading your data...</div>
          ) : (
            <>
              {/* RESERVATIONS CARD */}
              <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Reservation History</h3>
                {reservations.length > 0 ? (
                  <div className={styles.list}>
                    {reservations.map((res) => (
                      <div key={res.id} className={styles.listItem}>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemTitle}>
                            {res.date} at {res.startTime}
                          </span>
                          <span className={styles.itemMeta}>
                            {res.guests} Guests • {res.seatingType?.replace("_", " ")}
                          </span>
                        </div>
                        <div className={styles.itemActions}>
                          <span
                            className={`${styles.badge} ${getStatusBadgeClass(
                              res.status
                            )}`}
                          >
                            {res.status}
                          </span>
                          {res.status !== "CANCELLED" && res.status !== "COMPLETED" && res.status !== "REJECTED" && canCancel(res.date, res.startTime) && (
                            <button 
                              className={styles.cancelBtn}
                              onClick={() => handleCancelReservation(res.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    You have no reservations yet.
                  </div>
                )}
              </div>

              {/* ORDERS CARD */}
              <div className={styles.card}>
                <h3 className={styles.sectionTitle}>Order History</h3>
                {orders.length > 0 ? (
                  <div className={styles.list}>
                    {orders.map((order) => (
                      <div key={order.id} className={styles.listItem}>
                        <div className={styles.itemInfo}>
                          <span className={styles.itemTitle}>Order #{order.id}</span>
                          <span className={styles.itemMeta}>Total: ${order.total}</span>
                        </div>
                        <div className={styles.itemActions}>
                          <span
                            className={`${styles.badge} ${getStatusBadgeClass(
                              order.status
                            )}`}
                          >
                            {order.status}
                          </span>
                          {order.status === "CONFIRMED" && (
                            <button 
                              className={styles.cancelBtn}
                              onClick={() => handleCancelOrder(order.id)}
                            >
                              Cancel
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className={styles.emptyState}>
                    You have no order history to display at the moment.
                  </div>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;
