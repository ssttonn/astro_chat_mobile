import AuthMainLayout from "@/components/auth/AuthMainLayout";
import CircularIcon from "@/components/common/CircularIcon";
import MainButton from "@/components/common/MainButton";
import MainTextField from "@/components/common/MainTextField";
import Assets from "@/constants/assets";
import ScreenRoutes from "@/constants/screen_routes";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Text } from "react-native";

const ForgotPasswordScreen = () => {
  return (
    <AuthMainLayout onBackPress={router.back}>
      <LottieView
        style={{ width: "100%", aspectRatio: 1.3, alignSelf: "center" }}
        source={Assets.animations.forgotPassword}
        autoPlay
        loop
      />
      <Text className="text-5xl font-KelsonExtraBold mt-2">
        Forgot Password
      </Text>
      <Text className="text-xl font-KelsonMedium">
        Please enter your email to reset your password
      </Text>
      <MainTextField
        label="Email"
        type="email"
        keyboardType="email-address"
        prefix={
          <CircularIcon>
            <Entypo name="email" size={24} color="#247cff" />
          </CircularIcon>
        }
        onChangeText={(value) => {
          console.log(value);
        }}
      />

      <MainButton
        title="Reset Password"
        onPress={(e) => {
          router.push(ScreenRoutes.resetPassword);
        }}
      />
    </AuthMainLayout>
  );
};

export default ForgotPasswordScreen;
