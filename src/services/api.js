const BASE_URL = "https://edu.3dbharat.com/server";

/**
 * Generic request helper with error handling
 */
const request = async (endpoint, options = {}) => {
  const url = `${BASE_URL}${endpoint}`;

  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    const contentType = response.headers.get("content-type") || "";
    let errorData = {};
    if (contentType.includes("application/json")) {
      errorData = await response.json().catch(() => ({}));
    } else {
      const text = await response.text().catch(() => "");
      errorData = {
        message: text || `Request failed with status ${response.status}`,
      };
    }
    if (import.meta.env.DEV) {
      console.error(`[API Error] ${options.method || "GET"} ${url}:`, {
        status: response.status,
        data: errorData,
      });
    }

    const error = new Error(
      errorData.message || `Request failed with status ${response.status}`,
    );
    error.status = response.status;
    error.data = errorData;
    throw error;
  }

  const contentType = response.headers.get("content-type") || "";
  if (contentType.includes("application/json")) {
    return response.json();
  }
  return response.text();
};

export { BASE_URL, request };
