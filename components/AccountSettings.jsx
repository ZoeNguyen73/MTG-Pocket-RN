import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

import { useAuthContext } from "../context/AuthProvider";
import { useThemeContext } from "../context/ThemeProvider";

import tailwindConfig from "../tailwind.config";

import Avatar from "./Avatar/Avatar";

const AccountSettings = () => {
  const { auth } = useAuthContext();
  const { theme } = useThemeContext();
  const iconColor = theme === "dark"
    ? tailwindConfig.theme.extend.colors.dark.text
    : tailwindConfig.theme.extend.colors.light.text;
  const lightYellow = tailwindConfig.theme.extend.colors.light.yellow;

  return (
    <View 
      style={{
        backgroundColor: "#b4befe50",
        borderRadius: 50,
        justifyContent: "center",
        margin: 5,
        padding: 10,
      }}
    >
      <View className="flex-row gap-2.5 items-center ml-1">
        <Avatar 
          avatarName={auth?.avatar || "Planeswalker_1"}
          withoutBorder={true}
          size="small"
        />

        <View className="flex-column grow">
          <View className="flex-row gap-1 items-start">
            <Text className="font-sans text-dark-text tracking-wide">
              Greetings 👋
            </Text>
          </View>
          
          { auth?.username && (
            <Text className="font-serif-bold text-2xl text-light-sapphire tracking-wider">
              {auth?.username}
            </Text>
          )}
          
          { !auth?.username && (
            <Text className="font-serif-bold text-xl text-dark-text tracking-wider">
              Unnamed Planeswalker
            </Text>
          )}
        </View>

        { auth?.username && (
          <TouchableOpacity
            className="justify-center items-center w-[30px] h-[30px]"
            style={{
              borderRadius: 15,
              backgroundColor: "#FFFFFF80",
              marginRight: 5,
            }}
            onPress={() => router.push("/log-in")}
          >
            <Feather name="log-out" size={20} color={iconColor} />
          </TouchableOpacity>
        )}

        { !auth?.username && (
          <TouchableOpacity
            className="justify-center items-center w-[30px] h-[30px]"
            style={{
              borderRadius: 15,
              backgroundColor: lightYellow,
              marginRight: 5,
            }}
            onPress={() => router.push("/log-in")}
          >
            <Feather name="log-in" size={20} color={iconColor} />
          </TouchableOpacity>
        )}
        
      </View>
    </View>
  )

};

export default AccountSettings;