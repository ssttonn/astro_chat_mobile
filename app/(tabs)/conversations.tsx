import { useRecentConversationsStore } from "@/business/store/conversations/recentConversationsStore";
import Clickable from "@/components/common/Clickable";
import UserAvatar from "@/components/common/UserAvatar";
import ConversationItem from "@/components/conversation/ConversationItem";
import ScreenRoutes from "@/constants/ScreenRoutes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const ConversationsScreen = () => {
  const { conversations, status, fetchConversations } =
    useRecentConversationsStore();

  useEffect(() => {
    fetchConversations(false);
  }, [fetchConversations]);

  const onConversationPress = useCallback((conversationId: string) => {
    router.push(ScreenRoutes.chatRoom);
  }, []);

  return (
    <SafeAreaView className="bg-white flex-1">
      <View className="flex flex-row px-4 py-2 justify-between items-center">
        <Text className="text-3xl font-KelsonBold text-dark-600">Messages</Text>
        <Clickable>
          <MaterialCommunityIcons
            name="message-plus"
            size={30}
            color="#247cff"
          />
        </Clickable>
      </View>
      <FlatList
        className="bg-whiteGrey-200 flex-1 w-full"
        ListHeaderComponentClassName="self-stretch"
        contentContainerStyle={{
          display: "flex",
          paddingBottom: 120,
          width: "100%",
          alignItems: "stretch",
          gap: 6,
        }}
        data={conversations.data}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          return (
            <ConversationItem
              conversation={item}
              onPress={onConversationPress}
            />
          );
        }}
        contentContainerClassName="grow-1 w-full items-start"
      />
    </SafeAreaView>
  );
};

export default ConversationsScreen;
