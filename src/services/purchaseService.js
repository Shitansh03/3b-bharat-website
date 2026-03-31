import { request } from "./api";

/**
 * Get all purchases (files + apps) for a user, grouped by category
 * GET /3dtrial/purchases/userall/:userId
 */
export const getUserPurchasesAll = async (userId) => {
  return request(`/3dtrial/purchases/userall/${userId}`, {
    method: "GET",
  });
};

/**
 * Get all available files with purchase flag for a user
 * GET /3dtrial/files?user_id=:userId
 */
export const getAvailableFiles = async (userId) => {
  const query = userId ? `?user_id=${userId}` : "";
  return request(`/3dtrial/files${query}`, {
    method: "GET",
  });
};

/**
 * Get all categories
 * GET /3dtrial/categories
 */
export const getCategories = async () => {
  return request("/3dtrial/categories", {
    method: "GET",
  });
};
