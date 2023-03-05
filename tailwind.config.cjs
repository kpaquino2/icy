/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      animation: {
        load: "spin 2s ease-in-out infinite alternate-reverse",
      },
      backgroundImage: {
        borderright:
          "repeating-linear-gradient(270deg, var(--tw-gradient-stops) 0 2px, transparent 0 100%)",
      },
      backgroundSize: {
        col: "192px",
      },
    },
  },
  plugins: [],
};
