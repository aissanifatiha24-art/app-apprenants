/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "ap-blue": {
          50: "#e6f0ff",
          100: "#b3d4ff",
          200: "#80b8ff",
          300: "#4d9cff",
          400: "#1a80ff",
          500: "#0066CC", // Couleur principale Algérie Poste
          600: "#0052a3",
          700: "#003d7a",
          800: "#002952",
          900: "#001429",
        },
        "ap-green": "#28A745", // Vert pour progression
        "ap-orange": "#FFA500", // Orange pour notifications
        "ap-red": "#DC3545", // Rouge pour urgent
        "ap-gray": "#F8F9FA", // Gris clair pour fond
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
      },
    },
  },
  plugins: [],
};
