import IMessage from "@/business/data/models/IMessage";
import IPagination, {
  initialPagination,
} from "@/business/data/models/IPagination";
import { SocketIOClient } from "@/business/data/services/SocketIOClient";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux/store";

export enum ConversationRoomStatus {
  IDLE = "IDLE",
  FETCHING = "FETCHING",
  REFRESHING = "REFRESHING",
  LOADING_MORE = "LOADING_MORE",
}

interface ConversationRoomState {
  messages: IPagination<IMessage>;
  status: ConversationRoomStatus;
  errorMessage?: string;
}

const initialState: ConversationRoomState = {
  messages: initialPagination<IMessage>(),
  status: ConversationRoomStatus.IDLE,
  errorMessage: "",
};

const listenToSocketEvents = (conversationId: string) => {
  return async (dispatch: AppDispatch) => {
    const listenResult = await SocketIOClient.emitWithAck("conversation/join", {
      conversationId,
    });

    console.log("listenResult", listenResult);
    if (!listenResult || !listenResult.success) {
      return;
    }

    SocketIOClient.on("conversation/newMessage", (message: IMessage) => {
      console.log("new message", message);
      dispatch(conversationRoomActions.addNewMessage(message));
    });

    SocketIOClient.on("conversation/messageUpdated", (message: IMessage) => {
      dispatch(conversationRoomActions.updateMessage(message));
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

const onFetchMessagesAsync = createAsyncThunk(
  "conversationRoom/fetchMessages",
  async (conversationId: string) => {
    try {
      return await fetchMessages(1, conversationId);
    } catch (error) {
      throw error;
    }
  }
);

const onRefreshMessagesAsync = createAsyncThunk(
  "conversationRoom/refreshMessages",
  async (conversationId: string) => {
    try {
      return await fetchMessages(1, conversationId);
    } catch (error) {
      throw error;
    }
  }
);

const onLoadMoreMessagesAsync = createAsyncThunk(
  "conversationRoom/loadMoreMessages",
  async ({
    page,
    conversationId,
  }: {
    page: number;
    conversationId: string;
  }) => {
    try {
      return await fetchMessages(page, conversationId);
    } catch (error) {
      throw error;
    }
  }
);

const fetchMessages = async (
  page: number,
  conversationId: string
): Promise<IPagination<IMessage>> => {
  try {
    const response = await AxiosClient.get(
      APIRoutes.getConversationMessages(conversationId),

      {
        headers: {
          AuthRoutes: true,
        },
        params: {
          page,
          limit: 100,
        },
      }
    );

    return response.data;
  } catch (error) {
    throw error;
  }
};

const conversationRoomSlice = createSlice({
  name: "conversationRoom",
  initialState,
  reducers: {
    addNewMessage: (state, action) => {
      state.messages = {
        ...state.messages,
        data: [action.payload, ...state.messages.data],
        totalItems: state.messages.totalItems + 1,
      };
    },
    updateMessage: (state, action) => {
      const updatedMessage = action.payload;

      state.messages = {
        ...state.messages,
        data: state.messages.data.map((m) =>
          m.id === updatedMessage.id ? updatedMessage : m
        ),
      };
    },
    setMessages: (state, action) => {
      state.messages = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
    reset: (state) => {
      state = {
        ...initialState,
      };
    },
  },
  extraReducers: (builder) => {
    builder.addCase(onFetchMessagesAsync.pending, (state) => {
      state.status = ConversationRoomStatus.FETCHING;
    });
    builder.addCase(onFetchMessagesAsync.fulfilled, (state, action) => {
      state.messages = action.payload;
      state.status = ConversationRoomStatus.IDLE;
    });
    builder.addCase(onFetchMessagesAsync.rejected, (state, action) => {
      state.status = ConversationRoomStatus.IDLE;
      state.errorMessage = action.error.message;
    });

    builder.addCase(onRefreshMessagesAsync.pending, (state) => {
      state.status = ConversationRoomStatus.REFRESHING;
    });
    builder.addCase(onRefreshMessagesAsync.fulfilled, (state, action) => {
      state.messages = action.payload;
      state.status = ConversationRoomStatus.IDLE;
    });
    builder.addCase(onRefreshMessagesAsync.rejected, (state, action) => {
      state.status = ConversationRoomStatus.IDLE;
      console.log(action.error);
      state.errorMessage = action.error.message;
    });

    builder.addCase(onLoadMoreMessagesAsync.pending, (state) => {
      state.status = ConversationRoomStatus.LOADING_MORE;
    });
    builder.addCase(onLoadMoreMessagesAsync.fulfilled, (state, action) => {
      state.messages = {
        ...state.messages,
        data: [...state.messages.data, ...action.payload.data],
        currentPage: action.payload.currentPage,
        totalItems: action.payload.totalItems,
      };
      state.status = ConversationRoomStatus.IDLE;
    });
    builder.addCase(onLoadMoreMessagesAsync.rejected, (state, action) => {
      state.status = ConversationRoomStatus.IDLE;
      state.errorMessage = action.error.message;
    });
  },
});

export const conversationRoomActions = {
  ...conversationRoomSlice.actions,
  listenToSocketEvents,
  unlistenToSocketEvents,
  onFetchMessagesAsync,
  onRefreshMessagesAsync,
  onLoadMoreMessagesAsync,
};

export default conversationRoomSlice.reducer;
