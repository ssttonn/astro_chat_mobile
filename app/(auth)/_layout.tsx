import { Stack } from "expo-router";
import React from "react";

const AuthLayout = () => {
  return (
    <Stack
      initialRouteName="(login)/login"
      screenOptions={{ headerShown: false }}
    >
      <Stack.Screen name="(login)/login" />
      <Stack.Screen name="(register)" />
    </Stack>
  );
};

export default AuthLayout;
