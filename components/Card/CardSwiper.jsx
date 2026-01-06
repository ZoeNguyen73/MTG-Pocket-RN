import { View, Text, Dimensions } from "react-native";
import { useState, useRef, useEffect } from "react";
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
import { Gesture, GestureDetector } from "react-native-gesture-handler";

import CardDisplay from "./CardDisplay";
import Button from "../CustomButton/CustomButton";
import FinishChip from "../FinishChip";

import tailwindConfig from "../../tailwind.config";
import { soundManager } from "../../utils/SoundManager";

import useDeviceLayout from "../../hooks/useDeviceLayout";

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

const Summary = ({ totalValue, topCard, cardWidth, cardHeight, packPrice }) => {
  const [animationKey, setAnimationKey] = useState(0);
  const profit = parseFloat(totalValue - packPrice).toFixed(2);

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
      <View className="position-relative w-9/12" style={{ height: cardHeight * 1.1 }}>
        <View 
          className="w-full h-full rounded-3xl py-5"
          style={{
            backgroundColor: "rgba(255, 255, 255, 0.7)",
            borderColor: "rgba(0, 0, 0, 0.1)",
            borderWidth: 7,
          }}
        >
          <View className="flex-column justify-center items-center gap-2">
            
            <View className="flex-column justify-center">
              <Text className="text-center font-sans-semibold tracking-wide text-light-text">
                Total Pack Value:
              </Text>
              <Text className="text-center font-sans-bold text-3xl tracking-wider text-light-dark-yellow">
                {`USD ${totalValue}`}
              </Text>
            </View>

            <Text className={`text-sm text-center font-sans tracking-wide ${profit < 0 ? "text-light-red" : "text-light-green"}`}>
              {`${profit < 0 ? "Loss" : "Profit"}: ${profit < 0 ? "-" : ""}$${Math.abs(profit)} ${profit < 0 ? "🤡" : "🤑"}`}
            </Text>
            
          </View>

          <View className="flex-column justify-center items-center mt-3">
            <Text className="text-center font-sans-semibold tracking-wide text-light-text">
              Top card:
            </Text>
            <View style={{ maxWidth: "80%" }}>
              <View className="mb-1 w-fit">
                <FinishChip 
                  text={topCard.special_foil_finishes.length ? topCard.special_foil_finishes[0] : topCard.finish}
                  size="xs"
                  style="light"
                />
              </View>
              
              <View className="position-relative">
                <CardDisplay 
                  card={topCard}
                  maxWidth={cardWidth * 0.6}
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

const CardSwiper = ({ cards, setCode, packType, packPrice }) => {
  const firstCardPrice = cards[0].final_price || "0" ;
  const [ counter, setCounter ] = useState(1);
  const [ totalValue, setTotalValue ] = useState(parseFloat(firstCardPrice).toFixed(2));
  const [ swipedAllCards, setSwipedAllCards ] = useState(false);
  const [ topCard, setTopCard ] = useState(cards[0]);

  // index to track what the current card (on top) is
  const [currentIndex, setCurrentIndex] = useState(0);

  const currentCard = cards[currentIndex];
  const nextCard =
    currentIndex < cards.length - 1 ? cards[currentIndex + 1] : null;

  const sounds = {
    bloop: "paper-collect-3",
    highlight: "charming-twinkle",
    summary: "magical-twinkle",
  };

  const burstRef = useRef(null);

  const SCREEN_WIDTH = Dimensions.get("window").width;
  const SWIPE_DURATION = 220;
  const SWIPE_THRESHOLD = 50;

  // Reanimated shared values for the swipe animation
  const translateX = useSharedValue(0);
  const rotate = useSharedValue(0);

  // entry animation shared values
  const entryScale = useSharedValue(1);
  const entryOpacity = useSharedValue(1);
  const entryTranslateY = useSharedValue(0);

  const animatedCardStyle = useAnimatedStyle(() => ({
    opacity: entryOpacity.value,
    transform: [
      { translateX: translateX.value },
      { rotateZ: `${rotate.value}deg` },
      { scale: entryScale.value },
      { translateY: entryTranslateY.value },
    ],
  }));

  const { width } = useDeviceLayout();
  const cardMaxWidth = Math.min(width * 0.7, 290);
  const cardMaxHeight = (cardMaxWidth / 488) * 680

  useEffect(() => {
    // entry animation for the 1st card
    entryScale.value = 0.9;
    entryOpacity.value = 0.7;
    entryTranslateY.value = 10;
    entryScale.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.ease) });
    entryOpacity.value = withTiming(1, { duration: 180, easing: Easing.out(Easing.ease) });
    entryTranslateY.value = withTiming(0, { duration: 180, easing: Easing.out(Easing.ease) });
  }, []);

  const triggerPriceHighlightAnimation = async () => {
    if (burstRef.current) {
      burstRef.current.play(); // Play the Lottie animation
    }

    // play highlight sound
    soundManager.playSfx(sounds.highlight);
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

      // preconfigure the entry values of the next card
      entryScale.value = 0.9;
      entryOpacity.value = 0.9;
      entryTranslateY.value = 10;

      setCurrentIndex(nextIndex);

      // Reset card transform for the next card
      // timeout to give time for the new index to be updated
      setTimeout(() => {
        // reset position
        translateX.value = 0;
        rotate.value = 0;

        // entry animation for the next card
        entryScale.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) });
        entryOpacity.value = withTiming(1, { duration: 200, easing: Easing.out(Easing.ease) });
        entryTranslateY.value = withTiming(0, { duration: 200, easing: Easing.out(Easing.ease) });

      }, 0);
    }

    // play bloop sound
    soundManager.playSfx(sounds.bloop);
    
    setCounter(prev => prev + 1);
    
  };

  const openSummary = async () => {
    // play summary sound
    soundManager.playSfx(sounds.summary);
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
          <View
            className="mt-16" 
            style={{ 
              justifyContent: "center", 
              alignItems: "center", 
            }}
          >
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
          
          <View className="flex-1 mt-5" style={{ position: "relative", overflow: "visible", maxHeight: cardMaxHeight * 1.3}}>
            
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
                    <Text 
                      className={`text-left tracking-wide text-dark-text font-sans-semibold text-base`}
                    >
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

            <View 
              style={{
                flex: 1,
                alignItems: "center",
                justifyContent: "center",
                position: "relative",
              }} 
            >
              {/* next card (behind) */}
              {nextCard && (
                <View
                  pointerEvents="none" // no touch interaction
                  style={{
                    position: "absolute",
                    transform: [
                      { scale: 0.8 }, // slightly smaller
                      { translateY: 18 }, // a bit lower
                    ],
                    opacity: 0.5, // slightly dimmed
                    zIndex: 0,
                  }}
                >
                  <CardDisplay
                    card={nextCard}
                    maxWidth={cardMaxWidth} // same as 1st card
                    enableFlip={false}   // no flip on preview
                    sparklesOn={false}   // no sparkles on preview
                    priceThreshold={null}
                  />
                </View>
              )}

              {/* Front, swipeable card */}
              <GestureDetector gesture={panGesture}>
                <Animated.View 
                  style={[{ alignItems: "center" }, animatedCardStyle]} 
                  key={currentIndex}
                >
                  <CardDisplay 
                    card={currentCard}
                    // isFirstCard={index === counter - 1}
                    sparklesOn={true}
                    enableFlip={true}
                    priceThreshold={PRICE_HIGHLIGHT_THRESHOLD}
                    maxWidth={cardMaxWidth}
                  />
                </Animated.View>
              </GestureDetector>
            </View>

          </View>

          <View className="flex-row-reverse justify-start border border-transparent min-h-[10vh] my-1 px-12">
            
            <Text className="text-dark-text font-sans tracking-wide">
              {` / ${cards.length} cards`}
            </Text>
            <Text 
              className="text-light-yellow font-sans-semibold tracking-wide"
            >
              {counter}
            </Text>
            <View className="flex-1"/>
            {/* for trouble-shooting only */}
            <View>
              <FinishChip 
                text={currentCard.special_foil_finishes.length ? currentCard.special_foil_finishes[0] : currentCard.finish}
                size="xs"
              />
            </View>
            
          </View>
        </>
        
      )}
      
      { swipedAllCards && (
        <View className="h-[90vh] justify-center items-center flex-column">
          <Summary 
            totalValue={totalValue}
            topCard={topCard}
            cardWidth={cardMaxWidth}
            cardHeight={cardMaxHeight}
            packPrice={packPrice}
          />
          { packType && (
            <Button 
              title="Open Another Pack"
              containerStyles={"mt-5 mb-5"}
              handlePress={() => router.replace(`/pack/${packType}/${setCode}`)}
            />
          )}
          
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