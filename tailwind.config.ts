import type { Config } from "tailwindcss"

const config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./app/**/*.{ts,tsx}",
    "./src/**/*.{ts,tsx}",
    "*.{js,ts,jsx,tsx,mdx}",
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
        primary: {
          DEFAULT: "#17B890",
          50: "#E6F7F2",
          100: "#CCEEE5",
          200: "#99DDCB",
          300: "#66CCB0",
          400: "#33BB96",
          500: "#17B890",
          600: "#129373",
          700: "#0D6E56",
          800: "#09493A",
          900: "#04251D",
          950: "#02120E",
        },
        secondary: {
          DEFAULT: "#9DC5BB",
          50: "#F5F8F7",
          100: "#EBF1EF",
          200: "#D7E3DF",
          300: "#C3D4CF",
          400: "#B0C6BF",
          500: "#9DC5BB",
          600: "#7AB0A3",
          700: "#5A9A8A",
          800: "#457A6D",
          900: "#315A50",
          950: "#263F38",
        },
        tertiary: {
          DEFAULT: "#DEE5E5",
          50: "#FCFDFD",
          100: "#F9FAFA",
          200: "#F2F5F5",
          300: "#EBF0F0",
          400: "#E4EAEA",
          500: "#DEE5E5",
          600: "#BDC9C9",
          700: "#9CADAD",
          800: "#7B9191",
          900: "#5F7070",
          950: "#495656",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
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
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
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
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config

export default config
