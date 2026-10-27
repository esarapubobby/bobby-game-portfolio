/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: '#0a0d0f',
          subtle: '#0f1418',
          card: '#131920',
          hover: '#18212b',
        },
        border: {
          DEFAULT: 'rgba(255, 255, 255, 0.08)',
          strong: 'rgba(255, 255, 255, 0.16)',
          accent: 'rgb(var(--accent-rgb, 163 230 53) / 0.3)',
        },
        accent: {
          DEFAULT: 'rgb(var(--accent-rgb, 163 230 53) / <alpha-value>)',
          hover: 'rgb(var(--accent-hover-rgb, 190 242 100) / <alpha-value>)',
          glow: 'var(--accent-glow, rgba(163, 230, 53, 0.25))',
          muted: 'var(--accent-muted, rgba(163, 230, 53, 0.15))',
        },
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Fira Code', 'Consolas', 'monospace'],
        display: ['Outfit', 'Inter', 'sans-serif'],
      },
      animation: {
        'pulse-subtle': 'pulseSubtle 3s ease-in-out infinite',
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 4s ease-in-out infinite',
      },
      keyframes: {
        pulseSubtle: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-6px)' },
        },
        glow: {
          '0%, 100%': { opacity: '0.4' },
          '50%': { opacity: '0.8' },
        },
      },
      backgroundImage: {
        'grid-pattern': "radial-gradient(rgba(255, 255, 255, 0.07) 1px, transparent 1px)",
        'radial-vignette': "radial-gradient(circle at center, transparent 40%, #0a0d0f 95%)",
      },
    },
  },
  plugins: [],
}
