import { useAuthContext } from "../context/AuthProvider";
import handleGlobalError from "../utils/ErrorHandler";

import storage from "../utils/Storage";

export const useClearSession = () => {
  const { setAuth } = useAuthContext();

  const clearSession = async () => {
    try {
      await storage.removeItem("username");
      await storage.removeItem("accessToken");
      await storage.removeItem("refreshToken");
      await storage.removeItem("avatar");
  
      setAuth({
        username: "",
        accessToken: "",
        avatar: "",
      });
    } catch (error) {
      handleGlobalError(error);
    }
  };
  
  return { clearSession };
};