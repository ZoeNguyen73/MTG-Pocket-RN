import { Appearance } from "react-native";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "nativewind";

import storage from "../utils/Storage";
import handleGlobalError from "../utils/ErrorHandler";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();
  const [ theme, setTheme ] = useState(null);

  useEffect(() => {
    const getCurrentPreferredTheme = async () => {
      try {
        let currentSelectedTheme = await storage.getItem("theme");

        if (!currentSelectedTheme) {
          const colorScheme = Appearance.getColorScheme();
          if (colorScheme === "dark") {
            currentSelectedTheme = "dark";
          } else {
            currentSelectedTheme = "light";
          }
          await storage.setItem("theme", currentSelectedTheme);
        }

        setTheme(currentSelectedTheme);
        setColorScheme(currentSelectedTheme);
      } catch (error) {
        handleGlobalError(error);
      }
      
    };

    getCurrentPreferredTheme();
  }, [])

  const toggleTheme = async () => {
    try {
      const newTheme =  theme === "light" ? "dark" : "light";
      setTheme(newTheme);
      await storage.setItem("theme", newTheme);
      toggleColorScheme();
    } catch (error) {
      handleGlobalError(error);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
};

export default ThemeProvider;