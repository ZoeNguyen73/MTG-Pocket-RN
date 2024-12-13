import { View, Text, FlatList, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import * as Animatable from "react-native-animatable";
import React, { useState, useEffect, useRef } from "react";
import { SvgUri } from "react-native-svg";

import axios from "../../api/axios";

import Button from "../CustomButton/CustomButton";

const zoomIn = {
  0: { scale: 0.85 },
  1: { scale: 1 },
};

const zoomOut = {
  0: { scale: 1 },
  1: { scale: 0.85 },
};

const SetCard = ({ activeSetId, set, lastSetId }) => {
  return (
    <Animatable.View
      className={`${ lastSetId === set.code ? "mr-2" : ""}`}
      animation={activeSetId === set.code ? zoomIn : zoomOut}
      duration={500}
    >
      <View className="h-[330px] w-[180px] my-3 mx-2">
        <Image 
          source={set.play_booster_image}
          resizeMode="contain"
          style={{
            maxHeight: 330,
            width: "auto",
          }}
        />
      </View>
    </Animatable.View>
  )
};

const SetDetails = ({ setList, activeSetId }) => {
  const set = setList.filter(set => set.code === activeSetId)[0];
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Trigger a re-render of the Animatable.View to animate the component
    setAnimationKey((prevKey) => prevKey + 1);
  }, [activeSetId]);

  return (
    <>
      { set?.details && (
        <Animatable.View
          key={animationKey} // Use animationKey to reset the animation each time activeSetId changes
          animation={zoomIn}
          iterationCount={1}
          duration={500}
          style={{
            width: "100%",
            marginBottom: 20,
            alignItems: "center",
          }}
        >
          <View className="items-center">
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 12,
                borderRightWidth: 12,
                borderBottomWidth: 12,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "#FFBD12",
                backgroundColor: "transparent",
                position: "absolute",
                top: -10,
                zIndex: 2,
              }}
            />
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 13,
                borderRightWidth: 13,
                borderBottomWidth: 13,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderBottomColor: "black",
                backgroundColor: "transparent",
                position: "absolute",
                top: -12,
                zIndex: 1,
              }}
            />

            <View
              className="bg-light-yellow rounded-3xl overflow-hidden px-8 py-5 mx-5 md:mt-5 min-h-[20vh]
              border border-b-8 border-black"
            >
              <View className="flex-row flex-wrap w-full gap-2 items-center mb-2">
                <Text
                  className="font-mono-bold text-xl text-light-text dark:text-dark-text tracking-wider flex-1"
                >
                  {set.details?.name}
                </Text>
                <SvgUri width="20px" height="20px" uri={set.details?.icon_svg_uri} />
              </View>

              <View
                className="items-center"
              >
                <Text
                  className="font-sans text-base text-light-text dark:text-dark-text tracking-wide"
                >
                  {`Released date: ${set.details?.released_at}`}
                </Text>
                <Text
                  className="font-sans text-base text-light-text dark:text-dark-text tracking-wide"
                >
                  {`Code: ${set.details?.code}`}
                </Text>
              </View>
              
              <Button 
                title="Open a Play Booster"
                variant="secondary"
                containerStyles="mt-5"
              />
              
            </View>
          </View>
        </Animatable.View>
      )}
    </>
  )
};

const SetSelector = ({ sets }) => {
  const [ activeSetId, setActiveSetId ] = useState(sets[0].code);
  const [ lastSetId, setLastSetId ] = useState(null);
  const [setDetailsLoaded, setSetDetailsLoaded] = useState(false);
  
  const viewableSetsChanges = ({ viewableItems }) => {
    if (viewableItems.length > 0) {
      const firstVisibleItem = viewableItems[0].item;
      const lastVisibleItem = viewableItems[viewableItems.length - 1].item;

      // If the last visible item is the last item in the list, make it active
      if (lastVisibleItem.code === sets[sets.length - 1].code) {
        setActiveSetId(lastVisibleItem.code);
      } else {
        setActiveSetId(firstVisibleItem.code);
      }
    }

  };

  useEffect(() => {
    const getSetDetails = async () => {
      const updatedSets = await Promise.all(
        sets.map(async (set) => {
          const response = await axios.get(`/sets/${set.code}`);
          return { ...set, details: response.data };
        })
      );

      // Replace `sets` with the updated version containing details
      sets.splice(0, sets.length, ...updatedSets);

      // Mark details as loaded and ensure the active set is ready
      setLastSetId(sets[sets.length - 1].code);
      setSetDetailsLoaded(true);
    };

    getSetDetails();
  }, [sets]);

  return (
    <>
      <FlatList
        data={sets}
        keyExtractor={(item) => item.code}
        renderItem={({ item }) => (
          <SetCard 
            activeSetId={activeSetId}
            set={item}
            lastSetId={lastSetId}
          />
          
        )}
        onViewableItemsChanged={viewableSetsChanges}
        viewabilityConfig={{
          itemVisiblePercentThreshold: 90
        }}
        horizontal
        showsHorizontalScrollIndicator={false}
      />
      { setDetailsLoaded && activeSetId && (
        <SetDetails setList={sets} activeSetId={activeSetId} />
      )}
      
    </>
    
  )

};

export default SetSelector;