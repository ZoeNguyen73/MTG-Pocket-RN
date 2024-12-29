import { View, Text, Platform } from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "../../../api/axios";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

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
    <>
       <SafeAreaView className="bg-dark-background">
          { cards.length === 0 && (
            <Text>Loading...</Text>
          )}
    
          { cards.length > 0 && Platform.OS !== "web" && (
            <CardSwiper cards={cards} />
          )}

          { cards.length > 0 && Platform.OS === "web" && (
            <CardFlipperWeb cards={cards} />
          )}
    
          {isLoading && <LoadingSpinner />}
        </SafeAreaView>
    </>
    
  )

};

export default PlayBoosterPackOpening;