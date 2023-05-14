/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic':
          'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
      },
    },
    screens: {
      'phone': '640px',
      'tablet': '1024px',
      'laptop': '1440px',
      'desktop': '1920px',
    },
    fontFamily: {
      'noto': '\'Noto Sans KR\', sans-serif',
      'abril-fatface': '\'Abril Fatface\', cursive'
    }
  },
  plugins: [],
}
