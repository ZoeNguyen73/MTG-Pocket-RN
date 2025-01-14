import { ImageBackground, Text, View, TouchableOpacity, FlatList } from "react-native";
import { useState, useEffect } from "react";
import { router, Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import DropDownPicker from "react-native-dropdown-picker";
import { SvgUri } from "react-native-svg";

import { useAuthContext } from "../../context/AuthProvider";
import { useErrorHandler } from "../../context/ErrorHandlerProvider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { images } from "../../constants";
import tailwindConfig from "../../tailwind.config";

import Button from "../../components/CustomButton/CustomButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import CardCollection from "../../components/Card/CardCollection";

const SetSelectionDropdown = ({ 
  setOptions,
  setSetOptions, 
  // open, 
  // setOpen, 
  selectedSet,
  setSelectedSet,
  handleChangeSetOption 
}) => {

  const lightText = tailwindConfig.theme.extend.colors.light.text;
  const lightBackground = tailwindConfig.theme.extend.colors.light.background;
  const textFont = tailwindConfig.theme.fontFamily.sans[0];

  const [ open, setOpen ] = useState(false);

  useEffect(() => {
    console.log("Dropdown mounting...")
  }, [])

  return (
    <DropDownPicker 
      open={open}
      value={selectedSet}
      items={setOptions}
      setOpen={setOpen}
      setValue={setSelectedSet}
      setItems={setSetOptions}
      multiple={false}
      onChangeValue={handleChangeSetOption}
      style={{ 
        backgroundColor: lightBackground,
        borderWidth: 0,
        paddingLeft: 10,
        minHeight: 28,
        borderRadius: 14,
        justifyContent: "center",
        alignItems: "center"
      }}
      listMode="MODAL"
      // modalAnimationType="slide"
      modalProps={{
        animationType: "slide",
      }}
      modalContentContainerStyle={{
        backgroundColor: lightBackground,
        padding: 10
      }}
      modalTitle="Select Set to display cards"
      dropDownContainerStyle={{ 
        backgroundColor: lightBackground, 
      }}
      labelProps={{
        numberOfLines: 1,
        paddingTop: 3,
      }}
      textStyle={{
        color: lightText,
        fontFamily: textFont,
        fontSize: 14,
        numberOfLines: 1
      }}
      listItemContainer={{
        height: 24,
        justifyContent: "center",
      }}
      ArrowDownIconComponent={() => <Feather name="chevron-down" size={24} color={lightText} />}
      ArrowUpIconComponent={() => <Feather name="chevron-up" size={24} color={lightText} />}
      TickIconComponent={() => <Feather name="check" size={24} color={lightText} />}
    />
  )
  
};

const StickyHeader = ({ 
  height, 
  cardCount, 
  totalValue,
  // dropdownOpen,
  // setDropdownOpen,
  setOptions,
  setSetOptions,
  selectedSet,
  setSelectedSet,
  handleChangeSetOption
}) => {
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

      <View className="pl-6 pr-6 mt-5 flex-row gap-3 items-end" style={{ height: 32 }}>
        <View className="flex-row gap-1">
          <MaterialCommunityIcons name="cards-outline" size={22} color="white" />
          <Text className="font-sans-semibold tracking-wide text-dark-text">
            {cardCount}
          </Text>
        </View>
        <View className="flex-row justify-center pr-5">
          <Feather name="dollar-sign" size={22} color="white" />
          <Text className="font-sans-semibold tracking-wide text-dark-text">
            {totalValue.toFixed(2)}
          </Text>
        </View>

        <View className="flex-1 justify-center">
          { setOptions.length > 0 && (
            <SetSelectionDropdown 
              setOptions={setOptions}
              setSetOptions={setSetOptions} 
              // open={dropdownOpen} 
              // setOpen={setDropdownOpen} 
              selectedSet={selectedSet}
              setSelectedSet={setSelectedSet}
              handleChangeSetOption={handleChangeSetOption} 
            />
          )}
        </View>
          
        {/* <TouchableOpacity 
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
        </TouchableOpacity> */}

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
  const [ setOptions, setSetOptions ] = useState([{ value: "all", label: "All Sets"}]);
  const [ selectedSet, setSelectedSet ] = useState("all");
  // const [ dropdownOpen, setDropdownOpen] = useState(false);
  const [ filteredCardList, setFilteredCardList ] = useState([]);

  const headerHeight = 150; 

  useEffect(() => {
    console.log("useEffect triggered...");
    const getUserCardsData = async () => {
      try {
        console.log("getUserCardsData...");
        setIsLoading(true);
        const response = await axiosPrivate.get(`/users/${auth.username}/cards`);
        let totalPrice = 0;
        const sets = [];
        const options = [];
        for (const card of response.data.user_cards) {
          const value = card.quantity * card.final_price;
          totalPrice += value;
          const setCode = card.card_id.set_id.code;
          if (!sets.includes(setCode)) {
            const option = {
              value: setCode,
              label: card.card_id.set_id.name,
              icon: () => <SvgUri width="20px" height="20px" uri={card.card_id.set_id.icon_svg_uri} />
            }
            options.push(option);
            sets.push(setCode);
          }
        }
        setCardList(response.data.user_cards);
        setSetOptions([{ value: "all", label: "All Sets"}, ...options]);
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

  const handleChangeSetOption = () => {
    if (selectedSet !== "all") {
      const filteredCards = cardList.filter((card) => card.card_id.set_id.code === selectedSet);
      setFilteredCardList(filteredCards);
    }
  };

  const updateFavourite = (id) => {
    const index = cardList.findIndex(card => card._id === id);
    cardList[index].is_favourite = !cardList[index].is_favourite;
  }; 

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
          <StickyHeader 
            height={headerHeight} 
            cardCount={cardList.length} 
            totalValue={totalValue}
            // dropdownOpen={dropdownOpen}
            // setDropdownOpen={setDropdownOpen}
            setOptions={setOptions}
            setSetOptions={setSetOptions}
            selectedSet={selectedSet}
            setSelectedSet={setSelectedSet}
            handleChangeSetOption={handleChangeSetOption} 
          />
          <CardCollection 
            cards={selectedSet === "all" ? cardList : filteredCardList } 
            headerHeight={headerHeight}
            updateFavourite={updateFavourite} 
          />
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