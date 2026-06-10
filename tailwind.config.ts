import type { Config } from "tailwindcss";

// Most of the bank look lives in app/globals.css (the engraved frame,
// cheque, perforated receipt). Tailwind handles layout utilities and
// exposes the palette + fonts here if you want to reach for classes.
const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0c0b07",
        paper: "#ece3cd",
        green: { DEFAULT: "#0e3b2c", 2: "#145c40" },
        mint: "#25c281",
        stamp: "#c5362b",
        gold: "#c9a227",
      },
      fontFamily: {
        display: ["var(--font-display)", "sans-serif"],
        serif: ["var(--font-serif)", "serif"],
        mono: ["var(--font-mono)", "monospace"],
        body: ["var(--font-body)", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
