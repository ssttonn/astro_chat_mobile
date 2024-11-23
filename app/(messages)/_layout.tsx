import { View, Text } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const MessageLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="chat-room" />
    </Stack>
  );
};

export default MessageLayout;
