import React, { useEffect, useMemo, useState } from "react";
import { View, Text, StyleSheet, Platform } from "react-native";

import LottieAnimation from "../Lottie/LottieAnimation";

import useDeviceLayout from "../../hooks/useDeviceLayout";

const DEFAULT_MESSAGES = [
  "Waiting for priority...",
  "Resolving the stack...",
  "Fetching lands...",
  "Searching the library...",
  "Declaring attackers…",
  "Walking through the planes...",
];

const LoadingSpinnerWithMessages = ({
  messages = DEFAULT_MESSAGES,
  intervalMs = 3500,
  showColdStartHint = true,
}) => {
  const isWeb = Platform.OS === "web";
  const { width } = useDeviceLayout;

  // Ensure messages array is stable
  const messageList = useMemo(
    () => (messages?.length ? messages : DEFAULT_MESSAGES),
    [messages]
  );

  const [messageIndex, setMessageIndex] = useState(0);

  useEffect(() => {
    if (messageList.length <= 1) return;

    const id = setInterval(() => {
      setMessageIndex((prev) => (prev + 1) % messageList.length);
    }, intervalMs);

    return () => clearInterval(id);
  }, [messageList, intervalMs]);

  return (
    <View style={styles.container}>
      <LottieAnimation
        source={require("../../assets/lottie-files/loading.json")}
        style={styles.lottie}
      />

      {/* Rotating status message */}
      <Text 
        className={`text-center text-dark-text font-sans-semibold tracking-wide ${width < 400 ? "text-base" : "text-lg"}`}
        style={{ marginTop: -10, maxWidth: 320 }}
      >
        {messageList[messageIndex]}
      </Text>

      {showColdStartHint && (
        <Text
          className={`text-center text-dark-text font-sans tracking-wide ${width < 400 ? "text-sm" : "text-base"}`}
          style={{marginTop: 6, opacity: 0.8 }}
        >
          First load may take a moment while the server wakes up.
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 100,
  },
  lottie: {
    width: 250,
    height: 250,
  },
  messageText: {
    marginTop: -10, // pulls text closer to animation
    textAlign: "center",
    maxWidth: 320,
    opacity: 0.9,
    fontSize: 14,
  },
  hintText: {
    marginTop: 6,
    textAlign: "center",
    maxWidth: 320,
    opacity: 0.65,
    fontSize: 12,
  },
});

export default LoadingSpinnerWithMessages;