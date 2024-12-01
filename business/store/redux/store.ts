import { configureStore } from "@reduxjs/toolkit";
import { profileReducer } from "../profile/profileReducer";
import { realtimeDataReducer } from "../realtime/realtimeDataReducer";
import { conversationListReducer } from "../conversations/conversationListReducer";
import conversationRoomReducer from "../conversations/conversationRoomReducer";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    realtimeData: realtimeDataReducer,
    conversations: conversationListReducer,
    conversationRoom: conversationRoomReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
