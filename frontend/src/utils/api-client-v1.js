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
 * @returns {Promise<any>} - The response data
 */
export async function postRequest(endpoint, data, options = {}) {
  try {
    const url = `${API_BASE_URL}${endpoint.startsWith("/") ? endpoint : "/" + endpoint}`

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      body: JSON.stringify(data),
      ...options,
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
}

