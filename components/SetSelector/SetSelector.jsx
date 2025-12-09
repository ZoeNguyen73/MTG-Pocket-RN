import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  useWindowDimensions, 
  Platform, 
  ScrollView, 
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useState, useEffect, useRef } from "react";
import { SvgUri } from "react-native-svg";
import { router } from "expo-router";
import { Audio } from "expo-av";

import axios from "../../api/axios";

import { getFonts } from "../../utils/FontFamily";
import { soundManager } from "../../utils/SoundManager";
import { soundAssets } from "../../constants/sounds";

import Button from "../CustomButton/CustomButton";
import CardHighlight from "./../Card/CardHighlight";
import CardDisplay from "../Card/CardDisplay";

const zoomIn = {
  0: { scale: 0.85 },
  1: { scale: 1 },
};

const zoomOut = {
  0: { scale: 1 },
  1: { scale: 0.85 },
};

const fonts = getFonts();

const SetCard = ({ activeSetId, set, lastSetId }) => {
  const [ selected, setSelected ] = useState(false);
  const soundRef = useRef(null);

  const handlePress = async () => {
    const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          soundAssets["shine-8"],
          { isLooping: false }
        );
        soundRef.current = sound;
        await sound.setVolumeAsync(soundManager.getSoundEffectsVolume());
        await sound.playAsync();

      } catch (error) {
        console.error("Error playing sound:", error);
      }
    };

    playSound();

    setSelected(true); // Update the selected state

    // Cleanup: Unload the sound when the component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
    };
  };

  const handleConfirmation = async () => {
    const playSound = async () => {
      try {
        const { sound } = await Audio.Sound.createAsync(
          soundAssets["game-bonus"],
          { isLooping: false }
        );
        soundRef.current = sound;
        await sound.setVolumeAsync(soundManager.getSoundEffectsVolume());
        await sound.playAsync();

      } catch (error) {
        console.error("Error playing sound:", error);
      }
    };

    playSound();

    const timeoutRef = setTimeout(
      () => router.push(`/pack/play-booster/${set.code}`),
      1000
    );

    // Cleanup: Unload the sound when the component unmounts
    return () => {
      if (soundRef.current) {
        soundRef.current.unloadAsync();
      }
      clearTimeout(timeoutRef);
    };
  };

  // Reset the selected state when the card is swiped away
  useEffect(() => {
    if (activeSetId !== set.code) {
      setSelected(false);
    }
  }, [activeSetId, set.code])

  return (
    <Animatable.View
      className={`${ lastSetId === set.code ? "mr-2" : ""}`}
      animation={activeSetId === set.code ? zoomIn : zoomOut}
      duration={500}
    >
      <View className="h-[400px] w-[200px] overflow-visible">

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

        { activeSetId === set.code && (
          <TouchableOpacity
            onPress={handlePress}
          >
            <Image 
              source={set.play_booster_image}
              resizeMode="contain"
              style={{
                maxHeight: 380,
                width: "auto",
              }}
            />
          </TouchableOpacity>
        )}
        
        { activeSetId !== set.code && (
          <Image 
            source={set.play_booster_image}
            resizeMode="contain"
            style={{
              maxHeight: 380,
              width: "auto",
            }}
          />
        )}

        {/* Confirmation Popup */}
        {selected && activeSetId === set.code && (
          <View
            style={{
              position: "absolute",
              top: "80%",
              left: "50%",
              transform: [{ translateX: -100 }, { translateY: -100 }],
              width: 200,
              height: 110,
              backgroundColor: "rgba(203, 166, 247, 0.95)",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              elevation: 5,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              borderBottomWidth: 6,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: "black"
            }}
          >
            <Text 
              className="font-mono-bold text-lg text-light-text tracking-wider"
              style={{ fontFamily: fonts.monoBold }}
            >
              Open this pack?
            </Text>

            <View className="flex-row gap-3 mt-3">
              <Button 
                title="Cancel"
                handlePress={() => setSelected(false)}
                variant="small-secondary"
              />
              <Button 
                title="Confirm"
                handlePress={handleConfirmation}
                variant="small-primary"
              />
            </View>
          </View>  
        )}
        
      </View>
    </Animatable.View>
  )
};

const SetCardWeb = ({set, updateHoveredSetId, index, cardHeight, cardWidth}) => {
  const [ isHovered, setIsHovered] = useState(false);
  const handleMouseEnter = () => {
    setIsHovered(true);
    updateHoveredSetId(index);
  };
  const handleMouseLeave = () => {
    setIsHovered(false);
    updateHoveredSetId(null);
  };

  // const cardHeight = 350;
  // const cardWidth = 200;

  const setCardHeight = cardHeight.toString() + "px";
  const setCardWidth = cardWidth.toString() + "px";

  // shadow
  const shadowHeight = 0.6 * cardHeight;
  const shadowWidth = 0.7 * cardWidth;

  return (
    <View
      className={`h-[${setCardHeight}] w-[${setCardWidth}] justify-center overflow-visible pb-4`}
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
            transform: [{ translateX: shadowWidth * (-0.5) }], // Center glow
            width: shadowWidth, // Width of the glow
            height: shadowHeight , // Height of the glow
            backgroundColor: "rgba(255, 215, 0, 0.05)", // Semi-transparent yellow
            borderRadius: shadowWidth * 0., // Rounded edges for glow
            shadowColor: "yellow",
            shadowOffset: { width: 0, height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: shadowWidth * 0.5, // Creates the "glow" effect
            elevation: 6, // Android shadow
            zIndex: -1, // Place glow behind the content
          }}
        />
      )}

      <Image 
        source={set.play_booster_image}
        resizeMode="contain"
        style={{
          maxHeight: cardHeight,
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
            transform: [{ translateX: -40 }, { translateY: -20 }], // Center it perfectly
            height: 30,
            width: 80,
            elevation: 5, // Shadow for Android
            shadowColor: "#000", // Shadow color
            shadowOffset: { width: 0, height: 2 }, // Offset
            shadowOpacity: 0.6, // Shadow opacity
            shadowRadius: 4, // Blur radius
          }}
          onPress={() => router.push(`/pack/play-booster/${set.code}`)}
        >
          <Text 
            className="text-base font-sans tracking-wide"
            style={{ fontFamily: fonts.sans }}
          >
            Open
          </Text>
        </TouchableOpacity>
      )}

    </View>
  )
};

const SetDetails = ({ setList, activeSetId, setActiveSetTopCards, enlargeCardHighlight }) => {
  const set = setList.filter(set => set.code === activeSetId)[0];
  const [ topCards, setTopCards ] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    const getTopCards = async () => {
      const response = await axios.get(`/sets/${set.code}/top-cards`);
      const cardData = response.data.top_cards;

      if (cardData.length > 0) {
        // reformat card data
        const reformattedData = [];
        for (let i = 0; i < cardData.length; i++) {
          const card = cardData[i].card_id;
          card.final_price = cardData[i].final_price;
          card.finish = cardData[i].finish;
          reformattedData.push(card);
        }
        setActiveSetTopCards(reformattedData);
        setTopCards(reformattedData);
      };
    };

    if (activeSetId) {
      getTopCards();
    }

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
              className="rounded-3xl overflow-hidden px-8 py-5 mx-5 md:mt-5 h-[25vh]
              border border-b-4 flex-column"
              style={{
                backgroundColor: "rgba(249, 226, 175, 0.4)",
                borderColor: "#00000020"
              }}
            >
              <View className="flex-row flex-wrap w-full gap-2 items-center mb-1 flex-1">
                <Text
                  className="font-sans-bold text-lg text-light-text tracking-wider flex-1"
                >
                  {set.details?.name}
                </Text>
                <SvgUri width="20px" height="20px" uri={set.details?.icon_svg_uri} />
              </View>

              <View className="mb-1">
                <Text
                  className="font-sans-light text-base text-light-text tracking-wide"
                >
                  Most popular cards from this set:
                </Text>
              </View>
              
              <CardHighlight 
                cards={topCards}
                containerWidth={320}
                containerHeight={120}
                handleLongPress={enlargeCardHighlight}
              />
              
            </View>

            <View
              style={{
                width: 0,
                height: 0,
                borderLeftWidth: 10,
                borderRightWidth: 10,
                borderTopWidth: 10,
                borderLeftColor: "transparent",
                borderRightColor: "transparent",
                borderTopColor: "rgba(249, 226, 175, 0.5)",
                backgroundColor: "transparent",
                position: "absolute",
                bottom: -6,
                zIndex: 2,
              }}
            />
          </View>
        </Animatable.View>
      )}
    </>
  )
};

const SetDetailsWeb = ({ sets, hoveredSetId }) => {
  const set = sets[hoveredSetId];
  const [ topCards, setTopCards ] = useState([]);
  const [animationKey, setAnimationKey] = useState(0);

  const backgroundColor = "rgba(249, 226, 175, 0.4)";

  const { width, height } = useWindowDimensions();

  const containerHeight = Math.floor(0.35 * height);
  const containerWidth = Math.floor(0.65 * width);

  useEffect(() => {
    // Trigger a re-render of the Animatable.View to animate the component
    setAnimationKey((prevKey) => prevKey + 1);

    const getTopCards = async () => {
      const response = await axios.get(`/sets/${set.code}/top-cards`);
      const cardData = response.data.top_cards;

      if (cardData.length > 0) {
        // reformat card data
        const reformattedData = [];
        for (let i = 0; i < cardData.length; i++) {
          const card = cardData[i].card_id;
          card.final_price = cardData[i].final_price;
          card.finish = cardData[i].finish;
          reformattedData.push(card);
        }
        setTopCards(reformattedData);
      };
    };

    if (hoveredSetId) getTopCards();
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
              // borderBottomColor: "black",
              backgroundColor: "transparent",
              position: "absolute",
              top: 9,
              zIndex: 1,
            }}
          />

          <View
            className="rounded-3xl overflow-hidden px-8 py-5 mx-5 md:mt-5 h-[30vh]
            border border-b-8 items-center"
            style={{
              height: containerHeight,
              width: containerWidth,
              paddingLeft: 10,
              paddingRight: 10,
              backgroundColor: "rgba(249, 226, 175, 0.5)",
              borderColor: "#00000020"
            }}
          >
            <View className="flex-row w-full gap-2 items-center justify-center mb-2 w-full">
              <Text
                className="font-sans-bold text-xl text-black tracking-wider"
              >
                {set.details?.name}
              </Text>
              <SvgUri width="20px" height="20px" uri={set.details?.icon_svg_uri} />
            </View>

            <View className="items-center">
              <Text
                className="font-sans-light text-base tracking-wide mb-1 mt-2"
              >
                Most popular cards from this set:
              </Text>
              <CardHighlight
                cards={topCards} 
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
  const [ enlargedCardHighlight, setEnlargedCardHighlight ] = useState(false);
  const [ activeSetTopCards, setActiveSetTopCards ] = useState([]);
  
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
    <View className="h-screen w-screen" style={{ position: "absolute"}}>
      <View style={{ height: Platform.OS === "web" ? 90 : 130 }}>
      </View>
      <Text
        className={`text-center font-serif-bold tracking-wider
          ${Platform.OS === "web"? "text-light-teal text-4xl mb-2" : "text-dark-teal text-3xl mb-5"}`
        }
        style={{
          textShadowColor: "#00000080",
          textShadowOffset: { width: 0, height: 1, },
          textShadowRadius: 6,
        }}
      >
        Open a Booster Pack
      </Text> 

      { Platform.OS === "web" && (
        <View
          onWheel={handleWheelScroll}
          className="ml-16 mr-16 overflow-x-auto overflow-y-hidden flex-row flex-nowrap mt-3 py-4 gap-4 scrollbar-webkit"
        >
          {sets.map((set, index) => (
            <SetCardWeb 
              key={index} 
              index={index} 
              set={set} 
              updateHoveredSetId={updateHoveredSetId}
              cardHeight={310}
              cardWidth={200}
            />
            )
          )}
        </View>
      )}

      { Platform.OS === "web" && (
        <SetDetailsWeb sets={sets} hoveredSetId={hoveredSetId}/>
      )}

      { Platform.OS !== "web" && setDetailsLoaded && activeSetId && (
        <SetDetails 
          setList={sets} 
          activeSetId={activeSetId} 
          enlargeCardHighlight={() => setEnlargedCardHighlight(true)}
          setActiveSetTopCards={setActiveSetTopCards}
        />
      )}

      { Platform.OS !== "web" && (
        <View className="zIndex-10">
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
        </View>
        
      )}

      { Platform.OS !== "web" 
        && setDetailsLoaded 
        && activeSetId
        && enlargedCardHighlight 
        && (
          <View 
            style={{
              position: "absolute",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0,0,0,0.8)",
              width: "100%",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
            }}
          >
            <TouchableOpacity
              onPress={() => {
                setEnlargedCardHighlight(false);
              }}
              style={{
                position: "relative",
                width: "100%",
                flex: 1,
              }}
            >
            </TouchableOpacity>

            <ScrollView 
              horizontal
              showsHorizontalScrollIndicator={false}
              style={{
                width: "100%",
                maxHeight: 360,
              }}
            >
              { activeSetTopCards.length > 0 && (
                <View className="pl-3 flex-row flex-nowrap gap-5 h-fit justify-center">
                  {activeSetTopCards.map(card => (
                    <View
                      key={card._id}
                      className="flex-column justify-center items-center gap-1"
                    >
                      <CardDisplay 
                        card={card}
                        maxWidth={220}
                        size="small"
                      />

                      <View
                        className="bg-light-yellow rounded-full justify-center items-center w-[120px] pt-2 pb-1 px-2"
                      >
                        <Text className="font-sans-semibold tracking-wide text-light-text">
                          {`USD ${card.final_price}`}
                        </Text>
                      </View>
                      
                    </View>
                    
                  ))}
                </View>
              )}
            </ScrollView>  

            <TouchableOpacity
              onPress={() => {
                setEnlargedCardHighlight(false);
              }}
              style={{
                position: "relative",
                width: "100%",
                flex: 1,
              }}
            >
            </TouchableOpacity>
          
          </View>
      )}
      
    </View>
    
  )

};

export default SetSelector;