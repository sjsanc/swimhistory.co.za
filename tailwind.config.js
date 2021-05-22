module.exports = {
  purge: ["./pages/**/*.{js,ts,jsx,tsx}", "./components/**/*.{js,ts,jsx,tsx}"],
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {
      fontFamily: {
        header: ["Raleway", "sans-serif"],
      },
      gridTemplateColumns: {},
      fontSize: {
        xxs: "11px",
      },
    },
  },
  variants: {
    extend: {},
  },
  plugins: [],
};
