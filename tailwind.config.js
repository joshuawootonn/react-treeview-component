const defaultTheme = require("tailwindcss/defaultTheme");
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Josefin Sans", ...defaultTheme.fontFamily.sans],
      },
      colors: {
        pink: "#FE65B7",
        blue: "#446DF6",
        orange: "#FBB02D",
        yellow: "#FFFF4C",
        green: "#ACECA1",
        purple: "#AB87FF",
        lightest: "#FFFFFF",
        light: "#EFEFEF",
        medium: "#CFCFCF",
        dark: "#8F8F8F",
        darkest: "#333333",
      },
    },
  },
  plugins: [],
};
