/** @type {import('tailwindcss').Config} */
export default {
  darkMode: "class",
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          DEFAULT: "#4f46e5", // indigo-600, used for buttons/links/accents
          hover: "#4338ca",
        },
      },
    },
  },
  plugins: [],
};
