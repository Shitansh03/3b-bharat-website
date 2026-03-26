/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // 3D Bharat theme colors
        primary: {
          black: "#000000",
          white: "#ffffff",
        },
        gray: {
          50: "#fafafa",
          100: "#f4f4f5",
          200: "#e4e4e7",
          300: "#d4d4d8",
          400: "#a1a1aa",
          500: "#71717a",
          600: "#52525b",
          700: "#3f3f46",
          800: "#27272a",
          900: "#18181b",
          950: "#09090b",
        },
        // Legacy colors (keeping for compatibility)
        sandstone: "#C89B67",
        saffron: "#E78A00",
        indigo: "#2B2A7B",
        offwhite: "#FFF8F2",
        charcoal: "#222222",
        "gold-glow": "rgba(255, 215, 130, 0.35)",
        "dark-bg": "#0F0F15",
        "neon-indigo": "#4A48C9",
        "primary-green": "#39C839",
        "primary-green-light": "#66BB6A",
        "primary-green-dark": "#2E7D32",
        "green-glow": "rgba(57, 200, 57, 0.35)",
      },
      fontFamily: {
        heading: ["Space Grotesk", "Inter", "system-ui", "sans-serif"],
        body: ["Inter", "system-ui", "sans-serif"],
      },
      transitionTimingFunction: {
        smooth: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      animation: {
        float: "float 3s ease-in-out infinite",
        petal: "petal-fall 15s linear infinite",
        "pulse-glow": "pulse-glow 4s ease-in-out infinite",
        "neon-pulse": "neon-pulse 2s ease-in-out infinite",
        "scroll-left": "scroll-left 30s linear infinite",
        "scroll-right": "scroll-right 30s linear infinite",
        "bounce-slow": "bounce-slow 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-10px)" },
        },
        "petal-fall": {
          "0%": {
            transform: "translateY(-10vh) rotate(0deg) translateX(0)",
            opacity: "0",
          },
          "10%": { opacity: "0.6" },
          "90%": { opacity: "0.6" },
          "100%": {
            transform: "translateY(100vh) rotate(360deg) translateX(100px)",
            opacity: "0",
          },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.5" },
          "50%": { opacity: "0.8" },
        },
        "neon-pulse": {
          "0%, 100%": {
            boxShadow: "0 0 5px #4A48C9, 0 0 10px #4A48C9, 0 0 20px #4A48C9",
          },
          "50%": {
            boxShadow: "0 0 10px #4A48C9, 0 0 20px #4A48C9, 0 0 40px #4A48C9",
          },
        },
        "scroll-left": {
          "0%": { transform: "translateX(0%)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "scroll-right": {
          "0%": { transform: "translateX(-50%)" },
          "100%": { transform: "translateX(0%)" },
        },
        "bounce-slow": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      backdropBlur: {
        xl: "20px",
      },
      perspective: {
        1000: "1000px",
        1200: "1200px",
      },
    },
  },
  plugins: [],
};
