/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        // GitHub-inspired professional color palette
        primary: {
          50: "#f6f8fa",
          100: "#eaeef2",
          200: "#d0d7de",
          300: "#afb8c1",
          400: "#8c959f",
          500: "#6e7781",
          600: "#57606a",
          700: "#424a53",
          800: "#32383f",
          900: "#24292f",
          950: "#1c2128",
        },
        secondary: {
          50: "#f1f8ff",
          100: "#dbedff",
          200: "#c6e2ff",
          300: "#9ecbff",
          400: "#67a3ff",
          500: "#3378ff",
          600: "#0969da",
          700: "#0550ae",
          800: "#033d8b",
          900: "#0a3069",
        },
        accent: {
          success: "#1a7f37",
          warning: "#bf8700",
          danger: "#d1242f",
          info: "#0969da",
        },
        surface: {
          light: "rgba(255, 255, 255, 0.8)",
          dark: "rgba(13, 17, 23, 0.8)",
        },
        glass: {
          light: "rgba(255, 255, 255, 0.1)",
          dark: "rgba(13, 17, 23, 0.1)",
          border: "rgba(139, 148, 158, 0.2)",
        },
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      animation: {
        fadeIn: "fadeIn 0.5s ease-out",
        slideUp: "slideUp 0.3s ease-out",
        pulse: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
        slideUp: {
          "0%": { transform: "translateY(20px)", opacity: "0" },
          "100%": { transform: "translateY(0)", opacity: "1" },
        },
      },
      boxShadow: {
        soft: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
        medium:
          "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
        large:
          "0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },
    },
  },
  plugins: [require("@tailwindcss/forms")],
};
