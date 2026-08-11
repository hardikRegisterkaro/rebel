import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";

/**
 * Origin of the CMS the careers board fetches from, normalised to scheme+host
 * because CSP source expressions take no path.
 */
const cmsOrigin = (() => {
  const raw = process.env.NEXT_PUBLIC_CMS_API_URL ?? "http://localhost:3000";
  try {
    return new URL(raw).origin;
  } catch {
    return "";
  }
})();

/**
 * Content Security Policy.
 *
 * `'unsafe-inline'` on script-src is a deliberate tradeoff: Next injects an
 * inline bootstrap script on every page, and the alternative — per-request
 * nonces — forces dynamic rendering and would cost the static prerender on all
 * six routes. The policy still blocks the more valuable thing, loading script
 * from any origin but our own.
 *
 * style-src needs it too: Tailwind ships a stylesheet, but `reveal-observer`
 * and the canvases set inline `style` properties at runtime.
 *
 * Dev additionally needs 'unsafe-eval' and a websocket connection for HMR.
 */
const csp = [
  "default-src 'self'",
  `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
  "style-src 'self' 'unsafe-inline'",
  "img-src 'self' data: blob:",
  "font-src 'self'",
  // The careers board pages through the CMS API from the browser, so the CMS
  // origin has to be allowed here — `'self'` alone silently blocks every
  // pagination and discipline-filter request.
  `connect-src 'self' ${cmsOrigin}${isDev ? " ws: wss:" : ""}`.trim(),
  // Forms compose a mailto: rather than posting anywhere, so the scheme has to
  // be allowed for the no-JS fallback on the Open Lab form to work.
  "form-action 'self' mailto:",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "Content-Security-Policy", value: csp },
  // Superseded by frame-ancestors above, kept for older browsers.
  { key: "X-Frame-Options", value: "DENY" },
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=(), interest-cohort=()",
  },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
];

const nextConfig: NextConfig = {
  // Don't advertise the framework and version to attackers.
  poweredByHeader: false,

  images: {
    // AVIF first, WebP fallback. No remotePatterns: every image is a local
    // file under public/, so the optimizer never processes untrusted input.
    formats: ["image/avif", "image/webp"],
  },

  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
};

export default nextConfig;
