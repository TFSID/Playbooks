/**
 * Scanner Service - A higher-level service for working with scanners
 * This builds on top of the api-client.js utility
 */

import { scannerApi } from "./api-client.js"

export class ScannerService {
  /**
   * Run a scan with the specified scanner
   * @param {string} scannerType - The type of scanner to run
   * @param {string} domain - The domain to scan
   * @param {Object} options - Additional options for the scan
   * @returns {Promise<Object>} - The scan results
   */
  static async runScan(scannerType, domain, options = {}) {
    // Validate inputs
    if (!domain) {
      throw new Error("Domain is required")
    }

    if (!this.validateDomain(domain)) {
      throw new Error("Invalid domain format")
    }

    // Save to recent domains
    this.saveDomain(domain)

    // Run the appropriate scanner
    let result

    switch (scannerType) {
      case "nuclei":
        result = await scannerApi.nuclei(domain)
        break
      case "dirsearch":
        result = await scannerApi.dirsearch(domain)
        break
      case "subdomain":
        result = await scannerApi.subdomain(domain)
        break
      case "ip":
        result = await scannerApi.ip(domain)
        break
      default:
        // For custom scanners
        result = await scannerApi.custom(scannerType, domain, options)
    }

    return result
  }

  /**
   * Run a scan using an external API
   * @param {string} url - The full URL of the external scanner API
   * @param {string} domain - The domain to scan
   * @param {Object} options - Additional options for the scan
   * @returns {Promise<Object>} - The scan results
   */
  static async runExternalScan(url, domain, options = {}) {
    // Validate inputs
    if (!url) {
      throw new Error("External API URL is required")
    }

    if (!domain) {
      throw new Error("Domain is required")
    }

    if (!this.validateDomain(domain)) {
      throw new Error("Invalid domain format")
    }

    // Save to recent domains
    this.saveDomain(domain)

    // Run the external scanner
    return await scannerApi.external(url, domain, options)
  }

  /**
   * Validate a domain format
   * @param {string} domain - The domain to validate
   * @returns {boolean} - Whether the domain is valid
   */
  static validateDomain(domain) {
    const domainRegex = /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
    return domainRegex.test(domain)
  }

  /**
   * Save a domain to recent domains
   * @param {string} domain - The domain to save
   * @returns {Array<string>} - The updated list of recent domains
   */
  static saveDomain(domain) {
    if (!domain) return []

    let recentDomains = this.getRecentDomains()
    // Add to beginning of array and remove duplicates
    recentDomains = [domain, ...recentDomains.filter((d) => d !== domain)]
    // Keep only the most recent 5 domains
    recentDomains = recentDomains.slice(0, 5)

    localStorage.setItem("recentDomains", JSON.stringify(recentDomains))
    return recentDomains
  }

  /**
   * Get recent domains from localStorage
   * @returns {Array<string>} - The list of recent domains
   */
  static getRecentDomains() {
    const storedDomains = localStorage.getItem("recentDomains")
    if (storedDomains) {
      return JSON.parse(storedDomains)
    }
    return []
  }
}

