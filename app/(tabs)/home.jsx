import { View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const Home = () => {
  return (
    <SafeAreaView 
      className="bg-light-background dark:bg-dark-background h-full"
    >
      <Text>Home</Text>
    </ SafeAreaView>
  )
};

export default Home;