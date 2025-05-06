/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
    "app/**/*.{ts,tsx}",
    "components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Luxury green color palette
        green: {
          50: "#f0faf4",
          100: "#d8f3e6",
          200: "#b3e6d0",
          300: "#7ed4b2",
          400: "#4abe8c",
          500: "#27a873",
          600: "#1a8c5f",
          700: "#16724f",
          800: "#155c41",
          900: "#134c38",
        },
        // Secondary emerald color for accents
        emerald: {
          50: "#ecfdf5",
          100: "#d1fae5",
          200: "#a7f3d0",
          300: "#6ee7b7",
          400: "#34d399",
          500: "#10b981",
          600: "#059669",
          700: "#047857",
          800: "#065f46",
          900: "#064e3b",
        },
        // Gold accent for luxury feel
        gold: {
          50: "#fefbf3",
          100: "#fdf7e7",
          200: "#fbeecf",
          300: "#f9e5b7",
          400: "#f6d78f",
          500: "#f3c967",
          600: "#daa520", // Classic gold
          700: "#b78c1b",
          800: "#8f6f16",
          900: "#735a12",
        },
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        display: ["Playfair Display", "serif"],
      },
      boxShadow: {
        luxury: "0 10px 50px -12px rgba(0, 0, 0, 0.15)",
        "luxury-lg": "0 20px 60px -15px rgba(0, 0, 0, 0.2)",
        "luxury-xl": "0 25px 80px -20px rgba(0, 0, 0, 0.25)",
        "luxury-inner": "inset 0 2px 10px 0 rgba(0, 0, 0, 0.05)",
      },
      backgroundImage: {
        "gradient-luxury": "linear-gradient(135deg, var(--tw-gradient-stops))",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
