import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  Image, 
  useWindowDimensions, 
  ScrollView, 
} from "react-native";
import * as Animatable from "react-native-animatable";
import { useState, useEffect, useRef, useMemo } from "react";
import { SvgUri } from "react-native-svg";
import { router } from "expo-router";

import axios from "../../api/axios";

import { getFonts } from "../../utils/FontFamily";
import { soundManager } from "../../utils/SoundManager";
import useDeviceLayout from "../../hooks/useDeviceLayout";

import { devDelay } from "../../utils/DevDelay";

import Button from "../CustomButton/CustomButton";
import CardHighlight from "../Card/CardHighlight";
// import CardDisplay from "../Card/CardDisplay";
import CardDisplay from "../Card/CardDisplayRefactor";
import LoadingSpinnerWithMessages from "../LoadingSpinner/LoadingSpinnerWithMessages";

const zoomIn = {
  0: { scale: 0.85 },
  1: { scale: 1 },
};

const zoomOut = {
  0: { scale: 1 },
  1: { scale: 0.85 },
};

const fonts = getFonts();

const PackCard = ({ activePackId, pack, lastPackId, screenWidth, screenHeight }) => {
  const [ selected, setSelected ] = useState(false);
  const [ buttonDisabled, setButtonDisabled ] = useState(false);
  const timeoutRef = useRef(null);

  const cardHeight = screenHeight > 900 ? 400 : screenHeight > 800 ? 380 : screenHeight > 780 ? 350 : screenHeight > 719 ? 330 : 300;
  const cardWidth = Math.floor(cardHeight / 2);

  // Reset the selected state when the card is swiped away
  useEffect(() => {
    
    if (activePackId !== pack.pack_id) {
      setSelected(false);
    }

    return () => {
      // clear any pending navigation timeout
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
    };

  }, [activePackId, pack.pack_id])
  

  const handlePress = async () => {
    soundManager.playSfx("shine-8");
    setSelected(true); // Update the selected state
  };

  const handleConfirmation = async () => {
    const packType = pack.pack_type.replace("_","-");
    setButtonDisabled(true);
    soundManager.playSfx("game-bonus");
    timeoutRef.current = setTimeout(
      () => router.push(`/pack/${packType}/${pack.set_code}`),
      300
    );
  };

  return (
    <Animatable.View
      className={`${ lastPackId === pack.pack_id ? "mr-2" : ""}`}
      animation={activePackId === pack.pack_id ? zoomIn : zoomOut}
      duration={500}
    >
      <View className="overflow-visible" style={{width: cardWidth, height: cardHeight}}>

        {/* Glowing Highlight */}
        {activePackId === pack.pack_id && (
          <View
            style={{
              position: "absolute",
              transform: [{ translateX: 0.1 * cardWidth }, { translateY: 0.1 * cardHeight }], // Center glow
              width: "80%", // Width of the glow
              height: "60%", // Height of the glow
              backgroundColor: "rgba(255, 215, 0, 0.3)", // Semi-transparent yellow
              borderRadius: cardWidth / 2, // Rounded edges for glow
              shadowColor: "yellow",
              shadowOffset: { width: 3, height: 10 },
              shadowOpacity: 1,
              shadowRadius: cardWidth / 4, // Creates the "glow" effect
              elevation: cardWidth / 4, // Android shadow
              zIndex: -1, // Place glow behind the content
            }}
          />
        )}

        { activePackId === pack.pack_id && (
          <TouchableOpacity
            onPress={handlePress}
          >
            <Image 
              source={pack.image}
              resizeMode="contain"
              style={{
                maxHeight: cardHeight,
                width: "auto",
              }}
            />

            { pack.price && (
              <View
                className="rounded-xl justify-center items-center bg-dark-grey2/85"
                  style={{
                    position: "absolute", // Position on top of the image
                    right: "50%",
                    transform: [{ translateX: 0.48 * cardWidth}, {translateY: 0.8 * cardHeight }],
                    height: 30,
                    width: 0.96 *cardWidth,
                    elevation: 4, // Shadow for Android
                    shadowColor: "#000", // Shadow color
                    shadowOffset: { width: 0, height: 2 }, // Offset
                    shadowOpacity: 0.6, // Shadow opacity
                    shadowRadius: 4, // Blur radius
                  }}
              >
                <Text className="text-base font-sans-semibold tracking-wide">
                  {`USD ${pack.price}`}
                </Text>
              </View>
            )}
          </TouchableOpacity>
        )}
        
        { activePackId !== pack.pack_id && (
          <Image 
            source={pack.image}
            resizeMode="contain"
            style={{
              maxHeight: cardHeight,
              width: "auto",
            }}
          />
        )}

        {/* Confirmation Popup */}
        {selected && activePackId === pack.pack_id && (
          <View
            style={{
              position: "absolute",
              top: "80%",
              left: "50%",
              transform: [{ translateX: screenWidth < 400 ? -0.55 * cardWidth : -0.5 * cardWidth}, { translateY: -0.4 * cardHeight }],
              width: screenWidth < 400 ? cardWidth * 1.1 : cardWidth,
              height: 110,
              backgroundColor: "rgba(203, 166, 247, 0.95)",
              borderRadius: 10,
              flexDirection: "column",
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
              className={`${screenWidth < 400 ? "text-xs" : "text-base"} text-center font-mono-bold text-light-text tracking-wide`}
              style={{ fontFamily: fonts.monoBold }}
            >
              Open this pack?
            </Text>

            <View className={`${screenWidth < 400 ? "flex-col-reverse gap-2" : "flex-row gap-1"} mt-3`}>
              <Button
                isDisabled={buttonDisabled} 
                title="Cancel"
                handlePress={() => setSelected(false)}
                variant={screenWidth < 400 ? "extra-small-secondary" : "small-secondary"}
              />
              <Button 
                title="Confirm"
                isDisabled={buttonDisabled} 
                handlePress={handleConfirmation}
                variant={screenWidth < 400 ? "extra-small-primary" : "small-primary"}
              />
            </View>
          </View>  
        )}
        
      </View>
    </Animatable.View>
  )
};

const PackCardWeb = ({pack, updateHoveredPackId, index, cardHeight, cardWidth}) => {
  const [ isHovered, packIsHovered ] = useState(false);
  const handleMouseEnter = () => {
    packIsHovered(true);
    updateHoveredPackId(index);
  };
  const handleMouseLeave = () => {
    packIsHovered(false);
    updateHoveredPackId(null);
  };
  const timeoutRef = useRef(null);

  // const cardHeight = 350;
  // const cardWidth = 200;

  const setCardHeight = cardHeight.toString() + "px";
  const setCardWidth = cardWidth.toString() + "px";

  // shadow
  const shadowHeight = 0.6 * cardHeight;
  const shadowWidth = 0.7 * cardWidth;

  const packType = pack.pack_type.replace("_", "-");

  return (
    <View
      className={`justify-center overflow-visible pb-4`}
      style={{
        transform: isHovered ? [{ scale: 1.1 }] : [{ scale : 1 }],
        transition: "transform 0.5s ease",
        height: setCardHeight,
        width: setCardWidth,
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
        source={pack.image}
        resizeMode="contain"
        style={{
          maxHeight: cardHeight,
          width: "auto",
        }}
      />

      { pack.price && (
        <View
          className="rounded-lg justify-center items-center bg-dark-grey2/90"
            style={{
              position: "absolute", // Position on top of the image
              top: "10%",
              right: "1%",
              height: 20,
              width: 75,
              elevation: 2, // Shadow for Android
              shadowColor: "#000", // Shadow color
              shadowOffset: { width: 0, height: 2 }, // Offset
              shadowOpacity: 0.3, // Shadow opacity
              shadowRadius: 4, // Blur radius
            }}
        >
          <Text className="text-xs font-sans-semibold tracking-wide">
            {`USD ${pack.price}`}
          </Text>
        </View>
      )}

      { isHovered && (
        <TouchableOpacity
          className="rounded-full justify-center items-center bg-light-yellow"
          style={{
            position: "absolute", // Position on top of the image
            top: "80%",
            left: "50%",
            transform: [{ translateX: -40 }, { translateY: -20 }], // Center it perfectly
            height: 30,
            width: 80,
            elevation: 5, // Shadow for Android
            shadowColor: "#000", // Shadow color
            shadowOffset: { width: 0, height: 2 }, // Offset
            shadowOpacity: 0.6, // Shadow opacity
            shadowRadius: 4, // Blur radius
          }}
          onPress={() => {
            soundManager.playSfx("game-bonus");
            timeoutRef.current = setTimeout(
              () => router.push(`/pack/${packType}/${pack.set_code}`),
              300
            );
          }}
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

const PackDetails = ({ pack, activePackId, enlargeCardHighlight, screenWidth, screenHeight, isDesktopWeb, isNative }) => {
  const [animationKey, setAnimationKey] = useState(0);

  const containerHeight = screenHeight > 900 ? 180 : screenHeight > 800 ? 150 : screenHeight > 780 ? 130 : screenHeight > 719 ? 120 : 100;
  const containerWidth = screenWidth * 0.7;

  useEffect(() => {
    // Trigger a re-render of the Animatable.View to animate the component
    setAnimationKey((prevKey) => prevKey + 1);

  }, [activePackId]);

  return (
    <>
      { pack && (
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
              className="rounded-3xl overflow-hidden px-8 py-5 mx-5 md:mt-5
              border border-b-4 flex-column justify-between"
              style={{
                backgroundColor: "rgba(249, 226, 175, 0.7)",
                borderColor: "#00000020",
                maxHeight: containerHeight * 2.1,
              }}
            >
              <View className="flex-row flex-wrap w-full gap-2 items-center mb-2">
                <Text
                  className={`${containerHeight <= 150 ? "text-xs" : "text-base"} font-sans-bold text-light-text tracking-wider flex-1 leading-tight`}
                >
                  {pack.set_name}
                </Text>
                <SvgUri 
                  width={containerHeight <= 150 ? "15px" : "20px"} 
                  height={containerHeight <= 150 ? "15px" : "20px"}
                  uri={pack.set_icon_svg_uri}
                />
              </View>

              <View className={`mb-2`}>
                <Text
                  className={`${containerHeight <= 150 ? "text-xs" : "text-base"} font-sans-light text-light-text tracking-wide`}
                >
                  Most popular cards from this pack:
                </Text>
              </View>
              
              <CardHighlight 
                cards={pack.top_cards}
                containerWidth={containerWidth}
                containerHeight={containerHeight * 0.8}
                handleLongPress={enlargeCardHighlight}
                isDesktopWeb={isDesktopWeb}
                isNative={isNative}
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

const PackDetailsWeb = ({ pack, hoveredPackId }) => {
  const [animationKey, setAnimationKey] = useState(0);

  const backgroundColor = "rgba(249, 226, 175, 0.4)";

  const { width, height } = useWindowDimensions();

  const containerHeight = Math.floor(0.35 * height);
  const containerWidth = Math.floor(0.85 * width);

  useEffect(() => {
    // Trigger a re-render of the Animatable.View to animate the component
    setAnimationKey((prevKey) => prevKey + 1);
  }, [hoveredPackId]);

  return (
    <>
      { hoveredPackId && (
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
                {pack.set_name}
              </Text>
              <SvgUri width="20px" height="20px" uri={pack.set_icon_svg_uri} />
            </View>

            <View className="items-center">
              <Text
                className="font-sans-light text-base tracking-wide mb-1 mt-2"
              >
                Most popular cards from this pack:
              </Text>
              { pack.top_cards && pack.top_cards?.length && (
                <CardHighlight
                  cards={pack.top_cards} 
                  containerWidth={containerWidth*0.9}
                  containerHeight={containerHeight*0.5}
                />
              )}
              { (!pack.top_cards || !pack.top_cards.length) && (
                <Text className="mt-10 mb-5 text-lg font-sans-bold text-light-text text-center">
                  Loading...
                </Text>
              )}

            </View>
            
          </View>

        </View>

        </Animatable.View>
      )}
    </>
  )
};

const PackSelector = ({ sets }) => {

  const stablePacks = useMemo(() => {
    const packs = [];
    const packTypes = ["play_booster", "collector_booster"];
    sets.forEach(set => {
      packTypes.forEach(type => {
        const pack = {
          set_code: set.code,
          pack_id: `${set.code}-${type}`,
          pack_type: type,
          image: set[`${type}_image`],
        };
        packs.push(pack);
      })
    })
    return packs;
  }, [sets]);

  const [ packs, setPacks ] = useState([]);

  const [ activePackId, setActivePackId ] = useState(stablePacks?.[0]?.pack_id);
  const [ activePackTopCards, setActivePackTopCards ] = useState([]);
  const [ lastPackId, setLastPackId ] = useState(null);

  const [ packDetailsLoaded, setPackDetailsLoaded ] = useState(false);

  const [ hoveredPackId, setHoveredPackId ] = useState(null);

  const [ enlargedCardHighlight, setEnlargedCardHighlight ] = useState(false);

  const { isDesktopWeb, height, width, isMobileWeb, isNative } = useDeviceLayout();

  // Keep latest sets (with details) in a ref so the viewability handler
  // never needs to close over changing arrays.
  const packsRef = useRef(packs);

  useEffect(() => {
    packsRef.current = packs;
  }, [packs]);

  // ----- Stable FlatList onViewableItemsChanged (fixes mobile web crash) -----
  const viewablePacksChangesRef = useRef(null);

  useEffect(() => {
    viewablePacksChangesRef.current = ({ viewableItems }) => {
      const currentPacks = packsRef.current || [];
      if (!viewableItems?.length || !currentPacks.length) return;

      const firstVisibleItem = viewableItems[0]?.item;
      const lastVisibleItem = viewableItems[viewableItems.length - 1]?.item;
      const lastPackId = currentPacks[currentPacks.length - 1]?.pack_id;

      if (lastVisibleItem?.pack_id && lastVisibleItem.pack_id === lastPackId) {
        const pack_id = lastVisibleItem.pack_id;
        const top_cards = lastVisibleItem.top_cards ? lastVisibleItem.top_cards : [];
        // console.log("[PackSelector] activePackId changed to: " + pack_id);
        setActivePackId(pack_id);
        setActivePackTopCards(top_cards);
      } else if (firstVisibleItem?.pack_id) {
        const pack_id = firstVisibleItem.pack_id;
        const top_cards = firstVisibleItem.top_cards ? firstVisibleItem.top_cards : [];
        // console.log("[PackSelector] activePackId changed to: " + pack_id);
        setActivePackId(pack_id);
        setActivePackTopCards(top_cards);
      }
    };
  }, []);

  const stableOnViewableItemsChanged = useRef((info) => {
    viewablePacksChangesRef.current?.(info);
  }).current;

  // ----- Desktop web wheel scroll -----
  const handleWheelScroll = (event) => {
    // Adjust the scroll position horizontally
    event.currentTarget.scrollLeft += event.deltaY;
  };

  const updateHoveredPackId = (index) => {
    if (index) {
      setHoveredPackId(packs[index].pack_id);
    } else {
      setHoveredPackId(null);
    }
    
  };

  // ----- Fetch set details -----
  useEffect(() => {
    let cancelled = false;

    const getPackDetails = async () => {

      try {

        setPackDetailsLoaded(false);

        // await devDelay(1000);

        const updatedPacks = [];
        for await (const set of sets) {
          const response = await axios.get(`/sets/${set.code}?top-cards=true`);
          const data = response.data;
          const { _id, scryfall_id, name, icon_svg_uri, pack_prices } = data;

          const packTypes = [ "play_booster", "collector_booster"];
          for (const type of packTypes) {
            const matchingPack = pack_prices.filter(p => p.booster_type === type)[0];
            const pack = {
              pack_id: `${set.code}-${type}`,
              set_code: set.code,
              set_id: _id,
              set_scryfall_id: scryfall_id,
              set_name: name,
              set_icon_svg_uri: icon_svg_uri,
              pack_type: type,
              image: set[`${type}_image`],
              price: matchingPack && matchingPack.price ? matchingPack.price : null,
            };

            const rawTopCards = data.top_cards?.[type]?.cards && data.top_cards?.[type].cards?.length
              ? data.top_cards?.[type].cards
              : [];
            
            const formattedTopCards = [];
            for (const card of rawTopCards) {
              const formattedCard = card.card_id;
              formattedCard.final_price = card.final_price;
              formattedCard.finish = card.finish;
              formattedTopCards.push(formattedCard);
            } 

            pack.top_cards = formattedTopCards;

            updatedPacks.push(pack);
          }
        }

        if (cancelled) return;

        setPacks(updatedPacks);
        setLastPackId(packs[updatedPacks.length - 1]?.pack_id ?? null);
        setPackDetailsLoaded(true);

      } catch (error) {
        console.error("[PackSelector] Failed to get pack details:", error);
        if (!cancelled) setPackDetailsLoaded(false);
      }
    };

    if (sets?.length) {
      getPackDetails();
    } else {
      setPacks([]);
      setLastPackId(null);
      setPackDetailsLoaded(true);
    }

    return () => {
      cancelled = true;
    };

  }, [sets.map(s => s.code).join(",")]); // IMPORTANT: don't depend on the whole `sets` array if it is recreated often

  // ----- Ensure activePackId is valid when packschanges -----
  useEffect(() => {
    if (!packs.length) return;

    if (!activePackId) {
      setActivePackId(packs[0].pack_id);
      return;
    }

    const stillExists = packs.some((p) => p.pack_id === activePackId);
    if (!stillExists) {
      setActivePackId(packs[0].pack_id);
    }

  }, [packs, activePackId]);
  
  // Prefer rendering from the detailed pack list once loaded,
  // but fall back to stablePacks so UI isn't empty.
  const packData = packDetailsLoaded ? packs : stablePacks;
  
  return (
    <View className="h-screen w-screen" style={{ position: "absolute", paddingTop: isDesktopWeb ? 90 : isMobileWeb ? 100 : 130 }}>
      <Text
        className={`text-center font-serif-bold tracking-wider
          ${ isDesktopWeb ? "text-dark-teal text-4xl mb-2" : width >= 415 ? "text-dark-teal text-3xl mb-5" : "text-dark-teal text-2xl mb-5"}`
        }
        style={{
          textShadowColor: "#00000080",
          textShadowOffset: { width: 0, height: 1, },
          textShadowRadius: 6,
        }}
      >
        Open a Booster Pack
      </Text> 

      {/* DESKTOP WEB */}  
      { isDesktopWeb && packDetailsLoaded && (
        <View
          onWheel={handleWheelScroll}
          className={`ml-16 mr-16 overflow-x-auto overflow-y-hidden flex-row flex-nowrap py-4 gap-4 scrollbar-webkit
            ${height > 900 ? "mt-8" : "mt-3"}
            `}
        >
          {packData.map((pack, index) => (
            <PackCardWeb 
              key={pack.pack_id} 
              index={index} 
              pack={pack}
              updateHoveredPackId={updateHoveredPackId}
              cardHeight={310}
              cardWidth={200}
            />
            )
          )}
        </View>
      )}

      { isDesktopWeb && packDetailsLoaded && (
        <PackDetailsWeb 
          pack={packs.filter(p => p.pack_id === hoveredPackId)[0]} 
          hoveredPackId={hoveredPackId}
        />
      )}

      {/* MOBILE (APP + MOBILE WEB) */}
      { !isDesktopWeb && packDetailsLoaded && activePackId && (
        <PackDetails 
          pack={packs.filter(p => p.pack_id === activePackId)[0]}
          activePackId={activePackId} 
          enlargeCardHighlight={() => setEnlargedCardHighlight(true)}
          screenWidth={width}
          screenHeight={height}
          isDesktopWeb={isDesktopWeb}
          isNative={isNative}
        />
      )}

      { !isDesktopWeb && packDetailsLoaded && (
        <View className="zIndex-10">
          <FlatList
            data={packData}
            keyExtractor={(item) => item.pack_id}
            renderItem={({ item }) => (
              <PackCard 
                activePackId={activePackId}
                pack={item}
                lastPackId={lastPackId}
                screenWidth={width}
                screenHeight={height}
              />
              
            )}
            onViewableItemsChanged={stableOnViewableItemsChanged}
            viewabilityConfig={{
              itemVisiblePercentThreshold: 90
            }}
            horizontal
            showsHorizontalScrollIndicator={false}
          />
        </View>
      )}

      {/* Enlarged highlight overlay */}
      { !isDesktopWeb 
        && packDetailsLoaded 
        && activePackId
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
              { activePackTopCards.length > 0 && (
                <View className="pl-3 flex-row flex-nowrap gap-5 h-fit justify-center">
                  {activePackTopCards.map(card => (
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

      {!packDetailsLoaded && (
        <LoadingSpinnerWithMessages
          intervalMs={3500}
        />
      )}
      
    </View>
    
  )

};

export default PackSelector;