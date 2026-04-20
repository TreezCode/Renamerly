# Lighthouse Audit — renamerly.com (desktop)

**Date:** April 20, 2026
**Tool:** `lighthouse@latest` via `npx` (headless Chrome, desktop preset)
**Reports generated:** `lighthouse-home.report.html`, `lighthouse-pricing.report.html`, `lighthouse-app.report.html` (plus `.json`)

> Re-run anytime with `npx -y lighthouse@latest <url> --preset=desktop --output=html --output=json --output-path=./lighthouse-<name> --chrome-flags="--headless=new --no-sandbox" --quiet`
> Then `node scripts/parse-lighthouse.mjs ./lighthouse-<name>.report.json` for the summary.

---

## Scores

| Page | Performance | Accessibility | Best Practices | SEO |
|---|---:|---:|---:|---:|
| **`/`** (home) | 97 | 96 | 92 | **100** |
| **`/pricing`** | 97 | 94 | 92 | **100** |
| **`/app`** | 97 | 96 | 92 | **100** |

**Verdict:** Shipping-quality for launch. Perfect SEO, strong performance, minor a11y polish needed. All Core Web Vitals pass on desktop.

## Core Web Vitals (all green)

| Metric | Home | Pricing | App | Target |
|---|---:|---:|---:|---:|
| **LCP** (Largest Contentful Paint) | 1.2s | 1.2s | 1.2s | <2.5s ✅ |
| **FCP** (First Contentful Paint) | 0.8s | 0.7s | 0.8s | <1.8s ✅ |
| **TBT** (Total Blocking Time) | 0ms | 0ms | 0ms | <200ms ✅ |
| **CLS** (Cumulative Layout Shift) | 0.001 | 0.001 | 0.000 | <0.1 ✅ |
| **Speed Index** | 1.0s | 0.9s | 1.0s | <3.4s ✅ |

> Note: Google uses **mobile** scores for ranking. Run a mobile pass before launch: drop `--preset=desktop`. Mobile scores will be lower due to the throttled CPU/network profile.

---

## 🚨 CRITICAL — Production bugs worth fixing now

### 1. Content Security Policy is blocking Google Analytics

Every page logs this error:

```
Loading the script 'https://www.googletagmanager.com/gtag/js?id=G-GBDEECT0JV' violates
the following Content Security Policy directive: "script-src 'self' 'unsafe-eval' 'unsafe-inline'"
```

**Impact:** GA4 is not loading. **This is why you haven't seen any events in the GA4 dashboard** — it's not a 24-48h indexing delay, the script literally never runs. The `sign_up`, `subscribe`, and `file_exported` events have zero data so far.

**Fix:** Add Google's domains to the CSP. Find where the CSP header is set (likely `next.config.ts`, `middleware.ts`, or `vercel.json`) and allow:
```
script-src: https://www.googletagmanager.com https://www.google-analytics.com
connect-src: https://www.google-analytics.com https://region1.google-analytics.com
img-src: https://www.google-analytics.com https://www.googletagmanager.com
```

### 2. `renamerly.com` → `www.renamerly.com` redirect (wrong direction)

`https://renamerly.com/` 301-redirects to `https://www.renamerly.com/`, adding **~225–270ms** to every cold request. The SEO plan says the canonical is `renamerly.com` (no www) — but Vercel is routing the opposite way.

**Impact:**
- Every share, bookmark, or ad click pays a redirect tax.
- `sameAs`, `canonical`, and `metadataBase` in our code all use the apex (no-www) form — but the deployed site lives on `www.`, creating a canonical mismatch.
- IndexNow URL (`https://renamerly.com/98c6b6e0b75e4768b7ce155096d79ce5.txt`) will 301 before serving the key file — Bing/Yandex may not follow redirects for key validation.

**Fix:** Vercel → Project → Settings → Domains. Set `renamerly.com` (apex) as the **primary** domain, and configure `www.renamerly.com` to 301 → `renamerly.com`. This flips the redirect to match the canonical.

### 3. 404 on a resource (every page)

```
Failed to load resource: the server responded with a status of 404
```

Unknown asset 404-ing on every page. Not shown in the summary, but visible in the full HTML report. Open `lighthouse-home.report.html` → Network requests → filter status=404 to identify.

---

## 🟡 Accessibility — worth a small PR

### Color contrast failures

Specific elements fail WCAG AA (4.5:1 ratio for normal text):

- **Home + Pricing footer:**
  - `Built by Build With Treez` (line footer)
  - `© 2026 Renamerly by Build With Treez. All rights reserved.`
  - `Free for up to 20 images. Upgrade only when you need more.` (home only)
- **App page (extensive):** `SESSION`, `STATS`, `Images`, `SKU Groups`, `Configured`, `Collapse`, `Supports JPG, PNG, WebP, GIF, RAW`, `Max 20 images · Upgrade for unlimited`, and others.

**Fix:** Bump `text-gray-400` → `text-gray-300` (or `text-gray-200`) for small/faded text, or introduce a `text-muted` token with a tested ratio. Run <https://webaim.org/resources/contrastchecker/> on the final pair.

### Heading order skip on `/pricing`

`"Free"` is an `<h3>` (or higher) following a section with no intervening `<h2>`. Assistive-tech structural navigation breaks.

**Fix:** Check the pricing tier headings — either add a parent `<h2>` for the section or demote the tier name to the correct level.

---

## 🟡 Best Practices — CLS prevention

### Logo `<img>` tags missing explicit `width`/`height`

Visible in `Footer.tsx` and one in the landing nav:
- `/brand/logo-full.webp`
- `/brand/logo-icon.webp`
- `/brand/logo-name.webp`

**Fix:** Either add explicit `width` and `height` attributes, or migrate to `next/image`. The ESLint warnings on these files flag this already. Quick win — the CLS score is still good (0.001) because Lighthouse measures reserved space via CSS, but Chrome flags it anyway.

---

## 🟢 Minor opportunities

| Opportunity | Savings | Action |
|---|---:|---|
| Avoid multiple page redirects | ~225–270ms | Fixed by #2 above |
| Reduce unused JavaScript | ~80–120ms | Next.js route-based splitting is doing most of the work; low ROI to chase further until we have user-reported issues |
| Legacy JavaScript | minor | Ensure `browserslist` config targets modern browsers only; Next.js 15 defaults are usually fine |
| Render blocking requests | minor | Inline critical CSS already handled by Next.js; low ROI |
| Unsized images (CLS) | n/a | Covered above |

---

## Recommended priority

1. **🚨 Fix CSP to unblock GA4** — 5 minutes, massive data impact
2. **🚨 Fix www redirect direction** — 2 minutes in Vercel dashboard, 225ms+ every page
3. **🚨 Find and fix the 404** — open the HTML report, filter network tab
4. **🟡 Color contrast on App page** — ~15 minutes of CSS tweaks
5. **🟡 Logo `<img>` → explicit dimensions** — ~5 minutes
6. **🟡 Pricing heading order** — ~2 minutes
7. Re-run Lighthouse on **mobile** preset before launch
