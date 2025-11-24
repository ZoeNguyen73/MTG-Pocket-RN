import React from "react";
import Lottie from "lottie-react";

const LottieAnimation = ({ source, style }) => {
  return <Lottie animationData={source} style={{ width: style?.width, height: style?.height }} />;
};

export default LottieAnimation;