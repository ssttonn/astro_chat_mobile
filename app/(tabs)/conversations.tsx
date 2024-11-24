import { conversationsActions } from "@/business/store/conversations/conversationsReducer";
import { AppDispatch, RootState } from "@/business/store/redux/store";
import Clickable from "@/components/common/Clickable";
import ConversationItem from "@/components/conversation/ConversationItem";
import ScreenRoutes from "@/constants/ScreenRoutes";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useCallback, useEffect } from "react";
import { FlatList, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useDispatch, useSelector } from "react-redux";

const ConversationsScreen = () => {
  const { conversations } = useSelector(
    (state: RootState) => state.conversations,
  );

  const { currentUser } = useSelector((state: RootState) => state.profile);

  const { connected } = useSelector((state: RootState) => state.realtimeData);

  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(conversationsActions.onFetchConversationsAsync({}));
  }, [dispatch]);

  useEffect(() => {
    const inititalizeSocket = async () => {
      if (!currentUser || !connected) {
        return;
      }

      dispatch(conversationsActions.listenToSocketEvents(currentUser.id));
    };

    inititalizeSocket();

    return () => {
      dispatch(conversationsActions.unlistenToSocketEvents());
    };
  }, [connected, dispatch, currentUser]);

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
