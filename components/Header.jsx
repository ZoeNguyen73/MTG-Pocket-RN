import { View, Text } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";

import { useAuthContext } from "../context/AuthProvider";
import { useThemeContext } from "../context/ThemeProvider";

import tailwindConfig from "../tailwind.config";

import Avatar from "./Avatar/Avatar";

const Header = ({ containerStyles }) => {
  const { auth } = useAuthContext();
  const { theme } = useThemeContext();
  const iconColor = theme === "dark"
    ? tailwindConfig.theme.extend.colors.dark.text
    : tailwindConfig.theme.extend.colors.light.text;

  return (
    <View className={`flex-column ${containerStyles}`}>
      <View className="flex-row gap-2.5 items-center ml-1 mb-7">
        <Avatar 
          avatarName={auth?.avatar || "Planeswalker_1"}
          withoutBorder={true}
          size="small"
        />

        <View className="flex-column grow">
          <View className="flex-row gap-1 items-start">
            <Text className="font-sans text-light-text dark:text-dark-text tracking-wide">
              Welcome 👋
            </Text>
          </View>
          
          <Text className="font-sans-semibold text-xl text-light-text dark:text-dark-text tracking-wide">
            {auth?.username || "Planeswalker"}
          </Text>
        </View>

        <View
          className="justify-center items-center w-[50px] h-[50px]"
          style={{
            borderRadius: 25,
            backgroundColor: "#FFFFFF"
          }}
        >
          <Feather name="bell" size={30} color={iconColor} />
        </View>
      </View>
    </View>
  )

};

export default Header;