export const landingCopy = {
  hero: {
    badge: 'Built for E-commerce & Photography Professionals',
    headline: 'Stop wasting hours renaming images.',
    subheadline:
      'Turn messy files like IMG_2045.jpg into clean, professional names in seconds. Works with RAW files too.',
    bullets: [
      'Bulk rename hundreds of images instantly',
      'RAW file support (CR2, NEF, ARW, DNG, etc.)',
      'Auto-iteration presets for sequential naming',
    ],
    primaryCta: 'Try It Free',
    secondaryCta: 'See How It Works',
    reinforcement: 'Free for up to 20 images. Upgrade only when you need more.',
  },

  problem: {
    heading: 'If your product images look like this…',
    messyFiles: [
      'IMG_2045.jpg',
      'DSC_0892.png',
      'photo (3).jpeg',
      '20240115_143022.jpg',
    ],
    painPoints: [
      'Renaming files one by one',
      'Losing track of which image is which',
      'Uploading messy assets to your store',
      'Wasting hours on manual work',
    ],
    punchline: "This isn't a \"you\" problem. It's a tooling problem.",
  },

  solution: {
    heading: 'AssetFlow fixes it in under 30 seconds.',
    body: 'Upload your images. Assign labels. Download perfectly named files.',
    reinforcement: 'No spreadsheets. No manual work. No headaches.',
  },

  howItWorks: {
    heading: 'How it works',
    subheading: 'From messy uploads to clean filenames in three simple steps.',
    steps: [
      {
        number: '01',
        title: 'Upload',
        description: 'Drag and drop your product images',
      },
      {
        number: '02',
        title: 'Label',
        description: 'Assign clear descriptors like front, angle, or zoom',
      },
      {
        number: '03',
        title: 'Download',
        description: 'Export perfectly named, store-ready files in one ZIP',
      },
    ],
  },

  features: {
    heading: 'Built for real workflows, not generic tools.',
    subheading: 'Everything you need to rename images professionally — from e-commerce to photography',
    items: [
      {
        title: 'Smart Descriptor Locking',
        description: 'Never assign the same label twice by mistake',
      },
      {
        title: 'RAW File Support',
        description: 'Upload CR2, NEF, ARW, DNG and other RAW formats — previews extracted automatically',
      },
      {
        title: 'Auto-Iteration Presets',
        description: 'Sequential numbering (01, 02, 03) or alphabetic (A, B, C) for fast batch naming',
      },
      {
        title: 'Instant Preview',
        description: 'See final filenames update in real time',
      },
      {
        title: 'Bulk Operations',
        description: 'Process hundreds of images in a single session',
      },
      {
        title: 'No Signup Required',
        description: 'Start using immediately — no account needed',
      },
    ],
  },

  audience: {
    heading: 'Perfect for teams of one.',
    subheading:
      'Whether you run a store, shoot weddings, or manage client assets, AssetFlow keeps your files clean and consistent.',
    personas: [
      {
        title: 'Shopify store owners',
        description: 'SKU-based naming for product listings — keeps your store organized and professional',
      },
      {
        title: 'Etsy sellers',
        description: 'Streamline your photo workflow for faster listings with smart descriptors',
      },
      {
        title: 'Product photographers',
        description: 'Deliver clean, sequentially-named assets to clients — works with RAW files',
      },
      {
        title: 'Freelancers',
        description: 'Auto-iteration naming for shoots, projects, or client deliverables',
      },
    ],
    reinforcement: 'E-commerce or photography — this tool adapts to your workflow.',
  },

  pricing: {
    heading: 'Start free. Upgrade when you need more.',
    subheading: 'Simple pricing that grows with you',
    reinforcement: 'Most users upgrade after their first batch.',
    tiers: {
      free: {
        name: 'Free',
        price: '$0',
        description: 'Free forever',
        features: [
          'Up to 20 images per session',
          'RAW file support (preview extraction)',
          'Auto-iteration presets (01, 02, A, B, etc.)',
          'SKU-based or sequential naming',
          'Drag-and-drop upload',
          'ZIP export',
        ],
        cta: 'Try It Free',
      },
      pro: {
        name: 'Pro',
        price: '$9',
        priceSubtext: '/month',
        description: 'Coming Soon',
        badge: 'Most Popular',
        features: [
          'Everything in Free',
          'Unlimited images',
          'Save naming templates',
          'Faster repeat workflows',
          'Access to future premium features',
        ],
        cta: 'Coming Soon',
      },
    },
  },

  finalCta: {
    heading: 'Stop renaming files manually.',
    subheading: 'Start organizing your product images the right way.',
    primaryCta: 'Try AssetFlow Free',
    secondaryCta: 'View Pricing',
  },
} as const
