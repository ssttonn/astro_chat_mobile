import React from "react";
import AuthMainLayout from "@/components/auth/AuthMainLayout";
import LottieView from "lottie-react-native";
import Assets from "@/constants/Assets";
import { Text } from "react-native";
import MainTextField from "@/components/common/MainTextField";
import MainButton from "@/components/common/MainButton";
import { router } from "expo-router";
import CircularIcon from "@/components/common/CircularIcon";
import { AntDesign, Entypo } from "@expo/vector-icons";

const SubmitRegisterInfoScreen = () => {
  return (
    <AuthMainLayout
      onBackPress={() => {
        router.back();
      }}
    >
      <LottieView
        style={{ width: "100%", aspectRatio: 1.1, alignSelf: "center" }}
        source={Assets.animations.submitInfo}
        autoPlay
        loop
      />
      <Text className="text-5xl font-KelsonExtraBold">Almost there</Text>
      <Text className="text-xl font-KelsonMedium">
        Please enter your details to complete the registration
      </Text>
      <MainTextField
        label="Username"
        keyboardType="default"
        prefix={
          <CircularIcon>
            <AntDesign name="user" size={24} color="#247cff" />
          </CircularIcon>
        }
      />
      <MainTextField
        label="Password"
        keyboardType="default"
        prefix={
          <CircularIcon>
            <Entypo name="lock" size={24} color="#247cff" />
          </CircularIcon>
        }
      />
      <MainTextField
        label="Confirm Password"
        keyboardType="default"
        prefix={
          <CircularIcon>
            <Entypo name="lock" size={24} color="#247cff" />
          </CircularIcon>
        }
      />
      <MainButton
        title="Create account now"
        onPress={() => {
          router.replace("/home");
        }}
      />
    </AuthMainLayout>
  );
};

export default SubmitRegisterInfoScreen;
