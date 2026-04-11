import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const alt = 'AssetFlow - Product Image Renaming Tool'
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
        {/* Brand Gradient Background */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 30% 50%, rgba(145, 94, 255, 0.2) 0%, transparent 50%)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(circle at 70% 50%, rgba(0, 212, 255, 0.15) 0%, transparent 50%)',
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
          {/* Logo/Title */}
          <div
            style={{
              fontSize: 84,
              fontWeight: 'bold',
              background: 'linear-gradient(135deg, #915eff 0%, #00d4ff 50%, #ff6b9d 100%)',
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              color: 'transparent',
              marginBottom: 32,
            }}
          >
            AssetFlow
          </div>

          {/* Tagline */}
          <div
            style={{
              fontSize: 36,
              color: '#b0b0b0',
              textAlign: 'center',
              maxWidth: 900,
              lineHeight: 1.4,
            }}
          >
            Transform product images into e-commerce ready files in seconds
          </div>

          {/* Tech Badge */}
          <div
            style={{
              marginTop: 48,
              display: 'flex',
              alignItems: 'center',
              gap: 12,
              padding: '16px 32px',
              background: 'rgba(145, 94, 255, 0.1)',
              border: '2px solid rgba(145, 94, 255, 0.3)',
              borderRadius: 999,
            }}
          >
            <div
              style={{
                width: 12,
                height: 12,
                borderRadius: '50%',
                background: '#00d4ff',
              }}
            />
            <div
              style={{
                fontSize: 24,
                color: '#00d4ff',
                fontWeight: 600,
              }}
            >
              Build With Treez
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
