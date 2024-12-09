import IMessage from "@/business/data/models/IMessage";
import IUser from "@/business/data/models/IUser";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum ConversationChatStatus {
  IDLE,
  SENDING_MESSAGE,
  EDITING_MESSAGE,
  DELETING_MESSAGE,
}

interface ConversationChatState {
  typingUserIds: string[];
  inputMessage: string;
  editingMessageId?: string;
  status: ConversationChatStatus;
  errorMessage?: string;
}

const initialState: ConversationChatState = {
  typingUserIds: [],
  inputMessage: "",
  status: ConversationChatStatus.IDLE,
  errorMessage: "",
};

const onSendMessage = createAsyncThunk<
  IMessage,
  {
    conversationId: string;
    currentUser: IUser;
    receiverIds: string[];
    content: string;
  }
>(
  "conversationChat/sendMessage",
  async ({
    conversationId,
    currentUser,
    receiverIds,
    content,
  }: {
    conversationId: string;
    currentUser: IUser;
    receiverIds: string[];
    content: string;
  }) => {
    try {
      const response = await AxiosClient.post(APIRoutes.sendMessage, {
        receivers: receiverIds,
        content: content,
        type: "text", // TODO: Handle for other message types
      });

      return response.data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
);

const onRetryToSendMessage = createAsyncThunk<
  IMessage,
  {
    trackingId: string;
    conversationId: string;
    currentUser: IUser;
    receiverIds: string[];
    content: string;
  }
>(
  "conversationChat/retrySendMessage",
  async ({
    receiverIds,
    content,
  }: {
    trackingId: string;
    conversationId: string;
    currentUser: IUser;
    receiverIds: string[];
    content: string;
  }) => {
    try {
      const response = await AxiosClient.post(APIRoutes.sendMessage, {
        receivers: receiverIds,
        content: content,
        type: "text",
      });

      console.log("Retry send message", response.data);

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const onEditMessage = createAsyncThunk<
  IMessage,
  {
    messageId: string;
    content: string;
  }
>(
  "conversationChat/editMessage",
  async ({ content, messageId }: { content: string; messageId: string }) => {
    try {
      const response = await AxiosClient.patch(
        APIRoutes.editMessage(messageId),
        {
          content,
        }
      );

      return response.data;
    } catch (error) {
      throw error;
    }
  }
);

const onDeleteMessage = createAsyncThunk<string | undefined, string>(
  "conversationChat/deleteMessage",
  async (messageId: string) => {
    try {
      const response = await AxiosClient.delete(
        APIRoutes.deleteMessage(messageId)
      );

      return response.data["messageId"];
    } catch (error) {
      throw error;
    }
  }
);

const conversationChatSlice = createSlice({
  name: "conversationChat",
  initialState,
  reducers: {
    setUserIsTyping: (
      state,
      action: PayloadAction<{ isTyping: boolean; userId: string }>
    ) => {
      const { isTyping, userId } = action.payload;
      if (!isTyping) {
        state.typingUserIds = state.typingUserIds.filter((id) => id !== userId);
      } else {
        state.typingUserIds = [...state.typingUserIds, userId];
      }
    },
    setInputMessage: (state, action: PayloadAction<string>) => {
      state.inputMessage = action.payload;
    },
    setEditingMessage: (
      state,
      action: PayloadAction<{
        messageId?: string;
        content?: string;
      }>
    ) => {
      state.editingMessageId = action.payload.messageId;
      state.inputMessage = action.payload.content || "";
    },
    reset: (state) => {
      state.inputMessage = "";
      state.status = ConversationChatStatus.IDLE;
      state.errorMessage = "";
      state.editingMessageId = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(onSendMessage.fulfilled, (state) => {
      state.status = ConversationChatStatus.IDLE;
      state.inputMessage = "";
    });
    builder.addCase(onSendMessage.pending, (state) => {
      state.status = ConversationChatStatus.SENDING_MESSAGE;
      state.inputMessage = "";
    });
    builder.addCase(onSendMessage.rejected, (state, action) => {
      state.status = ConversationChatStatus.IDLE;
      state.errorMessage = action.error.message;
    });
    builder.addCase(onEditMessage.fulfilled, (state) => {
      state.status = ConversationChatStatus.IDLE;
      state.inputMessage = "";
      state.editingMessageId = undefined;
    });
    builder.addCase(onEditMessage.pending, (state) => {
      state.status = ConversationChatStatus.EDITING_MESSAGE;
    });
    builder.addCase(onEditMessage.rejected, (state, action) => {
      state.status = ConversationChatStatus.IDLE;
      state.errorMessage = action.error.message;
    });
    builder.addCase(onDeleteMessage.fulfilled, (state) => {
      state.status = ConversationChatStatus.IDLE;
    });
    builder.addCase(onDeleteMessage.pending, (state) => {
      state.status = ConversationChatStatus.DELETING_MESSAGE;
    });
    builder.addCase(onDeleteMessage.rejected, (state, action) => {
      state.status = ConversationChatStatus.IDLE;
      state.errorMessage = action.error.message;
    });
  },
});

export const conversationChatActions = {
  onSendMessage,
  onEditMessage,
  onDeleteMessage,
  onRetryToSendMessage,
  ...conversationChatSlice.actions,
};

export default conversationChatSlice.reducer;
