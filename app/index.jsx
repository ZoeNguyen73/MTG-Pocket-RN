import { StatusBar } from "expo-status-bar";
import { ImageBackground, View, Image, Text, useWindowDimensions, Platform } from "react-native";
import { router, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect } from "react";
import { LinearGradient } from "expo-linear-gradient";

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
  const { width, height } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);

  const lightBackgroundColor = tailwindConfig.theme.extend.colors.light.background;
  const darkBackgroundColor = tailwindConfig.theme.extend.colors.dark.background;

  useEffect(() => {
    const playBgMusic = async () => {
      await soundManager.playBackgroundMusic();
    };

    if (Platform.OS !== "web") playBgMusic(); // only auto play bg music on app, not on web
    
  }, [])

  const handleGetStarted = async () => {
    try {
      await soundManager.playBackgroundMusic();
    } catch (error) {
      console.log("Error playing background music on Get Started:", error);
    }

    router.push("/home");
  };

  return (
    <ImageBackground
      source={images.background_lowryn_eclipsed}
      className="flex-1 w-full"
      resizeMode="cover"
      style={{
        overflow: "hidden",
      }}
    > 
      <View className="absolute inset-0 bg-stone-100/35" />
      <SafeAreaView
        className="flex-1 items-center w-full h-full"
      >
        <View
          className="flex-1 justify-center items-center"
        >
          <LinearGradient
            colors={[
              "rgba(251, 146, 60, 0.3)",   // orange-400/30
              "rgba(192, 132, 252, 0.3)",  // purple-400/30
            ]}
            start={{ x: 0, y: 0.5 }}   // left
            end={{ x: 1, y: 0.5 }}     // right
            style={{
              paddingHorizontal: 20,
              paddingVertical: 40,
              borderRadius: 24,
              alignItems: "center",
              alignSelf: "flex-start",
            }}
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
                className="text-text font-serif-bold text-4xl"
                style={{
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
              handlePress={handleGetStarted}
              containerStyles="w-fit px-6 py-4 mt-7 mb-7 w-[80%]"
              icon
            />

            <Link href="/log-in" style={{padding: 5, fontFamily: fonts.sans}}>Go to Log in</Link>
            <Link href="/register" style={{padding: 5, fontFamily: fonts.sans}}>Go to Register</Link>
          </LinearGradient>
          
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