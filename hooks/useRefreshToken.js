import { useEffect, useRef } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import { useAuthContext } from "../context/AuthProvider";
import handleGlobalError from "../utils/ErrorHandler";
import axios from "../api/axios";

const useRefreshToken = () => {
  const { setAuth } = useAuthContext();
  const refreshTokenRef = useRef("");

  useEffect(() => {
    const getRefreshToken = async () => {
      try {
        const token = await AsyncStorage.getItem("refreshToken");
        refreshTokenRef.current = token;
      } catch (error) {
        handleGlobalError(error);
      }
    };

    getRefreshToken();
  }, []);

  const refresh = async () => {
    const refreshToken = refreshTokenRef.current;
    const response = await axios.post(
      "/auth/refresh",
      { refreshToken }
    );

    const newAccessToken = response.data.accessToken;
    setAuth(prev => {
      return {...prev, accessToken: newAccessToken};
    });
    await AsyncStorage.setItem("accessToken", newAccessToken);
  };

  return refresh;
};

export default useRefreshToken;