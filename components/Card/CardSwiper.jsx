import { View, Text, Dimensions } from "react-native";
import React, { useState, useRef, useEffect } from "react";
// import Swiper from "react-native-deck-swiper";
import LottieView from "lottie-react-native";
import { router } from "expo-router";
import * as Animatable from "react-native-animatable";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withSpring,
  Easing,
} from "react-native-reanimated";
import { scheduleOnRN } from "react-native-worklets";
import { Audio } from "expo-av";
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import CardDisplay from "./CardDisplay";
import Button from "../CustomButton/CustomButton";

import tailwindConfig from "../../tailwind.config";
import { soundManager } from "../../utils/SoundManager";
import { soundAssets } from "../../constants/sounds";

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

  // index to track what the current card (on top) is
  const [currentIndex, setCurrentIndex] = useState(0);

  const bloopSoundRef = useRef(null);
  const highlightSoundRef = useRef(null);
  const summarySoundRef = useRef(null);

  const burstRef = useRef(null);

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SWIPE_DURATION = 220;
  const SWIPE_THRESHOLD = 80; 
  // Reanimated shared values for the swipe animation
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  const animatedCardStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotate.value}deg` },
    ],
  }));

  useEffect(() => {
    console.log("CardSwiper mounts...")

    const loadSounds = async () => {
      try {
        const { sound: bloopSound } = await Audio.Sound.createAsync(
          soundAssets["paper-collect-3"],
          { isLooping: false }
        );
        bloopSoundRef.current = bloopSound;
  
        const { sound: highlightSound } = await Audio.Sound.createAsync(
          soundAssets["charming-twinkle"],
          { isLooping: false }
        );
        highlightSoundRef.current = highlightSound;
  
        const { sound: summarySound } = await Audio.Sound.createAsync(
          soundAssets["magical-twinkle"],
          { isLooping: false }
        );
        summarySoundRef.current = summarySound;
      } catch (error) {
        console.error("Error loading sounds:", error);
      }
    };

    loadSounds();

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
  
  const playSound = async (soundRef) => {
    try {
      if (soundRef.current) {
        await soundRef.current.setPositionAsync(0); // Reset playback position
        await soundRef.current.setVolumeAsync(soundManager.getSoundEffectsVolume());
        await soundRef.current.playAsync();
      }
    } catch (error) {
      console.error("Error playing sound:", error);
    }
  };
  
  const triggerPriceHighlightAnimation = async () => {
    if (burstRef.current) {
      burstRef.current.play(); // Play the Lottie animation
    }

    // play highlight sound
    await playSound(highlightSoundRef);
  };

  const increaseCounter = async () => {
    let currentCardPrice = 0;

    if (counter < cards.length ) {
      const nextIndex = counter;
      const currentCard = cards[nextIndex];
      currentCardPrice = currentCard.final_price || "0" ;

      if (parseFloat(currentCardPrice) > parseFloat(topCard.final_price)) {
        setTopCard(cards[counter]);
      }

      if (parseFloat(currentCardPrice) >= PRICE_HIGHLIGHT_THRESHOLD) {
        triggerPriceHighlightAnimation();
      }

      setTotalValue(prev => (parseFloat(prev) + parseFloat(currentCardPrice)).toFixed(2));

      setCurrentIndex(nextIndex);

      // Reset card transform for the next card
      // timeout to give time for the new index to be updated
      setTimeout(() => {
        translateX.value = 0;
        rotate.value = 0;
      }, 0);
    }

    // play bloop sound
    await playSound(bloopSoundRef);
    
    setCounter(prev => prev + 1);
    
  };

  const openSummary = async () => {
    // play summary sound
    await playSound(summarySoundRef);
    setSwipedAllCards(true);
  };

  const performSwipeAdvance = (direction) => {
    const exitX = direction * SCREEN_WIDTH * 1.2;

    // Start the animations (Reanimated will still handle these fine from JS)
    translateX.value = withTiming(exitX, {
      duration: SWIPE_DURATION,
      easing: Easing.out(Easing.ease),
    });

    rotate.value = withTiming(8 * direction, {
      duration: SWIPE_DURATION,
      easing: Easing.out(Easing.ease),
    });

    // After animation, move to next card or summary
    setTimeout(() => {
      if (currentIndex >= cards.length - 1) {
        openSummary();
      } else {
        increaseCounter();
      }
    }, SWIPE_DURATION);
  };

  const panGesture = Gesture.Pan()
    .runOnJS(true)
    .onUpdate((event) => {
      // follow the finger
      translateX.value = event.translationX;
      // small tilt based on drag distance
      rotate.value = event.translationX / 25;
    })
    .onEnd((event) => {
      const dragX = event.translationX;
      const shouldSwipe = Math.abs(dragX) > SWIPE_THRESHOLD;

      if (shouldSwipe) {
        const direction = dragX > 0 ? 1 : -1;
        performSwipeAdvance(direction);
      } else {
        // snap back to center
        translateX.value = withSpring(0);
        rotate.value = withSpring(0);
      }
    });


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
            { counter <= cards.length && cards[counter - 1].is_new && (
              <ZoomOutText 
                backgroundColor={tailwindConfig.theme.extend.colors.light.mauve}
                textStyle="text-left text-base tracking-wide text-dark-text font-sans-semibold"
                content="New!"
                counter={counter}
              />
            )}
              
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

            <View className="mt-8 mb-8">
              <GestureDetector gesture={panGesture}>
                <Animated.View style={[{ alignItems: "center" }, animatedCardStyle]} key={currentIndex}>
                  <CardDisplay 
                    card={cards[currentIndex]}
                    // isFirstCard={index === counter - 1}
                    sparklesOn={true}
                    enableFlip={true}
                    priceThreshold={PRICE_HIGHLIGHT_THRESHOLD}
                    maxWidth={290}
                  />
                </Animated.View>
              </GestureDetector>
            </View>

            {/* <Swiper 
              cards={cardsWithKeys}
              keyExtractor={(item) => item.swiperKey}
              cardIndex={0}
              renderCard={(item, index) => (
                <CardDisplay
                  card={item}
                  index={index}
                  isFirstCard={index === counter - 1}
                  priceThreshold={PRICE_HIGHLIGHT_THRESHOLD}
                  sparklesOn={true}
                  enableFlip={true}
                />
              )}
              stackSize={1}
              stackSeparation={2}
              animateCardOpacity={false}
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
            /> */}

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
            handlePress={() => router.replace(`/home`)}
          />
        </View>
        
      )}
      
    </View>
  )
};

export default CardSwiper;