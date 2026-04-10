import axios from "axios";
import { API_BASE } from "../config/apiBase";

const api = axios.create({
  baseURL: API_BASE,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

function parseErrorPayload(data) {
  if (!data || typeof data !== "object") return "Request failed";
  return data.message || data.error || "Request failed";
}

/** Multipart via fetch so the browser sets the boundary (axios can break uploads). */
async function multipartFetch(path, formData, method = "POST") {
  const token = localStorage.getItem("token");
  const headers = {};
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers,
    body: formData,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { message: text || res.statusText };
  }

  if (!res.ok) {
    const err = new Error(parseErrorPayload(data));
    err.response = { data, status: res.status };
    throw err;
  }
  return data;
}

export async function createMenuItem(formData) {
  return multipartFetch("/api/admin/menu/items", formData, "POST");
}

export async function updateMenuItem(id, formData) {
  return multipartFetch(`/api/admin/menu/items/${id}`, formData, "PUT");
}

export async function getMenuItemAdmin(id) {
  const res = await api.get(`/api/admin/menu/items/${id}`);
  return res.data;
}

export async function deleteMenuItem(id) {
  await api.delete(`/api/admin/menu/items/${id}`);
}

export async function createCategory(name) {
  const res = await api.post("/api/admin/categories", { name });
  return res.data;
}

export async function createMood(name) {
  const res = await api.post("/api/admin/moods", { name });
  return res.data;
}
