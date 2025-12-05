import type { Config } from "tailwindcss";

export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        // Rebellious base palette
        rebel: {
          dark: "#0F0F0F", // Deep charcoal/black
          charcoal: "#1A1A1A", // Dark charcoal
          base: "#2D2D2D", // Medium charcoal
        },
        // Electric accents for CTAs and highlights
        electric: {
          teal: "#00D9FF", // Bright electric teal
          cyan: "#00E5FF", // Vibrant cyan
          orange: "#FF6B35", // Fiery orange
          pink: "#FF1493", // Deep pink
        },
        // Warm neutrals for balance
        warm: {
          gold: "#C9A961", // Champagne gold accent
          cream: "#F5F1EB", // Warm cream
          sand: "#E8DCC8", // Warm sand
        },
        // Legacy jewel tones for accent elements
        jewel: {
          emerald: "#2D7D5E",
          sapphire: "#1E3A8A",
          burgundy: "#6B1B47",
          amethyst: "#7C3AED",
        },
      },
      boxShadow: { soft: "0 12px 32px rgba(0,0,0,.08)" },
      fontFamily: { 
        sans: ["Montserrat", "ui-sans-serif", "system-ui", "sans-serif"],
        serif: ["Playfair Display", "Georgia", "serif"],
        display: ["Montserrat", "sans-serif"],
      },
      fontSize: {
        // Ensure minimum 16px for body text
        base: "16px",
        sm: "14px",
        lg: "18px",
        xl: "20px",
        "2xl": "24px",
        "3xl": "32px",
        "4xl": "48px",
        "5xl": "64px",
        "6xl": "80px",
        "7xl": "96px",
        "8xl": "112px",
        "9xl": "128px",
      }
    },
  },
  plugins: [],
} satisfies Config;
