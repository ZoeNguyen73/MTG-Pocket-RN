import { View, ScrollView, Text } from "react-native";
import React from "react";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "../../context/AuthProvider";

import Header from "../../components/Header";

const Home = () => {
  const { isLoggedIn, isLoading } = useAuthContext();

  if (!isLoading && !isLoggedIn) {
    return <Redirect href="/" />;
  }

  return (
    <SafeAreaView 
      className="bg-light-background dark:bg-dark-background h-full"
    >
      <Header 
        containerStyles = "px-5 pt-5 bg-dark-mauve rounded-3xl mx-5 md:mt-5"
      />

      <ScrollView>
        {/* <Text>Home</Text> */}
      </ScrollView>
      
    </ SafeAreaView>
  )
};

export default Home;