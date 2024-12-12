import { View, Text, useWindowDimensions} from "react-native";
import React from "react";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Feather from '@expo/vector-icons/Feather';

import tailwindConfig from "../../tailwind.config";
import { useThemeContext } from "../../context/ThemeProvider";

const TabIcon = ({ color, icon, name, focused }) => {
  return (
    <View 
      className="items-center justify-center"
    >
      <Feather 
        name={icon}
        size={24}
        color={color}
        style={{ marginTop: 4 }}
      />
    </View>
  )
};

const TabsLayout = () => {
  const { theme } = useThemeContext();
  const { width } = useWindowDimensions();

  const lightBackgroundColor = tailwindConfig.theme.extend.colors.light.background;
  const darkBackgroundColor = tailwindConfig.theme.extend.colors.dark.background;

  const backgroundColor = theme === "dark" 
    ? tailwindConfig.theme.extend.colors.dark.surface
    : tailwindConfig.theme.extend.colors.dark.background;
  const activeTintColor = tailwindConfig.theme.extend.colors.dark.yellow;
  const inactiveTintColor = tailwindConfig.theme.extend.colors.dark.grey1;

  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{ 
          tabBarLabelStyle: {
            fontSize: width >= 1024 ? 16 : 14,
            fontFamily: "Poppins",
            fonWeight: 300,
            marginTop: 2,
          },
          tabBarActiveTintColor: activeTintColor,
          tabBarInactiveTintColor: inactiveTintColor,
          tabBarPosition: width >= 1024 ? "left" : "bottom",
          tabBarStyle: {
            backgroundColor: backgroundColor,
            height: width >= 1024 ? "100%" : 70,
            itemAlign: "center",
            display: "flex",
            paddingTop: 2,
          }
        }}
      >
        <Tabs.Screen 
          name="home"
          options={{
            title: "Home",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                name="Home"
                icon="home"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen 
          name="collection"
          options={{
            title: "Collection",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                name="Collection"
                icon="book-open"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
        <Tabs.Screen 
          name="settings"
          options={{
            title: "Settings",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                name="Settings"
                icon="settings"
                color={color}
                focused={focused}
              />
            ),
          }}
        />
      </Tabs>
      <StatusBar 
        backgroundColor={`${ theme === "dark" ? darkBackgroundColor : lightBackgroundColor }`} 
        style={`${ theme === "dark" ? "light" : "dark"}`}
      />
    </>
  )
};

export default TabsLayout;