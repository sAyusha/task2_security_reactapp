/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: "class",
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      boxShadow: {
        "grayish-sm": "2px 2px 0px #ffffff40",
        "blackish-sm": "2px 2px 0px #000",
        grayish: "4px 4px 0px #ffffff40",
        blackish: "4px 4px 0px #000",
      },
    },
    colors: {
      // Common Colors
      black: "#000",
      white: "#fff",
      yellow: "#82960C",

      // Light Mode Colors
      "light-bg": "#F9F4F0",
      "pink-light": "#e0beb8",
      "pink-lighter": "#F9F4F0",
      "blue-dark": "#262336",
      "blue-dark-hover": "#262336",
      "pink-light-hover": "#e0beb8",
      "pink-lighter-hover": "#F9F4F0",
      "purple-lighter-black-20": "#8B62CC",
      "purple-lighter-white-80": "#EFE4FF",

      "pale-yellow": "#CCBC29",
      "pale-red": "#8B0000",
      "lime-green": "#32CD32",
      "pale-yellow-80": "#FEFAED",
      "pale-red-80": "#FBEAEA",
      "pale-green": "#0CA64C",
      "dark-slate": "#5F646D",
      "light-slate": "#D3D3D3",
      "dark-slate-85": "#E7E8E9",
      "pearl-white": "#FAF4F0",
      "error-red": "#FF4D4D",

      // Dark Mode Colors
      "dark-bg": "#161616",
      "light-color": "#A9A9A9",
      "black-75": "#262524",
      "blue-dark": "#262336",
    },
    screens: {
      vsm: "500px",
      // => @media (min-width: 500px) { ... }

      sm: "640px",
      // => @media (min-width: 640px) { ... }

      md: "768px",
      // => @media (min-width: 768px) { ... }

      "md-2": "850px",
      // => @media (min-width: 850px) { ... }

      lg: "1024px",
      // => @media (min-width: 1024px) { ... }

      xl: "1280px",
      // => @media (min-width: 1280px) { ... }

      "2xl": "1536px",
      // => @media (min-width: 1536px) { ... }
    },
  },
  plugins: [],
};
