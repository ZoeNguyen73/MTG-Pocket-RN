import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";

import { 
  Poppins_300Light,
  Poppins_400Regular, 
  Poppins_600SemiBold, 
  Poppins_700Bold,
  Poppins_300Light_Italic,
  Poppins_400Regular_Italic,
  Poppins_600SemiBold_Italic,
  Poppins_700Bold_Italic
} from "@expo-google-fonts/poppins";

SplashScreen.preventAutoHideAsync();

const RootLayout = () => {

  const [loaded, error] = useFonts({
    Poppins_300Light,
    Poppins_400Regular, 
    Poppins_600SemiBold, 
    Poppins_700Bold,
    Poppins_300Light_Italic,
    Poppins_400Regular_Italic,
    Poppins_600SemiBold_Italic,
    Poppins_700Bold_Italic,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <Stack>
      <Stack.Screen name="index" options={{ headerShown: false }} />
    </Stack>
  )
};

export default RootLayout;