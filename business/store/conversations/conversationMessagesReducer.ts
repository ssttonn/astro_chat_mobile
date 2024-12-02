import IMessage from "@/business/data/models/IMessage";
import IPagination, {
  initialPagination,
} from "@/business/data/models/IPagination";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

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

    return response.data;
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
  },
});

export const conversationMessagesActions = {
  ...conversationMessageSlice.actions,
  onFetchMessagesAsync,
  onRefreshMessagesAsync,
  onLoadMoreMessagesAsync,
};

export default conversationMessageSlice.reducer;
