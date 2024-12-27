import { View, Text, FlatList, TouchableOpacity, Image, useWindowDimensions, Platform } from "react-native";
import * as Animatable from "react-native-animatable";
import React, { useState, useEffect } from "react";
import { SvgUri } from "react-native-svg";
import { router } from "expo-router";

import axios from "../../api/axios";

import tailwindConfig from "../../tailwind.config";

import Button from "../CustomButton/CustomButton";
import CardHighlight from "./../Card/CardHighlight";

// import "../../global.css";

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
      <View className="h-[450px] w-[200px] overflow-visible">
        {/* Glowing Highlight */}
        {activeSetId === set.code && (
          <View
            style={{
              position: "absolute",
              left: "50%",
              transform: [{ translateX: -100 }, { translateY: 55 }], // Center glow
              width: "100%", // Width of the glow
              height: "60%", // Height of the glow
              backgroundColor: "rgba(255, 215, 0, 0.01)", // Semi-transparent yellow
              borderRadius: 70, // Rounded edges for glow
              shadowColor: "yellow",
              shadowOffset: { width: 0, height: 0 },
              shadowOpacity: 0.5,
              shadowRadius: 30, // Creates the "glow" effect
              elevation: 35, // Android shadow
              zIndex: -1, // Place glow behind the content
            }}
          />
        )}
        <Image 
          source={set.play_booster_image}
          resizeMode="contain"
          style={{
            maxHeight: 450,
            width: "auto",
          }}
        />
      </View>
    </Animatable.View>
  )
};

const SetCardWeb = ({set, updateHoveredSetId, index}) => {
  const [ isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
    updateHoveredSetId(index);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    updateHoveredSetId(null);
  };

  return (
    <View
      className="h-[420px] w-[220px] justify-center mx-2"
      style={{
        transform: isHovered ? [{ scale: 1.1 }] : [{ scale : 1 }],
        transition: "transform 0.5s ease",
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glowing Highlight */}
      {isHovered && (
        <View
          style={{
            position: "absolute",
            left: "50%",
            transform: [{ translateX: -90 }], // Center glow
            width: 180, // Width of the glow
            height: 380, // Height of the glow
            backgroundColor: "rgba(255, 215, 0, 0.05)", // Semi-transparent yellow
            borderRadius: 100, // Rounded edges for glow
            shadowColor: "yellow",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 50, // Creates the "glow" effect
            elevation: 6, // Android shadow
            zIndex: -1, // Place glow behind the content
          }}
        />
      )}

      <Image 
        source={set.play_booster_image}
        resizeMode="contain"
        style={{
          maxHeight: 400,
          width: "auto",
        }}
      />
      { isHovered && (
        <TouchableOpacity
          className="rounded-full justify-center items-center bg-light-yellow"
          style={{
            position: "absolute", // Position on top of the image
            top: "80%", // Move to 50% of the parent height
            left: "50%", // Move to 50% of the parent width
            transform: [{ translateX: -60 }, { translateY: -20 }], // Center it perfectly
            height: 40,
            width: 120,
            elevation: 5, // Shadow for Android
            shadowColor: "#000", // Shadow color
            shadowOffset: { width: 0, height: 2 }, // Offset
            shadowOpacity: 0.6, // Shadow opacity
            shadowRadius: 4, // Blur radius
          }}
        >
          <Text className="text-base font-sans tracking-wide">
            Open
          </Text>
        </TouchableOpacity>
      )}

    </View>
  )
};

const SetDetails = ({ setList, activeSetId }) => {
  const set = setList.filter(set => set.code === activeSetId)[0];
  const [animationKey, setAnimationKey] = useState(0);

  const backgroundColor = tailwindConfig.theme.extend.colors.dark.yellow;

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
            marginTop: 10,
            alignItems: "center",
          }}
        >
          <View className="items-center">

            <View
              className="bg-dark-yellow rounded-3xl overflow-hidden px-8 py-5 mx-5 md:mt-5 h-[25vh]
              border border-b-8 border-black flex-column"
            >
              <View className="flex-row flex-wrap w-full gap-2 items-center mb-1 flex-1">
                <Text
                  className="font-mono-bold text-lg text-light-text tracking-wider flex-1"
                >
                  {set.details?.name}
                </Text>
                <SvgUri width="20px" height="20px" uri={set.details?.icon_svg_uri} />
              </View>

              <View className="mb-1">
                <Text
                  className="font-sans-light text-xs text-light-text tracking-wide"
                >
                  Most popular cards from this set:
                </Text>
              </View>

              <CardHighlight 
                setCode={set.code}
                containerWidth={320}
                containerHeight={120}
              />
              
            </View>

            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 12,
                borderRightWidth: 12,
                borderTopWidth: 12,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: backgroundColor,
                backgroundColor: "transparent",
                position: "absolute",
                bottom: -4,
                zIndex: 2,
              }}
            />
            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 13,
                borderRightWidth: 13,
                borderTopWidth: 13,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "black",
                backgroundColor: "transparent",
                position: "absolute",
                bottom: -6,
                zIndex: 1,
              }}
            />
          </View>
        </Animatable.View>
      )}
    </>
  )
};

const SetDetailsWeb = ({ sets, hoveredSetId}) => {
  const set = sets[hoveredSetId];
  const [animationKey, setAnimationKey] = useState(0);

  const backgroundColor = tailwindConfig.theme.extend.colors.dark.yellow;

  const { width, height } = useWindowDimensions();

  const containerHeight = Math.floor(0.4 * height);
  const containerWidth = Math.floor(0.7 * width);

  useEffect(() => {
    // Trigger a re-render of the Animatable.View to animate the component
    setAnimationKey((prevKey) => prevKey + 1);
  }, [hoveredSetId]);

  return (
    <>
      { (hoveredSetId || hoveredSetId === 0) && (
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
              borderBottomColor: backgroundColor,
              backgroundColor: "transparent",
              position: "absolute",
              top: 10,
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
              top: 9,
              zIndex: 1,
            }}
          />

          <View
            className="bg-dark-yellow rounded-3xl overflow-hidden px-8 py-5 mx-5 md:mt-5 h-[30vh]
            border border-b-8 border-black items-center"
            style={{
              height: containerHeight,
              width: containerWidth,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <View className="w-full gap-2 items-center mb-2 w-[50%]">
              <Text
                className="font-mono-bold text-xl text-light-text dark:text-dark-text tracking-wider"
              >
                {set.details?.name}
              </Text>
              <SvgUri width="20px" height="20px" uri={set.details?.icon_svg_uri} />
            </View>

            <View
              className="items-center"
            >
              <Text
                className="font-sans-light text-base text-light-text tracking-wide mb-1 mt-2"
              >
                Most popular cards from this set:
              </Text>
              <CardHighlight 
                setCode={set.code}
                containerWidth={containerWidth*0.9}
                containerHeight={containerHeight*0.8}
              />

            </View>
            
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
  const [ setDetailsLoaded, setSetDetailsLoaded ] = useState(false);
  const [ hoveredSetId, setHoveredSetId ] = useState(null);
  
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

  const handleWheelScroll = (event) => {
    // Adjust the scroll position horizontally
    event.currentTarget.scrollLeft += event.deltaY;
  };

  const updateHoveredSetId = (index) => {
    setHoveredSetId(index);
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
      { Platform.OS === "web" && (
        <View
          onWheel={handleWheelScroll}
          style={{ 
            WebkitOverflowScrolling: "touch",
            scrollbarWidth: hoveredSetId === null ? "none" : "auto",
            msOverflowStyle: hoveredSetId === null ? "none" : "auto", 
          }}
          className="scroll-container overflow-x-auto overflow-y-hidden flex-row flex-nowrap mt-3 py-4 gap-4"
        >
          {sets.map((set, index) => (
            <SetCardWeb 
              key={index} 
              index={index} 
              set={set} 
              updateHoveredSetId={updateHoveredSetId}
            />
            )
          )}
        </View>
      )}

      { Platform.OS === "web" && (
        <SetDetailsWeb sets={sets} hoveredSetId={hoveredSetId}/>
      )}

      { Platform.OS !== "web" && setDetailsLoaded && activeSetId && (
        <SetDetails setList={sets} activeSetId={activeSetId} />
      )}

      { Platform.OS !== "web" && (
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
      )}
      
    </>
    
  )

};

const customCSS = `
  .scroll-container {
    scrollbar-width: none;
  }
  .scroll-container::-webkit-scrollbar {
    height: 8px;
  }
  .scroll-container::-webkit-scrollbar-track {
    background: #f1f1f1;
  }
  .scroll-container::-webkit-scrollbar-thumb {
    background: #888;
    border-radius: 4px;
  }
  .scroll-container:not(:hover)::-webkit-scrollbar {
    display: none;
  }
`;

export default SetSelector;