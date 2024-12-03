import { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

import axios from "../api/axios";

const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState({
    username: "",
    accessToken: "",
    avatar: "",
  });

  const logIn = async ({ username, hash }) => {
    setIsLoading(true);
  
    const response = await axios.post(
      "/auth/login",
      { username, hash },
    );
  
    const { accessToken, refreshToken, avatar } = response.data;
  
    await AsyncStorage.setItem("username", username);
    await AsyncStorage.setItem("accessToken", accessToken);
    await AsyncStorage.setItem("refreshToken", refreshToken);
    await AsyncStorage.setItem("avatar", avatar);
  
    setAuth({ username, accessToken, avatar });
    setIsLoggedIn(true);
  
    setIsLoading(false);
  };
  
  const logOut = async () => {
    setIsLoading(true);
  
    try {
      const refreshToken = await AsyncStorage.getItem("refreshToken");
      await axios.delete(
        "/auth/logout",
        { data: { refreshToken }}
      );
  
      await AsyncStorage.removeItem("username", username);
      await AsyncStorage.removeItem("accessToken", accessToken);
      await AsyncStorage.removeItem("refreshToken", refreshToken);
      await AsyncStorage.removeItem("avatar", avatar);
  
      setAuth({
        username: "",
        accessToken: "",
        avatar: "",
      });
      setIsLoggedIn(false);
  
    } catch (error) {
      // handle error
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    setIsLoading(true);

    try {
      const currentUsername = await AsyncStorage.getItem("username");
      const currentAccessToken = await AsyncStorage.getItem("accessToken");
      const currentRefreshToken = await AsyncStorage.getItem("refreshToken");
      const currentAvatar = await AsyncStorage.getItem("avatar");
  
      if (!currentUsername || !currentAccessToken || !currentRefreshToken || !currentAvatar) {
        setAuth({
          username: "",
          accessToken: "",
          avatar: "",
        });
        setIsLoading(false);
        setIsLoggedIn(false);
        return;
      }
  
      setAuth({
        username: currentUsername,
        accessToken: currentAccessToken,
        avatar: currentAvatar,
      });

      setIsLoggedIn(true);

    } catch (error) {
      setIsLoggedIn(false);
      //handle error

    } finally {
      setIsLoading(false);
    }

    useEffect(() => {
      getCurrentUser();
    }, [])
  };
  
  return (
    <AuthContext.Provider value={{ logIn, logOut, setAuth, auth, isLoggedIn, setIsLoggedIn, isLoading }}>
      {children}
    </AuthContext.Provider>
  )

};

export default AuthContext;

