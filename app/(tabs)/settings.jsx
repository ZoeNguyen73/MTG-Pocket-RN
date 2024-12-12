import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Settings = () => {
  return (
    <SafeAreaView 
      className="bg-light-background dark:bg-dark-background h-full"
    >
      <Text>Settings</Text>
    </ SafeAreaView>
  )
};

export default Settings;