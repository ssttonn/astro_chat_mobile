import { View, Text, TouchableOpacity } from "react-native";
import React, { useCallback, useEffect, useRef } from "react";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import LottieView from "lottie-react-native";
import Assets from "@/constants/Assets";
import { OtpInput } from "react-native-otp-entry";
import { router } from "expo-router";
import {
  RegisterStatus,
  RegisterStep,
  useRegisterStore,
} from "@/business/store/auth/registerStore";
import LoadingView from "@/components/common/LoadingView";

const VerifyRegisterOTPScreen = () => {
  const {
    form: { email },
    token,
    onVerifyOTP,
    onResendOTP,
    status,
    step,
    setStep,
  } = useRegisterStore();

  const otpInputRef = useRef<any>(null);

  useEffect(() => {
    if (step === RegisterStep.submitUserInfo) {
      router.replace("/submit-register-info");
    }
  }, [step]);

  return (
    <>
      <LoadingView isLoading={status === RegisterStatus.LOADING} />
      <AuthMainLayout
        onBackPress={useCallback(() => {
          setStep(RegisterStep.registerEmail);
          router.back();
        }, [setStep])}
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
          onFilled={(code) => {
            otpInputRef.current?.clear();
            if (token) onVerifyOTP(code, token, email);
          }}
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
          <TouchableOpacity
            onPress={() => {
              otpInputRef.current?.clear();
              if (!token) return;
              onResendOTP(email, token);
            }}
          >
            <Text className="text-primary font-KelsonBold">Resend OTP</Text>
          </TouchableOpacity>
        </View>
      </AuthMainLayout>
    </>
  );
};

export default VerifyRegisterOTPScreen;
