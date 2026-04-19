import React, { useEffect, useState } from "react";
import { getAllOrders, updateOrderStatus } from "../../services/orderService";
import styles from "./AdminOrdersPage.module.css";

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const data = await getAllOrders();
        setOrders(data || []);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchOrders();
  }, []);

  const handleStatusChange = async (orderId, newStatus) => {
    const result = await updateOrderStatus(orderId, newStatus);
    if (result.success) {
      setOrders(prevOrders => prevOrders.map(order => 
        order.id === orderId ? { ...order, status: newStatus } : order
      ));
    } else {
      alert("Failed to update status.");
    }
  };


  if (loading) {
    return (
      <div className={styles.loadingContainer}>
        <h2>Loading orders...</h2>
      </div>
    );
  }

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.title}>All Customer Orders</h1>
      {orders.length === 0 ? (
        <p className={styles.emptyMessage}>No orders found.</p>
      ) : (
        <div className={styles.ordersList}>
          {orders.map((order) => (
            <div key={order.id} className={styles.orderCard}>
              <div className={styles.orderHeader}>
                <span className={styles.orderId}>Order #{order.id}</span>
                <select
                  className={`${styles.statusBadge} ${styles[order.status.toLowerCase()] || ""}`}
                  value={order.status}
                  onChange={(e) => handleStatusChange(order.id, e.target.value)}
                  disabled={order.status === "READY"}
                >
                  <option value="CONFIRMED">CONFIRMED</option>
                  <option value="PREPARING">PREPARING</option>
                  <option value="READY">READY</option>
                </select>
              </div>
              <div className={styles.orderDetails}>
                <p><strong>Customer:</strong> {order.userName}</p>
                <p><strong>Type:</strong> {order.orderType}</p>
                {order.orderType === "delivery" && (
                  <p><strong>Delivery Address:</strong> {order.deliveryAddress}</p>
                )}
                <p><strong>Total:</strong> ${order.total.toFixed(2)}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminOrdersPage;
