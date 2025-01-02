import { View, Text } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Swiper from "react-native-deck-swiper";
import LottieView from "lottie-react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import Feather from '@expo/vector-icons/Feather';

import CardDisplay from "./CardDisplay";

import tailwindConfig from "../../tailwind.config";

const PRICE_HIGHLIGHT_THRESHOLD = 5;

const ZoomOutText = ({ content, backgroundColor, textStyle, counter }) => {
  const scale = useSharedValue(1.5); // Start at scale 1.5

  useEffect(() => {
    // Animate scale: 1.5 -> 1 -> 1.5 -> 1
    scale.value = withSequence(
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      }),
      withTiming(1.5, {
        duration: 300,
        easing: Easing.inOut(Easing.ease),
      }),
      withTiming(1, {
        duration: 500,
        easing: Easing.out(Easing.ease),
      })
    );
  }, [counter]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          borderRadius: 999, // rounded-full
          backgroundColor: backgroundColor, // light-teal
          justifyContent: "center",
          alignItems: "center",
          paddingHorizontal: 12, // px-3
          paddingVertical: 4, // py-1
        },
        animatedStyle, // Apply animated style
      ]}
    >
      <Text className={textStyle}>
        {content}
      </Text>
    </Animated.View>
  );
};

const CardSwiper = ({ cards }) => {
  const firstCardPrice = cards[0].final_price || "0" ;
  const [ counter, setCounter ] = useState(1);
  const [ totalValue, setTotalValue ] = useState(parseFloat(firstCardPrice).toFixed(2));

  const iconYellowColor = tailwindConfig.theme.extend.colors.light.yellow;

  const sparkleRef = useRef(null);
  
  const triggerPriceHighlightAnimation = () => {
    if (sparkleRef.current) {
      sparkleRef.current.play(); // Play the Lottie animation
    }
  };

  const increaseCounter = () => {

    if (counter < cards.length ) {
      const currentCardPrice = cards[counter].final_price || "0" ;

      if (parseFloat(currentCardPrice) >= PRICE_HIGHLIGHT_THRESHOLD) {
        triggerPriceHighlightAnimation();
      }

      setTotalValue(prev => (parseFloat(prev) + parseFloat(currentCardPrice)).toFixed(2));
    }
    
    setCounter(prev => prev + 1);
    
  };

  return (
    <View
      className="h-screen flex-column"
    >
      <View style={{ justifyContent: "center", alignItems: "center", marginTop: "40", marginBottom: "20" }}>
        <View 
          className="mt-5 rounded-full min-h-[45px] min-w-[200px] justify-center items-center border-2 border-light-yellow"
          // style={{ backgroundColor: "white", opacity: 0.2, shadowColor: "black" }}
        >
          <View className="justify-center items-center flex-row gap-1">
            <Feather name="dollar-sign" size={20} color={iconYellowColor} />
            <Text className="text-light-yellow font-sans-bold text-2xl tracking-wider">
              {`USD ${totalValue}`}
            </Text>
          </View>
          
        </View>
      </View>
      
      <View className="flex-1 mt-5">
        <View className="flex-row px-10 items-center">
          <View className="rounded-full bg-light-mauve justify-center items-center px-3 py-1">
            <Text className="font-sans-semibold tracking-wide text-base text-dark-text">
              New!
            </Text>
          </View>
          <View className="flex-1"></View>
          <View>
          { counter <= cards.length && parseFloat(cards[counter - 1 ].final_price) < PRICE_HIGHLIGHT_THRESHOLD && (
            <View 
              className="rounded-full border border-dark-text justify-center items-center px-3 py-1"
            >
              <Text className="text-left text-base tracking-wide text-dark-text font-sans-semibold">
                {`USD ${cards[counter - 1 ].final_price}`}
              </Text>
            </View>
          )}
          { counter <= cards.length && parseFloat(cards[counter - 1 ].final_price) >= PRICE_HIGHLIGHT_THRESHOLD && (
            <ZoomOutText 
              backgroundColor={tailwindConfig.theme.extend.colors.light.teal}
              textStyle="text-left text-base tracking-wide text-light-yellow font-sans-semibold"
              content={`USD ${cards[counter - 1 ].final_price}`}
              counter={counter}
            />
          )}
        </View>
        </View>
        <Swiper 
          cards={cards}
          keyExtractor={item=> `${item._id}-${counter - 1}`}
          cardIndex={0}
          renderCard={(item, index) => (
            <CardDisplay 
              card={item}
              index={index}
              currentIndex={counter - 1}
            />
          )}
          stackSize={2}
          stackSeparation={2}
          animateCardOpacity
          verticalSwipe={false}
          cardVerticalMargin={8}
          cardHorizontalMargin={30}
          onSwiped={() => increaseCounter()}
          containerStyle={{ 
            backgroundColor: "transparent",
            position: "relative",
            zIndex: 10,
          }}
        />

      </View>

      
      {/* Sparkle Burst Animation */}
      <LottieView
        ref={sparkleRef}
        source={require("../../assets/lottie-files/fireworks_shortened.json")} // Provide the Lottie JSON file as a prop
        autoPlay={false} // Do not autoplay
        loop={false} // Play the animation only once
        speed={1.5}
        style={{
          position: "absolute",
          width: "130%",
          height: "130%",
          zIndex: 1,
        }}
      />

      <View className="flex-row-reverse justify-start border border-transparent h-[25vh] my-5 px-12">
        
        <Text className="text-dark-text font-sans tracking-wide">
          {` / ${cards.length} cards`}
        </Text>
        <Text 
          className="text-light-yellow font-sans-semibold tracking-wide"
        >
          {counter}
        </Text>
        
      </View>
      
    </View>
  )
};

export default CardSwiper;