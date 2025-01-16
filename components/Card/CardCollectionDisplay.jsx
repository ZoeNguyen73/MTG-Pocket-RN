import { View, Image, StyleSheet, Platform, TouchableOpacity, Text } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";

import useAxiosPrivate from "../../hooks/useAxiosPrivate";
import { useErrorHandler } from "../../context/ErrorHandlerProvider";
import { useAuthContext } from "../../context/AuthProvider";

import { getFonts } from "../../utils/FontFamily";

const START_DEFAULT = { x: 0.5, y: 0 };
const END_DEFAULT = { x: 0.5, y: 1 };

const GRADIENT_LOCATIONS = [0, 0.2, 0.4, 0.6, 0.8, 1, 1];

const GRADIENT_COLORS = [
  // "rgba(255, 0, 0, 0.1) 0%",
  "rgba(255, 154, 0, 0.2) 0%",
  "rgba(208, 222, 33, 0.3) 20%",
  "rgba(79, 220, 74, 0.5) 40%",
  // "rgba(63, 218, 216, 0.5) 45%",
  "rgba(47, 201, 226, 0.3) 60%",
  // "rgba(28, 127, 238, 0.2) 63%",
  "rgba(95, 21, 242, 0.5) 80%",
  "rgba(186, 12, 248, 0.5) 100%",
  "rgba(251, 7, 217, 0.5) 100%",
  // "rgba(255, 0, 0, 0.1) 100%"
];

const fonts = getFonts();

const CardCollectionDisplay = ({ 
  card, 
  maxWidth, 
  quantity, 
  finish, 
  finalPrice, 
  shadow = false, 
  favourite, 
  id,
  handleFavouriteToggle 
}) => {
  const frontCardFace = card.card_faces[0];
  const [ isFrontFacing, setIsFrontFacing ] = useState(true);
  const [ isFavourite, setIsFavourite ] = useState(favourite);

  const axiosPrivate = useAxiosPrivate();
  const { handleError } = useErrorHandler();
  const { auth } = useAuthContext();

  // console.log("card: " + card.card_faces[0].name);
  // console.log("finish: " + finish + ", quantity: " + quantity);

  const [gradientOptions, setGradientOptions] = useState({
    colors: GRADIENT_COLORS,
    locations: GRADIENT_LOCATIONS,
    start: START_DEFAULT,
    end: END_DEFAULT
  });

  const imgUri = "image_jpg_normal";

  const triggerFavouriteToggle = async () => {
    try {
      if (isFavourite) {
        await axiosPrivate.put(`/users/${auth.username}/cards/favourites/remove/${id}`);
      } else {
        await axiosPrivate.put(`/users/${auth.username}/cards/favourites/add/${id}`);
      }
      handleFavouriteToggle();
      setIsFavourite(!isFavourite);
    } catch (error) {
      await handleError(error);
    }
  };

  return (
    <>
      { Platform.OS !== "web" && (
        <View
          style={[
            styles.shadowContainer,
            {
              width: maxWidth ? maxWidth : "100%",
              aspectRatio: 488 / 680,
              borderRadius: maxWidth ? maxWidth * 0.07 : 15,
            },
          ]}
        >
          { isFrontFacing && (
            <View 
              style={[styles.cardContainer, { 
                width: "100%",  
                borderRadius: maxWidth ? maxWidth * 0.07 : 15,
                overflow: "hidden",
              }]}
            >
              { shadow && (
                <View 
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: maxWidth ? maxWidth * 0.07 : 15,
                    backgroundColor: "rgba(0, 0, 0, 0.1)",
                    zIndex: -1,
                    position: "absolute",
                    shadowColor: "#000",
                    shadowOffset: {
                      width: 10,
                      height: 20,
                    },
                    shadowOpacity: 0.5,
                    shadowRadius: 10,
                    elevation: 10,
                  }}
                
                />
              )}
              
              <Image 
                source={{ uri: frontCardFace[imgUri] }}
                resizeMode="contain"
                style={{
                  width: shadow ? "98%" : "100%",
                  height: shadow ? "98%" : "100%",
                  borderRadius: maxWidth ? maxWidth * 0.07 : 16,
                }}
              />
    
              {/* Linear gradient overlay for foil or etched finish*/}
              { (finish === "foil" || finish === "etched") 
                && (
                <>
                  <LinearGradient 
                    colors={gradientOptions.colors}
                    locations={gradientOptions.locations}
                    start={gradientOptions.start}
                    end={gradientOptions.end}
                    style={styles.gradientOverlay}
                  />
                </>
              
              )}

              {/* Favourite */}
              <TouchableOpacity 
                style={styles.favourite}
                onPress={() => triggerFavouriteToggle()}
              >
                { isFavourite && (
                  <MaterialCommunityIcons name="heart" size={24} color="#dc8a78" />
                )}
                { !isFavourite && (
                  <MaterialCommunityIcons name="heart" size={24} color="rgba(156, 160, 176, 0.8)" />
                )}
              </TouchableOpacity>

              {/* Quantity and Price label overlay */}
              <View
                style={styles.labels}
              >
                <View className="flex-row w-[100%] h-[100%]">
                  <View 
                    className="pl-2 justify-center w-[30] h-[100%]"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      borderTopRightRadius: 15,
                    }}
                  >
                    <Text 
                      className="font-sans-semibold text-xs"
                      style={{ color: "#FFFFFF", paddingLeft: 4, fontFamily: fonts.sansSemibold }}
                    >
                      {quantity}
                    </Text>
                  </View>
                  <View className="flex-1"></View>
                  <View 
                    className="w-[60] h-[100%] justify-center"
                    style={{
                      backgroundColor: "rgba(0, 0, 0, 0.7)",
                      borderTopLeftRadius: 15
                    }}
                  >
                    <Text 
                      className="text-center font-sans-semibold text-xs"
                      style={{ color: "#FFFFFF", fontFamily: fonts.sansSemibold }}
                    >
                      {`$ ${finalPrice}`}
                    </Text>
                  </View>
                </View>
                
              </View>
            </View>  
          )}
        </View>
      )}
    </>
  )
};

const styles = StyleSheet.create({
  shadowContainer: {
    alignSelf: "center",
    overflow: "visible", // Allows shadow to render outside bounds
    position: "relative",
  },
  cardContainer: {
    overflow: "hidden",
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  gradientOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    opacity: 0.4,
    top: "0%",
    left: "0%",
    right: 0,
    bottom: 0,
    borderRadius: 15,
  },
  labels: {
    position: "absolute",
    height: "10%",
    width: "103%",
    bottom: -1,
    left: -1,
    borderRadiusBottom: 15,
    overflow: "hidden",
  },
  favourite: {
    position: "absolute",
    height: 30,
    width: 30,
    top: 10,
    right: 5,
    justifyContent: "center",
    alignItems: "center"
  }
});

export default CardCollectionDisplay;