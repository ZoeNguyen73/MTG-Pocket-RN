import { View, StyleSheet } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";

const LoadingSpinner = () => {

  return (
    <View style={styles.container}>
      <LottieView 
        source={require("./../assets/lottie-files/loading.json")}
        autoPlay
        loop
        style={styles.lottie}
      />
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
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.4)",
    zIndex: 100,
  },
  lottie: {
    width: 250,
    height: 250
  }
});

export default LoadingSpinner;