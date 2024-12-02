import IConversation, {
  ConversationType,
} from "@/business/data/models/IConversation";
import IMessage from "@/business/data/models/IMessage";
import IPagination, {
  initialPagination,
} from "@/business/data/models/IPagination";
import { SocketIOClient } from "@/business/data/services/SocketIOClient";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux/store";

export enum ConversationListStatus {
  IDLE = "idle",
  FETCHING = "fetching",
  REFRESHING = "refreshing",
  LOADING_MORE = "loading_more",
}

interface ConversationListState {
  conversations: IPagination<IConversation>;
  status: ConversationListStatus;
  errorMessage?: string;
}

const listenToSocketEvents = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    const listenResult = await SocketIOClient.emitWithAck(
      "conversationList/user",
      {}
    );

    if (!listenResult || !listenResult.success) {
      return;
    }

    SocketIOClient.on(
      "conversationList/newConversation",
      (conversation: IConversation) => {
        dispatch(conversationsActions.addNewConversation(conversation));
      }
    );

    SocketIOClient.on(
      "conversationList/lastMessageChanged",
      ({
        conversationId,
        message,
      }: {
        conversationId: string;
        message: IMessage;
      }) => {
        dispatch(
          conversationsActions.updateLastConversationMessage({
            conversationId,
            message,
          })
        );
      }
    );

    SocketIOClient.on(
      "conversationList/lastMessageDeleted",
      ({
        conversationId,
        message,
      }: {
        conversationId: string;
        message: IMessage;
      }) => {
        dispatch(
          conversationsActions.updateLastConversationMessage({
            conversationId,
            message,
          })
        );
      }
    );

    SocketIOClient.on("conversationList/newMessage", (message: IMessage) => {
      dispatch(conversationsActions.newMessageReceived(message));
    });
  };
};

const onFetchConversationsAsync = createAsyncThunk(
  "conversations/fetchConversations",
  async (params: { type?: ConversationType }) => {
    try {
      return await fetchConversations(1, params.type);
    } catch (error) {
      throw error;
    }
  }
);

const onRefreshConversationsAsync = createAsyncThunk(
  "conversations/refreshConversations",
  async (params: { type?: ConversationType }) => {
    try {
      return await fetchConversations(1, params.type);
    } catch (error) {
      throw error;
    }
  }
);

const onLoadMoreConversationsAsync = createAsyncThunk(
  "conversations/loadMoreConversations",
  async (params: { page: number; type?: ConversationType }) => {
    try {
      return await fetchConversations(params.page, params.type);
    } catch (error) {
      throw error;
    }
  }
);

const fetchConversations = async (page: number, type?: ConversationType) => {
  try {
    // Fetch conversations from the server
    let responseData = await AxiosClient.get(APIRoutes.getConversations, {
      params: {
        page: page,
        type,
      },
    });

    return responseData.data;
  } catch (error) {
    throw error;
  }
};

const unlistenToSocketEvents = () => {
  return async () => {
    SocketIOClient.off("conversationList/newConversation");
    SocketIOClient.off("conversationList/lastMessageChanged");
    SocketIOClient.off("conversationList/lastMessageDeleted");
    SocketIOClient.off("conversationList/newMessage");
  };
};

const conversationListSlice = createSlice({
  name: "conversationList",
  initialState: {
    conversations: initialPagination<IConversation>(),
    status: ConversationListStatus.IDLE,
  } as ConversationListState,
  reducers: {
    addNewConversation: (state, action) => {
      state.conversations.data.unshift(action.payload);
    },
    newMessageReceived: (state, action) => {
      const conversation = state.conversations.data.find(
        (c) => c.id === action.payload.conversationId
      );

      if (!conversation) {
        return;
      }

      conversation.lastMessage = action.payload.message;

      const conversationIndex = state.conversations.data.findIndex(
        (c) => c.id === action.payload.conversationId
      );

      if (conversationIndex !== -1) {
        state.conversations.data.splice(conversationIndex, 1);
        state.conversations.data.unshift(conversation);
      }
    },
    updateLastConversationMessage: (state, action) => {
      const conversation = state.conversations.data.find(
        (c) => c.id === action.payload.conversationId
      );

      if (!conversation) {
        return;
      }

      conversation.lastMessage = action.payload.message;
    },
    setConversations: (state, action) => {
      state.conversations = action.payload;
    },
    setStatus: (state, action) => {
      state.status = action.payload;
    },
    setErrorMessage: (state, action) => {
      state.errorMessage = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(onFetchConversationsAsync.pending, (state) => {
      state.status = ConversationListStatus.FETCHING;
    });

    builder.addCase(onFetchConversationsAsync.fulfilled, (state, action) => {
      state.conversations = action.payload;
      state.status = ConversationListStatus.IDLE;
    });

    builder.addCase(onFetchConversationsAsync.rejected, (state, action) => {
      state.status = ConversationListStatus.IDLE;
      state.errorMessage = action.error.message;
    });

    builder.addCase(onRefreshConversationsAsync.pending, (state) => {
      state.status = ConversationListStatus.REFRESHING;
    });

    builder.addCase(onRefreshConversationsAsync.fulfilled, (state, action) => {
      state.conversations = action.payload;
      state.status = ConversationListStatus.IDLE;
    });

    builder.addCase(onRefreshConversationsAsync.rejected, (state, action) => {
      state.status = ConversationListStatus.IDLE;
      state.errorMessage = action.error.message;
    });

    builder.addCase(onLoadMoreConversationsAsync.pending, (state) => {
      state.status = ConversationListStatus.LOADING_MORE;
    });

    builder.addCase(onLoadMoreConversationsAsync.fulfilled, (state, action) => {
      state.conversations = {
        currentPage: action.payload.currentPage,
        lastPage: action.payload.lastPage,
        totalItems: action.payload.totalItems,
        data: [...state.conversations.data, ...action.payload.data],
      };
      state.status = ConversationListStatus.IDLE;
    });

    builder.addCase(onLoadMoreConversationsAsync.rejected, (state, action) => {
      state.status = ConversationListStatus.IDLE;
      state.errorMessage = action.error.message;
    });
  },
});

export const conversationsActions = {
  ...conversationListSlice.actions,
  listenToSocketEvents,
  unlistenToSocketEvents,
  onFetchConversationsAsync,
  onRefreshConversationsAsync,
  onLoadMoreConversationsAsync,
};

export const conversationListReducer = conversationListSlice.reducer;
