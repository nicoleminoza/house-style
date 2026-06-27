import { ImageResponse } from 'next/og'

export const alt =
  'House Style. Curated AI prompts for marketing, brand, and product leaders.'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

// 1200x630 social share image, rendered from the brand palette.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          background: '#F6F6F4',
          padding: '90px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '28px' }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              width: '108px',
              height: '108px',
              borderRadius: '22px',
              background: '#6B2C41',
              color: '#FAF6F1',
              fontSize: '78px',
              fontWeight: 700,
              fontFamily: 'Georgia, serif',
            }}
          >
            H
          </div>
          <div
            style={{
              display: 'flex',
              fontSize: '76px',
              fontWeight: 600,
              color: '#111111',
              fontFamily: 'Georgia, serif',
              letterSpacing: '-0.02em',
            }}
          >
            House Style
          </div>
        </div>

        <div
          style={{
            display: 'flex',
            marginTop: '40px',
            fontSize: '40px',
            color: '#6B6B66',
          }}
        >
          Prompts with a point of view.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '14px',
            fontSize: '32px',
            color: '#6B6B66',
            maxWidth: '900px',
          }}
        >
          Curated AI prompts for marketing, brand, and product leaders.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '48px',
            fontSize: '26px',
            color: '#8A2B1E',
            fontWeight: 500,
          }}
        >
          Curation is the product.
        </div>
      </div>
    ),
    { ...size },
  )
}
