import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./lib/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0b1320",
        panel: "#121a2a",
        accent: "#1f6feb",
        sand: "#f6f8fb"
      }
    }
  },
  plugins: [],
};

export default config;
