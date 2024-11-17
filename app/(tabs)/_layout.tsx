import React from "react";
import { Stack } from "expo-router";

const TabLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="home" />
    </Stack>
  );
};

export default TabLayout;
