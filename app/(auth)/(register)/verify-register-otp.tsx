import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useRef } from "react";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import LottieView from "lottie-react-native";
import Assets from "@/constants/Assets";
import { OtpInput } from "react-native-otp-entry";
import { router } from "expo-router";

import LoadingView from "@/components/common/LoadingView";
import { useVerifyRegisterOtpStore } from "@/business/store/auth/register/verifyRegisterOtpStore";
import useRegister from "@/hooks/useRegister";
import {
  RegisterStatus,
  useRegisterStore,
} from "@/business/store/auth/register/registerStore";

import * as SecureStore from "expo-secure-store";
import DBKey from "@/constants/DBKey";
import ScreenRoutes from "@/constants/ScreenRoutes";
import useRegisterToken from "@/hooks/useRegisterToken";

const VerifyRegisterOTPScreen = () => {
  const { status, errorMessage, setError, reset, onVerifyOTP, onResendOTP } =
    useVerifyRegisterOtpStore();

  const {
    form: { email },
  } = useRegisterStore();

  const otpInputRef = useRef<any>(null);

  useRegister(errorMessage, setError, reset);

  const { getRegisterToken } = useRegisterToken();

  const onOTPFilled = useCallback(
    async (code: string) => {
      otpInputRef.current?.clear();
      try {
        let registerToken = await getRegisterToken();

        let result = await onVerifyOTP(code, registerToken, email);

        if (!result) {
          setError("Something went wrong. Please try again.");
          return;
        }

        // const { otpToken, otpExpires } = result;

        // TODO: Handle OTP token and expiry date

        router.push(ScreenRoutes.submitRegisterInfo);
      } catch (error) {
        if (typeof error === "string") {
          setError(error || "Something went wrong. Please try again.");
          return;
        }
        setError("Something went wrong. Please try again.");
      }
    },
    [email, onVerifyOTP, setError, getRegisterToken],
  );

  const onResendOTPClicked = useCallback(async () => {
    otpInputRef.current?.clear();

    try {
      let registerToken = await getRegisterToken();

      let result = await onResendOTP(registerToken, email);
    } catch (error) {
      if (typeof error === "string") {
        setError(error || "Something went wrong. Please try again.");
        return;
      }
      setError("Something went wrong. Please try again.");
    }
  }, [getRegisterToken]);

  return (
    <>
      <LoadingView isLoading={status === RegisterStatus.LOADING} />
      <AuthMainLayout
        onBackPress={useCallback(() => {
          router.back();
        }, [])}
      >
        <LottieView
          style={{ width: "100%", aspectRatio: 1.2, alignSelf: "center" }}
          source={Assets.animations.verifyOTP}
          autoPlay
          loop
        />
        <Text className="text-5xl font-KelsonExtraBold">Verify OTP</Text>
        <Text className="text-xl font-KelsonMedium">
          Please enter the OTP sent to your email
        </Text>
        <OtpInput
          ref={otpInputRef}
          textInputProps={{
            accessibilityLabel: "One-Time Password",
          }}
          onFilled={onOTPFilled}
          theme={{
            filledPinCodeContainerStyle: {
              backgroundColor: "#f5f6f7",
              borderWidth: 2,
              borderColor: "transparent",
            },
            focusedPinCodeContainerStyle: {
              borderColor: "#247cff",
              borderWidth: 2,
            },
            pinCodeTextStyle: {
              color: "#247cff",
              fontSize: 30,
              fontFamily: "KelsonExtraBold",
            },
          }}
          numberOfDigits={6}
        />
        <View className="flex flex-row gap-1 self-center mt-2">
          <Text className="text-center text-black font-KelsonBold">
            Didn't receive the OTP?
          </Text>
          <TouchableOpacity onPress={onResendOTPClicked}>
            <Text className="text-primary font-KelsonBold">Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </AuthMainLayout>
    </>
  );
};

export default VerifyRegisterOTPScreen;
