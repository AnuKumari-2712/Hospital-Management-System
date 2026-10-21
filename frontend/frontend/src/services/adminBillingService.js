import axiosInstance from "./axiosInstance";

/**
 * Fetch all bills hospital-wide
 * Expected backend route: GET /api/v1/admin/billing
 */
export const getAllBills = async () => {
  const { data } = await axiosInstance.get("/admin/billing");
  return data;
};

/**
 * Fetch all payments hospital-wide
 * Expected backend route: GET /api/v1/admin/payments
 */
export const getAllPayments = async () => {
  const { data } = await axiosInstance.get("/admin/payments");
  return data;
};

/**
 * Fetch inventory items
 * Expected backend route: GET /api/v1/admin/inventory
 */
export const getInventory = async () => {
  const { data } = await axiosInstance.get("/admin/inventory");
  return data;
};

/**
 * Add a new inventory item
 * Expected backend route: POST /api/v1/admin/inventory
 */
export const addInventoryItem = async (itemData) => {
  const { data } = await axiosInstance.post("/admin/inventory", itemData);
  return data;
};

/**
 * Update inventory item (e.g. quantity)
 * Expected backend route: PATCH /api/v1/admin/inventory/:id
 */
export const updateInventoryItem = async (id, itemData) => {
  const { data } = await axiosInstance.patch(`/admin/inventory/${id}`, itemData);
  return data;
};

/**
 * Delete inventory item
 * Expected backend route: DELETE /api/v1/admin/inventory/:id
 */
export const deleteInventoryItem = async (id) => {
  const { data } = await axiosInstance.delete(`/admin/inventory/${id}`);
  return data;
};