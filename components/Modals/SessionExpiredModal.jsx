import { View, Text, Pressable } from "react-native";

import Button from "../CustomButton/CustomButton";

const SessionExpiredModal = ({ visible, onProceed }) => {
  if (!visible) return null;

  return (
    <View
      style={{
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 99999,
        elevation: 99999, // for android
        justifyContent: "center",
        alignItems: "center",
      }}
      pointerEvents="auto" // ensure touches don't leak to underlying UI on web
    >

      {/* Backdrop: blocks all interaction */}
      <Pressable
        onPress={() => {}}
        style={{
          position: "absolute",
          top: 0,
          bottom: 0,
          left: 0,
          right: 0,
          backgroundColor: "rgba(0,0,0,0.75)",
        }}
      />

      {/* Modal card */}
      <View
        style={{
          width: "90%",
          maxWidth: 420,
          borderRadius: 20,
          padding: 18,
          backgroundColor: "rgba(22, 26, 33, 0.95)",
          flexDirection: "column",
          gap: 10,
          alignItems: "center"
        }}
      >
        <Text className="font-sans-bold tracking-wider text-dark-yellow text-2xl">
          Session expired
        </Text>
        <Text className="font-sans tracking-wider text-dark-text text-base">
          Please log in again to continue.
        </Text>

        <Button 
          title={"Go to log in"}
          handlePress={onProceed}
          containerStyles="mt-10 w-[120]"
        />

      </View>

    </View>
  )
};

export default SessionExpiredModal;