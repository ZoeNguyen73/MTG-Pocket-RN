import { Platform } from "react-native";
import { router } from "expo-router";

const refreshApp = () =>{
  if (Platform.OS === "web") {
    window.location.reload(); // true page refresh
  } else {
    router.replace("/"); // reset navigation stack
  }
};

export default refreshApp;