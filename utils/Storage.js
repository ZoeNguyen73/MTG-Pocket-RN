import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Cookies } from "react-cookie";

const cookies = new Cookies();
const isWeb = Platform.OS === "web";
const isHttps = typeof window !== "undefined" && window.location.protocol === "https:";

const storage = {
  setItem: async (key, value) => {
    try {
      const strValue = typeof value === "string" ? value : JSON.stringify(value);

      if (isWeb) {
        cookies.set(key, strValue, {
          path: "/",
          sameSite: "lax",
          secure: isHttps, // IMPORTANT: false on http://localhost
        });
      } else {
        await AsyncStorage.setItem(key, value);
      }
    } catch (error) {
      console.error(`Failed to set item in storage on platform ${Platform.OS}, ${error}`);
    }

  },

  getItem: async (key) => {
    try {
      if (isWeb) return cookies.get(key) ?? null;
      return await AsyncStorage.getItem(key);
    } catch (error) {
      console.error(`Failed to get item from storage on platform ${Platform.OS}, ${error}`);
    }
  },

  removeItem: async (key) => {
    try {
      if (isWeb) cookies.remove(key, { path: "/" });
      else await AsyncStorage.removeItem(key);
    } catch (error) {
      console.error(`Failed to remove item from storage on platform ${Platform.OS}, ${error}`);
    }

  },
};

export default storage;