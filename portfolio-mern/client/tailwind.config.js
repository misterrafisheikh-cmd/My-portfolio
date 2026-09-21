/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["selector", '[data-theme="dark"]'],
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Space Grotesk", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "ui-monospace", "monospace"],
      },
      keyframes: {
        blink: { "50%": { opacity: 0 } },
        pulse2: { "50%": { boxShadow: "0 0 0 9px rgba(61,220,132,0)" } },
        rise: { to: { transform: "none" } },
        spin18: { to: { transform: "rotate(1turn)" } },
        slide: { to: { transform: "translateX(-50%)" } },
        swell: { "50%": { transform: "translateY(5px)" } },
        driftA: { to: { transform: "translateX(-420px)" } },
        driftB: { to: { transform: "translateX(-320px)" } },
        driftC: { to: { transform: "translateX(-560px)" } },
        current: { to: { backgroundPosition: "-220% 0, 180% 0" } },
      },
      animation: {
        blink: "blink 1.1s steps(1) infinite",
        pulse2: "pulse2 2.4s ease-in-out infinite",
        spin18: "spin18 9s linear infinite",
        slide: "slide 32s linear infinite",
        swell: "swell 7s ease-in-out infinite",
        driftA: "driftA 13s linear infinite",
        driftB: "driftB 9s linear infinite",
        driftC: "driftC 17s linear infinite",
        current: "current 14s linear infinite",
      },
    },
  },
  plugins: [],
};
