import type { Config } from 'tailwindcss'

// "Sharpen House Style": the warm editorial brand, cooled and squared off for an
// enterprise-tool feel. Cool near-white neutrals + hairlines + one restrained
// accent (oxblood), serif wordmark retained.
const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#111111',
        canvas: '#F6F6F4', // cool off-white page
        surface: '#FFFFFF',
        line: '#E3E3E0', // cool hairline
        muted: '#6B6B66',
        faint: '#9A9A94',
        accent: '#8A2B1E', // oxblood — the single accent, kept from House Style
        'accent-tint': '#F3E4E0',
      },
      fontFamily: {
        serif: ['var(--font-fraunces)', 'Georgia', 'ui-serif', 'serif'],
        sans: ['var(--font-inter)', 'ui-sans-serif', 'system-ui', 'sans-serif'],
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
