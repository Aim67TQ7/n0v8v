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
          DEFAULT: "#F1F0FB",
          foreground: "#1A1F2C",
          hover: "#E5DEFF"
        },
        card: {
          DEFAULT: "rgba(255, 255, 255, 0.95)",
          foreground: "#1A1F2C",
          hover: "#F1F0FB",
          muted: "#8E9196"
        },
        content: {
          DEFAULT: "#F1F0FB",
          foreground: "#1A1F2C",
          hover: "#E5DEFF",
          muted: "#8A898C"
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