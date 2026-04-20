import type { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.VERCEL_ENV === 'production'
      ? 'https://renamerly.com'
      : process.env.NEXT_PUBLIC_SITE_URL ||
        (process.env.VERCEL_URL
          ? `https://${process.env.VERCEL_URL}`
          : 'http://localhost:3000')
  
  // Explicit AI crawler rules. We allow retrieval + citation bots so Renamerly
  // can surface in ChatGPT / Perplexity / Google AI Overviews / Claude answers.
  // Training-only bots (GPTBot, Google-Extended, ClaudeBot) are also allowed —
  // flip any of them to `disallow: '/'` if you want to opt out of model training.
  const aiCrawlers = [
    'GPTBot',
    'OAI-SearchBot',
    'ChatGPT-User',
    'PerplexityBot',
    'Perplexity-User',
    'Google-Extended',
    'ClaudeBot',
    'anthropic-ai',
    'Claude-Web',
    'Applebot-Extended',
    'CCBot',
    'Bytespider',
    'Amazonbot',
  ]

  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/auth/'],
      },
      ...aiCrawlers.map((userAgent) => ({
        userAgent,
        allow: '/',
        disallow: ['/api/', '/dashboard/', '/auth/'],
      })),
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  }
}
