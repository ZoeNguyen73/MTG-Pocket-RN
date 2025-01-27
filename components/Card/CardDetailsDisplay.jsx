import { View, Image, StyleSheet, Platform, TouchableOpacity, Animated } from "react-native";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";
import FontAwesome6 from "@expo/vector-icons/FontAwesome6";

import Sparkles from "../Sparkles";

const START_DEFAULT = { x: 0.5, y: 0 };
const END_DEFAULT = { x: 0.5, y: 1 };

const GRADIENT_LOCATIONS = [0, 0.2, 0.4, 0.6, 0.8, 1, 1];

const GRADIENT_COLORS = [
  "rgba(255, 154, 0, 0.2) 0%",
  "rgba(208, 222, 33, 0.3) 20%",
  "rgba(79, 220, 74, 0.5) 40%",
  "rgba(47, 201, 226, 0.3) 60%",
  "rgba(95, 21, 242, 0.5) 80%",
  "rgba(186, 12, 248, 0.5) 100%",
  "rgba(251, 7, 217, 0.5) 100%",
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
  currentIndex = null, 
  priceThreshold = null,
  sparklesOn = false,
  enableFlip = false, 
}) => {
  const frontCardFace = card.card_faces[0];
  const backCardFace = card.card_faces.length > 1 ? card.card_faces[1] : card.card_faces[0];
  const { finish } = card;
  const isFirstCard = index !== null && currentIndex !== null && index === currentIndex;

  const [isFlipped, setIsFlipped] = useState(false);
  const flipAnimation = useRef(new Animated.Value(0)).current // animated value for flip animation

  const handleFlip = () => {
    if(isFlipped) {
      // animate back to the front side
      Animated.spring(flipAnimation, {
        toValue: 0,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    } else {
      // animate to the back side
      Animated.spring(flipAnimation, {
        toValue: 180,
        friction: 8,
        tension: 10,
        useNativeDriver: true,
      }).start();
    }
    setIsFlipped(!isFlipped);
  };

  // front card rotation
  const frontInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["0deg", "180deg"],
  });

  const flipToFrontStyle = {
    transform: [{rotateY: frontInterpolate}]
  };

  // back card rotation
  const backInterpolate = flipAnimation.interpolate({
    inputRange: [0, 180],
    outputRange: ["180deg", "360deg"],
  });

  const flipToBackStyle = {
    transform: [{rotateY: backInterpolate}]
  };
  
  const [gradientOptions, setGradientOptions] = useState({
    colors: GRADIENT_COLORS,
    locations: GRADIENT_LOCATIONS,
    start: START_DEFAULT,
    end: END_DEFAULT
  });

  const gradientOptionsRef = useRef(gradientOptions);
  gradientOptionsRef.current = gradientOptions;

  console.log("card: " + frontCardFace.name + ", finish: " + finish);

  const imgUri = "image_jpg_normal";

  useEffect(() => {
    console.log("useEffect triggered in cardDisplay");
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

    if ((finish === "foil" || finish === "etched") 
      && size !== "small"
      && ( index === null || isFirstCard )) {
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
      { Platform.OS !== "web" && (
        <View
          style={[
            styles.shadowContainer,
            {
              width: maxWidth ? maxWidth : "100%",
              aspectRatio: 488 / 680,
              borderRadius: maxWidth ? maxWidth * 0.07 : 15,
            },
          ]}
        >

          <View 
            style={{ 
              width: "100%", 
              height: "100%", 
              borderRadius: maxWidth ? maxWidth * 0.07 : 15,
              overflow: "visible",
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
            
            { (card.card_faces.length === 1 
              || !enableFlip
              || (enableFlip && index !== null && !isFirstCard)
            ) && (
              <Image 
                source={{ uri: frontCardFace[imgUri] }}
                resizeMode="contain"
                style={{
                  width: shadow ? "98%" : "100%",
                  height: shadow ? "98%" : "100%",
                  borderRadius: maxWidth ? maxWidth * 0.07 : 15,
                }}
              />
            )}
            
            {/* front */}
            { card.card_faces.length > 1 
              && enableFlip 
              && ( index === null || isFirstCard )
              && (
              <Animated.View
                style={[
                  { 
                    position: "absolute",
                    width: "100%", 
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    // zIndex: 1,  
                    backfaceVisibility: "hidden" 
                  },
                  flipToFrontStyle
                ]}
              >
                <Image
                  source={{ uri: frontCardFace[imgUri] }}
                  resizeMode="contain"
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
              && ( index === null || isFirstCard )
              && (
              <Animated.View
                style={[
                  { 
                    position: "absolute",
                    width: "100%", 
                    height: "100%",
                    justifyContent: "center",
                    alignItems: "center",
                    backfaceVisibility: "hidden" 
                  }, 
                  flipToBackStyle
                ]}
              >
                <Image
                  source={{ uri: backCardFace[imgUri] }}
                  resizeMode="contain"
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
              && ( index === null || isFirstCard )
              && (
              <TouchableOpacity
                onPress={() => {
                  handleFlip();
                }}
                style={styles.flipButton}
              >
                <FontAwesome6 name="rotate" size={24} color="black" />
              </TouchableOpacity>
            )}

            { (finish === "foil" || finish === "etched") 
              && size !== "small"
              && ( index === null || isFirstCard ) 
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

            { (priceThreshold !== null && card.final_price >= priceThreshold)
              && ( index === null || isFirstCard ) 
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
      { Platform.OS === "web" && (
        <View
          style={[
            styles.shadowContainer,
            {
              width: size && size === "small" ? maxWidth : "100%",
              aspectRatio: 488 / 680,
              borderRadius: maxWidth * 0.07,
            },
          ]}
        > 
          <Image 
            source={{ uri: frontCardFace[imgUri] }}
            resizeMode="contain"
            style={{
              width: shadow ? "98%" : "100%",
              height: shadow ? "98%" : "100%",
              borderRadius: maxWidth * 0.07,
            }}
          />

          {/* Linear gradient overlay for foil or etched finish*/}
          { (finish === "foil" || finish === "etched") && size !== "small" && (
            <>
              <LinearGradient 
                colors={gradientOptions.colors}
                locations={gradientOptions.locations}
                start={gradientOptions.start}
                end={gradientOptions.end}
                style={styles.gradientOverlay}
              />
            </>
          
          )}
        </View>
        
      )}
    </>
    
  );
};

const styles = StyleSheet.create({
  shadowContainer: {
    alignSelf: "center",
    overflow: "visible", // Allows shadow to render outside bounds
    position: "relative",
  },
  cardContainer: {
    position: "relative",
  },
  image: {
    width: "100%",
    height: "100%",
    borderRadius: 15,
  },
  gradientOverlay: {
    position: "absolute",
    height: "100%",
    width: "100%",
    opacity: 0.4,
    top: "0%",
    left: "0%",
    right: 0,
    bottom: 0,
    borderRadius: 15,
  },
  flipButton: {
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
    zIndex: 500,
  },
});

export default CardDisplay;