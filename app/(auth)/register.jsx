import { View, ScrollView, Text, useWindowDimensions, Keyboard } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeContext } from "../../context/ThemeProvider";
import { useAuthContext } from "../../context/AuthProvider";
import { useErrorHandler } from "../../context/ErrorHandlerProvider";

import Button from "../../components/CustomButton/CustomButton";
import FormField from "../../components/CustomForm/FormField";
import MessageBox from "../../components/MessageBox";
import LoadingSpinner from "../../components/LoadingSpinner";
import Avatar from "../../components/Avatar/Avatar";

import axios from "../../api/axios";

const Register = () => {
  const { theme } = useThemeContext();
  const { handleError } = useErrorHandler();

  const { auth, logOut, isLoggedIn, isLoading } = useAuthContext();
  
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activateToken, setActivateToken] = useState("");

  const register = async () => {

    setIsSubmitting(true);

    try {
      const { username, email, password } = form;
      const response = await axios.post(
        "/auth/register",
        { username, email, hash: password}
      );
      setActivateToken(response.data.activateToken);
      setShowSuccessMessage(true);

    } catch (error) {
      await handleError(error, handleFormError);

    } finally {
      setIsSubmitting(false);
    }
  };

  const handleFormError = ( errorMessage, input ) => {
    setFormErrors(prev => ({...prev, [input]: errorMessage}));
  };

  const validate = async () => {
    Keyboard.dismiss();
    let isValid = true;

    const { username, email, password, confirm_password } = form;

    if (!email || email.indexOf("@") < 0) {
      handleFormError("Please input a valid email", "email");
      isValid = false;
    }

    if ( !username ) {
      handleFormError("Please input an username", "username");
      isValid = false;
    }

    if ( !password ) {
      handleFormError("Please input your password", "password");
      isValid = false;
    }

    if ( !confirm_password ) {
      handleFormError("Please confirm your password", "confirm_password");
      isValid = false;
    }

    if ( password && confirm_password && password !== confirm_password ) {
      handleFormError("The confirm password does not match password", "confirm_password");
      isValid = false;
    }

    if (isValid) {
      await register();
    }

  };

  const initiateLogOut = async () => {
    try {
      await logOut();
      router.replace("/");
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
              >
                You are currently logged in as 
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
    <>
      <SafeAreaView className="bg-light-background dark:bg-dark-background h-full">
        <ScrollView contentContainerStyle={{ alignItems: "center" }}>
          <View
            className="w-full justify-center px-8 my-14 lg:max-w-screen-sm"
          >
            <Text 
              className="font-serif-bold text-5xl lg:text-6xl text-light-mauve
              dark:text-dark-mauve tracking-wider"
            >
              Sign Up to{"\n"}
              MTG Pocket
            </Text>

            <View className="mt-2">
              <Text className="font-sans-light text-lg lg:text-xl text-light-grey1 dark:text-dark-grey2 tracking-wide">
                Get started for free with your email
              </Text>
            </View>

            { showSuccessMessage && (
              <View>
                <MessageBox 
                  content="Account created, pending activation"
                  type="success"
                  containerStyles="mt-5"
                />
                <Button 
                  title="Activate"
                  containerStyles="mt-5"
                  handlePress={() => router.push(`/activate/${activateToken}`)}
                />
              </View>
            )}

            { !showSuccessMessage && (
              <>
                <FormField 
                  title="Username"
                  value={form.username}
                  handleChangeText={(e) => {
                    handleFormError(null, "username");
                    setForm({ ...form, username: e });
                  }}
                  otherStyles="mt-10"
                  placeholder="give yourself a unique username"
                  error={formErrors.username}
                />

                <FormField 
                  title="Email"
                  value={form.email}
                  keyboardType="email-address"
                  handleChangeText={(e) => {
                    handleFormError(null, "email");
                    setForm({ ...form, email: e });
                  }}
                  otherStyles="mt-4"
                  placeholder="john.tan@email.com"
                  error={formErrors.email}
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

                <FormField 
                  title="Confirm Password"
                  value={form.confirm_password}
                  handleChangeText={(e) => {
                    handleFormError(null, "confirm_password");
                    setForm({ ...form, confirm_password: e });
                  }}
                  otherStyles="mt-4"
                  error={formErrors.confirm_password}
                />

                <Button 
                  title="Register"
                  handlePress={validate}
                  containerStyles="mt-12"
                  isLoading={isSubmitting}
                />

                <View className="justify-center gap-2 pt-5 flex-row">
                  <Text className="font-sans-bold text-light-text dark:text-dark-text font-sans tracking-wide">
                    Already have an account?
                  </Text>
                  <Link
                    href="/log-in"
                    className="font-sans-bold text-light-links dark:text-dark-links tracking-wide"
                  > 
                    Log In
                  </Link>
                </View>
              </>
            )}

          </View>
        </ScrollView>
        
      </SafeAreaView>
      { isSubmitting && (<LoadingSpinner />) }
    </>
  )

};

export default Register;