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
        // Mock data or empty array if backend endpoint doesn't exist yet
        return [];
    } catch (error) {
        console.error("Error fetching user orders:", error);
        return [];
    }
};
