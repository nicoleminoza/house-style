import type { Config } from 'tailwindcss'

// House Style on Nicole's warm editorial brand system (nicoleminoza.com): warm
// paper neutrals + hairlines + plum as the single accent (matches the monogram),
// terra for mono eyebrows. Squared corners are the one deliberate sub-brand tell.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#241f1d',
        canvas: '#faf6f1', // warm paper page
        surface: '#fffdf9', // warm white
        line: '#e6dccf', // warm hairline
        muted: '#5d534c',
        faint: '#a99d90',
        accent: '#6b2c41', // plum, the single UI accent (matches the monogram)
        'accent-tint': '#f0e3e3',
        'accent-2': '#c07a44', // terra, for mono eyebrows / small accents
      },
      fontFamily: {
        serif: ['var(--font-newsreader)', 'Georgia', 'ui-serif', 'serif'],
        sans: [
          'var(--font-hanken)',
          'ui-sans-serif',
          'system-ui',
          'sans-serif',
        ],
        mono: ['var(--font-spline-mono)', 'ui-monospace', 'monospace'],
      },
      borderRadius: {
        // squarer than the Vite app — sharper lines
        DEFAULT: '4px',
        md: '6px',
        lg: '8px',
      },
      maxWidth: {
        shell: '78rem',
      },
    },
  },
  plugins: [],
}

export default config
