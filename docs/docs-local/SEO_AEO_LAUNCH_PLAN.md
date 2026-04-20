# Renamerly SEO + AEO Launch Plan

**Canonical domain:** `https://renamerly.com`
**Stack:** Next.js (App Router) on Vercel, Supabase, Stripe
**Goal:** Rank on Google/Bing for product-image-renaming intents AND surface in AI answers (ChatGPT, Perplexity, Google AI Overviews, Claude, Gemini).

> **Legend:** ✅ Done (committed to codebase) · 🔧 Cascade can do (just ask) · 👤 Manual — requires your accounts/dashboards

---

## Progress snapshot

**Code-complete tasks:** sitemap/robots canonical URL fix, `/pricing` in sitemap, per-page metadata on `/pricing`+`/app`+`/(auth)`, auth routes noindex, GA4 script wired, `file_exported` / `sign_up` / `subscribe` GA4 events firing, OAuth callback prod-host guard, branded 404 page, IndexNow key file, **Organization + WebSite + SoftwareApplication JSON-LD** (with sameAs social links), **FAQPage + Product/Offer JSON-LD on /pricing**, **AI-crawler allow rules in robots.ts**, **public/llms.txt**.

**Your turn next:** Mark GA4 key events (once events have fired in production), activate IndexNow (ping the activation URL after deploy), validate structured data at <https://search.google.com/test/rich-results>, optionally provide Microsoft Clarity project ID.

---

## Phase 1 — Verify domain & wire up Search Console

### 1.1 Google Search Console (GSC) ✅
1. Go to <https://search.google.com/search-console>.
2. Add property → **Domain** property (not URL-prefix). Enter `renamerly.com`.
3. Verify via DNS TXT record at your registrar (Cloudflare/Namecheap):
   - Type: `TXT` · Host: `@` · Value: `google-site-verification=<token-from-GSC>` · TTL: Auto
4. Click Verify. Domain property covers `www.`, `http/https`, and all subdomains.
5. **Submit sitemap:** GSC → Sitemaps → `https://renamerly.com/sitemap.xml`.
6. **URL Inspection:** paste `https://renamerly.com/` → Request indexing.

### 1.2 Bing Webmaster Tools ✅
1. <https://www.bing.com/webmasters> → Add site `https://renamerly.com`.
2. **Import from GSC** (one click) — easiest path after GSC is verified.
3. Submit sitemap. Bing powers DuckDuckGo, Yahoo, **and ChatGPT search**.

### 1.3 IndexNow ✅ / 👤
- ✅ Key file created: `public/98c6b6e0b75e4768b7ce155096d79ce5.txt` (committed).
- ✅ Served at: `https://renamerly.com/98c6b6e0b75e4768b7ce155096d79ce5.txt` after next deploy.
- 👤 **Activate after deploy** — paste this URL in your browser once:
  ```
  https://api.indexnow.org/indexnow?url=https://renamerly.com&key=98c6b6e0b75e4768b7ce155096d79ce5&keyLocation=https://renamerly.com/98c6b6e0b75e4768b7ce155096d79ce5.txt
  ```
- 👤 **Cloudflare users:** Speed → Crawler Hints → Enable (auto-pings on every cache purge).
- 👤 Ping manually whenever you publish a new page:
  ```
  https://api.indexnow.org/indexnow?url=https://renamerly.com/YOUR-NEW-PAGE&key=98c6b6e0b75e4768b7ce155096d79ce5
  ```

### 1.4 Other engines
- **Yandex Webmaster** 👤 — low priority unless targeting RU.
- **Naver / Baidu** — skip.

---

## Phase 2 — Technical SEO hardening

### 2.1 Fix sitemap + robots base URL ✅
- `sitemap.ts` and `robots.ts` now hard-code `https://renamerly.com` when `VERCEL_ENV === 'production'`. Fixed.

### 2.2 Expand sitemap ✅ / 🔧
- ✅ `/`, `/pricing` (0.9), `/app` (0.8) are in sitemap.
- 🔧 Add `/changelog`, `/about`, `/privacy`, `/terms`, `/blog/[slug]` as those pages are built.

### 2.3 Per-page metadata ✅ / 🔧
- ✅ `/pricing` — unique title, description, canonical, OG (`src/app/pricing/layout.tsx`).
- ✅ `/app` — unique title, description, canonical, OG (`src/app/app/layout.tsx`).
- ✅ `/(auth)` group — noindex, nofollow applied to all login/signup/reset pages (`src/app/(auth)/layout.tsx`).
- 🔧 Future: per-page metadata for `/blog/[slug]`, `/changelog`, `/about` as those routes are created.

### 2.4 Structured data (JSON-LD) ✅ / 🔧
- ✅ `SoftwareApplication` schema in root layout (fake `aggregateRating` removed).
- ✅ `Organization` schema (sitewide) with `sameAs` → Twitter, LinkedIn, GitHub, YouTube.
- ✅ `WebSite` schema linked to the organization via `@id`.
- ✅ `FAQPage` schema on `/pricing` (5 Qs pulled from the page's FAQ section).
- ✅ `Product` + `Offer` schema on `/pricing` for Free and Pro plans (Pro has `UnitPriceSpecification` for monthly billing).
- 🔧 `FAQPage` schema on landing page — pending your FAQ copy (or we can lift a subset from `/pricing`).
- 🔧 `BreadcrumbList` on nested pages once blog/docs exist.
- 🔧 `HowTo` schema on any tutorial pages.
- 👤 Validate at <https://validator.schema.org/> and <https://search.google.com/test/rich-results> after deploy.

### 2.5 Core Web Vitals 👤 / 🔧
- 👤 Run `npx @unlighthouse/cli --site https://renamerly.com` after deploy and share results.
- 🔧 Fix any LCP/CLS issues found (image priority flags, dimension reservation).
- Targets: **LCP** < 2.5s · **INP** < 200ms · **CLS** < 0.1.

### 2.6 Crawlability checklist
- ✅ `robots.txt` resolves and points sitemap at canonical domain.
- ✅ `sitemap.xml` has 3 public URLs with correct base URL.
- ✅ Auth routes are noindex — won't be indexed even if crawled.
- ✅ Custom 404 page (`src/app/not-found.tsx`) — branded, noindex.
- ✅ Set up `www.renamerly.com` → `renamerly.com` 301 redirect in **Vercel → Domains**.
- ✅ `http://` → `https://` is handled automatically by Vercel.

### 2.7 Performance quick wins ✅ / 🔧
- ✅ Web font preload in root layout.
- ✅ `next/font` with `display: 'swap'`.
- 🔧 Audit `<img>` tags in landing page → convert to `next/image` with explicit dimensions.
- 🔧 Lazy-load below-fold heavy components via `dynamic(() => import(...), { ssr: false })`.

---

## Phase 3 — Analytics & measurement

### 3.1 Google Analytics 4 ✅ / 👤
- ✅ GA4 `<Script>` tags wired in root layout, gated on `NEXT_PUBLIC_GA_ID` env var.
- ✅ **Create GA4 property** at <https://analytics.google.com/> → Admin → Create property "Renamerly".
- ✅ Add Web data stream for `https://renamerly.com` → copy Measurement ID (`G-XXXXXXXXXX`).
- ✅ **Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX`** in Vercel → Project → Settings → Environment Variables (Production + Preview) → redeploy.
- ✅ GA4 → Admin → **Product Links → Search Console** → link the property.
- 👤 Mark conversions in GA4 → Admin → Events: `sign_up`, `subscribe`, `checkout_completed`, `file_exported`.

### 3.2 Google Tag Manager 👤
- Optional. Use GTM if you want to layer in ad pixels, Hotjar, Clarity without code deploys. Otherwise GA4 direct (already done) is fine.

### 3.3 Microsoft Clarity 🔧 / 👤
- 👤 Create project at <https://clarity.microsoft.com/> → copy the project ID.
- 🔧 Drop the Clarity `<Script>` into root layout (same pattern as GA4) — just share the project ID.

### 3.4 Vercel Analytics ✅
- Already installed and active. Provides sampled-free RUM Core Web Vitals.

### 3.5 UTM hygiene 👤
- Tag all outbound links (social, email, any paid ads) with `utm_source`, `utm_medium`, `utm_campaign`. Use <https://ga-dev-tools.google.com/campaign-url-builder/>.

---

## Phase 4 — Content + on-page SEO (Week 1–4)

### 4.1 Keyword strategy 👤
Primary cluster:
- "rename product images for shopify"
- "batch rename photos for etsy"
- "seo friendly image file names"
- "product photo naming convention"
- "bulk image rename tool online"

Use Google Keyword Planner (free with any Google Ads account), Ahrefs Free Webmaster Tools, or <https://keywordseverywhere.com>. Target long-tail first.

### 4.2 Content map — minimum viable blog 🔧 / 👤
- 👤 Decide on blog structure (MDX files in repo vs. headless CMS like Contentlayer, Sanity, or Notion).
- 🔧 Once decided, scaffold `/blog` route, layout, and first 3 post templates.
- 👤 Write content (1,500–2,500 words each, one primary keyword per post):
  1. "How to Rename Product Images for Shopify (The SEO-Friendly Way)"
  2. "Etsy Product Photo File Names: What Actually Helps You Rank"
  3. "Bulk Rename Images Without Losing EXIF Data — Complete Guide"
  4. "Image SEO in 2026: File Names, Alt Text, and Structured Data"
  5. "Shopify vs Etsy vs Amazon: Image Naming Requirements Compared"
- Each post needs: `Article` + `BreadcrumbList` JSON-LD, `FAQPage` JSON-LD, internal links to `/app` and `/pricing`, one original screenshot.

### 4.3 Landing page on-page audit 🔧 / 👤
- 👤 Confirm H1 contains primary keyword.
- 🔧 Add `FAQPage` JSON-LD to landing page once you provide the FAQ questions.
- 👤 Add social proof (real testimonials/logos) when available.

### 4.4 Internal linking 🔧
- Footer links to all top-level pages — implement when footer component exists or is updated.
- Breadcrumbs on nested routes — implement alongside blog.

### 4.5 Image SEO 🔧
- Audit `public/brand/` filenames and `alt` attributes across components. Fixable on request.

---

## Phase 5 — Off-page / authority (Week 2+)

All manual — no code required.

### 5.1 Backlinks 👤
- **Product Hunt launch** — biggest single-day backlink + traffic spike.
- **AppSumo / BetaList / Indie Hackers / Hacker News Show HN** — stagger submissions.
- Shopify/Etsy seller communities (Reddit, Facebook groups — genuine help only).
- **HARO / Qwoted / SourceBottle** — 2 responses/week.

### 5.2 Brand entity profiles 👤
These URLs are needed to complete the `Organization` JSON-LD schema (Phase 2.4):
- Twitter/X: `@buildwithtreez` ✅ (already in metadata)
- LinkedIn Company Page `Build With Treez` `https://www.linkedin.com/company/build-with-treez/`
- GitHub org: `@TreezCode` `https://github.com/TreezCode`
- YouTube channel: `@BuildWithTreez` `https://www.youtube.com/@buildwithtreez`
- Crunchbase profile
- G2 / Capterra / Product Hunt / AlternativeTo listings

Once you have these URLs, tell Cascade and the `Organization` schema block will be added in one edit.

### 5.3 Digital PR 👤
- Pitch e-commerce newsletters (2PM, Lean Luxe, Modern Retail).
- Sponsor small e-com podcasts if budget allows.

---

## Phase 6 — AEO (Answer Engine Optimization) for LLMs

### 6.1 Machine-readable HTML 🔧
- Structured data (Phase 2.4) is the main lever. Once FAQPage + Organization are added, this is largely done.
- Plain-language summaries under H1 on landing page — review and adjust on request.

### 6.2 llms.txt ✅
- `public/llms.txt` created — summary, audience, features, pricing, core URLs, FAQ shape, brand entity links. Update when blog ships.

### 6.3 AI crawler rules in robots.ts ✅
- `src/app/robots.ts` now emits explicit rules for GPTBot, OAI-SearchBot, ChatGPT-User, PerplexityBot, Perplexity-User, Google-Extended, ClaudeBot, anthropic-ai, Claude-Web, Applebot-Extended, CCBot, Bytespider, Amazonbot. All allow `/` and disallow `/api/`, `/dashboard/`, `/auth/`. `host` directive set to canonical domain.

### 6.4 Content shape for citations 👤 / 🔧
- Write comparison/listicle/HowTo content (Phase 4.2).
- 🔧 Add `HowTo` + `FAQPage` schema to each post template.

### 6.5 Track AEO visibility 👤
- Weekly manual check: query ChatGPT, Perplexity, Google AI Mode, Claude with:
  - "best tool to rename product images for shopify"
  - "how do I batch rename etsy product photos"
  - "seo-friendly image file names for ecommerce"
  - "alternatives to bulk rename utility for mac"
  - "what is Renamerly"
- Paid tools (when budget allows): Peec AI, Profound, Otterly.AI, SE Ranking AI visibility.

### 6.6 Reddit + YouTube 👤
- Genuine participation in `r/shopify`, `r/etsy`, `r/ecommerce`, `r/entrepreneur`.
- Record a 2-min demo video on YouTube with keyword-rich title + timestamps.

---

## Phase 7 — Ongoing ops

### Weekly 👤
- GSC → Performance: impressions, CTR, avg position for top 20 queries.
- GSC → Pages: new 404s, soft 404s, redirect chains.
- Vercel Analytics / GA4 → conversion funnel.
- AI citation spot-check (Phase 6.5).

### Monthly 👤 / 🔧
- Publish 2–4 blog posts.
- Refresh one existing post → re-submit to GSC.
- Backlink audit (Ahrefs Webmaster Tools free tier).
- Core Web Vitals report (GSC + PageSpeed Insights).
- 🔧 Update `robots.ts` if new AI crawlers emerge.

### Quarterly 👤
- Re-run keyword research.
- Competitor audit for top 10 keywords.
- Structured data validation run across all templates.
- Refresh OG images if branding shifts.

---

## Master checklist

### ✅ Already done (in codebase)
- [x] `sitemap.ts` + `robots.ts` canonical URL fixed
- [x] `/pricing` added to sitemap
- [x] Per-page `Metadata` on `/pricing`, `/app`
- [x] Auth routes (`/(auth)`) marked `noindex, nofollow`
- [x] Fake `aggregateRating` removed from JSON-LD
- [x] GA4 `<Script>` wired in root layout
- [x] GA4 events firing: `file_exported`, `sign_up`, `subscribe`
- [x] OAuth callback prod-host guard
- [x] Custom 404 page
- [x] IndexNow key file
- [x] **Organization + WebSite + SoftwareApplication JSON-LD** (root layout)
- [x] **FAQPage + Product/Offer JSON-LD** on `/pricing`
- [x] **AI-crawler allow rules** in `robots.ts`
- [x] **`public/llms.txt`**

### 🔧 Ask Cascade to do (optional / blocked)
- [ ] Add `FAQPage` JSON-LD to landing page (need FAQ copy)
- [ ] Add Microsoft Clarity script (need your Clarity project ID)
- [ ] Scaffold `/blog` route + `Article`/`BreadcrumbList` template (need CMS decision)
- [ ] Audit `<img>` → `next/image` conversions on landing page
- [ ] Add footer nav links to all top-level pages

### 👤 You need to do manually
- [ ] Verify `renamerly.com` in Google Search Console (DNS TXT record)
- [ ] Submit `sitemap.xml` in GSC
- [ ] Import GSC → Bing Webmaster Tools + submit sitemap
- [ ] Set `www.renamerly.com` → `renamerly.com` redirect in Vercel → Domains
- [ ] Create GA4 property + Web data stream → copy `G-XXXXXXXXXX`
- [ ] Set `NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX` in Vercel env → redeploy
- [ ] Link GA4 ↔ Search Console (GA4 Admin → Product Links)
- [ ] Mark GA4 conversion events: `sign_up`, `subscribe`, `checkout_completed`, `file_exported`
- [ ] Activate IndexNow after deploy (ping the activation URL in §1.3)
- [ ] Create social profiles: LinkedIn, YouTube, GitHub org, Crunchbase, G2, Capterra, Product Hunt, AlternativeTo
- [ ] Run Unlighthouse / PageSpeed Insights after deploy; share results for CWV fixes
- [ ] Write blog post content (Phase 4.2)
- [ ] Weekly AI citation spot-checks (Phase 6.5)
- [ ] Product Hunt launch preparation

---

## Reference URLs

- Google Search Console: <https://search.google.com/search-console>
- Bing Webmaster: <https://www.bing.com/webmasters>
- GA4: <https://analytics.google.com/>
- Microsoft Clarity: <https://clarity.microsoft.com/>
- Schema validator: <https://validator.schema.org/>
- Rich Results Test: <https://search.google.com/test/rich-results>
- PageSpeed Insights: <https://pagespeed.web.dev/>
- IndexNow: <https://www.indexnow.org/>
- llms.txt spec: <https://llmstxt.org/>
- GA4 UTM builder: <https://ga-dev-tools.google.com/campaign-url-builder/>

---

## Notes

Treat Phase 1–3 as **blocking for launch**. Phase 4+ is the flywheel — execute consistently, not perfectly. AEO (Phase 6) compounds slowly; sites being cited in ChatGPT today published their cornerstone content 12–24 months ago. The fastest wins right now are: set `NEXT_PUBLIC_GA_ID`, verify GSC, and ping IndexNow after the next deploy.
