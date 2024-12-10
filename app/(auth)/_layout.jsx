import React from "react";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

import { useThemeContext } from "../../context/ThemeProvider";
import tailwindConfig from "../../tailwind.config";

const AuthLayout = () => {
  const { theme } = useThemeContext();

  const lightBackgroundColor = tailwindConfig.theme.extend.colors.light.background;
  const darkBackgroundColor = tailwindConfig.theme.extend.colors.dark.background;

  return (
    <>
      <Stack
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="register"
        />
        <Stack.Screen 
          name="activate/[activateToken]"
        />
      </Stack>

      <StatusBar 
        backgroundColor={`${ theme === "dark" ? darkBackgroundColor : lightBackgroundColor }`} 
        style={`${ theme === "dark" ? "light" : "dark"}`}
      />
    </>
  )
};

export default AuthLayout;