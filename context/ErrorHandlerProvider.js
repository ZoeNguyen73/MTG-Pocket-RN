import { createContext, useContext } from "react";
import { router } from "expo-router";
import { Alert } from "react-native";

import { useClearSession } from "../hooks/useClearSession";
import handleGlobalError from "../utils/ErrorHandler";

const ErrorHandlerContext = createContext();

export const useErrorHandler = () => useContext(ErrorHandlerContext);

export const ErrorHandlerProvider = ({ children }) => {

  const { clearSession } = useClearSession();

  const handleError = async (error, handleFormError) => {
    if (error.response) console.log("error response received: " + JSON.stringify(error.response?.data));
    if (error.request) console.log("error request received: " + JSON.stringify(error.request?.data));

    try {

      // handle session expired i.e. refresh token already expired
      if (error.response
        && error.response.data.details === "Unable to verify refresh token"
        && error.response.data.name === "TokenExpiredError"
      ) {
        console.log("Error Trigger: Refresh Token expired.");
        Alert.alert("Session expired", "Please log in again to continue", [
          {
            text: "Proceed to log in",
            onPress: () => {
              clearSession();
              // router.push("/sign-in");
            }
          }
        ]);
      } else {
        handleGlobalError(error, handleFormError);
      }

    } catch (error) {
      console.log("error: " + JSON.stringify(error));
      handleGlobalError(error);
    }
  };

  return (
    <ErrorHandlerContext.Provider value={{ handleError }}>
      { children }
    </ErrorHandlerContext.Provider>
  )

};