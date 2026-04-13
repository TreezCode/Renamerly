import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'Renamify - Product Image Renaming Tool'
export const size = {
  width: 1200,
  height: 630,
}
export const contentType = 'image/png'

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a2e 100%)',
          position: 'relative',
        }}
      >
        {/* Sacred Geometry - Subtle geometric pattern overlay */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            opacity: 0.03,
            backgroundImage: `repeating-linear-gradient(0deg, #915eff 0px, #915eff 1px, transparent 1px, transparent 60px),
                              repeating-linear-gradient(90deg, #915eff 0px, #915eff 1px, transparent 1px, transparent 60px)`,
          }}
        />

        {/* Brand Gradient Background - Cosmic purple and cyan */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(145, 94, 255, 0.25) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 50%, rgba(0, 212, 255, 0.2) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 50% 20%, rgba(255, 107, 157, 0.1) 0%, transparent 40%)',
          }}
        />

        {/* Geometric Corner Accents */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            right: 0,
            width: 200,
            height: 200,
            opacity: 0.1,
            borderLeft: '2px solid #915eff',
            borderBottom: '2px solid #00d4ff',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            width: 200,
            height: 200,
            opacity: 0.1,
            borderRight: '2px solid #00d4ff',
            borderTop: '2px solid #ff6b9d',
          }}
        />

        {/* Content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '80px',
          }}
        >
          {/* Logo/Title with subtle glow effect */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              marginBottom: 24,
            }}
          >
            <div
              style={{
                fontSize: 96,
                fontWeight: 'bold',
                background: 'linear-gradient(135deg, #915eff 0%, #00d4ff 50%, #ff6b9d 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                letterSpacing: '-0.02em',
                filter: 'drop-shadow(0 0 40px rgba(145, 94, 255, 0.5))',
              }}
            >
              Renamify
            </div>
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 32,
              color: '#d0d0d0',
              textAlign: 'center',
              maxWidth: 850,
              lineHeight: 1.5,
              marginBottom: 16,
            }}
          >
            Transform product images into e-commerce ready files in seconds
          </div>

          {/* Feature highlights */}
          <div
            style={{
              display: 'flex',
              gap: 32,
              fontSize: 18,
              color: '#808080',
              marginTop: 24,
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff' }} />
              <span>SKU-Based Workflow</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff' }} />
              <span>Bulk Operations</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#00d4ff' }} />
              <span>Privacy First</span>
            </div>
          </div>

          {/* Build With Treez Badge */}
          <div
            style={{
              marginTop: 56,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '12px 28px',
              background: 'rgba(145, 94, 255, 0.15)',
              border: '1px solid rgba(145, 94, 255, 0.4)',
              borderRadius: 999,
              boxShadow: '0 0 30px rgba(145, 94, 255, 0.3)',
            }}
          >
            <div
              style={{
                width: 8,
                height: 8,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #915eff 0%, #00d4ff 100%)',
                boxShadow: '0 0 10px rgba(0, 212, 255, 0.6)',
              }}
            />
            <div
              style={{
                fontSize: 20,
                background: 'linear-gradient(90deg, #00d4ff 0%, #915eff 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                color: 'transparent',
                fontWeight: 600,
                letterSpacing: '0.05em',
              }}
            >
              BUILD WITH TREEZ
            </div>
          </div>
        </div>

        {/* Bottom Accent */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 4,
            background: 'linear-gradient(90deg, #915eff 0%, #00d4ff 50%, #ff6b9d 100%)',
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  )
}
