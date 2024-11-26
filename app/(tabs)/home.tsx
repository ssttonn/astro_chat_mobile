import { realtimeDataActions } from "@/business/store/realtime/realtimeDataReducer";
import { AppDispatch, RootState } from "@/business/store/redux/store";
import Clickable from "@/components/common/Clickable";
import MainTextField from "@/components/common/MainTextField";
import ScreenRoutes from "@/constants/screen_routes";
import useAccessToken from "@/hooks/useAccessToken";
import { FontAwesome } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import {
  Image,
  Keyboard,
  Text,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";
import { io } from "socket.io-client";

const HomeScreen = () => {
  const { connected } = useSelector((state: RootState) => state.realtimeData);
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    console.log("isConnected", connected);
    if (connected) return;
    dispatch(realtimeDataActions.initializeSocket());
  }, [dispatch, connected]);

  const { removeAccessToken } = useAccessToken();
  const onLogout = useCallback(() => {
    removeAccessToken();

    router.replace(ScreenRoutes.login);
  }, [removeAccessToken]);

  return (
    <SafeAreaView className="bg-whiteGrey-300 flex-1">
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View className="flex-1 gap-2">
          <View className="flex flex-row px-4 py-2 justify-between items-center bg-white">
            <Text className="text-lg font-KelsonBold">
              Welcome back, #sstonn
            </Text>
            <Clickable
              onPress={(e) => {
                e.preventDefault();
                router.navigate(ScreenRoutes.profile);
              }}
            >
              <Image
                source={{
                  uri: "https://images.unsplash.com/photo-1731466450638-959a6f0d1514?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                }}
                className="rounded-full w-10 h-10"
              />
              <View className="w-4 h-4 rounded-full absolute right-0 bottom-0 bg-green-500" />
            </Clickable>
          </View>
          <View className="bg-white">
            <View className="py-2 px-4">
              <MainTextField
                label="Search"
                type="text"
                containerClassName="pl-2 p-0 bg-greyWhite-400"
                suffix={
                  <FontAwesome
                    name="search"
                    size={24}
                    color="#247cff"
                    className="p-2"
                  />
                }
              />
            </View>
            {/* <FlatList
              data={[
                { id: 1, name: "John Doe" },
                { id: 2, name: "Jane Doe" },
                { id: 3, name: "John Doe" },
                { id: 4, name: "Jane Doe" },
                { id: 5, name: "John Doe" },
                { id: 6, name: "Jane Doe" },
                { id: 7, name: "John Doe" },
                { id: 8, name: "Jane Doe" },
                { id: 9, name: "John Doe" },
                { id: 10, name: "Jane Doe" },
              ]}
              contentContainerClassName="p-2"
              keyExtractor={(item) => item.id.toString()}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View className="flex items-center gap-2 p-2">
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1731466450638-959a6f0d1514?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }}
                    className="rounded-full w-20 h-20"
                  />
                  <Text className="text-lg font-KelsonBold">{item.name}</Text>
                </View>
              )}
            /> */}
          </View>
        </View>
      </TouchableWithoutFeedback>
    </SafeAreaView>
  );
};

export default HomeScreen;
