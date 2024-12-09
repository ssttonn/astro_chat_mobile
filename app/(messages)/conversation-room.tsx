import { conversationRoomActions } from "@/business/store/conversations/conversationRoomReducer";
import { AppDispatch, RootState } from "@/business/store/redux/store";
import Clickable from "@/components/common/Clickable";
import UserAvatar from "@/components/common/UserAvatar";
import ConversationRoomLayout from "@/components/conversation/ConversationRoomLayout";
import { FontAwesome, FontAwesome5, Ionicons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useCallback, useEffect, useMemo } from "react";
import { Text, View } from "react-native";
import { useDispatch, useSelector } from "react-redux";

const ConversationRoomScreen = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { currentUser } = useSelector((state: RootState) => state.profile);
  const { conversationId } = useLocalSearchParams();
  const { conversation } = useSelector(
    (state: RootState) => state.conversationRoom
  );
  const { connected } = useSelector((state: RootState) => state.realtimeData);

  useEffect(() => {
    if (!conversationId || !currentUser) {
      return;
    }
    dispatch(
      conversationRoomActions.fetchConversationDetail(conversationId as string)
    );

    return () => {
      dispatch(conversationRoomActions.reset());
    };
  }, [conversationId, dispatch, currentUser]);

  useEffect(() => {
    if (!conversationId || !currentUser) {
      return;
    }
    if (connected) {
      dispatch(
        conversationRoomActions.listenToSocketEvents(
          conversationId as string,
          currentUser
        )
      );
    } else {
      dispatch(
        conversationRoomActions.unlistenToSocketEvents(conversationId as string)
      );
    }

    return () => {
      dispatch(
        conversationRoomActions.unlistenToSocketEvents(conversationId as string)
      );
    };
  }, [connected, conversationId, currentUser, dispatch]);

  const conversationName = useMemo(() => {
    return (
      conversation?.name ||
      conversation?.members?.map((member) => member.username).join(", ")
    );
  }, [conversation]);

  return (
    <ConversationRoomLayout conversationId={conversationId as string}>
      <View className="flex flex-row px-4 py-2 items-center gap-4">
        <Clickable
          className="bg-whiteGrey-300 rounded-full p-3"
          onPress={router.back}
        >
          <Ionicons name="chevron-back" size={24} />
        </Clickable>
        <View className="flex flex-row flex-1 items-center">
          <UserAvatar
            avatarUrl="https://images.unsplash.com/photo-1731641904795-2873e1da5ac1?q=80&w=2075&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            size={40}
          />
          <Text
            className="text-lg font-KelsonBold text-dark-600 ml-3 flex-1"
            numberOfLines={1}
          >
            {conversationName}
          </Text>
        </View>

        <Clickable>
          <FontAwesome5 name="video" size={26} color="#247cff" />
        </Clickable>

        <Clickable className="ml-2" onPress={useCallback(() => {}, [])}>
          <FontAwesome name="phone" size={26} color="#247cff" />
        </Clickable>
      </View>
    </ConversationRoomLayout>
  );
};

export default ConversationRoomScreen;
