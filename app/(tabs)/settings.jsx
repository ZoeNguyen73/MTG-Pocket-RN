import { ImageBackground, View, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SoundSettings from "../../components/Sound/SoundSettings";

import { images } from "../../constants";

const Settings = () => {
  return (
    <ImageBackground
      source={images.dark_background_vertical_11}
      style={{
        resizeMode: "cover",
        overflow: "hidden",
      }}
    >
      <SafeAreaView 
        className="h-full py-4 px-4"
      >
        <SoundSettings />
        
      </ SafeAreaView>
    </ImageBackground> 
  )
};

export default Settings;