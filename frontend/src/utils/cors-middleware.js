/**
 * CORS Middleware for Astro API routes
 * This can be used in your API endpoints to enable CORS
 */

/**
 * Apply CORS headers to an Astro API response
 * @param {Response} response - The response object
 * @param {Object} options - CORS configuration options
 * @returns {Response} - The response with CORS headers
 */
export function applyCors(response, options = {}) {
    const {
      allowOrigin = "*",
      allowMethods = "GET, POST, PUT, DELETE, OPTIONS",
      allowHeaders = "Content-Type, Authorization",
      allowCredentials = true,
      maxAge = 86400, // 24 hours
    } = options
  
    // Apply CORS headers
    response.headers.set("Access-Control-Allow-Origin", allowOrigin)
    response.headers.set("Access-Control-Allow-Methods", allowMethods)
    response.headers.set("Access-Control-Allow-Headers", allowHeaders)
  
    if (allowCredentials) {
      response.headers.set("Access-Control-Allow-Credentials", "true")
    }
  
    response.headers.set("Access-Control-Max-Age", maxAge.toString())
  
    return response
  }
  
  /**
   * Handle CORS preflight requests
   * @param {Request} request - The incoming request
   * @param {Object} options - CORS configuration options
   * @returns {Response|null} - A response for OPTIONS requests, null otherwise
   */
  export function handleCorsPreflightRequest(request, options = {}) {
    // Handle preflight OPTIONS request
    if (request.method === "OPTIONS") {
      const response = new Response(null, { status: 204 }) // No content
      return applyCors(response, options)
    }
  
    // Not a preflight request
    return null
  }
  
  /**
   * Example usage in an Astro API endpoint:
   *
   * ---
   * import { handleCorsPreflightRequest, applyCors } from '../utils/cors-middleware.js';
   *
   * export const prerender = false;
   *
   * export async function POST({ request }) {
   *   // Handle CORS preflight
   *   const corsResponse = handleCorsPreflightRequest(request, {
   *     allowOrigin: 'https://trusted-site.com',
   *     allowMethods: 'GET, POST'
   *   });
   *
   *   if (corsResponse) {
   *     return corsResponse;
   *   }
   *
   *   // Process the request
   *   const data = await request.json();
   *
   *   // Create and return the response with CORS headers
   *   const response = new Response(JSON.stringify({ success: true, data }), {
   *     status: 200,
   *     headers: {
   *       'Content-Type': 'application/json'
   *     }
   *   });
   *
   *   return applyCors(response, {
   *     allowOrigin: 'https://trusted-site.com'
   *   });
   * }
   * ---
   */
  
  