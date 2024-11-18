import { View, Text } from "react-native";
import React from "react";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import LottieView from "lottie-react-native";
import Assets from "@/constants/Assets";
import { OtpInput } from "react-native-otp-entry";
import { router } from "expo-router";

const VerifyRegisterOTPScreen = () => {
  return (
    <AuthMainLayout
      onBackPress={() => {
        router.back();
      }}
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
        textInputProps={{
          accessibilityLabel: "One-Time Password",
        }}
        onFilled={(code) => {
          //TODO: Implement OTP verification
          router.replace("/submit-register-info");
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
        <Text className="text-primary font-KelsonBold">Resend OTP</Text>
      </View>
    </AuthMainLayout>
  );
};

export default VerifyRegisterOTPScreen;
