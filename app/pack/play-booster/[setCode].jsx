import { Platform, ImageBackground } from "react-native";
import React, { useState, useEffect, useRef } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "../../../api/axios";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";
import { images } from "../../../constants";

import { useAuthContext } from "../../../context/AuthProvider";
import { useErrorHandler } from "../../../context/ErrorHandlerProvider";
import { useThemeContext } from "../../../context/ThemeProvider";

import LoadingSpinner from "../../../components/LoadingSpinner";
import CardSwiper from "../../../components/Card/CardSwiper";
import CardFlipperWeb from "../../../components/Card/CardFlipperWeb";

const PlayBoosterPackOpening = () => {
  const { isLoggedIn } = useAuthContext();
  const { handleError } = useErrorHandler();
  const { setCode } = useLocalSearchParams();
  const [ cards, setCards ] = useState([]);
  const [ isLoading, setIsLoading ] = useState(false);

  const axiosPrivate = useAxiosPrivate();

  useEffect(() => {
    // get cards
    const getCardsFromPack = async () => {
      let response = null;
      setIsLoading(true);
      try {
        if (isLoggedIn) {
          response = await axiosPrivate.post(`/packs/open/set/${setCode}/type/play-booster`);
        } else {
          response = await axios.post(`/packs/open/set/${setCode}/type/play-booster`);
        }
        setCards(response.data.cards);
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
      source={images.dark_background_vertical_10}
      style={{
        resizeMode: "cover",
        overflow: "hidden",
      }}
    >
       <SafeAreaView className="h-screen justify-center">
  
        { cards.length > 0 && Platform.OS !== "web" && (
          <CardSwiper cards={cards} setCode={setCode}/>
        )}

        { cards.length > 0 && Platform.OS === "web" && (
          <CardFlipperWeb cards={cards} setCode={setCode}/>
        )}
  
        {isLoading && <LoadingSpinner />}
      </SafeAreaView>
    </ImageBackground>
    
  )

};

export default PlayBoosterPackOpening;