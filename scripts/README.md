# scripts/

Repository-local tooling. These are not published npm packages — they're small, self-contained Node scripts that extend `npm run …` workflows.

## `lighthouse-audit.mjs`

Readable Lighthouse audit runner. Wraps `npx lighthouse` so you get:

- Clean CLI summary (scores, Core Web Vitals, top opportunities)
- Drill-down detail for common failures (console errors, color contrast, unsized images, unused JS, redirects, etc.)
- HTML + JSON reports saved to `.lighthouse/` (gitignored) for deeper exploration

### Quick start

```powershell
# Desktop audit of one or more URLs
npm run audit:lighthouse -- https://renamerly.com/ https://renamerly.com/pricing

# Mobile (what Google uses for ranking)
npm run audit:lighthouse:mobile -- https://renamerly.com/

# Parse an existing JSON report without re-running
node scripts/lighthouse-audit.mjs --parse-only ./.lighthouse/home.report.json
```

### All flags

```
--preset=desktop|mobile   Lighthouse form factor (default: desktop)
--out-dir=<path>          Where to write reports (default: ./.lighthouse)
--parse-only              Skip running; parse existing JSON paths
--no-html                 Skip HTML report output (JSON only)
--no-quiet                Show Lighthouse's own progress output
```

### Why this exists

Lighthouse CLI ships three native output formats — `html` (interactive report, browser-only), `json` (raw, unreadable in terminal), and `csv` (flat rows, also unreadable). There is no built-in human-readable terminal summary. `lighthouse-ci` exists but is scoped to CI budget enforcement, not local auditing.

This script fills that gap and is reusable on any project by copying the file and adding the `package.json` scripts.

### Output destination

Reports go to `./.lighthouse/<slug>.report.{html,json}` by default. Slugs are derived from the URL path (`/` → `home`, `/pricing` → `pricing`, etc.). The `.lighthouse/` directory is gitignored.

### CI note

If you want threshold enforcement in CI (e.g., fail the build if Performance drops below 90), use [`@lhci/cli`](https://github.com/GoogleChrome/lighthouse-ci) alongside this script — the two don't conflict.
