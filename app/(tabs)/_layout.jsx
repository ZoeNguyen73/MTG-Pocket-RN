import { View, useWindowDimensions, StyleSheet, Platform } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";

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
  const activeTintColor = tailwindConfig.theme.extend.colors.light.yellow;
  const inactiveTintColor = tailwindConfig.theme.extend.colors.dark.grey1;

  const font = tailwindConfig.theme.fontFamily.sans[0];

  const isWeb = Platform.OS === "web";

  return (
    <>
      <Tabs
        backBehavior="history"
        screenOptions={{ 
          tabBarLabelStyle: {
            fontSize: isWeb ? 16 : 14,
            fontFamily: font,
            fonWeight: 300,
            marginTop: 2,
            letterSpacing: 0.3,
          },
          tabBarActiveTintColor: activeTintColor,
          tabBarInactiveTintColor: inactiveTintColor,
          tabBarActiveBackgroundColor: "transparent",
          tabBarPosition: isWeb ? "top" : "bottom",
          tabBarStyle: {
            height: 55,
            itemAlign: "center",
            display: "flex",
            paddingTop: isWeb ? 0 : 4,
            borderTopWidth: 0,
            borderBottomWidth: 0,
            position: isWeb ? "" : "absolute",
          },
          tabBarBackground: () => {
            if (!isWeb) {
              return (
                <BlurView tint="dark" intensity={100} style={StyleSheet.absoluteFill} />
              )
            } else {
              return (
                <BlurView tint="dark" intensity={90} style={StyleSheet.absoluteFill} />
              )
            }
          }
            
          ,
          tabBarShowLabel: false
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
          name="social"
          options={{
            title: "Social",
            headerShown: false,
            tabBarIcon: ({ color, focused }) => (
              <TabIcon 
                name="Social"
                icon="users"
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
        // backgroundColor={`${ theme === "dark" ? darkBackgroundColor : darkBackgroundColor }`} 
        // style={`${ theme === "dark" ? "light" : "light"}`}
        style="light"
        backgroundColor="transparent"
        translucent={true}
      />
    </>
  )
};

export default TabsLayout;