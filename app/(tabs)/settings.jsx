import { ImageBackground, ScrollView, Platform, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SoundSettings from "../../components/Sound/SoundSettings";
import AccountSettings from "../../components/AccountSettings";

import { images } from "../../constants";

const Settings = () => {
  const isWeb = Platform.OS === "web";
  return (
    <ImageBackground
      source={isWeb ? images.background_ATLA2 : images.dark_background_vertical_11}
      resizeMode="cover"
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%"
      }}
    >
      { isWeb && (<View className="absolute inset-0 bg-black/80" />)}
      <SafeAreaView 
        className="h-full py-4 px-4"
      >
        { !isWeb && (
          <ScrollView>
            <AccountSettings />
            <SoundSettings />
          </ScrollView>
        )}
        
        { isWeb && (
          <View className="h-full w-full items-center pt-[60px]">
            <View className="w-1/2 min-w-[400px] max-w-[800px]">
              <SoundSettings />
            </View>
          </View>
        )}
        
        
      </ SafeAreaView>
    </ImageBackground> 
  )
};

export default Settings;