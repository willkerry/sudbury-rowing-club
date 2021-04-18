const defaultTheme = require("tailwindcss/defaultTheme");

module.exports = {
  purge: ["./components/**/*.js", "./pages/**/*.js"],
  theme: {
    extend: {
      colors: {
        "accent-1": "#FAFAFA",
        "accent-2": "#EAEAEA",
        "accent-7": "#333",
        success: "#0070f3",
        cyan: "#79FFE1",
        sudbury: {
          brand: "#002147",
          DEFAULT: "#094284",
          light: "#1A71C2",
          lighter: "#289EFF",
          lightest: "#C4E4FF",
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
      fontSize: {
        "5xl": "2.5rem",
        "6xl": "2.75rem",
        "7xl": "4.5rem",
        "8xl": "6.25rem",
      },
      fontFamily: {
        sans: ["InterVariable", "sans-serif"],
        serif: ["Spectral", "serif"],
        caps: ["ridley"],
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
  plugins: [require("@tailwindcss/typography")],
};
