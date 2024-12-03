import { configureStore } from "@reduxjs/toolkit";
import { profileReducer } from "../profile/profileReducer";
import { realtimeDataReducer } from "../realtime/realtimeDataReducer";
import { conversationListReducer } from "../conversations/conversationListReducer";
import conversationMessagesReducer from "../conversations/conversationMessagesReducer";
import conversationRoomReducer from "../conversations/conversationRoomReducer";
import conversationChatReducer from "../conversations/conversationChatReducer";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    realtimeData: realtimeDataReducer,
    conversations: conversationListReducer,
    conversationMessages: conversationMessagesReducer,
    conversationRoom: conversationRoomReducer,
    conversationChat: conversationChatReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false,
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
