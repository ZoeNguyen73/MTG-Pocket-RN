import React from "react";
import LottieView from "lottie-react-native";

const LottieAnimation = ({ source, style }) => {
  return <LottieView source={source} autoPlay loop style={style} />;
};

export default LottieAnimation;