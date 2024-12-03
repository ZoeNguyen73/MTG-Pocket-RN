import { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";

const AuthContext = createContext({});

export const useAuthContext = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [auth, setAuth] = useState({
    username: "",
    accessToken: "",
    avatar: "",
  })
};

const LogIn = async ({ username, hash }) => {
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