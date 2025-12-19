import { View, Text, ScrollView, Keyboard, KeyboardAvoidingView, Platform, ImageBackground } from "react-native";
import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { router, Link } from "expo-router";
import Feather from "@expo/vector-icons/Feather";
import { LinearGradient } from "expo-linear-gradient";

import { useAuthContext } from "../../context/AuthProvider";
import { useThemeContext } from "../../context/ThemeProvider";
import { useErrorHandler } from "../../context/ErrorHandlerProvider";

import tailwindConfig from "../../tailwind.config";
import { getFonts } from "../../utils/FontFamily";

import { images, avatars } from "../../constants";

import Button from "../../components/CustomButton/CustomButton";
import FormField from "../../components/CustomForm/FormField";
import Avatar from "../../components/Avatar/Avatar";
import LoadingSpinner from "../../components/LoadingSpinner";

import useDeviceLayout from "../../hooks/useDeviceLayout";

const LogIn = () => {
  const { auth, logIn, isLoggedIn, isLoading, logOut} = useAuthContext();
  const { handleError } = useErrorHandler();
  const { theme } = useThemeContext();

  const iconColor = tailwindConfig.theme.extend.colors.dark.text;
  const fonts = getFonts();

  const { isDesktopWeb, width } = useDeviceLayout();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);

  const handleFormError = ( errorMessage, input ) => {
    setFormErrors(prev => ({...prev, [input]: errorMessage}));
  };

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;
    const { username, password } = form;

    if ( !username ) {
      handleFormError("Please input an username", "username");
      isValid = false;
    }

    if ( !password ) {
      handleFormError("Please input your password", "password");
      isValid = false;
    }

    if (isValid) {
      await submit();
    }
  };

  const submit = async () => {
    setIsSubmitting(true);

    try {
      console.log("[Log In submit] username: " + form.username + ", password: " + form.password);
      await logIn({ username: form.username, hash: form.password });
      setShowSuccessMessage(true);
      router.replace("/home");
    } catch (error) {
      await handleError(error, handleFormError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const initiateLogOut = async () => {

    try {
      await logOut();
      router.push("/");
    } catch (error) {
      await handleError(error);
    }
  };

  if (!isLoading && isLoggedIn && auth.username) {
    return (
      <SafeAreaView className="bg-light-background dark:bg-dark-background h-full">
        <ScrollView>
          <View className="w-full justify-center px-8 my-6 min-h-[85vh]">
            <View className="flex-column justify-center items-center gap-2">
              <Text 
                className="font-mono-bold text-2xl text-light-yellow 
                dark:text-dark-yellow tracking-wider mb-5"
                style={{ fontFamily: fonts.serifBold }}
              >
                Welcome back{"\n"}
                to Magic The Gathering Pocket 
              </Text>

              <View className="justify-center items-center w-full">
                <Avatar 
                  avatarName={auth.avatar}
                  size="large"
                />

                <Text className="font-mono-bold tracking-wider text-light-teal dark:text-dark-teal text-3xl mt-2">
                  {auth.username}
                </Text> 
              </View>
            </View>

            <View className="justify-center flex-column">
              <Button 
                title="Continue to Home"
                handlePress={() => router.push("/home")}
                containerStyles="mt-12"
              />
              <Button 
                title="Log Out"
                variant="secondary"
                handlePress={initiateLogOut}
                containerStyles="mt-12"
              />
            </View>
          </View>
        
        </ScrollView>
        
      </SafeAreaView>
      
    )
  }

  return (
    <ImageBackground
      source={isDesktopWeb ? images.background_ATLA2 : images.FDN_Bundle_Wallpaper_1040x1536}
      resizeMode="cover"
      style={{
        overflow: "hidden",
        width: "100%",
        height: "100%"
      }}
    >
      <View className="absolute inset-0 bg-black/80" />
      <SafeAreaView style={{ flex: 1 }} edges={["top", "left", "right"]} className="items-center">
        { !isDesktopWeb && (
          <KeyboardAvoidingView
            style={{ flex: 1, width: "100%" }}
            behavior={Platform.OS === "ios" ? "position" : "height"}
            keyboardVerticalOffset={0}
          >
            <ScrollView 
              style={{ flex: 1, width: "100%" }}
              contentContainerStyle={{ flexGrow: 1, justifyContent: "flex-end" }}
              keyboardShouldPersistTaps="handled"
              contentInsetAdjustmentBehavior="never" 
            >
              <View
                className="w-full rounded-3xl justify-center items-center pt-12
                rounded-b-none border border-t-8 border-black"
                style={{
                  backgroundColor: "rgba(30, 30, 46, 0.90)"
                }}
              >
                <View
                  className="w-[85%] py-5 px-5"
                >
                  <View className="flex-row gap-2 items-center">
                    <Text 
                      className={`${width < 400 ? "text-2xl" : "text-3xl"} text-dark-text font-serif-bold text-4xl tracking-wider`}
                      style={{ fontFamily: fonts.serifBold }}
                    >
                      Welcome Back!
                    </Text>
                    <Feather name="smile" size={32} color={iconColor} />
                  </View>

                  <FormField 
                    title="Username"
                    value={form.username}
                    handleChangeText={(e) => {
                      handleFormError(null, "username");
                      setForm({ ...form, username: e });
                    }}
                    otherStyles="mt-10"
                    error={formErrors.username}
                  />
                  <FormField 
                    title="Password"
                    value={form.password}
                    handleChangeText={(e) => {
                      handleFormError(null, "password");
                      setForm({ ...form, password: e });
                    }}
                    otherStyles="mt-4"
                    error={formErrors.password}
                  />

                  <Button 
                    title="Log In"
                    handlePress={validate}
                    containerStyles="mt-12"
                    isLoading={isSubmitting}
                  />

                  <View className="justify-center gap-1 pt-5 flex-row mt-1 mb-5">
                    <Text 
                      className={`${width < 400 ? "text-xs" : "text-sm"} text-dark-text font-sans tracking-wide`}
                      style={{ fontFamily: fonts.sans }}
                    >
                      Don't have an account?
                    </Text>
                    <Link
                      href="/register"
                      className={`${width < 400 ? "text-xs" : "text-sm"} font-sans-bold text-light-links dark:text-dark-links tracking-wide`}
                      style={{ fontFamily: fonts.sansBold }}
                    > 
                      Register for free
                    </Link>
                  </View>
                </View>
                
              </View>
            </ScrollView>
          </KeyboardAvoidingView>
          
        )}

        { isDesktopWeb && (
          <View className="h-screen items-center justify-center">
            <LinearGradient
              colors={[
                "rgba(251, 146, 60, 0.3)",   // orange-400/30
                "rgba(192, 132, 252, 0.3)",  // purple-400/30
              ]}
              start={{ x: 0, y: 0.5 }}   // left
              end={{ x: 1, y: 0.5 }}     // right
              style={{
                paddingHorizontal: 20,
                paddingVertical: 40,
                borderRadius: 24,
                alignItems: "center",
                alignSelf: "flex-start",
              }}
            >
              <View className="flex-column min-w-[400px] py-10 px-10">
                
                <View className="flex-row gap-2 items-center justify-center">
                  <Text 
                    className={`text-4xl text-dark-text font-serif-bold tracking-wider`}
                    style={{ fontFamily: fonts.serifBold }}
                  >
                    Welcome Back!
                  </Text>
                  <Feather name="smile" size={32} color={iconColor} />
                </View>

                <FormField 
                  title="Username"
                  value={form.username}
                  handleChangeText={(e) => {
                    handleFormError(null, "username");
                    setForm({ ...form, username: e });
                  }}
                  otherStyles="mt-10"
                  error={formErrors.username}
                />
                <FormField 
                  title="Password"
                  value={form.password}
                  handleChangeText={(e) => {
                    handleFormError(null, "password");
                    setForm({ ...form, password: e });
                  }}
                  otherStyles="mt-4"
                  error={formErrors.password}
                />

                <Button 
                  title="Log In"
                  handlePress={validate}
                  containerStyles="mt-12"
                  isLoading={isSubmitting}
                />

                <View className="justify-center gap-2 pt-5 flex-row mt-1 mb-5">
                  <Text 
                    className="text-sm text-dark-text font-sans tracking-wide"
                    style={{ fontFamily: fonts.sans }}
                  >
                    Don't have an account?
                  </Text>
                  <Link
                    href="/register"
                    className="text-sm font-sans-bold text-light-links dark:text-dark-links tracking-wide"
                    style={{ fontFamily: fonts.sansBold }}
                  > 
                    Register for free
                  </Link>
                </View>
              </View>


            </LinearGradient>
          </View>
        )}
        
      </SafeAreaView>

      { isSubmitting && (
        <LoadingSpinner />
      )}
    </ ImageBackground>
  )

};

export default LogIn;