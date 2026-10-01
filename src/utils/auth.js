/**
 * Authentication Storage & Multi-Profile Utilities
 * Handles token, user profiles, active module (road/bridge), and session management.
 */

export const AUTH_KEYS = {
  TOKEN: "token",
  USER: "user",
  USER_MOB_NO: "user_mob_no",
  ROAD_EUH_ID: "road_euh_id",
  BRIDGE_EUH_ID: "bridge_euh_id",
  USER_PROFILES: "user_profiles",
  REGISTERED_TYPES: "registered_types",
  ACTIVE_MODULE: "active_module",
  // Legacy / backwards compatibility keys
  LEGACY_AUTH: "3dbharat_auth",
  LEGACY_TOKEN: "3dbharat_app_token",
};

/**
 * Handle saving login response data to localStorage
 * Accepts the API response object or response.data
 * @param {Object} response - The API response object ({ data: { ... } } or raw data)
 */
export const handleLoginSuccess = (response) => {
  if (!response) return;
  const result = response.data?.data || response.data || response;

  // 1. Core Auth & IDs
  if (result.token) {
    localStorage.setItem(AUTH_KEYS.TOKEN, result.token);
    localStorage.setItem(AUTH_KEYS.LEGACY_TOKEN, result.token);
  }
  if (result.user) {
    localStorage.setItem(AUTH_KEYS.USER, JSON.stringify(result.user));
    localStorage.setItem(AUTH_KEYS.LEGACY_AUTH, JSON.stringify(result.user));
    localStorage.setItem(
      AUTH_KEYS.USER_MOB_NO,
      result.user.user_mob_no || ""
    );
  }

  // 2. Multi-Profile IDs (Road & Bridge)
  localStorage.setItem(AUTH_KEYS.ROAD_EUH_ID, result.road_euh_id || "");
  localStorage.setItem(AUTH_KEYS.BRIDGE_EUH_ID, result.bridge_euh_id || "");
  localStorage.setItem(
    AUTH_KEYS.USER_PROFILES,
    JSON.stringify(result.profiles || {})
  );
  localStorage.setItem(
    AUTH_KEYS.REGISTERED_TYPES,
    JSON.stringify(result.registered_types || [])
  );

  // 3. Active Module (Default to road if available, else bridge)
  const defaultModule =
    result.active_module || (result.road_euh_id ? "road" : "bridge");
  localStorage.setItem(AUTH_KEYS.ACTIVE_MODULE, defaultModule);

  return result;
};

/**
 * Clear all authentication session keys on logout
 */
export const handleLogout = () => {
  localStorage.removeItem(AUTH_KEYS.TOKEN);
  localStorage.removeItem(AUTH_KEYS.USER);
  localStorage.removeItem(AUTH_KEYS.USER_MOB_NO);
  localStorage.removeItem(AUTH_KEYS.ROAD_EUH_ID);
  localStorage.removeItem(AUTH_KEYS.BRIDGE_EUH_ID);
  localStorage.removeItem(AUTH_KEYS.USER_PROFILES);
  localStorage.removeItem(AUTH_KEYS.REGISTERED_TYPES);
  localStorage.removeItem(AUTH_KEYS.ACTIVE_MODULE);
  localStorage.removeItem(AUTH_KEYS.LEGACY_AUTH);
  localStorage.removeItem(AUTH_KEYS.LEGACY_TOKEN);
};

/**
 * Check if the user is registered for the Road module
 * @returns {boolean}
 */
export const isRoadRegistered = () => {
  const roadEuhId = localStorage.getItem(AUTH_KEYS.ROAD_EUH_ID);
  if (roadEuhId && roadEuhId.trim() !== "") return true;

  try {
    const profiles = JSON.parse(
      localStorage.getItem(AUTH_KEYS.USER_PROFILES) || "{}"
    );
    if (profiles?.road?.is_registered) return true;
  } catch {
    // Ignore JSON parse errors
  }

  try {
    const registeredTypes = JSON.parse(
      localStorage.getItem(AUTH_KEYS.REGISTERED_TYPES) || "[]"
    );
    if (Array.isArray(registeredTypes) && registeredTypes.includes(1)) {
      return true;
    }
  } catch {
    // Ignore JSON parse errors
  }

  try {
    const user = JSON.parse(localStorage.getItem(AUTH_KEYS.USER) || "{}");
    if (user?.user_login_type === 1 && user?.euh_id) return true;
  } catch {
    // Ignore JSON parse errors
  }

  return false;
};

/**
 * Check if the user is registered for the Bridge module
 * @returns {boolean}
 */
export const isBridgeRegistered = () => {
  const bridgeEuhId = localStorage.getItem(AUTH_KEYS.BRIDGE_EUH_ID);
  if (bridgeEuhId && bridgeEuhId.trim() !== "") return true;

  try {
    const profiles = JSON.parse(
      localStorage.getItem(AUTH_KEYS.USER_PROFILES) || "{}"
    );
    if (profiles?.bridge?.is_registered) return true;
  } catch {
    // Ignore JSON parse errors
  }

  try {
    const registeredTypes = JSON.parse(
      localStorage.getItem(AUTH_KEYS.REGISTERED_TYPES) || "[]"
    );
    if (Array.isArray(registeredTypes) && registeredTypes.includes(2)) {
      return true;
    }
  } catch {
    // Ignore JSON parse errors
  }

  try {
    const user = JSON.parse(localStorage.getItem(AUTH_KEYS.USER) || "{}");
    if (user?.user_login_type === 2 && user?.euh_id) return true;
  } catch {
    // Ignore JSON parse errors
  }

  return false;
};

/**
 * Get active EUH ID based on currently active module ('road' or 'bridge')
 * @returns {string}
 */
export const getActiveEuhId = () => {
  const activeModule = localStorage.getItem(AUTH_KEYS.ACTIVE_MODULE) || "road";

  if (activeModule === "bridge") {
    const bridgeId = localStorage.getItem(AUTH_KEYS.BRIDGE_EUH_ID);
    if (bridgeId && bridgeId.trim() !== "") return bridgeId;
  }

  if (activeModule === "road") {
    const roadId = localStorage.getItem(AUTH_KEYS.ROAD_EUH_ID);
    if (roadId && roadId.trim() !== "") return roadId;
  }

  // Fallback to whichever is present
  const roadId = localStorage.getItem(AUTH_KEYS.ROAD_EUH_ID);
  if (roadId && roadId.trim() !== "") return roadId;

  const bridgeId = localStorage.getItem(AUTH_KEYS.BRIDGE_EUH_ID);
  if (bridgeId && bridgeId.trim() !== "") return bridgeId;

  try {
    const user = JSON.parse(localStorage.getItem(AUTH_KEYS.USER) || "{}");
    return user?.euh_id || "";
  } catch {
    return "";
  }
};

/**
 * Get active module ('road' or 'bridge')
 * @returns {string}
 */
export const getActiveModule = () => {
  return localStorage.getItem(AUTH_KEYS.ACTIVE_MODULE) || "road";
};

/**
 * Switch / set the active module ('road' | 'bridge')
 * @param {'road' | 'bridge'} module
 */
export const setActiveModule = (module) => {
  if (module === "road" || module === "bridge") {
    localStorage.setItem(AUTH_KEYS.ACTIVE_MODULE, module);
  }
};

/**
 * Get stored user profiles object
 * @returns {Object}
 */
export const getUserProfiles = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.USER_PROFILES) || "{}");
  } catch {
    return {};
  }
};

/**
 * Get registered type IDs list
 * @returns {number[]}
 */
export const getRegisteredTypes = () => {
  try {
    return JSON.parse(localStorage.getItem(AUTH_KEYS.REGISTERED_TYPES) || "[]");
  } catch {
    return [];
  }
};
