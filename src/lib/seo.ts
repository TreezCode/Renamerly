export type SeoGrade = 'good' | 'improve' | 'poor'

export interface SeoScore {
  score: number
  grade: SeoGrade
  label: string
  tips: string[]
}

const GENERIC_PREFIXES = [
  'img', 'image', 'photo', 'dsc', 'dscn', 'dsc0',
  'file', 'picture', 'pic', 'scan', 'shot', 'capture',
]

/**
 * Scores a fully-resolved filename for SEO quality.
 * Input: e.g. "nike-air-001-front.jpg"
 * Output: score 0-100, grade, label, and improvement tips.
 */
export function scoreSeoFilename(resolvedFilename: string): SeoScore {
  if (!resolvedFilename) {
    return { score: 0, grade: 'poor', label: 'Needs Work', tips: ['Assign a SKU and descriptor'] }
  }

  const withoutExt = resolvedFilename.replace(/\.[^.]+$/, '')
  const tips: string[] = []
  let score = 0

  // ── Factor 1: Length (0–30 pts) ──────────────────────────────────────────
  // Optimal: 20–60 chars without extension
  const len = withoutExt.length
  if (len >= 20 && len <= 60) {
    score += 30
  } else if ((len >= 10 && len < 20) || (len > 60 && len <= 80)) {
    score += 20
  } else if (len >= 5 && len < 10) {
    score += 10
    tips.push('Filename is short — a more descriptive SKU will improve ranking')
  } else if (len > 80) {
    score += 10
    tips.push('Filename is very long — consider a shorter SKU')
  } else {
    tips.push('Filename is too short to be meaningful for search engines')
  }

  // ── Factor 2: Hyphen separators (0–20 pts) ────────────────────────────────
  const hasHyphens = withoutExt.includes('-')
  const hasUnderscores = withoutExt.includes('_')
  const hasSpaces = withoutExt.includes(' ')

  if (hasHyphens && !hasUnderscores && !hasSpaces) {
    score += 20
  } else if (hasUnderscores) {
    score += 8
    tips.push('Use hyphens (-) instead of underscores — Google treats hyphens as word separators')
  } else if (!hasHyphens) {
    tips.push('Separate words with hyphens for better SEO (e.g. nike-air-front)')
  }

  // ── Factor 3: Meaningful alphabetic content (0–25 pts) ───────────────────
  const letters = withoutExt.replace(/[^a-z]/gi, '')
  if (letters.length >= 6) {
    score += 25
  } else if (letters.length >= 3) {
    score += 15
    tips.push('Add more descriptive text to your SKU — avoid purely numeric identifiers')
  } else if (letters.length >= 1) {
    score += 5
    tips.push('Filename is mostly numeric — search engines prefer descriptive product names')
  } else {
    tips.push('Filename has no text content — extremely poor for SEO')
  }

  // ── Factor 4: Not a generic/placeholder name (0–25 pts) ──────────────────
  const parts = withoutExt.toLowerCase().split(/[-_]/)
  const firstPart = parts[0] ?? ''
  const isGeneric = GENERIC_PREFIXES.some(
    (prefix) => firstPart === prefix || firstPart.startsWith(prefix)
  )

  if (!isGeneric) {
    score += 25
  } else {
    tips.push('Replace generic prefix (e.g. "img", "photo") with your product name or SKU')
  }

  // ── Grade ─────────────────────────────────────────────────────────────────
  let grade: SeoGrade
  let label: string

  if (score >= 76) {
    grade = 'good'
    label = 'SEO Good'
  } else if (score >= 51) {
    grade = 'improve'
    label = 'Could Improve'
  } else {
    grade = 'poor'
    label = 'Needs Work'
  }

  return { score, grade, label, tips }
}
