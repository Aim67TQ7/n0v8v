import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
  ],
  prefix: "",
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "#9b87f5",
          foreground: "#FFFFFF",
          hover: "#7E69AB"
        },
        secondary: {
          DEFAULT: "#0EA5E9",
          foreground: "#FFFFFF",
          hover: "#0b8ac5"
        },
        accent: {
          DEFAULT: "#F1F1F1",
          foreground: "#000000",
          hover: "#E5E5E5"
        },
        card: {
          DEFAULT: "#000000",
          foreground: "#FFFFFF",
          hover: "#1a1a1a",
          muted: "#999999"
        },
        content: {
          DEFAULT: "#F1F1F1",
          foreground: "#000000",
          hover: "#E5E5E5",
          muted: "#666666"
        },
        destructive: {
          DEFAULT: "#ea384c",
          foreground: "#FFFFFF",
          hover: "#d62d3f"
        }
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": {
            opacity: "0",
            transform: "translateY(10px)",
          },
          "100%": {
            opacity: "1",
            transform: "translateY(0)",
          },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;