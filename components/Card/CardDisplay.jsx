import { View, Image, StyleSheet, Platform } from "react-native";
import { useState, useEffect, useRef } from "react";
import { LinearGradient } from "expo-linear-gradient";

import Sparkles from "../Sparkles";

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
const GRADIENT_DURATION = 10000;

const CardDisplay = ({ 
  card, 
  size, 
  maxWidth, 
  shadow = false, 
  index = null, 
  currentIndex = null, 
  priceThreshold = null,
  sparklesOn = false, 
}) => {
  const frontCardFace = card.card_faces[0];
  const { finish } = card;
  const [ isFrontFacing, setIsFrontFacing ] = useState(true);

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
      && ( index === null || (index !== null && currentIndex !== null && index === currentIndex))) {
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
    
          { isFrontFacing && (
            <View 
              style={[styles.cardContainer, { 
                width: "100%",  
                borderRadius: maxWidth ? maxWidth * 0.07 : 15,
                overflow: "hidden",
              }]}
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
              
              <Image 
                source={{ uri: frontCardFace[imgUri] }}
                resizeMode="contain"
                style={{
                  width: shadow ? "98%" : "100%",
                  height: shadow ? "98%" : "100%",
                  borderRadius: maxWidth ? maxWidth * 0.07 : 16,
                }}
              />
    
              {/* Linear gradient overlay for foil or etched finish*/}
              { (finish === "foil" || finish === "etched") 
                && size !== "small"
                && ( index === null || (index !== null && currentIndex !== null && index === currentIndex)) 
                && (
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

              { (priceThreshold !== null && card.final_price >= priceThreshold)
                && ( index === null || (index !== null && currentIndex !== null && index === currentIndex)) 
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
          )}

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
    overflow: "hidden",
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
});

export default CardDisplay;