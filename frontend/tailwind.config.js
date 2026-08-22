/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        serif: ["Georgia", "Cambria", "Times New Roman", "serif"],
        sans: ["system-ui", "-apple-system", "sans-serif"],
      },
      colors: {
        cream: "#FDF8F0",
        gold: "#C9A96E",
        "gold-dark": "#B8944F",
        "dark-bg": "#1A1A1A",
        "dark-card": "#2A2A2A",
      },
    },
  },
  plugins: [],
};
