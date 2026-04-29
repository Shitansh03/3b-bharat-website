import { request } from "../api";

/**
 * Login an existing education user
 * @param {string} mobile_no - User mobile number
 * @param {string} password - User password
 * @param {string|null} app_token - Previously saved app token (if any)
 * @returns {Promise<Object>} - Response containing token + user data
 *
 * Body shape:
 * {
 *   "mobile_no": "7219035526",
 *   "password": "abc123",
 *   "login_type": "web",
 *   "app_token": "<saved_token_or_null>"
 * }
 */
export const eduLoginUser = async (mobile_no, password, app_token = null) => {
  const payload = {
    mobile_no,
    password,
    login_type: "web",
  };

  if (app_token) {
    payload.app_token = app_token;
  }

  return request("/user/web-login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
};
