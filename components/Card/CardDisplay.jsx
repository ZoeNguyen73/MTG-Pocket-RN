import { View, Image, StyleSheet } from "react-native";
import { useState } from "react";
import { LinearGradient } from "expo-linear-gradient";

import Sparkles from "../Sparkles";

const CardDisplay = ({ card, size }) => {
  const frontCardFace = card.card_faces[0];
  const { finish } = card;
  const [ isFrontFacing, setIsFrontFacing ] = useState(true);

  let imgUri = "image_jpg_normal";
  if (size && size === "small") {
    imgUri = "image_small";
  };

  return (
    <View>
      { isFrontFacing && (
       <View style={styles.container}>
        <Image 
          source={{ uri: frontCardFace[imgUri] }}
          resizeMode="contain"
          style={styles.image}
        />

        {/* Linear gradient overlay for foil or etched finish*/}
        { (finish === "foil" || finish === "etched") && (
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
  );
};

const styles = StyleSheet.create({
  container: {
    aspectRatio: 488/680,
    width: "100%",
    borderRadius: 15,
    overflow: "hidden",
    alignSelf: "center", // Center horizontally
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