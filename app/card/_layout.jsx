import { Stack } from "expo-router";
import React from "react";
import { StatusBar } from "expo-status-bar";

const CardLayout = () => {
  
  return (
    <>
      <Stack
        screenOptions={{ headerShown: false }}
      >
        <Stack.Screen 
          name="[cardId]"
        />
      </Stack>
      <StatusBar 
        backgroundColor="transparent"
        translucent={true}
        style="light"
      />
    </>
  )
};

export default CardLayout;