/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        boho: {
          bg: '#f7f2eb',
          card: '#ffffff',
          accent: '#c77d63',
          accent2: '#86a397',
          text: '#2f2a28',
          muted: '#6f665f',
          border: '#e4d9cf'
        }
      },
      boxShadow: {
        boho: '0 10px 40px rgba(0,0,0,0.08)',
      },
      fontFamily: {
        display: ['"Playfair Display"', 'serif'],
        body: ['var(--font-sans)', 'sans-serif'],
      }
    },
  },
  plugins: [],
};
