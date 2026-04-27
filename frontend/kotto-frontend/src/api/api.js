import axios from "axios";
import { API_BASE } from "../config/apiBase";

export const api = axios.create({
  baseURL: API_BASE,
});

// attach token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});