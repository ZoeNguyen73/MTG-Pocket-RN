import { ImageBackground, Text, View, FlatList, useWindowDimensions } from "react-native";
import { useState, useEffect, useRef } from "react";
import { Audio } from "expo-av";

import CardCollectionDisplay from "./CardCollectionDisplay";

import { soundManager } from "../../utils/SoundManager";
import { soundAssets } from "../../constants/sounds";

const CardCollection = ({ cards, headerHeight, updateFavourite }) => {
  const { width } = useWindowDimensions();
  const favSoundRef = useRef(null);

  useEffect(() => {
    const loadSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          soundAssets["happy-pop-1"],
          { isLooping: false }
        );
        favSoundRef.current = sound;
      } catch (error) {
        console.error("Error loading sounds:", error);
      }
    };

    loadSound();

    return () => {
      if (favSoundRef.current) {
        favSoundRef.current.unloadAsync();
        favSoundRef.current = null;
      }
    };
  }, [cards])

  const playFavSound = async () => {
    try {
      if (favSoundRef.current) {
        await favSoundRef.current.setPositionAsync(0); // Reset playback position
        await favSoundRef.current.setVolumeAsync(soundManager.getSoundEffectsVolume());
        await favSoundRef.current.playAsync();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };

  const handleFavouriteToggle = async (id) => {
    updateFavourite(id);
    await playFavSound();
  };

  return (
    <FlatList 
      data={cards}
      keyExtractor={card => card._id}
      numColumns={3}
      ListHeaderComponent={
        <View
          style={{
            height: headerHeight + 10,
            width: "100%"
          }}
        />
      }
      ListFooterComponent={
        <View
          style={{
            height: 90,
            width: "100%"
          }}
        />
      }
      columnWrapperStyle={{
        flex: "row",
        justifyContent: "space-between",
        paddingLeft: 15,
        paddingRight: 15,
        paddingTop: 10
      }}
      renderItem={({item}) => {
        return (
          <CardCollectionDisplay 
            card={item.card_id} 
            maxWidth={width / 3.3}
            quantity={item.quantity}
            finish={item.finish}
            finalPrice={item.final_price}
            favourite={item.is_favourite}
            id={item._id}
            handleFavouriteToggle={() => handleFavouriteToggle(item._id)}
          />
        )
      }}
    />
  )
};

export default CardCollection;