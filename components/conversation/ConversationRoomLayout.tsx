import { Ionicons } from "@expo/vector-icons";
import React, { useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  Text,
  View,
} from "react-native";
import Clickable from "../common/Clickable";
import MainTextField from "../common/MainTextField";
import UserAvatar from "../common/UserAvatar";

interface ConversationRoomLayoutProps {
  children?: React.ReactNode;
  onSend?: () => void;
}

const ConversationRoomLayout = ({
  children,
  onSend,
}: ConversationRoomLayoutProps) => {
  let listRef = useRef(null);
  return (
    <SafeAreaView className="bg-white flex-1">
      <KeyboardAvoidingView className="flex flex-1" behavior="padding">
        {children}
        <FlatList
          ref={listRef}
          className="flex-1 bg-whiteGrey-200"
          contentContainerClassName="p-4 gap-1"
          keyboardShouldPersistTaps="handled"
          inverted
          data={[
            {
              id: "1",
              message: "Hey, how are you doing?",
              isMe: false,
            },
            {
              id: "2",
              message: "I am good, thanks!",
              isMe: true,
            },
            {
              id: "3",
              message: "What have you been up to?",
              isMe: true,
            },
            {
              id: "13",
              message: "I am doing well. What have you been up to?",
              isMe: false,
            },
            {
              id: "4",
              message: "Just working on some projects. You?",
              isMe: true,
            },
            {
              id: "5",
              message: "Same here, just trying to stay productive.",
              isMe: false,
            },
            {
              id: "6",
              message: "That’s great to hear!",
              isMe: true,
            },
            {
              id: "7",
              message: "Have you watched any good movies lately?",
              isMe: false,
            },
            {
              id: "8",
              message:
                "Yes, I watched a really good one last weekend. How about you?",
              isMe: true,
            },
            {
              id: "9",
              message: "I watched a couple of interesting documentaries.",
              isMe: false,
            },
            {
              id: "10",
              message: "Nice! Any recommendations?",
              isMe: true,
            },
            {
              id: "11",
              message: "Sure, I’ll send you a list later.",
              isMe: false,
            },
            {
              id: "12",
              message: "Awesome, thanks!",
              isMe: true,
            },
          ].reverse()}
          renderItem={(item) =>
            item.item.isMe ? (
              <View className="flex flex-row-reverse gap-2">
                <View className="bg-blue-500 rounded-lg px-4 py-2 items-center max-w-[80%]">
                  <Text className="text-white font-KelsonBold text-lg">
                    {item.item.message}
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
                    {item.item.message}
                  </Text>
                </View>
              </View>
            )
          }
        />
        <View className="flex flex-row items-center gap-2 p-4 bg-white">
          <Clickable className="bg-whiteGrey-300 rounded-full p-3">
            <Ionicons name="add" size={24} />
          </Clickable>
          <View className="flex-1">
            <MainTextField label="Type your message here" type="text" />
          </View>
          <Clickable className="bg-whiteGrey-300 rounded-full p-3">
            <Ionicons name="send" size={24} color="#247cff" />
          </Clickable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConversationRoomLayout;
