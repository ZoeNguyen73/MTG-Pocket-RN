import React, { useEffect, useState, useRef } from "react";
import { View, Text, Switch, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import DropDownPicker from "react-native-dropdown-picker";
import { Audio } from "expo-av";

import { soundManager } from "../../utils/SoundManager";
import { soundAssets } from "../../constants/sounds";

import tailwindConfig from "../../tailwind.config";

const SoundSettings = () => {
  const [ bgMusicVolume, setBgMusicVolume ] = useState(soundManager.backgroundMusicVolume);
  const [ bgMusicPlaying, setBgMusicPlaying ] = useState(soundManager.backgroundMusicPlaying);
  const [ bgMusicDisplay, setBgMusicDisplay ] = useState("");
  const [ dropdownOpen, setDropdownOpen ] = useState(false);
  const [ selectedBgMusic, setSelectedBgMusic ] = useState(soundManager.backgroundMusicFileName);
  const [ bgMusicOptions, setBgMusicOptions ] = useState([]);
  const [ sfxVolume, setSfxVolume ] = useState(1);
  const soundRef = useRef(null);

  useEffect(() => {
    const options = [];
    Object.keys(soundAssets).forEach(key => {
      const option = {
        label: soundAssets[key].display,
        value: key,
      };
      options.push(option);
    });

    setBgMusicOptions(options);
    setBgMusicDisplay(soundAssets[soundManager.backgroundMusicFileName].display);
    setSfxVolume(soundManager.getSoundEffectsVolume());
  }, []);

  const iconColor = tailwindConfig.theme.extend.colors.dark.text;
  const lightYellow = tailwindConfig.theme.extend.colors.light.yellow;
  const lightText = tailwindConfig.theme.extend.colors.light.text;
  const darkText = tailwindConfig.theme.extend.colors.dark.text;
  const lightBackground = tailwindConfig.theme.extend.colors.light.background;
  const textFont = tailwindConfig.theme.fontFamily.sans[0];

  const handleToggleMusic = async () => {
    if (bgMusicPlaying) {
      await soundManager.stopBackgroundMusic();
    } else {
      await soundManager.playBackgroundMusic();
    }

    setBgMusicPlaying(!bgMusicPlaying);
  };

  const handleBgMusicVolumeChange = async (change) => {
    let newVol = bgMusicVolume + change;
    if (newVol < 0) newVol = 0;
    if (newVol = 1) newVol = 1;
    console.log("newVol: " + newVol);
    if (newVol !== bgMusicVolume) {
      setBgMusicVolume(newVol);
      await soundManager.setBackgroundMusicVolume(newVol);
    }
  };

  const handleChangeMusicOption = async (value) => {
    if (value !== soundManager.backgroundMusicFileName) {
      await soundManager.playBackgroundMusic(value);
      setBgMusicDisplay(soundAssets[value].display);
    } 
  };

  const handleSfxVolumeChange = async (change) => {
    let newVol = sfxVolume + change;
    console.log("newVol: " + newVol);

    if (newVol < 0) newVol = 0;
    if (newVol > 1) newVol = 1;

    try {
      const { sound } = await Audio.Sound.createAsync(
        require("../../assets/sounds/shine-8.mp3"),
        { isLooping: false }
      );
      soundRef.current = sound;
      await sound.setVolumeAsync(newVol);
      await sound.playAsync();
    } catch (error) {
      console.error("Error playing sound:", error);
    }

    if (newVol !== sfxVolume) {
      setSfxVolume(newVol);
      soundManager.setSoundEffectsVolume(newVol);
    }
  };

  return (
    <View className="px-4 py-8 h-full">
      {/* Background Music Controls */}
      <View className="flex-row gap-2 justify-center items-center">
        <Text className="flex-1 font-sans-semibold text-2xl text-light-yellow tracking-wide">
          Background Music
        </Text>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center"
          }}
        >
          <Switch
            trackColor={{false: '#767577', true: lightYellow }}
            thumbColor={bgMusicPlaying ? '#f5dd4b' : '#f4f3f4'}
            ios_backgroundColor="#3e3e3e"
            onValueChange={handleToggleMusic}
            value={bgMusicPlaying}
          />
        </View>
        
      </View>

      { bgMusicPlaying && (
        <View className="flex-row gap-2 justify-center h-[40]">
          <Feather name="music" size={18} color={darkText} />
          <Text className="flex-1 font-sans-semibold-italic text-base text-dark-text tracking-wide">
            {bgMusicDisplay}
          </Text>
        </View>
      )}

      { bgMusicPlaying && (
        <View className="mt-5">
          <View>
            <Text className="font-sans-light-italic text-sm text-dark-text tracking-wide">
              Choose another track
            </Text>
          </View>
          
          <DropDownPicker 
            open={dropdownOpen}
            value={selectedBgMusic}
            items={bgMusicOptions}
            setOpen={setDropdownOpen}
            setValue={setSelectedBgMusic}
            setItems={setBgMusicOptions}
            multiple={false}
            onChangeValue={handleChangeMusicOption}
            style={{ 
              backgroundColor: lightBackground,
              borderWidth: dropdownOpen ? 1 : 0,
              borderColor: lightYellow,
              marginTop: 5,
              paddingTop: 5,
              paddingLeft: 10,
              minHeight: 28,
              borderRadius: 14,
            }}

            dropDownContainerStyle={{ 
              backgroundColor: lightBackground, 
            }}
            textStyle={{
              color: lightText,
              fontFamily: textFont,
              fontSize: 12,
            }}
            ArrowDownIconComponent={() => <Feather name="chevron-down" size={24} color={lightText} />}
            ArrowUpIconComponent={() => <Feather name="chevron-up" size={24} color={lightText} />}
            TickIconComponent={() => <Feather name="check" size={24} color={lightText} />}
          />
        </View>
      )}

      { bgMusicPlaying && (
        <View className="mt-5">
          <Text className="font-sans-light-italic text-sm text-dark-text tracking-wide">
            Volume:
          </Text>
          <View
            className="flex-row w-100 py-2 items-center"
          >
            <View className="flex-row w-100 gap-3 justify-center items-center">
              <View
                className="rounded-full h-[30] w-[30] bg-light-yellow justify-center items-center"
                style={{
                  elevation: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleBgMusicVolumeChange(-0.2)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Feather name="volume-1" size={20} color="black" />
                </TouchableOpacity>
              </View>

              <View 
                className="flex-1 h-[15] rounded-full"
                style={{ backgroundColor: `${lightBackground}50`}}
              >
                <View
                  className="bg-light-background rounded-full"
                  style={{ width: `${bgMusicVolume * 100}%`, height: "100%", overflow: "hidden"}}
                >

                </View>
              </View>

              <View
                className="rounded-full h-[30] w-[30] bg-light-yellow justify-center items-center"
              >
                <TouchableOpacity
                  onPress={() => handleBgMusicVolumeChange(0.2)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Feather name="volume-2" size={20} color="black" />
                </TouchableOpacity>
              </View>
              
            </View>
          </View>
        </View>
      )}

      {/* Sfx Controls */}
      <View className="mt-20">
        <Text className="font-sans-semibold text-2xl text-light-yellow tracking-wide">
          Sound Effects
        </Text>
      </View>

      <View className="mt-2">
          <Text className="font-sans-light-italic text-sm text-dark-text tracking-wide">
            Volume:
          </Text>
          <View
            className="flex-row w-100 py-2 items-center"
          >
            <View className="flex-row w-100 gap-3 justify-center items-center">
              <View
                className="rounded-full h-[30] w-[30] bg-light-yellow justify-center items-center"
                style={{
                  elevation: 5,
                }}
              >
                <TouchableOpacity
                  onPress={() => handleSfxVolumeChange(-0.2)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Feather name="volume-1" size={20} color="black" />
                </TouchableOpacity>
              </View>

              <View 
                className="flex-1 h-[15] rounded-full"
                style={{ backgroundColor: `${lightBackground}50`}}
              >
                <View
                  className="bg-light-background rounded-full"
                  style={{ width: `${sfxVolume * 100}%`, height: "100%", overflow: "hidden"}}
                >

                </View>
              </View>

              <View
                className="rounded-full h-[30] w-[30] bg-light-yellow justify-center items-center"
              >
                <TouchableOpacity
                  onPress={() => handleSfxVolumeChange(0.2)}
                  style={{
                    justifyContent: "center",
                    alignItems: "center",
                    width: "100%",
                    height: "100%",
                  }}
                >
                  <Feather name="volume-2" size={20} color="black" />
                </TouchableOpacity>
              </View>
              
            </View>
          </View>
        </View>
      
    </View>
  )
};

export default SoundSettings;