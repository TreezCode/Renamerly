import type { NextConfig } from "next";

// Content Security Policy. Grouped by third-party integration so it's clear
// why each origin is allowed. Remove an origin if you drop the integration.
//
// Third parties:
//   - Google Analytics 4 / GTM: script, pixel, and beacon endpoints
//   - Stripe.js (client-side Checkout redirect): script + API + framed checkout
//   - Vercel Analytics / Speed Insights: script + vitals endpoint
//   - Supabase: REST + realtime websockets
//   - OAuth providers: redirects to Google + GitHub
const ContentSecurityPolicy = `
  default-src 'self';
  script-src 'self' 'unsafe-eval' 'unsafe-inline'
    https://www.googletagmanager.com
    https://www.google-analytics.com
    https://js.stripe.com
    https://va.vercel-scripts.com;
  style-src 'self' 'unsafe-inline';
  img-src 'self' data: blob:
    https://www.google-analytics.com
    https://www.googletagmanager.com
    https://*.google-analytics.com;
  font-src 'self' data:;
  connect-src 'self'
    https://*.supabase.co
    wss://*.supabase.co
    https://accounts.google.com
    https://github.com
    https://www.google-analytics.com
    https://*.google-analytics.com
    https://*.analytics.google.com
    https://*.googletagmanager.com
    https://api.stripe.com
    https://vitals.vercel-insights.com;
  frame-src 'self' https://js.stripe.com https://hooks.stripe.com https://checkout.stripe.com;
  media-src 'self' blob:;
  worker-src 'self' blob:;
  object-src 'none';
  base-uri 'self';
  form-action 'self' https://checkout.stripe.com;
  frame-ancestors 'none';
  upgrade-insecure-requests;
`.replace(/\s{2,}/g, ' ').trim();

const securityHeaders = [
  {
    key: 'Content-Security-Policy',
    value: ContentSecurityPolicy
  },
  {
    key: 'X-DNS-Prefetch-Control',
    value: 'on'
  },
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  {
    key: 'X-Frame-Options',
    value: 'DENY'
  },
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  {
    key: 'X-XSS-Protection',
    value: '1; mode=block'
  },
  {
    key: 'Referrer-Policy',
    value: 'strict-origin-when-cross-origin'
  },
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];

const nextConfig: NextConfig = {
  experimental: {
    // Reduces initial server memory — pages are loaded on first request instead of pre-cached on boot
    preloadEntriesOnStart: false,
    // Reduces peak Webpack memory during production builds
    webpackMemoryOptimizations: true,
  },
  async headers() {
    return [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
