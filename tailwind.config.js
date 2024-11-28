/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: "selector",
  theme: {
    screens: {
      "sm": "640px",
      "md": "768px",
      "lg": "1024px",
      "xl": "1280px",
      "2xl": "1536px",
    },
    fontFamily: {
      sans: ["Poppins_400Regular", "system-ui", "sans-serif"],
      "sans-light": ["Poppins_300Light", "system-ui", "sans-serif"],
      "sans-semibold": ["Poppins_600SemiBold", "system-ui", "sans-serif"],
      "sans-bold": ["Poppins_700Bold", "system-ui", "sans-serif"],
      "sans-italic": ["Poppins_400Regular_Italic", "system-ui", "sans-serif"],
      "sans-light-italic": ["Poppins_300Light_Italic", "system-ui", "sans-serif"],
      "sans-semibold-italic": ["Poppins_600SemiBold_Italic", "system-ui", "sans-serif"],
      "sans-bold-italic": ["Poppins_700Bold_Italic", "system-ui", "sans-serif"],
      // serif: ["Fraunces_400Regular", "serif"],
      // "serif-semibold": ["Fraunces_600SemiBold", "serif"],
      // "serif-bold": ["Fraunces_700Bold", "serif"],
      // "serif-black": ["Fraunces_900Black", "serif"],
      // mono: ["NotoSansMono_400Regular", "mono"],
      // "mono-light": ["NotoSansMono_300Light", "mono"],
      // "mono-semibold": ["NotoSansMono_600SemiBold", "mono"],
      // "mono-bold": ["NotoSansMono_700Bold", "mono"],
      // "mono-black": ["NotoSansMono_900Black", "mono"],
    },
    extend: {},
  },
  plugins: [],
}

