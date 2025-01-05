import { View, Text } from "react-native";
import React, { useState, useRef, useEffect } from "react";
import Swiper from "react-native-deck-swiper";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import * as Animatable from "react-native-animatable";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  Easing,
} from "react-native-reanimated";
import { Audio } from "expo-av";

import CardDisplay from "./CardDisplay";
import Button from "../CustomButton/CustomButton";

import tailwindConfig from "../../tailwind.config";

const PRICE_HIGHLIGHT_THRESHOLD = 5;

const zoomIn = {
  0: { scale: 0.6 },
  1: { scale: 1 },
};

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
          shadowColor: "#000",
          shadowOffset: {
            width: 0,
            height: 2,
          },
          shadowOpacity: 0.5,
          shadowRadius: 3.84,
          elevation: 5,
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

const Summary = ({ totalValue, topCard }) => {
  const [animationKey, setAnimationKey] = useState(0);

  useEffect(() => {
    // Trigger a re-render of the Animatable.View to animate the component
    setAnimationKey((prevKey) => prevKey + 1);
  }, []);

  return (
    <Animatable.View
      key={animationKey}
      animation={zoomIn}
      iterationCount={1}
      duration={500}
      style={{
        position: "relative",
        width: "100%",
        alignItems: "center"
      }}
    >
      <View className="position-relative h-[50vh] w-9/12">
        <View 
          className="w-full h-full rounded-3xl py-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderWidth: 7,
          }}
        >
          <View className="flex-column justify-center items-center gap-2">
            <Text className="text-center font-sans-semibold tracking-wide text-light-text">
              Total Pack Value:
            </Text>
            <Text className="text-center font-sans-bold text-3xl tracking-wider text-light-dark-yellow">
              {`USD ${totalValue}`}
            </Text>
          </View>

          <View className="flex-column justify-center items-center gap-2 mt-5">
            <Text className="text-center font-sans-semibold tracking-wide text-light-text">
              Top card:
            </Text>
            <View style={{ maxWidth: "80%" }}>
              <View className="position-relative">
                <CardDisplay 
                  card={topCard}
                  maxWidth={200}
                  sparklesOn={true}
                />
                <View
                  style={{
                    position: "absolute",
                    bottom: -10,
                    right: -10,
                    zIndex: 30,
                    justifyContent: "center",
                    alignItems: "center"
                  }}
                >
                  <ZoomOutText 
                    backgroundColor={tailwindConfig.theme.extend.colors.light.teal}
                    textStyle="text-left text-base tracking-wide text-light-yellow font-sans-semibold"
                    content={`USD ${topCard.final_price}`}
                    counter={0}
                    />
                </View>
              </View>
              
            </View>
            
          </View>
          
        </View>
      </View>
    </Animatable.View>
    
  );
};

const CardSwiper = ({ cards, setCode }) => {
  const firstCardPrice = cards[0].final_price || "0" ;
  const [ counter, setCounter ] = useState(1);
  const [ totalValue, setTotalValue ] = useState(parseFloat(firstCardPrice).toFixed(2));
  const [ swipedAllCards, setSwipedAllCards ] = useState(false);
  const [ topCard, setTopCard ] = useState(cards[0]);
  const bloopSoundRef = useRef(null);
  const highlightSoundRef = useRef(null);
  const summarySoundRef = useRef(null);

  const burstRef = useRef(null);

  useEffect(() => {
    console.log("CardSwiper mounts...")
    return () => {
      if (bloopSoundRef.current) {
        bloopSoundRef.current.unloadAsync();
        bloopSoundRef.current = null;
      }
      if (highlightSoundRef.current) {
        highlightSoundRef.current.unloadAsync();
        highlightSoundRef.current = null;
      }
      if (summarySoundRef.current) {
        summarySoundRef.current.unloadAsync();
        summarySoundRef.current = null;
      }
    };
      
  }, []);
  
  const triggerPriceHighlightAnimation = async () => {
    if (burstRef.current) {
      burstRef.current.play(); // Play the Lottie animation
    }

    // play highlight sound
    try {
      if (highlightSoundRef.current) {
        await highlightSoundRef.current.unloadAsync();
        highlightSoundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/level-up.mp3"),
        { isLooping: false }
      );
      highlightSoundRef.current = sound;
      await sound.setVolumeAsync(0.5);
      await sound.playAsync();

    } catch (error) {
      console.error("Error playing highlight sound:", error);
    }
  };

  const increaseCounter = async () => {
    let currentCardPrice = 0;
    if (counter < cards.length ) {
      currentCardPrice = cards[counter].final_price || "0" ;

      if (parseFloat(currentCardPrice) > parseFloat(topCard.final_price)) {
        setTopCard(cards[counter]);
      }

      if (parseFloat(currentCardPrice) >= PRICE_HIGHLIGHT_THRESHOLD) {
        triggerPriceHighlightAnimation();
      }

      setTotalValue(prev => (parseFloat(prev) + parseFloat(currentCardPrice)).toFixed(2));
    }

    // play bloop sound
    // try {
    //   if (bloopSoundRef.current) {
    //     await bloopSoundRef.current.unloadAsync();
    //     bloopSoundRef.current = null;
    //   }

    //   if (parseFloat(currentCardPrice) < PRICE_HIGHLIGHT_THRESHOLD) {
        
    //     const { sound } = await Audio.Sound.createAsync(
    //       require("../../assets/sounds/happy-pop-1.mp3"),
    //       { isLooping: false }
    //     );
    //     bloopSoundRef.current = sound;
    //     await sound.setVolumeAsync(0.5);
    //     await sound.playAsync();
    //   }
      
    // } catch (error) {
    //   console.error("Error playing bloop sound:", error);
    // }
    
    setCounter(prev => prev + 1);
    
  };

  const openSummary = async () => {
    // play summary sound

    try {
      if (summarySoundRef.current) {
        await summarySoundRef.current.unloadAsync();
        summarySoundRef.current = null;
      }

      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/bonus-points.mp3"),
        { isLooping: false }
      );
      summarySoundRef.current = sound;
      await sound.setVolumeAsync(0.5);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing summaryt sound:", error);
    }

    setSwipedAllCards(true);
  };

  return (
    <View
      className="h-screen flex-column"
    >
      { !swipedAllCards && (
        <>
          <View style={{ justifyContent: "center", alignItems: "center", marginTop: "40", marginBottom: "20" }}>
            <View className="mt-2 justify-center items-center">
              <Text className="text-light-yellow font-sans tracking-wide">
                Total pack value:
              </Text>
            </View>
            <View 
              className="mt-1 rounded-full min-h-[45px] min-w-[200px] justify-center items-center"
              style={{
                backgroundColor: "rgba(255, 255, 255, 0.2)",
                shadowColor: "#000",
                shadowOffset: {
                  width: 0,
                  height: 12,
                },
                shadowOpacity: 0.6,
                shadowRadius: 16,
                elevation: 24,
              }}
            >
              <View className="justify-center items-center flex-row gap-1">
                <Text className="text-light-yellow font-sans-bold text-2xl tracking-wider">
                  {`USD ${totalValue}`}
                </Text>
              </View>
              
            </View>
          </View>
          
          <View className="flex-1 mt-5" style={{ position: "relative", overflow: "visible" }}>
            
            <View className="flex-row px-10 items-center">
              <View 
                className="rounded-full bg-light-mauve justify-center items-center px-3 py-1"
                style={{
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 0,
                    height: 2,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 3.84,
                  elevation: 5,
                }}
              >
                <Text className="font-sans-semibold tracking-wide text-base text-dark-text">
                  New!
                </Text>
              </View>
              <View className="flex-1"></View>
              <View>
                { counter <= cards.length && parseFloat(cards[counter - 1 ].final_price) < PRICE_HIGHLIGHT_THRESHOLD && (
                  <View 
                    className="rounded-full border border-dark-text justify-center items-center px-3 py-1"
                    style={{
                      shadowColor: "#000",
                      shadowOffset: {
                        width: 0,
                        height: 2,
                      },
                      shadowOpacity: 0.5,
                      shadowRadius: 3.84,
                      elevation: 5,
                    }}
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
                  priceThreshold={PRICE_HIGHLIGHT_THRESHOLD}
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
              onSwipedAll={() => openSummary()}
            />

          </View>

          {/* Sparkle Burst Animation */}
          <LottieView
            ref={burstRef}
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

          <View className="flex-row-reverse justify-start border border-transparent h-[25vh] my-1 px-12">
            
            <Text className="text-dark-text font-sans tracking-wide">
              {` / ${cards.length} cards`}
            </Text>
            <Text 
              className="text-light-yellow font-sans-semibold tracking-wide"
            >
              {counter}
            </Text>
            
          </View>
        </>
        
      )}
      
      { swipedAllCards && (
        <View className="h-[90vh] justify-center items-center flex-column">
          <Summary 
            totalValue={totalValue}
            topCard={topCard}
          />
          <Button 
            title="Open Another Pack"
            containerStyles={"mt-5 mb-5"}
            handlePress={() => router.replace(`/pack/play-booster/${setCode}`)}
          />
          <Button 
            variant="secondary"
            title="Back to Home"
            handlePress={() => router.push(`/home`)}
          />
        </View>
        
      )}
      
    </View>
  )
};

export default CardSwiper;