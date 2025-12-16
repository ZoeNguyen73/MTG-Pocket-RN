import { View, Image, StyleSheet, Platform, Text } from "react-native";

const SmallCardDisplay = ({ 
  card, 
  maxWidth, 
  shadow = false,
  isGreyscale = false,
  label = null,
  size = "small", 
}) => {
  const frontCardFace = card.card_faces[0];

  const imgUri = "image_jpg_normal";

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
            style={[styles.cardContainer, { 
              width: "100%",  
              borderRadius: maxWidth ? maxWidth * 0.07 : 15,
              overflow: "visible",
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
                    width: 2,
                    height: 20,
                  },
                  shadowOpacity: 0.5,
                  shadowRadius: 10,
                  elevation: 10,
                }}
              
              />
            )}

            { label !== null && label !== "" && (
              <View
                style={{
                  position: "absolute",
                  top: 10,
                  left: 10,
                  backgroundColor: "rgba(0, 0, 0, 0.8)",
                  paddingTop: 2,
                  paddingBottom: 2,
                  paddingLeft: 6,
                  paddingRight: 6,
                  borderRadius: 999,
                  zIndex: 5,
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Text
                  className="text-xs font-sans text-dark-text"
                >
                  {label}
                </Text>
              </View>
            )}

            <Image 
              source={{ uri: frontCardFace[imgUri] }}
              resizeMode="contain"
              style={{
                width: shadow ? "98%" : "100%",
                height: shadow ? "98%" : "100%",
                borderRadius: maxWidth ? maxWidth * 0.07 : 16,
                filter: isGreyscale ? "grayscale(100%)" : null,
              }}
            />
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
          { label !== null && label !== "" && (
            <View
              style={{
                position: "absolute",
                top: 10,
                left: 10,
                backgroundColor: "rgba(0, 0, 0, 0.8)",
                paddingTop: 2,
                paddingBottom: 2,
                paddingLeft: 6,
                paddingRight: 6,
                borderRadius: 999,
                zIndex: 5,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Text
                className="text-xs font-sans text-dark-text"
              >
                {label}
              </Text>
            </View>
          )}
          
          <Image 
            source={{ uri: frontCardFace[imgUri] }}
            resizeMode="contain"
            style={{
              width: shadow ? "98%" : "100%",
              height: shadow ? "98%" : "100%",
              borderRadius: maxWidth * 0.07,
              filter: isGreyscale ? "grayscale(100%)" : null,
            }}
          />
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
});

export default SmallCardDisplay;