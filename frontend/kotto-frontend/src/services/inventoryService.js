import api from "./api";

export const getIngredients = async () => {
  const response = await api.get("/api/admin/inventory");
  return response.data;
};

export const createIngredient = async (payload) => {
  const response = await api.post("/api/admin/inventory", payload);
  return response.data;
};

export const updateIngredient = async (id, payload) => {
  const response = await api.put(`/api/admin/inventory/${id}`, payload);
  return response.data;
};

export const deleteIngredient = async (id) => {
  const response = await api.delete(`/api/admin/inventory/${id}`);
  return response.data;
};