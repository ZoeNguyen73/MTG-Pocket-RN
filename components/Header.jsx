import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

import { useAuthContext } from "../context/AuthProvider";
import { useThemeContext } from "../context/ThemeProvider";

import tailwindConfig from "../tailwind.config";
import { getFonts } from "../utils/FontFamily";
import { logos } from "../constants";

import Avatar from "./Avatar/Avatar";

const Header = () => {
  const { auth } = useAuthContext();
  const { theme } = useThemeContext();
  const fonts = getFonts();
  const iconColor = theme === "dark"
    ? tailwindConfig.theme.extend.colors.dark.text
    : tailwindConfig.theme.extend.colors.light.text;
  const lightYellow = tailwindConfig.theme.extend.colors.light.yellow;

    return (
      <View>

        {/* non logged in user */}
        { !auth?.username && (
          <View
            style={{
              backgroundColor: "#00000050",
              borderRadius: 50,
              justifyContent: "center",
              marginLeft: 10,
              marginRight: 10,
              paddingTop: auth?.username ? 8 : 3,
              paddingBottom: auth?.username ? 8 : 3,
              paddingLeft: 10,
              paddingRight: 10,
            }}
          >
            <View className="flex-row flex-nowrap gap-2.5 items-center mx-4">
              <Text 
                className="flex-1 font-sans text-base text-dark-text tracking-wide" 
                style={{ fontFamily: fonts.sans }}
              >
                Log in to save cards to your collection
              </Text>
              <TouchableOpacity
                className="justify-center items-center w-[30px] h-[30px]"
                style={{
                  borderRadius: 15,
                  backgroundColor: `${lightYellow}80`,
                }}
                onPress={() => router.push("/log-in")}
              >
                <Feather name="log-in" size={20} color={iconColor} />
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* logged in user */}
        { auth?.username && (
          <View 
            className="flex-row justify-center items-center"
            style={{
              backgroundColor: "#FFFFFF20",
              height: 40,
              borderRadius: 20,
              overflow: "visible",
              marginLeft: 15,
              marginRight: 15,
              marginTop: 10,
              paddingLeft: 10,
              paddingRight: 10
            }}
          >
            <View className="flex-1">
              <View className="flex-row gap-2 items-center">
                <View
                  style={{
                    backgroundColor: "#FFFFFF90",
                    height: 30,
                    width: 30,
                    justifyContent: "center",
                    alignItems: "center",
                    borderRadius: 15
                  }}
                >
                  <Image 
                    source={logos.iconLightMauve.path}
                    style={{
                      height: 25,
                      width: logos.iconLightMauve.aspectRatio * 25,
                    }}
                  />
                </View>
                <Text className="text-dark-text tracking-wider"
                  style={{ fontFamily: fonts.serif }}
                >
                  150
                </Text>
              </View>
              
            </View>

            <Avatar 
              avatarName={auth?.avatar || "Planeswalker_1"}
              withoutBorder={true}
              size="small"
              shadow={true}
            />

            <View className="flex-1 flex-row pr-2">
              <View className="flex-1"></View>
              <View
                style={{
                  backgroundColor: "#FFFFFF80",
                  height: 30,
                  width: 30,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 15
                }}
              >
                <Feather name="bell" size={22} color="black" />
              </View>
            </View>
          </View>
        )}
      </View>
    )

};

export default Header;