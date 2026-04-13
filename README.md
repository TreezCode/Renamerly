<div align="center">
  <img src="public/brand/logo-full.webp" alt="Renamify Logo" width="400" />
  
  # Renamify
  
  **Transform messy product images into organized, SEO-friendly files in seconds**
  
  [![License: Proprietary](https://img.shields.io/badge/License-Proprietary-purple.svg)](LICENSE)
  [![Next.js](https://img.shields.io/badge/Next.js-16.2-black)](https://nextjs.org/)
  [![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)](https://www.typescriptlang.org/)
  [![Build With Treez](https://img.shields.io/badge/Build_With-Treez-7C3AED)](https://buildwithtreez.com)
  
  [Live Demo](https://renamify.app) · [Report Bug](https://github.com/TreezCode/Renamify/issues) · [Request Feature](https://github.com/TreezCode/Renamify/issues)
</div>

---

## ✨ Overview

Renamify is a powerful, browser-based tool designed for e-commerce professionals who need to organize and rename product images efficiently. Built for Shopify, Etsy, and other online store owners, Renamify transforms chaotic product photo filenames into clean, consistent, SEO-optimized names — all without leaving your browser.

### **Why Renamify?**

- 🚀 **Zero Learning Curve** — Drag, drop, done. No tutorials needed.
- 🔒 **Privacy First** — All processing happens in your browser. Your images never leave your device.
- 📸 **RAW File Support** — Works with DNG, NEF, ARW, and other professional camera formats.
- ⚡ **Instant Preview** — See final filenames update in real-time as you type.
- 🎯 **Smart Descriptors** — Lock position-based descriptors like "front", "back", "angle".
- 🔄 **Auto-Iteration** — Sequential numbering (01, 02, 03) or alphabetic (A, B, C) patterns.
- 📦 **One-Click Export** — Download all renamed files as a perfectly organized ZIP.

---

## 🎬 Quick Start

### **Prerequisites**

- Node.js 18+ and npm (or yarn/pnpm)
- Modern browser with JavaScript enabled

### **Installation**

```bash
# Clone the repository
git clone https://github.com/TreezCode/Renamify.git

# Navigate to project directory
cd Renamify

# Install dependencies
npm install

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see Renamify in action.

### **Build for Production**

```bash
npm run build
npm run start
```

---

## 🛠️ Tech Stack

### **Core**
- **[Next.js 16.2](https://nextjs.org/)** — React framework with App Router
- **[TypeScript](https://www.typescriptlang.org/)** — Type-safe development
- **[Tailwind CSS](https://tailwindcss.com/)** — Utility-first styling
- **[Framer Motion](https://www.framer.com/motion/)** — Smooth animations

### **Image Processing**
- **[JSZip](https://stuk.github.io/jszip/)** — Client-side ZIP creation
- **[exifr](https://github.com/MikeKovarik/exifr)** — RAW file metadata extraction
- **Canvas API** — Real-time image previews

### **State & UI**
- **[Zustand](https://github.com/pmndrs/zustand)** — Lightweight state management
- **[Lucide React](https://lucide.dev/)** — Beautiful icons
- **Custom Design System** — Sacred geometry + glass morphism

---

## 🎨 Features in Detail

### **1. Smart Descriptor Locking**
Position-aware descriptors that never assign the same label twice in a batch. Perfect for product photography workflows (front, back, side, detail).

### **2. RAW File Support**
Upload DNG, NEF, ARW, and other RAW formats. Renamify extracts embedded JPEG previews automatically.

### **3. Auto-Iteration Presets**
Choose your naming pattern:
- **Sequential**: `(01, 02, 03)` or `(001, 002, 003)`
- **Alphabetic**: `(A, B, C)` or lowercase `(a, b, c)`

### **4. Bulk Operations**
Process hundreds of images in a single session. Assign SKUs, rename in bulk, and export everything at once.

### **5. No Signup Required**
Start using Renamify immediately. No account, no email, no friction.

---

## 📁 Project Structure

```
Renamify/
├── src/
│   ├── app/                  # Next.js App Router pages
│   │   ├── page.tsx         # Landing page
│   │   ├── app/             # Main app page
│   │   ├── layout.tsx       # Root layout + metadata
│   │   └── globals.css      # Global styles + design tokens
│   ├── components/
│   │   ├── app/             # App-specific components
│   │   ├── landing/         # Landing page sections
│   │   ├── layout/          # Header, Footer
│   │   └── ui/              # Reusable UI components
│   ├── stores/              # Zustand state stores
│   ├── lib/                 # Utilities + processors
│   └── types/               # TypeScript definitions
├── public/
│   ├── brand/               # Logos + favicons
│   └── site.webmanifest     # PWA manifest
└── docs/                    # Documentation + guides
```

---

## 🚀 Deployment

Renamify is optimized for deployment on [Vercel](https://vercel.com):

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

**Environment Variables** (optional):
- `NEXT_PUBLIC_GA_ID` — Google Analytics tracking ID
- `NEXT_PUBLIC_DOMAIN` — Production domain (defaults to renamify.app)

---

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is **proprietary software**. All rights reserved by Build With Treez. See the [LICENSE](LICENSE) file for details.

Unauthorized copying, distribution, or use is strictly prohibited.

---

## 🌟 Acknowledgments

- **Design Inspiration**: Sacred geometry meets modern web design
- **Build With Treez**: [buildwithtreez.com](https://buildwithtreez.com)
- **Community**: Thank you to all contributors and users!

---

<div align="center">
  <p><strong>Built with ♥ by <a href="https://buildwithtreez.com">Build With Treez</a></strong></p>
  <p><em>Where Sacred Geometry Meets Modern Technology</em></p>
</div>
