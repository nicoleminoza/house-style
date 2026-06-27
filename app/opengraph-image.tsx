import { ImageResponse } from 'next/og'

export const alt =
  'House Style. AI prompts for marketing, brand, and product leaders.'
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
          background: '#faf6f1',
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
              background: '#6b2c41',
              color: '#faf6f1',
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
              color: '#241f1d',
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
            color: '#5d534c',
          }}
        >
          Prompts with a point of view.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '14px',
            fontSize: '32px',
            color: '#5d534c',
            maxWidth: '900px',
          }}
        >
          AI prompts for marketing, brand, and product leaders.
        </div>
        <div
          style={{
            display: 'flex',
            marginTop: '48px',
            fontSize: '26px',
            color: '#6b2c41',
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
