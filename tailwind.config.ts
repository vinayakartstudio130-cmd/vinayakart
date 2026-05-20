import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        saffron: {
          50:  '#fff8f0',
          100: '#ffefd6',
          200: '#ffd9a0',
          300: '#ffbe5e',
          400: '#ff9e1f',
          500: '#f08000',
          600: '#c96200',
          700: '#a04a00',
          800: '#7d3900',
          900: '#5c2a00',
        },
        ochre: {
          50:  '#fdf8ee',
          100: '#f9eec8',
          200: '#f2d988',
          300: '#e8bf46',
          400: '#d4a017',
          500: '#b8840d',
          600: '#966809',
          700: '#724e08',
          800: '#533909',
          900: '#3b280a',
        },
        stone: {
          50:  '#f7f5f2',
          100: '#ede9e2',
          200: '#d8d0c3',
          300: '#bfb29e',
          400: '#a49178',
          500: '#8c7660',
          600: '#6e5c4a',
          700: '#554639',
          800: '#3d322a',
          900: '#29211c',
        },
        temple: {
          50:  '#f9f8f6',
          100: '#f0ede7',
          200: '#ddd7cc',
          300: '#c4baaa',
          400: '#a99787',
          500: '#907e6d',
          600: '#75635a',
          700: '#5d4e46',
          800: '#453a35',
          900: '#302827',
        },
        gold: {
          50:  '#fffbeb',
          100: '#fef3c7',
          200: '#fde68a',
          300: '#fcd34d',
          400: '#fbbf24',
          500: '#f59e0b',
          600: '#d97706',
          700: '#b45309',
          800: '#92400e',
          900: '#78350f',
        },
        ivory: '#faf7f2',
        cream: '#f5f0e8',
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"Inter"', 'system-ui', 'sans-serif'],
        display: ['"Cormorant Garamond"', '"Playfair Display"', 'serif'],
      },
      backgroundImage: {
        'grain': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2.5s linear infinite',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '100': '25rem',
        '112': '28rem',
        '128': '32rem',
      },
      borderRadius: {
        '4xl': '2rem',
      },
      boxShadow: {
        'warm': '0 4px 24px -4px rgba(176, 120, 20, 0.18)',
        'warm-lg': '0 16px 48px -8px rgba(176, 120, 20, 0.28)',
        'card': '0 2px 20px rgba(0,0,0,0.08)',
        'card-hover': '0 12px 40px rgba(0,0,0,0.16)',
      },
    },
  },
  plugins: [],
}

export default config
