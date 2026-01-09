import React, { useEffect } from "react";
import { View, Platform, Pressable, Text } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";

import SmallCardDisplay from "./SmallCardDisplay";

const CardHighlight = ({ cards, containerWidth, containerHeight, handleLongPress, isDesktopWeb = true, isNative = false }) => {
  const cardNo = cards.length;

  // Shared value for horizontal translation
  const translateX = useSharedValue(0);
  const cardHeight = Math.min(Math.floor(680 / 488 * (containerWidth/3)), containerHeight);
  const cardWidth = isNative ? 488 / 680 * cardHeight : 488 / 680 * cardHeight - 15;

  useEffect(() => {
    translateX.value = withSequence(
      withTiming(-20, { duration: 500 }), // Scroll 50px to the right
      withTiming(0, { duration: 500 })   // Return to original position
    );

  }, [cards, containerWidth, translateX]);

  // Animated style for the scroll view
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: translateX.value }],
  }));

  return (
    <>
      { cardNo > 0 &&  isDesktopWeb && (
        <View className="flex-row flex-nowrap gap-1">
          {cards.map(card => (
            <View className="flex-col" key={card._id} >
              <SmallCardDisplay 
                card={card}
                maxWidth={Math.min(Math.floor(containerWidth/8), Math.floor(cardHeight * (488/680)))}
                // maxWidth={cardWidth}
                shadow={false}
              />
              <View className="bg-light-yellow/50 rounded-lg mt-1">
                <Text className="text-center text-xs font-sans-semibold text-light-text">
                  {card.final_price ? `USD ${card.final_price}` : "no market price"}
                </Text>
              </View>
            </View>
          ))}
        </View>
      )}

      { cardNo > 0 &&  !isDesktopWeb && (
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[
            { maxWidth: containerWidth, maxHeight: containerHeight * 1.15 }, 
            animatedStyle
          ]}
        >
          <View 
            className="flex-row flex-nowrap gap-3"
          >
            { cards.map(card => (
              <View className="flex-col" key={card._id} >
                <Pressable
                  onLongPress={handleLongPress}
                  delayLongPress={500} // Customize long press duration
                  key={card._id}               
                >
                  <SmallCardDisplay  
                    card={card}
                    maxWidth={cardWidth}
                    shadow={true}
                  />
                </Pressable>
                <View className="bg-light-yellow rounded-lg">
                  <Text className="text-center text-xs font-sans-semibold text-light-text">
                    {card.final_price ? `$ ${card.final_price}` : "no market price"}
                  </Text>
                </View>
              </View>
              
            ))}

          </View>
        </Animated.ScrollView>
        
      )}
    </>
  )

};

module.exports = CardHighlight;