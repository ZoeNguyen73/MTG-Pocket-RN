import { ImageBackground, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { router, Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DropDownPicker from "react-native-dropdown-picker";

import { useAuthContext } from "../../context/AuthProvider";
import { useErrorHandler } from "../../context/ErrorHandlerProvider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { images } from "../../constants";

import Button from "../../components/CustomButton/CustomButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import CardCollection from "../../components/Card/CardCollection";

const SetSelectionDropdown = ({ sets }) => {

};

const StickyHeader = ({ height, cardCount, totalValue }) => {
  return (
    <View
      style={{
        position: "absolute",
        width: "100%",
        height: height,
        top: 0,
        left: 0,
        backgroundColor: "rgba(22, 26, 33, 0.9)",
        zIndex: 5,
        borderBottomLeftRadius: 15,
        borderBottomRightRadius: 15,
      }}
    >
      <View>
        <Text className="mt-16 text-center font-serif-semibold tracking-wide text-light-yellow text-3xl">
          My Cards
        </Text>
      </View>

      <View className="pl-6 pr-6 mt-5 flex-row gap-3 items-center" style={{ height: 32 }}>
        <View className="flex-row gap-1">
          <MaterialCommunityIcons name="cards-outline" size={22} color="white" />
          <Text className="font-sans-semibold tracking-wide text-dark-text">
            {cardCount}
          </Text>
        </View>
        <View className="flex-row justify-center">
          <Feather name="dollar-sign" size={22} color="white" />
          <Text className="font-sans-semibold tracking-wide text-dark-text">
            {totalValue.toFixed(2)}
          </Text>
        </View>
        <View className="flex-1"></View>
          
        <TouchableOpacity 
          style={{
            height: "100%",
            width: 32,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Feather name="filter" size={22} color="white" />
        </TouchableOpacity>

        <TouchableOpacity
          style={{
            height: "100%",
            width: 32,
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <FontAwesome name="sort" size={22} color="white" />
        </TouchableOpacity>
      </View>
      
    </View>
  )
};

const Collection = () => {
  const { auth } = useAuthContext();
  const { handleError } = useErrorHandler();
  const axiosPrivate = useAxiosPrivate();

  const [ cardList, setCardList ] = useState([]);
  const [ totalValue, setTotalValue ] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ setOptions, setSetOptions ] = useState([]);

  const headerHeight = 150; 

  useEffect(() => {
    const getUserCardsData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(`/users/${auth.username}/cards`);
        let totalPrice = 0;
        for (const card of response.data.user_cards) {
          const value = card.quantity * card.final_price;
          totalPrice += value;
        }
        setCardList(response.data.user_cards);
        setTotalValue(totalPrice);
      } catch (error) {
        await handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    if (auth?.username) {
      getUserCardsData();
    }
    
  }, [auth?.username]);

  return (
    <ImageBackground
      source={images.dark_background_vertical_5}
      style={{
        resizeMode: "cover",
        overflow: "hidden",
      }}
    >
      { auth?.username && !isLoading && cardList.length > 0 && (
        <View className="h-screen justify-center">
          <StickyHeader height={headerHeight} cardCount={cardList.length} totalValue={totalValue} />
          <CardCollection cards={cardList} headerHeight={headerHeight} />
        </View>
      )}

      { auth?.username && isLoading && (<LoadingSpinner />)} 
      
      { !auth?.username && (
        <View className="h-screen justify-center items-center">
          <Text className="text-center font-sans-semibold text-xl text-dark-text">
            Log in to access your cards collection
          </Text>
          <Button 
            title="Log in"
            handlePress={()=> router.push("/log-in")}
            containerStyles="mt-10 w-[120]"
          />
          <View className="justify-center gap-2 pt-5 flex-row mt-1 mb-5">
            <Text className="text-sm text-dark-text font-sans tracking-wide">
              Don't have an account?
            </Text>
            <Link
              href="/register"
              className="text-sm font-sans-bold text-dark-links"
            > 
              Register for free
            </Link>
          </View>
        </View>
      )} 

    </ImageBackground>
  )
};

export default Collection;