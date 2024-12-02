import { conversationChatActions } from "@/business/store/conversations/conversationChatReducer";
import { conversationMessagesActions } from "@/business/store/conversations/conversationMessagesReducer";
import { AppDispatch, RootState } from "@/business/store/redux/store";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Clickable from "../common/Clickable";
import MainTextField from "../common/MainTextField";
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
    (state: RootState) => state.conversationMessages
  );

  const { currentUser } = useSelector((state: RootState) => state.profile);
  const { conversation } = useSelector(
    (state: RootState) => state.conversationRoom
  );

  const { inputMessage } = useSelector(
    (state: RootState) => state.conversationChat
  );

  useEffect(() => {
    if (!conversationId) {
      return;
    }
    dispatch(
      conversationMessagesActions.onFetchMessagesAsync(conversationId as string)
    );

    return () => {
      dispatch(conversationMessagesActions.reset());
    };
  }, [conversationId, dispatch]);

  const memberIds = useMemo(() => {
    return conversation?.members
      .map((member) => member.id)
      .filter((id) => id !== currentUser?.id);
  }, [conversation, currentUser]);

  const onSendMessage = useCallback(() => {
    if (!memberIds) return;
    dispatch(
      conversationChatActions.onSendMessage({
        receiverIds: memberIds,
        content: inputMessage,
      })
    );
  }, [dispatch, inputMessage, memberIds]);

  const onChangeMessageInput = useCallback(
    (text: string) => {
      dispatch(conversationChatActions.setInputMessage(text));
    },
    [dispatch]
  );

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
            <MainTextField
              label="Type your message here"
              type="text"
              value={inputMessage}
              onChangeText={onChangeMessageInput}
            />
          </View>
          <Clickable
            className="bg-whiteGrey-300 rounded-full p-3"
            onPress={onSendMessage}
          >
            <Ionicons name="send" size={24} color="#247cff" />
          </Clickable>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConversationRoomLayout;
