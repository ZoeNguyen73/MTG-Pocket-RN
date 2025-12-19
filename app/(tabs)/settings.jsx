import { ImageBackground, ScrollView, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import SoundSettings from "../../components/Sound/SoundSettings";
import AccountSettings from "../../components/AccountSettings";
import useDeviceLayout from "../../hooks/useDeviceLayout";

import { images } from "../../constants";

const Settings = () => {
  const { isDesktopWeb } = useDeviceLayout();
  return (
    <ImageBackground
      source={isDesktopWeb ? images.background_ATLA2 : images.dark_background_vertical_11}
      resizeMode="cover"
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%"
      }}
    >
      { isDesktopWeb && (<View className="absolute inset-0 bg-black/80" />)}
      <SafeAreaView 
        className="h-full mx-4 mt-4 py-4 px-4"
      >
        { !isDesktopWeb && (
          <ScrollView>
            <AccountSettings />
            <SoundSettings />
          </ScrollView>
        )}
        
        { isDesktopWeb && (
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