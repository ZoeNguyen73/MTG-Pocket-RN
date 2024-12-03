import { Alert } from "react-native";

const handleGlobalError = (error, handleFormError) => {
  if (error.response) {
    const errorMessage = error.response.data.message || "An error occurred";
    let errorDetails = error.response.data.details || "Please try again.";
    if (typeof(errorDetails) !== "string") {
      errorDetails = "Please try again.";
    }

    // for errors related to forms
    if (handleFormError 
      && (error.response.status === 400 || error.response.status === 401)
    ) {
      if (errorDetails.includes("username")) {
        handleFormError(errorDetails, "username");
      } else if (errorDetails.includes("email")) {
        handleFormError(errorDetails, "email");
      } else if (errorDetails.includes("hash")) {
        errorDetails.replace("hash", "password");
        handleFormError(errorDetails, "password");
      } else {
        Alert.alert(errorMessage, errorDetails);
      }
    } else {
      Alert.alert(errorMessage, errorDetails);
    }

  } else if (error.request) {
    console.log("error.request: " + error.request);
    Alert.alert("No response from server", "Please check your internet connection and try again.");
  
  } else {
    console.log("other error");
    console.log("error: " + JSON.stringify(error));
    Alert.alert("Error", error.message);
  }
};

export default handleGlobalError;