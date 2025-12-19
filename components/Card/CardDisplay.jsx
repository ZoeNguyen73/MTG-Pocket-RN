import { View, Platform, TouchableOpacity } from "react-native";
import { Image } from "expo-image";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from "react-native-reanimated";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Sparkles from "../Sparkles";

import useDeviceLayout from "../../hooks/useDeviceLayout";

const START_DEFAULT = { x: 0.5, y: 0 };
const END_DEFAULT = { x: 0.5, y: 1 };

const GRADIENT_LOCATIONS = [0, 0.2, 0.4, 0.6, 0.8, 1, 1];

const GRADIENT_COLORS = [
  // "rgba(255, 0, 0, 0.1) 0%",
  "rgba(255, 154, 0, 0.2) 0%",
  "rgba(208, 222, 33, 0.3) 20%",
  "rgba(79, 220, 74, 0.5) 40%",
  // "rgba(63, 218, 216, 0.5) 45%",
  "rgba(47, 201, 226, 0.3) 60%",
  // "rgba(28, 127, 238, 0.2) 63%",
  "rgba(95, 21, 242, 0.5) 80%",
  "rgba(186, 12, 248, 0.5) 100%",
  "rgba(251, 7, 217, 0.5) 100%",
  // "rgba(255, 0, 0, 0.1) 100%"
];

const MOVEMENT = GRADIENT_LOCATIONS[1] / 20;
const INTERVAL = 15;
const GRADIENT_DURATION = 5000;

const CardDisplay = ({ 
  card, 
  size, 
  maxWidth, 
  shadow = false, 
  index = null, 
  isFirstCard = false, 
  priceThreshold = null,
  sparklesOn = false,
  enableFlip = false, 
}) => {
  const frontCardFace = card.card_faces[0];
  const backCardFace = card.card_faces.length > 1 ? card.card_faces[1] : card.card_faces[0];
  const { finish } = card;
  const shouldHighlight = index === null || isFirstCard;
  const { isDesktopWeb } = useDeviceLayout();

  const isFlipped = useSharedValue(false);
  const duration = 500;

  const handleFlip = () => {
    // console.log("handleFlip triggered");
    // isFlipped.value = withTiming(isFlipped.value === 0 ? 1 : 0, { duration });
    isFlipped.value = !isFlipped.value;
  };

  const frontCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [0, 180]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration, easing: Easing.inOut(Easing.ease) });

    return {
      transform: [{ rotateY: rotateValue }],
    };
  });

  const backCardAnimatedStyle = useAnimatedStyle(() => {
    const spinValue = interpolate(Number(isFlipped.value), [0, 1], [180, 360]);
    const rotateValue = withTiming(`${spinValue}deg`, { duration, duration, easing: Easing.inOut(Easing.ease) });

    return {
      transform: [{ rotateY: rotateValue }],
    };
  });

  const [gradientOptions, setGradientOptions] = useState({
    colors: GRADIENT_COLORS,
    locations: GRADIENT_LOCATIONS,
    start: START_DEFAULT,
    end: END_DEFAULT
  });

  const gradientOptionsRef = useRef(gradientOptions);
  gradientOptionsRef.current = gradientOptions;

  const imgUri = "image_jpg_normal";

  useEffect(() => {
    const gradientAnimation = () => {
      if (gradientOptionsRef.current.locations[1] - MOVEMENT <= 0) {
        // Shift colours and reset locations
        let gradientColors = [...gradientOptionsRef.current.colors];
        gradientColors.shift();
        gradientColors.push(gradientColors[1]);

        setGradientOptions({
          colors: gradientColors,
          locations: GRADIENT_LOCATIONS,
          start: START_DEFAULT,
          end: END_DEFAULT
        });
      } else {
        let updatedLocations = gradientOptionsRef.current.locations.map((item, index) => {
          if (index === gradientOptionsRef.current.locations.length - 1) {
            return 1;
          }

          return parseFloat(Math.max(0, item - MOVEMENT).toFixed(2));
        });

        setGradientOptions({
          colors: [...gradientOptionsRef.current.colors],
          locations: updatedLocations,
          start: START_DEFAULT,
          end: END_DEFAULT
        });
      }
    }

    /* only the 1st card in the view can have foil animation - preventing the underneath cards from having animation */
    if ((finish === "foil" || finish === "etched") 
      && size !== "small"
      && shouldHighlight) {
      const intervalRef = setInterval(gradientAnimation, INTERVAL);

      // Clear interval after 5000ms
      const timeoutRef = setTimeout(() => clearInterval(intervalRef), GRADIENT_DURATION);

      // Cleanup function
      return () => {
        clearInterval(intervalRef);
        clearTimeout(timeoutRef);
      };
    }
    
  }, []);

  return (
    <>
      { !isDesktopWeb && (
        <View
          key={card.swiperKey ?? card._id}
          style={[
            {
              width: maxWidth ? maxWidth : "100%",
              aspectRatio: 488 / 680,
              borderRadius: maxWidth ? maxWidth * 0.07 : 15,
              alignSelf: "center",
              overflow: "visible", // Allows shadow to render outside bounds
              position: "relative",
            },
          ]}
        >

          <View 
            style={{ 
              width: "100%",  
              borderRadius: maxWidth ? maxWidth * 0.07 : 15,
              overflow: "visible",
              position: "relative",
            }}
          >
            { shadow && (
              <View 
                style={{
                  width: "100%",
                  height: "100%",
                  borderRadius: maxWidth ? maxWidth * 0.07 : 15,
                  backgroundColor: "rgba(0, 0, 0, 0.1)",
                  zIndex: -1,
                  position: "absolute",
                  shadowColor: "#000",
                  shadowOffset: {
                    width: 10,
                    height: 20,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              
              />
            )}
            
            {/* only the 1st card in the view can be flipped - preventing the underneath cards from being flipped */}
            { (card.card_faces.length === 1 
              || !enableFlip
              || (enableFlip && !shouldHighlight)
            ) && (
              <Image
                key={card.swiperKey ?? card._id} 
                source={{ uri: frontCardFace[imgUri] }}
                contentFit="contain"
                cachePolicy="memory"
                style={{
                  width: maxWidth,
                  aspectRatio: 488 / 680,
                  borderRadius: maxWidth ? maxWidth * 0.07 : 15,
                }}
              />
            )}
            
            {/* front */}
            { card.card_faces.length > 1 
              && enableFlip 
              && shouldHighlight
              && (
              <Animated.View 
                style={[
                  { 
                    // position: "absolute",
                    width: "100%", 
                    height: "100%",
                    zIndex: 1,  
                    backfaceVisibility: "hidden" 
                  }, 
                  frontCardAnimatedStyle
                ]}
              >
                <Image
                  key={card.swiperKey ?? card._id}
                  source={{ uri: frontCardFace[imgUri] }}
                  contentFit="contain"
                  cachePolicy="memory"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: maxWidth ? maxWidth * 0.07 : 15,
                  }}
                />
              </Animated.View>
            )}

            {/* back */}
            { card.card_faces.length > 1 
              && enableFlip 
              && shouldHighlight
              && (
              <Animated.View 
                style={[
                  { 
                    position: "absolute",
                    width: "100%", 
                    height: "100%",
                    zIndex: 2,
                    backfaceVisibility: "hidden" 
                  }, 
                  backCardAnimatedStyle
                ]}
              >
                <Image
                  key={card.swiperKey ?? card._id}
                  source={{ uri: backCardFace[imgUri] }}
                  contentFit="contain"
                  cachePolicy="memory"
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: maxWidth ? maxWidth * 0.07 : 15,
                  }}
                />
              </Animated.View>
            )}

            { card.card_faces.length > 1 
              && enableFlip 
              && shouldHighlight
              && (
              <TouchableOpacity
                onPress={() => {
                  // console.log("button pressed");
                  handleFlip();
                }}
                style={{
                  position: "absolute",
                  opacity: 0.8,
                  height: 50,
                  width: 50,
                  right: 20,
                  bottom: 50,
                  borderRadius: 25,
                  backgroundColor: "white",
                  justifyContent: "center",
                  alignItems: "center",
                  zIndex: 120,
                }}
              >
                <FontAwesome6 name="rotate" size={24} color="black" />
              </TouchableOpacity>
            )}

            { (finish === "foil" || finish === "etched") 
              && size !== "small"
              && shouldHighlight
              && (
              <>
                <LinearGradient 
                  colors={gradientOptions.colors}
                  locations={gradientOptions.locations}
                  start={gradientOptions.start}
                  end={gradientOptions.end}
                  style={{
                    position: "absolute",
                    height: "100%",
                    width: "100%",
                    opacity: 0.4,
                    top: "0%",
                    left: "0%",
                    right: 0,
                    bottom: 0,
                    borderRadius: maxWidth ? maxWidth * 0.07 : 15,
                  }}
                />
              </>
            
            )}
            {/* only the 1st card in the view can have sparkles animation - preventing the underneath cards from having animation */}
            { (priceThreshold !== null && card.final_price >= priceThreshold)
              && shouldHighlight
              && ( 
                <Sparkles /> 
              )
            }
            
            { (priceThreshold === null && sparklesOn == true) 
              && ( 
                <Sparkles /> 
              )
            }
          </View>

        </View>
      )}

      { isDesktopWeb && (
      <View
        style={[
          {
            width: size && size === "small" ? maxWidth : "100%",
            aspectRatio: 488 / 680,
            borderRadius: maxWidth ? maxWidth * 0.07 : 15,
          },
        ]}
      > 
        <Image
          key={card.swiperKey ?? card._id} 
          source={{ uri: frontCardFace[imgUri] }}
          contentFit="contain"
          cachePolicy="memory"
          style={{
            width: shadow ? "98%" : "100%",
            height: shadow ? "98%" : "100%",
            borderRadius: maxWidth ? maxWidth * 0.07 : 15,
          }}
        />

        {/* Linear gradient overlay for foil or etched finish, no animation*/}
        { (finish === "foil" || 
          finish === "etched") && 
          size !== "small" && (
          <>
            <LinearGradient 
              colors={GRADIENT_COLORS}
              locations={GRADIENT_LOCATIONS}
              start={START_DEFAULT}
              end={END_DEFAULT}
              style={{
                position: "absolute",
                height: "100%",
                width: "100%",
                opacity: 0.4,
                top: "0%",
                left: "0%",
                right: 0,
                bottom: 0,
                borderRadius: maxWidth ? maxWidth * 0.07 : 15,
              }}
            />
          </>
        
        )}
      </View>
        
      )}
    </>
    
  );
};

export default CardDisplay;