import api from "./api";

// Fetch user's reservations
export const getUserReservations = async () => {
    try {
        const response = await api.get("/api/reservations/my-reservations");
        return response.data;
    } catch (error) {
        console.error("Error fetching user reservations:", error);
        return [];
    }
};

// Fetch user's orders (mocked for now as backend is incomplete)
export const getUserOrders = async () => {
    try {
        const response = await api.get("/api/orders/my-orders");
        return response.data;
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
};
