import { View, Image, useWindowDimensions } from "react-native";
import React from "react";

import { useThemeContext } from "../../context/ThemeProvider";

import tailwindConfig from "../../tailwind.config";

import { avatars } from "../../constants";

const Avatar = ({ avatarName, size, withoutBorder }) => {
  const { width } = useWindowDimensions();
  let dimension = width >= 1024 ? 100 : 80;
  let borderRadius = width >=1024 ? 50 : 40;

  if (size && size === "extra small") {
    dimension = width >= 1024 ? 54 : 44; // 2.75rem 44px
    borderRadius = width >= 1024 ? 27 : 22;
  } else if (size && size === "small") {
    dimension = width >= 1024 ? 80 : 60; // 4rem 64px
    borderRadius = width >= 1024 ? 40 : 30;
  } else if (size && size === "large") {
    dimension = width >= 1024 ? 140 : 112; // 7rem 112px
    borderRadius = width >= 1024 ? 70 : 56;
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
        className="w-[100%] h-[100%]"
        resizeMode="contain"
      />
    </View>
  )
};

export default Avatar;