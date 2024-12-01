import { Stack } from "expo-router";
import React from "react";

const MessageLayout = () => {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="conversation-room" />
      <Stack.Screen name="new-conversation" />
    </Stack>
  );
};

export default MessageLayout;
