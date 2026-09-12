/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          navy: '#0b1e36',
          navydark: '#071322',
          navylight: '#162e4e',
          cyan: '#0891b2',
          cyanlight: '#06b6d4',
          teal: '#0d9488',
          teallight: '#14b8a6',
          amber: '#d97706',
          red: '#dc2626',
          green: '#16a34a',
          slate: '#f8fafc',
          border: '#e2e8f0'
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    },
  },
  plugins: [],
}
