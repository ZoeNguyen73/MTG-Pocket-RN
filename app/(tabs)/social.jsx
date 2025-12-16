import { ImageBackground, Text, View, Platform } from "react-native";
import { router } from "expo-router";

import Button from "../../components/CustomButton/CustomButton";

import { images } from "../../constants";

const Social = () => {
  const isWeb = Platform.OS === "web";
  return (
    <ImageBackground
      source={isWeb ? images.background_ATLA2 : images.dark_background_vertical_5}
      resizeMode="cover"
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%"
      }}
    >
      { isWeb && (<View className="absolute inset-0 bg-black/80" />)}
      <View className="h-screen w-screen justify-center items-center">
        <Text className={`text-dark-text ${isWeb ? "text-4xl" : "text-2xl"} font-sans-bold text-center`}>
          Social Features coming soon
        </Text>
        <View className="mt-5 w-fit">
          <Button 
            variant="primary"
            title="Back to Home"
            handlePress={() => router.replace(`/home`)}
          />
        </View>
        
      </View>
      
    </ImageBackground>
  )
};

export default Social;