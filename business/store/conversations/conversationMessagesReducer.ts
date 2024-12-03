import IMessage, {
  MessageState,
  MessageType,
} from "@/business/data/models/IMessage";
import IPagination, {
  initialPagination,
} from "@/business/data/models/IPagination";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { conversationChatActions } from "./conversationChatReducer";

export enum ConversationMessagesStatus {
  IDLE = "IDLE",
  FETCHING = "FETCHING",
  REFRESHING = "REFRESHING",
  LOADING_MORE = "LOADING_MORE",
}

interface ConversationMessagesState {
  messages: IPagination<IMessage>;
  status: ConversationMessagesStatus;
  errorMessage?: string;
}

const initialState: ConversationMessagesState = {
  messages: initialPagination<IMessage>(),
  status: ConversationMessagesStatus.IDLE,
  errorMessage: "",
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
        params: {
          page,
          limit: 100,
        },
      }
    );

    return {
      ...response.data,
      data: response.data.data.map((message: IMessage) => ({
        ...message,
        messageState: MessageState.Delivered,
      })),
    };
  } catch (error) {
    throw error;
  }
};

const conversationMessageSlice = createSlice({
  name: "conversationMessages",
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
      state.status = ConversationMessagesStatus.FETCHING;
    });
    builder.addCase(onFetchMessagesAsync.fulfilled, (state, action) => {
      state.messages = action.payload;
      state.status = ConversationMessagesStatus.IDLE;
    });
    builder.addCase(onFetchMessagesAsync.rejected, (state, action) => {
      state.status = ConversationMessagesStatus.IDLE;
      state.errorMessage = action.error.message;
    });

    builder.addCase(onRefreshMessagesAsync.pending, (state) => {
      state.status = ConversationMessagesStatus.REFRESHING;
    });
    builder.addCase(onRefreshMessagesAsync.fulfilled, (state, action) => {
      state.messages = action.payload;
      state.status = ConversationMessagesStatus.IDLE;
    });
    builder.addCase(onRefreshMessagesAsync.rejected, (state, action) => {
      state.status = ConversationMessagesStatus.IDLE;
      console.log(action.error);
      state.errorMessage = action.error.message;
    });

    builder.addCase(onLoadMoreMessagesAsync.pending, (state) => {
      state.status = ConversationMessagesStatus.LOADING_MORE;
    });
    builder.addCase(onLoadMoreMessagesAsync.fulfilled, (state, action) => {
      state.messages = {
        ...state.messages,
        data: [...state.messages.data, ...action.payload.data],
        currentPage: action.payload.currentPage,
        totalItems: action.payload.totalItems,
      };
      state.status = ConversationMessagesStatus.IDLE;
    });
    builder.addCase(onLoadMoreMessagesAsync.rejected, (state, action) => {
      state.status = ConversationMessagesStatus.IDLE;
      state.errorMessage = action.error.message;
    });

    builder.addCase(
      conversationChatActions.onSendMessage.pending,
      (state, action) => {
        const currentUser = action.meta.arg.currentUser;
        const conversationId = action.meta.arg.conversationId;
        state.messages = {
          ...state.messages,
          data: [
            {
              id: action.meta.requestId,
              conversationId: conversationId,
              content: action.meta.arg.content,
              senderId: currentUser,
              type: MessageType.Text,
              createdAt: new Date(),
              updatedAt: new Date(),
              level: 0,
              taggedUsers: [],
              seenBy: [],
              replies: [],
              messageState: MessageState.Sending,
            },
            ...state.messages.data,
          ],
        };
      }
    );
    builder.addCase(
      conversationChatActions.onSendMessage.rejected,
      (state, action) => {
        const draftMessageIndex = state.messages.data.findIndex(
          (m) => m.id === action.meta.requestId
        );

        if (draftMessageIndex !== -1) {
          state.messages.data[draftMessageIndex].messageState =
            MessageState.Error;
        }
      }
    );
    builder.addCase(
      conversationChatActions.onSendMessage.fulfilled,
      (state, action) => {
        const newMessage = action.payload;
        state.messages = {
          ...state.messages,
          data: state.messages.data.map((m) =>
            m.id === action.meta.requestId ? newMessage : m
          ),
        };
      }
    );
    builder.addCase(
      conversationChatActions.onRetryToSendMessage.pending,
      (state, action) => {
        const trackingId = action.meta.arg.trackingId;
        const draftMessageIndex = state.messages.data.findIndex(
          (m) => m.id === trackingId
        );

        if (draftMessageIndex !== -1) {
          state.messages.data[draftMessageIndex].messageState =
            MessageState.Sending;
        }
      }
    );

    builder.addCase(
      conversationChatActions.onRetryToSendMessage.rejected,
      (state, action) => {
        const trackingId = action.meta.arg.trackingId;
        const draftMessageIndex = state.messages.data.findIndex(
          (m) => m.id === trackingId
        );

        if (draftMessageIndex !== -1) {
          state.messages.data[draftMessageIndex].messageState =
            MessageState.Error;
        }
      }
    );

    builder.addCase(
      conversationChatActions.onRetryToSendMessage.fulfilled,
      (state, action) => {
        const newMessage = action.payload;
        const trackingId = action.meta.arg.trackingId;
        state.messages = {
          ...state.messages,
          data: state.messages.data.map((m) =>
            m.id === trackingId ? newMessage : m
          ),
        };
      }
    );
  },
});

export const conversationMessagesActions = {
  ...conversationMessageSlice.actions,
  onFetchMessagesAsync,
  onRefreshMessagesAsync,
  onLoadMoreMessagesAsync,
};

export default conversationMessageSlice.reducer;
