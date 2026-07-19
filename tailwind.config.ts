import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#101B33",       // deep navy - night traffic, headers, text
        paper: "#EFE6D8",     // warm sand background
        vermilion: "#D84315", // signboard red - primary accent, CTAs
        gold: "#E3A008",      // danfo yellow - highlights, price tags
        verified: "#1F7A4D",  // agent verified badge
        white: "#FFFFFF",
      },
      fontFamily: {
        display: ["var(--font-display)"],
        body: ["var(--font-body)"],
        mono: ["var(--font-mono)"],
      },
    },
  },
  plugins: [],
};
export default config;
