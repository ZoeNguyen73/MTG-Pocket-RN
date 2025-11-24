import React, { useEffect, useState } from "react";
import { View, ScrollView, Platform, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";

import axios from "../../api/axios";

import CardDisplay from "./CardDisplay";

const CardHighlight = ({ cards, containerWidth, containerHeight, handleLongPress }) => {
  const cardNo = cards.length;

  // Shared value for horizontal translation
  const translateX = useSharedValue(0);
  const height = Math.min(Math.floor(680 / 488 * (containerWidth/2.6)), containerHeight);
  const width = containerWidth;

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
            { cards.map(card => (
              <Pressable
                onLongPress={handleLongPress}
                delayLongPress={500} // Customize long press duration
                key={card._id}               
              >
                <CardDisplay  
                  card={card}
                  size="small"
                  maxWidth={Math.min(Math.floor(width/2.6), height * (488/680))}
                  shadow={true}
                />
              </Pressable>
            ))}

          </View>
        </Animated.ScrollView>
        
      )}
    </>
  )

};

module.exports = CardHighlight;