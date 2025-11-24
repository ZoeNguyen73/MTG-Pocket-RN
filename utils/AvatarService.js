import handleGlobalError from "./ErrorHandler";
import storage from "./Storage";

export const updateAvatar = async (axiosPrivate, username, newAvatar, setAuth) => {
  try {
    const response = await axiosPrivate.put(
      `/users/${username}`,
      { avatar: newAvatar }
    );

    await storage.setItem("avatar", newAvatar);

    setAuth(prev => {
      return {...prev, avatar: newAvatar}
    });
    
    return response.data;
  } catch (error) {
    handleGlobalError(error);
  }
};