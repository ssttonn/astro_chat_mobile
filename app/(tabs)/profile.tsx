import { RootState } from "@/business/store/redux/store";
import ActivityItem from "@/components/activity/ActivityItem";
import Clickable from "@/components/common/Clickable";
import UserAvatar from "@/components/common/UserAvatar";
import React from "react";
import { FlatList, Image, Text, View } from "react-native";
import { useSelector } from "react-redux";

const ProfileScreen = () => {
  const { currentUser } = useSelector((state: RootState) => state.profile);

  return (
    <>
      {/* <View className="flex flex-row justify-between items-center px-4 py-2">
        <Text className="text-3xl font-KelsonBold text-dark-600">Profile</Text>
        <Clickable onPress={() => {}}>
          <Entypo name="dots-three-vertical" size={26} color={"#4b5057"} />
        </Clickable>
      </View> */}
      <FlatList
        className="bg-whiteGrey-200 flex-1 w-full"
        ListHeaderComponentClassName="self-stretch"
        contentContainerStyle={{
          display: "flex",
          paddingBottom: 120,
          width: "100%",
          alignItems: "stretch",
        }}
        // alwaysBounceVertical={false}
        data={[
          {
            id: 1,
          },
          {
            id: 2,
          },
          {
            id: 3,
          },
          {
            id: 4,
          },
          {
            id: 5,
          },
          {
            id: 6,
          },
          {
            id: 7,
          },
          {
            id: 8,
          },
        ]}
        keyExtractor={(_, index) => index.toString()}
        renderItem={({ item }) => <ActivityItem />}
        contentContainerClassName="grow-1 w-full items-start"
        ListHeaderComponent={() => {
          return (
            <>
              <View className="pb-6 gap-2 bg-white">
                <View className="h-[200px] mb-[50px]">
                  <Image
                    source={{
                      uri: "https://images.unsplash.com/photo-1731762512307-2271665eb149?q=80&w=2084&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
                    }}
                    resizeMode="cover"
                    className="w-full h-full"
                  />
                  <UserAvatar
                    avatarUrl="https://images.unsplash.com/photo-1731466450638-959a6f0d1514?q=80&w=1750&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                    size={100}
                    className="-bottom-[50px] ml-6 absolute"
                  />
                </View>

                <View className="ml-6">
                  <Text className="text-2xl font-KelsonBold text-dark-600">
                    Phan Nguyễn Song Toàn
                  </Text>
                  <Text className="text-lg font-KelsonRegular text-dark-600">
                    #{currentUser?.email}
                  </Text>
                  <Text className="text-lg font-KelsonRegular text-dark-500 mt-2">
                    Life-long learner, software engineer, and entrepreneur
                  </Text>
                </View>
              </View>
              {/* <View className="my-2 flex flex-row justify-between">
                <Text className="text-lg font-KelsonBold text-dark-600 px-6">
                  Recent Activities
                </Text>
                <Clickable>
                  <Text className="text-lg font-KelsonBold text-primary px-6">
                    See all
                  </Text>
                </Clickable>
              </View> */}
            </>
          );
        }}
      />
    </>
  );
};

export default ProfileScreen;
