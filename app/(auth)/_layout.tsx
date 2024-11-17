import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack initialRouteName="login" screenOptions={{ headerShown: false }}>
      <Stack.Screen name="login" />
      <Stack.Screen name="register" />
      <Stack.Screen name="verify-register-otp" />
      <Stack.Screen name="submit-register-info" />
      <Stack.Screen name="forgot-password" />
      <Stack.Screen name="reset-password" />
    </Stack>
  );
};

export default AuthLayout;
