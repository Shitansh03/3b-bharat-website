import { request } from "./api";

/**
 * Presentation Service
 * Handles API calls for the "Our Approach" / Presentation module
 */

/**
 * Fetch active presentation with its slides and documents
 * GET /server/presentation/active (or ?wph_id=:wphId)
 * 
 * @param {number|string} [wphId] - Optional presentation ID
 * @returns {Promise<Object>} Presentation payload containing header, slides, and documents
 */
export const getActivePresentation = async (wphId = null) => {
  const query = wphId ? `?wph_id=${encodeURIComponent(wphId)}` : "";
  return request(`/presentation/active${query}`, {
    method: "GET",
  });
};

/**
 * Fetch presentation by ID
 * GET /server/presentation/:wphId
 * 
 * @param {number|string} wphId - Presentation ID
 * @returns {Promise<Object>}
 */
export const getPresentationById = async (wphId) => {
  return request(`/presentation/${encodeURIComponent(wphId)}`, {
    method: "GET",
  });
};

/**
 * Fetch list of all active presentation IDs currently published in the database
 * GET /server/presentation/active-ids
 * @returns {Promise<Object>} { activeIds: number[] }
 */
export const getActivePresentationIds = async () => {
  return request("/presentation/active-ids", {
    method: "GET",
  });
};

/**
 * Fetch active presentation category cards
 * GET /server/presentation/cards?type=1 (or 2)
 * @param {number|string} type - 1 for Technical, 2 for Marketing (formerly Non-Technical)
 * @returns {Promise<Object>} { cards: Array, count: number }
 */
export const getCategoryCards = async (type = 1) => {
  return request(`/presentation/cards?type=${encodeURIComponent(type)}`, {
    method: "GET",
  });
};
