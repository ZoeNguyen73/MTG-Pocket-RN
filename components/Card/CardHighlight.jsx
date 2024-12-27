import React, { useEffect, useState, useRef } from "react";
import { View, ScrollView, Platform, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";

import axios from "../../api/axios";

import CardDisplay from "./CardDisplay";

const CardHighlight = ({ setCode, containerWidth, containerHeight }) => {
  const [ cards, setCards ] = useState([]);
  const [ cardNo, setCardNo ] = useState(0);

  // Shared value for horizontal translation
  const translateX = useSharedValue(0);
  const height = Math.min(Math.floor(680 / 488 * (containerWidth/2.6)), containerHeight);
  const width = containerWidth;

  useEffect(() => {
    const getTopCards = async () => {
      const response = await axios.get(`/sets/${setCode}/top-cards`);
      const cardData = response.data.top_cards;

      if (cardData.length > 0) {
        // reformat card data
        const reformattedData = [];
        for (let i = 0; i < cardData.length; i++) {
          reformattedData.push(cardData[i].card_id);
        }
        setCards(reformattedData);
        setCardNo(cardData.length);

        // Trigger hint animation
        translateX.value = withSequence(
          withTiming(-20, { duration: 500 }), // Scroll 50px to the right
          withTiming(0, { duration: 500 })   // Return to original position
        );

      };
    };

    if (setCode && containerWidth) {
      getTopCards();
    }
  }, [setCode, containerWidth, translateX]);

  // Animated style for the scroll view
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <>
      { cardNo > 0 &&  Platform.OS === "web" && (
        <View className="flex-row flex-nowrap gap-1">
          {cards.map(card => (
            <CardDisplay 
              key={card._id}  
              card={card}
              size="small"
              maxWidth={Math.min(Math.floor(width/8), Math.floor(height * (488/680)))}
              shadow={false}
            />
          ))}
        </View>
      )}
      { cardNo > 0 &&  Platform.OS !== "web" && (
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[{ maxWidth: containerWidth, maxHeight: height }, animatedStyle]}
        >
          <View
            className="flex-row flex-nowrap gap-3"
          >
            { cards.map((card) => (
              <CardDisplay
                key={card._id}  
                card={card}
                size="small"
                maxWidth={Math.min(Math.floor(width/2.6), height * (488/680))}
                shadow={true}
              />
            ))}

          </View>
        </Animated.ScrollView>
        
      )}
    </>
  )

};

module.exports = CardHighlight;