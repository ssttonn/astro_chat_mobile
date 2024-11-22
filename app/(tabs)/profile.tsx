import { View, Text, Image } from "react-native";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import Clickable from "@/components/common/Clickable";
import { useSelector } from "react-redux";
import { RootState } from "@/business/store/redux/store";

const ProfileScreen = () => {
  const { currentUser } = useSelector((state: RootState) => state.profile);

  return (
    <View className="items-center bg-white flex-1 shadow-main">
      <SafeAreaView
        className="shadow-main bg-white px-6 pb-2 gap-2"
        edges={["top", "left", "right"]}
      >
        <View className="self-start flex flex-row justify-between items-center">
          <Text className="text-4xl font-KelsonBold mt-4 flex-1">#profile</Text>
          <Clickable className="bg-white rounded-full p-2 shadow-main">
            <Ionicons name="settings" size={24} color={"#247cff"} />
          </Clickable>
        </View>

        <View className="items-center rounded-3xl gap-2">
          <Image
            source={{
              uri: "https://images.unsplash.com/photo-1731466450638-959a6f0d1514?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
            }}
            resizeMode="cover"
            width={150}
            height={150}
            className="rounded-full"
          />
          {currentUser?.username && (
            <Text className="text-2xl font-KelsonBold">
              {`#${currentUser!.username}`}
            </Text>
          )}
        </View>

        <View className="flex flex-row gap-2 p-2">
          <View className="items-center flex-1 ">
            <Text className="text-lg font-KelsonBold text-primary">Posts</Text>
            <Text className="text-lg font-KelsonLight">0</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-lg font-KelsonBold text-primary">
              Followers
            </Text>
            <Text className="text-lg font-KelsonLight">0</Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-lg font-KelsonBold text-primary">
              Followings
            </Text>
            <Text className="text-lg font-KelsonLight">0</Text>
          </View>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;
