import { View, Text, TouchableOpacity, Modal, Pressable, Platform } from "react-native";
import { useState } from "react";
import Feather from "@expo/vector-icons/Feather";
import { router } from "expo-router";

import { useAuthContext } from "../context/AuthProvider";
import { useThemeContext } from "../context/ThemeProvider";
import useDeviceLayout from "../hooks/useDeviceLayout";

import tailwindConfig from "../tailwind.config";

import Avatar from "./Avatar/Avatar";
import Button from "./CustomButton/CustomButton";
import LoadingSpinner from "./LoadingSpinner/LoadingSpinner";

const AccountSettings = () => {
  const { auth, logOut } = useAuthContext();
  const { theme } = useThemeContext();
  const { width } = useDeviceLayout();

  const [ showConfirmPopup, setShowConfirmPopup ] = useState(false);
  const [ isProcessing, setIsProcessing ] = useState(false);

  const iconColor = theme === "dark"
    ? tailwindConfig.theme.extend.colors.dark.text
    : tailwindConfig.theme.extend.colors.light.text;
  const lightYellow = tailwindConfig.theme.extend.colors.light.yellow;

  const handleLogOut = async () => {
    try {
      setIsProcessing(true);
      await logOut();
      router.replace("/")
    } catch (error) {
      console.error()
    } finally {
      setIsProcessing(false);
    }
    
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
          size={width < 400 ? "extra small" : "small"}
        />

        <View className="flex-column grow"> 
          { auth?.username && (
            <Text className="font-serif-bold text-3xl text-dark-mauve tracking-wider">
              {auth?.username}
            </Text>
          )}
          
          { !auth?.username && (
            <Text className={`{${width < 400 ? "text-sm" : "text-base"} font-serif-bold text-dark-text tracking-wider`}>
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
              backgroundColor: "#FFFFFF80",
              marginRight: 5,
            }}
            onPress={() => router.push("/log-in")}
          >
            <Feather name="log-in" size={20} color={iconColor} />
          </TouchableOpacity>
        )}

        {/* Log out confirmation Popup */}
        <Modal
          visible={showConfirmPopup}
          transparent
          animationType="fade"
          onRequestClose={() => setShowConfirmPopup(false)}
        >
          {/* Backdrop */}
          <Pressable
            onPress={() => setShowConfirmPopup(false)}
            style={{
              flex: 1,
              backgroundColor: "rgba(0,0,0,0.55)",
              justifyContent: "center",
              alignItems: "center",
              // RN web sometimes benefits from this
              ...(Platform.OS === "web" ? { cursor: "default" } : null),
            }}
          >
            {/* Stop backdrop press from closing when tapping the popup */}
            <Pressable
              onPress={(e) => e.stopPropagation?.()}
              style={{
                width: 300,
                minHeight: 150,
                backgroundColor: "rgba(203, 166, 247, 0.95)",
                borderRadius: 12,
                justifyContent: "center",
                alignItems: "center",
                padding: 16,

                // shadows
                shadowColor: "black",
                shadowOffset: { width: 0, height: 5 },
                shadowOpacity: 0.2,
                shadowRadius: 5,
                elevation: 10,

                // border
                borderBottomWidth: 6,
                borderTopWidth: 1,
                borderLeftWidth: 1,
                borderRightWidth: 1,
                borderColor: "black",
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
            </Pressable>
          </Pressable>
        </Modal>
        
      </View>

      {isProcessing && (<LoadingSpinner />)}
    </View>
  )

};

export default AccountSettings;