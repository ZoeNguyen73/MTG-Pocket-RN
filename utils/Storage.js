import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cookies } from "react-cookie";

const cookies = new Cookies();

const storage = {
  setItem: async (key, value) => {
    try {
      if (Platform.OS === "web") {
        cookies.set(key, value, { path: "/", secure: true, sameSite: "strict" });
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Failed to set item in storage on platform ${Platform.OS}, ${error}`);
    }

  },

  getItem: async (key) => {
    try {
      if (Platform.OS === "web") {
        return cookies.get(key) || null;
      } else {
        return await AsyncStorage.getItem(value);
      }
    } catch (error) {
      console.error(`Failed to get item from storage on platform ${Platform.OS}, ${error}`);
    }
  },

  removeItem: async (key) => {
    try {
      if (Platform.OS === "web") {
        cookies.remove(key, { path: "/" });
      } else {
        await AsyncStorage.removeItem(value);
      }
    } catch (error) {
      console.error(`Failed to remove item from storage on platform ${Platform.OS}, ${error}`);
    }

  },
};

export default storage;