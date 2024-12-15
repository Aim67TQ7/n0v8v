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
          DEFAULT: "#3b82f6",
          foreground: "#FFFFFF",
          hover: "#2563eb"
        },
        secondary: {
          DEFAULT: "#6b7280",
          foreground: "#FFFFFF",
          hover: "#4b5563"
        },
        accent: {
          DEFAULT: "#f3f4f6",
          foreground: "#1f2937",
          hover: "#e5e7eb"
        },
        card: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
          hover: "#f9fafb",
          muted: "#6b7280"
        },
        content: {
          DEFAULT: "#ffffff",
          foreground: "#1f2937",
          hover: "#f9fafb",
          muted: "#6b7280"
        },
        destructive: {
          DEFAULT: "#ef4444",
          foreground: "#FFFFFF",
          hover: "#dc2626"
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