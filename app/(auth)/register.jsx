import { View, ScrollView, Keyboard } from "react-native";
import { useState } from "react";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { useThemeContext } from "../../context/ThemeProvider";
import { useAuthContext } from "../../context/AuthProvider";
import { useErrorHandler } from "../../context/ErrorHandlerProvider";

import Text from "../../components/CustomText/CustomText";
import Button from "../../components/CustomButton/CustomButton";
import FormField from "../../components/CustomForm/FormField";
import MessageBox from "../../components/MessageBox";

import axios from "../../api/axios";

const Register = () => {
  const { theme } = useThemeContext();
  const { handleError } = useErrorHandler();

  const { auth, logOut, isLoggedIn, isLoading } = useAuthContext();
  
  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
    confirm_password: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [showSuccessMessage, setShowSuccessMessage] = useState(false);
  const [activationToken, setActivationToken] = useState("");

  retun (
    <>
      <SafeAreaView className="bg-light-background dark:bg-dark-background h-full">
        <ScrollView>

          <View
            className="w-full justify-center px-8 my-6"
          >
            <Text>Sign up for free</Text>
          </View>

        </ScrollView>
      </SafeAreaView>
      { isSubmitting && (<LoadingSpinner />) }
    </>
  )

};

export default Register;