import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import React, { useEffect } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";

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
import { 
  Fraunces_400Regular, 
  Fraunces_600SemiBold, 
  Fraunces_700Bold,
  Fraunces_900Black 
} from "@expo-google-fonts/fraunces";
import { 
  NotoSansMono_300Light,
  NotoSansMono_400Regular, 
  NotoSansMono_600SemiBold, 
  NotoSansMono_700Bold,
  NotoSansMono_900Black 
} from "@expo-google-fonts/noto-sans-mono";

import "../global.css";

SplashScreen.preventAutoHideAsync();

import ThemeProvider from "../context/ThemeProvider";
import { AuthProvider } from "../context/AuthProvider";
import { ErrorHandlerProvider } from "../context/ErrorHandlerProvider";

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
    Fraunces_400Regular, 
    Fraunces_600SemiBold, 
    Fraunces_700Bold,
    Fraunces_900Black,
    NotoSansMono_300Light,
    NotoSansMono_400Regular, 
    NotoSansMono_600SemiBold, 
    NotoSansMono_700Bold,
    NotoSansMono_900Black, 
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
    <GestureHandlerRootView>
      <AuthProvider>
        <ErrorHandlerProvider>
          <ThemeProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
              <Stack.Screen name="pack" options={{ headerShown: false }} />
            </Stack>
          </ThemeProvider>
        </ErrorHandlerProvider>
      </AuthProvider>
    </GestureHandlerRootView>
    
  )
};

export default RootLayout;