import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/api_routes";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum RegisterStatus {
  IDLE = "idle",
  LOADING = "loading",
}

interface RegisterStore {
  form: {
    email: string;
  };
  errorMessage?: string;
  status: RegisterStatus;
  setErrorMessage: (errorMessage?: string) => void;
  setFormField: (key: string, value: string) => void;
  onRegister: (email: string) => Promise<
    | {
        otpToken: string;
        otpExpires: string;
        otpRequestCooldown: number;
      }
    | undefined
  >;
  reset: () => void;
}

export const useRegisterStore = create<RegisterStore>()(
  immer((set) => {
    return {
      form: {
        email: "",
        username: "",
        password: "",
        confirmPassword: "",
      },
      status: RegisterStatus.IDLE,
      setErrorMessage: (errorMessage) => {
        set((state) => {
          state.errorMessage = errorMessage;
        });
      },
      setFormField: (key: any, value: string) => {
        set((state) => {
          state.form[key as keyof RegisterStore["form"]] = value;
        });
      },
      onRegister: async (email) => {
        try {
          set((state) => {
            state.status = RegisterStatus.LOADING;
          });
          const responseData = await AxiosClient.post(APIRoutes.register, {
            email,
          });
          set((state) => {
            state.status = RegisterStatus.IDLE;
          });
          const { otpToken, otpExpires, otpRequestCooldown } =
            responseData.data;

          return { otpToken, otpExpires, otpRequestCooldown };
        } catch (error) {
          set((state) => {
            state.status = RegisterStatus.IDLE;
            state.errorMessage = error as string | undefined;
          });
        }
      },
      reset: () => {
        set((state) => {
          state.form.email = "";
          state.errorMessage = undefined;
          state.status = RegisterStatus.IDLE;
        });
      },
    };
  }),
);
