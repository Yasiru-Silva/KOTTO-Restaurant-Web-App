import axios from "axios";
import { API_BASE } from "../config/apiBase";

export { API_BASE };

export function resolveImageUrl(imageUrl) {
  if (!imageUrl) return null;
  if (imageUrl.startsWith("http")) return imageUrl;
  const path = imageUrl.startsWith("/") ? imageUrl : `/${imageUrl}`;
  return `${API_BASE}${path}`;
}

export const getMenu = async (moodId, categoryId) => {
  const params = {};
  if (moodId != null && moodId !== "") params.moodId = moodId;
  if (categoryId != null && categoryId !== "") params.categoryId = categoryId;
  const response = await axios.get(`${API_BASE}/api/menu`, { params });
  return response.data.map((item) => ({
    ...item,
    image: resolveImageUrl(item.imageUrl),
  }));
};

export const getCategories = async () => {
  const response = await axios.get(`${API_BASE}/api/categories`);
  return response.data;
};

export const getMoods = async () => {
  const response = await axios.get(`${API_BASE}/api/moods`);
  return response.data;
};
