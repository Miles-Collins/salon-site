import type { Config } from "tailwindcss";

export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1F2937", accent: "#E879F9" }, // charcoal + lilac-pink
        gold: {
          light: "#F0E6D2",
          DEFAULT: "#C9A961", // Warm champagne gold (was #d4af37)
          dark: "#8B7355", // Deep bronze
        },
        jewel: {
          emerald: "#2D7D5E", // Deep emerald green
          sapphire: "#1E3A8A", // Rich sapphire blue
          burgundy: "#6B1B47", // Deep burgundy wine
          amethyst: "#7C3AED", // Rich purple
        },
      },
      boxShadow: { soft: "0 12px 32px rgba(0,0,0,.08)" },
      fontFamily: { 
        sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Inter", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"]
      }
    },
  },
  plugins: [],
} satisfies Config;
