---
import { handleCorsPreflightRequest, applyCors } from "../../../utils/cors-middleware.js"

export const prerender = false

/**
 * Generic scanner API endpoint that handles all scanner types
 */
export async function POST({ request, params }) {
  // Handle CORS preflight
  const corsResponse = handleCorsPreflightRequest(request, {
    // You can customize these options as needed
    allowOrigin: "*", // In production, specify exact domains
    allowMethods: "POST, OPTIONS",
    allowHeaders: "Content-Type, Authorization",
  })

  if (corsResponse) {
    return corsResponse
  }

  try {
    const { scanner } = params
    const data = await request.json()
    const { domain } = data

    if (!domain) {
      return new Response(JSON.stringify({ error: "Domain is required" }), {
        status: 400,
        headers: { "Content-Type": "application/json" },
      })
    }

    // Process the request based on scanner type
    let result

    switch (scanner) {
      case "nuclei":
        result = await runNucleiScan(domain)
        break
      case "dirsearch":
        result = await runDirsearchScan(domain)
        break
      case "subdomain":
        result = await runSubdomainScan(domain)
        break
      case "ip":
        result = await getIpInfo(domain)
        break
      default:
        return new Response(JSON.stringify({ error: "Unknown scanner type" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        })
    }

    // Create the response
    const response = new Response(JSON.stringify(result), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    })

    // Apply CORS headers and return
    return applyCors(response)
  } catch (error) {
    console.error(`Scanner API error:`, error)

    const response = new Response(JSON.stringify({ error: error.message || "Internal server error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    })

    return applyCors(response)
  }
}

// Mock scanner functions - replace with actual implementations
async function runNucleiScan(domain) {
  // In a real implementation, you would call your scanner service
  return {
    scanner: "nuclei",
    domain,
    timestamp: new Date().toISOString(),
    vulnerabilities: [{ name: "Example Vulnerability", severity: "medium" }],
  }
}

async function runDirsearchScan(domain) {
  return {
    scanner: "dirsearch",
    domain,
    timestamp: new Date().toISOString(),
    directories: ["/admin", "/api", "/login"],
  }
}

async function runSubdomainScan(domain) {
  return {
    scanner: "subdomain",
    domain,
    timestamp: new Date().toISOString(),
    subdomains: [`api.${domain}`, `www.${domain}`, `mail.${domain}`],
  }
}

async function getIpInfo(domain) {
  return {
    scanner: "ip",
    domain,
    timestamp: new Date().toISOString(),
    ip: "192.168.1.1",
    location: "Example Location",
  }
}
---

