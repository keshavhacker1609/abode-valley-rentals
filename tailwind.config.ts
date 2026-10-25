import type { Config } from "tailwindcss";
import animate from "tailwindcss-animate";

const token = (name: string) => `rgb(var(--${name}) / <alpha-value>)`;

const config: Config = {
  darkMode: "class",
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}", "./lib/**/*.{ts,tsx}"],
  theme: {
    container: {
      center: true,
      padding: { DEFAULT: "1.25rem", md: "2rem", xl: "3rem" },
      screens: { "2xl": "1440px" },
    },
    extend: {
      colors: {
        paper: token("paper"),
        ink: token("ink"),
        "ink-soft": token("ink-soft"),
        forest: token("forest"),
        "forest-deep": token("forest-deep"),
        "on-forest": token("on-forest"),
        terracotta: token("terracotta"),
        "terracotta-ink": token("terracotta-ink"),
        sand: token("sand"),
        card: token("card"),
        line: token("line"),
        status: {
          available: token("status-available"),
          reserved: token("status-reserved"),
          rented: token("status-rented"),
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "Georgia", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
      },
      fontSize: {
        "display-xl": ["clamp(3rem, 7.5vw, 7.25rem)", { lineHeight: "0.95", letterSpacing: "-0.03em" }],
        "display-lg": ["clamp(2.4rem, 5vw, 4.5rem)", { lineHeight: "1", letterSpacing: "-0.025em" }],
        "display-md": ["clamp(1.9rem, 3.4vw, 3rem)", { lineHeight: "1.05", letterSpacing: "-0.02em" }],
      },
      borderRadius: { "2xl": "1.125rem", "3xl": "1.75rem" },
      boxShadow: {
        soft: "0 1px 2px rgb(28 28 28 / 0.04), 0 8px 28px -12px rgb(28 28 28 / 0.18)",
        lift: "0 2px 4px rgb(28 28 28 / 0.05), 0 22px 50px -20px rgb(31 58 46 / 0.35)",
      },
      transitionDuration: { 1200: "1200ms" },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
      },
      keyframes: {
        kenburns: {
          "0%": { transform: "scale(1.02) translate3d(0,0,0)" },
          "100%": { transform: "scale(1.14) translate3d(-1.5%, -1%, 0)" },
        },
        shimmer: { "100%": { transform: "translateX(100%)" } },
        "accordion-down": { from: { height: "0" }, to: { height: "var(--radix-accordion-content-height)" } },
        "accordion-up": { from: { height: "var(--radix-accordion-content-height)" }, to: { height: "0" } },
      },
      animation: {
        kenburns: "kenburns 22s ease-out infinite alternate",
        shimmer: "shimmer 1.6s infinite",
        "accordion-down": "accordion-down 0.45s cubic-bezier(0.16, 1, 0.3, 1)",
        "accordion-up": "accordion-up 0.3s cubic-bezier(0.16, 1, 0.3, 1)",
      },
    },
  },
  plugins: [animate],
};

export default config;
