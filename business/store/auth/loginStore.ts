import AxiosClient from "@/business/data/services/axiosClient";
import axios from "axios";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum LoginStatus {
  IDLE = "idle",
  LOADING = "loading",
}

interface LoginStore {
  form: {
    email: string;
    password: string;
  };
  errorMessage?: string;
  status: LoginStatus;
  token?: string;
  refreshToken?: string;
  accessTokenExpiryDate?: string;
  refreshTokenExpiryDate?: string;
  setFieldValue: (key: string, value: string) => void;
  setFormField: (key: string, value: string) => void;
  onLogin: (email: string, password: string) => void;
  reset: () => void;
}

export const useLoginStore = create<LoginStore>()(
  immer((set) => ({
    form: {
      email: "",
      password: "",
    },
    status: LoginStatus.IDLE,
    setFieldValue: (key, value) => {
      set((state) => {
        (state.form as any)[key] = value;
      });
    },
    setFormField: (key, value) => {
      set((state) => {
        (state.form as any)[key] = value;
      });
    },
    onLogin: async (email, password) => {
      try {
        set((state) => {
          state.status = LoginStatus.LOADING;
        });
        const response = await AxiosClient.post("/auth/login", {
          email,
          password,
        });

        set((state) => {
          state.status = LoginStatus.IDLE;
          state.token = response.data.data.accessToken;
          state.refreshToken = response.data.data.refreshToken;
          state.accessTokenExpiryDate =
            response.data.data.accessTokenExpiryDate;
          state.refreshTokenExpiryDate =
            response.data.data.refreshTokenExpiryDate;
        });
      } catch (error) {
        console.error(error);
        if (axios.isAxiosError(error)) {
          set((state) => {
            state.status = LoginStatus.IDLE;
            state.errorMessage = error.response?.data.data.message;
          });
          return;
        }

        set((state) => {
          state.status = LoginStatus.IDLE;
          state.errorMessage = error as string | undefined;
        });
      }
    },
    reset: () => {
      set((state) => {
        state.form.email = "";
        state.form.password = "";
        state.status = LoginStatus.IDLE;
        state.errorMessage = undefined;
        state.token = undefined;
        state.refreshToken = undefined;
        state.accessTokenExpiryDate = undefined;
        state.refreshTokenExpiryDate = undefined;
      });
    },
  })),
);
