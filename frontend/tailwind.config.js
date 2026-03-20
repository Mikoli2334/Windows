/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#f0f7ff',
          100: '#e0efff',
          200: '#b9dfff',
          300: '#7cc4ff',
          400: '#36a5ff',
          500: '#0c87f2',
          600: '#006acf',
          700: '#0054a7',
          800: '#05478a',
          900: '#0a3c72',
          950: '#07264b',
        },
        warm: {
          50: '#fdf8f0',
          100: '#faecd8',
          200: '#f4d5af',
          300: '#edb97d',
          400: '#e59549',
          500: '#df7b2a',
          600: '#d06320',
          700: '#ad4b1c',
          800: '#8a3d1e',
          900: '#70331b',
        },
        glass: {
          light: 'rgba(255,255,255,0.15)',
          medium: 'rgba(255,255,255,0.25)',
          heavy: 'rgba(255,255,255,0.4)',
        }
      },
      fontFamily: {
        display: ['Unbounded', 'sans-serif'],
        body: ['Onest', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'shimmer': 'shimmer 2s linear infinite',
        'slide-up': 'slideUp 0.6s ease-out',
        'fade-in': 'fadeIn 0.8s ease-out',
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-20px)' },
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(30px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
    },
  },
  plugins: [],
};
