import { configureStore } from "@reduxjs/toolkit";
import { profileReducer } from "../profile/profileReducer";
import { realtimeDataReducer } from "../realtime/realtimeDataReducer";
import { conversationsReducer } from "../conversations/conversationsReducer";

export const store = configureStore({
  reducer: {
    profile: profileReducer,
    realtimeData: realtimeDataReducer,
    conversations: conversationsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
