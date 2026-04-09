import api from "./api";

export const submitOrder = async (cartItems, orderDetails) => {
  try {
    const payload = {
      orderType: orderDetails.orderType,
      deliveryAddress: orderDetails.deliveryAddress,
      total: orderDetails.total,
      items: cartItems.map(item => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity
      }))
    };
    const response = await api.post("/api/orders", payload);
    return {
      success: true,
      orderId: response.data.orderId,
      message: "Order placed successfully!"
    };
  } catch (error) {
    console.error("Error submitting order:", error);
    return { success: false, message: "Failed to place order." };
  }
};
