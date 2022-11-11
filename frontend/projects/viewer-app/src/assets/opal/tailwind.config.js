/** @type {import('tailwindcss').Config} */

module.exports = {
  presets: [
    require('../../tailwind.config'),
  ],
  content: [
    "./**/*.{html,ts,scss}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
