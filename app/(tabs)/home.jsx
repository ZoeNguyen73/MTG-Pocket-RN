import { ImageBackground, View } from "react-native";
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
  const [isPlaying, setIsPlaying] = useState(true);

  // load set data
  useEffect(() => {
    const data = generateSetListData();
    setSetList(data);
  }, [])

  return (
    <ImageBackground
      source={images.dark_background_vertical_2}
      style={{
        resizeMode: "cover",
        overflow: "hidden",
      }}
    >
      <SafeAreaView className="h-full">
        <View className="px-2 mb-10">
          <Header />
        </View>
        
        { (setList.length > 0) && (
          <SetSelector sets={setList} />
        )}
      </SafeAreaView>
     
    </ImageBackground>
  )
};

export default Home;