import { View, Text, ScrollView } from "react-native";
import React, { useState, useEffect } from "react";
import { router, useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import axios from "../../../api/axios";
import useAxiosPrivate from "../../../hooks/useAxiosPrivate";

import storage from "../../../utils/Storage";

import { useAuthContext } from "../../../context/AuthProvider";
import { useErrorHandler } from "../../../context/ErrorHandlerProvider";

import Button from "../../../components/CustomButton/CustomButton";
import LoadingSpinner from "../../../components/LoadingSpinner";
import MessageBox from "../../../components/MessageBox";
import AvatarList from "../../../components/Avatar/AvatarList";

const Activate = () => {
  const { activateToken } = useLocalSearchParams();
  const { setAuth, setIsLoggedIn } = useAuthContext();
  const { handleError } = useErrorHandler();

  const axiosPrivate = useAxiosPrivate();

  const [ showSuccessMessage, setShowSuccessMessage ] = useState(false);
  const [ username, setUsername ] = useState("");
  const [ isSubmitting, setIsSubmitting ] = useState(false);
  const [showAvatarChangeMessage, setShowAvatarChangeMessage] = useState(false);
  const [selectedAvatar, setSelectedAvatar] = useState("");

  useEffect(() => {
    async function activate() {
      try {
        const response = await axios.post(`/users/${activateToken}/activate`);
        const { user, accessToken, refreshToken } = response.data;

        await storage.setItem("username", user.username);
        await storage.setItem("accessToken", accessToken);
        await storage.setItem("refreshToken", refreshToken);
        await storage.setItem("avatar", user.avatar);

        setSelectedAvatar(user.avatar);
        setUsername(user.username);
        setAuth({ username: user.username, accessToken, avatar: user.avatar });
        setIsLoggedIn(true);
        setShowSuccessMessage(true);
        
      } catch (error) {
        await handleError(error);
      }
    };

    activate();
  }, [])

  const updateUserAvatar = async () => {};

  return (
    <>
      <SafeAreaView className="bg-light-background dark:bg-dark-background h-full">
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <View className="w-full justify-center px-8 my-14 lg:max-w-screen-md">

            {!showSuccessMessage && (
              <Text className="font-mono-bold text-xl text-light-yellow dark:text-dark-yellow tracking-wider">
                Account activation in process...
              </Text>
            )}

            {showSuccessMessage && (
              <View className="justify-center items-center">
                <View className="flex mb-4 justify-center items-center py-2 rounded-lg">
                  <Text className="font-mono-bold text-base text-light-success dark:text-dark-success tracking-wider mb-2 leading-none">
                    Account activated successfully
                  </Text>
                  <Text className="font-mono-bold text-xs text-light-text dark:text-dark-text tracking-wider mb-2 leading-3">
                    One last step before we get started
                  </Text>
                </View>

                <View className="justify-center items-center">
                  <Text className="font-mono-bold text-3xl text-light-yellow dark:text-dark-yellow tracking-wider">
                    Choose your avatar
                  </Text>
                  <Text className="font-sans-light text-light-grey1 dark:text-dark-text text-sm">
                    You can change your avatar later in settings
                  </Text>

                  { showAvatarChangeMessage && (
                    <MessageBox 
                      content="Avatar updated. Redirecting to Home..."
                      type="success"
                      constainerStyles="mt-2"
                    />
                  )}
                </View>

                <AvatarList 
                  containerStyles="px-5 mt-5"
                  selectedAvatar={selectedAvatar}
                  setSelectedAvatar={setSelectedAvatar}
                />

                <Button 
                  title="Confirm Avatar"
                  containerStyles="mt-2"
                  handlePress={()=> updateUserAvatar()}
                />

              </View>
            )}

          </View>
        </ScrollView>
      </SafeAreaView>
      {isSubmitting && (<LoadingSpinner />)}
    </>
  )
};

export default Activate;