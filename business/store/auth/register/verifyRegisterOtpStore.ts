import { immer } from "zustand/middleware/immer";
import { RegisterStatus } from "./registerStore";
import { create } from "zustand";
import AxiosClient from "@/business/data/services/axiosClient";
import { APIRoutes } from "@/constants/apiRoutes";

interface VerifyRegisterOtpState {
  status: RegisterStatus;
  errorMessage?: string;
  otpRequestCooldown?: number;
  setStatus: (status: RegisterStatus) => void;
  setError: (errorMessage?: string) => void;
  onVerifyOTP: (
    otp: string,
    otpToken: string,
    email: string,
  ) => Promise<
    | {
        submitInfoToken: string;
        submitInfoExpires: string;
      }
    | undefined
  >;
  onResendOTP: (
    email: string,
    otpToken: string,
  ) => Promise<
    | {
        otpToken: string;
        otpExpires: string;
        otpRequestCooldown: number;
      }
    | undefined
  >;
  reset: () => void;
}

export const useVerifyRegisterOtpStore = create<VerifyRegisterOtpState>()(
  immer((set) => {
    return {
      status: RegisterStatus.IDLE,
      setStatus: (status: RegisterStatus) => {
        set((state) => {
          state.status = status;
        });
      },
      setError: (errorMessage) => {
        set((state) => {
          state.errorMessage = errorMessage;
        });
      },
      onVerifyOTP: async (otp: string, otpToken: string, email: string) => {
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
          });
          const { submitInfoToken, submitInfoExpires } = responseData.data;
          return { submitInfoToken, submitInfoExpires };
        } catch (error) {
          set((state) => {
            state.status = RegisterStatus.IDLE;
            state.errorMessage = error as string | undefined;
          });
        }
      },
      onResendOTP: async (email: string, otpToken: string) => {
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
            state.otpRequestCooldown = responseData.data.otpRequestCooldown;
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
          state.status = RegisterStatus.IDLE;
          state.errorMessage = undefined;
          state.otpRequestCooldown = undefined;
        });
      },
    };
  }),
);
