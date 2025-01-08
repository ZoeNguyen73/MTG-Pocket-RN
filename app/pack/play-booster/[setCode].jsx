import { View, Text, Platform, ImageBackground } from "react-native";
import React, { useState, useEffect, useCallback, useRef } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import { Audio } from "expo-av";

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
  const packOpeningBgSoundRef = useRef();

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

  // manage sound with navigation events
  // useFocusEffect(
  //   useCallback(() => {
  //     const playSound = async () => {
  //       try {
  //         // Unload any existing sound before playing a new one
  //         if (packOpeningBgSoundRef.current) {
  //           await packOpeningBgSoundRef.current.unloadAsync();
  //           packOpeningBgSoundRef.current = null;
  //         }

  //         const { sound } = await Audio.Sound.createAsync(
  //           require("../../../assets/sounds/Rise_of_Kingdoms.mp3"),
  //           { shouldPlay: true, isLooping: true }
  //         );
  //         packOpeningBgSoundRef.current = sound;
  //         await sound.setVolumeAsync(0.5);
  //         await sound.playAsync();
  //       } catch (error) {
  //         console.error("Error playing sound:", error);
  //       }
  //     };

  //     playSound();

  //     // Cleanup: Unload sound when leaving the screen
  //     return () => {
  //       if (packOpeningBgSoundRef.current) {
  //         packOpeningBgSoundRef.current.unloadAsync();
  //         packOpeningBgSoundRef.current = null;
  //       }
  //     };

  //   }, [])
  // );

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