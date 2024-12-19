import { View, Text } from "react-native";
import React, { useState, useEffect } from "react";
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
      // className="h-full border border-light-red"
      style={{ marginTop: "30", justifyContent: "center" }}
    >
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <View className="flex-row gap-1">
          <Text 
            className="text-light-yellow font-sans-semibold tracking-wide"
          >
            {counter}
          </Text>
          <Text className="text-light-text dark:text-dark-text font-sans tracking-wide">
            {`/ ${cards.length} cards`}
          </Text>
        </View>
      </View>
      <Swiper 
        cards={cards}
        keyExtractor={(item, index) => `${item._id}-${index}`}
        cardIndex={0}
        renderCard={(item, index) => (
          <CardDisplay 
            card={item}
            index={index}
          />
          
          // <View className="h-[65vh] w-full bg-light-yellow border border-4 rounded-3xl overflow-hidden border-dark-background dark:border-dark-primary">
          //   <Text>{item.card_faces[0].name}</Text>
          // </View>
        )}
        stackSize={2}
        stackSeparation={2}
        animateCardOpacity
        verticalSwipe={false}
        cardVerticalMargin={20}
        cardHorizontalMargin={30}
        onSwiped={() => increaseCounter()}
        backgroundColor="white"
        marginTop={50}
        // onSwipedAll={() => setSwipedAllCards(true)}
      />
    </View>
  )
};

export default CardSwiper;