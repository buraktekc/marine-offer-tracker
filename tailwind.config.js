/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        teal: { brand: "#00ADB5" },
        purple: { brand: "#7F30E4" },
        sidebar: "#0F1419",
      },
    },
  },
  plugins: [],
}
