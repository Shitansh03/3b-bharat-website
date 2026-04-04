import { request } from "./api";

/**
 * Create a purchase with Razorpay order (if payment required)
 * Handles both free and paid purchases
 * POST /3dtrial/purchases/create
 */
export const createPurchase = async (purchaseData) => {
  return request("/3dtrial/purchases/create", {
    method: "POST",
    body: JSON.stringify(purchaseData),
  });
};

/**
 * Get the status of a specific purchase (check if 'received' or 'failed')
 * GET /3dtrial/purchases/status/:purchaseId
 */
export const getPurchaseStatus = async (purchaseId) => {
  // Add cache-busting timestamp to prevent browser from returning
  // cached 304 responses which would keep status as "pending" forever
  return request(`/3dtrial/purchases/status/${purchaseId}?_t=${Date.now()}`, {
    method: "GET",
    headers: {
      "Cache-Control": "no-cache",
      "Pragma": "no-cache",
    },
  });
};

/**
 * Validate a coupon code
 * POST /3dtrial/coupons/validate
 */
export const validateCoupon = async (couponData) => {
  return request("/3dtrial/coupons/validate", {
    method: "POST",
    body: JSON.stringify(couponData),
  });
};