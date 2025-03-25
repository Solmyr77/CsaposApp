import daisyui from "daisyui";

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        grey: "#262626",
        "dark-grey": "#1C1C1C",
        blue: "#007AFF",
        yellow: "#D7F205",
        "dark-yellow": "#52591D",
        field: "#B2B2B2",
        "field-selected": "#D5D5D5",
      },
      fontFamily: {
        play: ["Play", "sans-serif"],
      },
      fontSize: {
        xs: "0.75rem",
        sm: "1rem",
        md: "1.125rem",
        lg: "1.375rem",
        xl: "1.625rem",
        xxl: "2rem",
      },
      screens: {
        xs: "480px",
        "2xl": "1440px",
        sl: "900px",
      },
    },
  },
  plugins: [daisyui],
};
