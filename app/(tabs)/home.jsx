import { ImageBackground, TouchableOpacity, View } from "react-native";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { Audio } from "expo-av";
import Feather from "@expo/vector-icons/Feather";
import { useFocusEffect } from "@react-navigation/native";

import { useAuthContext } from "../../context/AuthProvider";

import Header from "../../components/Header";
import SetSelector from "../../components/SetSelector/SetSelector";
import generateSetListData from "../../components/SetSelector/setList";

import { images } from "../../constants";

const MusicToggle = ({ isPlaying, handleToggleMusic }) => {
  return (
    <View
      style={{
        position: "absolute",
        bottom: 20, // Distance from the top of the screen
        right: 20, // Distance from the right edge
        backgroundColor: "#6c7086",
        height: 40,
        width: 40,
        borderRadius: 20, // Rounded corners
        zIndex: 1000, // Ensure it's above other elements
        elevation: 5, // Add shadow on Android
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <TouchableOpacity
        onPress={handleToggleMusic}
        style={{
          justifyContent: "center",
          alignItems: "center", // Center the icon within the TouchableOpacity
          height: "100%", // Make TouchableOpacity fill the parent View
          width: "100%",
          borderWidth: 1,
          borderColor: "transparent"
        }}
      >
        { isPlaying && (
          <Feather name="play-circle" size={24} color="#FFBD12" />
        )}
        { !isPlaying && (
          <Feather name="pause-circle" size={24} color="#FFBD12" />
        )}
      </TouchableOpacity>
    </View>
  )
};

const Home = () => {
  const { isLoggedIn, isLoading } = useAuthContext();
  const [ setList, setSetList ] = useState([]);
  const bgSoundRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(true);

  // load set data
  useEffect(() => {
    const data = generateSetListData();
    setSetList(data);
  }, [])

  // manage sound with navigation events
  useFocusEffect(
    useCallback(() => {
      const playSound = async () => {
        try {
          // Unload any existing sound before playing a new one
          if (bgSoundRef.current) {
            await bgSoundRef.current.unloadAsync();
            bgSoundRef.current = null;
          }

          const { sound } = await Audio.Sound.createAsync(
            require("../../assets/sounds/Adventure_remaster.mp3"),
            { shouldPlay: true, isLooping: true }
          );
          bgSoundRef.current = sound;
          await sound.playAsync();
        } catch (error) {
          console.error("Error playing sound:", error);
        }
      };

      playSound();

      // Cleanup: Unload sound when leaving the screen
      return () => {
        if (bgSoundRef.current) {
          bgSoundRef.current.unloadAsync();
          bgSoundRef.current = null;
        }
      };

    }, [])
  );

  // if (!isLoading && !isLoggedIn) {
  //   return <Redirect href="/" />;
  // }

  const handleToggleMusic = async () => {
    if (bgSoundRef.current) {
      if (isPlaying) {
        await bgSoundRef.current.pauseAsync();
      } else {
        await bgSoundRef.current.playAsync();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <ImageBackground
      source={images.dark_background_vertical_2}
      style={{
        resizeMode: "cover",
        overflow: "hidden",
      }}
    >
      { (setList.length > 0) && (
        <SetSelector sets={setList} />
      )}
      <MusicToggle 
        isPlaying={isPlaying}
        handleToggleMusic={handleToggleMusic}
      />
    </ImageBackground>
  )
};

export default Home;