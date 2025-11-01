import type { Config } from "tailwindcss";

export default {
  content: ["./src/app/**/*.{ts,tsx}", "./src/components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: { DEFAULT: "#1F2937", accent: "#E879F9" }, // charcoal + lilac-pink
      },
      boxShadow: { soft: "0 12px 32px rgba(0,0,0,.08)" },
      fontFamily: { sans: ["ui-sans-serif", "system-ui", "Segoe UI", "Inter", "sans-serif"] }
    },
  },
  plugins: [],
} satisfies Config;
