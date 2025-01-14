import { View, Text, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

import { useAuthContext } from "../context/AuthProvider";
import { useThemeContext } from "../context/ThemeProvider";

import tailwindConfig from "../tailwind.config";

import Avatar from "./Avatar/Avatar";
import Button from "./CustomButton/CustomButton";

const AccountSettings = () => {
  const { auth, logOut } = useAuthContext();
  const { theme } = useThemeContext();

  const [ showConfirmPopup, setShowConfirmPopup ] = useState(false);

  const iconColor = theme === "dark"
    ? tailwindConfig.theme.extend.colors.dark.text
    : tailwindConfig.theme.extend.colors.light.text;
  const lightYellow = tailwindConfig.theme.extend.colors.light.yellow;

  const handleLogOut = async () => {
    await logOut();
    router.replace("/")
  };

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
          { auth?.username && (
            <Text className="font-serif-bold text-3xl text-dark-mauve tracking-wider">
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
            onPress={() => setShowConfirmPopup(true)}
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

        {/* Log out confirmation Popup */}
        { showConfirmPopup && (
          <View
            style={{
              position: "absolute",
              top: "300%",
              left: "50%",
              transform: [{ translateX: -150 }, { translateY: -100 }],
              width: 300,
              height: 150,
              backgroundColor: "rgba(203, 166, 247, 0.95)",
              borderRadius: 10,
              justifyContent: "center",
              alignItems: "center",
              elevation: 5,
              shadowColor: "black",
              shadowOffset: { width: 0, height: 5 },
              shadowOpacity: 0.2,
              shadowRadius: 5,
              borderBottomWidth: 6,
              borderTopWidth: 1,
              borderLeftWidth: 1,
              borderRightWidth: 1,
              borderColor: "black",
              zIndex: 100,
            }}
          >
            <Text className="font-mono-bold text-lg text-light-text tracking-wider">
              Confirm to Log Out?
            </Text>

            <View className="flex-row gap-3 mt-3">
              <Button 
                title="Cancel"
                handlePress={() => setShowConfirmPopup(false)}
                variant="small-secondary"
              />
              <Button 
                title="Confirm"
                handlePress={handleLogOut}
                variant="small-primary"
              />
            </View>
          </View>
        )}
        
      </View>
    </View>
  )

};

export default AccountSettings;