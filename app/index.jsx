import { StatusBar } from "expo-status-bar";
import { ImageBackground, View, Image, Text, useWindowDimensions } from "react-native";
import { router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

import { useThemeContext } from "../context/ThemeProvider";

import tailwindConfig from "../tailwind.config";
import { getBreakpoint } from "../utils/Breakpoints";
import { soundManager } from "../utils/SoundManager";

import { logos, images } from "../constants";

import Button from "../components/CustomButton/CustomButton";

const App = () => {
  const { theme } = useThemeContext();
  const { width } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);

  const lightBackgroundColor = tailwindConfig.theme.extend.colors.light.background;
  const darkBackgroundColor = tailwindConfig.theme.extend.colors.dark.background;

  useEffect(() => {
    const playBgMusic = async () => {
      await soundManager.playBackgroundMusic();
    };

    playBgMusic();
  }, [])

  return (
    <ImageBackground
      source={images.dark_background_vertical_7}
      style={{
        resizeMode: "cover",
        overflow: "hidden",
      }}
    >
      <SafeAreaView
        className={`
          items-center h-full
        `}
      >
        <View
          className="h-[80vh] flex-col justify-center items-center"
        >
          <View className="justify-center items-center">
            <Image 
              source={logos.mtgDefaultLogo.path}
              style={{ 
                width: breakpoint === "sm" ? width * 0.7 : 450,
                height: (breakpoint === "sm" ? width * 0.7 : 450) / logos.mtgDefaultLogo.aspectRatio,
              }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-column justify-center items-center mt-4">
            <Text className="text-dark-text font-sans text-2xl">
              Welcome to
            </Text>
            <Text className="text-dark-text font-sans-bold text-2xl">
              Magic The Gathering Pocket
            </Text>
          </View>

          <Button 
            title="Get Started"
            handlePress={() => router.push("/home")}
            containerStyles="w-fit px-6 py-4 mt-7 mb-7 w-[80%]"
            icon
          />

          <Link href="/log-in" style={{padding: 5}}>Go to Log in</Link>
          <Link href="/register" style={{padding: 5}}>Go to Register</Link>
        </View>

        <StatusBar 
          backgroundColor={`${ theme === "dark" ? darkBackgroundColor : lightBackgroundColor }`} 
          style={`${ theme === "dark" ? "light" : "dark"}`}
        />

      </SafeAreaView>
    </ImageBackground>
  )
};

export default App;