import { Ionicons } from "@expo/vector-icons";
import React, { useEffect, useRef } from "react";
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
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/business/store/redux/store";
import { conversationRoomActions } from "@/business/store/conversations/conversationRoomReducer";
import MessageItem from "./MessageItem";

interface ConversationRoomLayoutProps {
  conversationId?: string;
  children?: React.ReactNode;
  onSend?: () => void;
}

const ConversationRoomLayout = ({
  children,
  onSend,
  conversationId,
}: ConversationRoomLayoutProps) => {
  let listRef = useRef(null);

  const dispatch = useDispatch<AppDispatch>();

  const { messages } = useSelector(
    (state: RootState) => state.conversationRoom
  );

  const { currentUser } = useSelector((state: RootState) => state.profile);

  useEffect(() => {
    if (!conversationId) {
      return;
    }
    dispatch(
      conversationRoomActions.onFetchMessagesAsync(conversationId as string)
    );

    dispatch(conversationRoomActions.listenToSocketEvents(conversationId));

    return () => {
      dispatch(conversationRoomActions.reset());
      dispatch(
        conversationRoomActions.unlistenToSocketEvents(conversationId as string)
      );
    };
  }, [conversationId, dispatch]);

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
          data={messages.data}
          renderItem={(item) => (
            <MessageItem
              message={item.item}
              currentUserId={currentUser?.id ?? ""}
            />
          )}
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
