import { ImageBackground, View, Text, Platform, Linking, Pressable, ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import useDeviceLayout from "../../hooks/useDeviceLayout";

import { images } from "../../constants";

const About = () => {
  const { isDesktopWeb, width } = useDeviceLayout();
  const containerWidth = Math.min( width * 0.9, 900);

  const GITHUB_URL_FE = "https://github.com/ZoeNguyen73/MTG-Pocket-Express";
  const GITHUB_URL_BE = "https://github.com/ZoeNguyen73/MTG-Pocket-RN";

  const openGithubLink = async (linkType) => {
    const url = linkType === "fe" ? GITHUB_URL_FE : GITHUB_URL_BE;
    if (Platform.OS === "web") { 
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      }
    }
  }

  return (
    <ImageBackground
      source={images.background_lowryn_eclipsed}
      className="flex-1 w-full"
      resizeMode="cover"
      style={{
        overflow: "hidden",
      }}
    >
      <View className="absolute inset-0 bg-black/80" />

      <SafeAreaView 
        className="h-[95%] py-4 px-4 items-center"
      >
        <ScrollView
          contentContainerStyle={{
            alignItems: "center",
            paddingHorizontal: containerWidth < 400 ? 12 : 16,
            paddingVertical: 20,
            marginTop: isDesktopWeb ? 90 : 5,
            backgroundColor: "#AE4B0A60",
            borderRadius: 15,
            flex: "column"
          }}
        >
          {/* <View 
            className={`${containerWidth < 400 ? "px-5 rounded-2xl" : "px-12 rounded-2xl"} bg-light-lavender/30 py-5`}
            style={{ maxWidth: containerWidth, marginTop: isDesktopWeb ? 90 : 30 }}
          > */}
          <View className="px-5">
            <View className="flex-row gap-3 mb-8">
              <Text className={`${containerWidth < 400 ? "text-lg" : "text-2xl"} font-mono-bold tracking-wider text-dark-text`}>
                About
              </Text>
              <Text className={`${containerWidth < 400 ? "text-lg" : "text-2xl"} font-mono-bold text-light-yellow tracking-wider`}>
                Magic The Gathering Pocket
              </Text>
            </View>

            <View className="flex-column justify-start gap-2 mb-5">
              <Text className={`${isDesktopWeb ? "text-lg" : "text-base"} tracking-wider text-dark-text font-sans-semibold`}>
                📖 What is Magic The Gathering (MTG) Pocket?
              </Text>
              <Text className="text-sm tracking-wider text-dark-text font-sans">
                MTG Pocket is a personal MTG companion app designed to simulate the "pack-cracking" experience that many Magic fans love!
              </Text>
            </View>

            <View className="flex-column justify-start gap-2 mb-5">
              <Text className={`${isDesktopWeb ? "text-lg" : "text-base"} tracking-wider text-dark-text font-sans-semibold`}>
                🎓 Educational & Non-Commercial Use
              </Text>
              <View className="flex-column text-dark-text font-sans tracking-wide gap-1">
                <Text className="text-dark-text font-sans text-sm tracking-wider">
                  MTG Pocket is a non-commercial, educational project created for learning and personal use.
                </Text>
                { isDesktopWeb && (
                  <View className="list-disc px-5">
                    <Text className="text-xs font-sans text-dark-text">
                      {`\u2022 It is not affiliated with or endorsed by Wizards of the Coast (WotC).`}
                    </Text>
                    <Text className="text-xs font-sans text-dark-text">
                      {`\u2022 All MTG card names, artwork, and related trademarks are the property of WotC.`}
                    </Text>
                    <Text className="text-xs font-sans text-dark-text">
                      {`\u2022 Card data and images are used for educational and informational purposes only.`}
                    </Text>
                    <Text className="text-xs font-sans text-dark-text">
                      {`\u2022 No content in this app is sold, monetized, or used for commercial gain.`}
                    </Text>
                  </View>
                )}
                
                <Text className="text-dark-text font-sans text-sm tracking-wider">
                  If you enjoy MTG, please support the game by purchasing official products and playing through official platforms.
                </Text>
              </View>
            </View>

            <View className="flex-column justify-start gap-2 mb-5">
              <Text className={`${isDesktopWeb ? "text-lg" : "text-base"} tracking-wider text-dark-text font-sans-semibold`}>
                💭 How to Use the App
              </Text>
              <View className="flex-column text-dark-text font-sans tracking-wide gap-1">
                <View className="list-disc px-5">
                  <Text className="text-xs text-dark-text font-sans">
                    {`\u2022 Open a MTG pack and get random cards based on the selected pack.`}
                  </Text>
                  <Text className="text-xs text-dark-text font-sans">
                    {`\u2022 Create a free account to "save" the cards you open from packs to your personal collection.`}
                  </Text>
                  <Text className="text-xs text-dark-text font-sans">
                    {`\u2022 Filter, sort, save cards to favourites in your card collection.`}
                  </Text>
                  <Text className="text-xs text-light-grey1 font-sans">
                    {`\u2022 (Future feature) Add friends and trade your cards with friends.`}
                  </Text>
                  <Text className="text-xs text-light-grey1 font-sans">
                    {`\u2022 (Future feature) Complete quests in exchange for "currency", which can then be used to open more packs.`}
                  </Text>
                </View>
              </View>
            </View>

            <View className="flex-column justify-start gap-2 mb-5">
              <Text className={`${isDesktopWeb ? "text-lg" : "text-base"} tracking-wider text-dark-text font-sans-semibold`}>
                💻 Open Source & Development
              </Text>
              <Text className="text-dark-text font-sans text-sm tracking-wider">
                MTG Pocket is an open-source project built as part of my learning journey in software development.
              </Text>
              <Text className="text-dark-text font-sans text-sm tracking-wider">
                You can view the source code, report issues, or explore how the app is built here
                👉 GitHub: {" "}
                <Text 
                  className="hover:text-dark-sapphire font-sans-bold"
                  onPress={() => openGithubLink("fe")}
                  accessibilityRole="link"
                >
                  FE
                </Text>
                {" || "}
                <Text 
                  className="hover:text-dark-sapphire font-sans-bold"
                  onPress={() => openGithubLink("be")}
                  accessibilityRole="link"
                >
                  BE
                </Text>
              </Text>
            </View>

            <View className="flex-column justify-start gap-2 mb-5">
              <Text className={`${isDesktopWeb ? "text-lg" : "text-base"} tracking-wider text-dark-text font-sans-semibold`}>
                ❤️ A Note from the Developer
              </Text>
              <Text className="text-dark-text font-sans text-sm tracking-wider">
                This project was created out of a love for Magic: The Gathering and a desire to learn app development. 
                If you find it useful or fun, I’m glad it could be part of your Magic journey! 😊
              </Text>
            </View>

          </View>
        </ScrollView>
      </SafeAreaView>
      

    </ImageBackground>
  )
};

export default About;