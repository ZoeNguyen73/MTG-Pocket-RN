import { View, Text } from "react-native";
import useDeviceLayout from "../hooks/useDeviceLayout";

const FinishChip = ({ text, size="sm", style="dark" }) => {
  const { isDesktopWeb } = useDeviceLayout();

  const mobileContainerStyle = size === "xs"
    ? "rounded-full px-4"
    : "rounded-lg px-4";
  const containerStyle = size === "xs"
    ? "rounded-full px-2"
    : "rounded-full px-2 py-1";
  const mobileTextStyle = size === "xs"
    ? "text-sm font-sans-semibold"
    : "text-base font-sans-semibold";
  const textStyle = "text-xs font-sans-semibold";
  let backgroundColor = "bg-light-maroon/80";
  let textColor = style === "dark" ? "text-dark-rosewater" : "text-dark-text";
  
  const formattedTexts = {
    "nonfoil": "Non Foil",
    "foil": "Foil",
    "etched": "Etched",
    "textured": "Textured",
    "halofoil": "Halo",
    "surgefoil": "Surge",
    "fracturefoil": "Fracture",
    "galaxyfoil": "Galaxy",
    "raisedfoil": "Raised",
    "neonink": "Neon Ink",
    "cosmicfoil": "Cosmic",
  };

  if (text === "nonfoil") {
    backgroundColor = isDesktopWeb ? "bg-dark-secondary/90" : "bg-dark-secondary/20";
    textColor = style === "dark" ? "text-dark-text" : "text-light-text"
  } else if (text === "foil") {
    backgroundColor = "bg-dark-teal/50";
    textColor = style === "dark" ? "text-dark-text" : "text-light-text";
  }

  const finalText = isDesktopWeb
    ? formattedTexts[text]
    : formattedTexts[text] + " Foil";

  return (
    <View className={isDesktopWeb ? `${containerStyle} ${backgroundColor}` : `${mobileContainerStyle} ${backgroundColor}`}>
      <Text className={`text-center tracking-wide ${textColor} ${isDesktopWeb ? textStyle : mobileTextStyle}`}>
        {finalText ? finalText : "Foil"}
      </Text>
    </View>
  )
};

export default FinishChip;