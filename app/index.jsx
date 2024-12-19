import { StatusBar } from "expo-status-bar";
import { View, Image, Text, useWindowDimensions } from "react-native";
import { router, Redirect, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeContext } from "../context/ThemeProvider";
import { useAuthContext } from "../context/AuthProvider";

import tailwindConfig from "../tailwind.config";
import { getBreakpoint } from "../utils/Breakpoints";

import { logos } from "../constants";

import Button from "../components/CustomButton/CustomButton";

const App = () => {
  const { theme } = useThemeContext();
  const { isLoggedIn, isLoading } = useAuthContext();
  const { width } = useWindowDimensions();
  const breakpoint = getBreakpoint(width);

  const lightBackgroundColor = tailwindConfig.theme.extend.colors.light.background;
  const darkBackgroundColor = tailwindConfig.theme.extend.colors.dark.background;
  const darkTextColor = tailwindConfig.theme.extend.colors.dark.text;

  return (
    <SafeAreaView
      className={`
        ${ theme === "dark" ? "dark" : "" }
        bg-light-background
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
          <Text className="text-light-text font-sans text-2xl">
            Welcome to
          </Text>
          <Text className="text-light-text font-sans-bold text-2xl">
            Magic The Gathering Pocket
          </Text>
        </View>

        <Button 
          title="Get Started"
          handlePress={() => {
            if (!isLoggedIn) {
              router.push("/log-in");
            } else {
              router.push("/home");
            }
          }}
          containerStyles="w-fit px-6 py-4 mt-7 mb-7 w-[80%]"
          icon
        />
        <Link href="/home" style={{padding: 5}}>Go to Home</Link>
        <Link href="/log-in" style={{padding: 5}}>Go to Log in</Link>
        <Link href="/register" style={{padding: 5}}>Go to Register</Link>
      </View>

      <StatusBar 
        backgroundColor={`${ theme === "dark" ? darkBackgroundColor : lightBackgroundColor }`} 
        style={`${ theme === "dark" ? "light" : "dark"}`}
      />

    </SafeAreaView>
  )
};

export default App;