import { ImageBackground, View } from "react-native";
import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "../../context/AuthProvider";
import useDeviceLayout from "../../hooks/useDeviceLayout";

import Header from "../../components/Header";
import SetSelector from "../../components/SetSelector/SetSelector";
import generateSetListData from "../../components/SetSelector/setList";

import { images } from "../../constants";

const Home = () => {
  const { isLoggedIn, isLoading } = useAuthContext();
  const [ setList, setSetList ] = useState([]);
  // const bgSoundRef = useRef(null);
  const { isDesktopWeb, height } = useDeviceLayout();

  // load set data
  useEffect(() => {
    const data = generateSetListData();
    setSetList(data);
  }, [])

  return (
    <ImageBackground
      source={images.background_lowryn_eclipsed}
      className="flex-1 w-full"
      resizeMode="cover"
      style={{
        overflow: "hidden",
      }}
    >
      <View className="absolute inset-0 bg-black/75" />

      <SafeAreaView className="h-full">
        { !isDesktopWeb && (
          <View className="px-2">
            <Header />
          </View>
        )}
        {/* <View  /> */}
        { (setList.length > 0) && (
          <View
            style={{ marginTop: isDesktopWeb ? 90 : 30 }}
          >
            <SetSelector sets={setList} />
          </View>
          
        )}
      </SafeAreaView>
     
    </ImageBackground>
  )
};

export default Home;