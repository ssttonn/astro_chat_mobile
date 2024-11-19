import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/APIRoutes";
import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export enum RegisterStatus {
  IDLE = "idle",
  LOADING = "loading",
}

export enum RegisterStep {
  registerEmail = "registerEmail",
  verifyOTP = "verifyOTP",
  submitUserInfo = "submitUserInfo",
}

interface RegisterStore {
  form: {
    email: string;
    username: string;
    password: string;
    confirmPassword: string;
  };
  step: RegisterStep;
  token?: string;
  tokenExpiryDate?: string;
  tokenRequestCooldown?: number;
  errorMessage?: string;
  status: RegisterStatus;
  setErrorMessage: (errorMessage?: string) => void;
  setStep: (step: RegisterStep) => void;
  setFormField: (key: string, value: string) => void;
  onRegister: (email: string) => void;
  onResendOTP: (email: string, otpToken: string) => void;
  onVerifyOTP: (otp: string, otpToken: string, email: string) => void;
  onSubmitUserInfo: (
    userInfo: { username: string; password: string },
    infoToken: string,
  ) => void;
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
      step: RegisterStep.registerEmail,
      status: RegisterStatus.IDLE,
      setErrorMessage: (errorMessage) => {
        set((state) => {
          state.errorMessage = errorMessage;
        });
      },
      setStep: (step) => {
        set((state) => {
          state.step = step;
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
            const { otpToken, otpExpires, otpRequestCooldown } =
              responseData.data;
            state.token = otpToken;
            state.tokenExpiryDate = otpExpires;
            state.tokenRequestCooldown = otpRequestCooldown;
            state.step = RegisterStep.verifyOTP;
          });
        } catch (error) {
          set((state) => {
            state.status = RegisterStatus.IDLE;
            state.errorMessage = error as string | undefined;
          });
        }
      },
      onResendOTP: async (email, otpToken) => {
        try {
          set((state) => {
            state.status = RegisterStatus.LOADING;
          });
          const responseData = await AxiosClient.post(
            APIRoutes.resendRegisterOtp,
            {
              email: email,
            },
            {
              headers: {
                "x-otp-token": otpToken,
              },
            },
          );
          set((state) => {
            state.status = RegisterStatus.IDLE;
            const { otpToken, otpExpires, otpRequestCooldown } =
              responseData.data;
            state.token = otpToken;
            state.tokenExpiryDate = otpExpires;
            state.tokenRequestCooldown = otpRequestCooldown;
          });
        } catch (error) {
          set((state) => {
            state.status = RegisterStatus.IDLE;
            state.errorMessage = error as string | undefined;
          });
        }
      },
      onVerifyOTP: async (otp, otpToken, email) => {
        try {
          set((state) => {
            state.status = RegisterStatus.LOADING;
          });
          const responseData = await AxiosClient.post(
            APIRoutes.verifyRegisterOtp,
            {
              email,
              otp,
            },
            {
              headers: {
                "x-otp-token": otpToken,
              },
            },
          );
          set((state) => {
            state.status = RegisterStatus.IDLE;
            const { submitInfoToken, submitInfoExpires } = responseData.data;
            state.token = submitInfoToken;
            state.tokenExpiryDate = submitInfoExpires;
            state.step = RegisterStep.submitUserInfo;
          });
        } catch (error) {
          set((state) => {
            state.status = RegisterStatus.IDLE;
            state.errorMessage = error as string | undefined;
          });
        }
      },
      onSubmitUserInfo: async (userInfo, infoToken) => {
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

          // TODO: Handle this response
          set((state) => {
            state.status = RegisterStatus.IDLE;
          });
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
          state.status = RegisterStatus.IDLE;
          state.errorMessage = undefined;
        });
      },
    };
  }),
);
