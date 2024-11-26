import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";
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
  setError: (error: string | undefined) => void;
  setFormField: (key: string, value: string) => void;
  onLogin: (
    email: string,
    password: string,
  ) => Promise<{
    accessToken: string;
    refreshToken: string;
    accessTokenExpiryDate: string;
    refreshTokenExpiryDate: string;
  }>;
  reset: () => void;
}

export const useLoginStore = create<LoginStore>()(
  immer((set) => ({
    form: {
      email: "",
      password: "",
    },
    status: LoginStatus.IDLE,
    setError: (error) => {
      set((state) => {
        state.errorMessage = error;
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
        const responseData = await AxiosClient.post(APIRoutes.login, {
          email,
          password,
        });

        set((state) => {
          state.status = LoginStatus.IDLE;
        });

        return responseData.data;
      } catch (error) {
        set((state) => {
          state.status = LoginStatus.IDLE;
          state.errorMessage = error as string | undefined;
        });

        throw error;
      }
    },
    reset: () => {
      set((state) => {
        state.form.email = "";
        state.form.password = "";
        state.status = LoginStatus.IDLE;
        state.errorMessage = undefined;
      });
    },
  })),
);
