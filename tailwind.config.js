/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "blue-dark": "#0A192F",
        "blue-light": "#172A45",
        "beige-light": "#E5DDC5",
        "beige-dark": "#F1EEDC",
        "almond-light": "#F2E2D2",
        "coyote-dark": "#82735C",
        "maya-blue": "#78C3FB",
        "licorice-dark": "#1C0F13",
        "black-bean": "#2E0E02",
        "fire-brick": "#bb0a21",
        "white-smoke": "#F4F3F2",
      },
    },
  },
  plugins: [],
};
