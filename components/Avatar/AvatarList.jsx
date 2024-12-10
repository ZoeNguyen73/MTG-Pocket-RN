import { View, TouchableOpacity, Image, useWindowDimensions } from "react-native";
import React from "react";

import { avatars } from "../../constants";
import tailwindConfig from "../../tailwind.config";

const Avatar = ({ avatarName, selectedAvatar, setSelectedAvatar }) => {
  const lightWarning = tailwindConfig.theme.extend.colors.light.warning;
  const opacity = avatarName === selectedAvatar ? 1 : 0.5;
  const { width } = useWindowDimensions();
  return (
    <TouchableOpacity
      onPress={() => setSelectedAvatar(avatarName)}
      className="p-2"
    >
      <Image 
        source={avatars[avatarName]}
        alt={avatarName}
        opacity={opacity}
        resizeMode="cover"
        style={{
          width: width >= 1024 ? 120 : 80,
          height: width >= 1024 ? 120 : 80,
          borderRadius: width >= 1024 ? 60 : 40,
          borderWidth: 5,
          borderColor: avatarName === selectedAvatar ? lightWarning : "transparent",
        }}
      />
    </TouchableOpacity>
  )
};

const AvatarList = ({containerStyles, selectedAvatar, setSelectedAvatar }) => {
  return (
    <View
      className={`flex flex-row flex-wrap justify-between items-center ${containerStyles}`}
    >
      {Object.keys(avatars).map((avatar) => (
        <Avatar 
          key={avatar}
          avatarName={avatar} 
          selectedAvatar={selectedAvatar} 
          setSelectedAvatar={setSelectedAvatar}
        />
      ))}
    </View>
  );
};

export default AvatarList;