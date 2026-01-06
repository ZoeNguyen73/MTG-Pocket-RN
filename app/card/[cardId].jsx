import { ImageBackground, FlatList, View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { SvgXml } from "react-native-svg";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";

import axios from "../../api/axios";

import tailwindConfig from "../../tailwind.config";

import { useErrorHandler } from "../../context/ErrorHandlerProvider";
import { getFonts } from "../../utils/FontFamily";
import useDeviceLayout from "../../hooks/useDeviceLayout";

import CardDisplay from "../../components/Card/CardDisplay";
import SmallCardDisplay from "../../components/Card/SmallCardDisplay";
import LoadingSpinner from "../../components/LoadingSpinner/LoadingSpinner";
import Button from "../../components/CustomButton/CustomButton";
import FinishChip from "../../components/FinishChip";

import { images } from "../../constants";

const fonts = getFonts();

const MoreInfoModal = ({
  modalVisible,
  handleModalVisibilityChange,
  quantity,
  padding,
  cardName,
  rarity,
  finish,
  specialFoilFinish,
  finalPrice,
  isFavourite,
  relatedCards,
  set,
  direction = "up",
  screenWidth,
}) => {

  const lightTeal = tailwindConfig.theme.extend.colors.light.teal;
  const lightYellow = tailwindConfig.theme.extend.colors.light.yellow;

  const [ iconXml, setIconXml ] = useState("<svg></svg>");

  useEffect(() => {
    const getIconXml = async () => {
      const xml = await ( await fetch(set.icon_svg_uri)).text();
      setIconXml(xml);
    };

    getIconXml();
  }, []);

  return (
    <Modal
      animationType={direction === "up" ? "slide" : "fade"}
      visible={modalVisible}
      onRequestClose={() => {
        handleModalVisibilityChange(false);
        router.back();
      }}
      onDismiss={() => {
        handleModalVisibilityChange(false);
      }}
      transparent={true}
    >
      <View
        style={{
          flexDirection: direction === "up" ? "" : "row",
          flex: 1,
          justifyContent: direction === "up" ? "flex-end" : "flex-start",
        }}
      >
        <View
          className="pt-5"
          style={{ 
            backgroundColor: "rgba(30, 30, 46, 0.90)",
            borderTopRightRadius: 20,
            borderTopLeftRadius: direction === "up" ? 20 : 0,
            borderBottomRightRadius: direction === "up" ? 0 : 20,
            paddingLeft: direction === "up" ? padding : 30,
            paddingRight: direction === "up" ? padding : 30,
            width: direction === "up" ? "100%" : "30%",
            height: direction === "up" ? "50%" : "100%",
          }}
        >
          <View className="flex-row justify-between">
            <View className="flex-1 flex-column">
              <Text
                className={`${screenWidth < 400 ? "text-xl" : "text-3xl"} tracking-wide text-light-yellow`}
                style={{ fontFamily: fonts.serifSemibold}}
              >
                {cardName} 
              </Text>
              <View className="flex-row gap-1 mt-1 items-center">
                <SvgXml
                  xml={iconXml
                    .replace(/fill=(["'])(?:(?=(\\?))\2.)*?\1/g, `fill="white"`)}
                  width={15}
                  height={15}
                  fill={"white"}
                />
                <Text
                  className="text-xs tracking-wide text-dark-text font-sans-italic border-2 border-transparent"
                >
                  {set.name}
                </Text>
                <FinishChip 
                  text={specialFoilFinish ? specialFoilFinish : finish }
                  size="xs"
                  shortened={false}
                />
              </View>
              
              <View className="flex-row items-center gap-2 mt-3">
                <View
                  style={{
                    borderRadius: 999, // rounded-full
                    borderColor: "rgba(253, 253, 253, 0.5)",
                    borderWidth: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10, // px-3
                    paddingVertical: 2, // py-1
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text
                    className={`${screenWidth < 400 ? "text-xs" : "text-base"} tracking-wide text-dark-text`}
                    style={{ fontFamily: fonts.sansItalic}}
                  >
                    {rarity}
                  </Text>
                </View>
                
                <View
                  style={{
                    borderRadius: 999, // rounded-full
                    backgroundColor: lightYellow, // light-teal
                    justifyContent: "center",
                    alignItems: "center",
                    paddingHorizontal: 10, // px-3
                    paddingVertical: 2, // py-1
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 0,
                      height: 2,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 3.84,
                    elevation: 5,
                  }}
                >
                  <Text
                    className={`text-left ${screenWidth < 400 ? "text-xs" : "text-base"} tracking-wide text-light-text font-sans-semibold`}
                  >
                    {finalPrice ? `USD ${finalPrice}` : "no market price"}
                  </Text>
                </View>

                { isFavourite && (
                  <MaterialCommunityIcons name="heart" size={24} color="#dc8a78" />
                )}
              </View>
              
              
            </View>
            
            {direction === "up" && (
              <TouchableOpacity
                onPress={() => handleModalVisibilityChange(false)}
                style={{
                  height: 30,
                  width: 30,
                  borderRadius: 15,
                  backgroundColor: "rgba(253, 253, 253, 0.5)",
                  justifyContent: "center",
                  alignItems: "center",
                  marginTop: 10
                }}
              >
                <Feather 
                  name={direction === "up" ? "chevron-down" : "chevron-left"} 
                  size={25} 
                  color="black" 
                />
              </TouchableOpacity>
            )}
            
          </View>

          <View className="flex-row gap-2 mt-5">
            <Text 
              className={`${screenWidth < 400 ? "text-sm" : "text-xl"} tracking-wide text-dark-text`}
              style={{ fontFamily: fonts.sansSemibold}}
            >
              Quantity Owned:
            </Text>
            <Text 
              className={`${screenWidth < 400 ? "text-sm" : "text-xl"} tracking-wide text-dark-text`}
              style={{ fontFamily: fonts.sansSemibold}}
            >
              {quantity}
            </Text>      
          </View>
          <View className="mt-3">
            <Text
              className={`${screenWidth < 400 ? "text-sm" : "text-xl"} tracking-wide text-dark-text`}
              style={{ fontFamily: fonts.sansSemibold}}
            >
              Other Variants:
            </Text>
          </View>

          { relatedCards.length === 0 && (
            <View className="mt-2">
              <Text
                className="text-sm tracking-wide text-dark-text"
                style={{ fontFamily: fonts.sansLightItalic}}
              >
                No other variants currently found in database
              </Text>
            </View>
          )}

          { relatedCards.length > 0 && direction === "up" && (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                maxWidth: "100%",
                maxHeight: 680 / 488 * 140,
                marginTop: 5, 
              }}
            >
              <View className="flex-row flex-nowrap gap-2"> 
                { relatedCards.map((card, index) => {
                  return (
                    <SmallCardDisplay 
                      key={index}
                      card={card}
                      maxWidth={screenWidth > 600 ? 140 : screenWidth / 4}
                      isGreyscale={!card.is_owned}
                      label={ card.is_owned ? "owned" : "not owned"}
                    />
                  )
                  
                })}
              </View>
            </ScrollView>
          )}

          { relatedCards.length > 0 && direction !== "up" && (
            <FlatList 
              data={relatedCards}
              keyExtractor={card => card._id}
              numColumns={3}
              columnWrapperStyle={{
                flex: "row",
                gap: 5,
                justifyContent: "between",
                paddingTop: 5,
              }}
              renderItem={({item}) => {
                return (
                  <SmallCardDisplay 
                    key={item._id}
                    card={item}
                    maxWidth={140}
                    isGreyscale={!item.is_owned}
                    label={ item.is_owned ? "owned" : "not owned"}
                  />
                )
              }}
            
            />
          )}
          
        </View>

        { direction !== "up" && <View className="flex-1" />}

        { direction !== "up" && (
           <View>
            <Button 
              variant="small-primary"
              title="Back"
              containerStyles={"mt-5 mr-5"}
              handlePress={() => router.back()}
            />
          </View>
        )}

      </View>
    </Modal>
  )
  
};

const CardDetailsPage = () => {
  const [ card, setCard ] = useState(null);
  const [ isLoading, setIsLoading ] = useState(false);
  const [ modalVisible, setModalVisible ] = useState(true);
  const { cardId } = useLocalSearchParams();
  const handleError = useErrorHandler();

  const { isDesktopWeb, width, height } = useDeviceLayout();
  
  const zoomIn = {
    0: { scale: 0.6, translateY: -0.4 * height },
    1: { scale: 1, translateY: -0.05 * height }, 
  };
  
  const zoomOut = {
    0: { scale: 1, translateY: -0.05  * height }, 
    1: { scale: 0.6, translateY: -0.4 * height },
  };

  const expand = {
    0: { scale: 0.9, translateX: 0.15 * width },
    1: { scale: 1, translateX: 0 }, 
  };

  const collapse  = {
    0: { scale: 1, translateX: 0 }, 
    1: { scale: 0.9, translateX: 0.15 * width },
  };

  const animation = (modalVisible) => {
    if (modalVisible) {
      if (isDesktopWeb) return collapse;
      return zoomOut;
    } else {
      if (isDesktopWeb) return expand;
      return zoomIn;
    }
  };

  useEffect(() => {
    const getCardData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/user-cards/${cardId}`);
        const cardData = response.data;
        cardData.card_id.finish = cardData.finish;
        cardData.card_id.special_foil_finish = cardData.special_foil_finish;
        setCard(cardData); 
      } catch (error) {
        await handleError(error);
      } finally {
        setIsLoading(false);
      }
    };

    getCardData();
  }, [cardId]);

  const handleModalVisibilityChange = (isVisible) => {
    if (isVisible) {
      setModalVisible(true);
    } else {
      setModalVisible(false);
    }
  };

  return (
    <ImageBackground
      source={isDesktopWeb ? images.background_lowryn_eclipsed : images.dark_background_vertical_3}
      className="flex-1"
      resizeMode="cover"
      style={{
        flex: 1,
        width: "100%"
      }}
    >
      {isDesktopWeb && (
        <View className="absolute inset-0 bg-black/75" />
      )}

      { card !== null && !isLoading && (
        <SafeAreaView
          className="h-screen justify-center items-center"
        >
          <Animatable.View
            animation={ animation(modalVisible) }
            duration={300}
            style={{
              height: isDesktopWeb ? "80%" : "auto",
              width: isDesktopWeb ? 450 : (0.8 * width),
            }}
          >
            { !isDesktopWeb && (
              <CardDisplay 
                card={card.card_id}
                enableFlip={ modalVisible && !isDesktopWeb ? false : true }
                maxWidth={0.8 * width}
              />
            )}

            { isDesktopWeb && (
              <CardDisplay 
                card={card.card_id}
                enableFlip={ true }
                maxWidth={240}
              />
            )}
            
          </Animatable.View>

          <MoreInfoModal 
            modalVisible={modalVisible}
            handleModalVisibilityChange={handleModalVisibilityChange}
            quantity={card.quantity}
            padding={width * 0.1}
            cardName={card.card_id.card_faces[0].name}
            rarity={card.card_id.rarity}
            finish={card.finish}
            specialFoilFinish={card.special_foil_finish}
            finalPrice={card.final_price}
            isFavourite={card.is_favourite}
            relatedCards={card.related_cards}
            set={card.card_id.set_id}
            direction={isDesktopWeb ? "right" : "up"}
            screenWidth={width}
          />

          { !modalVisible && !isDesktopWeb && (
            <TouchableOpacity
              onPress={() => handleModalVisibilityChange(true)}
              style={{
                position: "absolute",
                bottom: 50,
                height: 40,
                width: 40,
                borderRadius: 20,
                marginBottom: 60,
                backgroundColor: "rgba(253, 253, 253, 0.5)",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Feather name="chevron-up" size={28} color="black"/>  
            </TouchableOpacity>
          )}

          { !modalVisible && isDesktopWeb && (
            <TouchableOpacity
              onPress={() => handleModalVisibilityChange(true)}
              style={{
                position: "absolute",
                top: 50,
                left: 50,
                height: 40,
                width: 120,
                borderRadius: 20,
                backgroundColor: "rgba(253, 253, 253, 0.5)",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <View className="flex-row justify-between items-center">
                <Text className="text-sm text-black font-sans">More info</Text>
                <Feather name="chevron-right" size={28} color="black"/>
              </View>
              

            </TouchableOpacity>
          )}
        </SafeAreaView>
      )}  
      
      { (card === null || isLoading) && (
        <LoadingSpinner />
      )}

    </ImageBackground>
  )
};

export default CardDetailsPage;