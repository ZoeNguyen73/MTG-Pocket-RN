import { View, Platform, TouchableOpacity, Text } from "react-native";
import { Tabs } from "expo-router";
import { StatusBar } from "expo-status-bar";
import Feather from "@expo/vector-icons/Feather";
import { BlurView } from "expo-blur";
import { useState } from "react";
import { router } from "expo-router";

import tailwindConfig from "../../tailwind.config";
import { useThemeContext } from "../../context/ThemeProvider";
import { useAuthContext } from "../../context/AuthProvider";

const TabIcon = ({ color, icon }) => {
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

const CustomTabBar = ({
  state,
  descriptors,
  navigation,
  activeTintColor,
  inactiveTintColor,
  isWeb,
  theme
}) => {
  const { auth } = useAuthContext();
  const [ hoveredIndex, setHoveredIndex ] = useState(null);
  
  const iconColor = theme === "dark"
    ? tailwindConfig.theme.extend.colors.light.text
    : tailwindConfig.theme.extend.colors.dark.text;

  const barHeight = 55;

  // TO DO: implement actual auth logic
  const isLoggedIn = auth?.username; 

  // WEB LAYOUT: Navigation tabs on the left + Profile/Log in on the right
  if (isWeb) {
    return (
      <View
        className={`h-[55px] absolute left-0 right-0 z-50 overflow-hidden px-12 overflow-visible`}
      >
        <BlurView 
          tint={theme === "dark" ? "dark" : "light"}
          intensity={90}
          style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
        />

        <View
          className={`flex-row items-center justify-between py-2 px-6`}
        >

          {/* LEFT: Tabs */}
          <View className="flex-row items-center">
            { state.routes.map((route, index) => {
              const { options } = descriptors[route.key];

              const isFocused = state.index === index;
              const color = isFocused ? activeTintColor : inactiveTintColor;

              const label =
                options.tabBarLabel !== undefined
                  ? options.tabBarLabel
                  : options.title !== undefined
                  ? options.title
                  : route.name;

              const onPress = () => {
                const event = navigation.emit({
                  type: "tabPress",
                  target: route.key,
                  canPreventDefault: true,
                });

                if (!isFocused && !event.defaultPrevented) {
                  navigation.navigate(route.name);
                };
              };

              const onLongPress = () => {
                navigation.emit({
                  type: "tabLongPress",
                  target: route.key,
                })
              };

              const icon = options.tabBarIcon && options.tabBarIcon({ focused: isFocused, color });

              return (
                <View
                  key={route.key}
                  className="relative items-center justify-center"
                  style={{
                    marginRight: index === state.routes.length - 1 ? 0 : 30,
                  }}
                  onMouseEnter={() => setHoveredIndex(index)}
                  onMouseLeave={() => setHoveredIndex(null)}
                >
                  <TouchableOpacity
                    
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    testID={options.tabBarTestID}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    className="items-center justify-center"
                  >
                    {icon}
                  </TouchableOpacity>

                  {hoveredIndex === index && (
                    <View className="absolute -bottom-10 px-2 py-1 rounded bg-black/80">
                      <Text className="text-sm text-white">{label}</Text>
                    </View>
                  )}
                </View>
              );
            })}
          </View>

          {/* RIGHT: profile avatar / login icon */}
          <View className="flex-row items-center gap-3">
            <Text 
              className="flex-1 font-sans text-sm text-dark-text tracking-wide" 
            >
              Log in to save cards to your collection
            </Text>
            <TouchableOpacity 
              className="justify-center items-center w-[30px] h-[30px]"
              style={{
                borderRadius: 15,
                backgroundColor: `lightyellow`,
              }}
              onPress={() => router.push("/log-in")}
            >
              <Feather name="log-in" size={20} color={iconColor} />
            </TouchableOpacity>
          </View>

        </View>
      </View>
    )
  }

   // NATIVE LAYOUT: bottom bar, 4 tabs evenly spaced, NO profile/login
  return (
    <View
      className="absolute left-0 right-0 bottom-0 z-50 overflow-hidden"
      style={{ height: 65 }}
    >
      <BlurView
        tint={theme === "dark" ? "dark" : "light"}
        intensity={20}
        style={{ position: "absolute", top: 0, bottom: 0, left: 0, right: 0 }}
      />

      <View className="flex-row items-center justify-around px-5 pt-2 pb-4">
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const isFocused = state.index === index;
          const color = isFocused ? activeTintColor : inactiveTintColor;

          const onPress = () => {
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };

          const icon =
            options.tabBarIcon &&
            options.tabBarIcon({
              focused: isFocused,
              color,
            });

          return (
            <TouchableOpacity
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              className="flex-1 items-center justify-center"
            >
              {icon}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

};

const TabsLayout = () => {
  const { theme } = useThemeContext();

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
          headerShown: false,
          tabBarShowLabel: false,
          tabBarPosition: isWeb ? "top" : "bottom", 
        }}
        tabBar={(props) => (
          <CustomTabBar 
            {...props}
            activeTintColor={activeTintColor}
            inactiveTintColor={inactiveTintColor}
            isWeb={isWeb}
            theme={theme}
          />
        )}
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