import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import styles from "./CheckoutPage.module.css";
import OrderConfirmationModal from "../components/OrderConfirmationModal";
import { submitOrder } from "../services/orderService";

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, subtotal, clearCart, updateQuantity, removeItem } = useCart();
  const [orderType, setOrderType] = useState("delivery"); // 'delivery' or 'pickup'
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderConfirm, setOrderConfirm] = useState({ isOpen: false, orderId: null });
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [addressError, setAddressError] = useState(false);

  const deliveryFee = orderType === "delivery" ? 300 : 0;
  const total = subtotal + deliveryFee;

  const handlePlaceOrder = async () => {
    if (orderType === "delivery" && deliveryAddress.trim() === "") {
      setAddressError(true);
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await submitOrder(cartItems, { orderType, deliveryAddress, total });
      if (result.success) {
        setOrderConfirm({ isOpen: true, orderId: result.orderId });
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleOrderTypeChange = (type) => {
    setOrderType(type);
  };

  // Quick navigation back if cart is empty
  if (cartItems.length === 0) {
    return (
      <div className={styles.emptyContainer}>
        <div className={styles.emptyCard}>
          <h2>Your cart is empty</h2>
          <p>Looks like you haven't added anything to your cart yet.</p>
          <button className={styles.backButton} onClick={() => navigate("/")}>
            Back to Menu
          </button>
        </div>
      </div>
    );
  }



  return (
    <div className={styles.checkoutContainer}>
      <div className={styles.checkoutWrapper}>
        
        {/* Left Side: Cart Summary */}
        <div className={styles.cartSummary}>
          <h1 className={styles.pageTitle}>Checkout</h1>
          <p className={styles.pageSubtitle}>Review your delicious selections.</p>
          
          <div className={styles.itemsList}>
            {cartItems.map((item) => (
              <div key={item.id} className={styles.cartItem}>
                <div className={styles.itemInfo}>
                  <div className={styles.itemName}>{item.name}</div>
                  <div className={styles.itemDetails}>
                    LKR {item.price.toLocaleString()} × {item.quantity}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginTop: '8px' }}>
                    <button 
                      onClick={() => updateQuantity(item.id, -1)}
                      style={{ background: 'var(--surface-color-light)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >−</button>
                    <span style={{ fontSize: '0.9rem', width: '20px', textAlign: 'center' }}>{item.quantity}</span>
                    <button 
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{ background: 'var(--surface-color-light)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '50%', width: '24px', height: '24px', cursor: 'pointer', color: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}
                    >+</button>
                    <button 
                      onClick={() => removeItem(item.id)}
                      style={{ background: 'transparent', border: '1px solid rgba(248,113,113,0.7)', color: '#fecaca', borderRadius: '999px', padding: '2px 8px', cursor: 'pointer', fontSize: '0.75rem', marginLeft: 'auto' }}
                    >Remove</button>
                  </div>
                </div>
                <div className={styles.itemTotal}>
                  LKR {(item.price * item.quantity).toLocaleString()}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Side: Order Options and Cost Summary */}
        <div className={styles.orderPanel}>
          
          <div className={styles.panelSection}>
            <h2 className={styles.sectionTitle}>Order Type</h2>
            <div className={styles.orderTypeToggle}>
              <button
                className={`${styles.toggleButton} ${orderType === "delivery" ? styles.active : ""}`}
                onClick={() => handleOrderTypeChange("delivery")}
              >
                Delivery
              </button>
              <button
                className={`${styles.toggleButton} ${orderType === "pickup" ? styles.active : ""}`}
                onClick={() => handleOrderTypeChange("pickup")}
              >
                Pickup
              </button>
            </div>
            {orderType === "delivery" && (
              <div className={styles.addressWrapper}>
                <label className={styles.addressLabel}>Delivery Address *</label>
                <textarea 
                  className={`${styles.addressInput} ${addressError ? styles.inputError : ""}`}
                  placeholder="Enter your full delivery address..."
                  value={deliveryAddress}
                  onChange={(e) => { 
                    setDeliveryAddress(e.target.value); 
                    if (addressError) setAddressError(false); 
                  }}
                  rows={3}
                />
                {addressError && <span className={styles.errorMessage}>Please provide a delivery address.</span>}
                <p className={styles.deliveryNote}>
                  Delivery typically takes 30-45 minutes.
                </p>
              </div>
            )}
            {orderType === "pickup" && (
              <p className={styles.deliveryNote}>
                Pickup your order at our main branch in 15-20 minutes.
              </p>
            )}
          </div>

          <div className={styles.panelSection}>
            <h2 className={styles.sectionTitle}>Order Summary</h2>
            <div className={styles.summaryRow}>
              <span>Subtotal</span>
              <span>LKR {subtotal.toLocaleString()}</span>
            </div>
            {orderType === "delivery" && (
              <div className={styles.summaryRow}>
                <span>Delivery Fee</span>
                <span>LKR {deliveryFee.toLocaleString()}</span>
              </div>
            )}
            <div className={`${styles.summaryRow} ${styles.totalRow}`}>
              <span>Total</span>
              <span>LKR {total.toLocaleString()}</span>
            </div>
          </div>

          {/* Process order with mock backend call */}
          <button 
            className={styles.placeOrderButton} 
            onClick={handlePlaceOrder}
            disabled={isSubmitting}
            style={{ opacity: isSubmitting ? 0.7 : 1 }}
          >
            {isSubmitting ? "Processing..." : "Place Order"}
          </button>
          
          <button className={styles.continueShoppingButton} onClick={() => navigate("/")}>
            Continue Shopping
          </button>
        </div>
      </div>
      <OrderConfirmationModal 
        isOpen={orderConfirm.isOpen} 
        orderId={orderConfirm.orderId}
        onClose={() => clearCart()} 
      />
    </div>
  );
}
