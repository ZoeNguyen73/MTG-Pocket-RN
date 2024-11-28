import { Appearance } from "react-native";
import React, { createContext, useState, useContext, useEffect } from "react";
import { useColorScheme } from "nativewind";
import AsyncStorage from "@react-native-async-storage/async-storage";

const ThemeContext = createContext();

export const useThemeContext = () => useContext(ThemeContext);

const ThemeProvider = ({ children }) => {
  const { colorScheme, toggleColorScheme, setColorScheme } = useColorScheme();
  const [ theme, setTheme ] = useState(null);

  useEffect(() => {
    const getCurrentPreferredTheme = async () => {
      let currentSelectedTheme = await AsyncStorage.getItem("theme");

      if (!currentSelectedTheme) {
        const colorScheme = Appearance.getColorScheme();
        if (colorScheme === "dark") {
          currentSelectedTheme = "dark";
        } else {
          currentSelectedTheme = "light";
        }
        await AsyncStorage.setItem("theme", currentSelectedTheme);
      }

      setTheme(currentSelectedTheme);
      setColorScheme(currentSelectedTheme);
    };

    getCurrentPreferredTheme();
  }, [])

  const toggleTheme = async () => {
    const newTheme =  theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    await AsyncStorage.setItem("theme", newTheme);
    toggleColorScheme();
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  )
};