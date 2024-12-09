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
          DEFAULT: "#1A1F2C",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#0EA5E9",
          foreground: "#FFFFFF",
        },
        accent: {
          DEFAULT: "#F3F4F6",
          foreground: "#1A1F2C",
        },
        popover: {
          DEFAULT: "#FFFFFF",
          foreground: "#1A1F2C",
        },
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
      },
      backgroundImage: {
        'gradient-ocean': 'linear-gradient(to right, #243949 0%, #517fa4 100%)',
        'gradient-emerald': 'linear-gradient(to right, #0F766E 0%, #34D399 100%)',
        'gradient-aqua': 'linear-gradient(90deg, hsla(186, 33%, 94%, 1) 0%, hsla(216, 41%, 79%, 1) 100%)',
        'gradient-teal': 'linear-gradient(90deg, #0d9488 0%, #5eead4 100%)',
        'gradient-seafoam': 'linear-gradient(to right, #0EA5E9 0%, #22C55E 100%)',
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