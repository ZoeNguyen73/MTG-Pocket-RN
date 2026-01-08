import React, { useEffect, useState } from "react";
import { View, ScrollView, TouchableOpacity, FlatList } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withSequence, withTiming } from "react-native-reanimated";

import CardDisplay from "./CardDisplay";

const CardHighlightEnlarged = ({ cards }) => {
  return (
    <>
      { cards.length > 0 && (
        <FlatList
          data={cards}
          keyExtractor={(item) => item._id}
          renderItem={({ item }) => (
            <CardDisplay 
              key={item._id}
              card={item}
              maxWidth={210}
            />  
          )}
          onViewableItemsChanged={viewableSetsChanges}
          viewabilityConfig={{
            itemVisiblePercentThreshold: 90
          }}
          horizontal
          showsHorizontalScrollIndicator={false}
        />
        
      )}
    </>
  )
};

module.exports = CardHighlightEnlarged;