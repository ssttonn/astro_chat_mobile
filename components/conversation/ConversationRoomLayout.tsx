import {
  conversationChatActions,
  ConversationChatStatus,
} from "@/business/store/conversations/conversationChatReducer";
import { conversationMessagesActions } from "@/business/store/conversations/conversationMessagesReducer";
import { AppDispatch, RootState } from "@/business/store/redux/store";
import { Ionicons } from "@expo/vector-icons";
import React, { useCallback, useEffect, useMemo, useRef } from "react";
import {
  FlatList,
  KeyboardAvoidingView,
  SafeAreaView,
  View,
  Text,
} from "react-native";
import { useDispatch, useSelector } from "react-redux";
import Clickable from "../common/Clickable";
import MainTextField from "../common/MainTextField";
import MessageItem from "./MessageItem";
import IMessage from "@/business/data/models/IMessage";
import { useActionSheet } from "@expo/react-native-action-sheet";

enum MessageAction {
  edit,
  delete,
  reply,
}

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
  let listRef = useRef<any>(null);

  const dispatch = useDispatch<AppDispatch>();
  const { showActionSheetWithOptions } = useActionSheet();

  const { messages } = useSelector(
    (state: RootState) => state.conversationMessages
  );

  const { currentUser } = useSelector((state: RootState) => state.profile);
  const { conversation } = useSelector(
    (state: RootState) => state.conversationRoom
  );

  const { inputMessage, status, editingMessageId } = useSelector(
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
      dispatch(conversationChatActions.reset());
    };
  }, [conversationId, dispatch]);

  const memberIds = useMemo(() => {
    return conversation?.members
      .map((member) => member.id)
      .filter((id) => id !== currentUser?.id);
  }, [conversation, currentUser]);

  const onClickSendMessage = useCallback(() => {
    if (!memberIds || !currentUser) return;

    if (editingMessageId) {
      dispatch(
        conversationChatActions.onEditMessage({
          content: inputMessage,
          messageId: editingMessageId,
        })
      );
      return;
    }

    dispatch(
      conversationChatActions.onSendMessage({
        currentUser: currentUser,
        conversationId: conversationId as string,
        receiverIds: memberIds,
        content: inputMessage,
      })
    );
  }, [
    dispatch,
    inputMessage,
    memberIds,
    conversationId,
    currentUser,
    editingMessageId,
  ]);

  const onRetrySendMessage = useCallback(
    (message: IMessage) => {
      if (!memberIds || !currentUser) return;
      dispatch(
        conversationChatActions.onRetryToSendMessage({
          trackingId: message.id,
          currentUser: currentUser,
          conversationId: message.conversationId,
          receiverIds: memberIds,
          content: message.content,
        })
      );
    },
    [dispatch, memberIds, currentUser]
  );

  const onClickMessage = useCallback(
    (message: IMessage) => {
      console.log("Clicked message", message);
      showActionSheetWithOptions(
        {
          options: ["Edit", "Delete", "Cancel"],
          cancelButtonIndex: 3,
          destructiveButtonIndex: 1,
        },
        (buttonIndex) => {
          switch (buttonIndex) {
            case MessageAction.edit:
              dispatch(
                conversationChatActions.setEditingMessage({
                  messageId: message.id,
                  content: message.content,
                })
              );
              break;
            case MessageAction.delete:
              dispatch(conversationChatActions.onDeleteMessage(message.id));
              break;
            default:
              break;
          }
        }
      );
    },
    [showActionSheetWithOptions, dispatch]
  );

  const onChangeMessageInput = useCallback(
    (text: string) => {
      dispatch(conversationChatActions.setInputMessage(text));
    },
    [dispatch]
  );

  const isSendButtonEnabled = useMemo(() => {
    return inputMessage && status === ConversationChatStatus.IDLE;
  }, [inputMessage, status]);

  useEffect(() => {
    let index = messages.data.findIndex(
      (message) => message.id === editingMessageId
    );

    if (index === -1) {
      return;
    }
    listRef?.current.scrollToIndex({ animated: true, index: index });
  }, [editingMessageId, messages]);

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
          onScrollToIndexFailed={(info) => {
            const wait = new Promise((resolve) => setTimeout(resolve, 500));
            wait.then(() => {
              listRef?.current?.scrollToIndex({
                index: info.index,
                animated: true,
              });
            });
          }}
          renderItem={(item) => (
            <MessageItem
              key={item.item.id}
              message={item.item}
              isEditing={item.item.id === editingMessageId}
              onRetrySendMessage={onRetrySendMessage}
              onClickMessage={onClickMessage}
              currentUserId={currentUser?.id ?? ""}
            />
          )}
        />

        <View className="flex rounded-lg">
          <View
            className={`flex-row p-4 justify-between items-center ${editingMessageId ? "flex" : "hidden"}`}
          >
            <Text>Edit message</Text>
            <Clickable
              className="flex bg-whiteGrey-300 rounded-full items-center justify-center"
              onPress={useCallback(() => {
                dispatch(conversationChatActions.setEditingMessage({}));
              }, [dispatch])}
            >
              {useMemo(() => {
                return <Ionicons name="close" size={30} />;
              }, [])}
            </Clickable>
          </View>
          <View className="flex flex-row items-center gap-2 p-4">
            <Clickable className="bg-whiteGrey-300 rounded-full p-3">
              {useMemo(() => {
                return <Ionicons name="menu" size={24} />;
              }, [])}
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
              className={`bg-whiteGrey-300 rounded-full p-3 ${isSendButtonEnabled ? "opacity-100" : "opacity-50"}`}
              onPress={isSendButtonEnabled ? onClickSendMessage : undefined}
            >
              {useMemo(
                () => (
                  <Ionicons name="send" size={24} color="#247cff" />
                ),
                []
              )}
            </Clickable>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default ConversationRoomLayout;
