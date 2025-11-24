import { View, Text } from "react-native";
import React from "react";

const MessageBox = ({content, type, containerStyles}) => {
  let backgroundColor = "";
  let textColor = "";

  if (type === "success") {
    backgroundColor = "bg-dark-success";
    textColor = "text-light-success";
  } else if (type === "error") {
    backgroundColor = "bg-dark-error";
    textColor = "text-light-error";
  } else if (type === "warning") {
    backgroundColor = "bg-dark-warning";
    textColor = "text-light-warning";
  } else {
    backgroundColor = "bg-dark-generic";
    textColor = "text-light-generic";
  }
  
  return (
    <View
      className={` 
        ${backgroundColor} justify-center items-center px-2 py-2 w-full rounded-sm
        ${containerStyles}
      `}
    >
      <Text
        className={`
          ${textColor} font-sans-semibold text-sm
        `}
      >
        {content}
      </Text>
    </View>
  )
};

export default MessageBox;