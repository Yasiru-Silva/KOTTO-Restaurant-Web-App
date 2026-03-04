import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:8081",
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