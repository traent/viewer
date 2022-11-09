/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: [
    './projects/dashboard-esg/**/*.{html,ts}',
  ],
  theme: {
    extend: {
      margin: {
        '30px': '30px',
      }
    },
    screens: {
      'sm': '430px',
      // => @media (min-width: 640px) { ... }

      'md': '768px',
      // => @media (min-width: 768px) { ... }

      'lg': '1024px',
      // => @media (min-width: 1024px) { ... }

      'xl': '1280px',
      // => @media (min-width: 1280px) { ... }

      '2xl': '1536px',
      // => @media (min-width: 1536px) { ... }
    }
  },
  plugins: [],
}
