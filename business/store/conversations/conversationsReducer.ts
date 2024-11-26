import IConversation, {
  ConversationType,
} from "@/business/data/models/IConversation";
import IPagination, {
  initialPagination,
} from "@/business/data/models/IPagination";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { AppDispatch } from "../redux/store";
import { SocketIOClient } from "@/business/data/services/SocketIOClient";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/api_routes";

export enum ConversationsStatus {
  IDLE = "idle",
  FETCHING = "fetching",
  REFRESHING = "refreshing",
  LOADING_MORE = "loading_more",
}

interface ConversationsState {
  conversations: IPagination<IConversation>;
  status: ConversationsStatus;
  errorMessage?: string;
}

const listenToSocketEvents = (userId: string) => {
  return async (dispatch: AppDispatch) => {
    console.log("Listening to socket events", userId);
    const listenResult = await SocketIOClient.emitWithAck(`conversation/user`, {
      userId,
    });

    console.log("listenResult", listenResult);

    if (!listenResult || !listenResult.success) {
      return;
    }

    console.log("Listening to socket events");

    SocketIOClient.on("conversation/new", (conversation: IConversation) => {
      console.log("New conversation", conversation);
      dispatch(conversationsActions.addNewConversation(conversation));
    });
    SocketIOClient.on("conversation/update", (conversation: IConversation) => {
      console.log("Updated conversation", conversation);
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
  },
);

const onRefreshConversationsAsync = createAsyncThunk(
  "conversations/refreshConversations",
  async (params: { type?: ConversationType }) => {
    try {
      return await fetchConversations(1, params.type);
    } catch (error) {
      throw error;
    }
  },
);

const onLoadMoreConversationsAsync = createAsyncThunk(
  "conversations/loadMoreConversations",
  async (params: { page: number; type?: ConversationType }) => {
    try {
      return await fetchConversations(params.page, params.type);
    } catch (error) {
      throw error;
    }
  },
);

const fetchConversations = async (page: number, type?: ConversationType) => {
  try {
    // Fetch conversations from the server
    let responseData = await AxiosClient.get(APIRoutes.getConversations, {
      headers: {
        AuthRoutes: true,
      },
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
    SocketIOClient.off("conversation/new");
    SocketIOClient.off("conversation/update");
  };
};

const conversationSlice = createSlice({
  name: "conversations",
  initialState: {
    conversations: initialPagination<IConversation>(),
    status: ConversationsStatus.IDLE,
  } as ConversationsState,
  reducers: {
    addNewConversation: (state, action) => {
      state.conversations.data.unshift(action.payload);
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
      state.status = ConversationsStatus.FETCHING;
    });

    builder.addCase(onFetchConversationsAsync.fulfilled, (state, action) => {
      state.conversations = action.payload;
      state.status = ConversationsStatus.IDLE;
    });

    builder.addCase(onFetchConversationsAsync.rejected, (state, action) => {
      state.status = ConversationsStatus.IDLE;
      state.errorMessage = action.error.message;
    });

    builder.addCase(onRefreshConversationsAsync.pending, (state) => {
      state.status = ConversationsStatus.REFRESHING;
    });

    builder.addCase(onRefreshConversationsAsync.fulfilled, (state, action) => {
      state.conversations = action.payload;
      state.status = ConversationsStatus.IDLE;
    });

    builder.addCase(onRefreshConversationsAsync.rejected, (state, action) => {
      state.status = ConversationsStatus.IDLE;
      state.errorMessage = action.error.message;
    });

    builder.addCase(onLoadMoreConversationsAsync.pending, (state) => {
      state.status = ConversationsStatus.LOADING_MORE;
    });

    builder.addCase(onLoadMoreConversationsAsync.fulfilled, (state, action) => {
      state.conversations = {
        currentPage: action.payload.currentPage,
        lastPage: action.payload.lastPage,
        totalItems: action.payload.totalItems,
        data: [...state.conversations.data, ...action.payload.data],
      };
      state.status = ConversationsStatus.IDLE;
    });

    builder.addCase(onLoadMoreConversationsAsync.rejected, (state, action) => {
      state.status = ConversationsStatus.IDLE;
      state.errorMessage = action.error.message;
    });
  },
});

export const conversationsActions = {
  ...conversationSlice.actions,
  listenToSocketEvents,
  unlistenToSocketEvents,
  onFetchConversationsAsync,
  onRefreshConversationsAsync,
  onLoadMoreConversationsAsync,
};

export const conversationsReducer = conversationSlice.reducer;
