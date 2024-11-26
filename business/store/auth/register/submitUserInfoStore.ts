import { create } from "zustand";
import { RegisterStatus } from "./registerStore";
import { immer } from "zustand/middleware/immer";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";

interface SubmitUserInfoState {
  form: {
    username: string;
    password: string;
    confirmPassword: string;
  };
  status: RegisterStatus;
  errorMessage?: string;
  setError: (errorMessage?: string) => void;
  setFormField: (key: string, value: string) => void;
  onSubmitUserInfo: (
    userInfo: { username: string; password: string },
    infoToken: string,
  ) => Promise<
    | {
        accessToken: string;
        refreshToken: string;
        accessTokenExpiryDate: string;
        refreshTokenExpiryDate: string;
      }
    | undefined
  >;
  reset: () => void;
}

export const useSubmitUserInfoStore = create<SubmitUserInfoState>()(
  immer((set) => {
    return {
      form: {
        username: "",
        password: "",
        confirmPassword: "",
      },
      status: RegisterStatus.IDLE,
      setFormField: (key: any, value: string) => {
        set((state) => {
          state.form[key as keyof SubmitUserInfoState["form"]] = value;
        });
      },
      setError: (errorMessage) => {
        set((state) => {
          state.errorMessage = errorMessage;
        });
      },
      onSubmitUserInfo: async (
        userInfo,
        infoToken,
      ): Promise<
        | {
            accessToken: string;
            refreshToken: string;
            accessTokenExpiryDate: string;
            refreshTokenExpiryDate: string;
          }
        | undefined
      > => {
        try {
          set((state) => {
            state.status = RegisterStatus.LOADING;
          });
          const responseData = await AxiosClient.post(
            APIRoutes.submitRegisterInfo,
            {
              username: userInfo.username,
              password: userInfo.password,
            },
            {
              headers: {
                "x-info-token": infoToken,
              },
            },
          );

          set((state) => {
            state.status = RegisterStatus.IDLE;
          });

          return responseData.data;
        } catch (error) {
          set((state) => {
            state.status = RegisterStatus.IDLE;
            state.errorMessage = error as string | undefined;
          });
        }
      },
      reset: () => {
        set((state) => {
          state.form = {
            username: "",
            password: "",
            confirmPassword: "",
          };
          state.status = RegisterStatus.IDLE;
          state.errorMessage = undefined;
        });
      },
    };
  }),
);
