import { View, Text } from "react-native";
import React, { memo, useMemo } from "react";
import IMessage from "@/business/data/models/IMessage";
import UserAvatar from "../common/UserAvatar";

interface MessageItemProps {
  message: IMessage;
  currentUserId: string;
}

const MessageItem = ({ message, currentUserId }: MessageItemProps) => {
  const isMe = useMemo(() => {
    return message.senderId.id === currentUserId;
  }, [message.senderId.id, currentUserId]);

  return isMe ? (
    <View key={message.id} className="flex flex-row-reverse gap-2">
      <View className="bg-blue-500 rounded-lg px-4 py-2 items-center max-w-[80%]">
        <Text className="text-white font-KelsonBold text-lg">
          {message.content}
        </Text>
      </View>
    </View>
  ) : (
    <View className="flex flex-row p-2 gap-2">
      <UserAvatar
        avatarUrl="https://images.unsplash.com/photo-1731641904795-2873e1da5ac1?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        size={40}
      />
      <View className="bg-white rounded-lg px-4 py-2 items-center max-w-[80%]">
        <Text className="text-dark-600 font-KelsonBold text-lg">
          {message.content}
        </Text>
      </View>
    </View>
  );
};

export default memo(MessageItem);
