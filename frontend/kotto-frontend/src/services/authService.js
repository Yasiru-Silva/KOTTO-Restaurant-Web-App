import axios from "axios";
import { API_BASE } from "../config/apiBase";

const api = axios.create({
  baseURL: API_BASE,
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

export async function registerUser(payload) {
  const res = await api.post("/api/auth/register", payload);
  return res.data;
}

export async function loginUser(payload) {
  const res = await api.post("/api/auth/login", payload);
  return res.data;
}

/**
 * Initiate password reset process
 * @param {Object} payload - { email: string }
 * @returns {Object} - { message: string }
 */
export async function forgotPassword(payload) {
  const res = await api.post("/api/auth/forgot-password", payload);
  return res.data;
}

/**
 * Reset password using token from email
 * @param {Object} payload - { token: string, newPassword: string }
 * @returns {Object} - { message: string }
 */
export async function resetPassword(payload) {
  const res = await api.post("/api/auth/reset-password", payload);
  return res.data;
}