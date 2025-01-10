import { ImageBackground, Text, View } from "react-native";

import { images } from "../../constants";

const Collection = () => {
  return (
    <ImageBackground
      source={images.dark_background_vertical_5}
      style={{
        resizeMode: "cover",
        overflow: "hidden",
      }}
    >
      <View className="h-screen justify-center">
        <Text className="text-dark-text">Collection</Text>
      </View>
      
    </ImageBackground>
  )
};

export default Collection;