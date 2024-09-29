/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}", "./index.html"],
  theme: {
    extend: {
      screens: {
        'iPhone': {'raw': '((min-width:375px) and (max-width:767px) and (orientation: portrait))'},
        'iPhone-SE': {'raw': '((min-width:375px) and (max-width:767px) and (orientation: landscape))'},
        'iPad-Mini_P': {'raw': '((min-width:767px) and (max-width:1024px) and (orientation: portrait))'},
        'iPad-Mini_L':{'raw': '(((min-width:767px) and (max-width:1024px) and (orientation: landscape)))'}
      }
    },
  },
  plugins: [],
}

