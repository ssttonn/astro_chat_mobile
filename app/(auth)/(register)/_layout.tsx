import React, { useEffect } from "react";
import {
  RegisterStep,
  useRegisterStore,
} from "@/business/store/auth/registerStore";
import Toast from "react-native-toast-message";
import { router, Stack } from "expo-router";

const RegisterLayout = () => {
  const { errorMessage, reset, setErrorMessage, step } = useRegisterStore();

  useEffect(() => {
    return () => {
      reset();
    };
  }, [reset]);

  useEffect(() => {
    if (errorMessage) {
      Toast.show({
        type: "error",
        text2: errorMessage,
      });
      setErrorMessage(undefined);
    }
  }, [errorMessage, setErrorMessage]);

  useEffect(() => {
    switch (step) {
      case RegisterStep.registerEmail:
        break;
      case RegisterStep.verifyOTP:
        Toast.show({
          type: "success",
          text2: "OTP sent to your email",
        });
        router.push("/verify-register-otp");
        break;
    }
  }, [step]);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="register" />
      <Stack.Screen name="submit-register-info" />
      <Stack.Screen name="verify-register-otp" />
    </Stack>
  );
};

export default RegisterLayout;
