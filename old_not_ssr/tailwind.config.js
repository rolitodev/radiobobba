/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    colors: {
      customOrange: '#fc6736',
      customBlack: '#202020'
    },
    extend: {},
  },
  plugins: [
    require('flowbite/plugin')
  ],
}