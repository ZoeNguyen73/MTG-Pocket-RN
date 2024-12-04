import { StatusBar } from "expo-status-bar";
import { Text, View, Image, Dimensions } from "react-native";
import { router, Redirect, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

import { useThemeContext } from "../context/ThemeProvider";
import { useAuthContext } from "../context/AuthProvider";

import tailwindConfig from "../tailwind.config";

const App = () => {
  const { theme } = useThemeContext();
  const { isLoggedIn, isLoading } = useAuthContext();
  const { width } = Dimensions.get("window");

  const lightBackgroundColor = tailwindConfig.theme.extend.colors.light.background;
  const darkBackgroundColor = tailwindConfig.theme.extend.colors.dark.background;
  const darkTextColor = tailwindConfig.theme.extend.colors.dark.text;

  if (theme === null) {
    return (
      <Text>Loading...</Text>
    )
  }

  if (!isLoading && isLoggedIn) {
    // redirect to logged in homepage
    // return <Redirect href="/home" />
  }

  return (
    <SafeAreaView
      className={`
        ${ theme === "dark" ? "dark" : "" }
        bg-light-background
        items-center h-full
      `}
    >

      <View className="justify-center items-center flex h-[50vh] mb-20">
        <Text className="text-light-text font-sans text-3xl">
          Welcome to Magic The Gathering Pocket
        </Text>
      </View>

    </SafeAreaView>
  )
};

export default App;