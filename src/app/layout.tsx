import type { Metadata } from "next"
import { Inter, Space_Grotesk } from "next/font/google"
import { Analytics } from "@vercel/analytics/react"
import { Header } from "@/components/layout/Header"
import { Footer } from "@/components/layout/Footer"
import { ToastProvider } from "@/components/ui/ToastProvider"
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
  metadataBase: new URL('https://assetflow.vercel.app'),
  title: {
    default: "AssetFlow — Product Image Renaming Tool | Build With Treez",
    template: "%s | AssetFlow",
  },
  description:
    "Stop wasting hours renaming product images. Convert unstructured files into clean, store-ready assets in seconds. No signup required. Perfect for Shopify, Etsy, and e-commerce sellers.",
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
    url: "https://assetflow.vercel.app",
    siteName: "AssetFlow",
    title: "AssetFlow — Product Image Renaming Tool",
    description:
      "Transform product images into e-commerce ready files in seconds. No signup required.",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: "AssetFlow - Product Image Renaming Tool",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "AssetFlow — Product Image Renaming Tool",
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
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "AssetFlow",
    "applicationCategory": "UtilitiesApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "description": "Transform product images into e-commerce ready files in seconds. Batch rename and organize your product photos with AssetFlow.",
    "author": {
      "@type": "Organization",
      "name": "Build With Treez",
      "url": "https://assetflow.vercel.app"
    },
    "screenshot": "https://assetflow.vercel.app/opengraph-image",
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "5",
      "ratingCount": "1"
    }
  }

  return (
    <html
      lang="en"
      className={`${inter.variable} ${spaceGrotesk.variable} h-full antialiased`}
    >
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="min-h-full flex flex-col font-sans">
        <Header />
        <main className="flex-1 pt-16">{children}</main>
        <Footer />
        <ToastProvider />
        <Analytics />
      </body>
    </html>
  )
}
