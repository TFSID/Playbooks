/**
 * API Client for making requests to the backend
 * This utility can be imported and used in any component
 */

// Base URL for API requests - change this to match your API
const API_BASE_URL = "/api"

/**
 * Make a POST request to the API
 * @param {string} endpoint - The API endpoint (without the base URL)
 * @param {Object} data - The data to send in the request body
 * @param {Object} options - Additional fetch options
 * @param {boolean} useBaseUrl - Whether to use the base URL (false for external APIs)
 * @returns {Promise<any>} - The response data
 */
export async function postRequest(endpoint, data, options = {}, useBaseUrl = true) {
  try {
    // Determine the full URL based on whether we're using the base URL
    const url = useBaseUrl ? `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}` : endpoint

    // Default CORS options
    const corsOptions = {
      mode: "cors",
      credentials: options.credentials || "same-origin",
      ...options,
    }

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...corsOptions,
    })

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `Request failed with status ${response.status}`)
    }

    // Parse the response as JSON
    const responseData = await response.json()
    return responseData
  } catch (error) {
    console.error(`API request failed: ${error.message}`, error)
    throw error
  }
}

/**
 * Make a request to an external API (with CORS support)
 * @param {string} url - The full URL of the external API
 * @param {Object} data - The data to send in the request body
 * @param {string} method - The HTTP method to use (GET, POST, etc.)
 * @param {Object} options - Additional fetch options
 * @returns {Promise<any>} - The response data
 */
export async function externalRequest(url, data = null, method = "GET", options = {}) {
  try {
    // Configure CORS options
    const corsOptions = {
      method,
      mode: "cors", // Enable CORS
      credentials: options.credentials || "omit", // Default to 'omit' for cross-origin
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    }

    // Add body for non-GET requests
    if (method !== "GET" && data) {
      corsOptions.body = JSON.stringify(data)
    }

    // For GET requests with data, append as query parameters
    let requestUrl = url
    if (method === "GET" && data) {
      const params = new URLSearchParams()
      Object.entries(data).forEach(([key, value]) => {
        params.append(key, value)
      })
      requestUrl = `${url}${url.includes("?") ? "&" : "?"}${params.toString()}`
    }

    const response = await fetch(requestUrl, corsOptions)

    // Check if the request was successful
    if (!response.ok) {
      const errorData = await response.json().catch(() => null)
      throw new Error(errorData?.message || `External request failed with status ${response.status}`)
    }

    // Parse the response based on content type
    const contentType = response.headers.get("content-type")
    if (contentType && contentType.includes("application/json")) {
      return await response.json()
    } else {
      return await response.text()
    }
  } catch (error) {
    console.error(`External request failed: ${error.message}`, error)
    throw error
  }
}

/**
 * Scanner API client for making requests to scanner endpoints
 */
export const scannerApi = {
  /**
   * Run a Nuclei scan on a domain
   * @param {string} domain - The domain to scan
   * @returns {Promise<any>} - The scan results
   */
  nuclei: (domain) => postRequest("/scanners/nuclei", { domain }),

  /**
   * Run a Dirsearch scan on a domain
   * @param {string} domain - The domain to scan
   * @returns {Promise<any>} - The scan results
   */
  dirsearch: (domain) => postRequest("/scanners/dirsearch", { domain }),

  /**
   * Run a Subdomain finder scan on a domain
   * @param {string} domain - The domain to scan
   * @returns {Promise<any>} - The scan results
   */
  subdomain: (domain) => postRequest("/scanners/subdomain", { domain }),

  /**
   * Get IP information for a domain
   * @param {string} domain - The domain to lookup
   * @returns {Promise<any>} - The IP information
   */
  ip: (domain) => postRequest("/scanners/ip", { domain }),

  /**
   * Run a custom scanner on a domain
   * @param {string} scannerType - The type of scanner to run
   * @param {string} domain - The domain to scan
   * @param {Object} additionalParams - Additional parameters for the scan
   * @returns {Promise<any>} - The scan results
   */
  custom: (scannerType, domain, additionalParams = {}) =>
    postRequest(`/scanners/${scannerType}`, {
      domain,
      ...additionalParams,
    }),

  /**
   * Run a scan on an external scanner API
   * @param {string} url - The full URL of the external scanner API
   * @param {string} domain - The domain to scan
   * @param {Object} options - Additional options for the request
   * @returns {Promise<any>} - The scan results
   */
  external: (url, domain, options = {}) =>
    externalRequest(url, { domain, ...options.data }, options.method || "POST", options),
}

