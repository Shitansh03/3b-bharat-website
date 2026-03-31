/**
 * Geo-detection service
 * Detects whether the user is accessing from India or internationally.
 * Uses ipapi.co free API (no key required, 1000 req/day).
 * Caches the result so only one request is made per session.
 */

let cachedRegion = null;

/**
 * Detect user region based on IP geolocation
 * @returns {Promise<{ isIndian: boolean, country: string, countryName: string }>}
 */
export const detectUserRegion = async () => {
  // Return cached result if available
  if (cachedRegion !== null) {
    return cachedRegion;
  }

  try {
    const response = await fetch("https://ipapi.co/json/", {
      signal: AbortSignal.timeout(5000), // 5s timeout
    });

    if (!response.ok) {
      throw new Error(`Geo API returned ${response.status}`);
    }

    const data = await response.json();
    cachedRegion = {
      isIndian: data.country_code === "IN",
      country: data.country_code || "UNKNOWN",
      countryName: data.country_name || "Unknown",
    };
  } catch (error) {
    console.warn("[GeoService] Failed to detect region, defaulting to International:", error.message);
    cachedRegion = {
      isIndian: false,
      country: "UNKNOWN",
      countryName: "International",
    };
  }

  return cachedRegion;
};

/**
 * Reset cached region (useful for testing)
 */
export const resetRegionCache = () => {
  cachedRegion = null;
};
