import React from "react";
import styles from "./OrderConfirmationModal.module.css";
import { useNavigate } from "react-router-dom";

export default function OrderConfirmationModal({ isOpen, onClose, orderId }) {
  const navigate = useNavigate();

  if (!isOpen) return null;

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.iconContainer}>
          <svg
            className={styles.successIcon}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className={styles.title}>Order Confirmed!</h2>
        <p className={styles.message}>
          Thank you for choosing KOTTO. Your delicious meal has been received and is being prepared with care.
        </p>
        <div className={styles.orderIdBox}>
          <span className={styles.orderIdLabel}>Order ID</span>
          <span className={styles.orderIdValue}>{orderId}</span>
        </div>
        <button
          className={styles.returnButton}
          onClick={() => {
            onClose();
            navigate("/");
          }}
        >
          Return to Menu
        </button>
      </div>
    </div>
  );
}
