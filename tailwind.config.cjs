/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        load: "spin 2s ease-in-out infinite alternate-reverse",
      },
    },
  },
  plugins: [],
};
