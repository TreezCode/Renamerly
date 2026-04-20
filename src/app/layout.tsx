import type { Metadata } from "next"
import Script from "next/script"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { ConditionalLayout } from "@/components/layout/ConditionalLayout"
import { ToastProvider } from "@/components/ui/ToastProvider"
import { SkipToContent } from "@/components/ui/SkipToContent"
import "./globals.css"

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
})

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.VERCEL_ENV === 'production'
      ? 'https://renamerly.com'
      : process.env.VERCEL_URL
      ? `https://${process.env.VERCEL_URL}`
      : process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  ),
  title: {
    default: "Renamerly — Product Image Renaming Tool | Build With Treez",
    template: "%s | Renamerly",
  },
  description:
    "Transform messy product image filenames into organized, SEO-friendly names in seconds. Batch rename photos for your Shopify or Etsy store with zero learning curve.",
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/brand/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/brand/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
    ],
    apple: [
      { url: '/brand/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
    other: [
      {
        rel: 'android-chrome-192x192',
        url: '/brand/android-chrome-192x192.png',
      },
      {
        rel: 'android-chrome-512x512',
        url: '/brand/android-chrome-512x512.png',
      },
    ],
  },
  manifest: '/site.webmanifest',
  keywords: [
    "image renaming",
    "product images",
    "e-commerce",
    "Shopify",
    "Etsy",
    "batch rename",
    "file organization",
    "product photography",
    "image management",
  ],
  authors: [{ name: "Build With Treez" }],
  creator: "Build With Treez",
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "/",
    siteName: "Renamerly",
    title: "Renamerly — Product Image Renaming Tool",
    description:
      "Transform product images into e-commerce ready files in seconds. No signup required.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "Renamerly - Product Image Renaming Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Renamerly — Product Image Renaming Tool",
    description:
      "Transform product images into e-commerce ready files in seconds.",
    images: ["/opengraph-image"],
    creator: "@buildwithtreez",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  const siteUrl = "https://renamerly.com"

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": "https://buildwithtreez.com/#organization",
        "name": "Build With Treez",
        "url": "https://buildwithtreez.com",
        "logo": `${siteUrl}/brand/android-chrome-512x512.png`,
        "sameAs": [
          "https://twitter.com/buildwithtreez",
          "https://www.linkedin.com/company/build-with-treez/",
          "https://github.com/TreezCode",
          "https://www.youtube.com/@buildwithtreez",
        ],
      },
      {
        "@type": "WebSite",
        "@id": `${siteUrl}/#website`,
        "url": siteUrl,
        "name": "Renamerly",
        "publisher": { "@id": "https://buildwithtreez.com/#organization" },
        "inLanguage": "en-US",
      },
      {
        "@type": "SoftwareApplication",
        "@id": `${siteUrl}/#software`,
        "name": "Renamerly",
        "url": siteUrl,
        "applicationCategory": "UtilitiesApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD",
        },
        "description":
          "Transform product images into e-commerce ready files in seconds. Batch rename and organize your product photos with Renamerly.",
        "author": { "@id": "https://buildwithtreez.com/#organization" },
        "publisher": { "@id": "https://buildwithtreez.com/#organization" },
        "screenshot": `${siteUrl}/opengraph-image`,
      },
    ],
  }

  const gaId = process.env.NEXT_PUBLIC_GA_ID

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <link
          rel="preload"
          href="/_next/static/media/0c89a48fa5027cee-s.p.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <SkipToContent />
        <ConditionalLayout>{children}</ConditionalLayout>
        <ToastProvider />
        <Analytics />
        {gaId && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
              strategy="afterInteractive"
            />
            <Script id="ga4-init" strategy="afterInteractive">
              {`
                window.dataLayer = window.dataLayer || [];
                function gtag(){dataLayer.push(arguments);}
                gtag('js', new Date());
                gtag('config', '${gaId}', { send_page_view: true });
              `}
            </Script>
          </>
        )}
      </body>
    </html>
  )
}
