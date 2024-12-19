import React, { useEffect, useState, useRef } from "react";
import { View, StyleSheet, Animated } from "react-native";
import { SvgXml } from "react-native-svg";

import { generateSparkle } from "../utils/GenerateSparkle";

const DEFAULT_COLOR = "rgb(255, 255, 255)";

const SparkleInstance = ({ color, size, style }) => {
  const scaleAnim = useRef(new Animated.Value(0)).current;
  const rotateAnim = useRef(new Animated.Value(0)).current;

  const xml = `
    <svg
      width="${size}"
      height="${size}"
      fill="none"
      viewBox="0 0 160 160"
    >
      <path
        fill="${color}"
        d="M80 0s4.285 41.293 21.496 58.504S160 80 160 80s-41.293 4.285-58.504 21.496S80 160 80 160s-4.285-41.293-21.496-58.504S0 80 0 80s41.293-4.285 58.504-21.496S80 0 80 0"
      ></path>
    </svg>
  `;

  useEffect(() => {
    // Scale animation (grow and shrink)
    Animated.timing(scaleAnim, {
      toValue: 1,
      duration: 2000,
      useNativeDriver: true,
    }).start();

    // Rotation animation
    Animated.loop(
      Animated.timing(rotateAnim, {
        toValue: 1,
        duration: 2000,
        useNativeDriver: true,
      })
    ).start();
  }, []);

  // Interpolate rotation value
  const spin = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "180deg"],
  });

  return (
    <Animated.View
      style={[
        styles.sparkle,
        {
          transform: [{ scale: scaleAnim }, { rotate: spin }],
          width: size,
          height: size,
        },
        style,
      ]}
    >
      <SvgXml xml={xml} width="100%" height="100%" />
    </Animated.View>  
  )
};

const Sparkles= ({ color = DEFAULT_COLOR }) => {
  const [ sparkles, setSparkles ] = useState([]);

  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      const sparkle = generateSparkle(DEFAULT_COLOR);

      setSparkles((prevSparkles) => {
        // Clean up expired sparkles
        const filteredSparkles = prevSparkles.filter((sparkle) => {
          const delta = now - sparkle.createdAt;
          return delta < 2000;
        });
  
        return [...filteredSparkles, sparkle];
      });
    }, 200);

    return () => clearInterval(interval);
  }, [color]);

  return (
    <View style={styles.container}>
      {sparkles.map(sparkle => (
        <SparkleInstance
          key={sparkle.id} 
          color={sparkle.color}
          size={sparkle.size}
          style={sparkle.style}
        />
      ))}
    </View>
    
  )
};

const styles = StyleSheet.create({
  container: {
    position: "absolute",
    width: "100%",
    height: "100%",
    pointerEvents: "none",
  },
  sparkle: {
    position: "absolute", 
  },
});

module.exports = Sparkles;