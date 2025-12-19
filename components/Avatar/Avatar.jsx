import { View, Image } from "react-native";
import React from "react";

import { useThemeContext } from "../../context/ThemeProvider";
import useDeviceLayout from "../../hooks/useDeviceLayout";

import tailwindConfig from "../../tailwind.config";

import { avatars } from "../../constants";

const Avatar = ({ avatarName, size, withoutBorder, shadow = false }) => {
  const { isDesktopWeb } = useDeviceLayout();

  let dimension = isDesktopWeb ? 100 : 80;
  let borderRadius = isDesktopWeb ? 50 : 40;

  if (size && size === "extra small") {
    dimension = isDesktopWeb ? 36 : 50; // 2.75rem 44px
    borderRadius = isDesktopWeb ? 18 : 25;
  } else if (size && size === "small") {
    dimension = isDesktopWeb ? 80 : 60; // 4rem 64px
    borderRadius = isDesktopWeb ? 40 : 30;
  } else if (size && size === "large") {
    dimension = isDesktopWeb ? 140 : 112; // 7rem 112px
    borderRadius = isDesktopWeb ? 70 : 56;
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