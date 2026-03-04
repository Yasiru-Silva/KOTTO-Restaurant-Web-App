import { useCart } from "../context/CartContext";

export default function CartDrawer() {
  const {
    isOpen,
    closeCart,
    cartItems,
    updateQuantity,
    removeItem,
    subtotal,
  } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Overlay */}
      <div className="overlay" onClick={closeCart} />

      {/* Drawer */}
      <aside className={`drawer open`}>
        <header
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "16px",
          }}
        >
          <div>
            <h3 style={{ margin: 0 }}>Your Order</h3>
            <p
              style={{
                margin: 0,
                fontSize: "0.85rem",
                color: "#a0aec0",
              }}
            >
              Review and adjust your cart
            </p>
          </div>
          <button
            onClick={closeCart}
            style={{
              background: "transparent",
              borderRadius: "999px",
              padding: "6px 10px",
              border: "1px solid rgba(255,255,255,0.1)",
            }}
          >
            ✕
          </button>
        </header>

        <section
          style={{
            flex: 1,
            overflowY: "auto",
            paddingRight: "4px",
          }}
        >
          {cartItems.length === 0 ? (
            <div
              style={{
                padding: "24px 12px",
                textAlign: "center",
                borderRadius: "12px",
                background:
                  "linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.02))",
                border: "1px dashed rgba(255,255,255,0.1)",
              }}
            >
              <p style={{ marginBottom: "8px" }}>Your cart is empty.</p>
              <p style={{ fontSize: "0.85rem", color: "#a0aec0", margin: 0 }}>
                Add some delicious kotto wraps to get started.
              </p>
            </div>
          ) : (
            cartItems.map((item) => (
              <div
                key={item.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: "10px",
                  marginBottom: "14px",
                  padding: "12px",
                  borderRadius: "12px",
                  background:
                    "linear-gradient(135deg, rgba(24,32,56,0.95), rgba(16,24,40,0.98))",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.35)",
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontWeight: 600,
                      marginBottom: 4,
                      fontSize: "0.95rem",
                    }}
                  >
                    {item.name}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#a0aec0",
                      marginBottom: 6,
                    }}
                  >
                    LKR {item.price.toLocaleString()} × {item.quantity}
                  </div>
                  <div
                    style={{
                      fontSize: "0.8rem",
                      color: "#f6ad55",
                      fontWeight: 500,
                    }}
                  >
                    LKR {(item.price * item.quantity).toLocaleString()}
                  </div>
                </div>

                <div
                  style={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "flex-end",
                    gap: "6px",
                  }}
                >
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "rgba(15,23,42,0.9)",
                      borderRadius: "999px",
                      padding: "4px 8px",
                    }}
                  >
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      style={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        background: "rgba(15,23,42,0.9)",
                        border: "1px solid rgba(148,163,184,0.6)",
                      }}
                    >
                      -
                    </button>
                    <span style={{ minWidth: 18, textAlign: "center", fontSize: "0.85rem" }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      style={{
                        width: 24,
                        height: 24,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        padding: 0,
                        background:
                          "linear-gradient(135deg, #ff7a1a, #ffb347)",
                      }}
                    >
                      +
                    </button>
                  </div>

                  <button
                    onClick={() => removeItem(item.id)}
                    style={{
                      fontSize: "0.75rem",
                      padding: "4px 8px",
                      background: "transparent",
                      border: "1px solid rgba(248,113,113,0.7)",
                      color: "#fecaca",
                      borderRadius: "999px",
                    }}
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </section>

        <footer
          style={{
            borderTop: "1px solid rgba(148,163,184,0.2)",
            paddingTop: "14px",
            marginTop: "8px",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: "8px",
            }}
          >
            <span
              style={{
                fontSize: "0.9rem",
                color: "#e2e8f0",
              }}
            >
              Subtotal
            </span>
            <span
              style={{
                fontWeight: 600,
                fontSize: "1rem",
              }}
            >
              LKR {subtotal.toLocaleString()}
            </span>
          </div>
          <p
            style={{
              margin: 0,
              marginBottom: "10px",
              fontSize: "0.75rem",
              color: "#94a3b8",
            }}
          >
            Taxes and delivery fees calculated at checkout.
          </p>
          <button
            style={{
              width: "100%",
              padding: "10px 0",
              borderRadius: "999px",
              background:
                "linear-gradient(135deg, #ff7a1a, #ffb347)",
              border: "none",
              color: "#111827",
              fontWeight: 600,
              fontSize: "0.95rem",
              boxShadow: "0 10px 25px rgba(248,148,60,0.45)",
            }}
          >
            Proceed to Checkout
          </button>
        </footer>
      </aside>
    </>
  );
}