import { View, Text, Platform, Image, TouchableOpacity } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";

import { images } from "../../constants";

import CardDisplay from "./CardDisplay";
import Button from "../CustomButton/CustomButton";

const FlipCard = ({ card, width, autoFlip }) => {
  const isFlipped = useSharedValue(false);
  const scale = useSharedValue(1); // Scale value for hover animation
  const duration = 500;

  const handleFlip = () => {
    isFlipped.value = true;
  };

  const handleMouseEnter = () => {
    scale.value = withTiming(1.1, { duration, easing: Easing.out(Easing.ease) });
  };

  const handleMouseLeave = () => {
    scale.value = withTiming(1, { duration, easing: Easing.out(Easing.ease) });
  };

  useEffect(() => {
    if (autoFlip) {
      handleFlip();
    }
  }, [autoFlip]);

  const zoomAnimatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
    ],
  }));

  const backCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration, easing: Easing.inOut(Easing.ease) });

    return {
      transform: [{ rotateY: rotateValue }],
    };
  });

  const frontCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration, duration, easing: Easing.inOut(Easing.ease) });

    return {
      transform: [{ rotateY: rotateValue }],
    };
  });

  return (
    <Animated.View
      style={[{
        position: "relative",
        width,
        aspectRatio: 488 / 680,
        borderRadius: width * 0.05,
        margin: 10,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.5,
        shadowRadius: 5,
      }, zoomAnimatedStyle]}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >

      {/* Card back */}
      <Animated.View 
        style={[
          { position: "absolute", width: "100%", height: "100%", zIndex: 1, backfaceVisibility: "hidden" }, 
          backCardAnimatedStyle
        ]}
      >
        <TouchableOpacity
          onPress={handleFlip}
          style={{
            width: "100%",
            height: "100%",
            borderRadius: width * 0.05,
          }}
        >
          <Image
            source={images.card_back}
            resizeMode="contain"
            style={{
              width: "100%",
              height: "100%",
              borderRadius: width * 0.05,
            }}
          />
        </TouchableOpacity>
      </Animated.View>

      {/* Card front */}
      <Animated.View 
        style={[
          { width: "100%", height: "100%", zIndex: 2, backfaceVisibility: "hidden" }, 
          frontCardAnimatedStyle
        ]}
      >
        <CardDisplay card={card} maxWidth={width} shadow={false} />
      </Animated.View>

    </Animated.View>
  );
};

const CardFlipperWeb = ({ cards }) => {
  const [autoFlipIndex, setAutoFlipIndex] = useState(-1);

  const flipAllCards = () => {
    cards.forEach((_, index) => {
      setTimeout(() => {
        setAutoFlipIndex(index);
      }, index * 300);
    });
  };

  return (
    <View className="mt-10 h-screen">
      <View className="justify-center items-center mb-2">
        <Button 
          title="Reveal All Cards"
          handlePress={() => flipAllCards()}
          containerStyles="mt-12 w-fit"
        />
      </View>
      
      { Platform.OS === "web" && (
        <View 
          className="items-center justify-center flex-row flex-wrap gap-4 mt-5"
          style={{ marginLeft: 120, marginRight: 120 }}
        >
          {cards.map((card, index) => (
            <FlipCard
              key={index} 
              card={card}
              width={200}
              autoFlip={autoFlipIndex === index}
            />
          ))}
        </View>
      )}

    </View>
  )

};

export default CardFlipperWeb;