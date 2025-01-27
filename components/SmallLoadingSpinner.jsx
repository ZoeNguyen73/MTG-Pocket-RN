import { View, StyleSheet } from "react-native";
import React from "react";

import LottieAnimation from "./Lottie/LottieAnimation";

const SmallLoadingSpinner = () => {

  return (
    <View style={styles.container}>
      <LottieAnimation
        source={require("../assets/lottie-files/rolling.json")}
        style={styles.lottie}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
  },
  lottie: {
    width: 22,
    height: 22,
  }
});

export default SmallLoadingSpinner;