import AuthMainLayout from "@/components/auth/AuthMainLayout";
import OAuthenticationMethods, {
  AuthMethod,
} from "@/components/auth/OAuthenticationMethods";
import CircularIcon from "@/components/common/CircularIcon";
import MainButton from "@/components/common/MainButton";
import MainTextField from "@/components/common/MainTextField";
import Assets from "@/constants/Assets";
import { Entypo } from "@expo/vector-icons";
import { router } from "expo-router";
import LottieView from "lottie-react-native";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const RegisterScreen = () => {
  return (
    <AuthMainLayout onBackPress={router.back}>
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
      <MainTextField
        label="Email"
        keyboardType="email-address"
        prefix={
          <CircularIcon>
            <Entypo name="email" size={24} color="#247cff" />
          </CircularIcon>
        }
        onChangeText={(value) => {
          console.log(value);
          // TODO: Do something with the email
        }}
      />
      <MainButton
        title="Let go"
        onPress={(e) => {
          router.push("/verify-register-otp");
        }}
      />
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
    </AuthMainLayout>
  );
};

export default RegisterScreen;
