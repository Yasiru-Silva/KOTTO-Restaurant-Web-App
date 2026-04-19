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

export const getAllOrders = async () => {
  try {
    const response = await api.get("/api/orders/all");
    return response.data;
  } catch (error) {
    console.error("Error fetching all orders:", error);
    return [];
  }
};

export const updateOrderStatus = async (orderId, status) => {
  try {
    const response = await api.put(`/api/orders/${orderId}/status`, { status });
    return { success: true, data: response.data };
  } catch (error) {
    console.error("Error updating order status:", error);
    return { success: false, message: "Failed to update order status" };
  }
};
