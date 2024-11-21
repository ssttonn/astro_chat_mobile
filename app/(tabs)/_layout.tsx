import { Feather, FontAwesome } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";

const TabLayout = () => {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        animation: "shift",
        tabBarActiveTintColor: "#247cff",
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarLabel: "Home",
          tabBarLabelStyle: {
            fontSize: 12,
            fontFamily: "KelsonBold",
          },
          tabBarIcon: ({ focused }) => {
            return (
              <FontAwesome
                name="home"
                size={24}
                color={focused ? "#247cff" : "#71787f"}
              />
            );
          },
        }}
      />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
};

export default TabLayout;
