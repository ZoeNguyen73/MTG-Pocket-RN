import { createContext, useContext, useState, useRef, useMemo } from "react";
import { router } from "expo-router";

import { useClearSession } from "../hooks/useClearSession";
import handleGlobalError from "../utils/ErrorHandler";
import SessionExpiredModal from "../components/Modals/SessionExpiredModal";

const ErrorHandlerContext = createContext();

export const useErrorHandler = () => useContext(ErrorHandlerContext);

export const ErrorHandlerProvider = ({ children }) => {

  const { clearSession } = useClearSession();

  const [sessionExpiredVisible, setSessionExpiredVisible] = useState(false);

  // store the latest proceed callback without re-rendering constantly
  const proceedRef = useRef(null);

  const showSessionExpired = (onProceed) => {
    proceedRef.current = onProceed;
    setSessionExpiredVisible(true);
  };

  const handleProceed = () => {
    setSessionExpiredVisible(false);
    const fn = proceedRef.current;
    proceedRef.current = null;
    fn?.();
  };

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
        showSessionExpired(() => {
          if (sessionExpiredVisible) return;
          clearSession();
          router.replace("/log-in"); // replace is usually better than push here
        });
      } else {
        handleGlobalError(error, handleFormError);
      }

    } catch (error) {
      console.log("error: " + JSON.stringify(error));
      handleGlobalError(error);
    }
  };

  const value = useMemo(() => ({ handleError }), []);

  return (
    <ErrorHandlerContext.Provider value={value}>
      { children }
      <SessionExpiredModal
        visible={sessionExpiredVisible}
        onProceed={handleProceed}
      />
    </ErrorHandlerContext.Provider>
  )

};