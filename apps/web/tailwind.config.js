import { blue } from "@sudburyrc/blue";
import aspectRatio from "@tailwindcss/aspect-ratio";
import typography from "@tailwindcss/typography";
import animate from "tailwindcss-animate";

/** @type {import('tailwindcss').Config} */
const config = {
  content: ["./{components,pages,app,lib}/**/*.{js,ts,jsx,tsx,mdx}"],
  mode: "jit",
  plugins: [animate, typography, aspectRatio],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "indicate-transparency":
          "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='8' height='8' viewBox='0 0 8 8'%3E%3Cg fill='%23000' fill-opacity='0.1'%3E%3Cpath fill-rule='evenodd' d='M0 0h4v4H0V0zm4 4h4v4H4V4z'/%3E%3C/g%3E%3C/svg%3E\")",
      },
      boxShadow: {
        medium: "0 8px 30px rgba(0, 0, 0, 0.12)",
        small: "0 5px 10px rgba(0, 0, 0, 0.12)",
      },
      colors: {
        cyan: "#79FFE1",
        blue,
      },
      container: {
        screens: {
          "2xl": "1024px",
          lg: "1024px",
          md: "728px",
          sm: "600px",
          xl: "1024px",
        },
      },
      fontFamily: {
        digital: ["var(--font-digital)", "monospace"],
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
      },
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
      letterSpacing: {
        tighter: "-.04em",
      },
      lineHeight: {
        tight: "1.2",
      },
      listStyleType: {
        alpha: "lower-alpha",
        roman: "lower-roman",
      },
      spacing: {
        28: "7rem",
      },
      typography: (theme) => ({
        DEFAULT: {
          css: {
            a: {
              color: theme("colors.blue.500"),
              fontWeight: null,
              textDecoration: null,
              transitionDuration: theme("transitionDuration.200"),
              transitionProperty: theme("transitionProperty.colors"),
              transitionTimingFunction: theme(
                "transitionTimingFunction.DEFAULT",
              ),
            },
            "a:hover": {
              color: theme("colors.blue.300"),
            },

            blockquote: {
              borderInlineStartColor: null,
              borderInlineStartWidth: null,
              borderLeftColor: null,
              borderLeftWidth: null,
              borderWidth: null,
              color: null,
              fontSize: "0.875rem",
              fontStyle: null,
              fontWeight: null,
              quotes: null,
            },

            "blockquote p": {
              fontSize: "1rem",
            },
            "blockquote p:first-of-type::before": {
              content: null,
            },
            "blockquote p:last-of-type::after": {
              content: null,
            },
            "code::after": {
              content: null,
            },
            "code::before": {
              content: null,
            },
            "figure img": {
              backgroundColor: theme("colors.gray.200"),
              borderRadius: theme("borderRadius.sm"),
            },

            "h1, h2, h3, h4, h5, h6": {
              fontWeight: theme("fontWeight.semibold"),
              letterSpacing: theme("letterSpacing.smug"),
            },
            "h2, h3": {
              lineHeight: theme("lineHeight.snug"),
            },
          },
        },
      }),
    },
  },
};

export default config;
