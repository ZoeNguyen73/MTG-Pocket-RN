import { ImageBackground, Text, View, TouchableOpacity, Modal } from "react-native";
import { useState, useEffect, useRef } from "react";
import { router, Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import DropDownPicker from "react-native-dropdown-picker";
import { SvgUri } from "react-native-svg";

import { useAuthContext } from "../../context/AuthProvider";
import { useErrorHandler } from "../../context/ErrorHandlerProvider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";

import { images } from "../../constants";
import tailwindConfig from "../../tailwind.config";
import { getFonts } from "../../utils/FontFamily";

import Button from "../../components/CustomButton/CustomButton";
import LoadingSpinner from "../../components/LoadingSpinner";
import CardCollection from "../../components/Card/CardCollection";

const fonts = getFonts();

const SetSelectionDropdown = ({ 
  setOptions,
  setSetOptions, 
  selectedSet,
  setSelectedSet,
  handleChangeSetOption 
}) => {

  const lightText = tailwindConfig.theme.extend.colors.light.text;
  const lightBackground = tailwindConfig.theme.extend.colors.light.background;

  const [ open, setOpen ] = useState(false);

  useEffect(() => {
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
        fontFamily: fonts.sans,
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
        <Text 
          className="mt-16 text-center font-serif-semibold tracking-wide text-light-yellow text-3xl"
          style={{ fontFamily: fonts.serifSemibold }}
        >
          My Cards
        </Text>
      </View>

      <View className="pl-6 pr-6 mt-5 flex-row gap-3 items-end" style={{ height: 32 }}>
        <View className="flex-row gap-1">
          <MaterialCommunityIcons name="cards-outline" size={22} color="white" />
          <Text 
            className="font-sans-semibold tracking-wide text-dark-text"
            style={{ fontFamily: fonts.sansSemibold }}
          >
            {cardCount}
          </Text>
        </View>
        <View className="flex-row justify-center pr-5">
          <Feather name="dollar-sign" size={22} color="white" />
          <Text 
            className="font-sans-semibold tracking-wide text-dark-text"
            style={{ fontFamily: fonts.sansSemibold }}
          >
            {totalValue.toFixed(2)}
          </Text>
        </View>

        <View className="flex-1 justify-center">
          { setOptions.length > 0 && (
            <SetSelectionDropdown 
              setOptions={setOptions}
              setSetOptions={setSetOptions} 
              selectedSet={selectedSet}
              setSelectedSet={setSelectedSet}
              handleChangeSetOption={handleChangeSetOption} 
            />
          )}
        </View>

      </View>
      
    </View>
  )
};

const SortOptionsModal = ({ 
  modalVisible, 
  setModalVisible, 
  sortType, 
  sortDirection, 
  sortIconMapping,
  handleChangeSorting 
}) => {

  const darkYellow = tailwindConfig.theme.extend.colors.light["dark-yellow"];

  const typeRef = useRef(sortType);
  const directionRef = useRef(sortDirection);

  const handleChangeSortOption = (selectedSortType) => {
    if (selectedSortType !== sortType) {
      typeRef.current = selectedSortType;
      handleChangeSorting({
        sortType: selectedSortType,
        sortDirection: directionRef.current,
      });
    } else {
      if (sortDirection === "asc") {
        directionRef.current = "desc";
        handleChangeSorting({
          sortType: typeRef.current,
          sortDirection: "desc",
        });
      } else {
        directionRef.current = "asc";
        handleChangeSorting({
          sortType: typeRef.current,
          sortDirection: "asc",
        });
      }
    }
    setTimeout(() => { setModalVisible(false) }, 500);
  };

  return (
    <Modal 
      animationType="slide"
      visible={modalVisible}
      onRequestClose={() => {
        setModalVisible(false);
      }}
      onDismiss={() => {
        setModalVisible(false);
      }}
      transparent={true}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <View className="pl-5 pr-5 pt-8 h-1/2 bg-light-background">
          <View className="flex-row items-center">
            <Text 
              className="flex-1 font-sans text-lg tracking-wide"
              style={{
                fontFamily: fonts.sans
              }}
            >
              Sort by
            </Text>
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
            >
              <Feather name="x" size={28} color="black" />
            </TouchableOpacity>
          </View>
          
          <View
            style={{
              height: 1,
              borderTopWidth: 1,
              borderColor: "black",
              width: "100%",
              marginTop: 10,
              paddingTop: 15,
              paddingBottom: 15
            }}
          />
          <View className="flex-column gap-4 items-end">
            { Object.keys(sortIconMapping).map(key => (
              <TouchableOpacity
                key={key}
                className="flex-row justify-end w-[100%] gap-2 items-center pr-5 pt-2 pb-2"
                style={{ 
                  backgroundColor: typeRef.current === key ? tailwindConfig.theme.extend.colors.dark.yellow : "transparent", 
                  borderRadius: 8 
                }}
                onPress={() => handleChangeSortOption(key)}
              >
                <Text className="text-lg tracking-wide"
                  style={{
                    fontFamily: typeRef.current === key ? fonts.sansBold : fonts.sans,
                    color: typeRef.current === key ? darkYellow : tailwindConfig.theme.extend.colors.light.text
                  }}
                >
                  {key}
                </Text>
                <MaterialCommunityIcons  
                  name={sortIconMapping[key]} 
                  size={25} 
                  color={typeRef.current === key ? darkYellow : tailwindConfig.theme.extend.colors.light.text}
                />
                { typeRef.current === key && directionRef.current === "asc" && (
                  <Feather name="arrow-up" size={25} color="black"/>
                )}
                { typeRef.current === key && directionRef.current === "desc" && (
                  <Feather name="arrow-down" size={25} color="black"/>
                )}
                { typeRef.current !== key && (
                  <View style={{ width: 25 }}/>
                )}
              </TouchableOpacity>
            ))}
          </View>
          
        </View>
      </View>
      
    </Modal>
  )
};

const SortButton = ({ 
  sortType, 
  sortDirection, 
  sortIconName,
  sortIconMapping ,
  handleChangeSorting
}) => {
  const [ modalVisible, setModalVisible ] = useState(false);
  return (
    <>
      <View
        style={{
          position: "absolute",
          right: 20,
          bottom: 100,
          height: 40,
          width: 80,
          backgroundColor: "#FFFFFF",
          borderRadius: 20,
          shadowColor: "#000000",
          shadowOffset: {width: 0, height: 1},
          shadowRadius: 5,
          elevation: 5
        }}
      >
        <TouchableOpacity 
          style={{
            height: "100%",
            width: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
          onPress={() => setModalVisible(true)}
        >
          <View className="flex-row justify-center items-center">
            <MaterialCommunityIcons name={sortIconName} size={25} color="black" />
            { sortDirection === "asc" && (
              <Feather name="arrow-up" size={25} color="black"/>
            )}
            { sortDirection === "desc" && (
              <Feather name="arrow-down" size={25} color="black"/>
            )}
          </View>
          
        </TouchableOpacity>
      </View>
      <SortOptionsModal 
        modalVisible={modalVisible} 
        setModalVisible={setModalVisible} 
        sortType={sortType} 
        sortDirection={sortDirection} 
        sortIconMapping={sortIconMapping}
        handleChangeSorting={handleChangeSorting} 
      />
    </>
    
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
  const [ sortType, setSortType ] = useState("time");
  const [ sortDirection, setSortDirection ] = useState("desc");
  const [ filteredCardList, setFilteredCardList ] = useState([]);

  const headerHeight = 150;
  
  const sortIconMapping = {
    "time": "clock-outline",
    "alphabetical": "alphabetical",
    "quantity": "numeric",
    "price": "gold",
    // "rarity": "star",
  };

  useEffect(() => {
    const getUserCardsData = async () => {
      try {
        setIsLoading(true);
        const response = await axiosPrivate.get(`/users/${auth.username}/cards`);
        let totalPrice = 0;
        const rawCardData = response.data.user_cards;
        const sets = [];
        const options = [];
        for (const card of rawCardData) {
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

        // by default, sort by latest_add_time in desc order
        rawCardData.sort((a, b) => {
          return Date.parse(b.latest_add_time) - Date.parse(a.latest_add_time);
        });

        setCardList(rawCardData);
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

  const handleChangeSorting = ({ sortType, sortDirection }) => {
    let sortedCardList;
    if (sortType === "time" && sortDirection === "desc") {
      sortedCardList = cardList.slice().sort((a, b) => {
        return Date.parse(b.latest_add_time) - Date.parse(a.latest_add_time);
      });
    } else if (sortType === "time" && sortDirection === "asc") {
      sortedCardList = cardList.slice().sort((a, b) => {
        return Date.parse(a.latest_add_time) - Date.parse(b.latest_add_time);
      });
    } else if (sortType === "alphabetical" && sortDirection === "desc") {
      sortedCardList = cardList.slice().sort((a, b) => {
        return a.card_id.card_faces[0].name.toLowerCase() < b.card_id.card_faces[0].name.toLowerCase() ?  1 : -1;
      });
    } else if (sortType === "alphabetical" && sortDirection === "asc") {
      sortedCardList = cardList.slice().sort((a, b) => {
        return a.card_id.card_faces[0].name.toLowerCase() < b.card_id.card_faces[0].name.toLowerCase() ?  -1 : 1;
      });
    } else if (sortType === "quantity" && sortDirection === "desc") {
      sortedCardList = cardList.slice().sort((a, b) => {
        return b.quantity - a.quantity;
      });
    } else if (sortType === "quantity" && sortDirection === "asc") {
      sortedCardList = cardList.slice().sort((a, b) => {
        return a.quantity - b.quantity;
      });
    } else if (sortType === "price" && sortDirection === "desc") {
      sortedCardList = cardList.slice().sort((a, b) => {
        return parseFloat(b.final_price) - parseFloat(a.final_price);
      });
    } else if (sortType === "price" && sortDirection === "asc") {
      sortedCardList = cardList.slice().sort((a, b) => {
        return parseFloat(a.final_price) - parseFloat(b.final_price);
      });
    }

    if (selectedSet !== "all") {
      const filteredCards = sortedCardList.filter((card) => card.card_id.set_id.code === selectedSet);
      setFilteredCardList(filteredCards);
    }

    setCardList(sortedCardList);
    setSortType(sortType);
    setSortDirection(sortDirection); 

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
          <SortButton 
            sortType={sortType}
            sortIconName={sortIconMapping[sortType]}
            sortDirection={sortDirection}
            sortIconMapping={sortIconMapping}
            handleChangeSorting={handleChangeSorting}
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