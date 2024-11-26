import IConversation, {
  ConversationType,
} from "@/business/data/models/IConversation";
import IPagination, {
  initialPagination,
} from "@/business/data/models/IPagination";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum RecentConversationsStatus {
  IDLE = "idle",
  FETCHING = "fetching",
  REFRESHING = "refreshing",
  LOADING_MORE = "loading_more",
}

interface RecentConversationsStore {
  conversations: IPagination<IConversation>;
  status: RecentConversationsStatus;
  errorMessage?: string;
  fetchConversations: (
    isRefreshing: boolean,
    type?: ConversationType,
  ) => Promise<void>;
  loadingMoreConversation: (
    page: number,
    type?: ConversationType,
  ) => Promise<void>;
}

export const useRecentConversationsStore = create<RecentConversationsStore>()(
  immer((set) => {
    return {
      conversations: initialPagination<IConversation>(),
      status: RecentConversationsStatus.IDLE,
      fetchConversations: async (isRefreshing = false, type) => {
        try {
          set((state) => {
            if (isRefreshing) {
              state.status = RecentConversationsStatus.REFRESHING;
            } else {
              state.status = RecentConversationsStatus.FETCHING;
            }
          });

          // Fetch conversations from the server
          let conversations = await fetchConversations(1, type);

          set((state) => {
            state.conversations = {
              ...conversations,
            };
            state.status = RecentConversationsStatus.IDLE;
          });
        } catch (error) {
          console.log(error);
          set((state) => {
            state.status = RecentConversationsStatus.IDLE;
            state.errorMessage = error as string | undefined;
          });
        }
      },
      loadingMoreConversation: async (page, type) => {
        try {
          set((state) => {
            state.status = RecentConversationsStatus.LOADING_MORE;
          });

          // Fetch conversations from the server
          let conversations = await fetchConversations(page, type);

          set((state) => {
            state.conversations = {
              currentPage: conversations.currentPage,
              lastPage: conversations.lastPage,
              totalItems: conversations.totalItems,
              data: [...state.conversations.data, ...conversations.data],
            };
            state.status = RecentConversationsStatus.IDLE;
          });
        } catch (error) {
          set((state) => {
            state.status = RecentConversationsStatus.IDLE;
            state.errorMessage = error as string | undefined;
          });
        }
      },
    };
  }),
);

const fetchConversations = async (page: number, type?: ConversationType) => {
  try {
    // Fetch conversations from the server
    let responseData = await AxiosClient.get(APIRoutes.getConversations, {
      headers: {
        AuthRoutes: true,
      },
      params: {
        page: 1,
        type,
      },
    });

    return responseData.data;
  } catch (error) {
    throw error;
  }
};
