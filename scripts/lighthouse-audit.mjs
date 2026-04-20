#!/usr/bin/env node
/**
 * Readable Lighthouse audit tool.
 *
 * Runs Lighthouse against one or more URLs and prints a human-readable summary
 * of scores, Core Web Vitals, top opportunities, and failed audits with
 * actionable detail. Saves HTML + JSON reports to `.lighthouse/` by default.
 *
 * Usage:
 *   node scripts/lighthouse-audit.mjs <url> [<url>...]
 *   node scripts/lighthouse-audit.mjs --preset=mobile https://renamerly.com
 *   node scripts/lighthouse-audit.mjs --parse-only ./.lighthouse/home.report.json
 *   node scripts/lighthouse-audit.mjs --out-dir=./reports https://renamerly.com
 *
 * Flags:
 *   --preset=desktop|mobile   Lighthouse form factor (default: desktop)
 *   --out-dir=<path>          Where to write reports (default: ./.lighthouse)
 *   --parse-only              Skip running Lighthouse; parse existing JSON paths
 *   --quiet                   Only print summary (suppress Lighthouse output)
 *   --no-html                 Skip HTML report output
 */

import { spawn } from 'node:child_process'
import { mkdirSync, readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const args = process.argv.slice(2)
const flags = {
  preset: 'desktop',
  outDir: './.lighthouse',
  parseOnly: false,
  quiet: true,
  html: true,
}
const targets = []

for (const raw of args) {
  if (raw.startsWith('--preset=')) flags.preset = raw.slice('--preset='.length)
  else if (raw.startsWith('--out-dir=')) flags.outDir = raw.slice('--out-dir='.length)
  else if (raw === '--parse-only') flags.parseOnly = true
  else if (raw === '--no-quiet') flags.quiet = false
  else if (raw === '--quiet') flags.quiet = true
  else if (raw === '--no-html') flags.html = false
  else if (raw === '--help' || raw === '-h') {
    console.log(readFileSync(new URL(import.meta.url), 'utf8').split('\n').slice(2, 24).join('\n').replace(/^ \*\s?/gm, ''))
    process.exit(0)
  } else targets.push(raw)
}

if (!targets.length) {
  console.error('Usage: node scripts/lighthouse-audit.mjs <url> [<url>...]\n       --help for more')
  process.exit(1)
}

mkdirSync(flags.outDir, { recursive: true })

// ---------- slug helpers ----------
function slugFor(url) {
  try {
    const u = new URL(url)
    const path = u.pathname.replace(/\/$/, '') || '/home'
    return path.replace(/^\//, '').replace(/[^a-z0-9-]+/gi, '-').toLowerCase() || 'home'
  } catch {
    return url.replace(/[^a-z0-9-]+/gi, '-').toLowerCase()
  }
}

// ---------- run Lighthouse ----------
function runLighthouse(url, outBase) {
  return new Promise((resolvePromise, rejectPromise) => {
    const outputs = ['json']
    if (flags.html) outputs.push('html')
    const spawnArgs = [
      '-y',
      'lighthouse@latest',
      url,
      `--preset=${flags.preset}`,
      ...outputs.flatMap((o) => [`--output=${o}`]),
      `--output-path=${outBase}`,
      '--chrome-flags=--headless=new --no-sandbox',
    ]
    if (flags.quiet) spawnArgs.push('--quiet')

    const child = spawn('npx', spawnArgs, {
      stdio: flags.quiet ? ['ignore', 'ignore', 'inherit'] : 'inherit',
      shell: process.platform === 'win32',
    })
    child.on('error', rejectPromise)
    child.on('exit', (code) => {
      if (code === 0) resolvePromise()
      else rejectPromise(new Error(`Lighthouse exited with code ${code}`))
    })
  })
}

// ---------- formatting helpers ----------
const pad = (s, n) => String(s).padEnd(n)
const color = (code, s) => (process.stdout.isTTY ? `\x1b[${code}m${s}\x1b[0m` : s)
const scoreColor = (score) => {
  if (score == null) return color(90, 'n/a')
  const n = Math.round(score * 100)
  if (n >= 90) return color(32, n) // green
  if (n >= 50) return color(33, n) // yellow
  return color(31, n) // red
}

// ---------- report parser ----------
function parseAndPrint(jsonPath) {
  const r = JSON.parse(readFileSync(jsonPath, 'utf8'))
  const { categories: c, audits: a, finalDisplayedUrl, configSettings } = r

  console.log('\n' + color(1, '━'.repeat(78)))
  console.log(color(1, `  ${finalDisplayedUrl}`))
  console.log(color(90, `  form factor: ${configSettings?.formFactor ?? 'n/a'} · ${jsonPath}`))
  console.log(color(1, '━'.repeat(78)))

  console.log('\n' + color(1, 'SCORES'))
  for (const k of ['performance', 'accessibility', 'best-practices', 'seo']) {
    if (c[k]) console.log(`  ${pad(c[k].title, 20)} ${scoreColor(c[k].score)}`)
  }

  console.log('\n' + color(1, 'CORE WEB VITALS'))
  const vitals = [
    'first-contentful-paint',
    'largest-contentful-paint',
    'total-blocking-time',
    'cumulative-layout-shift',
    'speed-index',
    'interactive',
  ]
  for (const k of vitals) {
    if (a[k]) {
      console.log(
        `  ${pad(a[k].title, 32)} ${pad(a[k].displayValue ?? '', 12)} score ${scoreColor(a[k].score)}`,
      )
    }
  }

  // Opportunities
  const opps = Object.values(a)
    .filter(
      (x) =>
        x.details &&
        x.details.type === 'opportunity' &&
        typeof x.numericValue === 'number' &&
        x.numericValue > 0,
    )
    .sort((x, y) => y.numericValue - x.numericValue)
    .slice(0, 10)
  if (opps.length) {
    console.log('\n' + color(1, 'TOP OPPORTUNITIES'))
    for (const x of opps) {
      console.log(`  ${color(36, '→')} ${x.title} ${color(90, `(saves ~${Math.round(x.numericValue)}ms)`)}`)
    }
  }

  // Failed / needs-improvement audits + drill-down for common ones
  const fails = Object.values(a)
    .filter(
      (x) =>
        x.score !== null &&
        x.score !== undefined &&
        x.score < 0.9 &&
        x.scoreDisplayMode !== 'notApplicable' &&
        x.scoreDisplayMode !== 'informative' &&
        !(x.details && x.details.type === 'opportunity'),
    )
    .sort((x, y) => (x.score ?? 1) - (y.score ?? 1))

  if (fails.length) {
    console.log('\n' + color(1, 'FAILED / NEEDS IMPROVEMENT'))
    const drillIds = new Set([
      'errors-in-console',
      'color-contrast',
      'heading-order',
      'unsized-images',
      'render-blocking-resources',
      'unused-javascript',
      'redirects',
      'legacy-javascript',
      'bf-cache',
      'uses-responsive-images',
      'image-delivery',
      'csp-xss',
      'deprecations',
    ])
    for (const x of fails.slice(0, 20)) {
      const s = Math.round((x.score ?? 0) * 100)
      console.log(`  [${color(s < 50 ? 31 : 33, pad(s, 3))}] ${x.title}`)
      if (drillIds.has(x.id)) printItems(x)
    }
    if (fails.length > 20) console.log(color(90, `  … +${fails.length - 20} more`))
  }

  console.log()
}

function printItems(audit) {
  const items = audit.details?.items ?? []
  if (!items.length) return
  for (const it of items.slice(0, 5)) {
    const parts = []
    for (const k of ['source', 'description', 'url', 'node', 'snippet', 'wastedMs', 'wastedBytes']) {
      if (it[k] == null) continue
      if (k === 'node') {
        parts.push(`node: ${it.node.nodeLabel ?? it.node.selector ?? '?'}`)
      } else if (typeof it[k] === 'object') {
        parts.push(`${k}: ${JSON.stringify(it[k]).slice(0, 120)}`)
      } else {
        parts.push(`${k}: ${String(it[k]).slice(0, 160)}`)
      }
    }
    console.log(color(90, `         • ${parts.join(' | ')}`))
  }
  if (items.length > 5) console.log(color(90, `         … +${items.length - 5} more`))
}

// ---------- main ----------
async function main() {
  if (flags.parseOnly) {
    for (const p of targets) {
      const abs = resolve(p)
      if (!existsSync(abs)) {
        console.error(`Not found: ${abs}`)
        continue
      }
      parseAndPrint(abs)
    }
    return
  }

  for (const url of targets) {
    const slug = slugFor(url)
    // Lighthouse CLI appends `.report.<ext>` to --output-path, so pass the
    // bare base and reference the resulting file with the suffix.
    const base = resolve(flags.outDir, slug)
    console.log(color(36, `\n▶ Auditing ${url} (${flags.preset})…`))
    try {
      await runLighthouse(url, base)
    } catch (err) {
      console.error(color(31, `  ✗ ${err.message}`))
      continue
    }
    parseAndPrint(`${base}.report.json`)
  }

  console.log(color(90, `\nReports saved to ${resolve(flags.outDir)}`))
  if (flags.html) console.log(color(90, `Open the .html files in a browser for the full interactive report.`))
}

main().catch((e) => {
  console.error(e)
  process.exit(1)
})
