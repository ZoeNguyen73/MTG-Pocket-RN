import { View, Image, StyleSheet, Platform } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import Sparkles from "../Sparkles";

const CardDisplay = ({ card, size, maxWidth, shadow }) => {
  const frontCardFace = card.card_faces[0];
  const { finish } = card;
  const [ isFrontFacing, setIsFrontFacing ] = useState(true);

  console.log("card: " + frontCardFace.name + ", finish: " + finish);

  let imgUri = "image_jpg_normal";

  return (
    <>
      { Platform.OS !== "web" && (
        <View
          style={[
            styles.shadowContainer,
            {
              width: size && size === "small" ? maxWidth : "100%",
              aspectRatio: 488 / 680,
              borderRadius: size && size === "small" ? 4 : 15,
            },
          ]}
        >
    
          { isFrontFacing && (
            <View 
              style={[styles.cardContainer, { 
                width: "100%",  
                borderRadius: size && size === "small" ? 4 : 15,
                overflow: "visible",
              }]}
            >
              { shadow && (
                <View 
                  style={{
                    width: "100%",
                    height: "100%",
                    borderRadius: size && size === "small" ? 4 : 15,
                    top: 2,
                    left: 2,
                    backgroundColor: "rgba(0, 0, 0, 0.2)",
                    zIndex: -1,
                    position: "absolute"
                  }}
                
                />
              )}
              <Image 
                source={{ uri: frontCardFace[imgUri] }}
                resizeMode="contain"
                style={{
                  width: shadow ? "98%" : "100%",
                  height: shadow ? "98%" : "100%",
                  borderRadius: size && size === "small" ? 5 : 15,
                }}
              />
    
              {/* Linear gradient overlay for foil or etched finish*/}
              { (finish === "foil" || finish === "etched") && size !== "small" && (
                <>
                  <LinearGradient 
                    colors={[
                      "rgba(255, 0, 0, 0) 0%",
                      "rgba(255, 154, 0, 0.6) 10%",
                      "rgba(208, 222, 33, 0.8) 20%",
                      "rgba(79, 220, 74, 1) 30%",
                      "rgba(63, 218, 216, 0.6) 45%",
                      "rgba(47, 201, 226, 0.3) 52%",
                      "rgba(28, 127, 238, 0.2) 63%",
                      "rgba(95, 21, 242, 0.6) 79%",
                      "rgba(186, 12, 248, 0.4) 88%",
                      "rgba(251, 7, 217, 0.4) 89%",
                      "rgba(255, 0, 0, 0.1) 100%"
                    ]}
                    locations={[0, 0.1, 0.2, 0.3, 0.45, 0.62, 0.63, 0.79, 0.88, 0.89, 1]}
                    style={styles.gradientOverlay}
                  />
                  {/* Glittering Animation */}
                  <Sparkles />
                </>
              
              )}
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
              borderRadius: maxWidth * 0.05,
            },
          ]}
        > 
          <Image 
            source={{ uri: frontCardFace[imgUri] }}
            resizeMode="contain"
            style={{
              width: shadow ? "98%" : "100%",
              height: shadow ? "98%" : "100%",
              borderRadius: maxWidth * 0.05,
            }}
          />

          {/* Linear gradient overlay for foil or etched finish*/}
          { (finish === "foil" || finish === "etched") && size !== "small" && (
            <>
              <LinearGradient 
                colors={[
                  "rgba(255, 0, 0, 0) 0%",
                  "rgba(255, 154, 0, 0.6) 10%",
                  "rgba(208, 222, 33, 0.8) 20%",
                  "rgba(79, 220, 74, 1) 30%",
                  "rgba(63, 218, 216, 0.6) 45%",
                  "rgba(47, 201, 226, 0.3) 52%",
                  "rgba(28, 127, 238, 0.2) 63%",
                  "rgba(95, 21, 242, 0.6) 79%",
                  "rgba(186, 12, 248, 0.4) 88%",
                  "rgba(251, 7, 217, 0.4) 89%",
                  "rgba(255, 0, 0, 0.1) 100%"
                ]}
                locations={[0, 0.1, 0.2, 0.3, 0.45, 0.62, 0.63, 0.79, 0.88, 0.89, 1]}
                style={styles.gradientOverlay}
              />
              {/* Glittering Animation */}
              <Sparkles />
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
    height: "90%",
    width: "100%",
    opacity: 0.4,
    top: "5%",
    left: "0%",
    right: 0,
    bottom: 0,
  },
});

export default CardDisplay;