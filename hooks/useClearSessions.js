import { useAuthContext } from "../context/AuthProvider";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const useClearSession = () => {
  const { setAuth } = useAuthContext();

  const clearSession = async () => {
    try {
      await AsyncStorage.removeItem("username");
      await AsyncStorage.removeItem("accessToken");
      await AsyncStorage.removeItem("refreshToken");
      await AsyncStorage.removeItem("avatar");
  
      setAuth({
        username: "",
        accessToken: "",
        avatar: "",
      });
    } catch (error) {
      // handleGlobalError(error);
    }
  };
  
  return { clearSession };
};