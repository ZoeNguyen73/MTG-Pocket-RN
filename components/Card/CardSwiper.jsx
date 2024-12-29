import { View, Text, Platform, Image } from "react-native";
import React, { useState } from "react";
import Swiper from "react-native-deck-swiper";
import { router } from "expo-router";

import CardDisplay from "./CardDisplay";

const CardSwiper = ({ cards }) => {
  // const [swipedAllCards, setSwipedAllCards] = useState(false);
  const [ counter, setCounter ] = useState(1);

  const increaseCounter = () => {
    setCounter(prev => prev + 1);
  };

  return (
    <View
      className="mt-5 h-screen"
    >
      <View style={{ justifyContent: "center", alignItems: "center", marginTop: "30" }}>
        <View className="flex-row gap-1">
          <Text 
            className="text-light-yellow font-sans-semibold tracking-wide"
          >
            {counter}
          </Text>
          <Text className="text-dark-text font-sans tracking-wide">
            {`/ ${cards.length} cards`}
          </Text>
        </View>
      </View>

      { Platform.OS !== "web" && (
        <Swiper 
          cards={cards}
          keyExtractor={(item, index) => `${item._id}-${index}`}
          cardIndex={0}
          renderCard={(item, index) => (
            <CardDisplay 
              card={item}
              index={index}
            />
          )}
          stackSize={2}
          stackSeparation={2}
          animateCardOpacity
          verticalSwipe={false}
          cardVerticalMargin={20}
          cardHorizontalMargin={30}
          onSwiped={() => increaseCounter()}
          containerStyle={{ 
            backgroundColor: "transparent",
          }}
          marginTop={50}
          // onSwipedAll={() => setSwipedAllCards(true)}
        />
      )}
      
    </View>
  )
};

export default CardSwiper;