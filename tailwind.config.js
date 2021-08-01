const defaultTheme = require("tailwindcss/defaultTheme");
const colors = require("tailwindcss/colors");

module.exports = {
  plugins: [
    require("@tailwindcss/typography"),
    require("@tailwindcss/aspect-ratio"),
    require("@tailwindcss/forms"),
  ],
  mode: "jit",
  purge: ["./components/**/*.js", "./pages/**/*.js"],
  theme: {
    extend: {
      colors: {
        cyan: "#79FFE1",
        blue: {
          900: "#000c1a",
          800: "#002147" /* SRC Oxford Blue */,
          700: "#003b80",
          600: "#0053b3",
          500: "#006be6",
          400: "#1a84ff",
          300: "#4d9fff",
          200: "#80bbff",
          100: "#b3d6ff",
          50: "#e5f1ff",
        },
      },
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      lineHeight: {
        tight: 1.2,
      },

      fontFamily: {
        sans: ["InterVariable", "sans-serif"],
        serif: ["Spectral", "serif"],
      },
      boxShadow: {
        small: "0 5px 10px rgba(0, 0, 0, 0.12)",
        medium: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      listStyleType: {
        alpha: "lower-alpha",
        roman: "lower-roman",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "h2, h3": {
              lineHeight: theme("lineHeight.snug"),
            },
            blockquote: {
              fontWeight: null,
              color: theme("colors.gray.600"),
              borderWidth: theme("borderWidth.DEFAULT"),
              borderColor: theme("colors.gray.200"),
              borderRadius: theme("borderRadius.md"),
              backgroundColor: theme("colors.gray.50"),
              paddingLeft: theme("padding.6"),
              paddingRight: theme("padding.6"),
              marginTop: theme("spacing.5"),
              marginBottom: theme("spacing.5"),
              borderLeftWidth: null,
              borderLeftColor: null,
              quotes: null,
              fontWeight: null,
              fontStyle: null,
            },
            "blockquote p:first-of-type::before": {
              content: null,
            },
            "blockquote p:last-of-type::after": {
              content: null,
            },
            a: {
              fontWeight: null,
              textDecoration: null,
              color: theme("colors.sudbury.light"),
              transitionProperty: theme("transitionProperty.colors"),
              transitionDuration: theme("transitionDuration.200"),
              transitionTimingFunction: theme(
                "transitionTimingFunction.DEFAULT"
              ),
            },
            "a:hover": {
              color: theme("colors.sudbury.lighter"),
            },
            "figure img": {
              borderRadius: theme("borderRadius.lg"),
            },
          },
        },
      }),
    },
  },
  variants: {
    extend: {
      fontWeight: ["first"],
    },
  },
};
