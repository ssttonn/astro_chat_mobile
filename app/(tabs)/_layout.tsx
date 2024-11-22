import { Entypo, Feather, FontAwesome } from "@expo/vector-icons";
import { Href, router, Stack, Tabs } from "expo-router";
import React, { useMemo, useRef, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import Swiper from "react-native-swiper";
import HomeScreen from "./home";
import RecentMessagesScreen from "./recent-messages";
import NotificationsScreen from "./notifications";
import ProfileScreen from "./profile";

enum TabRoutes {
  home = "home",
  recentMessages = "recent-messages",
  notifications = "notifications",
  profile = "profile",
}

const TabLayout = () => {
  const [currentTab, setCurrentTab] = useState(TabRoutes.home);

  const tabs = useMemo(
    () => [
      {
        id: 0,
        name: TabRoutes.home,
        icon: (
          <FontAwesome
            name={"home"}
            size={30}
            color={currentTab === TabRoutes.home ? "white" : "#4b5057"}
          />
        ),
        screen: <HomeScreen key={0} />,
      },
      {
        id: 1,
        name: TabRoutes.recentMessages,
        icon: (
          <Feather
            name={"message-circle"}
            size={30}
            color={
              currentTab === TabRoutes.recentMessages ? "white" : "#4b5057"
            }
          />
        ),
        screen: <RecentMessagesScreen key={1} />,
      },
      {
        id: 2,
        name: TabRoutes.notifications,
        icon: (
          <FontAwesome
            name={"bell"}
            size={30}
            color={currentTab === TabRoutes.notifications ? "white" : "#4b5057"}
          />
        ),
        screen: <NotificationsScreen key={2} />,
      },
      {
        id: 3,
        name: TabRoutes.profile,
        icon: (
          <FontAwesome
            name={"user"}
            size={30}
            color={currentTab === TabRoutes.profile ? "white" : "#4b5057"}
          />
        ),
        screen: <ProfileScreen key={3} />,
      },
    ],
    [currentTab],
  );

  return (
    <>
      <Tabs
        screenOptions={{
          headerShown: false,
          animation: "shift",
          tabBarStyle: {
            display: "none",
          },
        }}
      >
        <Tabs.Screen name={TabRoutes.home} />
        <Tabs.Screen name={TabRoutes.recentMessages} />
        <Tabs.Screen name={TabRoutes.notifications} />
        <Tabs.Screen name={TabRoutes.profile} />
      </Tabs>
      <View className="absolute flex flex-row gap-4 px-3 bottom-10 left-[50%] transform -translate-x-1/2 bg-white shadow-main rounded-full py-3">
        {tabs.map((tab) => (
          <TouchableOpacity
            key={tab.name}
            onPress={(_) => {
              setCurrentTab(tab.name);
              router.navigate(`/${tab.name}` as Href);
            }}
          >
            <View
              className={`${currentTab === tab.name ? "bg-primary" : "bg-whiteGrey-200"} aspect-square rounded-full p-4 justify-center items-center`}
            >
              {tab.icon}
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );
};

export default TabLayout;
