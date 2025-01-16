import { StatusBar } from "expo-status-bar";
import { ImageBackground, View, Image, Text, useWindowDimensions } from "react-native";
import { router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";

import { useThemeContext } from "../context/ThemeProvider";

import tailwindConfig from "../tailwind.config";
import { getBreakpoint } from "../utils/Breakpoints";
import { getFonts } from "../utils/FontFamily";
import { soundManager } from "../utils/SoundManager";

import { logos, images } from "../constants";

import Button from "../components/CustomButton/CustomButton";

const fonts = getFonts();

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
          className="h-[90vh] flex-col justify-center items-center"
        >
          <View className="justify-center items-center">
            <Image 
              source={logos.mtgDefaultLogo.path}
              style={{ 
                width: breakpoint === "sm" ? width * 0.8 : 450,
                height: (breakpoint === "sm" ? width * 0.8 : 450) / logos.mtgDefaultLogo.aspectRatio,
              }}
              resizeMode="contain"
            />
          </View>

          <View className="flex-column justify-center items-center pl-4 mb-10">
            <Text 
              className="text-light-background font-serif-bold text-4xl"
              style={{
                textShadowColor: "rgba(0, 0, 0, 0.60)",
                textShadowOffset: {width: -1, height: 1},
                textShadowRadius: 10,
                fontFamily: fonts.serifBold,
              }}
            >
              Pocket Edition
            </Text>
          </View>

          <Button 
            title="Get Started"
            handlePress={() => router.push("/home")}
            containerStyles="w-fit px-6 py-4 mt-7 mb-7 w-[80%]"
            icon
          />

          <Link href="/log-in" style={{padding: 5, fontFamily: fonts.sans}}>Go to Log in</Link>
          <Link href="/register" style={{padding: 5, fontFamily: fonts.sans}}>Go to Register</Link>
        </View>

        <StatusBar 
          // backgroundColor={`${ theme === "dark" ? darkBackgroundColor : lightBackgroundColor }`} 
          // style={`${ theme === "dark" ? "light" : "dark"}`}
          style="light"
          backgroundColor="transparent"
          translucent={true}
        />

      </SafeAreaView>
    </ImageBackground>
  )
};

export default App;