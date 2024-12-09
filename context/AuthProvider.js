import { createContext, useState, useEffect, useContext } from "react";

import axios from "../api/axios";
import storage from "../utils/Storage";
import handleGlobalError from "../utils/ErrorHandler";

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
  const { handleError } = useErrorHandler();

  const logIn = async ({ username, hash }) => {
    setIsLoading(true);

    try {
      const response = await axios.post(
        "/auth/login",
        { username, hash },
      );
    
      const { accessToken, refreshToken, avatar } = response.data;
    
      await storage.setItem("username", username);
      await storage.setItem("accessToken", accessToken);
      await storage.setItem("refreshToken", refreshToken);
      await storage.setItem("avatar", avatar);
    
      setAuth({ username, accessToken, avatar });
      setIsLoggedIn(true);
    } catch (error) {
      handleGlobalError(error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const logOut = async () => {
    setIsLoading(true);
  
    try {
      const refreshToken = await storage.getItem("refreshToken");
      await axios.delete(
        "/auth/logout",
        { data: { refreshToken }}
      );
  
      await storage.removeItem("username", username);
      await storage.removeItem("accessToken", accessToken);
      await storage.removeItem("refreshToken", refreshToken);
      await storage.removeItem("avatar", avatar);
  
      setAuth({
        username: "",
        accessToken: "",
        avatar: "",
      });
      setIsLoggedIn(false);
  
    } catch (error) {
      handleGlobalError(error);
    } finally {
      setIsLoading(false);
    }
  };

  const getCurrentUser = async () => {
    setIsLoading(true);

    try {
      const currentUsername = await storage.getItem("username");
      const currentAccessToken = await storage.getItem("accessToken");
      const currentRefreshToken = await storage.getItem("refreshToken");
      const currentAvatar = await storage.getItem("avatar");
  
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
      handleGlobalError(error);

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

