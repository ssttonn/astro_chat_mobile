import { Entypo } from "@expo/vector-icons";
import React, { useState } from "react";
import { Image, Text, TouchableWithoutFeedback, View } from "react-native";
import Clickable from "../common/Clickable";
import UserAvatar from "../common/UserAvatar";

function ActivityItem() {
  const [isUtilsPopVisible, setUtilPopVisible] = useState(false);

  return (
    <TouchableWithoutFeedback
      onPress={() => {
        setUtilPopVisible(false);
      }}
    >
      <View className="bg-white p-4 mt-4 gap-2">
        <View
          className={`absolute flex flex-col p-4 z-10 right-3 top-10 bg-white rounded-2xl shadow-main ${isUtilsPopVisible ? "opacity-1 pointer-events-auto" : "opacity-0 pointer-events-none"}`}
        >
          {/* <Clickable onPress={() => {}}>
          <Text className="text-lg font-KelsonRegular text-dark-500 p-2">
            Edit
          </Text>
        </Clickable> */}
          <Clickable className="flex flex-row items-center" onPress={() => {}}>
            <Text className="text-lg grow-1 font-KelsonBold text-red-400 p-2">
              Delete
            </Text>
            <Entypo name="trash" size={24} color="#FC8181" />
          </Clickable>
        </View>
        <View className="flex flex-row items-center">
          <Clickable className="flex-1" onPress={() => {}}>
            <View className="flex flex-row items-center">
              <UserAvatar
                size={60}
                avatarUrl="https://images.unsplash.com/photo-1731466450638-959a6f0d1514?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                className="mr-2"
              />
              <View className="justify-center">
                <Text className="text-lg font-KelsonBold text-primary">
                  Phan Nguyễn Song Toàn
                </Text>
                <Text className="text-lg font-KelsonRegular text-dark-500">
                  @username
                </Text>
              </View>
            </View>
          </Clickable>
          <Clickable
            className="w-30 h-30"
            onPress={() => {
              setUtilPopVisible(!isUtilsPopVisible);
            }}
          >
            <Entypo name="dots-three-vertical" size={24} color="black" />
          </Clickable>
        </View>
        <Text className="text-lg font-KelsonLight">
          Description of the activity
        </Text>
        <Image
          source={{
            uri: "https://images.unsplash.com/photo-1731688687812-db09e24f2384?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
          }}
          resizeMode="cover"
          className="w-full h-[200px] rounded-xl"
        />
      </View>
    </TouchableWithoutFeedback>
  );
}

export default ActivityItem;
