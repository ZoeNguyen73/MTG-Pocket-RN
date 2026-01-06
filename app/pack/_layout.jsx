import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";

import { useThemeContext } from "../../context/ThemeProvider";
import tailwindConfig from "../../tailwind.config";

const PackOpeningLayout = () => {
  const { theme } = useThemeContext();

  const lightBackgroundColor = tailwindConfig.theme.extend.colors.light.background;
  const darkBackgroundColor = tailwindConfig.theme.extend.colors.dark.background;
  
  return (
    <>
      <Stack
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="[packType]/[setCode]"
        />
      </Stack>
      <StatusBar 
        // backgroundColor={`${ theme === "dark" ? darkBackgroundColor : lightBackgroundColor }`} 
        // style={`${ theme === "dark" ? "light" : "dark"}`}
        backgroundColor="transparent"
        translucent={true}
        style="light"
      />
    </>
  )
};

export default PackOpeningLayout;