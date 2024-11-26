import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useRef } from "react";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import LottieView from "lottie-react-native";
import Assets from "@/constants/assets";
import { OtpInput } from "react-native-otp-entry";
import { router } from "expo-router";

import LoadingView from "@/components/common/LoadingView";
import { useVerifyRegisterOtpStore } from "@/business/store/auth/register/verifyRegisterOtpStore";
import useRegister from "@/hooks/useRegister";
import {
  RegisterStatus,
  useRegisterStore,
} from "@/business/store/auth/register/registerStore";

import ScreenRoutes from "@/constants/screenRoutes";
import useRegisterToken from "@/hooks/useRegisterToken";
import Toast from "react-native-toast-message";

const VerifyRegisterOTPScreen = () => {
  const { status, errorMessage, setError, reset, onVerifyOTP, onResendOTP } =
    useVerifyRegisterOtpStore();

  const {
    form: { email },
  } = useRegisterStore();

  const otpInputRef = useRef<any>(null);

  useRegister(errorMessage, setError, reset);

  const { getRegisterToken, saveRegisterToken } = useRegisterToken();

  const onOTPFilled = useCallback(
    async (code: string) => {
      try {
        otpInputRef.current?.clear();
        let registerToken = await getRegisterToken();

        let result = await onVerifyOTP(code, registerToken, email);

        if (!result) {
          return;
        }

        const { submitInfoToken, submitInfoExpires } = result;

        await saveRegisterToken(submitInfoToken, submitInfoExpires);

        Toast.show({
          type: "success",
          text2: "OTP has been verified",
        });

        router.replace(ScreenRoutes.submitRegisterInfo);
      } catch (error) {
        setError(error as string | undefined);
      }
    },
    [email, onVerifyOTP, getRegisterToken, saveRegisterToken, setError],
  );

  const onResendOTPClicked = useCallback(async () => {
    otpInputRef.current?.clear();
    let registerToken = await getRegisterToken();

    let result = await onResendOTP(email, registerToken);

    if (!result) {
      return;
    }

    const { otpToken, otpExpires } = result;

    await saveRegisterToken(otpToken, otpExpires);

    otpInputRef.current?.focus();

    Toast.show({
      type: "success",
      text2: "OTP has been sent to your email",
    });
  }, [getRegisterToken, saveRegisterToken, onResendOTP, email]);

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
