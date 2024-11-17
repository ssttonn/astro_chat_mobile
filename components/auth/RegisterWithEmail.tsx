import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import LottieView from "lottie-react-native";
import MainTextField from "../common/MainTextField";
import MainButton from "../common/MainButton";
import OAuthenticationMethods, { AuthMethod } from "./OAuthenticationMethod";
import { router } from "expo-router";
import Assets from "@/constants/assets";

interface RegisterWithEmailProps {
  onPress?: (e: any) => void;
}

const RegisterWithEmail = ({ onPress }: RegisterWithEmailProps) => {
  return (
    <View className="flex flex-1 h-[80vh] justify-center items-stretch w-[80%] self-center gap-2">
      <LottieView
        style={{ width: "100%", aspectRatio: 1.1, alignSelf: "center" }}
        source={Assets.animations.register}
        autoPlay
        loop
      />
      <Text className="text-5xl font-KelsonExtraBold">Register</Text>
      <Text className="text-xl font-KelsonMedium">
        Please enter your email to continue
      </Text>
      <MainTextField label="Email" />
      <MainButton title="Let go" onPress={onPress} />
      <OAuthenticationMethods
        methods={[AuthMethod.Google, AuthMethod.Facebook]}
      />
      <View className="flex flex-row gap-1 self-center mt-2">
        <Text className="text-center text-black font-KelsonBold">
          Already have an account?
        </Text>
        <TouchableOpacity onPress={router.back}>
          <Text className="text-primary font-KelsonBold">Login</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default RegisterWithEmail;
