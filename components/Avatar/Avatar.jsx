import { View, Image, useWindowDimensions, Platform } from "react-native";
import React from "react";

import { useThemeContext } from "../../context/ThemeProvider";

import tailwindConfig from "../../tailwind.config";

import { avatars } from "../../constants";

const Avatar = ({ avatarName, size, withoutBorder, shadow = false }) => {
  const { width } = useWindowDimensions();
  const isWeb = Platform.OS === "web";

  let dimension = isWeb ? 100 : 80;
  let borderRadius = isWeb ? 50 : 40;

  if (size && size === "extra small") {
    dimension = isWeb ? 36 : 50; // 2.75rem 44px
    borderRadius = isWeb ? 18 : 25;
  } else if (size && size === "small") {
    dimension = isWeb ? 80 : 60; // 4rem 64px
    borderRadius = isWeb ? 40 : 30;
  } else if (size && size === "large") {
    dimension = isWeb ? 140 : 112; // 7rem 112px
    borderRadius = isWeb ? 70 : 56;
  }

  const { theme } = useThemeContext();
  const borderColor = theme === "dark"
    ? tailwindConfig.theme.extend.colors.dark.yellow
    : tailwindConfig.theme.extend.colors.light.yellow
  
  const borderWidth = withoutBorder ? 0 : 5;

  return (
    <View 
      className="justify-center items-center"
      style={{
        width: dimension,
        height: dimension
      }}
    >
      <Image 
        source={avatars[avatarName]}
        alt={avatarName}
        borderWidth={borderWidth}
        borderRadius={borderRadius}
        borderColor={borderColor}
        resizeMode="contain"
        style={{
          width: dimension,
          height: dimension,
          shadowColor: shadow ? "#000" : "transparent",
          shadowOffset: { width: 0, height: 5 },
          shadowOpacity: 1,
          shadowRadius: 2,
          elevation: 15,
        }}
      />
    </View>
  )
};

export default Avatar;