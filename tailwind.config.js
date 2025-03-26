/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        "grey": "#262626",
        "dark-grey": "#1C1C1C",
        "blue": "#007AFF"
      },
      fontFamily:{
        "play": ["Play", "sans-serif"]
      },
      fontSize:{
        xs: "0.75rem",
        sm: "1rem",
        md: "1.125rem",
        lg: "1.375rem",
        xl: "1.625rem",
        xxl: "2rem"
      }
    },
  },
  plugins: [
    require('daisyui')
  ],
}