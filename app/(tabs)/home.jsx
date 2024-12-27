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

      <ScrollView>
        { (setList.length === 0) && (
          <Text>Loading...</Text>
        )}
        { (setList.length > 0) && (
          <View className="flex-column w-full">
            <SetSelector sets={setList} />
          </View>
        )}
        
      </ScrollView>
      
    </ SafeAreaView>
  )
};

export default Home;