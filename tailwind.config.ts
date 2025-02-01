import type { Config } from "tailwindcss";
import tailwindcssAnimate from "tailwindcss-animate";

export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/ui/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/styles/globals.css"
  ],
  theme: {
    extend: {},
  },
  plugins: [tailwindcssAnimate],
} satisfies Config;
