import { ImageBackground, View, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "../../context/AuthProvider";

import Header from "../../components/Header";
import SetSelector from "../../components/SetSelector/SetSelector";
import generateSetListData from "../../components/SetSelector/setList";

import { images } from "../../constants";

const Home = () => {
  const { isLoggedIn, isLoading } = useAuthContext();
  const [ setList, setSetList ] = useState([]);
  // const bgSoundRef = useRef(null);
  const isWeb = Platform.OS === "web";

  // load set data
  useEffect(() => {
    const data = generateSetListData();
    setSetList(data);
  }, [])

  return (
    <ImageBackground
      source={isWeb ? images.background_lowryn_eclipsed : images.dark_background_vertical_2}
      className="flex-1 w-full"
      resizeMode="cover"
      style={{
        overflow: "hidden",
      }}
    >
      {isWeb && (
        <View className="absolute inset-0 bg-black/75" />
      )}
      <SafeAreaView className="h-full">
        { !isWeb && (
          <View className="px-2 mb-10">
            <Header />
          </View>
        )}
        { (setList.length > 0) && (
          <SetSelector sets={setList} />
        )}
      </SafeAreaView>
     
    </ImageBackground>
  )
};

export default Home;