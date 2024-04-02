/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./dist/**/*.{html,js}"],
  theme: {
    extend: {
      colors: {
        "modal-background": "rgba(21.57,25.49,31.76,0.5)",
        "dark-grey": "#4d4d4d"
      }
    },
  },
  plugins: [],
}

