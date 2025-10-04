/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: "#0E6E6E",
        secondary: "#C19A6B",
        dark: "#0B1B1E",
        light: "#F7F8F8",
        accent: "#4C63FF"
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Times New Roman', 'serif'],
        sans: ['Inter', 'system-ui', '-apple-system', 'Segoe UI', 'Roboto', 'Arial', 'sans-serif']
      }
    }
  },
  plugins: []
};