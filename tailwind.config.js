/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}", 
    "./components/**/*.{js,jsx,ts,tsx}"
  ],
  presets: [require("nativewind/preset")],
  darkMode: "class",
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
      serif: ["Fraunces_400Regular", "serif"],
      "serif-semibold": ["Fraunces_600SemiBold", "serif"],
      "serif-bold": ["Fraunces_700Bold", "serif"],
      "serif-black": ["Fraunces_900Black", "serif"],
      mono: ["NotoSansMono_400Regular", "mono"],
      "mono-light": ["NotoSansMono_300Light", "mono"],
      "mono-semibold": ["NotoSansMono_600SemiBold", "mono"],
      "mono-bold": ["NotoSansMono_700Bold", "mono"],
      "mono-black": ["NotoSansMono_900Black", "mono"],
    },
    extend: {
      colors: {
        light: {
          background: "#eff1f5",
          "second-background": "#dce0e8",
          text: "#4c4f69",
          primary: "#BC4501",
          secondary: "#6c6f85",
          surface: "#ccd0da",
          links: "#1e66f5",
          grey1: "#9ca0b0",
          grey2: "#5c5f77",
          "success": "#40a02b",
          warning: "#df8e1d",
          error: "#d20f39",
          generic: "#1e66f5",
          "selection-background": "#7c7f93",
          red: "#d20f39",
          green: "#40a02b",
          yellow: "#FFBD12",
          "dark-yellow": "#AE4B0A",
          blue: "#1e66f5",
          pink: "#e273c5",
          teal: "#179299",
          sky: "#04a5e5",
          maroon: "#e64553",
          lavender: "#7287fd",
          rosewater: "#dc8a78",
          sapphire: "#209fb5",
          mauve: "#8839ef",
        },
        dark: {
          background: "#1e1e2e",
          "second-background": "#161a21",
          text: "#c6d0ed",
          primary: "#fab387",
          secondary: "#a6adc8",
          surface: "#313244",
          links: "#89b4fa",
          grey1: "#6c7086",
          grey2: "#bac2de",
          success: "#a6e3a1",
          warning: "#f9e2af",
          error: "#f38ba8",
          generic: "#89b4fa",
          "selection-background": "#9399b2",
          red: "#f38ba8",
          green: "#a6e3a1",
          yellow: "#f9e2af",
          blue: "#89b4fa",
          pink: "#f5c2e7",
          teal: "#94e2d5",
          sky: "#89dceb",
          maroon: "#eba0ac",
          lavender: "#b4befe",
          rosewater: "#f5e0dc",
          sapphire: "#74c7ec",
          mauve: "#cba6f7",
        },
      }
    },
  },
  plugins: [
    function ({ addUtilities }) {
      const newUtilities = {
        ".scrollbar-webkit": {
          "&::-webkit-scrollbar": {
            height: "10px",
          },
          "&::-webkit-scrollbar-track": {
            background: "transparent",
          },
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "lightblue",
            borderRadius: "5px",
          },
        }
      }
      addUtilities(newUtilities, ["responsive", "hover"]);
    }
    
  ],
};

