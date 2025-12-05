import { ImageBackground, useWindowDimensions, View, Text, Modal, TouchableOpacity, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import Feather from "@expo/vector-icons/Feather";
import { SvgXml } from "react-native-svg";
import * as Animatable from "react-native-animatable";
import { router } from "expo-router";

import axios from "../../api/axios";

import tailwindConfig from "../../tailwind.config";

import { useErrorHandler } from "../../context/ErrorHandlerProvider";
import { getFonts } from "../../utils/FontFamily";

import CardDisplay from "../../components/Card/CardDetailsDisplay";
import SmallCardDisplay from "../../components/Card/SmallCardDisplay";
import LoadingSpinner from "../../components/LoadingSpinner";

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
  finalPrice,
  relatedCards,
  set,
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
      animationType="slide"
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
          flex: 1,
          justifyContent: "flex-end",
        }}
      >
        <View
          className="pt-5 h-[50vh] w-full"
          style={{ 
            backgroundColor: "rgba(30, 30, 46, 0.90)",
            borderTopRightRadius: 20,
            borderTopLeftRadius: 20,
            paddingLeft: padding,
            paddingRight: padding
          }}
        >
          <View className="flex-row">
            <View className="flex-1 flex-column">
              <Text
                className="text-3xl tracking-wide text-light-yellow"
                style={{ fontFamily: fonts.serifSemibold}}
              >
                {cardName}
              </Text>
              <View className="flex-row gap-1 mt-1">
                <SvgXml
                  xml={iconXml
                    .replace(/fill=(["'])(?:(?=(\\?))\2.)*?\1/g, `fill="white"`)}
                  width={15}
                  height={15}
                />
                <Text
                  className="text-xs tracking-wide text-dark-text font-sans-italic"
                >
                  {set.name}
                </Text>
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
                    className="text-base tracking-wide text-dark-text"
                    style={{ fontFamily: fonts.sansItalic}}
                  >
                    {rarity}
                  </Text>
                </View>
                
                <View
                  style={{
                    borderRadius: 999, // rounded-full
                    backgroundColor: lightTeal, // light-teal
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
                    className="text-left text-base tracking-wide text-dark-text font-sans-semibold"
                  >
                    {finish}
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
                    className="text-left text-base tracking-wide text-light-text font-sans-semibold"
                  >
                    {`USD ${finalPrice}`}
                  </Text>
                </View>
              </View>
              
              
            </View>
            
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
              <Feather name="chevron-down" size={25} color="black" />
            </TouchableOpacity>
          </View>

          <View className="flex-row gap-2 mt-5">
            <Text 
              className="text-xl tracking-wide text-dark-text"
              style={{ fontFamily: fonts.sansSemibold}}
            >
              Quantity Owned:
            </Text>
            <Text 
              className="text-xl tracking-wide text-dark-text"
              style={{ fontFamily: fonts.sansSemibold}}
            >
              {quantity}
            </Text>      
          </View>
          <View className="mt-5">
            <Text
              className="text-xl tracking-wide text-dark-text"
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
          { relatedCards.length > 0 && (
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
                      maxWidth={140}
                      isGreyscale={!card.is_owned}
                      label={ card.is_owned ? "owned" : "not owned"}
                    />
                  )
                  
                })}
              </View>
            </ScrollView>
          )}
          
        </View>
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
  const { width, height } = useWindowDimensions();
  
  const zoomIn = {
    0: { scale: 0.6, translateY: -0.4 * height },
    1: { scale: 1, translateY: -0.05 * height }, 
  };
  
  const zoomOut = {
    0: { scale: 1, translateY: -0.05  * height }, 
    1: { scale: 0.6, translateY: -0.4 * height },
  };

  useEffect(() => {
    const getCardData = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get(`/user-cards/${cardId}`);
        const cardData = response.data;
        cardData.card_id.finish = cardData.finish;
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
      source={images.dark_background_vertical_3}
      style={{
        resizeMode: "cover",
        overflow: "hidden",
      }}
    >
      { card !== null && !isLoading && (
        <SafeAreaView
          className="h-screen justify-center items-center"
        >
          <Animatable.View
            animation={ modalVisible ? zoomOut : zoomIn }
            duration={300}
          >
            <CardDisplay 
              card={card.card_id}
              enableFlip={ modalVisible ? false : true }
              maxWidth={0.8 * width}
            />
          </Animatable.View>

          <MoreInfoModal 
            modalVisible={modalVisible}
            handleModalVisibilityChange={handleModalVisibilityChange}
            quantity={card.quantity}
            padding={width * 0.1}
            cardName={card.card_id.card_faces[0].name}
            rarity={card.card_id.rarity}
            finish={card.finish}
            finalPrice={card.final_price}
            relatedCards={card.related_cards}
            set={card.card_id.set_id}
          />

          { !modalVisible && (
            <TouchableOpacity
              onPress={() => handleModalVisibilityChange(true)}
              style={{
                position: "absolute",
                bottom: 50,
                height: 40,
                width: 40,
                borderRadius: 20,
                backgroundColor: "rgba(253, 253, 253, 0.5)",
                justifyContent: "center",
                alignItems: "center"
              }}
            >
              <Feather name="chevron-up" size={28} color="black"/>
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