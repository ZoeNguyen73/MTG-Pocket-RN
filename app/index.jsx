import { StatusBar } from "expo-status-bar";
import { Text, View, Image, Dimensions } from "react-native";
import { router, Redirect, Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";

const App = () => {
  return (
    <SafeAreaView
      className="items-center h-full"
    >

      <View className="flex-column justify-center items-center">
        <Text className="text-xl">
          Welcome to Magic The Gathering Pocket
        </Text>
      </View>

    </SafeAreaView>
  )
};

export default App;