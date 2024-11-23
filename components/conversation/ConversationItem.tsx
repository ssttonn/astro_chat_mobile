import { View, Text } from "react-native";
import React, { memo, useCallback } from "react";
import IConversation from "@/business/data/models/IConversation";
import Clickable from "../common/Clickable";
import UserAvatar from "../common/UserAvatar";

interface ConversationItemProps {
  conversation: IConversation;
  onPress?: (conversationId: string) => void;
}

const ConversationItem = ({ onPress, conversation }: ConversationItemProps) => {
  return (
    <Clickable
      onPress={useCallback(() => {
        onPress?.call(this, conversation.id);
      }, [onPress, conversation.id])}
    >
      <View className="py-2 px-4 bg-white flex flex-row items-center gap-4">
        <UserAvatar
          avatarUrl="https://images.unsplash.com/photo-1731641904795-2873e1da5ac1?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
          size={80}
        />
        <View className="flex flex-col flex-1">
          <Text className="text-xl font-KelsonBold text-dark-500">
            {conversation.name}
          </Text>
          <View className="flex flex-row gap-2">
            <Text numberOfLines={1} className="flex-1 text-lg font-KelsonLight">
              {conversation.lastMessage?.content}
            </Text>
          </View>
        </View>
        <View className="flex items-end gap-1">
          <Text className="text-lg font-KelsonRegular">02:30</Text>
          <View className="bg-red-500 px-2 py-0.5 rounded-lg">
            <Text className="text-center font-KelsonBold text-white">99+</Text>
          </View>
        </View>
      </View>
    </Clickable>
  );
};

export default memo(ConversationItem);
