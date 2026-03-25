export const submitOrder = async (cartItems, orderDetails) => {
  return new Promise((resolve) => {
    // Simulate network delay to backend
    setTimeout(() => {
      resolve({
        success: true,
        orderId: `KOTTO-${Math.floor(100000 + Math.random() * 900000)}`,
        message: "Order placed successfully!"
      });
    }, 1500);
  });
};
