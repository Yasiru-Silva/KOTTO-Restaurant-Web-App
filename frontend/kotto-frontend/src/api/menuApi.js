import axios from "axios";

const API_BASE_URL = "http://localhost:8081/api";

export const fetchMenuItems = async () => {
  try {
    const response = await axios.get(`${API_BASE_URL}/menu`);
    return response.data;
  } catch (error) {
    throw error;
  }
};