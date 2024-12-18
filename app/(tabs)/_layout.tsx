import { profileActions } from "@/business/store/profile/profileReducer";
import { AppDispatch } from "@/business/store/redux/store";
import { Feather, FontAwesome, Ionicons } from "@expo/vector-icons";
import { Href, router, Tabs } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import { TouchableOpacity, View } from "react-native";
import { useDispatch } from "react-redux";
import HomeScreen from "./home";
import NotificationsScreen from "./notifications";
import ProfileScreen from "./profile";
import ConversationsScreen from "./conversations";

enum TabRoutes {
  home = "home",
  recentMessages = "conversations",
  notifications = "notifications",
  profile = "profile",
}

const TabLayout = () => {
  const [currentTab, setCurrentTab] = useState(TabRoutes.home);
  const dispatch = useDispatch<AppDispatch>();

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
          <Ionicons
            name={"chatbubbles"}
            size={30}
            color={
              currentTab === TabRoutes.recentMessages ? "white" : "#4b5057"
            }
          />
        ),
        screen: <ConversationsScreen key={1} />,
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

  useEffect(() => {
    dispatch(profileActions.getCurrentProfile());
  }, [dispatch]);

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
