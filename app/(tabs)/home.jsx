import { View, ScrollView, Text } from "react-native";
import React, { useState, useEffect } from "react";
import { Redirect } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useAuthContext } from "../../context/AuthProvider";

import Header from "../../components/Header";
import SetSelector from "../../components/SetSelector/SetSelector";
import generateSetListData from "../../components/SetSelector/setList";

const Home = () => {
  const { isLoggedIn, isLoading } = useAuthContext();
  const [ setList, setSetList ] = useState([]);

  useEffect(() => {
    const data = generateSetListData();
    setSetList(data);
  }, [])

  // if (!isLoading && !isLoggedIn) {
  //   return <Redirect href="/" />;
  // }

  return (
    <SafeAreaView 
      className="bg-dark-background dark:bg-dark-background h-full"
    >
      {/* <Header 
        containerStyles = "px-5 pt-5 bg-dark-mauve rounded-3xl mx-5 md:mt-5"
      /> */}

      <Text className="mb-2 mt-8 text-center font-sans-bold text-2xl text-light-yellow tracking-wider">
        Open a Booster Pack
      </Text>

      <ScrollView className="overflow-visible">
        { (setList.length === 0) && (
          <Text>Loading...</Text>
        )}
        { (setList.length > 0) && (
          <SetSelector sets={setList} />
        )}
        
      </ScrollView>
      
    </ SafeAreaView>
  )
};

export default Home;