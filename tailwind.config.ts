import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        emerald: {
          dark: "#0d2818",
        },
        navy: {
          dark: "#0d1b2a",
        },
        orange: {
          accent: "#e85d04",
          hover: "#c94d00",
        },
        cream: "#f5f0e8",
        gold: "#c9a84c",
      },
      fontFamily: {
        sans: ["Inter", "system-ui", "sans-serif"],
        serif: ["Georgia", "serif"],
      },
      backgroundImage: {
        "hero-gradient": "linear-gradient(135deg, #0d2818 0%, #0d1b2a 100%)",
        "section-gradient": "linear-gradient(180deg, #0d1b2a 0%, #0d2818 100%)",
      },
    },
  },
  plugins: [],
};

export default config;
