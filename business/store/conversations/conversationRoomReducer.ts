import IConversation from "@/business/data/models/IConversation";
import IMessage from "@/business/data/models/IMessage";
import IUser from "@/business/data/models/IUser";
import AxiosClient from "@/business/data/services/axiosClient";
import { SocketIOClient } from "@/business/data/services/SocketIOClient";
import { APIRoutes } from "@/constants/apiRoutes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux/store";
import { conversationMessagesActions } from "./conversationMessagesReducer";

export enum ConversationRoomStatus {
  IDLE = "idle",
  FETCHING = "fetching",
}

interface ConversationRoomState {
  status: ConversationRoomStatus;
  typingUserIds: string[];
  conversation?: IConversation;
  errorMessage?: string;
}

const initialState: ConversationRoomState = {
  status: ConversationRoomStatus.IDLE,
  typingUserIds: [],
  errorMessage: "",
};

const listenToSocketEvents = (conversationId: string, currentUser: IUser) => {
  return async (dispatch: AppDispatch) => {
    const listenResult = await SocketIOClient.emitWithAck("conversation/join", {
      conversationId,
    });

    if (!listenResult || !listenResult.success) {
      return;
    }

    SocketIOClient.on("conversation/newMessage", (message: IMessage) => {
      if (message.senderId.id === currentUser.id) {
        return;
      }
      dispatch(conversationMessagesActions.addNewMessage(message));
    });

    SocketIOClient.on("conversation/messageUpdated", (message: IMessage) => {
      dispatch(conversationMessagesActions.updateMessage(message));
    });

    SocketIOClient.on("conversation/messageDeleted", (messageId: string) => {});
  };
};

const unlistenToSocketEvents = (conversationId: string) => {
  return async () => {
    SocketIOClient.off("conversation/newMessage");
    SocketIOClient.off("conversation/messageUpdated");
    SocketIOClient.off("conversation/messageDeleted");
    SocketIOClient.emit("conversation/leave", {
      conversationId: conversationId,
    });
  };
};

const fetchConversationDetail = createAsyncThunk<IConversation, string>(
  "conversation/fetchUserDetail",
  async (conversationId: string) => {
    try {
      console.log("Fetching");
      const response = await AxiosClient.get(
        APIRoutes.fetchConversation(conversationId)
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const conversationRoomSlice = createSlice({
  name: "conversationRoom",
  initialState,
  reducers: {
    setConversation: (state, action: PayloadAction<IConversation>) => {
      state.conversation = action.payload;
    },

    reset: (state) => {
      state = initialState;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchConversationDetail.fulfilled, (state, action) => {
      state.status = ConversationRoomStatus.IDLE;
      state.conversation = action.payload;
    });
    builder.addCase(fetchConversationDetail.rejected, (state, action) => {
      state.status = ConversationRoomStatus.IDLE;
      state.errorMessage = action.error.message;
    });
    builder.addCase(fetchConversationDetail.pending, (state) => {
      state.status = ConversationRoomStatus.FETCHING;
    });
  },
});

export const conversationRoomActions = {
  listenToSocketEvents,
  unlistenToSocketEvents,
  fetchConversationDetail,
  ...conversationRoomSlice.actions,
};

export default conversationRoomSlice.reducer;
