import { ImageBackground, View } from "react-native";
import { useState, useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "../../../api/axios";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { images } from "../../../constants";

import { useAuthContext } from "../../../context/AuthProvider";
import { useErrorHandler } from "../../../context/ErrorHandlerProvider";
import { useThemeContext } from "../../../context/ThemeProvider";
import useDeviceLayout from "../../../hooks/useDeviceLayout";

import LoadingSpinner from "../../../components/LoadingSpinner/LoadingSpinner";
import CardSwiper from "../../../components/Card/CardSwiper";
import CardFlipperWeb from "../../../components/Card/CardFlipperWeb";

const PackOpening = () => {
  const { isLoggedIn } = useAuthContext();
  const { handleError } = useErrorHandler();
  const { setCode, packType } = useLocalSearchParams();
  const [ cards, setCards ] = useState([]);
  const [ packPrice, setPackPrice ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  const { isDesktopWeb } = useDeviceLayout();

  useEffect(() => {
    // get cards
    const getCardsFromPack = async () => {
      let response = null;
      setIsLoading(true);
      try {
        if (isLoggedIn) {
          response = await axiosPrivate.post(`/packs/open/set/${setCode}/type/${packType}`);
        } else {
          response = await axios.post(`/packs/open/set/${setCode}/type/${packType}`);
        }
        setCards(response.data.cards);
        setPackPrice(response.data.pack_price);
      } catch (error) {
        await handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCardsFromPack();
  }, []);

  return (
    <ImageBackground
      source={ isDesktopWeb ? images.background_lowryn_eclipsed : images.dark_background_vertical_10}
      className="flex-1 w-full"
      resizeMode="cover"
      style={{
        flex: 1,
        width: "100%"
      }}
    >
      {isDesktopWeb && (
        <View className="absolute inset-0 bg-black/75" />
      )}

      <SafeAreaView className="h-screen justify-center">
  
        { cards.length > 0 && !isDesktopWeb && (
          <CardSwiper cards={cards} setCode={setCode} packType={packType} packPrice={packPrice}/>
        )}

        { cards.length > 0 && isDesktopWeb && (
          <CardFlipperWeb cards={cards} setCode={setCode} packType={packType} packPrice={packPrice}/>
        )}
  
        {isLoading && <LoadingSpinner />}
      </SafeAreaView>
    </ImageBackground>
    
  )

};

export default PackOpening;