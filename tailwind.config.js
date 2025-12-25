/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: [
          '-apple-system',
          'BlinkMacSystemFont',
          'SF Pro Display',
          'SF Pro Text',
          'Inter',
          'Segoe UI',
          'Roboto',
          'sans-serif',
        ],
      },
      colors: {
        // macOS Sonoma-inspired palette
        macos: {
          gray: {
            50: '#f5f5f7',
            100: '#e8e8ed',
            200: '#d2d2d7',
            300: '#b4b4bb',
            400: '#86868b',
            500: '#6e6e73',
            600: '#515154',
            700: '#3a3a3c',
            800: '#2c2c2e',
            900: '#1d1d1f',
          },
          blue: {
            DEFAULT: '#007AFF',
            light: '#409CFF',
            dark: '#0A84FF',
          },
          purple: '#BF5AF2',
          pink: '#FF375F',
          orange: '#FF9F0A',
          yellow: '#FFD60A',
          green: '#30D158',
          teal: '#64D2FF',
          red: '#FF453A',
        },
      },
      backdropBlur: {
        xs: '2px',
        '2xl': '40px',
        '3xl': '64px',
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.12)',
        'glass-lg': '0 12px 48px 0 rgba(0, 0, 0, 0.15)',
        'glass-dark': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'macos': '0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 2px 8px rgba(0, 0, 0, 0.12)',
        'macos-lg': '0 0 0 0.5px rgba(0, 0, 0, 0.1), 0 4px 16px rgba(0, 0, 0, 0.16)',
        'macos-hover': '0 0 0 0.5px rgba(0, 0, 0, 0.15), 0 6px 20px rgba(0, 0, 0, 0.2)',
        'inner-light': 'inset 0 1px 0 0 rgba(255, 255, 255, 0.1)',
      },
      borderRadius: {
        'macos': '10px',
        'macos-lg': '14px',
        'macos-xl': '20px',
        'macos-2xl': '28px',
      },
      animation: {
        'fade-in': 'fadeIn 0.3s ease-out',
        'fade-in-up': 'fadeInUp 0.4s ease-out',
        'slide-up': 'slideUp 0.3s ease-out',
        'slide-down': 'slideDown 0.3s ease-out',
        'scale-in': 'scaleIn 0.2s ease-out',
        'blur-in': 'blurIn 0.4s ease-out',
        'pulse-slow': 'pulse 3s ease-in-out infinite',
        'spin-slow': 'spin 8s linear infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(20px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        slideDown: {
          '0%': { opacity: '0', transform: 'translateY(-10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        blurIn: {
          '0%': { opacity: '0', filter: 'blur(10px)' },
          '100%': { opacity: '1', filter: 'blur(0)' },
        },
      },
      transitionTimingFunction: {
        'macos': 'cubic-bezier(0.25, 0.1, 0.25, 1)',
        'macos-spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
      },
    },
  },
  plugins: [],
}
