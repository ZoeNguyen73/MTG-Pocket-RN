import { View, Text } from "react-native";

const FinishChip = ({ text, size="sm", style="dark" }) => {
  const containerStyle = size === "xs"
    ? "rounded-full px-4"
    : "rounded-lg px-4";
  const textStyle = size === "xs"
    ? "text-sm font-sans-semibold"
    : "text-base font-sans-semibold";
  let backgroundColor = "bg-light-maroon/80";
  let textColor = style === "dark" ? "text-dark-rosewater" : "text-dark-text";
  
  const formattedTexts = {
    "nonfoil": "Non Foil",
    "foil": "Foil",
    "etched": "Etched Foil",
    "textured": "Textured Foil",
    "halofoil": "Halo Foil",
    "surgefoil": "Surge Foil",
    "fracturefoil": "Fracture Foil",
    "galaxyfoil": "Galaxy Foil",
    "raisedfoil": "Raised Foil",
    "neonink": "Neon Ink",
    "cosmicfoil": "Cosmic Foil",
  };

  if (text === "nonfoil") {
    backgroundColor = "bg-dark-secondary/20";
    textColor = style === "dark" ? "text-dark-text" : "text-light-text"
  } else if (text === "foil") {
    backgroundColor = "bg-dark-teal/50";
    textColor = style === "dark" ? "text-dark-text" : "text-light-text";
  }

  return (
    <View className={`${containerStyle} ${backgroundColor}`}>
      <Text className={`text-center tracking-wide ${textColor} ${textStyle}`}>
        {formattedTexts[text] ? formattedTexts[text] : "Foil"}
      </Text>
    </View>
  )
};

export default FinishChip;