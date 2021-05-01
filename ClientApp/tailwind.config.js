const defaultTheme = require("tailwindcss/defaultTheme");
const windmill = require("@windmill/react-ui/config");

module.exports = windmill({
  purge: [
    "./src/**/*.{js,jsx,ts,tsx}",
    "./public/index.html",
    "./src/myTheme.ts",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Inter", ...defaultTheme.fontFamily.sans],
      },
       colors: {
        gray: {
         
          '500': '#9e9e9e'
        }
      },
      boxShadow: {
        bottom:
          "0 5px 6px -7px rgba(0, 0, 0, 0.6), 0 2px 4px -5px rgba(0, 0, 0, 0.06)",
      },
    },
  },
  plugins: [
    require("@tailwindcss/forms")({
      strategy: "class",
    }),
  ],
});
