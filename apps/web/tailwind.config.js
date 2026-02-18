import { blue } from "@sudburyrc/blue";
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  plugins: [animate, typography, aspectRatio],
  mode: "jit",
  content: ["./{components,pages,app,lib}/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      colors: {
        cyan: "#79FFE1",
        blue,
      },
      spacing: {
        28: "7rem",
      },
      letterSpacing: {
        tighter: "-.04em",
      },
      lineHeight: {
        tight: "1.2",
      },
      fontFamily: {
        sans: ["InterVariable", "Inter", "system-ui", "sans-serif"],
        serif: ['"Source Serif 4 Variable"', "serif"],
        mono: [
          "JetBrains Mono Variable",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "Liberation Mono",
          "Courier New",
          "monospace",
        ],
        digital: ["var(--font-digital)", "monospace"],
      },
      boxShadow: {
        small: "0 5px 10px rgba(0, 0, 0, 0.12)",
        medium: "0 8px 30px rgba(0, 0, 0, 0.12)",
      },
      listStyleType: {
        alpha: "lower-alpha",
        roman: "lower-roman",
      },
      backgroundImage: {
        "indicate-transparency":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      container: {
        screens: {
          sm: "600px",
          md: "728px",
          lg: "1024px",
          xl: "1024px",
          "2xl": "1024px",
        },
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            "h2, h3": {
              lineHeight: theme("lineHeight.snug"),
            },

            "h1, h2, h3, h4, h5, h6": {
              fontWeight: theme("fontWeight.semibold"),
              letterSpacing: theme("letterSpacing.smug"),
            },

            blockquote: {
              fontWeight: null,
              color: null,
              borderWidth: null,
              borderLeftWidth: null,
              borderLeftColor: null,
              borderInlineStartWidth: null,
              borderInlineStartColor: null,
              quotes: null,
              fontStyle: null,
              fontSize: "0.875rem",
            },
            "blockquote p:first-of-type::before": {
              content: null,
            },
            "blockquote p:last-of-type::after": {
              content: null,
            },

            "blockquote p": {
              fontSize: "1rem",
            },

            a: {
              fontWeight: null,
              textDecoration: null,
              color: theme("colors.blue.500"),
              transitionProperty: theme("transitionProperty.colors"),
              transitionDuration: theme("transitionDuration.200"),
              transitionTimingFunction: theme(
                "transitionTimingFunction.DEFAULT",
              ),
            },
            "a:hover": {
              color: theme("colors.blue.300"),
            },
            "figure img": {
              borderRadius: theme("borderRadius.sm"),
              backgroundColor: theme("colors.gray.200"),
            },
            "code::before": {
              content: null,
            },
            "code::after": {
              content: null,
            },
          },
        },
      }),
    },
  },
};

export default config;
