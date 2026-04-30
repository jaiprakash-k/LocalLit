export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Librarian Luxe palette
        primary: {
          DEFAULT: '#7A4F1E',
          50:  '#FDF8F0',
          100: '#F8EBDA',
          200: '#F0D5B0',
          300: '#E4B878',
          400: '#C4893A',
          500: '#7A4F1E',
          600: '#5E3B14',
          700: '#462C0F',
          800: '#2E1D0A',
          900: '#1A1006',
        },
        background: '#FAF6EE',
        surface: '#FFFCF5',
        accent: {
          DEFAULT: '#2A6B5C',
          50:  '#EDF7F4',
          100: '#D0EDE5',
          200: '#A3D9CC',
          300: '#6DBFAD',
          400: '#3D9A87',
          500: '#2A6B5C',
          600: '#205549',
          700: '#174038',
          800: '#0F2C26',
          900: '#081916',
        },
        muted: '#8C7B6A',
        danger: {
          DEFAULT: '#C44B2B',
          50:  '#FDF2EE',
          100: '#F9DDD4',
          200: '#F0B5A3',
          300: '#E4886D',
          400: '#D66843',
          500: '#C44B2B',
          600: '#9C3C23',
          700: '#752D1A',
        },
        // Book condition colors
        condition: {
          excellent: '#2A7D4F',
          good: '#B8860B',
          fair: '#D97652',
          poor: '#C44B2B',
        },
      },
      fontFamily: {
        display: ['"Playfair Display"', 'Georgia', 'serif'],
        sans: ['"DM Sans"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      borderRadius: {
        'sm': '4px',
        'DEFAULT': '6px',
        'md': '8px',
        'lg': '12px',
        'xl': '16px',
      },
      boxShadow: {
        'card': '0 1px 3px rgba(122, 79, 30, 0.06)',
        'card-hover': '0 4px 12px rgba(122, 79, 30, 0.1)',
        'dropdown': '0 4px 16px rgba(122, 79, 30, 0.12)',
        'page': '4px 0 8px rgba(0, 0, 0, 0.06)',
      },
      animation: {
        'fade-in': 'fadeIn 0.5s ease-out',
        'slide-up': 'slideUp 0.5s ease-out',
        'scale-in': 'scaleIn 0.3s ease-out',
        'marquee': 'marquee 30s linear infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
      },
    },
  },
  plugins: [],
}
