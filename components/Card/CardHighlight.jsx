import React, { useEffect } from "react";
import { View, Platform, Pressable } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";

import SmallCardDisplay from "./SmallCardDisplay";

const CardHighlight = ({ cards, containerWidth, containerHeight, handleLongPress, isDesktopWeb }) => {
  const cardNo = cards.length;

  // Shared value for horizontal translation
  const translateX = useSharedValue(0);
  const cardHeight = Math.min(Math.floor(680 / 488 * (containerWidth/3)), containerHeight);
  const cardWidth = 488 / 680 * cardHeight;

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
        <View className="flex-row flex-nowrap gap-1 border-2 border-light-red">
          {cards.map(card => (
            <SmallCardDisplay 
              key={card._id}  
              card={card}
              // maxWidth={Math.min(Math.floor(width/8), Math.floor(cardHeight * (488/680)))}
              maxWidth={cardWidth}
              shadow={false}
            />
          ))}
        </View>
      )}
      { cardNo > 0 &&  !isDesktopWeb && (
        <Animated.ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={[
            { maxWidth: containerWidth, height: cardHeight }, 
            animatedStyle
          ]}
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
                <SmallCardDisplay  
                  card={card}
                  maxWidth={cardWidth}
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