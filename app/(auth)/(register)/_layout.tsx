import React from "react";

import { Stack } from "expo-router";

const RegisterLayout = () => {
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
