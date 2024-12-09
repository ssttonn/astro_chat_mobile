import { View, Text } from "react-native";
import React, { memo, useMemo } from "react";
import IMessage, { MessageState } from "@/business/data/models/IMessage";
import UserAvatar from "../common/UserAvatar";
import { ActivityIndicator } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import Clickable from "../common/Clickable";

interface MessageItemProps {
  message: IMessage;
  currentUserId: string;
  isEditing?: boolean;
  onClickMessage?: (message: IMessage) => void;
  onRetrySendMessage?: (message: IMessage) => void;
}

const MessageItem = ({
  message,
  currentUserId,
  onClickMessage,
  onRetrySendMessage,
  isEditing,
}: MessageItemProps) => {
  const isMe = useMemo(() => {
    return message.senderId.id === currentUserId;
  }, [message.senderId.id, currentUserId]);

  if (message.deletedAt) {
    return (
      <View className="flex self-end bg-white border-whiteGrey-500 border-2 rounded-lg px-4 py-2">
        <Text className="text-whiteGrey-700 font-KelsonBold text-lg">
          This message has been deleted
        </Text>
      </View>
    );
  }

  return isMe ? (
    <View className="flex items-end gap-1">
      {message.messageState === MessageState.Error && (
        <Text className="font-KelsonBold color-danger-500">
          Can't send message, tap to retry
        </Text>
      )}
      <View
        key={message.id}
        className="flex flex-row-reverse gap-2 items-center"
      >
        <Clickable
          className={`${message.messageState === MessageState.Sending ? "bg-whiteGrey-700" : "bg-blue-500"} ${isEditing ? "opacity-50" : "opacty-100"} rounded-lg px-4 py-2 items-center max-w-[80%]`}
          onPress={() => {
            if (
              message.messageState === MessageState.Error &&
              onRetrySendMessage
            ) {
              onRetrySendMessage(message);
              return;
            }

            if (message.messageState === MessageState.Sending) {
              return;
            }

            onClickMessage?.(message);
          }}
        >
          <Text className="text-white font-KelsonBold text-lg">
            {message.content}
          </Text>
        </Clickable>
        {message.messageState === MessageState.Error && (
          <MaterialIcons name="error" size={24} color="#F56565" />
        )}
        <ActivityIndicator
          animating={message.messageState === MessageState.Sending}
        />
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
