import { ImageBackground, Text, View, TouchableOpacity, Modal, Switch, Pressable, TextInput, Platform} from "react-native";
import { useState, useEffect, useMemo } from "react";
import { router, Link } from "expo-router";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import Feather from "@expo/vector-icons/Feather";
import DropDownPicker from "react-native-dropdown-picker";
import { SvgUri } from "react-native-svg";

import { useAuthContext } from "../../context/AuthProvider";
import { useErrorHandler } from "../../context/ErrorHandlerProvider";
import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import useDeviceLayout from "../../hooks/useDeviceLayout";

import { images } from "../../constants";
import tailwindConfig from "../../tailwind.config";
import { getFonts } from "../../utils/FontFamily";
import { soundManager } from "../../utils/SoundManager";

import Button from "../../components/CustomButton/CustomButton";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import CardCollection from "../../components/Card/CardCollection";
import SmallLoadingSpinner from "../../components/SmallLoadingSpinner";
import CardSlideshow from "../../components/Card/CardSlideshow";

const fonts = getFonts();

const SetSelectionDropdown = ({ 
  setOptions,
  setSetOptions, 
  selectedSet,
  setSelectedSet,
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
  width, 
  cardCount, 
  totalValue,
  setOptions,
  setSetOptions,
  selectedSet,
  setSelectedSet,
  showFavourites,
  setShowFavourites,
  isDesktopWeb,
  isNative,
  screenWidth,
  searchInput,
  setSearchInput,
  commitSearch,
  clearSearch,
  searchQuery,
}) => {
  const lightYellow = tailwindConfig.theme.extend.colors.light.yellow;
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
        alignItems: "center"
      }}
    >
      <View className={`${(isNative || isDesktopWeb) ? "mt-16" : "mt-8"}`}>
        <Text 
          className="text-center font-serif-semibold tracking-wide text-light-yellow text-3xl"
          style={{ 
            fontFamily: fonts.serifSemibold,
          }}
        >
          My Cards
        </Text>
      </View>

      <View className="pl-6 pr-6 mt-5 flex-row gap-3 items-end" style={{ height: 32, width: width }}>
        <View className="flex-row justify-center gap-1 items-center">
          <MaterialCommunityIcons name="cards-outline" size={screenWidth < 400 ? 15 : 20 } color="white" />
          <Text 
            className={`font-sans-semibold tracking-wide text-dark-text
              ${screenWidth < 400 ? "text-xs" : "text-sm"}
            `}
            style={{ fontFamily: fonts.sansSemibold }}
          >
            {cardCount}
          </Text>
        </View>
        <View className="flex-row justify-center pr-5 items-center">
          <Feather name="dollar-sign" size={screenWidth < 400 ? 13 : 17 } color="white" />
          <Text 
            className={`font-sans-semibold tracking-wide text-dark-text
              ${screenWidth < 400 ? "text-xs" : "text-sm"}
            `}
            style={{ fontFamily: fonts.sansSemibold }}
          >
            {totalValue.toFixed(2)}
          </Text>
        </View>
        
        {/* search bar */}
        {isDesktopWeb && (
          <View className="flex-1 pr-5">
            <View className="flex-row gap-2 items-center">
              <TextInput
                className="font-sans-light text-dark-text tracking-wide text-sm bg-dark-surface" 
                value={searchInput}
                onChangeText={setSearchInput}
                placeholder="Search..."
                style={{
                  flex: 1,
                  height: 20,
                  borderRadius: 10,
                  paddingHorizontal: 5,
                }}
                returnKeyType="search"
                onSubmitEditing={commitSearch}
                onKeyPress={(e) => {
                  if (isDesktopWeb && e?.nativeEvent?.key === "Enter") {
                    commitSearch();
                  }
                }}
              />

              <Pressable
                onPress={commitSearch}
                style={{
                  height: 20,
                  paddingHorizontal: 5,
                  borderRadius: 10,
                  backgroundColor: "rgba(253, 253, 253, 0.8)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text className="text-light-text text-sm font-sans">
                  Search
                </Text>
              </Pressable>

              {!!searchQuery && (
                <Pressable
                  onPress={clearSearch}
                  style={{
                    height: 20,
                    paddingHorizontal: 5,
                    borderRadius: 10,
                    backgroundColor: "rgba(255,255,255,0.18)",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text className="text-dark-text text-sm font-sans">
                    Clear
                  </Text>
                </Pressable>
              )}
            </View>
          </View>
        )}

        {!isDesktopWeb && (<View className="flex-1"/>)}

        {/* favourite toggle */}
        <Text
          className={`font-sans-semibold tracking-wide text-dark-text text-right
            ${screenWidth < 400 ? "text-xs" : "text-sm"}
          `}
          style={{ fontFamily: fonts.sans }}
        >
          Show Favourites
        </Text>
        <View
          style={{
            justifyContent: "center", 
            alignItems: "center",
            height: 15 
          }}
        >
          
          <Switch
            trackColor={{ false: '#767577', true: lightYellow }}
            thumbColor={showFavourites? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={() => setShowFavourites(prev => !prev)}
            value={showFavourites}
            style={{ height: 15, width: 40}}
          />
        </View>

      </View>

      {!isDesktopWeb && (
        <View className="px-6 py-2 w-full">
          <View className="flex-row gap-2 items-center">
            <TextInput
              className="font-sans-light text-dark-text tracking-wide text-sm bg-dark-surface" 
              value={searchInput}
              onChangeText={setSearchInput}
              placeholder="Search..."
              style={{
                flex: 1,
                height: 32,
                borderRadius: 16,
                paddingVertical: 2,
                paddingLeft: 10,
                backgroundColor: "rgba(255,255,255,0.12)",
                color: "white",           // ✅ IMPORTANT: makes typed text visible on native
                fontFamily: fonts.sans,   // optional but recommended for consistency
                fontSize: 14,
              }}
              returnKeyType="search"
              onSubmitEditing={commitSearch}
            />

            <Pressable
              onPress={commitSearch}
              style={{
                height: 20,
                paddingHorizontal: 5,
                borderRadius: 10,
                backgroundColor: "rgba(253, 253, 253, 0.8)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text 
                className="text-light-text text-sm font-sans"
                style={{ fontFamily: fonts.sans}}
              >
                Search
              </Text>
            </Pressable>

            {!!searchQuery && (
              <Pressable
                onPress={clearSearch}
                style={{
                  height: 20,
                  paddingHorizontal: 5,
                  borderRadius: 10,
                  backgroundColor: "rgba(255,255,255,0.18)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text className="text-dark-text text-sm font-sans" style={{ fontFamily: fonts.sans}}>
                  Clear
                </Text>
              </Pressable>
            )}
          </View>
        </View>
      )}

      <View className="pl-6 pr-6 mt-2 flex-row gap-3 items-end" style={{ height: 32, width: width }}>
        <View className="flex-1 justify-center">
          { setOptions.length > 0 && (
            <SetSelectionDropdown 
              setOptions={setOptions}
              setSetOptions={setSetOptions} 
              selectedSet={selectedSet}
              setSelectedSet={setSelectedSet}
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
  handleChangeSorting,
}) => {

  // const [currentSortType, setCurrentSortType] = useState(sortType);
  // const [currentSortDirection, setCurrentSortDirection] = useState(sortDirection);

  const darkYellow = tailwindConfig.theme.extend.colors.light["dark-yellow"];

  // const handleUIUpdate = (selectedSortType, selectedSortDirection) => {
  //   if (selectedSortType !== currentSortType) {
  //     setCurrentSortType(selectedSortType);
  //   } else {
  //     setCurrentSortDirection(selectedSortDirection);
  //   }
  // };

  // const handleSortAndCloseModal = (selectedSortType, selectedSortDirection) => {
  //   handleChangeSorting({
  //     sortType: selectedSortType,
  //     sortDirection: selectedSortDirection,
  //   });
  //   setTimeout(() => {
  //     setIsLoading(false);
  //     setModalVisible(false);
  //   }, 10); // Slight delay for user to see the change before closing
  // };
  
  // const handleChangeSortOption = async (selectedSortType) => {
  //   setIsLoading(true);
  //   let selectedSortDirection = currentSortDirection;
  //   if (selectedSortType === currentSortType) {
  //     selectedSortDirection = currentSortDirection === "asc" ? "desc" : "asc";
  //   }
  //   handleUIUpdate(selectedSortType, selectedSortDirection);
  //   setTimeout(() => handleSortAndCloseModal(selectedSortType, selectedSortDirection), 20);
  // };

  // useEffect(() => {
  //   // Keep the state in sync with props when modal opens
  //   if (modalVisible) {
  //     setCurrentSortType(sortType);
  //     setCurrentSortDirection(sortDirection);
  //   }
  // }, [modalVisible, sortType, sortDirection]);

  const handleChangeSortOption = (selectedSortType) => {
    const nextDirection =
      selectedSortType === sortType
        ? sortDirection === "asc"
          ? "desc"
          : "asc"
        : sortDirection; // keep direction when switching type (or set default if you prefer)

    handleChangeSorting({
      sortType: selectedSortType,
      sortDirection: nextDirection,
    });

    setModalVisible(false);
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
              className="font-sans text-lg tracking-wide pr-2"
              style={{
                fontFamily: fonts.sans
              }}
            >
              Sort by
            </Text>
            {/* {isLoading && (
              <SmallLoadingSpinner />
            )} */}
            <View className="flex-1"></View>
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
                  backgroundColor: sortType === key ? tailwindConfig.theme.extend.colors.dark.yellow : "transparent",
                  borderRadius: 8 
                }}
                onPress={() => handleChangeSortOption(key)}
              >
                <Text className="text-lg tracking-wide"
                  style={{
                    fontFamily: sortType === key ? fonts.sansBold : fonts.sans,
                    color: sortType === key ? darkYellow : tailwindConfig.theme.extend.colors.light.text
                  }}
                >
                  {key}
                </Text>
                <MaterialCommunityIcons  
                  name={sortIconMapping[key]} 
                  size={25} 
                  // color={typeRef.current === key ? darkYellow : tailwindConfig.theme.extend.colors.light.text}
                  color={sortType === key ? darkYellow : tailwindConfig.theme.extend.colors.light.text}
                />
                { sortType === key && sortDirection === "asc" && (
                  <Feather name="arrow-up" size={25} color="black"/>
                )}
                { sortType === key && sortDirection === "desc" && (
                  <Feather name="arrow-down" size={25} color="black"/>
                )}
                { sortType !== key && (
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
  handleChangeSorting,
  isDesktopWeb,
  screenWidth,
}) => {
  const [ modalVisible, setModalVisible ] = useState(false);
  return (
    <>
      <View
        style={{
          position: "absolute",
          right: isDesktopWeb ? screenWidth / 8 : 20,
          bottom: isDesktopWeb ? 50 : 150,
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

  const [ fullCardList, setFullCardList ] = useState([]);
  const [ filteredCardList, setFilteredCardList ] = useState([]);

  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  const [ totalValue, setTotalValue ] = useState(0);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ setOptions, setSetOptions ] = useState([{ value: "all", label: "All Sets"}]);
  const [ selectedSet, setSelectedSet ] = useState("all");
  const [ sortType, setSortType ] = useState("time");
  const [ sortDirection, setSortDirection ] = useState("desc");
  const [ showFavourites, setShowFavourites ] = useState(false);
  const [ showSlideshow, setShowSlideshow ] = useState(false);
  const [ currentCardIndex, setCurrentCardIndex ] = useState(null);

  const { isDesktopWeb, isNative, width } = useDeviceLayout();
  const headerHeight = isDesktopWeb ? 210 : 240;
  
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
        const sets = {};
        for (const card of rawCardData) {
          const value = card.quantity * card.final_price;
          totalPrice += value;
          const setCode = card.card_id.set_id.code;
          const setName = card.card_id.set_id.name;
          if (sets[setCode]) {
            sets[setCode].cardCount += card.quantity;
          } else {
            sets[setCode] = {
              value: setCode,
              label: setName,
              icon: () => <SvgUri width="20px" height="20px" uri={card.card_id.set_id.icon_svg_uri} />,
              cardCount: card.quantity
            }
          }
        }

        const optionsArr = Object.values(sets);
        optionsArr.sort((a, b) => {
          return a.label.toLowerCase() > b.label.toLowerCase() ? 1 : -1;
        });

        const formattedOptions = optionsArr.map((o) => { 
          return { value: o.value, icon: o.icon, label: `${o.label} (${o.cardCount} cards)`}
        });

        // by default, sort by latest_add_time in desc order
        rawCardData.sort((a, b) => {
          return Date.parse(b.latest_add_time) - Date.parse(a.latest_add_time);
        });

        // console.log("sample 1st card: " + JSON.stringify(rawCardData[0]));

        // initialize the card list
        setFullCardList(rawCardData);
        // setFilteredCardList(rawCardData);
        setSetOptions([{ value: "all", label: "All Sets" }, ...formattedOptions]);
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

  const commitSearch = () => {
    setSearchQuery(searchInput);
    // optional: reset slideshow index
    setCurrentCardIndex(0);
  };

  const clearSearch = () => {
    setSearchInput("");
    setSearchQuery("");
  };

  const matchesSearch = (userCard, query) => {
    if (!query) return true;
    const q = query.trim().toLowerCase();
    if (!q) return true;
    console.log("query: " + q);
    const name = userCard?.card_id?.card_faces?.[0]?.name?.toLowerCase?.() ?? "";
    const typeLine = userCard?.card_id?.card_faces?.[0]?.type_line?.toLowerCase?.() ?? "";
    return name.includes(q) || typeLine.includes(q);
    // return name.includes(q);
  };

  const toPriceNumber = (value) => {
    if (value === null || value === undefined) return null;

    if (typeof value === "number") return Number.isFinite(value) ? value : null;

    const cleaned = String(value).replace(/[^0-9.\-]/g, "");
    if (!cleaned) return null;

    const num = Number(cleaned);
    return Number.isFinite(num) ? num : null;
  };

  const sortCardList = ({ sortType, sortDirection }) => {
    let sortedCardList = [];
    // console.log("sortCardList - sample card: " + JSON.stringify(fullCardList[0]));
    if (sortType === "time" && sortDirection === "desc") {
      sortedCardList = fullCardList.slice().sort((a, b) => {
        return Date.parse(b.latest_add_time) - Date.parse(a.latest_add_time);
      });
    } else if (sortType === "time" && sortDirection === "asc") {
      sortedCardList = fullCardList.slice().sort((a, b) => {
        return Date.parse(a.latest_add_time) - Date.parse(b.latest_add_time);
      });
    } else if (sortType === "alphabetical" && sortDirection === "desc") {
      sortedCardList = fullCardList.slice().sort((a, b) => {
        return a.card_id.card_faces[0].name.toLowerCase() < b.card_id.card_faces[0].name.toLowerCase() ?  1 : -1;
      });
    } else if (sortType === "alphabetical" && sortDirection === "asc") {
      sortedCardList = fullCardList.slice().sort((a, b) => {
        return a.card_id.card_faces[0].name.toLowerCase() < b.card_id.card_faces[0].name.toLowerCase() ?  -1 : 1;
      });
    } else if (sortType === "quantity" && sortDirection === "desc") {
      sortedCardList = fullCardList.slice().sort((a, b) => {
        return b.quantity - a.quantity;
      });
    } else if (sortType === "quantity" && sortDirection === "asc") {
      sortedCardList = fullCardList.slice().sort((a, b) => {
        return a.quantity - b.quantity;
      });
    } else if (sortType === "price" && sortDirection === "desc") {
      sortedCardList = fullCardList.slice().sort((a, b) => {
        const pa = toPriceNumber(a.final_price);
        const pb = toPriceNumber(b.final_price);

        // Put invalid / missing prices last
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1;
        if (pb === null) return -1;

        return pb - pa;
      });
    } else if (sortType === "price" && sortDirection === "asc") {
      sortedCardList = fullCardList.slice().sort((a, b) => {
        const pa = toPriceNumber(a.final_price);
        const pb = toPriceNumber(b.final_price);

        // Put invalid / missing prices last
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1;
        if (pb === null) return -1;

        return pa - pb;
      });
    }

    return sortedCardList;
  };

  const sortCards = (list, { sortType, sortDirection }) => {
    const arr = list.slice();

    if (sortType === "time") {
      arr.sort((a, b) =>
        sortDirection === "desc"
          ? Date.parse(b.latest_add_time) - Date.parse(a.latest_add_time)
          : Date.parse(a.latest_add_time) - Date.parse(b.latest_add_time)
      );
    }

    if (sortType === "alphabetical") {
      arr.sort((a, b) => {
        const an = (a.card_id?.card_faces?.[0]?.name ?? "").toLowerCase();
        const bn = (b.card_id?.card_faces?.[0]?.name ?? "").toLowerCase();
        return sortDirection === "desc" ? bn.localeCompare(an) : an.localeCompare(bn);
      });
    }

    if (sortType === "quantity") {
      arr.sort((a, b) =>
        sortDirection === "desc" ? b.quantity - a.quantity : a.quantity - b.quantity
      );
    }

    if (sortType === "price") {
      arr.sort((a, b) => {
        const pa = toPriceNumber(a.final_price);
        const pb = toPriceNumber(b.final_price);

        // invalid last
        if (pa === null && pb === null) return 0;
        if (pa === null) return 1;
        if (pb === null) return -1;

        return sortDirection === "desc" ? pb - pa : pa - pb;
      });
    }

    return arr;
  };
  
  const updateFilterCardList = ({
    selectedSortType = null, // null if no change to current logic
    selectedSortDirection = null,
    showFav = null,
    selectedSetOption = null,
  }) => {

    const finalSortType = selectedSortType ? selectedSortType : sortType ;
    const finalSortDirection = selectedSortDirection ? selectedSortDirection : sortDirection;
    const needSort = finalSortDirection !== "desc" || finalSortType !== "time" || (finalSortType !== "time" && finalSortDirection !== "desc");

    const needFilterFav = showFav !== null ? showFav : showFavourites;

    const finalSelectedSet = selectedSetOption ? selectedSetOption : selectedSet;
    const needFilterSet = finalSelectedSet !== "all";

    let sortedCardList = null;
    if (needSort) {
      sortedCardList = sortCardList({ sortType: finalSortType, sortDirection: finalSortDirection });
    }

    let filteredCardList = null;


    if (needFilterFav) {
      if (needFilterSet) {
        if (needSort) {
          filteredCardList = sortedCardList.filter((card) => card.card_id.set_id.code === finalSelectedSet && card.is_favourite);
        } else {
          filteredCardList = fullCardList.filter((card) => card.card_id.set_id.code === finalSelectedSet && card.is_favourite);
        }
      } else {
        if (needSort) {
          filteredCardList = sortedCardList.filter((card) => card.is_favourite);
        } else {
          filteredCardList = fullCardList.filter((card) => card.is_favourite);
        }
      }
    } else {
      if (needFilterSet) {
        if (needSort) {
          filteredCardList = sortedCardList.filter((card) => card.card_id.set_id.code === finalSelectedSet);
        } else {
          filteredCardList = fullCardList.filter((card) => card.card_id.set_id.code === finalSelectedSet);
        }
      } else {
        if (needSort) {
          filteredCardList = sortedCardList;
        } else {
          setFilteredCardList(fullCardList);
          setSortType(finalSortType);
          setSortDirection(finalSortDirection);
          setShowFavourites(needFilterFav);
          setSelectedSet(finalSelectedSet);
          return; 
        }
      }
    }

    setFilteredCardList(filteredCardList);
    setSortType(finalSortType);
    setSortDirection(finalSortDirection);
    setShowFavourites(needFilterFav);

  };

  const displayedCards = useMemo(() => {
    let list = fullCardList;

    // filter by set
    if (selectedSet !== "all") {
      list = list.filter((c) => c.card_id?.set_id?.code === selectedSet);
    }

    // filter: favourites
    if (showFavourites) {
      list = list.filter((c) => c.is_favourite);
    }

    // filter: search (committed query)
    if (searchQuery.trim()) {
      list = list.filter((c) => matchesSearch(c, searchQuery));
    }

    // sort
    list = sortCards(list, { sortType, sortDirection });

    return list;
  }, [fullCardList, selectedSet, showFavourites, searchQuery, sortType, sortDirection]);

  const handleChangeShowFavourites = () => {
    // console.log(`handleChangeShowFavourites from ${showFavourites} to ${!showFavourites}`);
    updateFilterCardList({ selectedSortType: null, selectedSortDirection: null, showFav: !showFavourites, selectedSetOption: null});
  };

  const handleChangeSorting = ({ sortType, sortDirection }) => {
    setSortType(sortType);
    setSortDirection(sortDirection);
  };

  const startSlideshow = (index) => {
    console.log("starting slideshow at index: " + index);
    setCurrentCardIndex(index);
    setShowSlideshow(true);
  };

  const stopSlideshow = () => {
    setCurrentCardIndex(null);
    setShowSlideshow(false);
  };

  const updateFavourite = async (id) => {
    try {
      soundManager.playSfx("happy-pop-1");
      const target = fullCardList.find(card => card._id === id);
      if (!target) throw new Error("Card not found in local list.");
      const is_favourite = target.is_favourite;
      if (auth?.username && is_favourite) {
        await axiosPrivate.put(`/users/${auth.username}/cards/favourites/remove/${id}`);
      } else if (auth?.username && !is_favourite) {
        await axiosPrivate.put(`/users/${auth.username}/cards/favourites/add/${id}`);
      } else {
        throw new Error("Missing authentication details. Please log in again.");
      }

      setFullCardList((prev) =>
        prev.map((card) => card._id === id ? {...card, is_favourite: !card.is_favourite} : card)
      );
    } catch (error) {
      await handleError(error);
    }
    
  };

  

  return (
    <ImageBackground
      source={images.background_lowryn_eclipsed}
      className="flex-1"
      resizeMode="cover"
      style={{
        flex: 1,
        width: "100%"
      }}
    >
      <View className="absolute inset-0 bg-black/75" />

      { auth?.username && !isLoading && (
        <View 
          className="h-screen justify-center"
        >
          <StickyHeader 
            height={headerHeight}
            width={ isDesktopWeb ? "80%" : "100%"} 
            cardCount={fullCardList.length} 
            totalValue={totalValue}
            setOptions={setOptions}
            setSetOptions={setSetOptions}
            selectedSet={selectedSet}
            setSelectedSet={setSelectedSet}
            setShowFavourites={setShowFavourites}
            showFavourites={showFavourites}
            isNative={isNative}
            isDesktopWeb={isDesktopWeb}
            screenWidth={width} 
            searchInput={searchInput}
            setSearchInput={setSearchInput}
            commitSearch={commitSearch}
            clearSearch={clearSearch}
            searchQuery={searchQuery}
          />

          <CardCollection 
            cards={displayedCards} 
            headerHeight={headerHeight}
            updateFavourite={updateFavourite}
            listWidth={ isDesktopWeb ? "80%" : "100%" }
            startSlideshowDesktop={startSlideshow} 
          />

          <SortButton 
            sortType={sortType}
            sortIconName={sortIconMapping[sortType]}
            sortDirection={sortDirection}
            sortIconMapping={sortIconMapping}
            handleChangeSorting={handleChangeSorting}
            isDesktopWeb={isDesktopWeb}
            screenWidth={width}
          />
        </View>
      )}

      {/* { auth?.username && !isLoading && displayedCards.length === 0 && (
        <View
          className="w-[100%] h-[100%] justify-center items-center"
        >
          <Text className="text-dark-text font-sans-bold text-xl tracking-wider mb-3">
            No cards found
          </Text>
          <Button 
            title="Back to Home"
            variant="primary"
            handlePress={() => router.push('/home')}
          />
        </View>
        
      )} */}

      {/* Enlarged slideshow on desktopweb */}
      { isDesktopWeb && showSlideshow && (
        <View
          style={{
            position: "absolute",
            justifyContent: "center",
            alignItems: "center",
            backgroundColor: "rgba(0,0,0,0.8)",
            width: "100%",
            top: 0,
            bottom: 0,
            left: 0,
            right: 0,
          }}
        >
          {/* Backdrop: clicking ANYWHERE outside closes */}
          <Pressable
            onPress={stopSlideshow}
            style={{
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          />

          {/* Frame: clicking inside should NOT close */}
          <Pressable
            onPress={(e) => {
              // prevents the backdrop from receiving the click on web
              e?.stopPropagation?.();
            }}
            style={{
              width: "80%",
              maxWidth: 1000,
              height: 600,
              borderRadius: 12,
              overflow: "hidden",
            }}
          >
            <View
              className="bg-dark-surface/95 flex-1 justify-center items-center cursor-default flex-row"
            >

              <TouchableOpacity
                onPress={() => setCurrentCardIndex(prev => {
                  if (prev === 0) {
                    return displayedCards.length - 1;
                  } else {
                    return prev - 1;
                  }
                })}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: "rgba(253, 253, 253, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather 
                  name={"chevron-left"}
                  size={25}
                  color="black"
                />
              </TouchableOpacity>
              <CardSlideshow 
                card={{
                  finish: displayedCards[currentCardIndex].finish,
                  special_foil_finish: displayedCards[currentCardIndex].special_foil_finish,
                  quantity: displayedCards[currentCardIndex].quantity,
                  final_price: displayedCards[currentCardIndex].final_price,
                  is_favourite: displayedCards[currentCardIndex].is_favourite,
                  ...displayedCards[currentCardIndex].card_id
                }}
                userCardId={displayedCards[currentCardIndex]._id}
                updateFavourite={updateFavourite}
              />
              <TouchableOpacity
                onPress={() => setCurrentCardIndex(prev => {
                  if (prev === displayedCards.length - 1) {
                    return 0;
                  } else {
                    return prev + 1;
                  }
                })}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: "rgba(253, 253, 253, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Feather 
                  name={"chevron-right"}
                  size={25}
                  color="black"
                />
              </TouchableOpacity>
            </View>
          </Pressable>
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